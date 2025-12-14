'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PageView {
  id: string;
  page_path: string;
  locale: string | null;
  referrer: string;
  entry_time: string;
  exit_time: string | null;
  time_on_page_seconds: number | null;
}

interface SessionDetailProps {
  sessionId: string;
}

export function SessionDetail({ sessionId }: SessionDetailProps) {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPageViews();
  }, [sessionId]);

  const fetchPageViews = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .eq('session_id', sessionId)
        .order('entry_time', { ascending: true });

      if (error) throw error;

      setPageViews(data);
    } catch (error) {
      console.error('Error fetching page views:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';

    if (seconds < 60) return `${seconds}s`;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Cargando flujo de páginas...</div>;
  }

  if (pageViews.length === 0) {
    return <div className="text-sm text-muted-foreground">No se encontraron vistas de página</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Recorrido del Usuario</h3>

      <div className="space-y-2">
        {pageViews.map((pv, index) => (
          <div
            key={pv.id}
            className="flex items-start gap-3 p-3 bg-background rounded border border-border"
          >
            {/* Step number */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </div>

            {/* Page info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground truncate">
                  {pv.page_path}
                </span>
                {pv.locale && (
                  <span className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground rounded">
                    {pv.locale.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>Entrada: {formatTime(pv.entry_time)}</span>
                {pv.time_on_page_seconds !== null && (
                  <span>Tiempo: {formatDuration(pv.time_on_page_seconds)}</span>
                )}
              </div>

              {index === 0 && pv.referrer && (
                <div className="mt-1 text-xs text-muted-foreground truncate">
                  Origen: {pv.referrer}
                </div>
              )}
            </div>

            {/* Arrow for flow */}
            {index < pageViews.length - 1 && (
              <div className="flex-shrink-0 text-muted-foreground">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
