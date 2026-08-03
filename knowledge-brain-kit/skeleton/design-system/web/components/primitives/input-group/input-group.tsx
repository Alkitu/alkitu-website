"use client"

import * as React from "react"
import { cn } from "~/lib/utils"

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "flex h-9 items-center rounded-md border border-border bg-transparent overflow-hidden px-1 shadow-sm focus-within:ring-2 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
})
InputGroup.displayName = "InputGroup"

const InputGroupText = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-center px-2 text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    )
})
InputGroupText.displayName = "InputGroupText"

export { InputGroup, InputGroupText }
