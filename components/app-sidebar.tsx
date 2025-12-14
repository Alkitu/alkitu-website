"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Tags,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { LogoutButton } from "@/components/logout-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Alkitu",
      logo: Command,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Proyectos",
      url: "/admin/projects",
      icon: FolderKanban,
      items: [],
    },
    {
      title: "Categorías",
      url: "/admin/project-categories",
      icon: Tags,
      items: [],
    },
    {
      title: "Usuarios",
      url: "/admin/users",
      icon: Users,
      items: [],
    },
    {
      title: "Configuración",
      url: "/admin/settings",
      icon: Settings,
      items: [],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      {/* <SidebarHeader>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
