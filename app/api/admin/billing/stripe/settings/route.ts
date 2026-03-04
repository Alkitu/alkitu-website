import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { stripeSettingsSchema } from '@/lib/schemas/stripe';

/**
 * Mask a secret key for safe display.
 * "sk_test_abc123xyz" -> "sk_test_...xyz"
 * "whsec_abc123xyz"   -> "whsec_...xyz"
 */
function maskKey(key: string | null): string | null {
  if (!key) return null;
  // Find prefix (sk_test_, sk_live_, whsec_, etc.)
  const prefixMatch = key.match(/^(sk_test_|sk_live_|whsec_|rk_test_|rk_live_)/);
  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const suffix = key.slice(-3);
    return `${prefix}...${suffix}`;
  }
  // Generic masking for unknown format
  if (key.length > 8) {
    return `${key.slice(0, 4)}...${key.slice(-3)}`;
  }
  return '***';
}

/**
 * Check if a value is a masked placeholder (contains "...").
 * If so, it should NOT be saved — the user didn't change it.
 */
function isMaskedValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.includes('...');
}

/**
 * GET /api/admin/billing/stripe/settings
 * Fetch Stripe-specific settings from billing_settings.
 * Keys are returned masked (only last 3 chars visible).
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { data: settings } = await supabase
      .from('billing_settings')
      .select('stripe_enabled, stripe_auto_invoice, stripe_auto_issue, stripe_secret_key, stripe_webhook_secret')
      .limit(1)
      .single();

    const response = {
      stripe_enabled: settings?.stripe_enabled ?? false,
      stripe_auto_invoice: settings?.stripe_auto_invoice ?? false,
      stripe_auto_issue: settings?.stripe_auto_issue ?? false,
      stripe_secret_key: maskKey(settings?.stripe_secret_key ?? null),
      stripe_webhook_secret: maskKey(settings?.stripe_webhook_secret ?? null),
    };

    return ApiSuccess.ok(response);
  } catch (error) {
    console.error('Stripe settings GET error:', error);
    return ApiError.internal('Error al obtener configuracion de Stripe');
  }
}

/**
 * PATCH /api/admin/billing/stripe/settings
 * Update Stripe-specific settings.
 * If a key value is masked (contains "..."), it is NOT updated.
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const body = await request.json();
    const result = stripeSettingsSchema.safeParse(body);
    if (!result.success) return ApiError.validationError(result.error);

    // Check if settings row exists
    const { data: existing } = await supabase
      .from('billing_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existing) {
      return ApiError.badRequest('Primero configura los datos de facturacion en Configuracion general.');
    }

    // Build update payload, skipping masked key values
    const updateData: Record<string, unknown> = {
      stripe_enabled: result.data.stripe_enabled,
      stripe_auto_invoice: result.data.stripe_auto_invoice,
      stripe_auto_issue: result.data.stripe_auto_issue,
    };

    // Only update keys if a new (non-masked) value was provided
    if (result.data.stripe_secret_key !== undefined && !isMaskedValue(result.data.stripe_secret_key)) {
      updateData.stripe_secret_key = result.data.stripe_secret_key || null;
    }
    if (result.data.stripe_webhook_secret !== undefined && !isMaskedValue(result.data.stripe_webhook_secret)) {
      updateData.stripe_webhook_secret = result.data.stripe_webhook_secret || null;
    }

    const { error } = await supabase
      .from('billing_settings')
      .update(updateData)
      .eq('id', existing.id);

    if (error) return ApiError.database('Error al actualizar configuracion', error);

    return ApiSuccess.ok(result.data, 'Configuracion de Stripe actualizada');
  } catch (error) {
    console.error('Stripe settings PATCH error:', error);
    return ApiError.internal('Error al actualizar configuracion de Stripe');
  }
}
