'use client';

import React from 'react';
import { cn } from '~/lib/utils';
import {
  EnhancedSelect,
  type EnhancedSelectOption,
  type EnhancedSelectGroupOption,
  type EnhancedSelectVariant,
  type EnhancedSelectSize,
} from '~/components/primitives/select';

/**
 * Props for FormSelect component
 */
export interface FormSelectProps {
  /** Label text displayed above the select */
  label: string;

  /** Available options for selection (flat or grouped) */
  options: EnhancedSelectOption[] | EnhancedSelectGroupOption[];

  /** Controlled value */
  value: string;

  /** Callback when value changes */
  onValueChange: (value: string) => void;

  /**
   * Placeholder text when no value is selected
   * @default 'Select an option...'
   */
  placeholder?: string;

  /** Icon displayed on the left side of the trigger */
  icon?: React.ReactNode;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /** Error message to display */
  error?: string;

  /** Helper text to display below the select */
  helperText?: string;

  /** Custom className for the wrapper */
  className?: string;

  /**
   * Visual variant of the select
   * @default 'default'
   */
  variant?: EnhancedSelectVariant;

  /**
   * Size of the select
   * @default 'md'
   */
  size?: EnhancedSelectSize;

  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /** Name attribute for forms */
  name?: string;

  /** ID attribute */
  id?: string;

  /**
   * Show optional indicator
   * @default false
   */
  showOptional?: boolean;
}

/**
 * FormSelect – Design System Composed Component
 *
 * A composite form field component that combines a label, select input,
 * optional icon, error message, and helper text.
 *
 * @example
 * ```tsx
 * <FormSelect
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' }
 *   ]}
 *   value={country}
 *   onValueChange={setCountry}
 *   placeholder="Select your country"
 * />
 * ```
 */
export const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      label,
      options,
      value,
      onValueChange,
      placeholder = 'Select an option...',
      icon,
      disabled = false,
      error,
      helperText,
      className,
      variant = 'default',
      size = 'md',
      required = false,
      name,
      id,
      showOptional = false,
    },
    ref,
  ) => {
    const selectId =
      id || `form-select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperTextId = helperText ? `${selectId}-helper` : undefined;
    const ariaDescribedBy =
      [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-2 items-start w-full', className)}
      >
        {/* Label */}
        <label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium leading-none',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            'text-foreground',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {!required && showOptional && (
            <span className="text-muted-foreground ml-1 font-normal">
              (optional)
            </span>
          )}
        </label>

        {/* Select with optional icon */}
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-4">
                {icon}
              </div>
            </div>
          )}

          <EnhancedSelect
            id={selectId}
            name={name}
            options={options}
            value={value}
            onValueChange={onValueChange}
            placeholder={placeholder}
            disabled={disabled}
            variant={variant}
            size={size}
            required={required}
            isInvalid={!!error}
            className={cn(icon && 'pl-10')}
            aria-describedby={ariaDescribedBy}
            aria-invalid={!!error}
            aria-required={required}
          />
        </div>

        {/* Error message */}
        {error && (
          <span
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <span id={helperTextId} className="text-sm text-muted-foreground">
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';
