"use client"

import * as React from "react"
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/compositions/sidebar"

export interface SidebarProject {
  name: string
  url: string
  icon: LucideIcon
}

export interface SidebarNavProjectsProps {
  projects: SidebarProject[]
  label?: string
  /** Render function for the dropdown actions per project. Receives the project and isMobile flag. */
  renderActions?: (props: { project: SidebarProject; isMobile: boolean }) => React.ReactNode
  onViewProject?: (project: SidebarProject) => void
  onShareProject?: (project: SidebarProject) => void
  onDeleteProject?: (project: SidebarProject) => void
}

export function SidebarNavProjects({
  projects,
  label = "Projects",
  renderActions,
  onViewProject,
  onShareProject,
  onDeleteProject,
}: SidebarNavProjectsProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            {renderActions ? (
              renderActions({ project: item, isMobile })
            ) : (
              (onViewProject || onShareProject || onDeleteProject) && (
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              )
            )}
          </SidebarMenuItem>
        ))}
        {projects.length > 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
