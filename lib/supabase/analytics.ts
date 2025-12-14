import { createClient } from '@supabase/supabase-js';

/**
 * Create a Supabase client specifically for analytics tracking
 * Uses only the anon key without SSR cookie management
 * This ensures it always operates with the 'anon' role for RLS policies
 */
export function createAnalyticsClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
