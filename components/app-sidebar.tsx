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
  User,
  UserCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { LogoutButton } from "@/components/logout-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
      title: "Perfiles",
      url: "/admin/profiles",
      icon: UserCog,
      items: [],
    },
  ],
  navFooter: [
    {
      title: "Mi Perfil",
      url: "/admin/profile",
      icon: User,
    },
    {
      title: "Configuración",
      url: "/admin/settings",
      icon: Settings,
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
        <SidebarMenu>
          {data.navFooter.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
