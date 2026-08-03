"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "~/components/primitives/badge"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "~/components/compositions/command"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "~/lib/utils"

export interface Option {
    label: string
    value: string
    disable?: boolean
}

export interface MultipleSelectorProps {
    defaultOptions?: Option[]
    placeholder?: string
    emptyIndicator?: React.ReactNode
    value?: Option[]
    onChange?: (value: Option[]) => void
    disabled?: boolean
    className?: string
}

export default function MultipleSelector({
    defaultOptions = [],
    placeholder = "Select...",
    emptyIndicator = <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>,
    value,
    onChange,
    disabled = false,
    className,
}: MultipleSelectorProps) {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [open, setOpen] = React.useState(false)
    const [internalSelected, setInternalSelected] = React.useState<Option[]>(value || [])
    const [inputValue, setInputValue] = React.useState("")

    const selected = value !== undefined ? value : internalSelected

    const handleUnselect = React.useCallback(
        (option: Option) => {
            const newSelected = selected.filter((s) => s.value !== option.value)
            if (value === undefined) setInternalSelected(newSelected)
            onChange?.(newSelected)
        },
        [onChange, selected, value]
    )

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "" && selected.length > 0) {
                        const lastSelect = selected[selected.length - 1]
                        if (!lastSelect.disable) {
                            handleUnselect(lastSelect)
                        }
                    }
                }
                if (e.key === "Escape") {
                    input.blur()
                }
            }
        },
        [handleUnselect, selected]
    )

    const selectables = defaultOptions.filter((option) => !selected.some((s) => s.value === option.value))

    return (
        <Command onKeyDown={handleKeyDown} className={cn("overflow-visible bg-transparent", className)}>
            <div
                className={cn(
                    "group rounded-md border border-input px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => {
                    if (!disabled) {
                        inputRef.current?.focus()
                        setOpen(true)
                    }
                }}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.map((option) => {
                        return (
                            <Badge key={option.value} variant="default" className="data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground group">
                                {option.label}
                                <X
                                    className="cursor-pointer opacity-70 hover:opacity-100 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
                                    onClick={(e) => {
                                        if (disabled || option.disable) return;
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleUnselect(option)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(option)
                                        }
                                    }}
                                    tabIndex={disabled || option.disable ? -1 : 0}
                                />
                            </Badge>
                        )
                    })}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={selected.length === 0 ? placeholder : undefined}
                        disabled={disabled}
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open ? (
                    <div className="absolute top-0 z-10 w-full flex flex-col rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden">
                        <CommandList className="w-full">
                            <CommandEmpty>{emptyIndicator}</CommandEmpty>
                            <CommandGroup className="h-full overflow-auto max-h-[200px]">
                                {selectables.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value} // The value is used completely automatically by cmdk for filtering!
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onSelect={(selectedValue) => {
                                                setInputValue("")
                                                const optionToAdd = defaultOptions.find((o) => o.value.toLowerCase() === selectedValue)
                                                if (optionToAdd) {
                                                    const newSelected = [...selected, optionToAdd]
                                                    if (value === undefined) setInternalSelected(newSelected)
                                                    onChange?.(newSelected)
                                                }
                                            }}
                                            disabled={option.disable}
                                            className={cn("cursor-pointer", option.disable && "cursor-not-allowed opacity-50")}
                                        >
                                            {option.label}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </div>
                ) : null}
            </div>
        </Command>
    )
}
