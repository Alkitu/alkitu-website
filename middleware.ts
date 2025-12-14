import { chain } from './middleware/chain';
import { withSupabaseMiddleware } from './middleware/withSupabaseMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withTrackingMiddleware } from './middleware/withTrackingMiddleware';
import { NextRequest, NextFetchEvent } from 'next/server';

// IMPORTANT: Next.js 16 requires NAMED EXPORT, not default export
// Using "export async function middleware" instead of "export default"
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const handler = chain([
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
