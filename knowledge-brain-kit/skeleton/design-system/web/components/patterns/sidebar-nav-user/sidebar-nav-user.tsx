"use client"

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/compositions/sidebar"

export interface SidebarNavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  /** Render function for the dropdown content. Receives isMobile flag. */
  renderDropdown?: (props: { isMobile: boolean; user: SidebarNavUserProps["user"] }) => React.ReactNode
  /** Called when user clicks the trigger button */
  onClick?: () => void
}

/**
 * SidebarNavUser - A generic user section for the sidebar footer.
 *
 * By default renders the user's avatar, name, and email.
 * Use `renderDropdown` to provide a custom dropdown menu.
 */
export function SidebarNavUser({ user, renderDropdown, onClick }: SidebarNavUserProps) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const trigger = (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      onClick={onClick}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-8 w-8 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold shrink-0">
          {initials}
        </div>
      )}
      {!isCollapsed && (
        <>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </>
      )}
    </SidebarMenuButton>
  )

  if (renderDropdown) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          {renderDropdown({ isMobile, user })}
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {trigger}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
