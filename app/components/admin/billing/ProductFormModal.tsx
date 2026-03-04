'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ProductData {
  id?: string;
  name: string;
  description: string;
  default_price: number | string;
  tax_rate: number | string;
  tax_type: string;
  unit: string;
  active: boolean;
}

const emptyProduct: ProductData = {
  name: '',
  description: '',
  default_price: '',
  tax_rate: 21,
  tax_type: 'IVA',
  unit: 'service',
  active: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProductInput = Record<string, any>;

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  product?: ProductInput | null;
}

export function ProductFormModal({ open, onClose, onSaved, product }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductData>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const isEdit = !!product?.id;

  useEffect(() => {
    if (product) {
      setForm({
        ...emptyProduct,
        ...product,
        description: product.description || '',
        default_price: product.default_price ?? '',
      });
    } else {
      setForm(emptyProduct);
    }
  }, [product, open]);

  function updateField(field: keyof ProductData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Nombre es obligatorio');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/billing/products/${product!.id}`
        : '/api/admin/billing/products';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload = {
        ...form,
        default_price: form.default_price === '' ? null : Number(form.default_price),
        tax_rate: Number(form.tax_rate),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(isEdit ? 'Producto actualizado' : 'Producto creado');
        onSaved();
        onClose();
      } else {
        toast.error(json.error?.message || 'Error al guardar');
      }
    } catch {
      toast.error('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del producto/servicio' : 'Completa los datos del nuevo producto/servicio'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Nombre *</Label>
            <Input
              id="product-name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Desarrollo web"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-desc">Descripcion</Label>
            <textarea
              id="product-desc"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descripcion del servicio..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-price">Precio por defecto</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                value={form.default_price}
                onChange={(e) => updateField('default_price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-tax">IVA (%)</Label>
              <Input
                id="product-tax"
                type="number"
                step="0.01"
                value={form.tax_rate}
                onChange={(e) => updateField('tax_rate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de impuesto</Label>
              <Select value={form.tax_type} onValueChange={(v) => updateField('tax_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IVA">IVA</SelectItem>
                  <SelectItem value="IGIC">IGIC</SelectItem>
                  <SelectItem value="IRPF">IRPF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select value={form.unit} onValueChange={(v) => updateField('unit', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Servicio</SelectItem>
                  <SelectItem value="hour">Hora</SelectItem>
                  <SelectItem value="unit">Unidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
