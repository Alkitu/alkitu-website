'use client';

import React from 'react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * CheckboxField component props
 *
 * Composed component that wraps the DS Checkbox with a label and description.
 */
export interface CheckboxFieldProps {
  /**
   * Whether the checkbox is checked
   * @default false
   */
  checked?: boolean;

  /**
   * Callback fired when the checked state changes
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes to apply to the checkbox button
   */
  className?: string;
}

// ---------------------------------------------------------------------------
// Internal Constants
// ---------------------------------------------------------------------------

const CHECK_PATH = "M10.665 1.56249L3.79 8.43749L0.665 5.31249";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * CheckboxField - Design System Composed Component
 *
 * A custom checkbox component with a visually styled check indicator.
 * Provides a controlled checkbox alternative to the native HTML checkbox,
 * with customizable appearance and state management.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CheckboxField checked={isChecked} onCheckedChange={setIsChecked} />
 *
 * // With custom styling
 * <CheckboxField
 *   checked={agreed}
 *   onCheckedChange={setAgreed}
 *   className="ml-2"
 * />
 * ```
 */
export function CheckboxField({ checked = false, onCheckedChange, disabled, className }: CheckboxFieldProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'content-stretch flex items-center justify-center p-0.5 relative rounded shrink-0 w-5 h-5 border border-solid cursor-pointer',
        checked ? 'bg-primary border-transparent' : 'bg-background border-input',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      data-name="CheckboxField"
      data-testid="checkbox"
    >
      <svg
        viewBox="0 0 11.33 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={checked ? 'opacity-100 size-[var(--icon-size-xs)]' : 'opacity-0 size-[var(--icon-size-xs)]'}
      >
        <path
          d={CHECK_PATH}
          stroke="white"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

CheckboxField.displayName = 'CheckboxField';
