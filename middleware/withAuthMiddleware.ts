import { NextMiddleware, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Only process /admin routes
    if (!pathname.startsWith('/admin')) {
      return next(request, event);
    }

    // Allow public admin paths (login page)
    if (PUBLIC_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      return next(request, event);
    }

    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // No-op in middleware
          },
        },
      }
    );

    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user || error) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminError) {
      // User is authenticated but not an admin
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
    }

    // Handle /admin redirect to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return next(request, event);
  };
}
