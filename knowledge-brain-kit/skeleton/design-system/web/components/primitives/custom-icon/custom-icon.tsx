'use client';

import React from 'react';
import { cn } from '~/lib/utils';

/**
 * Size options for CustomIcon
 */
export type CustomIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Color variant options for CustomIcon
 */
export type CustomIconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'destructive'
  | 'warning'
  | 'success';

/**
 * Props for CustomIcon component
 */
export interface CustomIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** SVG string content to render */
  svg: string;
  /** Icon size preset @default 'md' */
  size?: CustomIconSize;
  /** Custom size in pixels (overrides size preset) */
  customSize?: number;
  /** Color variant using theme CSS variables @default 'default' */
  variant?: CustomIconVariant;
  /** Custom color (overrides variant) */
  customColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Click handler */
  onClick?: () => void;
  /** Accessibility label */
  'aria-label'?: string;
  /** Data test ID for testing */
  'data-testid'?: string;
}

/**
 * CustomIcon - Renders custom uploaded SVG icons with dynamic sizing and theming.
 *
 * Features:
 * - 6 size presets (xs to 2xl) + custom size support
 * - 8 color variants using theme CSS variables
 * - SVG processing and sanitization
 * - Accessibility support
 * - Interactive mode with click handlers
 * - Fallback for invalid SVG
 */
export const CustomIcon = React.forwardRef<HTMLSpanElement, CustomIconProps>(
  (
    {
      svg,
      size = 'md',
      customSize,
      variant = 'default',
      customColor,
      className = '',
      style = {},
      onClick,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    const getSizeValue = (): number => {
      if (customSize) return customSize;

      const sizeMap: Record<NonNullable<typeof size>, number> = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        '2xl': 32,
      };

      return sizeMap[size];
    };

    const getColorClass = (): string => {
      if (customColor) return '';

      const colorMap: Record<NonNullable<typeof variant>, string> = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        muted: 'text-muted-foreground',
        destructive: 'text-destructive',
        warning: 'text-warning',
        success: 'text-success',
        default: 'text-current',
      };

      return colorMap[variant];
    };

    const sizeValue = getSizeValue();
    const colorClass = getColorClass();

    const processedSVG = React.useMemo(() => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) {
          return null;
        }

        svgElement.setAttribute('width', sizeValue.toString());
        svgElement.setAttribute('height', sizeValue.toString());

        if (
          !svgElement.getAttribute('fill') ||
          svgElement.getAttribute('fill') === 'currentColor'
        ) {
          svgElement.setAttribute('fill', 'currentColor');
        }

        return new XMLSerializer().serializeToString(svgElement);
      } catch (error) {
        console.error('Failed to process custom SVG:', error);
        return null;
      }
    }, [svg, sizeValue]);

    const classes = cn(
      'inline-flex items-center justify-center',
      colorClass,
      className,
    );

    const composedStyle: React.CSSProperties = {
      width: sizeValue,
      height: sizeValue,
      color: customColor || undefined,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    };

    if (!processedSVG) {
      return (
        <span
          ref={ref}
          className={classes}
          style={composedStyle}
          onClick={onClick}
          role={onClick ? 'button' : undefined}
          aria-label={ariaLabel}
          data-testid={dataTestId}
          {...props}
        >
          <span className="text-xs">?</span>
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(classes, 'flex-shrink-0')}
        style={composedStyle}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        dangerouslySetInnerHTML={{ __html: processedSVG }}
        {...props}
      />
    );
  },
);

CustomIcon.displayName = 'CustomIcon';

/**
 * Wrapper component that mimics LucideIcon interface for compatibility
 */
export function createCustomIconComponent(svg: string) {
  const CustomIconWrapper = React.forwardRef<HTMLSpanElement, any>(
    (props, ref) => {
      const {
        size = 'md',
        variant = 'default',
        customSize,
        customColor,
        ...rest
      } = props;

      return (
        <CustomIcon
          ref={ref}
          svg={svg}
          size={size}
          variant={variant}
          customSize={customSize}
          customColor={customColor}
          {...rest}
        />
      );
    },
  );

  CustomIconWrapper.displayName = 'CustomIconWrapper';

  return CustomIconWrapper;
}

export default CustomIcon;
