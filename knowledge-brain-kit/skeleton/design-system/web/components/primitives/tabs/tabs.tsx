"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "~/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-nav-item whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

// ---------------------------------------------------------------------------
// Types for enhanced TabsNavigation
// ---------------------------------------------------------------------------

/**
 * TabItem - Individual tab configuration
 */
interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

/**
 * TabsNavigation Props
 */
interface TabsNavigationProps {
  /** The value of the tab that should be active by default */
  defaultValue?: string;
  /** The controlled value of the active tab */
  value?: string;
  /** Callback fired when the active tab changes */
  onValueChange?: (value: string) => void;
  /** Array of tab items to render */
  tabs: TabItem[];
  /** Optional CSS class name */
  className?: string;
  /** Orientation of the tabs */
  orientation?: 'horizontal' | 'vertical';
}

// ---------------------------------------------------------------------------
// TabsNavigation - Data-driven enhanced tabs component
// ---------------------------------------------------------------------------

/**
 * TabsNavigation - High-level data-driven tabs component
 *
 * Provides tab navigation UI for switching between views/panels.
 * Built on Radix UI Tabs primitive with enhanced styling and features.
 *
 * Features:
 * - Data-driven API: pass an array of tab items
 * - Horizontal and vertical orientations
 * - Badge support per tab
 * - Icon support per tab
 * - Disabled state per tab
 * - Underline-style active indicator
 *
 * Note: This component renders inline badge markup. If you need the full
 * Badge component with variants, import Badge from ~/components/primitives/badge
 * and compose your own tabs.
 *
 * @example
 * ```tsx
 * <TabsNavigation
 *   tabs={[
 *     { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
 *     { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div>, badge: { text: '3' } }
 *   ]}
 *   defaultValue="tab1"
 * />
 * ```
 */
function TabsNavigation({
  defaultValue,
  value,
  onValueChange,
  tabs,
  className,
  orientation = 'horizontal',
}: TabsNavigationProps) {
  return (
    <Tabs
      data-testid="tabs-navigation"
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('w-full space-y-6', className)}
    >
      <TabsList
        data-testid="tabs-list"
        className={cn(
          'w-full justify-start bg-transparent p-0 border-b border-border h-auto rounded-none',
          orientation === 'horizontal' ? 'gap-6 flex-row' : 'gap-2 flex-col border-r border-b-0',
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            data-testid={`tab-trigger-${tab.value}`}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
              'rounded-none px-0 py-3 font-medium text-muted-foreground',
              'data-[state=active]:text-foreground bg-transparent transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-2',
              orientation === 'horizontal'
                ? 'data-[state=active]:border-b-2 data-[state=active]:border-primary border-b-2 border-transparent'
                : 'data-[state=active]:border-r-2 data-[state=active]:border-primary border-r-2 border-transparent w-full justify-start',
            )}
          >
            {tab.icon && (
              <span data-testid={`tab-icon-${tab.value}`} className="shrink-0">
                {tab.icon}
              </span>
            )}
            <span data-testid={`tab-label-${tab.value}`}>{tab.label}</span>
            {tab.badge && (
              <span
                data-testid={`tab-badge-${tab.value}`}
                className={cn(
                  'ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
                  {
                    'bg-primary text-primary-foreground': (tab.badge.variant || 'default') === 'default',
                    'bg-secondary text-secondary-foreground': tab.badge.variant === 'secondary',
                    'bg-destructive text-destructive-foreground': tab.badge.variant === 'destructive',
                    'border border-input bg-background text-foreground': tab.badge.variant === 'outline',
                  },
                )}
              >
                {tab.badge.text}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          data-testid={`tab-content-${tab.value}`}
          value={tab.value}
          className="mt-6"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

TabsNavigation.displayName = 'TabsNavigation';

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsNavigation }
export type { TabItem, TabsNavigationProps }
