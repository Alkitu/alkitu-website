import { NextMiddleware, NextResponse } from 'next/server';

/**
 * Middleware to add pathname as header for server components
 * This allows us to check the current route in server-side layouts
 */
export function withPathnameHeader(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const pathname = request.nextUrl.pathname;

    // Call next middleware
    const response = await next(request, event);

    // Ensure response is a NextResponse
    let nextResponse: NextResponse;
    if (response instanceof NextResponse) {
      nextResponse = response;
    } else {
      nextResponse = NextResponse.next();
    }

    // Add pathname as header
    nextResponse.headers.set('x-pathname', pathname);

    return nextResponse;
  };
}
