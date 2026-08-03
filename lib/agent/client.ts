/**
 * Supabase client for the knowledge tools.
 *
 * Deliberately standalone rather than reusing `lib/supabase/*`: these functions
 * run both inside Next (server components) and outside it (`npx tsx -e ...`,
 * validation scripts), so they cannot depend on `next/headers` or on env vars
 * being pre-loaded by the framework.
 *
 * Uses the service-role key when present (scripts, admin previews of drafts) and
 * falls back to the anon key, which sees only published rows via RLS.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let loaded = false;

function loadEnv() {
  if (loaded) return;
  loaded = true;
  for (const file of ['.env.local', '.env']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const [, key, raw] = m;
      if (process.env[key]) continue;
      process.env[key] = raw.replace(/^["']|["']$/g, '');
    }
  }
}

let cached: SupabaseClient | null = null;

export function agentClient(): SupabaseClient {
  if (cached) return cached;
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and either ' +
        'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
