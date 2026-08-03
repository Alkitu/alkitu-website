'use client';

import React from 'react';
import { cn } from '~/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/primitives/select';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterSelectProps<T extends string = string> {
  /** Currently selected value */
  value: T;
  /** Callback when selection changes */
  onValueChange: (value: T) => void;
  /** Available filter options */
  options: FilterOption<T>[];
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes for the trigger */
  className?: string;
  /** Disable the select */
  disabled?: boolean;
  /** ARIA label */
  'aria-label'?: string;
  /** Width class (default: w-[200px]) */
  width?: string;
  /** Test ID */
  'data-testid'?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FilterSelect<T extends string = string>({
  value,
  onValueChange,
  options,
  placeholder = 'Filter...',
  className,
  disabled = false,
  'aria-label': ariaLabel = 'Filter',
  width = 'w-[200px]',
  'data-testid': dataTestId = 'filter-select',
}: FilterSelectProps<T>) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as T)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(width, className)}
        data-testid={dataTestId}
        aria-label={ariaLabel}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.id}
            value={option.id}
            disabled={option.disabled}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({option.count})
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

FilterSelect.displayName = 'FilterSelect';
