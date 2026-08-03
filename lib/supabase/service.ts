import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. Bypasses RLS entirely — use only for server-only code
 * paths that have already established trust some other way (e.g. the Stripe
 * webhook, whose signature check IS the auth boundary; there is no user
 * session to evaluate `auth.uid()` against). Never import this from code that
 * handles an unauthenticated request without its own signature/secret check.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
