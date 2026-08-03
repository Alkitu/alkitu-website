'use client';

import * as React from 'react';
import { cn } from '~/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label'
  | 'caption'
  | 'overline'
  | 'lead'
  | 'blockquote'
  | 'body'
  | 'body2';

export type TypographySize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type TypographyWeight =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'black'
  | 'extrabold';

export type TypographyColor =
  | 'foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'warning'
  | 'inherit';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic variant that determines the HTML element and default styling @default 'p' */
  variant?: TypographyVariant;
  /** Size of the text (overrides variant defaults) */
  size?: TypographySize;
  /** Font weight */
  weight?: TypographyWeight;
  /** Text color using theme colors @default 'inherit' */
  color?: TypographyColor;
  /** Text alignment @default 'left' */
  align?: TypographyAlign;
  /** Whether text should be truncated with ellipsis @default false */
  truncate?: boolean;
  /** Content to display */
  children: React.ReactNode;
  /** Custom HTML element to use (overrides variant default) */
  as?: keyof React.JSX.IntrinsicElements;
  /** Theme variable overrides for custom styling */
  themeOverride?: Record<string, string>;
  /** Use custom design system CSS variables @default false */
  useCustomTheme?: boolean;
}

/** Backward compatibility: Heading-specific props */
export interface HeadingProps {
  /** Heading level (1-6) @default 1 */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Content to display */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Use custom design system CSS variables @default true */
  useCustomTheme?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const getElementConfig = (variant: TypographyVariant) => {
  switch (variant) {
    case 'h1':
      return { element: 'h1', defaultSize: '4xl', defaultWeight: 'extrabold' };
    case 'h2':
      return { element: 'h2', defaultSize: '3xl', defaultWeight: 'bold' };
    case 'h3':
      return { element: 'h3', defaultSize: '2xl', defaultWeight: 'bold' };
    case 'h4':
      return { element: 'h4', defaultSize: 'xl', defaultWeight: 'semibold' };
    case 'h5':
      return { element: 'h5', defaultSize: 'lg', defaultWeight: 'semibold' };
    case 'h6':
      return { element: 'h6', defaultSize: 'md', defaultWeight: 'semibold' };
    case 'p':
      return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
    case 'span':
      return { element: 'span', defaultSize: 'md', defaultWeight: 'normal' };
    case 'label':
      return { element: 'label', defaultSize: 'sm', defaultWeight: 'medium' };
    case 'caption':
      return { element: 'span', defaultSize: 'sm', defaultWeight: 'normal' };
    case 'overline':
      return { element: 'span', defaultSize: 'xs', defaultWeight: 'medium' };
    case 'lead':
      return { element: 'p', defaultSize: 'lg', defaultWeight: 'normal' };
    case 'blockquote':
      return { element: 'blockquote', defaultSize: 'md', defaultWeight: 'normal' };
    case 'body':
      return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
    case 'body2':
      return { element: 'p', defaultSize: 'sm', defaultWeight: 'normal' };
    default:
      return { element: 'p', defaultSize: 'md', defaultWeight: 'normal' };
  }
};

const sizeClassMap: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

const weightClassMap: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
  extrabold: 'font-extrabold',
};

const colorClassMap: Record<TypographyColor, string> = {
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  'muted-foreground': 'text-muted-foreground',
  accent: 'text-accent-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive',
  warning: 'text-warning',
  inherit: '',
};

const alignClassMap: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const variantClassMap: Record<TypographyVariant, string> = {
  h1: 'scroll-m-20 tracking-tight',
  h2: 'scroll-m-20 tracking-tight',
  h3: 'scroll-m-20 tracking-tight',
  h4: 'scroll-m-20 tracking-tight',
  h5: 'scroll-m-20 tracking-tight',
  h6: 'scroll-m-20 tracking-tight',
  p: 'leading-7',
  span: '',
  label: 'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  caption: 'opacity-75',
  overline: 'uppercase tracking-wide opacity-75',
  lead: 'leading-7',
  blockquote: 'border-l-2 border-muted pl-6 italic',
  body: 'leading-7',
  body2: 'leading-6',
};

/* ------------------------------------------------------------------ */
/*  Typography Component                                               */
/* ------------------------------------------------------------------ */

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'p',
      size,
      weight,
      color = 'inherit',
      align = 'left',
      truncate = false,
      children,
      className = '',
      as,
      themeOverride,
      useCustomTheme = false,
      ...props
    },
    ref,
  ) => {
    const config = getElementConfig(variant);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Element = (as || config.element) as any;

    const classes = cn([
      'transition-colors',
      sizeClassMap[size || config.defaultSize],
      weightClassMap[weight || config.defaultWeight],
      colorClassMap[color],
      alignClassMap[align],
      variantClassMap[variant],
      truncate && 'truncate',
      className,
    ]);

    const inlineStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {};

      if (useCustomTheme && variant.startsWith('h')) {
        const level = variant.charAt(1);
        return {
          fontFamily: `var(--typography-h${level}-font-family)`,
          fontSize: `var(--typography-h${level}-font-size)`,
          fontWeight: `var(--typography-h${level}-font-weight)`,
          lineHeight: `var(--typography-h${level}-line-height)`,
          letterSpacing: `var(--typography-h${level}-letter-spacing)`,
        } as React.CSSProperties;
      }

      if (themeOverride) {
        Object.entries(themeOverride).forEach(([property, value]) => {
          const cssProp = property.startsWith('--') ? property : `--${property}`;
          (styles as Record<string, string>)[cssProp] = value;
        });
      }

      return Object.keys(styles).length > 0 ? styles : undefined;
    }, [themeOverride, useCustomTheme, variant]);

    return (
      <Element
        ref={ref as any}
        data-slot="typography"
        className={classes}
        style={inlineStyles}
        data-testid="typography"
        {...props}
      >
        {children}
      </Element>
    );
  },
);

Typography.displayName = 'Typography';

/* ------------------------------------------------------------------ */
/*  Heading Component (backward compatibility)                         */
/* ------------------------------------------------------------------ */

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, children, className, useCustomTheme = true, ...props }, ref) => {
    const variant = `h${level}` as TypographyVariant;

    return (
      <Typography
        ref={ref as any}
        variant={variant}
        className={className}
        useCustomTheme={useCustomTheme}
        {...props}
      >
        {children}
      </Typography>
    );
  },
);

Heading.displayName = 'Heading';

export { Typography, Heading };
export default Typography;
