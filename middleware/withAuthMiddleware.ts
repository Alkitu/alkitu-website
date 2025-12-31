import { NextMiddleware, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PUBLIC_ADMIN_PATHS = ['/auth/login'];

export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Only process /admin routes (including localized versions)
    const isProtected = pathname.startsWith('/admin') || 
                        pathname.match(/^\/(es|en)\/admin/);

    if (!isProtected) {
      return next(request, event);
    }

    // Allow public admin paths (login page)
    if (PUBLIC_ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      return next(request, event);
    }

    // Create response to hold cookies
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user || error) {
      const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);

      // Copy Supabase cookies to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });

      return redirectResponse;
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminError) {
      // User is authenticated but not an admin
      const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
      const redirectResponse = NextResponse.redirect(new URL(`/${locale}/auth/login?error=unauthorized`, request.url));

      // Copy Supabase cookies to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });

      return redirectResponse;
    }

    // Handle /admin redirect to /admin/dashboard
    if (pathname === '/admin') {
      const redirectResponse = NextResponse.redirect(new URL('/admin/dashboard', request.url));

      // Copy Supabase cookies to redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });

      return redirectResponse;
    }

    // Continue to next middleware, passing through cookies
    const nextResponse = await next(request, event);

    if (nextResponse instanceof NextResponse) {
      response.cookies.getAll().forEach((cookie) => {
        nextResponse.cookies.set(cookie.name, cookie.value);
      });
      return nextResponse;
    }

    return response;
  };
}
