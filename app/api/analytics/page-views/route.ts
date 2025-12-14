import { NextRequest } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';

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
    const supabase = createAnalyticsClient();
    const body = await request.json();

    // Validate request
    const validationResult = PageViewSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { sessionId, pagePath, locale, referrer } = validationResult.data;

    // Verify session exists
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return ApiError.notFound('Session not found');
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
      return ApiError.database('Failed to create page view', pageViewError);
    }

    return ApiSuccess.created({ pageView }, 'Page view created successfully');
  } catch (error) {
    console.error('Page view API error:', error);
    return ApiError.internal('Failed to process page view request', error);
  }
}
