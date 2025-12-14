import { NextMiddleware, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export function withSupabaseMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    // Update Supabase session for all routes
    const supabaseResponse = await updateSession(request);

    // Continue to next middleware
    const response = await next(request, event);

    // Merge Supabase cookies with response
    if (response instanceof NextResponse) {
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
      });
      return response;
    }

    return supabaseResponse;
  };
}
