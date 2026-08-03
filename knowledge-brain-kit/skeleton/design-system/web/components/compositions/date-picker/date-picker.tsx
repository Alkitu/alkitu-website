"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, X } from "lucide-react"
import { DateRange as RDPDateRange } from "react-day-picker"

import { cn } from "~/lib/utils"
import { Button } from "~/components/primitives/button"
import { Calendar } from "~/components/primitives/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/primitives/popover"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * DatePicker variant options
 */
export type DatePickerVariant = "default" | "inline" | "range" | "datetime"

/**
 * DatePicker size options
 */
export type DatePickerSize = "sm" | "md" | "lg"

/**
 * Date range value type
 */
export interface DateRange {
    from?: Date
    to?: Date
}

/**
 * Date value type - can be single date or date range
 */
export type DateValue = Date | DateRange | undefined

/**
 * Props for the advanced DatePicker
 */
export interface DatePickerProps {
    /** Current date value - single date for default/datetime, range for range variant */
    value?: DateValue
    /** Callback when date changes */
    onChange?: (date: DateValue) => void
    /** Placeholder text for the input @default 'Select date' */
    placeholder?: string
    /** Date format for display @default 'PPP' */
    format?: string
    /** Variant of the date picker @default 'default' */
    variant?: DatePickerVariant
    /** Size of the date picker @default 'md' */
    size?: DatePickerSize
    /** Whether the date picker is disabled @default false */
    disabled?: boolean
    /** Whether to show a clear button @default true */
    clearable?: boolean
    /** Whether to show a "Today" button @default true */
    showToday?: boolean
    /** Minimum selectable date */
    minDate?: Date
    /** Maximum selectable date */
    maxDate?: Date
    /** Custom className for the container */
    className?: string
    /** Error message to display */
    error?: string
    /** Label text for the field */
    label?: string
    /** Whether the field is required @default false */
    required?: boolean
    /** Custom ID for the input element */
    id?: string
    /** Helper text displayed below the input */
    helperText?: string
}

