"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "~/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-[var(--border)] last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-colors ease-out-strong outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-dropdown ease-out-strong" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

// ---------------------------------------------------------------------------
// Types for enhanced AccordionNavigation
// ---------------------------------------------------------------------------

/**
 * Variant options for AccordionNavigation
 */
type AccordionVariant = 'default' | 'card' | 'bordered' | 'minimal';

/**
 * Badge variant options for accordion items
 */
type AccordionBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

/**
 * Individual accordion item configuration
 */
interface AccordionItemData {
  /** Unique identifier for the accordion item */
  id: string;
  /** Title text displayed in the trigger */
  title: string;
  /** Content displayed when item is expanded */
  content: React.ReactNode;
  /** Optional badge configuration */
  badge?: {
    text: string;
    /** @default 'outline' */
    variant?: AccordionBadgeVariant;
  };
  /** Optional custom icon to display (replaces default chevron) */
  icon?: React.ReactNode;
  /** Whether this item is disabled @default false */
  disabled?: boolean;
  /** Whether this item is open by default @default false */
  defaultOpen?: boolean;
}

/**
 * Props for AccordionNavigation molecule
 */
interface AccordionNavigationProps {
  /** Array of accordion items to display */
  items: AccordionItemData[];
  /** Visual variant of the accordion @default 'default' */
  variant?: AccordionVariant;
  /** Allow multiple items to be open simultaneously @default false */
  multiple?: boolean;
  /** Enable smooth animations @default true */
  animated?: boolean;
  /** Allow all items to be collapsed @default true */
  collapsible?: boolean;
  /** Custom className for the accordion container */
  className?: string;
}

/**
 * Preset configurations for common accordion patterns
 */
interface AccordionPresetConfig {
  variant: AccordionVariant;
  multiple: boolean;
  animated: boolean;
  collapsible: boolean;
}

// ---------------------------------------------------------------------------
// AccordionNavigation - Data-driven enhanced accordion
// ---------------------------------------------------------------------------

/**
 * AccordionNavigation - High-level data-driven accordion component
 *
 * Combines Design System Accordion root with enhanced styling, animations,
 * and theme integration. Provides a simplified API for rendering accordion
 * sections from an array of items.
 *
 * Features:
 * - 4 visual variants (default, card, bordered, minimal)
 * - Single or multiple selection modes
 * - Smooth animations with cubic-bezier
 * - Custom icons per item
 * - Badge support
 * - Disabled state
 * - Default open state
 * - Full keyboard navigation
 * - Screen reader support (ARIA)
 *
 * @example
 * ```tsx
 * <AccordionNavigation
 *   variant="card"
 *   items={[
 *     {
 *       id: '1',
 *       title: 'What is Atomic Design?',
 *       content: 'Atomic Design is a methodology...',
 *       badge: { text: 'New', variant: 'outline' }
 *     }
 *   ]}
 * />
 * ```
 */
