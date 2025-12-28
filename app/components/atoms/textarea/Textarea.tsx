'use client';

import { TextareaProps } from './textarea.type';

export default function Textarea({
  label,
  error,
  helperText,
  fullWidth = true,
  resize = false,
  className = '',
  disabled = false,
  required = false,
  rows = 5,
  ...props
}: TextareaProps) {
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
    min-h-[120px]
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

  const resizeStyles = resize ? 'resize-y' : 'resize-none';
  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseStyles}
    ${borderStyles}
    ${focusStyles}
    ${resizeStyles}
    ${widthStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      <label className="text-sm font-bold uppercase tracking-wide text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>

      {/* Textarea Field */}
      <textarea
        className={combinedClassName}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
        }
        suppressHydrationWarning
        {...props}
      />

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
