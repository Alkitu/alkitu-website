import * as React from "react";
import { cn } from "~/lib/utils";

function Card({
    className,
    style,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col border",
                "hover:shadow-[var(--shadow-card-hover,var(--shadow-lg))]",
                className
            )}
            style={{
                borderRadius:
                    "var(--radius-card, calc(var(--radius, 0.375rem) + 4px))",
                boxShadow: "var(--shadow-card, var(--shadow-md))",
                gap: "var(--spacing-lg, 1.5rem)",
                transition:
                    "all var(--transition-base, 200ms cubic-bezier(0.4, 0, 0.2, 1))",
                ...style,
            }}
            {...props}
        />
    );
}
Card.displayName = "Card";

function CardHeader({
    className,
    style,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card-header"
            className={cn(
                "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
                className
            )}
            style={{
                paddingLeft: "var(--spacing-lg, 1.5rem)",
                paddingRight: "var(--spacing-lg, 1.5rem)",
                paddingTop: "var(--spacing-lg, 1.5rem)",
                ...style,
            }}
            {...props}
        />
    );
}
CardHeader.displayName = "CardHeader";

function CardTitle({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card-title"
            className={cn(
                "font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        />
    );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
    className,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}
CardDescription.displayName = "CardDescription";

function CardAction({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className
            )}
            {...props}
        />
    );
}
CardAction.displayName = "CardAction";

function CardContent({
    className,
    style,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card-content"
            className={cn("pb-6", className)}
            style={{
                paddingLeft: "var(--spacing-lg, 1.5rem)",
                paddingRight: "var(--spacing-lg, 1.5rem)",
                ...style,
            }}
            {...props}
        />
    );
}
CardContent.displayName = "CardContent";

function CardFooter({
    className,
    style,
    ref,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    ref?: React.Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            data-slot="card-footer"
            className={cn("flex items-center [.border-t]:pt-6", className)}
            style={{
                paddingLeft: "var(--spacing-lg, 1.5rem)",
                paddingRight: "var(--spacing-lg, 1.5rem)",
                paddingBottom: "var(--spacing-lg, 1.5rem)",
                ...style,
            }}
            {...props}
        />
    );
}
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
    CardContent,
    CardFooter,
};
