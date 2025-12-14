import { NextMiddleware, NextResponse, NextRequest, NextFetchEvent } from 'next/server';

export function withTrackingMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname } = request.nextUrl;

    // Get response from next middleware
    const response = await next(request, event);

    // Only track public routes (exclude /admin and /api)
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return response;
    }

    // Skip static files and Next.js internals
    if (pathname.match(/^\/(?:_next|.*\..*)/) || pathname === '/not-found') {
      return response;
    }

    // Extract tracking data from request
    const ip = (request as any).ip ||
               request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || '';

    // Get or create session fingerprint from cookie
    let sessionFingerprint = request.cookies.get('session_fingerprint')?.value;

    if (!sessionFingerprint) {
      // Generate new session fingerprint
      sessionFingerprint = generateSessionFingerprint(ip, userAgent);
    }

    // Ensure response is NextResponse
    let nextResponse: NextResponse;
    if (response instanceof NextResponse) {
      nextResponse = response;
    } else {
      nextResponse = NextResponse.next();
    }

    // Set session fingerprint cookie (1 hour expiry for session tracking)
    nextResponse.cookies.set('session_fingerprint', sessionFingerprint, {
      path: '/',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'strict',
      httpOnly: true,
    });

    // Add tracking headers for client-side to read
    nextResponse.headers.set('x-session-fingerprint', sessionFingerprint);
    nextResponse.headers.set('x-visitor-ip', ip);
    nextResponse.headers.set('x-page-path', pathname);
    nextResponse.headers.set('x-referrer', referrer);

    return nextResponse;
  };
}

function generateSessionFingerprint(ip: string, userAgent: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const data = `${ip}-${userAgent}-${timestamp}-${random}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36) + random;
}
