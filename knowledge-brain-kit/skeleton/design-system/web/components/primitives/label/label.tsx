"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "~/lib/utils"

function Label({
    className,
    style,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const baseStyles: React.CSSProperties = {
        fontFamily: "var(--typography-label-family, var(--font-sans))",
        fontSize: "var(--typography-label-size, 0.875rem)",
        fontWeight: "var(--typography-label-weight, 500)",
        lineHeight: "var(--typography-label-line-height, 1.25rem)",
        transition:
            "all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))",
    }

    return (
        <LabelPrimitive.Root
            data-slot="label"
            style={{
                ...baseStyles,
                ...style,
            }}
            className={cn(
                "flex items-center gap-2 leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
}

export { Label }
