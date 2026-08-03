"use client"

import * as React from "react"
import { FolderX } from "lucide-react"
import { cn } from "~/lib/utils"

const Empty = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-dashed py-12 px-8 text-center animate-in fade-in-50",
            className
        )}
        {...props}
    />
))
Empty.displayName = "Empty"

const EmptyIcon = ({
    icon: Icon = FolderX,
    className,
}: {
    icon?: React.ComponentType<{ className?: string }>
    className?: string
}) => (
    <div
        className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4",
            className
        )}
    >
        <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
)

const EmptyTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold text-lg tracking-tight", className)}
        {...props}
    />
))
EmptyTitle.displayName = "EmptyTitle"

const EmptyDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("mt-2 text-sm text-muted-foreground max-w-sm", className)}
        {...props}
    />
))
EmptyDescription.displayName = "EmptyDescription"

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription }
