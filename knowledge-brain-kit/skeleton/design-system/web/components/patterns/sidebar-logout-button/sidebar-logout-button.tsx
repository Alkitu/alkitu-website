"use client"

import { LogOut } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/compositions/sidebar"

export interface SidebarLogoutButtonProps {
  /** Label text for the button */
  label?: string
  /** Called when the logout button is clicked */
  onLogout: () => void | Promise<void>
}

export function SidebarLogoutButton({
  label = "Log out",
  onLogout,
}: SidebarLogoutButtonProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={onLogout}
          tooltip={label}
          className="w-full"
        >
          <LogOut />
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
