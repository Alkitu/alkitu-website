'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Plus, Search, Eye, Pencil, Trash2, Loader2, Send, RefreshCw, Ban, CreditCard,
} from 'lucide-react';

interface Invoice {
  id: string;
  series: string;
  number: number;
  invoice_type: string;
  description: string | null;
  issue_date: string;
  client_name: string;
  client_nif: string;
  total: number;
  status: string;
  verifacti_status: string | null;
  created_at: string;
  [key: string]: unknown;
}

const statusBadges: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  issued: { label: 'Emitida', variant: 'default' },
  paid: { label: 'Pagada', variant: 'outline' },
  voided: { label: 'Anulada', variant: 'destructive' },
};

const verifactiBadges: Record<string, { label: string; className: string }> = {
  Pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
  Correcto: { label: 'Correcto', className: 'bg-green-100 text-green-800' },
  Incorrecto: { label: 'Incorrecto', className: 'bg-red-100 text-red-800' },
  Anulado: { label: 'Anulado', className: 'bg-gray-100 text-gray-800' },
};

export function InvoicesList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20', status: statusFilter });
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/billing/invoices?${params}`);
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data.invoices);
        setTotalPages(json.data.pagination.totalPages);
      }
    } catch {
      toast.error('Error al cargar facturas');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${deleteId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura eliminada');
        fetchInvoices();
      } else {
        toast.error(json.error?.message || 'Error al eliminar');
      }
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleIssue(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${id}/issue`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura emitida');
        fetchInvoices();
      } else {
        toast.error(json.error?.message || 'Error al emitir');
      }
    } catch {
      toast.error('Error al emitir');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCheckStatus(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${id}/status`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success(`Estado: ${json.data.verifacti_status}`);
        fetchInvoices();
      } else {
        toast.error(json.error?.message || 'Error al consultar');
      }
    } catch {
      toast.error('Error al consultar estado');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVoid(id: string) {
    if (!confirm('¿Estas seguro de anular esta factura? Se enviara la anulacion a VeriFactu.')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${id}/void`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura anulada');
        fetchInvoices();
      } else {
        toast.error(json.error?.message || 'Error al anular');
      }
    } catch {
      toast.error('Error al anular');
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePay(id: string) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'transfer' }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura marcada como pagada');
        fetchInvoices();
      } else {
        toast.error(json.error?.message || 'Error');
      }
    } catch {
      toast.error('Error al marcar como pagada');
    } finally {
      setActionLoading(null);
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES');
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Facturas</CardTitle>
          <Button onClick={() => router.push('/admin/billing/invoices/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Factura
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o descripcion..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="issued">Emitida</SelectItem>
                <SelectItem value="paid">Pagada</SelectItem>
                <SelectItem value="voided">Anulada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No hay facturas</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numero</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>VeriFactu</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => {
                    const sBadge = statusBadges[inv.status] || statusBadges.draft;
                    const vBadge = inv.verifacti_status ? verifactiBadges[inv.verifacti_status] : null;
                    const isLoading = actionLoading === inv.id;

                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">
                          {inv.series}-{String(inv.number).padStart(4, '0')}
                        </TableCell>
                        <TableCell>{formatDate(inv.issue_date)}</TableCell>
                        <TableCell>
                          <div>{inv.client_name}</div>
                          <div className="text-xs text-muted-foreground">{inv.client_nif}</div>
                        </TableCell>
                        <TableCell className="font-medium">{formatPrice(inv.total)}</TableCell>
                        <TableCell>
                          <Badge variant={sBadge.variant}>{sBadge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {vBadge ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${vBadge.className}`}>
                              {vBadge.label}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => router.push(`/admin/billing/invoices/${inv.id}`)}
                              title="Ver"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {inv.status === 'draft' && (
                              <>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => router.push(`/admin/billing/invoices/${inv.id}/edit`)}
                                  title="Editar"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleIssue(inv.id)}
                                  disabled={isLoading}
                                  title="Emitir"
                                >
                                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => setDeleteId(inv.id)}
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}

                            {inv.status === 'issued' && (
                              <>
                                {inv.verifacti_status === 'Pendiente' && (
                                  <Button
                                    variant="ghost" size="icon"
                                    onClick={() => handleCheckStatus(inv.id)}
                                    disabled={isLoading}
                                    title="Comprobar estado"
                                  >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handlePay(inv.id)}
                                  disabled={isLoading}
                                  title="Marcar pagada"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost" size="icon"
                                  onClick={() => handleVoid(inv.id)}
                                  disabled={isLoading}
                                  title="Anular"
                                >
                                  <Ban className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}

                            {inv.status === 'paid' && (
                              <Button
                                variant="ghost" size="icon"
                                onClick={() => handleVoid(inv.id)}
                                disabled={isLoading}
                                title="Anular"
                              >
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">Pagina {page} de {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar factura</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de que deseas eliminar este borrador? Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
