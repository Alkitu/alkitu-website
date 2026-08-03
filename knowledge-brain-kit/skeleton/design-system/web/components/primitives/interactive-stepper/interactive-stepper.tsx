"use client"

import * as React from "react"
import { cn } from "~/lib/utils"
import { Check } from "lucide-react"

interface StepperContextValue {
    activeStep: number
    setActiveStep: (step: number) => void
    orientation: "horizontal" | "vertical"
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

function useStepper() {
    const context = React.useContext(StepperContext)
    if (!context) {
        throw new Error("Stepper components must be used within InteractiveStepper")
    }
    return context
}

interface StepperItemContextValue {
    step: number
    isCompleted: boolean
    isActive: boolean
    isLast: boolean
}

const StepperItemContext = React.createContext<StepperItemContextValue | undefined>(undefined)

function useStepperItem() {
    const context = React.useContext(StepperItemContext)
    if (!context) {
        throw new Error("StepperItem components must be used within InteractiveStepperItem")
    }
    return context
}

export const InteractiveStepper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        orientation?: "horizontal" | "vertical"
        defaultValue?: number
        value?: number
        onValueChange?: (value: number) => void
    }
>(({ className, orientation = "horizontal", defaultValue = 1, value, onValueChange, children, ...props }, ref) => {
    const [internalStep, setInternalStep] = React.useState(defaultValue)
    const activeStep = value !== undefined ? value : internalStep
    const setActiveStep = (step: number) => {
        if (value === undefined) setInternalStep(step)
        onValueChange?.(step)
    }

    const items: React.ReactElement[] = []
    const contents: React.ReactElement[] = []

    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            if (child.type?.displayName === "InteractiveStepperContent") {
                contents.push(child)
            } else {
                items.push(child)
            }
        }
    })

    // Provide step context down directly rather than mapping cloneElement sequentially if we mix content/items,
    // but let's safely assign step increment based on InteractiveStepperItem type elements inside the first array:
    let currentStep = 1;
    const renderItems = items.map((child, index) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "InteractiveStepperItem") {
            const step = currentStep++;
            return React.cloneElement(child, {
                key: step,
                // @ts-ignore
                step,
                isLast: index === items.length - 1,
            });
        }
        return child;
    });

    return (
        <StepperContext.Provider value={{ activeStep, setActiveStep, orientation }}>
            <div
                ref={ref}
                className={cn(
                    "flex w-full",
                    orientation === "horizontal" ? "flex-col gap-8" : "flex-row gap-8",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(
                        "flex",
                        orientation === "horizontal" ? "flex-row items-start w-full" : "flex-col gap-4 w-64"
                    )}
                >
                    {renderItems}
                </div>
                {contents.length > 0 && (
                    <div className="w-full">
                        {contents}
                    </div>
                )}
            </div>
        </StepperContext.Provider>
    )
})
InteractiveStepper.displayName = "InteractiveStepper"

export const InteractiveStepperItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        completed?: boolean
        step?: number
        isLast?: boolean
    }
>(({ className, completed, step = 1, isLast = false, children, ...props }, ref) => {
    const { activeStep, orientation } = useStepper()
    const isActive = activeStep === step
    const isCompleted = completed ?? activeStep > step

    return (
        <StepperItemContext.Provider value={{ step, isCompleted, isActive, isLast }}>
            <div
                ref={ref}
                className={cn(
                    "group relative flex",
                    orientation === "horizontal" ? (isLast ? "flex-none" : "flex-1 items-center") : "flex-col"
                )}
                {...props}
            >
                {children}
            </div>
        </StepperItemContext.Provider>
    )
})
InteractiveStepperItem.displayName = "InteractiveStepperItem"

export const InteractiveStepperTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper()
    const { step, isActive, isCompleted } = useStepperItem()

    return (
        <button
            ref={ref}
            className={cn(
                "flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-2 transition-opacity hover:opacity-80",
                className
            )}
            onClick={() => setActiveStep(step)}
            {...props}
        >
            {children}
        </button>
    )
})
InteractiveStepperTrigger.displayName = "InteractiveStepperTrigger"

export const InteractiveStepperIndicator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { isActive, isCompleted, step } = useStepperItem()

    return (
        <div
            ref={ref}
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                isActive ? "border-primary bg-primary text-primary-foreground" :
                    isCompleted ? "border-primary bg-primary text-primary-foreground" :
                        "border-muted text-muted-foreground",
                className
            )}
            {...props}
        >
            {children || (isCompleted ? <Check className="h-4 w-4" /> : step)}
        </div>
    )
})
InteractiveStepperIndicator.displayName = "InteractiveStepperIndicator"

export const InteractiveStepperTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
    const { isActive, isCompleted } = useStepperItem()
    return (
        <h3
            ref={ref}
            className={cn(
                "text-sm font-semibold transition-colors",
                (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground",
                className
            )}
            {...props}
        />
    )
})
InteractiveStepperTitle.displayName = "InteractiveStepperTitle"

export const InteractiveStepperDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    return (
        <p
            ref={ref}
            className={cn("text-xs text-muted-foreground max-w-[200px]", className)}
            {...props}
        />
    )
})
InteractiveStepperDescription.displayName = "InteractiveStepperDescription"

export const InteractiveStepperSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { orientation } = useStepper()
    const { isCompleted, isLast } = useStepperItem()

    if (isLast) return null

    return (
        <div
            ref={ref}
            className={cn(
                "bg-border transition-colors",
                isCompleted && "bg-primary",
                orientation === "horizontal"
                    ? "mx-4 h-[2px] flex-1 min-w-[2rem]"
                    : "my-2 ml-4 h-8 w-[2px]", // Fixed left offset to match indicator
                className
            )}
            {...props}
        />
    )
})
InteractiveStepperSeparator.displayName = "InteractiveStepperSeparator"

export const InteractiveStepperContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { step: number }
>(({ className, step, ...props }, ref) => {
    const { activeStep } = useStepper()

    if (activeStep !== step) return null

    return (
        <div
            ref={ref}
            className={cn("mt-4 animate-in fade-in slide-in-from-bottom-2", className)}
            {...props}
        />
    )
})
InteractiveStepperContent.displayName = "InteractiveStepperContent"
