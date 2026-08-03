import * as React from "react";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/primitives/select";

export interface PeriodOption {
  value: string;
  label: string;
}

export interface PeriodSelectorProps {
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** Array of period options to display */
  options: PeriodOption[];
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Width class for the trigger (default: "w-[180px]") */
  triggerClassName?: string;
  /** Optional className for the outer wrapper */
  className?: string;
}

function PeriodSelector({
  value,
  onValueChange,
  options,
  placeholder = "Select period",
  triggerClassName,
  className,
}: PeriodSelectorProps) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("w-[180px]", triggerClassName)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
PeriodSelector.displayName = "PeriodSelector";

export { PeriodSelector };
