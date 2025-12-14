import { chain } from './middleware/chain';
import { withSupabaseMiddleware } from './middleware/withSupabaseMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withTrackingMiddleware } from './middleware/withTrackingMiddleware';

export default chain([
  withSupabaseMiddleware,    // 1. Refresh Supabase auth session (all routes)
  withAuthMiddleware,        // 2. Protect admin routes (only /admin/*)
  withI18nMiddleware,        // 3. i18n routing (exclude /admin)
  withTrackingMiddleware,    // 4. Track visits (exclude /admin and /api)
]);

export const config = {
  // Include admin routes in matcher now
  matcher: ['/((?!_next|.*\\.)*)'],
};