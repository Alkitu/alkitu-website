'use client';

import * as React from 'react';
import { cn } from '~/lib/utils';

/**
 * Orientation options for Separator
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Size options for Separator
 */
export type SeparatorSize = 'thin' | 'medium' | 'thick';

/**
 * Variant options for Separator
 */
export type SeparatorVariant = 'default' | 'muted' | 'primary' | 'secondary';

/**
 * Border style options for Separator
 */
export type SeparatorBorderStyle = 'solid' | 'dashed' | 'dotted';

/**
 * Props for Separator component
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;

  /**
   * Size/thickness of the separator
   * @default 'thin'
   */
  size?: SeparatorSize;

  /**
   * Length of the separator (primarily for vertical separators)
   * Can be a CSS value like '40px', '2rem', '100%'
   */
  length?: string | number;

  /**
   * Color variant using theme CSS variables
   * @default 'default'
   */
  variant?: SeparatorVariant;

  /**
   * Border style of the separator
   * @default 'solid'
   */
  borderStyle?: SeparatorBorderStyle;

  /**
   * Whether separator has decorative elements
   * When true without label: shows three centered dots
   * When true with label: shows line-label-line layout
   * @default false
   */
  decorative?: boolean;

  /**
   * Custom label for decorative separator
   * Only applies when decorative is true
   */
  label?: string;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Custom inline styles
   */
  customStyle?: React.CSSProperties;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Separator - Design System Component
 *
 * A visual divider component to separate content sections.
 * Supports horizontal and vertical orientations with multiple variants and styles.
 *
 * @example
 * ```tsx
 * // Basic horizontal separator
 * <Separator />
 *
 * // Vertical separator with custom length
 * <Separator orientation="vertical" length="40px" />
 *
 * // Decorative separator with label
 * <Separator decorative label="OR" variant="primary" />
 *
 * // Thick dashed separator
 * <Separator size="thick" borderStyle="dashed" />
 * ```
 */
export function Separator({
  orientation = 'horizontal',
  size = 'thin',
  length,
  variant = 'default',
  borderStyle = 'solid',
  decorative = false,
  label,
  className = '',
  customStyle = {},
  ...props
}: SeparatorProps) {
  /**
   * Get color CSS variable based on variant
   */
  const getColor = (): string => {
    switch (variant) {
      case 'muted':
        return 'var(--color-muted)';
      case 'primary':
        return 'var(--color-primary)';
      case 'secondary':
        return 'var(--color-secondary)';
      default:
        return 'var(--color-border)';
    }
  };

  /**
   * Get thickness based on size
   */
  const getThickness = (): string => {
    switch (size) {
      case 'medium':
        return '2px';
      case 'thick':
        return '4px';
      default: // thin
        return '1px';
    }
  };

  const color = getColor();
  const thickness = getThickness();

  /**
   * Base styles for separator
   */
  const getBaseStyles = (): React.CSSProperties => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: length || '100%',
        borderLeft: `${thickness} ${borderStyle} ${color}`,
        display: 'inline-block',
        verticalAlign: 'top',
        ...customStyle,
      };
    }

    // Horizontal separator
    return {
      width: '100%',
      height: thickness,
      borderTop: `${thickness} ${borderStyle} ${color}`,
      ...customStyle,
    };
  };

  /**
   * Decorative separator with label
   */
  if (decorative && label) {
    return (
      <div
        data-slot="separator"
        className={cn('separator-decorative', className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          ...customStyle,
        }}
        role="separator"
        aria-label={`Section separator: ${label}`}
        {...props}
      >
        <div
          style={{
            flex: 1,
            height: thickness,
            borderTop: `${thickness} ${borderStyle} ${color}`,
          }}
        />
        <span
          style={{
            color: 'var(--color-muted-foreground)',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: thickness,
            borderTop: `${thickness} ${borderStyle} ${color}`,
          }}
        />
      </div>
    );
  }

  /**
   * Simple decorative separator (three centered dots)
   */
  if (decorative && !label) {
    return (
      <div
        data-slot="separator"
        className={cn('separator-decorative', className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '8px 0',
          ...customStyle,
        }}
        role="separator"
        aria-hidden="true"
        {...props}
      >
        <div
          style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Standard separator
   */
  return (
    <div
      data-slot="separator"
      className={cn('separator-atom', className)}
      style={getBaseStyles()}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
}

export default Separator;
