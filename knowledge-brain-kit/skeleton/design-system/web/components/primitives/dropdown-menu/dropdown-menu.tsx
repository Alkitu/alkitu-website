"use client"

import * as React from "react"
import { useState } from "react"
import {
  CheckIcon,
  ChevronDown,
  ChevronRightIcon,
  CircleIcon,
  MoreHorizontal,
  Plus,
  Settings,
  User,
} from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "~/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "ease-out-strong duration-dropdown z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "ease-out-strong duration-dropdown z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

// ============================================================================
// Data-driven DropdownMenuNavigation types
// ============================================================================

type DropdownMenuItemType = "item" | "checkbox" | "radio" | "separator" | "label" | "sub"

interface DropdownMenuItemBadge {
  text: string
  variant?: "default" | "secondary" | "outline" | "destructive"
}

interface DropdownMenuNavigationDataItem {
  /** Unique identifier for the item */
  id: string
  /** Type of menu item @default 'item' */
  type?: DropdownMenuItemType
  /** Display label */
  label: string
  /** Icon element to display */
  icon?: React.ReactNode
  /** Keyboard shortcut hint */
  shortcut?: string
  /** Whether item is disabled @default false */
  disabled?: boolean
  /** Checked state (for checkbox/radio items) */
  checked?: boolean
  /** Badge to display */
  badge?: DropdownMenuItemBadge
  /** Click handler */
  onClick?: () => void
  /** Sub-menu items (for sub type) */
  children?: DropdownMenuNavigationDataItem[]
}

type DropdownMenuNavigationVariant = "default" | "user" | "actions" | "context" | "command"

type DropdownMenuNavigationPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end"

interface DropdownMenuNavigationProps {
  /** Menu items configuration (data-driven API) */
  items: DropdownMenuNavigationDataItem[]
  /** Custom trigger element. If not provided, a default trigger is rendered based on variant */
  trigger?: React.ReactNode
  /** Visual variant of the dropdown menu @default 'default' */
  variant?: DropdownMenuNavigationVariant
  /** Placement of the dropdown menu @default 'bottom-start' */
  placement?: DropdownMenuNavigationPlacement
  /** Whether the trigger is disabled @default false */
  disabled?: boolean
  /** Custom className for the container */
  className?: string
  /** Whether the trigger uses asChild pattern @default false */
  triggerAsChild?: boolean
  /** Whether the dropdown is modal (blocks interaction with outside content) @default true */
  modal?: boolean
}

interface DropdownMenuNavigationPreset {
  variant: DropdownMenuNavigationVariant
  placement: DropdownMenuNavigationPlacement
  modal: boolean
}

// ============================================================================
// Data-driven DropdownMenuNavigation component
// ============================================================================

/**
 * DropdownMenuNavigation - Data-driven dropdown menu
 *
 * Advanced dropdown menu with data-driven API for quick implementation.
 * Combines primitives with state management for checkboxes and radio groups.
 *
 * Features:
 * - 5 trigger variants (default, user, actions, context, command)
 * - Sub-menus support
 * - Checkbox and radio items with automatic state management
 * - Icons, badges, and keyboard shortcuts
 * - Full theme integration with CSS variables
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Edit', icon: <Edit />, shortcut: '⌘E' },
 *   { id: 'sep', type: 'separator', label: '' },
 *   { id: '2', label: 'Delete', variant: 'destructive' }
 * ];
 *
 * <DropdownMenuNavigation items={items} variant="actions" />
 * ```
 */
