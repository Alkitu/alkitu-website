import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { billingSettingsSchema } from '@/lib/schemas/billing';

/**
 * Mask a secret key for safe display.
 */
function maskKey(key: string | null | undefined): string | null {
  if (!key) return null;
  const prefixMatch = key.match(/^(sk_test_|sk_live_|whsec_|rk_test_|rk_live_)/);
  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const suffix = key.slice(-3);
    return `${prefix}...${suffix}`;
  }
  if (key.length > 8) {
    return `${key.slice(0, 4)}...${key.slice(-3)}`;
  }
  return '***';
}

/**
 * Check if a value is a masked placeholder (contains "...").
 */
function isMaskedValue(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.includes('...');
}

/**
 * GET /api/admin/billing/settings
 * Fetch billing settings (single row) or return defaults if none exist.
 * Stripe keys are returned masked.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    const { data: settings, error } = await supabase
      .from('billing_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return ApiError.database('Failed to fetch billing settings', error);
    }

    // Mask sensitive keys before returning
    if (settings) {
      settings.stripe_secret_key = maskKey(settings.stripe_secret_key);
      settings.stripe_webhook_secret = maskKey(settings.stripe_webhook_secret);
    }

    return ApiSuccess.ok(settings || null);
  } catch (error) {
    console.error('Billing settings GET error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}

/**
 * PATCH /api/admin/billing/settings
 * Upsert billing settings (create or update the single row).
 * Masked key values are ignored (not updated).
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
    const result = billingSettingsSchema.safeParse(body);

    if (!result.success) {
      return ApiError.validationError(result.error);
    }

    // Strip masked key values so they don't overwrite real keys
    const saveData = { ...result.data };
    if (isMaskedValue(saveData.stripe_secret_key)) {
      delete saveData.stripe_secret_key;
    }
    if (isMaskedValue(saveData.stripe_webhook_secret)) {
      delete saveData.stripe_webhook_secret;
    }

    // Check if settings row already exists
    const { data: existing } = await supabase
      .from('billing_settings')
      .select('id')
      .limit(1)
      .single();

    let data;
    let error;

    if (existing) {
      // Update existing row
      const response = await supabase
        .from('billing_settings')
        .update(saveData)
        .eq('id', existing.id)
        .select()
        .single();
      data = response.data;
      error = response.error;
    } else {
      // Insert new row
      const response = await supabase
        .from('billing_settings')
        .insert(saveData)
        .select()
        .single();
      data = response.data;
      error = response.error;
    }

    if (error) {
      return ApiError.database('Failed to save billing settings', error);
    }

    // Mask keys in the response
    if (data) {
      data.stripe_secret_key = maskKey(data.stripe_secret_key);
      data.stripe_webhook_secret = maskKey(data.stripe_webhook_secret);
    }

    return ApiSuccess.ok(data, 'Configuracion guardada correctamente');
  } catch (error) {
    console.error('Billing settings PATCH error:', error);
    return ApiError.internal('An unexpected error occurred');
  }
}
