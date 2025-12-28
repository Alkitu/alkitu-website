'use client';

import { InputProps } from './input.type';

export default function Input({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className = '',
  disabled = false,
  required = false,
  ...props
}: InputProps) {
  const hasError = !!error;

  const baseStyles = `
    w-full px-4 py-3
    bg-transparent
    border-2 rounded-lg
    text-foreground
    placeholder:text-muted-foreground
    font-medium
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    dark:bg-zinc-900/50
  `.trim().replace(/\s+/g, ' ');

  const borderStyles = hasError
    ? 'border-red-500 focus:border-red-500'
    : 'border-border focus:border-primary';

  const focusStyles = `
    focus:outline-none
    focus:ring-2
    ${hasError ? 'focus:ring-red-500/20' : 'focus:ring-primary/20'}
    focus:ring-offset-0
  `.trim().replace(/\s+/g, ' ');

  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseStyles}
    ${borderStyles}
    ${focusStyles}
    ${widthStyles}
    ${icon ? 'pl-12' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      <label className="text-sm font-bold uppercase tracking-wide text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          className={combinedClassName}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
          }
          suppressHydrationWarning
          {...props}
        />
      </div>

      {/* Error Message */}
      {hasError && (
        <p
          id={`${props.id}-error`}
          className="text-sm text-red-500 font-medium flex items-center gap-1"
        >
          <span>⚠️</span>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <p
          id={`${props.id}-helper`}
          className="text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
