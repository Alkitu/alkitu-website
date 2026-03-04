"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  Tags,
  User,
  UserCog,
  Mail,
  Megaphone,
  FileText,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslationContext } from "@/app/context/TranslationContext"

import { NavMain } from "@/components/nav-main"
import { LogoutButton } from "@/components/logout-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { t } = useTranslationContext()
  const pathname = usePathname()

  const navMain = [
    {
      title: t("admin.sidebar.dashboard"),
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: pathname.includes("/admin/dashboard"),
      items: [],
    },
    {
      title: t("admin.sidebar.projects"),
      url: "/admin/projects",
      icon: FolderKanban,
      items: [],
    },
    {
      title: t("admin.sidebar.categories"),
      url: "/admin/project-categories",
      icon: Tags,
      items: [],
    },
    {
      title: t("admin.sidebar.users"),
      url: "/admin/users",
      icon: Users,
      items: [],
    },
    {
      title: t("admin.sidebar.profiles"),
      url: "/admin/profiles",
      icon: UserCog,
      items: [],
    },
    {
      title: t("admin.sidebar.contactMessages"),
      url: "/admin/contact-submissions",
      icon: Mail,
      items: [],
    },
    {
      title: t("admin.sidebar.newsletterSubscribers"),
      url: "/admin/newsletter-subscribers",
      icon: Megaphone,
      items: [],
    },
    {
      title: t("admin.sidebar.billing"),
      url: "/admin/billing",
      icon: FileText,
      isActive: pathname.includes("/admin/billing"),
      items: [
        { title: t("admin.sidebar.invoices"), url: "/admin/billing/invoices" },
        { title: t("admin.sidebar.clients"), url: "/admin/billing/clients" },
        { title: t("admin.sidebar.products"), url: "/admin/billing/products" },
        { title: t("admin.sidebar.reports"), url: "/admin/billing/reports" },
        { title: t("admin.sidebar.payments"), url: "/admin/billing/payments" },
        { title: t("admin.sidebar.billingSettings"), url: "/admin/billing/settings" },
      ],
    },
  ]

  const navFooter = [
    {
      title: t("admin.sidebar.myProfile"),
      url: "/admin/profile",
      icon: User,
    },
    {
      title: t("admin.sidebar.settings"),
      url: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="flex items-end group-data-[collapsible=icon]:items-center">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} groupLabel={t("admin.sidebar.platform")} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {navFooter.map((item) => (
            <SidebarMenuItem key={item.url}>
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
