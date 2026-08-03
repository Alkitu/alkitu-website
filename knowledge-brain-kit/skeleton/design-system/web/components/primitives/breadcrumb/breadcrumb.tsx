"use client"

import * as React from "react"
import { ChevronRight, MoreHorizontal, Home } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "~/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Types for enhanced BreadcrumbNavigation
// ---------------------------------------------------------------------------

/**
 * Separator style options for breadcrumb
 */
type BreadcrumbSeparatorVariant = 'chevron' | 'slash' | 'arrow';

/**
 * Size options for breadcrumb
 */
type BreadcrumbSize = 'sm' | 'md' | 'lg';

/**
 * Individual breadcrumb item data structure
 */
interface BreadcrumbItemData {
  /** Label for the breadcrumb item */
  label: string;
  /** Click handler for the breadcrumb item */
  onClick?: () => void;
  /** Whether this item is the current page (not clickable) */
  current?: boolean;
  /** Icon to display before the label */
  icon?: React.ComponentType<any>;
  /** Custom href for links */
  href?: string;
}

/**
 * Props for simplified data-driven BreadcrumbNavigation component
 */
interface BreadcrumbNavigationProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItemData[];
  /** Separator between items @default 'chevron' */
  separator?: BreadcrumbSeparatorVariant | React.ReactNode;
  /** Maximum items to show before collapsing */
  maxItems?: number;
  /** Whether to show home icon for first item @default false */
  showHome?: boolean;
  /** Size variant @default 'md' */
  size?: BreadcrumbSize;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// BreadcrumbNavigation - Data-driven enhanced breadcrumb
// ---------------------------------------------------------------------------

/**
 * BreadcrumbNavigation - Simplified data-driven breadcrumb component
 *
 * High-level component that combines all breadcrumb primitives with advanced features:
 * - Custom separators (chevron, slash, arrow, or custom React node)
 * - Item collapsing with maxItems
 * - Home icon support
 * - Size variants
 * - Full theme integration
 *
 * @example
 * ```tsx
 * <BreadcrumbNavigation
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Details', current: true }
 *   ]}
 *   separator="chevron"
 *   maxItems={3}
 *   showHome
 *   size="md"
 * />
 * ```
 */
const BreadcrumbNavigation = React.forwardRef<
  HTMLElement,
  BreadcrumbNavigationProps
>(
  (
    {
      items,
      separator = 'chevron',
      maxItems,
      showHome = false,
      size = 'md',
      className = '',
      style = {},
      ...props
    },
    ref,
  ) => {
    // Get size styles
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            fontSize: '0.75rem',
            gap: '0.25rem',
            iconSize: 12,
          };
        case 'lg':
          return {
            fontSize: '1rem',
            gap: '0.5rem',
            iconSize: 16,
          };
        default:
          return {
            fontSize: '0.875rem',
            gap: '0.375rem',
            iconSize: 14,
          };
      }
    };

    const sizeStyles = getSizeStyles();

    // Render separator based on variant
    const renderSeparator = (variant: BreadcrumbSeparatorVariant) => {
      switch (variant) {
        case 'slash':
          return <span className="text-muted-foreground opacity-60">/</span>;
        case 'arrow':
          return <span className="text-muted-foreground opacity-60">&rarr;</span>;
        case 'chevron':
        default:
          return (
            <ChevronRight
              className="text-muted-foreground opacity-60"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          );
      }
    };

    // Handle item collapsing
    const getDisplayItems = () => {
      if (!maxItems || items.length <= maxItems) {
        return items;
      }

      if (maxItems <= 2) {
        return [
          items[0],
          { label: '...', onClick: undefined, current: false },
          items[items.length - 1],
        ];
      }

      const keepFirst = Math.floor(maxItems / 2);
      const keepLast = maxItems - keepFirst - 1;

      return [
        ...items.slice(0, keepFirst),
        { label: '...', onClick: undefined, current: false },
        ...items.slice(items.length - keepLast),
      ];
    };

    const displayItems = getDisplayItems();

    // Render breadcrumb item
    const renderItem = (item: BreadcrumbItemData, index: number) => {
      const isEllipsis = item.label === '...';
      const isClickable = item.onClick || item.href;
      const isCurrent = item.current;
      const isFirst = index === 0;

      const content = (
        <>
          {isFirst && showHome && (
            <Home
              className="inline-block mr-1"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          )}

          {item.icon && !isEllipsis && (
            <item.icon
              className="inline-block mr-1"
              style={{ width: sizeStyles.iconSize, height: sizeStyles.iconSize }}
            />
          )}

          {isEllipsis ? (
            <BreadcrumbEllipsis className="size-auto p-0" />
          ) : (
            <span>{item.label}</span>
          )}
        </>
      );

      if (isCurrent) {
        return <BreadcrumbPage>{content}</BreadcrumbPage>;
      }

      if (item.href) {
        return (
          <BreadcrumbLink
            href={item.href}
            onClick={item.onClick}
          >
            {content}
          </BreadcrumbLink>
        );
      }

      if (isClickable) {
        return (
          <span
            role="button"
            tabIndex={0}
            onClick={item.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.onClick?.();
              }
            }}
            className="hover:text-foreground transition-colors cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {content}
          </span>
        );
      }

      return <span className="text-muted-foreground">{content}</span>;
    };

    return (
      <Breadcrumb
        ref={ref}
        className={className}
        style={{
          fontSize: sizeStyles.fontSize,
          fontFamily: 'var(--typography-paragraph-font-family, inherit)',
          ...style,
        }}
        {...props}
      >
        <BreadcrumbList style={{ gap: sizeStyles.gap }}>
          {displayItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>{renderItem(item, index)}</BreadcrumbItem>
              {index < displayItems.length - 1 && (
                <BreadcrumbSeparator>
                  {React.isValidElement(separator)
                    ? separator
                    : renderSeparator(separator as BreadcrumbSeparatorVariant)}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  },
);

BreadcrumbNavigation.displayName = 'BreadcrumbNavigation';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbNavigation,
}
export type {
  BreadcrumbSeparatorVariant,
  BreadcrumbSize,
  BreadcrumbItemData,
  BreadcrumbNavigationProps,
}
