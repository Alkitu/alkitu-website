'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Wifi } from 'lucide-react';

interface BillingSettingsData {
  id?: string;
  company_name: string;
  nif: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  province: string;
  country: string;
  email: string;
  phone: string;
  logo_url: string;
  verifacti_api_key: string;
  default_series: string;
  default_payment_terms: number;
  default_tax_rate: number;
  invoice_footer_es: string;
  invoice_footer_en: string;
  bank_iban: string;
  bank_swift: string;
  stripe_enabled: boolean;
  stripe_auto_invoice: boolean;
  stripe_auto_issue: boolean;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
}

const defaultSettings: BillingSettingsData = {
  company_name: '',
  nif: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  province: '',
  country: 'ES',
  email: '',
  phone: '',
  logo_url: '',
  verifacti_api_key: '',
  default_series: 'F',
  default_payment_terms: 30,
  default_tax_rate: 21,
  invoice_footer_es: '',
  invoice_footer_en: '',
  bank_iban: '',
  bank_swift: '',
  stripe_enabled: false,
  stripe_auto_invoice: false,
  stripe_auto_issue: false,
  stripe_secret_key: '',
  stripe_webhook_secret: '',
};

export function BillingSettingsForm() {
  const [settings, setSettings] = useState<BillingSettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [checkingStripe, setCheckingStripe] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{ connected: boolean; error?: string; livemode?: boolean } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/billing/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          ...defaultSettings,
          ...json.data,
          address_line1: json.data.address_line1 || '',
          address_line2: json.data.address_line2 || '',
          city: json.data.city || '',
          postal_code: json.data.postal_code || '',
          province: json.data.province || '',
          country: json.data.country || 'ES',
          email: json.data.email || '',
          phone: json.data.phone || '',
          logo_url: json.data.logo_url || '',
          verifacti_api_key: json.data.verifacti_api_key || '',
          invoice_footer_es: json.data.invoice_footer_es || '',
          invoice_footer_en: json.data.invoice_footer_en || '',
          bank_iban: json.data.bank_iban || '',
          bank_swift: json.data.bank_swift || '',
          stripe_enabled: json.data.stripe_enabled || false,
          stripe_auto_invoice: json.data.stripe_auto_invoice || false,
          stripe_auto_issue: json.data.stripe_auto_issue || false,
          stripe_secret_key: json.data.stripe_secret_key || '',
          stripe_webhook_secret: json.data.stripe_webhook_secret || '',
        });
      }
    } catch {
      toast.error('Error al cargar la configuracion');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/billing/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Configuracion guardada correctamente');
        fetchSettings();
      } else {
        toast.error(json.error?.message || 'Error al guardar');
      }
    } catch {
      toast.error('Error al guardar la configuracion');
    } finally {
      setSaving(false);
    }
  }

  async function handleHealthCheck() {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/admin/billing/settings/health', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success(`Conexion verificada. NIF: ${json.data?.nif || 'N/A'}, Entorno: ${json.data?.environment || 'N/A'}`);
      } else {
        toast.error(json.error?.message || 'Error de conexion');
      }
    } catch {
      toast.error('No se pudo conectar con Verifacti');
    } finally {
      setCheckingHealth(false);
    }
  }

  async function handleStripeCheck() {
    setCheckingStripe(true);
    try {
      const res = await fetch('/api/admin/billing/stripe/status');
      const json = await res.json();
      if (json.success) {
        setStripeStatus(json.data);
        if (json.data.connected) {
          toast.success(`Stripe conectado. Modo: ${json.data.livemode ? 'Produccion' : 'Test'}`);
        } else {
          toast.error(json.data.error || 'No conectado');
        }
      } else {
        toast.error('Error al verificar Stripe');
      }
    } catch {
      toast.error('No se pudo conectar con Stripe');
    } finally {
      setCheckingStripe(false);
    }
  }

  function updateField(field: keyof BillingSettingsData, value: string | number | boolean) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la Empresa</CardTitle>
          <CardDescription>Informacion fiscal que aparecera en las facturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Razon Social *</Label>
              <Input
                id="company_name"
                value={settings.company_name}
                onChange={(e) => updateField('company_name', e.target.value)}
                placeholder="Alkitu S.L."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nif">NIF/CIF *</Label>
              <Input
                id="nif"
                value={settings.nif}
                onChange={(e) => updateField('nif', e.target.value)}
                placeholder="B12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="facturacion@alkitu.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Direccion</Label>
            <Input
              id="address_line1"
              value={settings.address_line1}
              onChange={(e) => updateField('address_line1', e.target.value)}
              placeholder="Calle Principal, 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_line2">Direccion (linea 2)</Label>
            <Input
              id="address_line2"
              value={settings.address_line2}
              onChange={(e) => updateField('address_line2', e.target.value)}
              placeholder="Piso 3, Oficina A"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={settings.province}
                onChange={(e) => updateField('province', e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Codigo Postal</Label>
              <Input
                id="postal_code"
                value={settings.postal_code}
                onChange={(e) => updateField('postal_code', e.target.value)}
                placeholder="28001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verifacti Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Conexion Verifacti</CardTitle>
          <CardDescription>API key para el envio de facturas a la AEAT via VeriFACTU</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verifacti_api_key">API Key</Label>
            <Input
              id="verifacti_api_key"
              type="password"
              value={settings.verifacti_api_key}
              onChange={(e) => updateField('verifacti_api_key', e.target.value)}
              placeholder="vf_xxxxxxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              La clave determina automaticamente el NIF emisor y el entorno (test/produccion)
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleHealthCheck}
            disabled={checkingHealth || !settings.verifacti_api_key}
          >
            {checkingHealth ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
            ) : (
              <><Wifi className="mr-2 h-4 w-4" /> Verificar conexion</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Stripe Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Integracion Stripe</CardTitle>
          <CardDescription>Pagos con tarjeta y generacion automatica de facturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stripe_secret_key_settings">Secret Key</Label>
              <Input
                id="stripe_secret_key_settings"
                type="password"
                value={settings.stripe_secret_key}
                onChange={(e) => updateField('stripe_secret_key', e.target.value)}
                placeholder="sk_test_... o sk_live_..."
              />
              <p className="text-xs text-muted-foreground">
                Stripe Dashboard {'>'} Developers {'>'} API keys
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe_webhook_secret_settings">Webhook Secret</Label>
              <Input
                id="stripe_webhook_secret_settings"
                type="password"
                value={settings.stripe_webhook_secret}
                onChange={(e) => updateField('stripe_webhook_secret', e.target.value)}
                placeholder="whsec_..."
              />
              <p className="text-xs text-muted-foreground">
                Se genera al crear un endpoint de webhook en Stripe
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stripe habilitado</Label>
              <p className="text-xs text-muted-foreground">Activar la integracion con Stripe para pagos</p>
            </div>
            <Switch
              checked={settings.stripe_enabled}
              onCheckedChange={(checked) => updateField('stripe_enabled', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-generar facturas</Label>
              <p className="text-xs text-muted-foreground">Crear facturas automaticamente cuando se reciben pagos de Stripe</p>
            </div>
            <Switch
              checked={settings.stripe_auto_invoice}
              onCheckedChange={(checked) => updateField('stripe_auto_invoice', checked)}
              disabled={!settings.stripe_enabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-emitir a VeriFACTU</Label>
              <p className="text-xs text-muted-foreground">Emitir automaticamente las facturas generadas por Stripe a la AEAT</p>
            </div>
            <Switch
              checked={settings.stripe_auto_issue}
              onCheckedChange={(checked) => updateField('stripe_auto_issue', checked)}
              disabled={!settings.stripe_enabled || !settings.stripe_auto_invoice}
            />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleStripeCheck}
              disabled={checkingStripe}
            >
              {checkingStripe ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
              ) : (
                <><Wifi className="mr-2 h-4 w-4" /> Verificar conexion Stripe</>
              )}
            </Button>
            {stripeStatus && (
              <span className={`text-sm ${stripeStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                {stripeStatus.connected
                  ? `Conectado (${stripeStatus.livemode ? 'Produccion' : 'Test'})`
                  : stripeStatus.error || 'No conectado'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Valores por Defecto</CardTitle>
          <CardDescription>Configuracion predeterminada para nuevas facturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_series">Serie</Label>
              <Input
                id="default_series"
                value={settings.default_series}
                onChange={(e) => updateField('default_series', e.target.value)}
                placeholder="F"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_payment_terms">Plazo de pago (dias)</Label>
              <Input
                id="default_payment_terms"
                type="number"
                value={settings.default_payment_terms}
                onChange={(e) => updateField('default_payment_terms', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_tax_rate">IVA por defecto (%)</Label>
              <Input
                id="default_tax_rate"
                type="number"
                step="0.01"
                value={settings.default_tax_rate}
                onChange={(e) => updateField('default_tax_rate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Bancarios</CardTitle>
          <CardDescription>Informacion de pago que aparecera en las facturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_iban">IBAN</Label>
              <Input
                id="bank_iban"
                value={settings.bank_iban}
                onChange={(e) => updateField('bank_iban', e.target.value)}
                placeholder="ES00 0000 0000 0000 0000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_swift">SWIFT/BIC</Label>
              <Input
                id="bank_swift"
                value={settings.bank_swift}
                onChange={(e) => updateField('bank_swift', e.target.value)}
                placeholder="XXXXESXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Pie de Factura</CardTitle>
          <CardDescription>Texto legal o notas que apareceran al final de las facturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoice_footer_es">Pie de factura (Espanol)</Label>
            <textarea
              id="invoice_footer_es"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.invoice_footer_es}
              onChange={(e) => updateField('invoice_footer_es', e.target.value)}
              placeholder="Inscrita en el Registro Mercantil de..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice_footer_en">Pie de factura (Ingles)</Label>
            <textarea
              id="invoice_footer_en"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.invoice_footer_en}
              onChange={(e) => updateField('invoice_footer_en', e.target.value)}
              placeholder="Registered in the Commercial Registry of..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Guardar configuracion</>
          )}
        </Button>
      </div>
    </div>
  );
}
