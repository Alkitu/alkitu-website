'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Wifi, Copy, CheckCircle } from 'lucide-react';

interface StripeSettingsData {
  stripe_enabled: boolean;
  stripe_auto_invoice: boolean;
  stripe_auto_issue: boolean;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
}

interface StripeStatusData {
  connected: boolean;
  error?: string;
  livemode?: boolean;
  account_id?: string;
  country?: string;
  default_currency?: string;
}

export function StripeSettings() {
  const [settings, setSettings] = useState<StripeSettingsData>({
    stripe_enabled: false,
    stripe_auto_invoice: false,
    stripe_auto_issue: false,
    stripe_secret_key: '',
    stripe_webhook_secret: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<StripeStatusData | null>(null);
  const [webhookCopied, setWebhookCopied] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/billing/stripe/settings');
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          stripe_enabled: json.data.stripe_enabled || false,
          stripe_auto_invoice: json.data.stripe_auto_invoice || false,
          stripe_auto_issue: json.data.stripe_auto_issue || false,
          stripe_secret_key: json.data.stripe_secret_key || '',
          stripe_webhook_secret: json.data.stripe_webhook_secret || '',
        });
      }
    } catch {
      toast.error('Error al cargar configuracion de Stripe');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/billing/stripe/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Configuracion de Stripe guardada');
        // Re-fetch to get masked values back
        fetchSettings();
      } else {
        toast.error(json.error?.message || 'Error al guardar');
      }
    } catch {
      toast.error('Error al guardar configuracion');
    } finally {
      setSaving(false);
    }
  }

  async function handleCheck() {
    setChecking(true);
    try {
      const res = await fetch('/api/admin/billing/stripe/status');
      const json = await res.json();
      if (json.success) {
        setStatus(json.data);
        if (json.data.connected) {
          toast.success(`Stripe conectado. Modo: ${json.data.livemode ? 'Produccion' : 'Test'}`);
        } else {
          toast.error(json.data.error || 'No conectado');
        }
      }
    } catch {
      toast.error('No se pudo conectar con Stripe');
    } finally {
      setChecking(false);
    }
  }

  function handleCopyWebhookUrl() {
    const url = `${window.location.origin}/api/billing/webhooks/stripe`;
    navigator.clipboard.writeText(url);
    setWebhookCopied(true);
    toast.success('URL del webhook copiada');
    setTimeout(() => setWebhookCopied(false), 2000);
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
      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>Claves API</CardTitle>
          <CardDescription>Configura las claves de tu cuenta de Stripe. Tambien puedes configurarlas como variables de entorno (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe_secret_key">Secret Key</Label>
            <Input
              id="stripe_secret_key"
              type="password"
              value={settings.stripe_secret_key}
              onChange={(e) => setSettings((prev) => ({ ...prev, stripe_secret_key: e.target.value }))}
              placeholder="sk_test_... o sk_live_..."
            />
            <p className="text-xs text-muted-foreground">
              Encuentra tu clave en Stripe Dashboard {'>'} Developers {'>'} API keys
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
            <Input
              id="stripe_webhook_secret"
              type="password"
              value={settings.stripe_webhook_secret}
              onChange={(e) => setSettings((prev) => ({ ...prev, stripe_webhook_secret: e.target.value }))}
              placeholder="whsec_..."
            />
            <p className="text-xs text-muted-foreground">
              Se genera al crear un endpoint de webhook en Stripe Dashboard
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Conexion</CardTitle>
          <CardDescription>Verifica la conexion con tu cuenta de Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCheck} disabled={checking}>
              {checking ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
              ) : (
                <><Wifi className="mr-2 h-4 w-4" /> Verificar conexion</>
              )}
            </Button>
            {status && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {status.connected
                    ? `Conectado - ${status.livemode ? 'Produccion' : 'Test'} (${status.country}, ${status.default_currency?.toUpperCase()})`
                    : status.error || 'No conectado'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>URL del Webhook</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/billing/webhooks/stripe` : '/api/billing/webhooks/stripe'}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyWebhookUrl}>
                {webhookCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Registra esta URL en Stripe Dashboard {'>'} Developers {'>'} Webhooks
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automatizacion</CardTitle>
          <CardDescription>Configura como se procesan los pagos de Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stripe habilitado</Label>
              <p className="text-xs text-muted-foreground">Activar la integracion con Stripe</p>
            </div>
            <Switch
              checked={settings.stripe_enabled}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, stripe_enabled: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-generar facturas</Label>
              <p className="text-xs text-muted-foreground">
                Crear facturas automaticamente al recibir pagos de Stripe sin factura vinculada
              </p>
            </div>
            <Switch
              checked={settings.stripe_auto_invoice}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, stripe_auto_invoice: checked }))}
              disabled={!settings.stripe_enabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-emitir a VeriFACTU</Label>
              <p className="text-xs text-muted-foreground">
                Emitir automaticamente a la AEAT las facturas generadas por Stripe
              </p>
            </div>
            <Switch
              checked={settings.stripe_auto_issue}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, stripe_auto_issue: checked }))}
              disabled={!settings.stripe_enabled || !settings.stripe_auto_invoice}
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                'Guardar configuracion'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
