'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Eye, Clock, Users } from "lucide-react";

interface Stats {
  totalSessions: number;
  totalPageViews: number;
  avgTimeOnPage: number;
  uniqueVisitors: number;
  topPages: { page: string; count: number }[];
}

export function AnalyticsStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    try {
      // Total sessions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: totalSessions } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', thirtyDaysAgo.toISOString());

      // Total page views (last 30 days)
      const { count: totalPageViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('entry_time', thirtyDaysAgo.toISOString());

      // Average time on page
      const { data: avgData } = await supabase
        .from('page_views')
        .select('time_on_page_seconds')
        .gte('entry_time', thirtyDaysAgo.toISOString())
        .not('time_on_page_seconds', 'is', null);

      const avgTimeOnPage = avgData && avgData.length > 0
        ? Math.round(avgData.reduce((sum, p) => sum + (p.time_on_page_seconds || 0), 0) / avgData.length)
        : 0;

      // Unique visitors (by IP)
      const { data: uniqueIPs } = await supabase
        .from('sessions')
        .select('ip_address')
        .gte('started_at', thirtyDaysAgo.toISOString());

      const uniqueVisitors = uniqueIPs
        ? new Set(uniqueIPs.map(s => s.ip_address).filter(Boolean)).size
        : 0;

      // Top pages
      const { data: pageViewsData } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('entry_time', thirtyDaysAgo.toISOString());

      const pageCounts: { [key: string]: number } = {};
      pageViewsData?.forEach(pv => {
        pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1;
      });

      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({ page, count }));

      setStats({
        totalSessions: totalSessions || 0,
        totalPageViews: totalPageViews || 0,
        avgTimeOnPage,
        uniqueVisitors,
        topPages,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-muted-foreground">Error al cargar estadísticas</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
          <p className="text-xs text-muted-foreground">Últimos 30 días</p>
        </CardContent>
      </Card>

      {/* Total Page Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPageViews}</div>
          <p className="text-xs text-muted-foreground">Últimos 30 días</p>
        </CardContent>
      </Card>

      {/* Avg Time on Page */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(stats.avgTimeOnPage / 60)}m {stats.avgTimeOnPage % 60}s
          </div>
          <p className="text-xs text-muted-foreground">Por página</p>
        </CardContent>
      </Card>

      {/* Unique Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
          <p className="text-xs text-muted-foreground">Por IP</p>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Páginas Más Visitadas</CardTitle>
          <CardDescription>Top 5 páginas con más visitas en los últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topPages.length > 0 ? (
              stats.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm truncate">{page.page}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {page.count} vistas
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
