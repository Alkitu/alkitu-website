import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { getStripeKey, getStripe } from '@/lib/stripe/client';

/**
 * GET /api/admin/billing/stripe/status
 * Check Stripe connection status by making a test API call.
 * Reads the key from DB first, falling back to env var.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ApiError.unauthorized('Authentication required');

    const { data: adminUser } = await supabase
      .from('admin_users').select('id').eq('id', user.id).single();
    if (!adminUser) return ApiError.forbidden('Admin access required');

    // Get key from DB or env var
    const stripeKey = await getStripeKey();

    if (!stripeKey) {
      return ApiSuccess.ok({
        connected: false,
        error: 'Stripe Secret Key no configurada (ni en BD ni como variable de entorno)',
      });
    }

    // Test connection with the resolved key
    const stripe = getStripe(stripeKey);
    const account = await stripe.accounts.retrieve();

    return ApiSuccess.ok({
      connected: true,
      account_id: account.id,
      livemode: !stripeKey.startsWith('sk_test_'),
      country: account.country,
      default_currency: account.default_currency,
    });
  } catch (error) {
    console.error('Stripe status error:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return ApiSuccess.ok({
      connected: false,
      error: message,
    });
  }
}
