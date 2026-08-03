'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '~/lib/utils';

/**
 * Variant options for Alert component
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'default' | 'destructive';

/**
 * Size options for Alert component
 */
export type AlertSize = 'sm' | 'md' | 'lg';

/**
 * Props for Alert component
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Alert content */
  children: React.ReactNode;
  /** Visual variant of the alert @default 'default' */
  variant?: AlertVariant;
  /** Alert title (optional) */
  title?: string;
  /** Custom icon component (overrides default variant icon) */
  icon?: React.ComponentType<any>;
  /** Whether to show the icon @default true */
  showIcon?: boolean;
  /** Whether the alert can be dismissed @default false */
  dismissible?: boolean;
  /** Callback when alert is dismissed */
  onDismiss?: () => void;
  /** Size of the alert @default 'md' */
  size?: AlertSize;
  /** Custom className for additional styling */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Data test ID for testing */
  'data-testid'?: string;
}

/**
 * Alert - Design System Component
 *
 * Displays contextual information to users with different severity levels.
 * Supports multiple variants (info, success, warning, error, default), sizes,
 * dismissible functionality, and auto-icon.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 * ```
 *
 * @example
 * ```tsx
 * <Alert variant="error" dismissible onDismiss={() => console.log('dismissed')}>
 *   Something went wrong!
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      variant = 'default',
      title,
      icon: CustomIcon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      size = 'md',
      className,
      style,
      ...props
    },
    ref,
  ) => {
    // Get variant configuration with icon and styles
    const getVariantConfig = () => {
      switch (variant) {
        case 'info':
          return {
            icon: Info,
            containerClasses: 'bg-primary/10 border-primary',
            iconClasses: 'text-primary',
            textClasses: 'text-foreground',
          };
        case 'success':
          return {
            icon: CheckCircle,
            containerClasses: 'bg-success/10 border-success',
            iconClasses: 'text-success',
            textClasses: 'text-foreground',
          };
        case 'warning':
          return {
            icon: AlertTriangle,
            containerClasses: 'bg-warning/10 border-warning',
            iconClasses: 'text-warning',
            textClasses: 'text-foreground',
          };
        case 'error':
        case 'destructive':
          return {
            icon: AlertCircle,
            containerClasses: 'bg-destructive/10 border-destructive',
            iconClasses: 'text-destructive',
            textClasses: 'text-foreground',
          };
        default:
          return {
            icon: Info,
            containerClasses: 'bg-muted border-border',
            iconClasses: 'text-muted-foreground',
            textClasses: 'text-foreground',
          };
      }
    };

    // Get size configuration
    const getSizeConfig = () => {
      switch (size) {
        case 'sm':
          return {
            padding: 'p-3',
            gap: 'gap-2',
            fontSize: 'text-sm',
            iconSize: 16,
          };
        case 'lg':
          return {
            padding: 'p-5',
            gap: 'gap-3',
            fontSize: 'text-base',
            iconSize: 20,
          };
        default: // md
          return {
            padding: 'p-4',
            gap: 'gap-2.5',
            fontSize: 'text-sm',
            iconSize: 16,
          };
      }
    };

    const variantConfig = getVariantConfig();
    const sizeConfig = getSizeConfig();
    const IconComponent = CustomIcon || variantConfig.icon;

    // Handle dismiss
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        data-slot="alert"
        role="alert"
        className={cn(
          // Base styles
          'relative flex items-start rounded-[var(--radius-card)] border',
          // Variant styles
          variantConfig.containerClasses,
          variantConfig.textClasses,
          // Size styles
          sizeConfig.padding,
          sizeConfig.gap,
          sizeConfig.fontSize,
          // User classes
          className,
        )}
        style={style}
        {...props}
      >
        {/* Icon */}
        {showIcon && IconComponent && (
          <div className="flex-shrink-0">
            <IconComponent
              size={sizeConfig.iconSize}
              className={variantConfig.iconClasses}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <div
              data-slot="alert-title"
              className={cn('font-semibold mb-1', sizeConfig.fontSize)}
            >
              {title}
            </div>
          )}
          <div data-slot="alert-description" className="leading-relaxed">
            {children}
          </div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 hover:opacity-70 transition-opacity',
              'bg-transparent border-0 p-0.5 cursor-pointer rounded',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              variantConfig.iconClasses,
            )}
            aria-label="Dismiss alert"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';

/**
 * AlertTitle - Standalone sub-component for Alert title
 * Maintains backward compatibility with shadcn/ui patterns.
 * When using the `title` prop on Alert, this is not needed.
 */
const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-title"
      className={cn('font-semibold mb-1 text-sm', className)}
      {...props}
    />
  );
});

AlertTitle.displayName = 'AlertTitle';

/**
 * AlertDescription - Sub-component for Alert content
 * Maintains backward compatibility with shadcn/ui patterns.
 */
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn('text-sm leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
});

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
