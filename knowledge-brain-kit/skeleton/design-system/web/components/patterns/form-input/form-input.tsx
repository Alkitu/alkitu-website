'use client';

import React, { forwardRef } from 'react';
import { cn } from '~/lib/utils';

/**
 * FormInput Component Props
 *
 * Props interface for the FormInput composed component, which provides
 * a complete form input with label, optional icons, and error display.
 */
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The label text displayed above the input field. */
  label: string;

  /** Optional icon to display on the left side of the input. */
  icon?: React.ReactNode;

  /** Optional icon to display on the right side of the input. */
  iconRight?: React.ReactNode;

  /** Error message to display below the input field. */
  error?: string;
}

/**
 * FormInput – Design System Composed Component
 *
 * A composed component that combines a label, input field, optional icons,
 * and error message display into a complete form input element.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FormInput label="Email" type="email" placeholder="Enter your email" />
 *
 * // With icons
 * <FormInput
 *   label="Password"
 *   type="password"
 *   icon={<LockIcon />}
 *   iconRight={<EyeIcon />}
 * />
 *
 * // With error
 * <FormInput
 *   label="Username"
 *   error="Username is required"
 *   value=""
 * />
 * ```
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, iconRight, error, className, id, ...props }, ref) => {
    const inputId = id || `form-input-${React.useId()}`;

    return (
      <div
        className={cn('flex flex-col gap-2 items-start w-full', className)}
        data-testid="form-input-wrapper"
      >
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          data-testid="form-input-label"
        >
          {label}
        </label>
        <div
          className={cn(
            'flex h-10 w-full rounded-[var(--radius-input)] border bg-background px-3 items-center gap-2 ring-offset-background transition-colors relative',
            error
              ? 'border-destructive focus-within:ring-destructive'
              : 'border-input focus-within:ring-primary',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
            props.disabled && 'cursor-not-allowed opacity-50 bg-muted',
          )}
          data-testid="form-input-container"
        >
          {icon && (
            <div
              className="shrink-0 flex items-center justify-center text-muted-foreground [&>svg]:size-4"
              data-testid="form-input-icon-left"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className="flex-1 w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            data-testid="form-input-field"
            {...props}
          />
          {iconRight && (
            <div
              className="shrink-0 flex items-center justify-center text-muted-foreground"
              data-testid="form-input-icon-right"
            >
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
            data-testid="form-input-error"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
