'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SessionDetail } from './SessionDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Session {
  id: string;
  session_fingerprint: string;
  ip_address: string | null;
  user_agent: string;
  started_at: string;
  last_activity_at: string;
  total_page_views: number;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchSessions();
  }, [page]);

  const fetchSessions = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;

      setSessions(prev => page === 0 ? data : [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '< 1 min';
    if (diffMins < 60) return `${diffMins} min`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones Recientes</CardTitle>
        <CardDescription>
          Haz clic en una sesión para ver el flujo de páginas detallado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map(session => (
            <Card
              key={session.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedSessionId(
                selectedSessionId === session.id ? null : session.id
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">
                        {session.ip_address || 'IP Desconocida'}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {session.total_page_views} páginas
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {session.user_agent}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Inicio: {formatDate(session.started_at)}</span>
                      <span>•</span>
                      <span>Duración: {formatDuration(session.started_at, session.last_activity_at)}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {selectedSessionId === session.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {selectedSessionId === session.id && (
                  <div className="mt-4 pt-4 border-t">
                    <SessionDetail sessionId={session.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Cargando sesiones...
          </div>
        )}

        {!loading && hasMore && (
          <div className="text-center mt-4">
            <Button
              onClick={() => setPage(p => p + 1)}
              variant="outline"
            >
              Cargar Más
            </Button>
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron sesiones
          </div>
        )}
      </CardContent>
    </Card>
  );
}