// -----------------------------------------------
// Simple Date Picker (original DS)
// -----------------------------------------------
function DatePickerSimple({
    placeholder = "Pick a date",
    className,
}: {
    placeholder?: string
    className?: string
}) {
    const [date, setDate] = React.useState<Date>()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

// -----------------------------------------------
// Date Range Picker (original DS)
// -----------------------------------------------
function DateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<RDPDateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
    })

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} –{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

// -----------------------------------------------
// Advanced DatePicker
// -----------------------------------------------

/**
 * DatePicker - Advanced date picker with support for single date, date range,
 * datetime selection, inline calendar display, min/max constraints,
 * clearable, "Today" quick-select, keyboard navigation, and full a11y.
 *
 * @example
 * ```tsx
 * // Single date
 * <DatePicker value={selectedDate} onChange={setSelectedDate} label="Select Date" />
 *
 * // Date range
 * <DatePicker variant="range" value={dateRange} onChange={setDateRange} label="Select Range" />
 *
 * // Date + time
 * <DatePicker variant="datetime" value={selectedDateTime} onChange={setSelectedDateTime} />
 * ```
 */
const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            value,
            onChange,
            placeholder = "Select date",
            format: dateFormat = "PPP",
            variant = "default",
            size = "md",
            disabled = false,
            clearable = true,
            showToday = true,
            minDate,
            maxDate,
            className = "",
            error,
            label,
            required = false,
            id,
            helperText,
        },
        ref,
    ) => {
        // Local state
        const [isOpen, setIsOpen] = useState(false)
        const [inputValue, setInputValue] = useState("")
        const [time, setTime] = useState({ hours: "12", minutes: "00" })

        // Refs
        const inputRef = useRef<HTMLInputElement>(null)

        // Helper: Check if value is a date range
        const isDateRange = (val: DateValue): val is DateRange => {
            return typeof val === "object" && val !== null && !("getTime" in val)
        }

        // Helper: Format a single date
        const formatSingleDate = (
            date: Date,
            fmt: string = "PPP",
        ): string => {
            if (!date || isNaN(date.getTime())) return ""

            try {
                if (fmt === "PPP pp" || variant === "datetime") {
                    return date.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                }

                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            } catch {
                return date.toISOString().split("T")[0]
            }
        }

        // Helper: Format date or date range
        const formatDate = (
            dateValue: DateValue,
            fmt: string = "PPP",
        ): string => {
            if (!dateValue) return ""

            // Handle range values
            if (isDateRange(dateValue)) {
                const range = dateValue as DateRange
                if (!range.from) return ""

                const fromFormatted = formatSingleDate(range.from, fmt)
                if (range.to) {
                    const toFormatted = formatSingleDate(range.to, fmt)
                    return `${fromFormatted} - ${toFormatted}`
                }
                return fromFormatted + " (Select end date)"
            }

            // Handle single date
            return formatSingleDate(dateValue as Date, fmt)
        }

        // Helper: Parse date from string
        const parseDate = (dateString: string): Date | null => {
            if (!dateString) return null

            try {
                const date = new Date(dateString)
                return isNaN(date.getTime()) ? null : date
            } catch {
                return null
            }
        }

        // Update input value when external value changes
        useEffect(() => {
            const formatted = formatDate(value, dateFormat)
            setInputValue(formatted)

            // Handle datetime for single dates only
            if (variant === "datetime" && value && !isDateRange(value)) {
                const date = value as Date
                if (!isNaN(date.getTime())) {
                    setTime({
                        hours: date.getHours().toString().padStart(2, "0"),
                        minutes: date.getMinutes().toString().padStart(2, "0"),
                    })
                }
            }
        }, [value, dateFormat, variant])

        // Handle date selection
        const handleDateSelect = (selected: DateValue) => {
            if (!selected) {
                onChange?.(undefined)
                setInputValue("")
                setIsOpen(false)
                return
            }

            if (variant === "range") {
                onChange?.(selected)
                // Keep popover open until range is complete
                const range = selected as DateRange
                if (range.from && range.to && (variant as string) !== "inline") {
                    setIsOpen(false)
                }
            } else {
                const selectedDate = selected as Date
                let finalDate = selectedDate

                // Add time for datetime variant
                if (variant === "datetime") {
                    finalDate = new Date(selectedDate)
                    finalDate.setHours(parseInt(time.hours), parseInt(time.minutes))
                }

                onChange?.(finalDate)

                // Close popover for non-inline variants
                if (variant !== "inline") {
                    setIsOpen(false)
                }
            }
        }

        // Handle manual input change
        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputVal = event.target.value
            setInputValue(inputVal)

            const parsed = parseDate(inputVal)
            if (parsed) {
                onChange?.(parsed)
            }
        }

        // Clear date
        const handleClear = () => {
            onChange?.(undefined)
            setInputValue("")
            setIsOpen(false)
        }

        // Select today
        const handleToday = () => {
            const today = new Date()
            handleDateSelect(today)
        }

        // Handle time change for datetime variant
        const handleTimeChange = (type: "hours" | "minutes", timeValue: string) => {
            const newTime = { ...time, [type]: timeValue }
            setTime(newTime)

            if (value && !isDateRange(value)) {
                const updatedDate = new Date(value as Date)
                updatedDate.setHours(
                    parseInt(newTime.hours),
                    parseInt(newTime.minutes),
                )
                onChange?.(updatedDate)
            }
        }

        // Size classes
        const sizeClasses = {
            sm: "h-9 text-sm",
            md: "h-10 text-base",
            lg: "h-12 text-lg",
        }[size]

        // Container classes
        const containerClasses = cn("flex flex-col gap-2", className)

        // Label classes
        const labelClasses = cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            "text-foreground",
        )

        // Error classes
        const errorClasses = cn("text-sm text-destructive")

        // Helper text classes
        const helperTextClasses = cn("text-sm text-muted-foreground")

        // Button classes for trigger
        const triggerButtonClasses = cn(
            "w-full justify-between font-normal",
            sizeClasses,
            !inputValue && "text-muted-foreground",
            isOpen && "border-primary ring-2 ring-primary ring-offset-2",
            error && "border-destructive focus:ring-destructive",
        )

        // Render time inputs for datetime variant
        const renderTimeInputs = () => {
            if (variant !== "datetime") return null

            const hoursId = `${id}-hours`
            const minutesId = `${id}-minutes`

            return (
                <div className="flex items-center justify-center gap-3 mt-4 p-3 bg-accent/40 border border-border/60 rounded-[var(--radius)]">
                    <Clock className="h-4 w-4 text-muted-foreground" />

                    <div className="flex flex-col items-center gap-1">
                        <label
                            htmlFor={hoursId}
                            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
                        >
                            Hour
                        </label>
                        <input
                            id={hoursId}
                            type="number"
                            min="0"
                            max="23"
                            value={time.hours}
                            onChange={(e) => handleTimeChange("hours", e.target.value)}
                            className={cn(
                                "w-12 h-9 px-2 border border-input rounded-[var(--radius)]",
                                "bg-background text-foreground text-sm font-medium text-center",
                                "focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
                                "transition-all",
                            )}
                        />
                    </div>

                    <div className="text-lg font-semibold text-primary mt-4">:</div>

                    <div className="flex flex-col items-center gap-1">
                        <label
                            htmlFor={minutesId}
                            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide"
                        >
                            Min
                        </label>
                        <input
                            id={minutesId}
                            type="number"
                            min="0"
                            max="59"
                            value={time.minutes}
                            onChange={(e) => handleTimeChange("minutes", e.target.value)}
                            className={cn(
                                "w-12 h-9 px-2 border border-input rounded-[var(--radius)]",
                                "bg-background text-foreground text-sm font-medium text-center",
                                "focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
                                "transition-all",
                            )}
                        />
                    </div>
                </div>
            )
        }

        // Render action buttons
        const renderActions = () => {
            return (
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/40">
                    {showToday && (
                        <button
                            type="button"
                            onClick={handleToday}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-[var(--radius)]",
                                "bg-primary/10 border border-primary/40 text-primary",
                                "hover:bg-primary/20 hover:scale-105 active:scale-95",
                                "transition-all",
                            )}
                        >
                            Today
                        </button>
                    )}

                    {clearable && value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-[var(--radius)]",
                                "text-muted-foreground",
                                "hover:bg-destructive/20 hover:text-destructive hover:scale-105 active:scale-95",
                                "transition-all flex items-center gap-1",
                            )}
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </button>
                    )}
                </div>
            )
        }

        // Inline variant renders calendar directly
        if (variant === "inline") {
            return (
                <div ref={ref} className={containerClasses}>
                    {label && (
                        <label className={labelClasses}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    )}

                    <div className="border border-border rounded-[var(--radius-card)] p-4 bg-background">
                        <Calendar
                            {...({
                                mode: (variant as string) === "range" ? "range" : "single",
                                selected: value,
                                onSelect: handleDateSelect,
                                disabled,
                                fromDate: minDate,
                                toDate: maxDate,
                            } as any)}
                        />

                        {renderTimeInputs()}
                        {renderActions()}
                    </div>

                    {error && <p className={errorClasses}>{error}</p>}
                    {helperText && !error && (
                        <p className={helperTextClasses}>{helperText}</p>
                    )}
                </div>
            )
        }

        // Default popover variant
        return (
            <div ref={ref} className={containerClasses}>
                {label && (
                    <label htmlFor={id} className={labelClasses}>
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    id={id}
                                    type="button"
                                    disabled={disabled}
                                    className={cn(
                                        "inline-flex items-center justify-between rounded-[var(--radius)] border border-input w-full",
                                        "bg-background px-3 py-2 text-sm ring-offset-background",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                        "disabled:cursor-not-allowed disabled:opacity-50",
                                        triggerButtonClasses,
                                        clearable && inputValue && "pr-10",
                                    )}
                                    aria-label={label || placeholder}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? `${id}-error` : undefined}
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <CalendarIcon
                                            className={cn(
                                                "h-4 w-4 flex-shrink-0",
                                                inputValue ? "text-primary" : "text-muted-foreground",
                                            )}
                                        />
                                        <span className="truncate">
                                            {inputValue || placeholder}
                                        </span>
                                    </div>
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0">
                                <div className="p-4">
                                    <Calendar
                                        {...({
                                            mode: variant === "range" ? "range" : "single",
                                            selected: value,
                                            onSelect: handleDateSelect,
                                            fromDate: minDate,
                                            toDate: maxDate,
                                            initialFocus: true,
                                        } as any)}
                                    />

                                    {renderTimeInputs()}
                                    {renderActions()}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Clear button positioned absolutely */}
                        {clearable && inputValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2",
                                    "flex-shrink-0 w-5 h-5 rounded hover:bg-destructive/20",
                                    "transition-all hover:scale-110 active:scale-95",
                                    "z-10",
                                )}
                                aria-label="Clear date"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                            </button>
                        )}
                    </div>

                    {/* Manual input field for power users */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="dd/mm/yyyy"
                        disabled={disabled}
                        className={cn(
                            "flex h-10 w-40 rounded-[var(--radius)] border border-input bg-background px-3 py-2",
                            "text-sm ring-offset-background",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "hover:border-primary/60",
                            sizeClasses,
                        )}
                        aria-label="Manual date input"
                    />
                </div>

                {error && (
                    <p id={`${id}-error`} className={errorClasses} role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className={helperTextClasses}>{helperText}</p>
                )}
            </div>
        )
    },
)

DatePicker.displayName = "DatePicker"

export {
    DatePickerSimple,
    DateRangePicker,
    DatePicker,
}
