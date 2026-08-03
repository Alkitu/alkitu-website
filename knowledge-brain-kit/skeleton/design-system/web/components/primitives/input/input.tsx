'use client';

/**
 * Input Component - Pure Atom (No Label/Description)
 *
 * A theme-aware input atom that handles only the input element itself.
 * For composed inputs with labels and error messages, use FormInput molecule.
 *
 * Features:
 * - Multiple variants (default, filled, outline)
 * - Three sizes (sm, md, lg)
 * - Validation states (default, error, success, warning)
 * - Full HTML input type support
 * - Theme integration with CSS variables
 * - Accessibility built-in (ARIA attributes)
 * - forwardRef for parent component access
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input type="text" placeholder="Enter text..." />
 *
 * // With variant and size
 * <Input variant="filled" size="lg" placeholder="Large filled input" />
 *
 * // Error state
 * <Input state="error" placeholder="Invalid input" />
 *
 * // With ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} />
 * ```
 */

import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Input variant types */
export type InputVariant = 'default' | 'filled' | 'outline';

/** Input size types */
export type InputSize = 'sm' | 'md' | 'lg';

/** Input validation state types */
export type InputState = 'default' | 'error' | 'success' | 'warning';

/**
 * Props for Input component (Pure Atom - No label/description)
 *
 * This is a pure atom component that handles only the input element itself.
 * For composed inputs with labels, use FormInput molecule.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual variant of the input @default 'default' */
  variant?: InputVariant;

  /** Size of the input @default 'md' */
  size?: InputSize;

  /** Validation state of the input @default 'default' */
  state?: InputState;

  /** Icon element to display on the left side of the input */
  leftIcon?: React.ReactNode;

  /** Icon element to display on the right side of the input */
  rightIcon?: React.ReactNode;

  /**
   * Show a password visibility toggle button on the right side.
   * Only applicable when type="password"
   * @default false
   */
  showPasswordToggle?: boolean;

  /** Custom className for additional styling */
  className?: string;

  /** Theme variable overrides for custom styling */
  themeOverride?: React.CSSProperties;

  /**
   * Whether to use system colors (for special cases)
   * @default true
   */
  useSystemColors?: boolean;
}

// ---------------------------------------------------------------------------
// Style mappings
// ---------------------------------------------------------------------------

const variantClasses: Record<InputVariant, string> = {
  default: 'border-input bg-background',
  filled: 'border-transparent bg-muted',
  outline: 'border-2 border-input bg-transparent',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
};

const stateClasses: Record<InputState, string> = {
  default: '',
  error: 'border-destructive focus-visible:ring-destructive',
  success: 'border-success focus-visible:ring-success',
  warning: 'border-warning focus-visible:ring-warning',
};

const baseClasses =
  'flex w-full rounded-[var(--radius-input)] border transition-colors ' +
  'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
  'placeholder:text-muted-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const iconPaddingClasses = {
  sm: { left: 'pl-8', right: 'pr-8' },
  md: { left: 'pl-10', right: 'pr-10' },
  lg: { left: 'pl-12', right: 'pr-12' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Input atom component - Pure input element without label/description composition
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      className,
      themeOverride,
      useSystemColors = true,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const finalType = showPasswordToggle
      ? (showPassword ? 'text' : 'password')
      : type;

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!(rightIcon || showPasswordToggle);

    const variantClass = useSystemColors ? variantClasses[variant] : '';
    const sizeClass = sizeClasses[size];
    const stateClass = stateClasses[state];

    const inputElement = (
      <input
        ref={ref}
        type={finalType}
        data-slot="input"
        className={cn(
          baseClasses,
          variantClass,
          sizeClass,
          stateClass,
          hasLeftIcon && iconPaddingClasses[size].left,
          hasRightIcon && iconPaddingClasses[size].right,
          className,
        )}
        style={themeOverride}
        {...props}
      />
    );

    // No icons — render input directly without wrapper
    if (!hasLeftIcon && !hasRightIcon) {
      return inputElement;
    }

    const finalRightIcon = showPasswordToggle ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    ) : rightIcon;

    return (
      <div className="relative w-full">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        {inputElement}
        {finalRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {finalRightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
