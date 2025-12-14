import TailwindGrid from "@/app/components/templates/grid";
import { AdminSidebar } from './AdminSidebar';
import { SessionsList } from './SessionsList';
import { AnalyticsStats } from './AnalyticsStats';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
}

interface AnalyticsDashboardProps {
  user: AdminUser;
}

export function AnalyticsDashboard({ user }: AnalyticsDashboardProps) {
  return (
    <SidebarProvider>
      <AdminSidebar userEmail={user.email} />
      
      <SidebarInset>
        <TailwindGrid fullSize>
          <div className="col-span-full flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-card w-full">
              <SidebarTrigger className="-ml-1 md:hidden" />
              <Separator orientation="vertical" className="mr-2 h-4 md:hidden" />
              
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user.full_name || user.email}
                </span>
              </div>
            </header>

            <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 w-full">
              {/* Stats Overview */}
              <section id="analytics">
                <h2 className="text-2xl font-bold text-foreground mb-4">Estadísticas Generales</h2>
                <AnalyticsStats />
              </section>

              {/* Sessions List */}
              <section id="sessions">
                <h2 className="2xl font-bold text-foreground mb-4">Sesiones de Usuario</h2>
                <SessionsList />
              </section>
            </main>
          </div>
        </TailwindGrid>
      </SidebarInset>
    </SidebarProvider>
  );
}
