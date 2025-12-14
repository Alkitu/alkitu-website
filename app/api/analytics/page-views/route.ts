import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

/**
 * Schema for page view creation
 */
const PageViewSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  pagePath: z.string().min(1, 'Page path is required'),
  locale: z.string().min(2).max(5),
  referrer: z.string().optional().default(''),
});

/**
 * POST /api/analytics/page-views
 * Create a new page view
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request
    const validationResult = PageViewSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json({
        error: 'Validation failed',
        details: errors
      }, { status: 400 });
    }

    const { sessionId, pagePath, locale, referrer } = validationResult.data;

    // Verify session exists
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({
        error: 'Session not found'
      }, { status: 404 });
    }

    // Create page view
    const { data: pageView, error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        page_path: pagePath,
        locale: locale,
        referrer: referrer || '',
      })
      .select('id, session_id, page_path, locale, entry_time')
      .single();

    if (pageViewError) {
      console.error('Error creating page view:', pageViewError);
      return NextResponse.json({ error: pageViewError.message }, { status: 500 });
    }

    return NextResponse.json({
      pageView
    }, { status: 201 });
  } catch (error) {
    console.error('Page view API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
