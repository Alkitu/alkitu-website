"use client";

import * as React from "react";
import ReactTextareaAutosize, {
    TextareaAutosizeProps,
} from "react-textarea-autosize";
import { cn } from "~/lib/utils";

export interface AutosizeTextareaProps
    extends Omit<TextareaAutosizeProps, "style" | "ref"> {
    className?: string;
    ref?: React.Ref<HTMLTextAreaElement>;
}

export const AutosizeTextarea = React.forwardRef<
    HTMLTextAreaElement,
    AutosizeTextareaProps
>(({ className, ...props }, ref) => {
    return (
        <ReactTextareaAutosize
            className={cn(
                "flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
AutosizeTextarea.displayName = "AutosizeTextarea";
