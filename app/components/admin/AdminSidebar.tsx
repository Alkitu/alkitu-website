"use client";

import * as React from "react";
import { BarChart3, Home, Users, FileText, Settings2 } from "lucide-react";
import { NavMain, type NavItem } from "@/app/components/admin/nav-main";
import { NavUser } from "@/app/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userEmail: string;
}

export function AdminSidebar({ userEmail, ...props }: AdminSidebarProps) {
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Resumen",
          url: "/admin/dashboard#analytics",
        },
        {
          title: "Sesiones",
          url: "/admin/dashboard#sessions",
        },
        {
          title: "Páginas",
          url: "/admin/dashboard#pages",
        },
      ],
    },
    {
      title: "Contenido",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "Blog",
          url: "/admin/content/blog",
        },
        {
          title: "Proyectos",
          url: "/admin/content/projects",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/admin/settings",
      icon: Settings2,
    },
  ];

  const user = {
    email: userEmail,
    name: "Admin",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 lg:h-[60px] py-0 m-auto w-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Alkitu Analytics</span>
                  <span className="text-xs text-muted-foreground">
                    Admin Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
