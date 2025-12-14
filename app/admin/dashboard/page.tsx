import { AnalyticsStats } from '@/app/components/admin/AnalyticsStats';
import { SessionsList } from '@/app/components/admin/SessionsList';

import { LocationStats } from '@/app/components/admin/LocationStats';

export default function AdminDashboard() {
  return (
    <>
      {/* Stats Overview */}
      <section id="analytics" className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Estadísticas Generales
          </h2>
          <AnalyticsStats />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ubicación de Visitas
          </h2>
          <LocationStats />
        </div>
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
