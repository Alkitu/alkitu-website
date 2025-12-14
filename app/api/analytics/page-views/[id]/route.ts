import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

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
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const uuidValidation = uuidSchema.safeParse(id);

    if (!uuidValidation.success) {
      return NextResponse.json({
        error: 'Invalid page view ID format'
      }, { status: 400 });
    }

    // Validate request body
    const validationResult = PageViewUpdateSchema.safeParse(body);

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
        return NextResponse.json({
          error: 'Page view not found'
        }, { status: 404 });
      }
      console.error('Error updating page view:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      pageView
    }, { status: 200 });
  } catch (error) {
    console.error('Page view update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
