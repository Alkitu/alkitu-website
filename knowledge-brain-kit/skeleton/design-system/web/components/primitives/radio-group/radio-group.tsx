"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"
import { cn } from "~/lib/utils"

// ---------------------------------------------------------------------------
// Radix-based RadioGroup & RadioGroupItem (original DS primitives)
// ---------------------------------------------------------------------------

function RadioGroup({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            data-slot="radio-group"
            className={cn("grid gap-3", className)}
            {...props}
        />
    )
}

function RadioGroupItem({
    className,
    ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="relative flex items-center justify-center"
            >
                <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    )
}

// ---------------------------------------------------------------------------
// RadioButton – custom styled radio with label, description, variants & sizes
// RadioButton with label, description, variants & sizes
// ---------------------------------------------------------------------------

type RadioButtonVariant = "default" | "error" | "success" | "warning"

type RadioButtonSize = "sm" | "md" | "lg"

interface RadioButtonProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** Unique identifier for the radio button */
    id?: string
    /** Name attribute for grouping radio buttons */
    name: string
    /** Value of the radio button */
    value: string
    /** Checked state @default false */
    checked?: boolean
    /** Disabled state @default false */
    disabled?: boolean
    /** Visual variant @default 'default' */
    variant?: RadioButtonVariant
    /** Size @default 'md' */
    size?: RadioButtonSize
    /** Label text displayed next to the radio button */
    label?: string
    /** Description text displayed below the label */
    description?: string
    /** Callback fired when the radio button selection changes */
    onChange?: (value: string) => void
    /** Custom className for additional styling */
    className?: string
    /** Data test ID for testing */
    "data-testid"?: string
}

const RadioButton = React.forwardRef<HTMLDivElement, RadioButtonProps>(
    (
        {
            id,
            name,
            value,
            checked = false,
            disabled = false,
            variant = "default",
            size = "md",
            label,
            description,
            onChange,
            className = "",
            "data-testid": dataTestId,
            ...props
        },
        ref,
    ) => {
        const handleChange = () => {
            if (disabled) return
            onChange?.(value)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                handleChange()
            }
        }

        const variantClasses = {
            default:
                "border-input hover:border-primary/50 focus:border-primary focus:ring-primary/20",
            error: "border-destructive hover:border-destructive/80 focus:border-destructive focus:ring-destructive/20",
            success:
                "border-success hover:border-success/80 focus:border-success focus:ring-success/20",
            warning:
                "border-warning hover:border-warning/80 focus:border-warning focus:ring-warning/20",
        }[variant]

        const sizeClasses = {
            sm: "h-4 w-4",
            md: "h-5 w-5",
            lg: "h-6 w-6",
        }[size]

        const dotSizeClasses = {
            sm: "h-2 w-2",
            md: "h-2.5 w-2.5",
            lg: "h-3 w-3",
        }[size]

        const dotColorClasses = {
            default: "bg-primary",
            error: "bg-destructive",
            success: "bg-success",
            warning: "bg-warning",
        }[variant]

        const disabledClasses = disabled
            ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
            : "bg-background cursor-pointer"

        return (
            <div
                ref={ref}
                data-slot="radio-button"
                className={cn("flex items-start gap-3", className)}
                data-testid={dataTestId}
                {...props}
            >
                {/* Hidden native radio for accessibility */}
                <input
                    type="radio"
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                    className="sr-only"
                    aria-describedby={
                        description ? `${id}-description` : undefined
                    }
                    data-testid={
                        dataTestId ? `${dataTestId}-input` : undefined
                    }
                />

                {/* Custom radio button */}
                <div
                    role="radio"
                    aria-checked={checked}
                    aria-disabled={disabled}
                    aria-label={label || value}
                    tabIndex={disabled ? -1 : 0}
                    onClick={handleChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "flex items-center justify-center",
                        "rounded-full border-2",
                        "transition-all duration-200",
                        "focus:outline-none focus:ring-2",
                        "relative",
                        sizeClasses,
                        disabled ? disabledClasses : variantClasses,
                    )}
                    data-testid={
                        dataTestId ? `${dataTestId}-custom` : undefined
                    }
                >
                    {checked && (
                        <div
                            className={cn(
                                "rounded-full transition-all duration-200",
                                dotSizeClasses,
                                dotColorClasses,
                            )}
                            data-testid={
                                dataTestId ? `${dataTestId}-dot` : undefined
                            }
                        />
                    )}
                </div>

                {/* Label and description */}
                {(label || description) && (
                    <div className="flex flex-col">
                        {label && (
                            <label
                                htmlFor={id}
                                className={cn(
                                    "text-foreground cursor-pointer",
                                    disabled &&
                                        "text-muted-foreground cursor-not-allowed",
                                )}
                                style={{
                                    fontFamily:
                                        "var(--typography-emphasis-font-family)",
                                    fontSize:
                                        "var(--typography-emphasis-font-size)",
                                    fontWeight:
                                        "var(--typography-emphasis-font-weight)",
                                    letterSpacing:
                                        "var(--typography-emphasis-letter-spacing)",
                                    lineHeight:
                                        "var(--typography-emphasis-line-height)",
                                }}
                                data-testid={
                                    dataTestId
                                        ? `${dataTestId}-label`
                                        : undefined
                                }
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p
                                id={`${id}-description`}
                                className="text-muted-foreground text-sm"
                                style={{
                                    fontFamily:
                                        "var(--typography-paragraph-font-family)",
                                    fontSize:
                                        "var(--typography-paragraph-font-size)",
                                    fontWeight:
                                        "var(--typography-paragraph-font-weight)",
                                    letterSpacing:
                                        "var(--typography-paragraph-letter-spacing)",
                                    lineHeight:
                                        "var(--typography-paragraph-line-height)",
                                }}
                                data-testid={
                                    dataTestId
                                        ? `${dataTestId}-description`
                                        : undefined
                                }
                            >
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        )
    },
)

RadioButton.displayName = "RadioButton"

export {
    RadioGroup,
    RadioGroupItem,
    RadioButton,
}
export type { RadioButtonProps, RadioButtonVariant, RadioButtonSize }
