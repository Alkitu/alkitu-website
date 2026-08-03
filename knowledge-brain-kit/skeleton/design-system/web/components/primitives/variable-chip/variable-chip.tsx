"use client";

import * as React from "react";

interface VariableChipProps {
    /** The variable placeholder, e.g. "{{user.name}}" */
    variable: string;
    /** Callback when chip is clicked */
    onClick: (variable: string) => void;
}

/**
 * VariableChip - A compact chip for displaying and inserting template variables.
 */
function VariableChip({ variable, onClick }: VariableChipProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(variable)}
            className="inline-flex items-center px-2 py-1 text-xs font-mono rounded-md border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title={`Click to insert ${variable}`}
            data-slot="variable-chip"
        >
            {variable}
        </button>
    );
}
VariableChip.displayName = "VariableChip";

export { VariableChip };
export type { VariableChipProps };
