"use client"

import * as React from "react"
import { Check, ChevronDown, MoreHorizontal, Plus, X } from "lucide-react"
import { cn } from "~/lib/utils"

import { Badge } from "~/components/primitives/badge"
import { Button } from "~/components/primitives/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/compositions/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/primitives/popover"
import { Sortable, SortableItem, SortableDragHandle } from "~/components/compositions/sortable"

export type TagColor =
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"

export interface Tag {
    id: string
    label: string
    color: TagColor
}

const COLOR_OPTIONS: { label: string; value: TagColor; cssClass: string }[] = [
    { label: "Predeterminado", value: "default", cssClass: "bg-muted text-foreground" },
    { label: "Gris", value: "gray", cssClass: "bg-gray-500/15 text-gray-700 dark:text-gray-300" },
    { label: "Marrón", value: "brown", cssClass: "bg-stone-500/15 text-stone-700 dark:text-stone-300" },
    { label: "Naranja", value: "orange", cssClass: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
    { label: "Amarillo", value: "yellow", cssClass: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300" },
    { label: "Verde", value: "green", cssClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { label: "Azul", value: "blue", cssClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
    { label: "Morado", value: "purple", cssClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300" },
    { label: "Rosa", value: "pink", cssClass: "bg-pink-500/15 text-pink-700 dark:text-pink-300" },
    { label: "Rojo", value: "red", cssClass: "bg-red-500/15 text-red-700 dark:text-red-300" },
]

interface AdvancedMultiSelectProps {
    value: Tag[]
    onChange: (tags: Tag[]) => void
    options?: Tag[] // Pre-existing options to pick from
    placeholder?: string
    className?: string
    variant?: "default" | "table"
}

export function AdvancedMultiSelect({
    value = [],
    onChange,
    options = [],
    placeholder = "Selecciona o crea una opción...",
    className,
    variant = "default",
}: AdvancedMultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    // Selected tags are passed via `value` and `onChange`
    // We also keep track of known options (passed + created) so the dropdown can list them
    const [knownOptions, setKnownOptions] = React.useState<Tag[]>(options)

    // Tag Action Popover specific state
    const [activeTagActionId, setActiveTagActionId] = React.useState<string | null>(null)
    const [tempLabel, setTempLabel] = React.useState("")

    const handleCreate = (newLabel: string) => {
        if (!newLabel.trim()) return
        const newTag: Tag = {
            id: crypto.randomUUID(), // simple unique id
            label: newLabel.trim(),
            color: "default",
        }
        setKnownOptions((prev) => [...prev, newTag])
        onChange([...value, newTag])
        setInputValue("")
    }

    const handleSelect = (tagToSelect: Tag) => {
        if (value.some((t) => t.id === tagToSelect.id)) {
            // Unselect if already selected
            onChange(value.filter((t) => t.id !== tagToSelect.id))
        } else {
            onChange([...value, tagToSelect])
        }
        setInputValue("")
        // optionally keep dropdown open or close it
    }

    const handleRemove = (idToRemove: string) => {
        onChange(value.filter((t) => t.id !== idToRemove))
    }

    const handleUpdateColor = (id: string, newColor: TagColor) => {
        onChange(
            value.map((t) => (t.id === id ? { ...t, color: newColor } : t))
        )
        // Also update known options so it remembers the color if deselected and reselected
        setKnownOptions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, color: newColor } : t))
        )
    }

    const handleUpdateLabel = (id: string, newLabel: string) => {
        onChange(
            value.map((t) => (t.id === id ? { ...t, label: newLabel } : t))
        )
        setKnownOptions((prev) =>
            prev.map((t) => (t.id === id ? { ...t, label: newLabel } : t))
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue) {
            e.preventDefault()
            const existing = knownOptions.find(
                (o) => o.label.toLowerCase() === inputValue.toLowerCase()
            )
            if (existing) {
                handleSelect(existing)
            } else {
                handleCreate(inputValue)
            }
        }
    }

    // Filter out options that are not yet selected
    const unselectedOptions = knownOptions.filter(
        (o) => !value.some((v) => v.id === o.id)
    )

    const filteredUnselected = React.useMemo(() => {
        return unselectedOptions.filter((o) =>
            o.label.toLowerCase().includes(inputValue.toLowerCase())
        )
    }, [unselectedOptions, inputValue])

    // Helper to get color class
    const getColorClass = (colorName: TagColor) => {
        return COLOR_OPTIONS.find((c) => c.value === colorName)?.cssClass || COLOR_OPTIONS[0].cssClass
    }

    // --- Render Tag Action Popover ---
    const renderTagActionPopover = (tag: Tag) => {
        const isOpen = activeTagActionId === tag.id
        return (
            <Popover
                open={isOpen}
                onOpenChange={(open) => {
                    setActiveTagActionId(open ? tag.id : null)
                    if (open) setTempLabel(tag.label)
                }}
            >
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="text-muted-foreground opacity-50 hover:opacity-100 focus:opacity-100 ml-1 p-1 rounded-sm ring-offset-background transition-opacity hover:bg-accent"
                        onPointerDown={(e) => {
                            // Prevent sortable drag from initiating when clicking the dots
                            e.stopPropagation()
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Opciones de etiqueta</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    align="start"
                    className="w-56 p-2 custom-popover-stop"
                    onPointerDownOutside={(e) => {
                        // Prevent the main combobox popover from closing when interacting outside this specific popover
                        // if the click isn't inside the main combobox
                        const target = e.target as HTMLElement
                        if (target.closest('.custom-popover-stop')) return
                    }}
                >
                    <div className="flex flex-col gap-3">
                        {/* Edit Name */}
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={tempLabel}
                                onChange={(e) => setTempLabel(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUpdateLabel(tag.id, tempLabel)
                                        setActiveTagActionId(null)
                                    }
                                }}
                                onBlur={() => handleUpdateLabel(tag.id, tempLabel)}
                            />
                        </div>

                        {/* Delete Action */}
                        <button
                            type="button"
                            className="flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-muted rounded-md transition-colors w-full text-left"
                            onClick={() => {
                                handleRemove(tag.id)
                                setActiveTagActionId(null)
                            }}
                        >
                            <X className="h-4 w-4" />
                            Eliminar
                        </button>

                        <div className="h-px bg-border my-1" />

                        {/* Color Options */}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-muted-foreground px-2">Colores</span>
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleUpdateColor(tag.id, color.value)}
                                    className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-muted rounded-md transition-colors w-full text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-4 w-4 rounded-sm border border-black/10 dark:border-white/10", color.cssClass)} />
                                        <span>{color.label}</span>
                                    </div>
                                    {tag.color === color.value && <Check className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

    if (variant === "table") {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn("h-8 w-full justify-start font-normal px-2", className)}>
                        {value.length > 0 ? (
                            <div className="flex items-center gap-1 overflow-hidden">
                                {value.slice(0, 2).map(tag => (
                                    <Badge key={tag.id} variant="secondary" className={cn("h-5 px-1.5 font-normal rounded-sm text-xs truncate max-w-[80px]", getColorClass(tag.color))}>
                                        {tag.label}
                                    </Badge>
                                ))}
                                {value.length > 2 && (
                                    <span className="text-xs text-muted-foreground">+{value.length - 2}</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">Vacío</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Busca o crea una opción..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={handleKeyDown}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {inputValue ? (
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted w-full text-left rounded-sm transition-colors"
                                        onClick={() => handleCreate(inputValue)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear <span className="font-semibold px-1 bg-muted rounded-sm">"{inputValue}"</span>
                                    </button>
                                ) : (
                                    "No hay opciones disponibles."
                                )}
                            </CommandEmpty>
                            <CommandGroup heading="Selecciona una opción">
                                <div key={filteredUnselected.map((o) => o.id).join("-")}>
                                    <Sortable
                                        items={filteredUnselected}
                                        onReorder={(newOrder) => {
                                            const newOrderIds = new Set(newOrder.map(t => t.id));
                                            const otherOptions = knownOptions.filter(t => !newOrderIds.has(t.id));
                                            setKnownOptions([...newOrder, ...otherOptions]);
                                        }}
                                        strategy="vertical"
                                        className="w-full gap-0"
                                    >
                                        {filteredUnselected.map((option) => (
                                            <SortableItem key={option.id} id={option.id} className="w-full">
                                                <CommandItem
                                                    onSelect={() => handleSelect(option)}
                                                    className="flex items-center gap-2 cursor-pointer w-full group/item"
                                                >
                                                    <SortableDragHandle variant="vertical" className="opacity-0 group-hover/item:opacity-50 hover:!opacity-100 p-0 mr-1" />
                                                    <div className={cn("px-2 py-0.5 rounded-sm text-xs font-medium", getColorClass(option.color))}>
                                                        {option.label}
                                                    </div>
                                                    <div className="ml-auto" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                                                        {renderTagActionPopover(option)}
                                                    </div>
                                                </CommandItem>
                                            </SortableItem>
                                        ))}
                                    </Sortable>
                                </div>
                                {inputValue && !knownOptions.some(o => o.label.toLowerCase() === inputValue.toLowerCase()) && (
                                    <CommandItem
                                        onSelect={() => handleCreate(inputValue)}
                                        className="flex items-center gap-2 cursor-pointer border-t mt-1 pt-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear <span className="font-semibold px-1 bg-background rounded-sm">"{inputValue}"</span>
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }

    // Default variant
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-text",
                        className
                    )}
                    onClick={() => setOpen(true)}
                >
                    <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                        {value.length > 0 ? (
                            <Sortable items={value} onReorder={onChange} strategy="grid" className="gap-1.5">
                                {value.map((tag) => (
                                    <SortableItem key={tag.id} id={tag.id}>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "h-6 px-2 font-normal rounded-sm flex items-center gap-1 group relative",
                                                getColorClass(tag.color)
                                            )}
                                        >
                                            <SortableDragHandle variant="vertical" withIcon={false} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing w-[calc(100%-24px)] rounded-sm" />
                                            <span className="relative z-10 pointer-events-none">{tag.label}</span>

                                            <div className="relative z-10 flex items-center">
                                                <button
                                                    type="button"
                                                    className="opacity-50 hover:opacity-100 focus:opacity-100 ml-1 rounded-sm ring-offset-background transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemove(tag.id)
                                                    }}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                >
                                                    <X className="h-3 w-3" />
                                                    <span className="sr-only">Remover etiqueta</span>
                                                </button>
                                            </div>
                                        </Badge>
                                    </SortableItem>
                                ))}
                            </Sortable>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Busca o crea una opción..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={handleKeyDown}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {inputValue ? (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted w-full text-left rounded-sm transition-colors"
                                    onClick={() => handleCreate(inputValue)}
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear <span className="font-semibold px-1 bg-muted rounded-sm">"{inputValue}"</span>
                                </button>
                            ) : (
                                "No hay opciones disponibles."
                            )}
                        </CommandEmpty>
                        <CommandGroup heading="Selecciona una opción">
                            <div key={filteredUnselected.map((o) => o.id).join("-")}>
                                <Sortable
                                    items={filteredUnselected}
                                    onReorder={(newOrder) => {
                                        const newOrderIds = new Set(newOrder.map(t => t.id));
                                        const otherOptions = knownOptions.filter(t => !newOrderIds.has(t.id));
                                        setKnownOptions([...newOrder, ...otherOptions]);
                                    }}
                                    strategy="vertical"
                                    className="w-full gap-0"
                                >
                                    {filteredUnselected.map((option) => (
                                        <SortableItem key={option.id} id={option.id} className="w-full">
                                            <CommandItem
                                                onSelect={() => handleSelect(option)}
                                                className="flex items-center gap-2 cursor-pointer w-full group/item"
                                            >
                                                <SortableDragHandle variant="vertical" className="opacity-0 group-hover/item:opacity-50 hover:!opacity-100 p-0 mr-1" />
                                                <div className={cn("px-2 py-0.5 rounded-sm text-xs font-medium", getColorClass(option.color))}>
                                                    {option.label}
                                                </div>
                                                <div className="ml-auto" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                                                    {renderTagActionPopover(option)}
                                                </div>
                                            </CommandItem>
                                        </SortableItem>
                                    ))}
                                </Sortable>
                            </div>
                            {inputValue && !knownOptions.some(o => o.label.toLowerCase() === inputValue.toLowerCase()) && (
                                <CommandItem
                                    onSelect={() => handleCreate(inputValue)}
                                    className="flex items-center gap-2 cursor-pointer border-t mt-1 pt-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Crear <span className="font-semibold px-1 bg-background rounded-sm">"{inputValue}"</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

