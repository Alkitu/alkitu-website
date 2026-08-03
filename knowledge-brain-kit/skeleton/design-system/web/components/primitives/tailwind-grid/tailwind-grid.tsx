import { cn } from "~/lib/utils";

/**
 * @fileoverview TailwindGrid - Responsive grid system optimized for Tailwind CSS v3.4+
 *
 * Provides a 12-column responsive grid system with support for:
 * - Responsive grid: 4 columns (mobile), 8 columns (tablet), 12 columns (desktop)
 * - Container queries and media queries
 * - RTL support with logical properties
 * - Visual debug grid
 * - Flexible gap, padding, and max-width configuration
 */

type GapSize =
  | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;

type ColorOption = "red" | "blue" | "yellow" | "orange" | "purple" | "green";

type MaxWidthOption = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";

type PaddingOption = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "";

type TailwindGridProps = {
  children: React.ReactNode;
  show?: boolean;
  fullSize?: boolean;
  className?: string;
  gapX?: GapSize;
  mdGapX?: GapSize;
  lgGapX?: GapSize;
  gapY?: GapSize;
  mdGapY?: GapSize;
  lgGapY?: GapSize;
  bgColor?: ColorOption;
  maxWidth?: MaxWidthOption;
  mdMaxWidth?: MaxWidthOption;
  lgMaxWidth?: MaxWidthOption;
  padding?: PaddingOption;
  rtlSupport?: boolean;
  containerQueries?: boolean;
};

const generateGapClass = (size: GapSize, axis: 'x' | 'y', breakpoint?: 'md' | 'lg'): string => {
  const prefix = breakpoint ? `${breakpoint}:` : '';
  const sizeStr = size === 0.5 ? '0.5' : size.toString();

  if (size === 0) return `${prefix}gap-${axis}-0`;
  if (size === 0.5) return `${prefix}gap-${axis}-0.5`;

  return `${prefix}gap-${axis}-${sizeStr}`;
};

const CONFIG = {
  bgColors: {
    red: "bg-red-200/20",
    blue: "bg-blue-200/20",
    yellow: "bg-yellow-200/20",
    orange: "bg-orange-200/20",
    purple: "bg-purple-200/20",
    green: "bg-green-200/20",
  } as const,

  maxWidths: {
    xs: "max-w-[320px]",
    sm: "max-w-[640px]",
    md: "max-w-[768px]",
    lg: "max-w-[1024px]",
    xl: "max-w-[1280px]",
    "2xl": "max-w-[1536px]",
    "": "",
  } as const,

  paddings: {
    xs: "px-4 md:px-6 lg:px-8",
    sm: "px-6 md:px-8 lg:px-10",
    md: "px-8 md:px-10 lg:px-12",
    lg: "px-10 md:px-12 lg:px-14",
    xl: "px-12 md:px-14 lg:px-16",
    "2xl": "px-14 md:px-16 lg:px-20",
    "": "",
  } as const,

  paddingsRTL: {
    xs: "px-4 md:px-6 lg:px-8",
    sm: "px-6 md:px-8 lg:px-10",
    md: "px-8 md:px-10 lg:px-12",
    lg: "px-10 md:px-12 lg:px-14",
    xl: "px-12 md:px-14 lg:px-16",
    "2xl": "px-14 md:px-16 lg:px-20",
    "": "",
  } as const,

  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  } as const,
} as const;

const generateMaxWidthClasses = (
  maxWidth?: MaxWidthOption,
  mdMaxWidth?: MaxWidthOption,
  lgMaxWidth?: MaxWidthOption
): string[] => {
  const classes: string[] = [];

  if (maxWidth && CONFIG.maxWidths[maxWidth]) {
    classes.push(`mx-auto ${CONFIG.maxWidths[maxWidth]}`);
  }

  if (mdMaxWidth && CONFIG.maxWidths[mdMaxWidth]) {
    classes.push(`md:${CONFIG.maxWidths[mdMaxWidth]}`);
  }
  if (lgMaxWidth && CONFIG.maxWidths[lgMaxWidth]) {
    classes.push(`lg:${CONFIG.maxWidths[lgMaxWidth]}`);
  }

  return classes;
};

function TailwindGrid({
  children,
  show = false,
  className,
  fullSize = false,
  gapX = 4,
  mdGapX = 6,
  lgGapX = 6,
  gapY = 0,
  mdGapY = 0,
  lgGapY = 0,
  bgColor = "blue",
  maxWidth = "",
  mdMaxWidth = "",
  lgMaxWidth = "",
  padding = "xs",
  rtlSupport = false,
  containerQueries = false,
}: TailwindGridProps) {

  const gapClasses = [
    generateGapClass(gapX, 'x'),
    generateGapClass(mdGapX, 'x', 'md'),
    generateGapClass(lgGapX, 'x', 'lg'),
    generateGapClass(gapY, 'y'),
    generateGapClass(mdGapY, 'y', 'md'),
    generateGapClass(lgGapY, 'y', 'lg'),
  ].filter(Boolean);

  const currentPadding = (fullSize || padding === "") ? "" :
    rtlSupport ? CONFIG.paddingsRTL[padding] : CONFIG.paddings[padding];

  const maxWidthClasses = generateMaxWidthClasses(maxWidth, mdMaxWidth, lgMaxWidth);

  const baseGridClasses = [
    "w-full",
    containerQueries
      ? "@container grid @md:grid-cols-8 @lg:grid-cols-12 grid-cols-4"
      : "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
    "grid relative",
    ...gapClasses,
    ...maxWidthClasses,
  ];

  const debugSectionClasses = cn(
    ...baseGridClasses,
    currentPadding,
    "bg-red-500/10 z-50 pointer-events-none"
  );

  const contentSectionClasses = cn(
    ...baseGridClasses,
    currentPadding,
    className
  );

  return (
    <>
      <section className={debugSectionClasses}>
        {show && (
          <div className={cn(...baseGridClasses, currentPadding, "absolute w-full z-50 box-border")}>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-screen text-center text-zinc-900 col-span-1",
                  CONFIG.bgColors[bgColor],
                  index >= 4 && index < 8 && "hidden md:block",
                  index >= 8 && "hidden lg:block"
                )}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={contentSectionClasses}>
        {children}
      </section>
    </>
  );
}

export default TailwindGrid;
export { TailwindGrid };
export type { TailwindGridProps, GapSize, ColorOption, MaxWidthOption, PaddingOption };
