import { chain } from './middleware/chain';
import { withPathnameHeader } from './middleware/withPathnameHeader';
import { withSupabaseMiddleware } from './middleware/withSupabaseMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withTrackingMiddleware } from './middleware/withTrackingMiddleware';
import { NextRequest, NextFetchEvent } from 'next/server';

// IMPORTANT: Next.js 16 renamed middleware.ts to proxy.ts
// Using "export async function proxy" as the new convention
export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const handler = chain([
    withPathnameHeader,        // 0. Add pathname header for layouts
    withSupabaseMiddleware,    // 1. Refresh Supabase auth session (all routes)
    withAuthMiddleware,        // 2. Protect admin routes (only /admin/*)
    withI18nMiddleware,        // 3. i18n routing (exclude /admin)
    withTrackingMiddleware,    // 4. Track visits (exclude /admin and /api)
  ]);

  return handler(request, event);
}

// Matcher config to run on all routes except Next.js internals
export const config = {
  matcher: [

    // Incluir todas las rutas excepto assets y API
    '/((?!api|_next|.*\\.).*)',
  ],
};
