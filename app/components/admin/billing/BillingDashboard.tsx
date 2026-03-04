'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Receipt, Clock, AlertCircle, Plus } from 'lucide-react';

interface RecentInvoice {
  id: string;
  series: string;
  number: number;
  client_name: string;
  total: number;
  status: string;
  issue_date: string;
}

interface SummaryData {
  counts: {
    total: number;
    draft: number;
    issued: number;
    paid: number;
    voided: number;
  };
  yearRevenue: number;
  yearSubtotal: number;
  yearTax: number;
  monthRevenue: number;
  outstanding: number;
  recentInvoices: RecentInvoice[];
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  issued: { label: 'Emitida', variant: 'default' },
  paid: { label: 'Pagada', variant: 'outline' },
  voided: { label: 'Anulada', variant: 'destructive' },
};

export function BillingDashboard() {
  const router = useRouter();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/admin/billing/reports?type=summary');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch {
        toast.error('Error al cargar resumen');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground text-center py-16">No se pudo cargar el resumen.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Facturacion</h2>
        <Button onClick={() => router.push('/admin/billing/invoices/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nueva factura
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturacion anual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(data.yearRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Base: {formatPrice(data.yearSubtotal)} + IVA: {formatPrice(data.yearTax)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este mes</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(data.monthRevenue)}</div>
            <p className="text-xs text-muted-foreground">{data.counts.total} facturas totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de cobro</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(data.outstanding)}</div>
            <p className="text-xs text-muted-foreground">{data.counts.issued} facturas emitidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.draft}</div>
            <p className="text-xs text-muted-foreground">
              {data.counts.paid} pagadas | {data.counts.voided} anuladas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Facturas recientes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push('/admin/billing/invoices')}>
            Ver todas
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay facturas aun. Crea la primera factura para empezar.
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentInvoices.map((inv) => {
                const badge = statusLabels[inv.status] || statusLabels.draft;
                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => router.push(`/admin/billing/invoices/${inv.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium">
                        {inv.series}-{String(inv.number).padStart(4, '0')}
                      </span>
                      <span className="text-sm text-muted-foreground">{inv.client_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatPrice(inv.total)}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push('/admin/billing/invoices')}>
          <Receipt className="h-5 w-5 mb-1" />
          <span className="text-xs">Facturas</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push('/admin/billing/clients')}>
          <span className="text-lg mb-1">👥</span>
          <span className="text-xs">Clientes</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push('/admin/billing/reports')}>
          <TrendingUp className="h-5 w-5 mb-1" />
          <span className="text-xs">Informes</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => router.push('/admin/billing/settings')}>
          <span className="text-lg mb-1">⚙️</span>
          <span className="text-xs">Configuracion</span>
        </Button>
      </div>
    </div>
  );
}
