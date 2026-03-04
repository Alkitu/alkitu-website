'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Trash2, Save, Send } from 'lucide-react';

interface InvoiceLine {
  id?: string;
  product_id: string | null;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  tax_rate: number | string;
  tax_type: string;
}

interface ClientOption {
  id: string;
  name: string;
  nif: string;
}

interface ProductOption {
  id: string;
  name: string;
  default_price: number | null;
  tax_rate: number;
  tax_type: string;
  description: string | null;
}

interface InvoiceOption {
  id: string;
  series: string;
  number: number;
  client_name: string;
  issue_date: string;
  total: number;
}

const emptyLine: InvoiceLine = {
  product_id: null,
  description: '',
  quantity: 1,
  unit_price: 0,
  tax_rate: 21,
  tax_type: 'IVA',
};

interface InvoiceFormProps {
  invoiceId?: string;
}

export function InvoiceForm({ invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const isEdit = !!invoiceId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [issuedInvoices, setIssuedInvoices] = useState<InvoiceOption[]>([]);

  const [clientId, setClientId] = useState('');
  const [series, setSeries] = useState('F');
  const [invoiceType, setInvoiceType] = useState('F1');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<InvoiceLine[]>([{ ...emptyLine }]);

  // Corrective invoice fields
  const [correctedInvoiceId, setCorrectedInvoiceId] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionType, setCorrectionType] = useState<'S' | 'I'>('S');

  const isRectificativa = invoiceType.startsWith('R');

  // Fetch clients, products, and issued invoices for selectors
  const fetchOptions = useCallback(async () => {
    const [clientsRes, productsRes, invoicesRes] = await Promise.all([
      fetch('/api/admin/billing/clients?limit=100'),
      fetch('/api/admin/billing/products?limit=100'),
      fetch('/api/admin/billing/invoices?status=issued&limit=100'),
    ]);
    const clientsJson = await clientsRes.json();
    const productsJson = await productsRes.json();
    const invoicesJson = await invoicesRes.json();

    if (clientsJson.success) setClients(clientsJson.data.clients);
    if (productsJson.success) setProducts(productsJson.data.products);
    if (invoicesJson.success) setIssuedInvoices(invoicesJson.data.invoices || []);
  }, []);

  // Fetch existing invoice for edit mode
  const fetchInvoice = useCallback(async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/billing/invoices/${invoiceId}`);
      const json = await res.json();
      if (json.success) {
        const inv = json.data;
        setClientId(inv.client_id || '');
        setSeries(inv.series);
        setInvoiceType(inv.invoice_type);
        setDescription(inv.description || '');
        setDueDate(inv.due_date || '');
        setNotes(inv.notes || '');
        if (inv.billing_invoice_lines?.length > 0) {
          setLines(inv.billing_invoice_lines.map((l: InvoiceLine) => ({
            product_id: l.product_id || null,
            description: l.description,
            quantity: l.quantity,
            unit_price: l.unit_price,
            tax_rate: l.tax_rate,
            tax_type: l.tax_type,
          })));
        }
      } else {
        toast.error('Error al cargar factura');
        router.push('/admin/billing/invoices');
      }
    } catch {
      toast.error('Error al cargar factura');
    } finally {
      setLoading(false);
    }
  }, [invoiceId, router]);

  useEffect(() => {
    fetchOptions();
    if (isEdit) fetchInvoice();
  }, [fetchOptions, fetchInvoice, isEdit]);

  function addLine() {
    setLines((prev) => [...prev, { ...emptyLine }]);
  }

  function removeLine(index: number) {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLine(index: number, field: keyof InvoiceLine, value: string | number | null) {
    setLines((prev) => prev.map((line, i) => i === index ? { ...line, [field]: value } : line));
  }

  function applyProduct(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setLines((prev) => prev.map((line, i) => i === index ? {
      ...line,
      product_id: productId,
      description: product.description || product.name,
      unit_price: product.default_price ?? 0,
      tax_rate: product.tax_rate,
      tax_type: product.tax_type,
    } : line));
  }

  function getLineTotal(line: InvoiceLine): number {
    const qty = Number(line.quantity) || 0;
    const price = Number(line.unit_price) || 0;
    return Number((qty * price).toFixed(2));
  }

  function getLineTax(line: InvoiceLine): number {
    const base = getLineTotal(line);
    const rate = Number(line.tax_rate) || 0;
    return Number((base * rate / 100).toFixed(2));
  }

  const subtotal = lines.reduce((sum, l) => sum + getLineTotal(l), 0);
  const taxTotal = lines.reduce((sum, l) => sum + getLineTax(l), 0);
  const total = Number((subtotal + taxTotal).toFixed(2));

  function buildPayload() {
    const payload: Record<string, unknown> = {
      series,
      invoice_type: invoiceType,
      description: description || null,
      due_date: dueDate || null,
      client_id: clientId,
      notes: notes || null,
      lines: lines.map((l) => ({
        product_id: l.product_id || null,
        description: l.description,
        quantity: Number(l.quantity),
        unit_price: Number(l.unit_price),
        tax_rate: Number(l.tax_rate),
        tax_type: l.tax_type,
      })),
    };

    if (isRectificativa) {
      payload.corrected_invoice_id = correctedInvoiceId || null;
      payload.correction_reason = correctionReason || null;
      payload.correction_type = correctionType;
    }

    return payload;
  }

  function validate(): boolean {
    if (!clientId) { toast.error('Selecciona un cliente'); return false; }
    if (isRectificativa) {
      if (!correctedInvoiceId) { toast.error('Selecciona la factura original a rectificar'); return false; }
      if (!correctionReason.trim()) { toast.error('Indica el motivo de la rectificacion'); return false; }
    }
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].description.trim()) {
        toast.error(`Linea ${i + 1}: Descripcion es obligatoria`);
        return false;
      }
      if (Number(lines[i].quantity) <= 0) {
        toast.error(`Linea ${i + 1}: Cantidad debe ser mayor a 0`);
        return false;
      }
    }
    return true;
  }

  async function handleSaveDraft() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      const url = isEdit
        ? `/api/admin/billing/invoices/${invoiceId}`
        : '/api/admin/billing/invoices';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(isEdit ? 'Borrador actualizado' : 'Borrador creado');
        router.push(`/admin/billing/invoices/${json.data.id}`);
      } else {
        toast.error(json.error?.message || 'Error al guardar');
      }
    } catch {
      toast.error('Error al guardar la factura');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAndIssue() {
    if (!validate()) return;
    setIssuing(true);
    try {
      let id = invoiceId;

      // If new invoice, create draft first
      if (!isEdit) {
        const payload = buildPayload();
        const res = await fetch('/api/admin/billing/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) {
          toast.error(json.error?.message || 'Error al crear factura');
          return;
        }
        id = json.data.id;
      } else {
        // Save draft first
        const payload = buildPayload();
        const res = await fetch(`/api/admin/billing/invoices/${invoiceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) {
          toast.error(json.error?.message || 'Error al actualizar');
          return;
        }
      }

      // Issue
      const issueRes = await fetch(`/api/admin/billing/invoices/${id}/issue`, { method: 'POST' });
      const issueJson = await issueRes.json();

      if (issueJson.success) {
        toast.success('Factura emitida y enviada a VeriFactu');
        router.push(`/admin/billing/invoices/${id}`);
      } else {
        toast.error(issueJson.error?.message || 'Error al emitir');
        // Still redirect to the draft if it was created
        if (id && id !== invoiceId) {
          router.push(`/admin/billing/invoices/${id}`);
        }
      }
    } catch {
      toast.error('Error al emitir la factura');
    } finally {
      setIssuing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isEdit ? 'Editar Factura' : 'Nueva Factura'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/billing/invoices')}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={saving || issuing}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar borrador
          </Button>
          <Button onClick={handleSaveAndIssue} disabled={saving || issuing}>
            {issuing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Guardar y emitir
          </Button>
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la factura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.nif})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Serie</Label>
              <Input value={series} onChange={(e) => setSeries(e.target.value)} placeholder="F" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de factura</Label>
              <Select value={invoiceType} onValueChange={setInvoiceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="F1">F1 - Factura completa</SelectItem>
                  <SelectItem value="F2">F2 - Factura simplificada</SelectItem>
                  <SelectItem value="F3">F3 - Factura emitida sustitutiva</SelectItem>
                  <SelectItem value="R1">R1 - Rectificativa art. 80.1/2/6</SelectItem>
                  <SelectItem value="R2">R2 - Rectificativa art. 80.3</SelectItem>
                  <SelectItem value="R3">R3 - Rectificativa art. 80.4</SelectItem>
                  <SelectItem value="R4">R4 - Rectificativa otros</SelectItem>
                  <SelectItem value="R5">R5 - Rectificativa en facturas simplificadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descripcion</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Servicios de desarrollo web - Enero 2026"
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notas internas</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas internas (no aparecen en la factura)..."
            />
          </div>

          {/* Corrective invoice fields — shown only for R1-R5 types */}
          {isRectificativa && (
            <div className="border rounded-lg p-4 space-y-4 bg-amber-50 dark:bg-amber-950/20">
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Datos de la factura rectificativa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Factura original a rectificar *</Label>
                  <Select value={correctedInvoiceId} onValueChange={setCorrectedInvoiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar factura..." />
                    </SelectTrigger>
                    <SelectContent>
                      {issuedInvoices.map((inv) => (
                        <SelectItem key={inv.id} value={inv.id}>
                          {inv.series}-{String(inv.number).padStart(4, '0')} — {inv.client_name} ({new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(inv.total)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de rectificacion</Label>
                  <Select value={correctionType} onValueChange={(v) => setCorrectionType(v as 'S' | 'I')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S — Por sustitucion</SelectItem>
                      <SelectItem value="I">I — Por diferencias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Motivo de la rectificacion *</Label>
                <Input
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Ej: Error en el importe de los servicios facturados..."
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Lineas</CardTitle>
          <Button variant="outline" size="sm" onClick={addLine}>
            <Plus className="mr-2 h-4 w-4" /> Agregar linea
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {lines.map((line, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Linea {index + 1}</span>
                {lines.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeLine(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Producto (opcional)</Label>
                  <Select
                    value={line.product_id || 'none'}
                    onValueChange={(v) => v === 'none' ? updateLine(index, 'product_id', null) : applyProduct(index, v)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Sin producto --</SelectItem>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <Label className="text-xs">Descripcion *</Label>
                  <Input
                    className="h-9"
                    value={line.description}
                    onChange={(e) => updateLine(index, 'description', e.target.value)}
                    placeholder="Descripcion del servicio..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Cantidad</Label>
                  <Input
                    className="h-9"
                    type="number"
                    step="0.01"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Precio unitario</Label>
                  <Input
                    className="h-9"
                    type="number"
                    step="0.01"
                    value={line.unit_price}
                    onChange={(e) => updateLine(index, 'unit_price', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">IVA %</Label>
                  <Input
                    className="h-9"
                    type="number"
                    step="0.01"
                    value={line.tax_rate}
                    onChange={(e) => updateLine(index, 'tax_rate', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tipo impuesto</Label>
                  <Select value={line.tax_type} onValueChange={(v) => updateLine(index, 'tax_type', v)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IVA">IVA</SelectItem>
                      <SelectItem value="IGIC">IGIC</SelectItem>
                      <SelectItem value="IRPF">IRPF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Base</Label>
                  <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm">
                    {getLineTotal(line).toFixed(2)} €
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Impuesto</Label>
                  <div className="h-9 flex items-center px-3 bg-muted rounded-md text-sm">
                    {getLineTax(line).toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base imponible:</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Impuestos:</span>
                <span>{taxTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
