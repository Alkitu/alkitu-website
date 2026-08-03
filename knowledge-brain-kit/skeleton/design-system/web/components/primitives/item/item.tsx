"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const itemVariants = cva(
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:bg-secondary/50 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-transparent text-foreground",
                secondary: "bg-secondary text-secondary-foreground",
            },
            size: {
                default: "min-h-10",
                sm: "min-h-8 px-2 py-1 text-xs",
                lg: "min-h-12 px-4 py-3 gap-4 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ItemProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof itemVariants> {
    asChild?: boolean
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ className, variant, size, asChild = false, startContent, endContent, title, description, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "div"

        if (asChild) {
            return (
                <Comp
                    ref={ref}
                    className={cn(itemVariants({ variant, size, className }))}
                    {...props}
                >
                    {children}
                </Comp>
            )
        }

        return (
            <Comp
                ref={ref}
                className={cn(itemVariants({ variant, size, className }))}
                {...props}
            >
                {startContent && <div className="shrink-0 text-muted-foreground flex items-center">{startContent}</div>}

                <div className="flex flex-col flex-1 overflow-hidden">
                    {title && <span className="font-medium truncate">{title}</span>}
                    {description && <span className="text-xs text-muted-foreground truncate">{description}</span>}
                    {children && <div className="mt-1">{children}</div>}
                </div>

                {endContent && <div className="shrink-0 flex items-center">{endContent}</div>}
            </Comp>
        )
    }
)
Item.displayName = "Item"

export { Item, itemVariants }
