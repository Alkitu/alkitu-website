'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface StripeEvent {
  id: string;
  stripe_event_id: string;
  event_type: string;
  processed: boolean;
  processing_result: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function StripeEventsList() {
  const [events, setEvents] = useState<StripeEvent[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const fetchEvents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filter) params.set('event_type', filter);

      const res = await fetch(`/api/admin/billing/stripe/events?${params}`);
      const json = await res.json();
      if (json.success) {
        setEvents(json.data.events);
        setPagination(json.data.pagination);
      }
    } catch {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getEventBadge(type: string) {
    if (type.startsWith('checkout.session')) return 'default';
    if (type.startsWith('invoice.')) return 'secondary';
    if (type.startsWith('charge.refunded')) return 'destructive';
    if (type.startsWith('customer.subscription')) return 'outline';
    return 'secondary';
  }

  const eventTypes = [
    '',
    'checkout.session.completed',
    'invoice.paid',
    'charge.refunded',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Eventos Webhook</CardTitle>
            <CardDescription>Historial de eventos recibidos de Stripe</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchEvents(pagination.page)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Todos los eventos</option>
            {eventTypes.filter(Boolean).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No hay eventos registrados</p>
        ) : (
          <>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getEventBadge(event.event_type)}>
                        {event.event_type}
                      </Badge>
                      {event.processed ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Procesado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Pendiente
                        </Badge>
                      )}
                      {event.error_message && (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                      {event.stripe_event_id}
                    </p>
                    {event.error_message && (
                      <p className="text-xs text-red-600">{event.error_message}</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{formatDate(event.created_at)}</p>
                    {event.processed_at && (
                      <p>Procesado: {formatDate(event.processed_at)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {pagination.total} eventos en total
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchEvents(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchEvents(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
