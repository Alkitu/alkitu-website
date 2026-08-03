"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/primitives/button"
import { Calendar } from "~/components/primitives/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/primitives/popover"

// -----------------------------------------------
// Time Input — Single field (HH, MM, or SS)
// -----------------------------------------------
interface TimeFieldProps {
    value: number
    onChange: (value: number) => void
    max: number
    label: string
}

function TimeField({ value, onChange, max, label }: TimeFieldProps) {
    const padded = String(value).padStart(2, "0")

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault()
            onChange((value + 1) % (max + 1))
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            onChange((value - 1 + max + 1) % (max + 1))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = parseInt(e.target.value, 10)
        if (!isNaN(num) && num >= 0 && num <= max) {
            onChange(num)
        }
    }

    return (
        <input
            type="text"
            inputMode="numeric"
            aria-label={label}
            value={padded}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-8 rounded border border-input bg-background px-1 py-0.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tabular-nums"
            maxLength={2}
        />
    )
}

// -----------------------------------------------
// Time Picker — HH:MM:SS inline input row
// -----------------------------------------------
interface TimePickerProps {
    date: Date | undefined
    onTimeChange: (date: Date) => void
}

function TimePicker({ date, onTimeChange }: TimePickerProps) {
    const hours = date?.getHours() ?? 0
    const minutes = date?.getMinutes() ?? 0
    const seconds = date?.getSeconds() ?? 0

    const setTime = (h: number, m: number, s: number) => {
        const updated = date ? new Date(date) : new Date()
        updated.setHours(h, m, s, 0)
        onTimeChange(updated)
    }

    return (
        <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <TimeField value={hours} onChange={(v) => setTime(v, minutes, seconds)} max={23} label="Hours" />
            <span className="text-muted-foreground">:</span>
            <TimeField value={minutes} onChange={(v) => setTime(hours, v, seconds)} max={59} label="Minutes" />
            <span className="text-muted-foreground">:</span>
            <TimeField value={seconds} onChange={(v) => setTime(hours, minutes, v)} max={59} label="Seconds" />
        </div>
    )
}

// -----------------------------------------------
// DateTimePicker — Popover date picker + inline time picker
// -----------------------------------------------
interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    defaultPopupValue?: Date
    placeholder?: string
    className?: string
    showSeconds?: boolean
}

function DateTimePicker({
    value,
    onChange,
    defaultPopupValue,
    placeholder = "Pick a date & time",
    className,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(value)

    // Sync external value changes
    React.useEffect(() => {
        setInternalDate(value)
    }, [value])

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) {
            setInternalDate(undefined)
            onChange?.(undefined)
            return
        }

        // Preserve existing time when changing date
        const updated = new Date(selected)
        if (internalDate) {
            updated.setHours(internalDate.getHours(), internalDate.getMinutes(), internalDate.getSeconds(), 0)
        }
        setInternalDate(updated)
        onChange?.(updated)
    }

    const handleTimeChange = (updated: Date) => {
        setInternalDate(updated)
        onChange?.(updated)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal",
                        !internalDate && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {internalDate ? format(internalDate, "PPP HH:mm:ss") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={internalDate}
                    onSelect={handleDateSelect}
                    defaultMonth={defaultPopupValue}
                    initialFocus
                />
                <div className="border-t p-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium w-8">Time</span>
                        <TimePicker date={internalDate} onTimeChange={handleTimeChange} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// -----------------------------------------------
// SideBySide — Separate Date Picker + Time Picker fields
// -----------------------------------------------
interface DateAndTimePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    className?: string
}

function DateAndTimePicker({ value, onChange, className }: DateAndTimePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(value)

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) { setDate(undefined); onChange?.(undefined); return }
        const updated = new Date(selected)
        if (date) updated.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0)
        setDate(updated)
        onChange?.(updated)
    }

    const handleTimeChange = (updated: Date) => {
        setDate(updated)
        onChange?.(updated)
    }

    return (
        <div className={cn("flex flex-wrap items-end gap-6", className)}>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Date Picker</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[200px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Time Input</span>
                <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 shadow-xs">
                    <TimePicker date={date} onTimeChange={handleTimeChange} />
                </div>
            </div>
        </div>
    )
}

export { DateTimePicker, DateAndTimePicker, TimePicker }