const AccordionNavigation = React.forwardRef<HTMLDivElement, AccordionNavigationProps>(
  (
    {
      items,
      variant = 'default',
      multiple = false,
      animated = true,
      collapsible = true,
      className = '',
    },
    ref,
  ) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      items.filter((item) => item.defaultOpen).map((item) => item.id),
    );

    const handleValueChange = (value: string | string[]) => {
      setOpenItems(Array.isArray(value) ? value : [value]);
    };

    // Variant-specific container styles
    const containerClasses = cn(
      'w-full rounded-xl overflow-hidden transition-all duration-modal ease-out-strong',
      {
        'bg-background border border-border': variant === 'default',
        'bg-card border border-border shadow-md': variant === 'card',
        'bg-background border-2 border-border': variant === 'bordered',
        'bg-transparent border-none': variant === 'minimal',
      },
      className,
    );

    // Trigger button styles
    const getTriggerClasses = (isOpen: boolean, disabled: boolean) =>
      cn(
        'flex w-full items-center justify-between gap-3 text-left transition-all duration-modal ease-out-strong',
        'min-h-[44px]',
        'rounded-[var(--radius-card)]',
        variant === 'minimal' ? 'px-0 py-3' : 'px-4 py-3',
        'font-heading text-base font-medium',
        !disabled && [
          'hover:bg-accent/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ],
        isOpen && 'bg-accent/30',
        disabled && 'cursor-not-allowed opacity-50',
        isOpen ? 'text-primary font-semibold' : 'text-foreground',
      );

    // Content area styles
    const getContentClasses = () =>
      cn(
        'overflow-hidden transition-all duration-modal ease-out-strong',
        'data-[state=closed]:animate-accordion-up',
        'data-[state=open]:animate-accordion-down',
      );

    // Icon container styles
    const getIconClasses = (isOpen: boolean) =>
      cn(
        'flex h-5 w-5 items-center justify-center rounded transition-all duration-modal ease-out-strong',
        isOpen && 'bg-primary/20 rotate-180 scale-110',
        animated && 'transform',
      );

    const accordionType = multiple ? 'multiple' : 'single';
    const accordionValue = multiple ? openItems : openItems[0] || '';

    return (
      <div ref={ref} className={containerClasses} data-testid="accordion">
        <Accordion
          {...({
            type: accordionType,
            value: accordionValue,
            onValueChange: handleValueChange,
            collapsible,
            className: 'w-full',
          } as any)}
        >
          {items.map((item, index) => {
            const isOpen = openItems.includes(item.id);
            const isLast = index === items.length - 1;

            return (
              <AccordionPrimitive.Item
                key={item.id}
                value={item.id}
                className={cn(
                  variant !== 'minimal' && !isLast && 'border-b border-border',
                  variant === 'minimal' && 'mb-4',
                )}
                data-testid={`accordion-item-${item.id}`}
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    disabled={item.disabled}
                    className={getTriggerClasses(isOpen, item.disabled || false)}
                    data-testid={`accordion-trigger-${item.id}`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {/* Icon container */}
                      <div
                        className={getIconClasses(isOpen)}
                        data-testid={`accordion-icon-${item.id}`}
                      >
                        {item.icon ? (
                          <div
                            className={cn(
                              'flex h-4 w-4 items-center justify-center transition-colors duration-modal',
                              isOpen ? 'text-primary' : 'text-muted-foreground',
                            )}
                          >
                            {item.icon}
                          </div>
                        ) : (
                          <ChevronDownIcon
                            className={cn(
                              'h-4 w-4 shrink-0 transition-colors duration-modal',
                              isOpen ? 'text-primary' : 'text-muted-foreground',
                            )}
                            data-testid={`accordion-chevron-${item.id}`}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <span className="flex-1">{item.title}</span>

                      {/* Badge (if provided) */}
                      {item.badge && (
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-all duration-modal',
                            'ring-1 ring-inset',
                            {
                              'bg-secondary text-secondary-foreground ring-secondary/20':
                                (item.badge.variant || 'outline') === 'secondary',
                              'bg-destructive text-destructive-foreground ring-destructive/20':
                                item.badge.variant === 'destructive',
                              'bg-background text-foreground ring-border':
                                (item.badge.variant || 'outline') === 'outline' ||
                                item.badge.variant === 'default',
                            },
                            isOpen && 'scale-95 opacity-90',
                          )}
                          data-testid={`accordion-badge-${item.id}`}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>

                <AccordionPrimitive.Content
                  className={getContentClasses()}
                  data-testid={`accordion-content-${item.id}`}
                >
                  <div
                    className={cn(
                      'pb-4 pt-0',
                      variant === 'minimal' ? 'px-0' : 'px-4',
                      'pl-11',
                    )}
                  >
                    {typeof item.content === 'string' ? (
                      <p className="font-body text-sm leading-relaxed text-muted-foreground">
                        {item.content}
                      </p>
                    ) : (
                      <div className="text-sm text-muted-foreground">{item.content}</div>
                    )}
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            );
          })}
        </Accordion>
      </div>
    );
  },
);

AccordionNavigation.displayName = 'AccordionNavigation';

/**
 * Preset configurations for common accordion patterns
 */
const AccordionPresets: Record<string, AccordionPresetConfig> = {
  /** Basic single-selection accordion */
  basic: {
    variant: 'default',
    multiple: false,
    animated: true,
    collapsible: true,
  },
  /** Card-style accordion with shadow */
  card: {
    variant: 'card',
    multiple: false,
    animated: true,
    collapsible: true,
  },
  /** Multi-select accordion with borders */
  multiSelect: {
    variant: 'bordered',
    multiple: true,
    animated: true,
    collapsible: true,
  },
  /** Minimal accordion without background */
  minimal: {
    variant: 'minimal',
    multiple: false,
    animated: false,
    collapsible: true,
  },
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, AccordionNavigation, AccordionPresets }
export type {
  AccordionVariant,
  AccordionBadgeVariant,
  AccordionItemData,
  AccordionNavigationProps,
  AccordionPresetConfig,
}
