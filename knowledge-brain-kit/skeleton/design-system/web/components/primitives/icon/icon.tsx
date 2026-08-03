'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '~/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type IconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type IconPosition = 'left' | 'right' | 'top' | 'bottom';

export interface IconProps {
  /**
   * Icon name (without 'Icon' suffix) - resolved via iconRegistry.
   * Provide either `name` or `component` (at least one required).
   */
  name?: string;

  /**
   * Lucide icon component passed directly.
   * Provide either `name` or `component` (at least one required).
   */
  component?: LucideIcon;

  /**
   * Application-level icon registry (map of camelCase icon keys to components).
   * When using `name`, the component looks up `iconRegistry[normalizedName]`.
   */
  iconRegistry?: Record<string, React.ComponentType<any>>;

  /** Size of the icon. @default 'md' */
  size?: IconSize;

  /** Visual variant of the icon. @default 'default' */
  variant?: IconVariant;

  /** Custom color (overrides variant). */
  color?: string;

  /** Additional CSS classes. */
  className?: string;

  /** Position when used within other components. @default 'left' */
  position?: IconPosition;

  /** Accessibility label. */
  'aria-label'?: string;

  /** Whether the icon is hidden from screen readers. Use true for decorative icons. */
  'aria-hidden'?: boolean | string;

  /** Theme variable overrides for custom styling. */
  themeOverride?: React.CSSProperties;

  /** Whether to use system colors (for special cases). @default true */
  useSystemColors?: boolean;

  /** Loading state - shows spinner icon. @default false */
  loading?: boolean;

  /** Click handler for interactive icons. */
  onClick?: () => void;

  /** Additional HTML attributes. */
  role?: string;
  tabIndex?: number;
  'data-testid'?: string;
}

/**
 * Type for Lucide icon components.
 */
export type IconComponent = LucideIcon;

/**
 * Size mapping in pixels.
 */
export interface IconSizeMap {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Variant to CSS class mapping.
 */
export interface IconVariantMap {
  default: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  muted: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const sizeMap: IconSizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
};

const variantClasses: IconVariantMap = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Icon - Design System Atom
 *
 * Universal icon component that wraps Lucide React icons with consistent sizing,
 * theming, and accessibility features.
 *
 * Uses an `iconRegistry` prop so the DS stays decoupled from any app-specific
 * icon catalogue. The host app passes its own registry; the DS never imports it
 * directly.
 *
 * @example
 * ```tsx
 * // With direct component
 * import { Heart } from 'lucide-react';
 * <Icon component={Heart} size="md" variant="primary" />
 *
 * // With name + registry (typically pre-injected by a wrapper)
 * <Icon name="heart" iconRegistry={Icons} />
 * ```
 */
export const Icon = React.forwardRef<HTMLElement, IconProps>(
  (
    {
      name,
      component,
      iconRegistry,
      size = 'md',
      variant = 'default',
      color,
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      useSystemColors = true,
      themeOverride,
      loading = false,
      onClick,
      role,
      tabIndex,
      'data-testid': dataTestId,
      position: _position,
      ...props
    },
    ref
  ) => {
    // Show spinner when loading
    if (loading) {
      const iconSize = sizeMap[size];
      const variantClass = useSystemColors ? variantClasses[variant] : '';

      return (
        <Loader2
          ref={ref as any}
          size={iconSize}
          color={color}
          className={cn(variantClass, 'animate-spin', className)}
          aria-label={ariaLabel || 'Loading'}
          aria-hidden={ariaHidden as boolean | undefined}
          data-testid={dataTestId}
          style={themeOverride}
        />
      );
    }

    // Resolve the icon: either from direct component or name lookup via registry
    let LucideIcon: React.ComponentType<any> | undefined = component;

    if (!LucideIcon && name && iconRegistry) {
      // Try multiple naming conventions for flexibility:
      //  1. Exact match           – "Heart", "heartIcon"
      //  2. PascalCase            – "heart" → "Heart"
      //  3. camelCase + "Icon"    – "heart" → "heartIcon"
      //  4. legacy lowercase+Icon – "Heart" → "heartIcon"
      const withSuffix = name.endsWith('Icon') ? name : `${name}Icon`;
      const lookups = [
        name,
        name.charAt(0).toUpperCase() + name.slice(1),
        withSuffix,
        withSuffix.charAt(0).toLowerCase() + withSuffix.slice(1),
      ];

      for (const key of lookups) {
        if (iconRegistry[key]) {
          LucideIcon = iconRegistry[key];
          break;
        }
      }

      if (!LucideIcon) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `Icon "${name}" not found in iconRegistry. Tried keys: ${lookups.join(', ')}`
          );
        }
        return null;
      }
    }

    if (!LucideIcon) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Icon: either "name" with a valid "iconRegistry", or "component" prop must be provided'
        );
      }
      return null;
    }

    const iconSize = sizeMap[size];
    const variantClass = useSystemColors ? variantClasses[variant] : '';

    const composedClassName = cn(
      variantClass,
      {
        'cursor-pointer': onClick,
        'hover:opacity-80 transition-opacity': onClick,
      },
      className
    );

    // Wrap in a container for interactive icons to support tabIndex and keyboard events
    if (onClick) {
      return (
        <span
          ref={ref as any}
          role={role || 'button'}
          tabIndex={tabIndex !== undefined ? tabIndex : 0}
          onClick={onClick}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          aria-label={ariaLabel || name || 'icon'}
          aria-hidden={ariaHidden as boolean | undefined}
          data-testid={dataTestId}
          className="inline-flex items-center justify-center outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[var(--radius-tooltip)]"
        >
          <LucideIcon
            size={iconSize}
            color={color}
            className={composedClassName}
            style={themeOverride}
          />
        </span>
      );
    }

    return (
      <LucideIcon
        ref={ref as any}
        size={iconSize}
        color={color}
        className={composedClassName}
        aria-label={ariaLabel || name}
        aria-hidden={ariaHidden as boolean | undefined}
        role={role}
        data-testid={dataTestId}
        style={themeOverride}
      />
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
