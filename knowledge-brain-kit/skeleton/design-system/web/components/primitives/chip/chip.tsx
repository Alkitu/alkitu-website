"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";

type ChipVariant =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "outline"
    | "solid"
    | "destructive";

type ChipSize = "sm" | "md" | "lg";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Visual variant of the chip @default 'default' */
    variant?: ChipVariant;
    /** Size of the chip @default 'md' */
    size?: ChipSize;
    /** Whether the chip can be removed/deleted @default false */
    deletable?: boolean;
    /** Callback when chip is deleted */
    onDelete?: () => void;
    /** Whether the chip is selected @default false */
    selected?: boolean;
    /** Whether the chip is disabled @default false */
    disabled?: boolean;
    /** Icon to display at the start of the chip */
    startIcon?: React.ReactNode;
    /** Icon to display at the end of the chip (before delete button if deletable) */
    endIcon?: React.ReactNode;
    /** Chip content */
    children?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Theme variable overrides for custom styling */
    themeOverride?: React.CSSProperties;
    /** Whether to use system colors @default true */
    useSystemColors?: boolean;
}

/**
 * Chip - A compact, visually distinct element used to represent tags, labels,
 * categories, or small pieces of information.
 */
const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
    (
        {
            variant = "default",
            size = "md",
            deletable = false,
            onDelete,
            selected = false,
            disabled = false,
            startIcon,
            endIcon,
            children,
            className,
            themeOverride,
            useSystemColors = true,
            onClick,
            ...props
        },
        ref,
    ) => {
        const variantClasses = {
            default: "bg-secondary text-secondary-foreground",
            primary: "bg-primary text-primary-foreground",
            secondary: "bg-muted text-muted-foreground",
            success: "bg-success/15 text-success",
            warning: "bg-warning/15 text-warning",
            error: "bg-destructive/15 text-destructive",
            info: "bg-info/15 text-info",
            outline:
                "border border-secondary-foreground text-secondary-foreground bg-secondary",
            solid: "bg-primary text-primary-foreground border border-transparent",
            destructive:
                "bg-destructive text-destructive-foreground border border-transparent",
        }[variant];

        const sizeClasses = {
            sm: "h-6 px-2 py-1 text-xs gap-1",
            md: "h-8 px-3 py-1.5 text-sm gap-1.5",
            lg: "h-10 px-4 py-2 text-base gap-2",
        }[size];

        const iconSizeClass = {
            sm: "h-3 w-3",
            md: "h-3.5 w-3.5",
            lg: "h-4 w-4",
        }[size];

        const classes = cn(
            "inline-flex items-center justify-center",
            "rounded-full font-medium whitespace-nowrap overflow-hidden",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            useSystemColors && variantClasses,
            sizeClasses,
            selected && "ring-2 ring-ring ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            onClick && !disabled && "cursor-pointer hover:opacity-80",
            className,
        );

        const style = themeOverride ? { ...themeOverride } : undefined;

        const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
            if (onClick && !disabled) {
                onClick(e);
            }
        };

        const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (onDelete && !disabled) {
                onDelete();
            }
        };

        const handleDeleteKeyDown = (
            e: React.KeyboardEvent<HTMLButtonElement>,
        ) => {
            if ((e.key === "Enter" || e.key === " ") && onDelete && !disabled) {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
            }
        };

        return (
            <span
                ref={ref}
                className={classes}
                style={style}
                onClick={handleClick}
                role={onClick ? "button" : undefined}
                tabIndex={onClick && !disabled ? 0 : undefined}
                aria-disabled={disabled}
                aria-selected={selected}
                data-use-system-colors={useSystemColors}
                data-slot="chip"
                {...props}
            >
                {startIcon && (
                    <span className={cn("inline-flex shrink-0", iconSizeClass)}>
                        {startIcon}
                    </span>
                )}

                {children && <span className="truncate">{children}</span>}

                {endIcon && !deletable && (
                    <span className={cn("inline-flex shrink-0", iconSizeClass)}>
                        {endIcon}
                    </span>
                )}

                {deletable && (
                    <button
                        type="button"
                        className={cn(
                            "ml-0.5 inline-flex items-center justify-center shrink-0",
                            "rounded-full transition-colors",
                            "hover:bg-black/10 dark:hover:bg-white/10",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            size === "sm"
                                ? "p-0.5"
                                : size === "md"
                                  ? "p-1"
                                  : "p-1.5",
                        )}
                        onClick={handleDelete}
                        onKeyDown={handleDeleteKeyDown}
                        disabled={disabled}
                        aria-label="Remove chip"
                        tabIndex={disabled ? -1 : 0}
                    >
                        <X className={iconSizeClass} />
                    </button>
                )}
            </span>
        );
    },
);
Chip.displayName = "Chip";

export { Chip };
export type { ChipProps, ChipVariant, ChipSize };
