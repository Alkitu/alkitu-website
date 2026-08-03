'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

/**
 * Size variants for Spinner
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variants for Spinner
 */
export type SpinnerVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'destructive'
  | 'warning'
  | 'success';

/**
 * Animation speed variants
 */
export type SpinnerSpeed = 'slow' | 'normal' | 'fast';

/**
 * Spinner type/style variants
 */
export type SpinnerType = 'circular' | 'dots' | 'pulse';

/**
 * Props for Spinner component
 */
export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Size preset of the spinner @default 'md' */
  size?: SpinnerSize;
  /** Custom size in pixels (overrides size preset) */
  customSize?: number;
  /** Color variant @default 'primary' */
  variant?: SpinnerVariant;
  /** Custom color value (overrides variant) */
  customColor?: string;
  /** Animation speed @default 'normal' */
  speed?: SpinnerSpeed;
  /** Spinner style type @default 'circular' */
  type?: SpinnerType;
  /** Optional label text next to spinner */
  label?: string;
  /** Theme override using CSS custom properties */
  themeOverride?: Record<string, string>;
  /** Whether to use system colors from theme @default true */
  useSystemColors?: boolean;
}

const spinnerVariants = cva('inline-block animate-spin rounded-full', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      '2xl': 'h-10 w-10',
    },
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      warning: 'text-warning',
      success: 'text-success',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      customSize,
      variant = 'primary',
      customColor,
      speed = 'normal',
      type = 'circular',
      label,
      className,
      themeOverride,
      useSystemColors = true,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const getSizeValue = (): number => {
      if (customSize) return customSize;
      const sizeMap: Record<SpinnerSize, number> = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        '2xl': 40,
      };
      return sizeMap[size];
    };

    const getColorValue = (): string => {
      if (customColor) return customColor;
      if (!useSystemColors) return 'currentColor';
      const colorMap: Record<SpinnerVariant, string> = {
        default: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted-foreground)',
        destructive: 'var(--color-destructive)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
      };
      return colorMap[variant];
    };

    const getAnimationDuration = (): string => {
      const speedMap: Record<SpinnerSpeed, string> = {
        slow: '2s',
        normal: '1s',
        fast: '0.5s',
      };
      return speedMap[speed];
    };

    const spinnerSize = getSizeValue();
    const spinnerColor = getColorValue();
    const animationDuration = getAnimationDuration();

    const wrapperProps = {
      ref,
      role: 'status' as const,
      'aria-label': ariaLabel || label || 'Loading...',
      'data-slot': 'spinner',
      'data-spinner-type': type,
      ...props,
    };

    if (type === 'circular') {
      const spinnerElement = (
        <svg
          className={cn(
            spinnerVariants({ size, variant }),
            !useSystemColors && 'text-current',
            className,
          )}
          style={{
            animationDuration,
            ...themeOverride,
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );

      if (label) {
        return (
          <div
            {...wrapperProps}
            className={cn('inline-flex items-center gap-2', className)}
          >
            {spinnerElement}
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        );
      }

      return (
        <div {...wrapperProps} className={cn('inline-flex', className)}>
          {spinnerElement}
        </div>
      );
    }

    if (type === 'dots') {
      const dotSize = spinnerSize / 6;
      return (
        <div
          {...wrapperProps}
          className={cn('inline-flex items-center gap-1', className)}
          style={themeOverride}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: spinnerColor,
                animation: `pulse-dot ${animationDuration} infinite ease-in-out`,
                animationDelay: `${index * 0.16}s`,
              }}
            />
          ))}
          {label && (
            <span className="ml-2 text-sm text-muted-foreground">{label}</span>
          )}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes pulse-dot {
                0%, 80%, 100% {
                  transform: scale(0.8);
                  opacity: 0.5;
                }
                40% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            `,
            }}
          />
        </div>
      );
    }

    if (type === 'pulse') {
      return (
        <div
          {...wrapperProps}
          className={cn('inline-flex items-center gap-2', className)}
        >
          <div
            className="rounded-full"
            style={{
              width: spinnerSize,
              height: spinnerSize,
              backgroundColor: spinnerColor,
              animation: `pulse-scale ${animationDuration} infinite ease-in-out`,
              ...themeOverride,
            }}
          />
          {label && (
            <span className="text-sm text-muted-foreground">{label}</span>
          )}
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes pulse-scale {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }
                50% {
                  transform: scale(1.2);
                  opacity: 0.7;
                }
              }
            `,
            }}
          />
        </div>
      );
    }

    return null;
  },
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
