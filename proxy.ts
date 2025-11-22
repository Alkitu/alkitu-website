import { chain } from './middleware/chain';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';

export default chain([withI18nMiddleware]);

export const config = {
  // Matcher ignoring static files and API routes
  matcher: ['/((?!api|_next|.*\\.)*)'],
};