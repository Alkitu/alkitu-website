import { NextRequest } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';

/**
 * Schema for page view update
 */
const PageViewUpdateSchema = z.object({
  timeOnPage: z.number().int().nonnegative(),
});

/**
 * PATCH /api/analytics/page-views/[id]
 * Update page view with exit time and time on page
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAnalyticsClient();
    const { id } = await params;
    const body = await request.json();

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const uuidValidation = uuidSchema.safeParse(id);

    if (!uuidValidation.success) {
      return ApiError.badRequest('Invalid page view ID format');
    }

    // Validate request body
    const validationResult = PageViewUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { timeOnPage } = validationResult.data;

    // Update page view
    const { data: pageView, error: updateError } = await supabase
      .from('page_views')
      .update({
        exit_time: new Date().toISOString(),
        time_on_page_seconds: timeOnPage,
      })
      .eq('id', id)
      .select('id, session_id, page_path, entry_time, exit_time, time_on_page_seconds')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return ApiError.notFound('Page view not found');
      }
      console.error('Error updating page view:', updateError);
      return ApiError.database('Failed to update page view', updateError);
    }

    return ApiSuccess.ok({ pageView }, 'Page view updated successfully');
  } catch (error) {
    console.error('Page view update API error:', error);
    return ApiError.internal('Failed to process page view update', error);
  }
}
