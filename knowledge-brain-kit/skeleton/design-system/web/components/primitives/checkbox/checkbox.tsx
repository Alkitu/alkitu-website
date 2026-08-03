"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "~/lib/utils"

function Checkbox({
    className,
    style,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    const baseStyles: React.CSSProperties = {
        borderRadius:
            "var(--radius-checkbox, calc(var(--radius, 0.375rem) - 2px))",
        boxShadow:
            "var(--shadow-xs, 0px 4px 8px -1px hsl(0 0% 0% / 0.05))",
        transition:
            "all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1))",
    }

    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            style={{
                ...baseStyles,
                ...style,
            }}
            className={cn(
                "peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 border outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <CheckIcon className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export { Checkbox }
