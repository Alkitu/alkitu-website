"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "~/lib/utils"

// ---------------------------------------------------------------------------
// Radix-based Progress (original DS primitive)
// ---------------------------------------------------------------------------

function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-primary h-full w-full flex-1 transition-all"
                style={{
                    transform: `translateX(-${100 - (value || 0)}%)`,
                }}
            />
        </ProgressPrimitive.Root>
    )
}

// ---------------------------------------------------------------------------
// ProgressBar – rich progress with variants, sizes, label & percentage
// ProgressBar with variants, sizes, label & percentage
// ---------------------------------------------------------------------------

type ProgressBarVariant = "default" | "success" | "warning" | "error"

type ProgressBarSize = "sm" | "md" | "lg"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Current progress value */
    value: number
    /** Maximum value for progress calculation @default 100 */
    max?: number
    /** Visual variant @default 'default' */
    variant?: ProgressBarVariant
    /** Size @default 'md' */
    size?: ProgressBarSize
    /** Show label text @default false */
    showLabel?: boolean
    /** Show percentage value @default false */
    showPercentage?: boolean
    /** Label text to display */
    label?: string
    /** Custom className for additional styling */
    className?: string
    /** Animate the progress bar with pulse effect @default false */
    animated?: boolean
    /** Data test ID for testing */
    "data-testid"?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    (
        {
            value,
            max = 100,
            variant = "default",
            size = "md",
            showLabel = false,
            showPercentage = false,
            label,
            className = "",
            animated = false,
            "data-testid": dataTestId,
            ...props
        },
        ref,
    ) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

        const variantClasses = {
            default: {
                container: "bg-muted",
                bar: "bg-primary",
            },
            success: {
                container: "bg-success/20",
                bar: "bg-success",
            },
            warning: {
                container: "bg-warning/20",
                bar: "bg-warning",
            },
            error: {
                container: "bg-destructive/20",
                bar: "bg-destructive",
            },
        }[variant]

        const sizeClasses = {
            sm: "h-1",
            md: "h-2",
            lg: "h-4",
        }[size]

        const typographyStyles = {
            fontFamily: "var(--typography-emphasis-font-family)",
            fontSize: "var(--typography-emphasis-font-size)",
            fontWeight: "var(--typography-emphasis-font-weight)",
            letterSpacing: "var(--typography-emphasis-letter-spacing)",
        }

        const borderRadiusStyle = {
            borderRadius: "var(--radius-progress, var(--radius))",
        }

        return (
            <div
                ref={ref}
                data-slot="progress-bar"
                className={cn("w-full", className)}
                data-testid={dataTestId}
                {...props}
            >
                {/* Label and percentage */}
                {(showLabel || showPercentage) && (
                    <div className="flex items-center justify-between mb-2">
                        {showLabel && label && (
                            <span
                                className="text-sm text-foreground"
                                style={typographyStyles}
                                data-testid={
                                    dataTestId
                                        ? `${dataTestId}-label`
                                        : undefined
                                }
                            >
                                {label}
                            </span>
                        )}
                        {showPercentage && (
                            <span
                                className="text-sm text-muted-foreground"
                                style={typographyStyles}
                                data-testid={
                                    dataTestId
                                        ? `${dataTestId}-percentage`
                                        : undefined
                                }
                            >
                                {Math.round(percentage)}%
                            </span>
                        )}
                    </div>
                )}

                {/* Progress container */}
                <div
                    className={cn(
                        variantClasses.container,
                        sizeClasses,
                        "rounded-full overflow-hidden",
                    )}
                    style={borderRadiusStyle}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-label={
                        label || `Progress: ${Math.round(percentage)}%`
                    }
                    data-testid={
                        dataTestId ? `${dataTestId}-container` : undefined
                    }
                >
                    {/* Progress bar */}
                    <div
                        className={cn(
                            variantClasses.bar,
                            sizeClasses,
                            "transition-all duration-500 ease-out rounded-full",
                            animated && "animate-pulse",
                        )}
                        style={{
                            width: `${percentage}%`,
                            borderRadius:
                                "var(--radius-progress, var(--radius))",
                        }}
                        data-testid={
                            dataTestId ? `${dataTestId}-bar` : undefined
                        }
                    />
                </div>
            </div>
        )
    },
)

ProgressBar.displayName = "ProgressBar"

export { Progress, ProgressBar }
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize }
