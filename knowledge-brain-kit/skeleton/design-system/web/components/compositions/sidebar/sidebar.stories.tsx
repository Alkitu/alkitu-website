import type { Meta, StoryObj } from "@storybook/react"
import {
    LayoutDashboard,
    Settings,
    Users,
    FileText,
    BarChart2,
    Bell,
    HelpCircle,
    ChevronDown,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "./sidebar"

const meta: Meta<typeof Sidebar> = {
    title: "Compositions/Sidebar",
    component: Sidebar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta
type Story = StoryObj<typeof Sidebar>

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Users" },
    { icon: FileText, label: "Documents" },
    { icon: BarChart2, label: "Analytics" },
    { icon: Bell, label: "Notifications" },
]

const settingsItems = [
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "Help & Support" },
]

const AppSidebar = () => (
    <Sidebar>
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">DS</span>
                </div>
                <span className="font-semibold text-sm">Design System</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>System</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {settingsItems.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton tooltip={item.label}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">LP</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">[Brand] Perez</p>
                    <p className="text-[10px] text-muted-foreground truncate">hello@tuconcepto.com</p>
                </div>
                <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
            </div>
        </SidebarFooter>
    </Sidebar>
)

export const Default: Story = {
    render: () => (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {["Users", "Revenue", "Orders"].map((stat) => (
                        <div key={stat} className="rounded-lg border p-4">
                            <p className="text-xs text-muted-foreground">{stat}</p>
                            <p className="text-2xl font-bold mt-1">
                                {stat === "Revenue" ? "$12,430" : stat === "Users" ? "2,489" : "856"}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </SidebarProvider>
    ),
}

export const Collapsed: Story = {
    render: () => (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Sidebar (starts collapsed)</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Click the trigger button to expand the sidebar. The sidebar can also be
                    toggled via <kbd className="px-1.5 py-0.5 text-xs border rounded">⌘B</kbd>.
                </p>
            </main>
        </SidebarProvider>
    ),
}

export const IconOnly: Story = {
    render: () => (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader className="p-2">
                    <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center mx-auto">
                        <span className="text-primary-foreground text-xs font-bold">DS</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Icon-only Sidebar</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    This sidebar uses <code className="text-xs bg-muted px-1 rounded">collapsible="icon"</code>{" "}
                    mode — it collapses to just the icons instead of hiding completely.
                </p>
            </main>
        </SidebarProvider>
    ),
}
