import { AnalyticsStats } from '@/app/components/admin/AnalyticsStats';
import { SessionsList } from '@/app/components/admin/SessionsList';

export default function AdminDashboard() {
  return (
    <>
      {/* Stats Overview */}
      <section id="analytics">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Estadísticas Generales
        </h2>
        <AnalyticsStats />
      </section>

      {/* Sessions List */}
      <section id="sessions">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Sesiones de Usuario
        </h2>
        <SessionsList />
      </section>
    </>
  );
}
