'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import { Spinner } from '~/components/primitives/spinner';

// ---------------------------------------------------------------------------
// CVA buttonVariants – kept for backward compatibility across the codebase.
// These map to the "legacy/Standard" variant names used by shadcn consumers.
// The Button component itself uses its own richer variant system (see below).
// ---------------------------------------------------------------------------

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='h-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
        outline:
          'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'size-9 p-0 [&_svg]:size-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant =
  | 'main'
  | 'active'
  | 'outline'
  | 'nude'
  | 'solid'
  | 'ghost'
  | 'destructive'
  | 'primary'
  | 'secondary'
  | 'default'
  | 'link'
  | 'loading'
  | 'icon'
  | 'warning'
  | 'error'
  | 'success';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'default' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button @default 'main' */
  variant?: ButtonVariant;
  /** Size of the button @default 'md' */
  size?: ButtonSize;
  /** Whether the button is disabled @default false */
  disabled?: boolean;
  /** Whether the button is in loading state. Shows spinner and disables interaction @default false */
  loading?: boolean;
  /** Icon to display on the left side */
  iconLeft?: React.ReactNode;
  /** Icon to display on the right side */
  iconRight?: React.ReactNode;
  /** Whether this is an icon-only button (square aspect ratio) @default false */
  iconOnly?: boolean;
  /** Whether the button should take full width @default false */
  fullWidth?: boolean;
  /** Button content */
  children?: React.ReactNode;
  /** Theme variable overrides for custom styling */
  themeOverride?: Record<string, string>;
  /** Use as child component (renders styles on the child element via Radix Slot) @default false */
  asChild?: boolean;
  /** Custom class name to merge with button styles */
  className?: string;
}

// ---------------------------------------------------------------------------
// Button Component
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'main',
      size = 'md',
      disabled = false,
      loading = false,
      iconLeft,
      iconRight,
      iconOnly = false,
      fullWidth = false,
      children,
      className = '',
      onClick,
      themeOverride,
      asChild = false,
      ...restProps
    } = props;

    // Map legacy / Standard variants to design system variants
    const variantMap: Record<string, string> = {
      solid: 'main',
      ghost: 'nude',
      primary: 'main',
      secondary: 'outline',
      main: 'main',
      active: 'active',
      outline: 'outline',
      nude: 'nude',
      destructive: 'destructive',
      default: 'main',
      link: 'nude',
      loading: 'main',
      icon: 'main',
      warning: 'main',
      error: 'destructive',
      success: 'main',
    };
    const finalVariant = variantMap[variant] || 'main';

    // Variant styles using CSS variables
    const variantClasses: Record<string, string> = {
      main: [
        'bg-primary text-primary-foreground',
        'border-transparent',
        'hover:bg-primary/90',
        'focus-visible:ring-primary/20',
        'shadow-sm',
      ].join(' '),

      active: [
        'bg-accent text-accent-foreground',
        'border-transparent',
        'hover:opacity-90',
      ].join(' '),

      outline: [
        'border-primary text-primary',
        'bg-background',
        'hover:bg-primary/10',
      ].join(' '),

      nude: [
        'text-primary bg-transparent',
        'border-transparent',
        'hover:bg-primary/10',
        'shadow-none',
      ].join(' '),

      destructive: [
        'bg-destructive text-destructive-foreground',
        'border-transparent',
        'hover:bg-destructive/90',
        'shadow-sm',
      ].join(' '),
    };

    // Map legacy size values
    const sizeMap: Record<string, string> = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      default: 'md',
      icon: 'md',
    };
    const finalSize = sizeMap[size] || 'md';

    // Size styles
    const sizeClasses: Record<string, string> = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    // Treat size="icon" as iconOnly automatically
    const isIconOnly = iconOnly || size === 'icon';

    // Icon only: square aspect ratio, remove horizontal padding, let SVG size itself
    const iconOnlyClasses: Record<string, string> = {
      sm: 'aspect-square px-0 w-8 [&>svg]:size-auto',
      md: 'aspect-square px-0 w-10 [&>svg]:size-auto',
      lg: 'aspect-square px-0 w-12 [&>svg]:size-auto',
    };

    // Icon size for inline icons
    const iconSizeClasses =
      finalSize === 'sm' ? '[&>svg]:size-3.5' : '[&>svg]:size-4';

    const isDisabled = disabled || loading;

    const classes = cn([
      // Base classes
      'cursor-pointer inline-flex items-center justify-center',
      'rounded-md',
      'transition-all duration-200',
      'font-medium border whitespace-nowrap gap-2',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',

      // Dynamic variant and size
      variantClasses[finalVariant],
      sizeClasses[finalSize],

      // Icon only (explicit prop or size="icon")
      isIconOnly && iconOnlyClasses[finalSize],

      // Full width
      fullWidth && 'w-full',

      // User-provided classes
      className,
    ]);

    // Apply typography CSS vars + theme overrides
    const inlineStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};

      if (themeOverride) {
        Object.entries(themeOverride).forEach(([property, value]) => {
          const cssProp = property.startsWith('--') ? property : `--${property}`;
          (styles as Record<string, string>)[cssProp] = value;
        });
      }

      return styles;
    }, [themeOverride]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled && onClick) {
        onClick(e);
      }
    };

    // Disable asChild when button has decorations (icon/loading)
    // or when children contains multiple React elements
    const hasMultipleChildren = React.Children.count(children) > 1;
    const shouldUseSlot =
      asChild && !iconLeft && !iconRight && !loading && !hasMultipleChildren;
    const Comp = shouldUseSlot ? Slot : 'button';

    const renderContent = () => {
      // If using asChild with valid single child, return as-is
      if (shouldUseSlot) {
        return children;
      }

      return (
        <>
          {loading && (
            <span className="shrink-0 flex items-center justify-center">
              <Spinner size="sm" />
            </span>
          )}
          {!loading && iconLeft && (
            <span
              className={`${iconSizeClasses} shrink-0 flex items-center justify-center`}
            >
              {iconLeft}
            </span>
          )}
          {children}
          {!loading && iconRight && (
            <span
              className={`${iconSizeClasses} shrink-0 flex items-center justify-center`}
            >
              {iconRight}
            </span>
          )}
        </>
      );
    };

    return (
      <Comp
        ref={ref}
        className={classes}
        disabled={isDisabled}
        onClick={handleClick}
        style={inlineStyles}
        data-slot="button"
        data-testid="button"
        {...restProps}
      >
        {renderContent()}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

/** CVA-level variant props for consumers that call buttonVariants() directly (e.g. calendar, pagination). */
export type ButtonCVAVariantProps = VariantProps<typeof buttonVariants>;

export { Button, buttonVariants };
