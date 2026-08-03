"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/compositions/sidebar"

export interface SidebarTeam {
  name: string
  logo: React.ElementType
  plan: string
}

export interface SidebarTeamSwitcherProps {
  teams: SidebarTeam[]
  onTeamChange?: (team: SidebarTeam) => void
  onAddTeam?: () => void
  /** Render function for the dropdown content. Receives teams, activeTeam, and callbacks. */
  renderDropdown?: (props: {
    teams: SidebarTeam[]
    activeTeam: SidebarTeam
    isMobile: boolean
    onTeamChange: (team: SidebarTeam) => void
    onAddTeam?: () => void
  }) => React.ReactNode
}

export function SidebarTeamSwitcher({
  teams,
  onTeamChange,
  onAddTeam,
  renderDropdown,
}: SidebarTeamSwitcherProps) {
  const { isMobile, state } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const isCollapsed = state === "collapsed"

  if (!activeTeam) {
    return null
  }

  const handleTeamChange = (team: SidebarTeam) => {
    setActiveTeam(team)
    onTeamChange?.(team)
  }

  if (renderDropdown) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          {renderDropdown({
            teams,
            activeTeam,
            isMobile,
            onTeamChange: handleTeamChange,
            onAddTeam,
          })}
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {React.createElement(activeTeam.logo, { className: "size-4" })}
          </div>
          {!isCollapsed && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