function DropdownMenuNavigation({
  items,
  trigger,
  variant = "default",
  placement = "bottom-start",
  disabled = false,
  className = "",
  triggerAsChild = false,
  modal = true,
}: DropdownMenuNavigationProps) {
  // State for controlled checkbox items
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // State for controlled radio group
  const [radioValue, setRadioValue] = useState<string>("")

  // Handle checkbox changes
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems)
    if (checked) {
      newCheckedItems.add(itemId)
    } else {
      newCheckedItems.delete(itemId)
    }
    setCheckedItems(newCheckedItems)
  }

  // Handle radio changes
  const handleRadioChange = (value: string) => {
    setRadioValue(value)
  }

  // Get default trigger based on variant
  const getDefaultTrigger = () => {
    const buttonBaseClasses =
      "inline-flex items-center justify-center gap-2 transition-all rounded-[var(--radius-dropdown)] font-medium outline-hidden"
    const hoverClasses = "hover:scale-[0.98] active:scale-[0.96]"

    switch (variant) {
      case "user":
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-transparent text-foreground hover:bg-accent/80 min-h-9 px-3`}
          >
            <User className="size-4 shrink-0" />
            <span className="text-sm font-medium">User</span>
            <ChevronDown className="size-3 shrink-0 opacity-70" />
          </button>
        )

      case "actions":
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-background text-foreground border border-border hover:bg-accent/80 hover:shadow-md min-h-9 min-w-9 p-2`}
          >
            <MoreHorizontal className="size-4 shrink-0" />
          </button>
        )

      case "context":
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-transparent text-foreground hover:bg-accent/80 hover:rotate-45 min-h-9 min-w-9 p-2`}
          >
            <Settings className="size-4 shrink-0" />
          </button>
        )

      case "command":
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-primary text-primary-foreground hover:shadow-lg min-h-9 px-3`}
          >
            <Plus className="size-4 shrink-0" />
            <span className="text-sm">New</span>
            <ChevronDown className="size-3 shrink-0 opacity-80" />
          </button>
        )

      default:
        return (
          <button
            className={`${buttonBaseClasses} ${hoverClasses} bg-background text-foreground border border-border hover:bg-accent/80 hover:shadow-md min-h-10 px-3`}
          >
            <span className="text-sm">Options</span>
            <ChevronDown className="size-4 shrink-0 opacity-70" />
          </button>
        )
    }
  }

  // Render menu items recursively
  const renderMenuItems = (menuItems: DropdownMenuNavigationDataItem[]) => {
    return menuItems.map((item, index) => {
      // Separator
      if (item.type === "separator") {
        return <DropdownMenuSeparator key={`separator-${index}`} />
      }

      // Label
      if (item.type === "label") {
        return (
          <DropdownMenuLabel key={item.id} className="uppercase text-xs">
            {item.label}
          </DropdownMenuLabel>
        )
      }

      // Sub-menu
      if (item.type === "sub" && item.children) {
        return (
          <DropdownMenuSub key={item.id}>
            <DropdownMenuSubTrigger disabled={item.disabled}>
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs opacity-60">{item.badge.text}</span>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {renderMenuItems(item.children)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )
      }

      // Checkbox item
      if (item.type === "checkbox") {
        const isChecked = checkedItems.has(item.id)
        return (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={isChecked}
            onCheckedChange={(checked) =>
              handleCheckboxChange(item.id, checked)
            }
            disabled={item.disabled}
            onSelect={item.onClick}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-xs opacity-60">{item.badge.text}</span>
            )}
            {item.shortcut && (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuCheckboxItem>
        )
      }

      // Radio item
      if (item.type === "radio") {
        return (
          <DropdownMenuRadioItem
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            onSelect={item.onClick}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-xs opacity-60">{item.badge.text}</span>
            )}
            {item.shortcut && (
              <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuRadioItem>
        )
      }

      // Default item
      return (
        <DropdownMenuItem
          key={item.id}
          disabled={item.disabled}
          onSelect={item.onClick}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="text-xs opacity-60">{item.badge.text}</span>
          )}
          {item.shortcut && (
            <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      )
    })
  }

  // Check if we have radio items for radio group wrapper
  const hasRadioItems = items.some((item) => item.type === "radio")

  return (
    <div className={className}>
      <DropdownMenu modal={modal}>
        <DropdownMenuTrigger
          asChild={trigger ? triggerAsChild : true}
          disabled={disabled}
        >
          {trigger || getDefaultTrigger()}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={placement.includes("end") ? "end" : "start"}
          side={placement.includes("top") ? "top" : "bottom"}
          className="min-w-[14rem]"
        >
          {hasRadioItems ? (
            <DropdownMenuRadioGroup
              value={radioValue}
              onValueChange={handleRadioChange}
            >
              {renderMenuItems(items)}
            </DropdownMenuRadioGroup>
          ) : (
            renderMenuItems(items)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

DropdownMenuNavigation.displayName = "DropdownMenuNavigation"

/**
 * Preset configurations for common dropdown menu patterns
 */
const DropdownMenuNavigationPresets: Record<
  string,
  DropdownMenuNavigationPreset
> = {
  basic: {
    variant: "default",
    placement: "bottom-start",
    modal: true,
  },
  user: {
    variant: "user",
    placement: "bottom-end",
    modal: true,
  },
  actions: {
    variant: "actions",
    placement: "bottom-end",
    modal: false,
  },
  context: {
    variant: "context",
    placement: "bottom-start",
    modal: false,
  },
  command: {
    variant: "command",
    placement: "bottom-start",
    modal: true,
  },
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuNavigation,
  DropdownMenuNavigationPresets,
}

export type {
  DropdownMenuItemType,
  DropdownMenuItemBadge,
  DropdownMenuNavigationDataItem,
  DropdownMenuNavigationVariant,
  DropdownMenuNavigationPlacement,
  DropdownMenuNavigationProps,
  DropdownMenuNavigationPreset,
}
