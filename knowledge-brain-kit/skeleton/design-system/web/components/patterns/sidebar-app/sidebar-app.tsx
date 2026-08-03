"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
} from "~/components/compositions/sidebar"
import { SidebarNavMain, type SidebarNavItem } from "../sidebar-nav-main"

export interface SidebarAppProps extends React.ComponentProps<typeof Sidebar> {
  /** Navigation items for the main content area */
  navMain?: SidebarNavItem[]
  /** Label for the navigation group */
  navGroupLabel?: string
  /** Footer navigation items (rendered as simple links) */
  navFooter?: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
  /** Whether to show the toggle trigger in the header */
  showTrigger?: boolean
  /** Whether to show the sidebar rail */
  showRail?: boolean
  /** Custom header content (replaces default trigger) */
  headerContent?: React.ReactNode
  /** Custom footer content (replaces default footer items) */
  footerContent?: React.ReactNode
  /** Additional content after the main nav */
  children?: React.ReactNode
}

/**
 * SidebarApp - A pre-composed app sidebar following the app-website pattern.
 *
 * Provides a ready-to-use sidebar with:
 * - Header with toggle trigger
 * - Main navigation with collapsible items
 * - Footer with links and custom content
 * - Optional sidebar rail
 *
 * @example
 * ```tsx
 * <SidebarApp
 *   navMain={[
 *     { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, isActive: true },
 *     { title: "Projects", url: "/projects", icon: FolderKanban },
 *   ]}
 *   navGroupLabel="Platform"
 *   navFooter={[
 *     { title: "Settings", url: "/settings", icon: Settings },
 *   ]}
 *   footerContent={<LogoutButton />}
 *   collapsible="icon"
 *   variant="inset"
 * />
 * ```
 */
export function SidebarApp({
  navMain,
  navGroupLabel,
  navFooter,
  showTrigger = true,
  showRail = false,
  headerContent,
  footerContent,
  children,
  ...props
}: SidebarAppProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex items-end group-data-[collapsible=icon]:items-center">
        {headerContent ?? (showTrigger && <SidebarTrigger />)}
      </SidebarHeader>
      <SidebarContent>
        {navMain && (
          <SidebarNavMain items={navMain} groupLabel={navGroupLabel} />
        )}
        {children}
      </SidebarContent>
      <SidebarFooter>
        {navFooter && navFooter.length > 0 && (
          <SidebarMenu>
            {navFooter.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <a href={item.url}>
                    {item.icon && React.createElement(item.icon)}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
        {footerContent}
      </SidebarFooter>
      {showRail && <SidebarRail />}
    </Sidebar>
  )
}
