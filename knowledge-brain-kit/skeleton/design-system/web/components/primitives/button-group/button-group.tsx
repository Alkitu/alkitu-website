"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const buttonGroupVariants = cva(
    "inline-flex flex-wrap items-center justify-center rounded-md",
    {
        variants: {
            orientation: {
                horizontal: "flex-row",
                vertical: "flex-col",
            },
        },
        defaultVariants: {
            orientation: "horizontal",
        },
    }
)

export interface ButtonGroupProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
    asChild?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
    ({ className, orientation, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "div"
        return (
            <Comp
                ref={ref}
                role="group"
                className={cn(
                    buttonGroupVariants({ orientation, className }),
                    // Logic for Horizontal Group: Remove rounded corners for inner items, add borders to separate
                    orientation === "horizontal" && [
                        "[&>button:first-child]:rounded-r-none",
                        "[&>button:last-child]:rounded-l-none",
                        "[&>button:not(:first-child):not(:last-child)]:rounded-none",
                        // Add a subtle border separator to outline/secondary buttons to distinguish them if they are adjacent
                        "[&>button[data-variant='outline']:not(:first-child)]:-ml-px",
                    ],
                    // Logic for Vertical Group: Remove rounded corners for inner items
                    orientation === "vertical" && [
                        "[&>button]:w-full",
                        "[&>button:first-child]:rounded-b-none",
                        "[&>button:last-child]:rounded-t-none",
                        "[&>button:not(:first-child):not(:last-child)]:rounded-none",
                        "[&>button[data-variant='outline']:not(:first-child)]:-mt-px",
                    ]
                )}
                {...props}
            />
        )
    }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup, buttonGroupVariants }
