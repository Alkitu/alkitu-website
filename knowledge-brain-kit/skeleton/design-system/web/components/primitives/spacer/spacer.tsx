'use client';

import * as React from 'react';
import { cn } from '~/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SpacerDirection = 'horizontal' | 'vertical' | 'both';

export interface SpacerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Size of the spacer based on spacing system hierarchy @default 'md' */
  size?: SpacerSize;
  /** Direction of spacing @default 'vertical' */
  direction?: SpacerDirection;
  /** Custom spacing value (overrides size). Accepts any valid CSS value. */
  spacing?: string;
  /** Custom className for additional styling */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Data test ID for testing */
  'data-testid'?: string;
}

/* ------------------------------------------------------------------ */
/*  Spacing scale                                                      */
/* ------------------------------------------------------------------ */

const spacingMap: Record<SpacerSize, string> = {
  xs: 'calc(var(--spacing, 2.2rem) * 0.5)',
  sm: 'calc(var(--spacing, 2.2rem) * 1)',
  md: 'calc(var(--spacing, 2.2rem) * 2)',
  lg: 'calc(var(--spacing, 2.2rem) * 4)',
  xl: 'calc(var(--spacing, 2.2rem) * 6)',
  '2xl': 'calc(var(--spacing, 2.2rem) * 8)',
};

/* ------------------------------------------------------------------ */
/*  Spacer Component                                                   */
/* ------------------------------------------------------------------ */

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      size = 'md',
      direction = 'vertical',
      spacing,
      className = '',
      style = {},
      ...props
    },
    ref,
  ) => {
    const spacingValue = spacing || spacingMap[size];

    const dimensions = React.useMemo(() => {
      switch (direction) {
        case 'horizontal':
          return {
            width: spacingValue,
            height: '1px',
            minWidth: spacingValue,
          };
        case 'vertical':
          return {
            width: '1px',
            height: spacingValue,
            minHeight: spacingValue,
          };
        case 'both':
          return {
            width: spacingValue,
            height: spacingValue,
            minWidth: spacingValue,
            minHeight: spacingValue,
          };
        default:
          return {
            width: '1px',
            height: spacingValue,
            minHeight: spacingValue,
          };
      }
    }, [direction, spacingValue]);

    return (
      <div
        ref={ref}
        data-slot="spacer"
        className={cn('spacer', className)}
        style={{
          ...dimensions,
          flexShrink: 0,
          ...style,
        }}
        aria-hidden="true"
        data-spacing-size={size}
        data-spacing-direction={direction}
        data-spacing-value={spacingValue}
        {...props}
      />
    );
  },
);

Spacer.displayName = 'Spacer';

export { Spacer };
export default Spacer;
