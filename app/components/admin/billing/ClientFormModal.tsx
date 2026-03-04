'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ClientData {
  id?: string;
  name: string;
  nif: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  province: string;
  country: string;
  notes: string;
}

const emptyClient: ClientData = {
  name: '',
  nif: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  province: '',
  country: 'ES',
  notes: '',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientInput = Record<string, any>;

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  client?: ClientInput | null;
}

export function ClientFormModal({ open, onClose, onSaved, client }: ClientFormModalProps) {
  const [form, setForm] = useState<ClientData>(emptyClient);
  const [saving, setSaving] = useState(false);
  const isEdit = !!client?.id;

  useEffect(() => {
    if (client) {
      setForm({
        ...emptyClient,
        ...client,
        email: client.email || '',
        phone: client.phone || '',
        address_line1: client.address_line1 || '',
        address_line2: client.address_line2 || '',
        city: client.city || '',
        postal_code: client.postal_code || '',
        province: client.province || '',
        country: client.country || 'ES',
        notes: client.notes || '',
      });
    } else {
      setForm(emptyClient);
    }
  }, [client, open]);

  function updateField(field: keyof ClientData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.nif.trim()) {
      toast.error('Nombre y NIF son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/billing/clients/${client!.id}`
        : '/api/admin/billing/clients';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(isEdit ? 'Cliente actualizado' : 'Cliente creado');
        onSaved();
        onClose();
      } else {
        toast.error(json.error?.message || 'Error al guardar');
      }
    } catch {
      toast.error('Error al guardar el cliente');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del cliente' : 'Completa los datos del nuevo cliente'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nombre / Razon Social *</Label>
              <Input
                id="client-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Empresa S.L."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-nif">NIF/CIF *</Label>
              <Input
                id="client-nif"
                value={form.nif}
                onChange={(e) => updateField('nif', e.target.value)}
                placeholder="B12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefono</Label>
              <Input
                id="client-phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-address1">Direccion</Label>
            <Input
              id="client-address1"
              value={form.address_line1}
              onChange={(e) => updateField('address_line1', e.target.value)}
              placeholder="Calle Principal, 1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-city">Ciudad</Label>
              <Input
                id="client-city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-province">Provincia</Label>
              <Input
                id="client-province"
                value={form.province}
                onChange={(e) => updateField('province', e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-postal">Codigo Postal</Label>
              <Input
                id="client-postal"
                value={form.postal_code}
                onChange={(e) => updateField('postal_code', e.target.value)}
                placeholder="28001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-notes">Notas</Label>
            <textarea
              id="client-notes"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Notas internas sobre el cliente..."
            />
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
