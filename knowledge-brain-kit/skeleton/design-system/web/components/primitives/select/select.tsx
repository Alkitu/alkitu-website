"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "~/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, style, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className
        )}
        style={{
            fontFamily: "var(--typography-input-family, var(--font-sans))",
            fontSize: "var(--typography-input-size, 0.875rem)",
            fontWeight: "var(--typography-input-weight, 400)",
            lineHeight: "var(--typography-input-line-height, 1.25rem)",
            transition:
                "all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))",
            ...style,
        }}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronDown className="h-4 w-4 rotate-180" />
    </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-1",
            className
        )}
        {...props}
    >
        <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
    SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", style, ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ease-out-strong duration-dropdown data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            style={{
                boxShadow: "var(--shadow-dropdown, var(--shadow-lg))",
                zIndex: "var(--z-dropdown, 1000)",
                ...style,
            }}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={cn(
                    "p-1",
                    position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
    />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// ---------------------------------------------------------------------------
// EnhancedSelect – high-level, data-driven select component
// ---------------------------------------------------------------------------

/**
 * Option for EnhancedSelect component
 */
interface EnhancedSelectOption {
    value: string
    label: string
    disabled?: boolean
    icon?: React.ReactNode
}

/**
 * Grouped options for EnhancedSelect component
 */
interface EnhancedSelectGroupOption {
    label: string
    options: EnhancedSelectOption[]
}

/**
 * Variant options for EnhancedSelect
 */
type EnhancedSelectVariant = "default" | "ghost" | "filled"

/**
 * Size options for EnhancedSelect
 */
type EnhancedSelectSize = "sm" | "md" | "lg"

/**
 * Props for EnhancedSelect component
 */
interface EnhancedSelectProps {
    /** Available options for selection (flat or grouped) */
    options: EnhancedSelectOption[] | EnhancedSelectGroupOption[]
    /** Controlled value */
    value?: string
    /** Default value (uncontrolled mode) */
    defaultValue?: string
    /** Placeholder text when no value is selected @default 'Select an option...' */
    placeholder?: string
    /** Disabled state @default false */
    disabled?: boolean
    /** Callback when value changes */
    onValueChange?: (value: string) => void
    /** Custom className for additional styling */
    className?: string
    /** Visual variant of the select @default 'default' */
    variant?: EnhancedSelectVariant
    /** Size of the select @default 'md' */
    size?: EnhancedSelectSize
    /** Invalid state (error) @default false */
    isInvalid?: boolean
    /** Valid state (success) @default false */
    isValid?: boolean
    /** Warning state @default false */
    isWarning?: boolean
    /** Required field indicator @default false */
    required?: boolean
    /** ARIA label for accessibility */
    "aria-label"?: string
    /** ARIA described by for accessibility */
    "aria-describedby"?: string
    /** ARIA invalid for accessibility */
    "aria-invalid"?: boolean
    /** ARIA required for accessibility */
    "aria-required"?: boolean
    /** Data test ID for testing */
    "data-testid"?: string
    /** Theme override using CSS custom properties */
    themeOverride?: React.CSSProperties
    /** Name attribute for forms */
    name?: string
    /** ID attribute */
    id?: string
}

/**
 * EnhancedSelect – a high-level, data-driven select built on DS primitives.
 *
 * Supports flat and grouped options, validation states, size/variant variants,
 * and theme-aware CSS variable styling.
 *
 * @example
 * ```tsx
 * <EnhancedSelect
 *   options={[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *   ]}
 *   placeholder="Pick one"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
const EnhancedSelect = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    EnhancedSelectProps
>(
    (
        {
            options,
            value,
            defaultValue,
            placeholder = "Select an option...",
            disabled = false,
            onValueChange,
            className = "",
            variant = "default",
            size = "md",
            isInvalid = false,
            isValid = false,
            isWarning = false,
            required = false,
            "aria-label": ariaLabel,
            "aria-describedby": ariaDescribedby,
            "aria-invalid": ariaInvalid,
            "aria-required": ariaRequired,
            "data-testid": dataTestId,
            themeOverride,
            name,
            id,
        },
        ref,
    ) => {
        // Check if options are grouped
        const isGrouped = options.length > 0 && "options" in options[0]

        // Get all flat options for easier lookup
        const flatOptions: EnhancedSelectOption[] = isGrouped
            ? (options as EnhancedSelectGroupOption[]).flatMap(
                  (group) => group.options,
              )
            : (options as EnhancedSelectOption[])

        // Variant classes for trigger
        const getVariantClasses = () => {
            const baseClasses =
                "flex items-center justify-between w-full transition-colors duration-200"

            if (isInvalid) {
                return cn(
                    baseClasses,
                    "bg-background text-foreground border-destructive",
                    "hover:bg-accent hover:border-destructive/80",
                    "focus:border-destructive focus:ring-2 focus:ring-destructive/20",
                )
            }

            if (isValid) {
                return cn(
                    baseClasses,
                    "bg-background text-foreground border-success",
                    "hover:bg-accent hover:border-success",
                    "focus:border-success focus:ring-2 focus:ring-success/20",
                )
            }

            if (isWarning) {
                return cn(
                    baseClasses,
                    "bg-background text-foreground border-warning",
                    "hover:bg-accent hover:border-warning",
                    "focus:border-warning focus:ring-2 focus:ring-warning/20",
                )
            }

            switch (variant) {
                case "ghost":
                    return cn(
                        baseClasses,
                        "bg-transparent text-foreground border-transparent",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:ring-2 focus:ring-primary/20",
                    )
                case "filled":
                    return cn(
                        baseClasses,
                        "bg-muted text-foreground border-transparent",
                        "hover:bg-muted/80",
                        "focus:bg-background focus:border-input focus:ring-2 focus:ring-primary/20",
                    )
                default:
                    return cn(
                        baseClasses,
                        "bg-background text-foreground border-input",
                        "hover:bg-accent hover:border-primary/50",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                    )
            }
        }

        // Size classes
        const getSizeClasses = () => {
            switch (size) {
                case "sm":
                    return "h-8 px-2 text-sm"
                case "lg":
                    return "h-12 px-4 text-base"
                default:
                    return "h-10 px-3 text-sm"
            }
        }

        const variantClasses = getVariantClasses()
        const sizeClasses = getSizeClasses()

        // Focus ring color based on state
        const focusRingColor = isInvalid
            ? "var(--destructive)"
            : isWarning
              ? "var(--warning)"
              : isValid
                ? "var(--success)"
                : "var(--primary)"

        const combinedStyle = {
            borderRadius: "var(--radius)",
            fontFamily: "var(--typography-paragraph-font-family)",
            fontSize: "var(--typography-paragraph-font-size)",
            letterSpacing: "var(--typography-paragraph-letter-spacing)",
            lineHeight: "var(--typography-paragraph-line-height)",
            "--focus-ring-color": focusRingColor,
            ...themeOverride,
        } as React.CSSProperties

        // Render options
        const renderOptions = () => {
            if (isGrouped) {
                return (options as EnhancedSelectGroupOption[]).map((group) => (
                    <SelectGroup key={group.label}>
                        <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            {group.label}
                        </SelectLabel>
                        {group.options.map((option) => (
                            <SelectPrimitive.Item
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                                className={cn(
                                    "relative flex items-center gap-2 px-8 py-2 text-sm cursor-pointer",
                                    "outline-none select-none transition-colors duration-200",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    "focus:bg-accent focus:text-accent-foreground",
                                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                )}
                                style={{
                                    fontFamily:
                                        "var(--typography-paragraph-font-family)",
                                    fontSize:
                                        "var(--typography-paragraph-font-size)",
                                }}
                            >
                                <SelectPrimitive.ItemText>
                                    <span className="flex items-center gap-2">
                                        {option.icon && (
                                            <span className="shrink-0">
                                                {option.icon}
                                            </span>
                                        )}
                                        <span>{option.label}</span>
                                    </span>
                                </SelectPrimitive.ItemText>
                                <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </SelectPrimitive.ItemIndicator>
                            </SelectPrimitive.Item>
                        ))}
                        <SelectSeparator className="my-1 h-px bg-border" />
                    </SelectGroup>
                ))
            }

            return (flatOptions as EnhancedSelectOption[]).map((option) => (
                <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                        "relative flex items-center gap-2 px-8 py-2 text-sm cursor-pointer",
                        "outline-none select-none transition-colors duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    )}
                    style={{
                        fontFamily: "var(--typography-paragraph-font-family)",
                        fontSize: "var(--typography-paragraph-font-size)",
                    }}
                >
                    <SelectPrimitive.ItemText>
                        <span className="flex items-center gap-2">
                            {option.icon && (
                                <span className="shrink-0">
                                    {option.icon}
                                </span>
                            )}
                            <span>{option.label}</span>
                        </span>
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex items-center justify-center">
                        <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
            ))
        }

        return (
            <Select
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
                name={name}
                required={required}
            >
                <SelectPrimitive.Trigger
                    ref={ref}
                    id={id}
                    className={cn(
                        variantClasses,
                        sizeClasses,
                        "border rounded outline-none",
                        {
                            "opacity-50 cursor-not-allowed": disabled,
                        },
                        className,
                    )}
                    style={combinedStyle}
                    aria-label={ariaLabel || placeholder}
                    aria-describedby={ariaDescribedby}
                    aria-invalid={
                        isInvalid || ariaInvalid ? "true" : "false"
                    }
                    aria-required={
                        required || ariaRequired ? "true" : undefined
                    }
                    data-testid={dataTestId}
                >
                    <SelectValue placeholder={placeholder} />
                    <SelectPrimitive.Icon asChild>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Portal>
                    <SelectPrimitive.Content
                        className={cn(
                            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
                            "rounded-md border bg-popover text-popover-foreground shadow-md",
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                            "data-[side=bottom]:slide-in-from-top-2",
                            "data-[side=left]:slide-in-from-right-2",
                            "data-[side=right]:slide-in-from-left-2",
                            "data-[side=top]:slide-in-from-bottom-2",
                        )}
                        style={{}}
                        position="popper"
                        sideOffset={4}
                    >
                        <SelectPrimitive.Viewport className="p-1">
                            {renderOptions()}
                        </SelectPrimitive.Viewport>
                    </SelectPrimitive.Content>
                </SelectPrimitive.Portal>
            </Select>
        )
    },
)

EnhancedSelect.displayName = "EnhancedSelect"

/**
 * Memoized EnhancedSelect component for performance optimization.
 * Use this when passing stable options arrays.
 */
const MemoizedEnhancedSelect = React.memo(
    EnhancedSelect,
    (prevProps, nextProps) => {
        // Quick scalar props comparison
        const scalarProps = [
            "value",
            "defaultValue",
            "placeholder",
            "disabled",
            "variant",
            "size",
            "isInvalid",
            "isValid",
            "isWarning",
            "required",
            "className",
            "name",
            "id",
        ] as const

        for (const prop of scalarProps) {
            if (prevProps[prop] !== nextProps[prop]) return false
        }

        // Options array comparison
        if (prevProps.options.length !== nextProps.options.length) return false

        // Check if grouped or flat
        const prevIsGrouped =
            prevProps.options.length > 0 && "options" in prevProps.options[0]
        const nextIsGrouped =
            nextProps.options.length > 0 && "options" in nextProps.options[0]

        if (prevIsGrouped !== nextIsGrouped) return false

        // Deep comparison of options
        for (let i = 0; i < prevProps.options.length; i++) {
            const prevOpt = prevProps.options[i]
            const nextOpt = nextProps.options[i]

            if (prevIsGrouped) {
                const prevGroup = prevOpt as EnhancedSelectGroupOption
                const nextGroup = nextOpt as EnhancedSelectGroupOption

                if (prevGroup.label !== nextGroup.label) return false
                if (prevGroup.options.length !== nextGroup.options.length)
                    return false

                for (let j = 0; j < prevGroup.options.length; j++) {
                    if (
                        prevGroup.options[j].value !==
                            nextGroup.options[j].value ||
                        prevGroup.options[j].label !==
                            nextGroup.options[j].label ||
                        prevGroup.options[j].disabled !==
                            nextGroup.options[j].disabled
                    ) {
                        return false
                    }
                }
            } else {
                const prevOption = prevOpt as EnhancedSelectOption
                const nextOption = nextOpt as EnhancedSelectOption

                if (
                    prevOption.value !== nextOption.value ||
                    prevOption.label !== nextOption.label ||
                    prevOption.disabled !== nextOption.disabled
                ) {
                    return false
                }
            }
        }

        // Handler comparison
        if (prevProps.onValueChange !== nextProps.onValueChange) return false

        return true
    },
)

MemoizedEnhancedSelect.displayName = "MemoizedEnhancedSelect"

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
    EnhancedSelect,
    MemoizedEnhancedSelect,
}

export type {
    EnhancedSelectOption,
    EnhancedSelectGroupOption,
    EnhancedSelectVariant,
    EnhancedSelectSize,
    EnhancedSelectProps,
}
