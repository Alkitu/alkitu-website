'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Loader2, ArrowLeft, Pencil, Send, RefreshCw, Ban, CreditCard, FileText, Trash2, Mail,
  Link2, Copy, CheckCircle,
} from 'lucide-react';

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_type: string;
  line_total: number;
  tax_amount: number;
  sort_order: number;
}

interface InvoiceData {
  id: string;
  series: string;
  number: number;
  invoice_type: string;
  description: string | null;
  issue_date: string;
  due_date: string | null;
  client_id: string | null;
  client_name: string;
  client_nif: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: string;
  payment_method: string | null;
  payment_date: string | null;
  verifacti_uuid: string | null;
  verifacti_status: string | null;
  verifacti_qr: string | null;
  verifacti_url: string | null;
  verifacti_huella: string | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_link_url: string | null;
  notes: string | null;
  created_at: string;
  billing_invoice_lines: InvoiceLine[];
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  issued: { label: 'Emitida', variant: 'default' },
  paid: { label: 'Pagada', variant: 'outline' },
  voided: { label: 'Anulada', variant: 'destructive' },
};

interface InvoiceDetailProps {
  invoiceId: string;
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [linkCopied, setLinkCopied] = useState(false);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}`);
      const json = await res.json();
      if (json.success) {
        setInvoice(json.data);
      } else {
        toast.error('Factura no encontrada');
        router.push('/admin/billing/invoices');
      }
    } catch {
      toast.error('Error al cargar factura');
    } finally {
      setLoading(false);
    }
  }, [invoiceId, router]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  async function handleIssue() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/issue`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura emitida');
        fetchInvoice();
      } else {
        toast.error(json.error?.message || 'Error al emitir');
      }
    } catch {
      toast.error('Error al emitir');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckStatus() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/status`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success(`Estado: ${json.data.verifacti_status}`);
        fetchInvoice();
      } else {
        toast.error(json.error?.message || 'Error');
      }
    } catch {
      toast.error('Error al consultar estado');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleVoid() {
    if (!confirm('¿Estas seguro de anular esta factura?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/void`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura anulada');
        fetchInvoice();
      } else {
        toast.error(json.error?.message || 'Error al anular');
      }
    } catch {
      toast.error('Error al anular');
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePay() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura marcada como pagada');
        setPayDialogOpen(false);
        fetchInvoice();
      } else {
        toast.error(json.error?.message || 'Error');
      }
    } catch {
      toast.error('Error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este borrador?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Factura eliminada');
        router.push('/admin/billing/invoices');
      } else {
        toast.error(json.error?.message || 'Error');
      }
    } catch {
      toast.error('Error al eliminar');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendEmail() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/send`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success(`Email enviado a ${json.data.sentTo}`);
      } else {
        toast.error(json.error?.message || 'Error al enviar email');
      }
    } catch {
      toast.error('Error al enviar email');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCreateCheckout() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}/checkout`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Enlace de pago creado');
        fetchInvoice();
      } else {
        toast.error(json.error?.message || 'Error al crear enlace de pago');
      }
    } catch {
      toast.error('Error al crear enlace de pago');
    } finally {
      setActionLoading(false);
    }
  }

  function handleCopyLink() {
    if (invoice?.stripe_payment_link_url) {
      navigator.clipboard.writeText(invoice.stripe_payment_link_url);
      setLinkCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES');
  }

  if (loading || !invoice) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const sBadge = statusLabels[invoice.status] || statusLabels.draft;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/billing/invoices')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {invoice.series}-{String(invoice.number).padStart(4, '0')}
            </h2>
            <p className="text-sm text-muted-foreground">{invoice.description || 'Sin descripcion'}</p>
          </div>
          <Badge variant={sBadge.variant}>{sBadge.label}</Badge>
          {invoice.verifacti_status && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              invoice.verifacti_status === 'Correcto' ? 'bg-green-100 text-green-800' :
              invoice.verifacti_status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
              invoice.verifacti_status === 'Incorrecto' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {invoice.verifacti_status}
            </span>
          )}
          {invoice.stripe_payment_intent_id && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              <CreditCard className="h-3 w-3" /> Stripe
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <>
              <Button variant="outline" onClick={() => router.push(`/admin/billing/invoices/${invoiceId}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
              <Button onClick={handleIssue} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Emitir
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            </>
          )}
          {invoice.status === 'issued' && (
            <>
              {invoice.verifacti_status === 'Pendiente' && (
                <Button variant="outline" onClick={handleCheckStatus} disabled={actionLoading}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Comprobar estado
                </Button>
              )}
              {invoice.stripe_payment_link_url ? (
                <Button variant="outline" onClick={handleCopyLink}>
                  {linkCopied ? <CheckCircle className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {linkCopied ? 'Copiado' : 'Copiar enlace de pago'}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleCreateCheckout} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                  Enlace de pago
                </Button>
              )}
              <Button variant="outline" onClick={() => setPayDialogOpen(true)}>
                <CreditCard className="mr-2 h-4 w-4" /> Marcar pagada
              </Button>
              <Button variant="outline" onClick={() => window.open(`/api/admin/billing/invoices/${invoiceId}/pdf`, '_blank')}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" onClick={handleSendEmail} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Enviar email
              </Button>
              <Button variant="destructive" onClick={handleVoid} disabled={actionLoading}>
                <Ban className="mr-2 h-4 w-4" /> Anular
              </Button>
            </>
          )}
          {invoice.status === 'paid' && (
            <>
              <Button variant="outline" onClick={() => window.open(`/api/admin/billing/invoices/${invoiceId}/pdf`, '_blank')}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" onClick={handleSendEmail} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Enviar email
              </Button>
              <Button variant="destructive" onClick={handleVoid} disabled={actionLoading}>
                <Ban className="mr-2 h-4 w-4" /> Anular
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Datos de la factura</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Numero:</span><span>{invoice.series}-{String(invoice.number).padStart(4, '0')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tipo:</span><span>{invoice.invoice_type}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fecha emision:</span><span>{formatDate(invoice.issue_date)}</span></div>
            {invoice.due_date && <div className="flex justify-between"><span className="text-muted-foreground">Fecha vencimiento:</span><span>{formatDate(invoice.due_date)}</span></div>}
            {invoice.payment_method && <div className="flex justify-between"><span className="text-muted-foreground">Metodo de pago:</span><span>{invoice.payment_method}</span></div>}
            {invoice.payment_date && <div className="flex justify-between"><span className="text-muted-foreground">Fecha de pago:</span><span>{formatDate(invoice.payment_date)}</span></div>}
            {invoice.stripe_payment_link_url && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Enlace Stripe:</span>
                <Button variant="link" size="sm" className="h-auto p-0" onClick={handleCopyLink}>
                  {linkCopied ? <CheckCircle className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  {linkCopied ? 'Copiado' : 'Copiar enlace'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Nombre:</span><span>{invoice.client_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">NIF:</span><span>{invoice.client_nif}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Verifacti Info */}
      {invoice.verifacti_uuid && (
        <Card>
          <CardHeader><CardTitle>VeriFactu</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">UUID:</span><span className="font-mono text-xs">{invoice.verifacti_uuid}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Estado:</span><span>{invoice.verifacti_status}</span></div>
            {invoice.verifacti_huella && <div className="flex justify-between"><span className="text-muted-foreground">Huella:</span><span className="font-mono text-xs truncate max-w-xs">{invoice.verifacti_huella}</span></div>}
            {invoice.verifacti_qr && (
              <div className="pt-2">
                <p className="text-muted-foreground mb-2">Codigo QR:</p>
                <img src={invoice.verifacti_qr} alt="QR VeriFactu" className="w-32 h-32" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lines */}
      <Card>
        <CardHeader><CardTitle>Lineas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripcion</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio unitario</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">IVA %</TableHead>
                <TableHead className="text-right">Impuesto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.billing_invoice_lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>{line.description}</TableCell>
                  <TableCell className="text-right">{line.quantity}</TableCell>
                  <TableCell className="text-right">{formatPrice(line.unit_price)}</TableCell>
                  <TableCell className="text-right">{formatPrice(line.line_total)}</TableCell>
                  <TableCell className="text-right">{line.tax_rate}%</TableCell>
                  <TableCell className="text-right">{formatPrice(line.tax_amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base imponible:</span>
                <span>{formatPrice(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Impuestos:</span>
                <span>{formatPrice(invoice.tax_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatPrice(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Pay Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como pagada</DialogTitle>
            <DialogDescription>Selecciona el metodo de pago utilizado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Metodo de pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handlePay} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmar pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
