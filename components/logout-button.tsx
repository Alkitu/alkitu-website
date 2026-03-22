"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useTranslationContext } from "@/app/context/TranslationContext"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslationContext()

  const label = t("admin.sidebar.logout")

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/al-login")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleLogout}
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
