"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardProps {
  children?: React.ReactNode;
  userEmail: string;
  userName?: string;
}

export default function Dashboard({
  children,
  userEmail,
  userName,
}: DashboardProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        user={{
          name: userName || "Admin",
          email: userEmail,
        }}
      />
      <SidebarInset>
        {/* Sticky Header - following shadcn/ui insiders pattern */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {userName || userEmail}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
