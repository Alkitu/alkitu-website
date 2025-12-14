import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TrackingEventSchema } from '@/app/schemas/tracking';
import { ApiSuccess, ApiError } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = TrackingEventSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
    }

    const { sessionFingerprint, action } = validationResult.data;

    // Get IP from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    if (action === 'page_view') {
      const { pagePath, locale, referrer } = validationResult.data;

      // Find or create session
      let { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('id')
        .eq('session_fingerprint', sessionFingerprint)
        .gte('last_activity_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .single();

      if (!session) {
        const { data: newSession, error: createError } = await supabase
          .from('sessions')
          .insert({
            session_fingerprint: sessionFingerprint,
            ip_address: ip,
            user_agent: request.headers.get('user-agent') || 'unknown',
          })
          .select('id')
          .single();

        if (createError) {
          return ApiError.database('Failed to create session', createError);
        }

        session = newSession;
      } else {
        // Update session activity
        await supabase
          .from('sessions')
          .update({
            last_activity_at: new Date().toISOString(),
            ip_address: ip, // Update IP in case it changed
          })
          .eq('id', session.id);
      }

      // Create page view
      const { data: pageView, error: pageViewError } = await supabase
        .from('page_views')
        .insert({
          session_id: session.id,
          page_path: pagePath,
          locale: locale,
          referrer: referrer || '',
        })
        .select('id')
        .single();

      if (pageViewError) {
        return ApiError.database('Failed to create page view', pageViewError);
      }

      return ApiSuccess.created({ pageViewId: pageView.id }, 'Page view tracked successfully');
    }

    if (action === 'page_exit') {
      const { pageViewId, timeOnPage } = validationResult.data;

      const { error } = await supabase
        .from('page_views')
        .update({
          exit_time: new Date().toISOString(),
          time_on_page_seconds: timeOnPage,
        })
        .eq('id', pageViewId);

      if (error) {
        return ApiError.database('Failed to update page view', error);
      }

      return ApiSuccess.ok(null, 'Page exit tracked successfully');
    }

    // This should never be reached due to discriminated union validation
    return ApiError.badRequest('Invalid action type');
  } catch (error) {
    console.error('Tracking error:', error);
    return ApiError.internal('Failed to process tracking event', error);
  }
}
