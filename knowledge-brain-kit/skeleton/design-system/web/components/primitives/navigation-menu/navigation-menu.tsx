'use client';

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDownIcon, ExternalLink } from "lucide-react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "~/lib/utils"
import { Badge } from "~/components/primitives/badge"

// ===========================================================================
// Navigation Menu Primitives (original DS exports)
// ===========================================================================

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

// ===========================================================================
// Enhanced NavigationMenu Types
// ===========================================================================

/**
 * Navigation item data structure
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** URL to navigate to */
  href?: string;
  /** Whether the link opens in a new tab */
  external?: boolean;
  /** Optional badge configuration */
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  /** Child navigation items for multi-level menus */
  children?: NavigationItem[];
  /** Optional description text */
  description?: string;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Whether this item should be featured/highlighted */
  featured?: boolean;
}

/**
 * Variants for the enhanced NavigationMenu component
 */
export type NavigationMenuVariant = 'default' | 'compact' | 'featured';

/**
 * Orientation options for the enhanced NavigationMenu
 */
export type NavigationMenuOrientation = 'horizontal' | 'vertical';

/**
 * Props for the enhanced NavigationMenu molecule component
 */
export interface EnhancedNavigationMenuProps {
  /** Array of navigation items to display */
  items: NavigationItem[];
  /** Visual variant of the navigation menu */
  variant?: NavigationMenuVariant;
  /** Orientation of the navigation menu */
  orientation?: NavigationMenuOrientation;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the viewport for dropdown content */
  viewport?: boolean;
}

/**
 * Preset configurations for common NavigationMenu layouts
 */
export interface NavigationMenuPresetConfig {
  variant: NavigationMenuVariant;
  orientation: NavigationMenuOrientation;
}

// ===========================================================================
// Enhanced NavigationMenu Component
// ===========================================================================

/**
 * EnhancedNavigationMenu - Design System Molecule
 *
 * A sophisticated navigation menu component that supports multi-level navigation,
 * featured items, badges, icons, and multiple layout variants.
 *
 * Combines: Design System Navigation Menu primitives + Badge + Icons + Typography
 * Features: Multi-level navigation, featured items, external links, theme-responsive
 */
const EnhancedNavigationMenu = React.forwardRef<
  HTMLDivElement,
  EnhancedNavigationMenuProps
>(
  (
    {
      items,
      variant = 'default',
      orientation = 'horizontal',
      viewport = true,
      className,
    },
    ref
  ) => {
    // Helper function to render navigation items
    const renderNavigationItem = (item: NavigationItem) => {
      const hasChildren = item.children && item.children.length > 0;

      // Simple link item (no children)
      if (!hasChildren) {
        return (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'group relative overflow-hidden flex items-center gap-2',
              )}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              {item.icon && (
                <span className="flex items-center justify-center w-4 h-4">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant={item.badge.variant || 'outline'} size="sm">
                  {item.badge.text}
                </Badge>
              )}
              {item.external && (
                <ExternalLink className="h-3 w-3 opacity-60" />
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      }

      // Menu item with children (dropdown)
      return (
        <NavigationMenuItem key={item.id}>
          <NavigationMenuTrigger className="flex items-center gap-2">
            {item.icon && (
              <span className="flex items-center justify-center w-4 h-4">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant={item.badge.variant || 'outline'} size="sm">
                {item.badge.text}
              </Badge>
            )}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            {variant === 'featured' ? (
              <div className="grid grid-cols-2 gap-4 p-4 max-sm:grid-cols-1">
                {/* Featured items section */}
                <div>
                  <h4 className="mb-3 pb-2 text-sm font-semibold border-b-2 border-primary">
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Featured
                    </span>
                  </h4>
                  {item.children
                    ?.filter((child) => child.featured)
                    .map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        target={child.external ? '_blank' : undefined}
                        rel={child.external ? 'noopener noreferrer' : undefined}
                        className="group block mb-2 p-3 rounded-md hover:bg-accent/60 focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {child.icon && (
                            <span className="flex items-center justify-center w-5 h-5 mt-0.5 rounded bg-primary/20 text-primary">
                              {child.icon}
                            </span>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-primary">
                                {child.label}
                              </span>
                              {child.badge && (
                                <Badge variant="default" size="sm">
                                  {child.badge.text}
                                </Badge>
                              )}
                              {child.external && (
                                <ExternalLink className="h-3 w-3 opacity-60" />
                              )}
                            </div>
                            {child.description && (
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                {child.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                </div>

                {/* Regular items section */}
                <div>
                  <h4 className="mb-3 pb-2 text-xs font-semibold text-muted-foreground border-b border-border/40 uppercase tracking-wide">
                    More Options
                  </h4>
                  {item.children
                    ?.filter((child) => !child.featured)
                    .map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        target={child.external ? '_blank' : undefined}
                        rel={child.external ? 'noopener noreferrer' : undefined}
                        className="group block mb-1 p-2 rounded-md hover:bg-accent/60 focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      >
                        <div className="flex items-center gap-2">
                          {child.icon && (
                            <span className="flex items-center justify-center w-4 h-4">
                              {child.icon}
                            </span>
                          )}
                          <span className="text-sm">{child.label}</span>
                          {child.badge && (
                            <Badge
                              variant={child.badge.variant || 'outline'}
                              size="sm"
                            >
                              {child.badge.text}
                            </Badge>
                          )}
                          {child.external && (
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            ) : (
              // Default and compact layouts
              <div
                className={cn(
                  'p-2',
                  variant === 'compact'
                    ? 'flex flex-wrap gap-2'
                    : 'flex flex-col'
                )}
              >
                {item.children?.map((child) => (
                  <a
                    key={child.id}
                    href={child.href}
                    target={child.external ? '_blank' : undefined}
                    rel={child.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'group p-2 rounded-md hover:bg-accent/60 focus:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring transition-all',
                      variant === 'compact' ? 'inline-block' : 'block mb-1'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {child.icon && (
                        <span className="flex items-center justify-center w-4 h-4">
                          {child.icon}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{child.label}</span>
                          {child.badge && (
                            <Badge
                              variant={child.badge.variant || 'outline'}
                              size="sm"
                            >
                              {child.badge.text}
                            </Badge>
                          )}
                          {child.external && (
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          )}
                        </div>
                        {child.description && variant !== 'compact' && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {child.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    };

    // Main render
    return (
      <div ref={ref} className={className}>
        <NavigationMenu orientation={orientation} viewport={viewport}>
          <NavigationMenuList
            className={cn(
              orientation === 'vertical' && 'flex-col items-start gap-2',
              'max-sm:flex-wrap max-sm:justify-center max-sm:gap-2'
            )}
          >
            {items.map(renderNavigationItem)}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }
);

EnhancedNavigationMenu.displayName = 'EnhancedNavigationMenu';

// Preset Configurations
const NavigationMenuPresets = {
  basic: {
    variant: 'default' as const,
    orientation: 'horizontal' as const,
  },

  compact: {
    variant: 'compact' as const,
    orientation: 'horizontal' as const,
  },

  featured: {
    variant: 'featured' as const,
    orientation: 'horizontal' as const,
  },

  vertical: {
    variant: 'default' as const,
    orientation: 'vertical' as const,
  },
};

// ===========================================================================
// Exports
// ===========================================================================

// Original DS primitives (keep backward compatibility)
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

// Enhanced NavigationMenu molecule
export {
  EnhancedNavigationMenu,
  NavigationMenuPresets,
}
