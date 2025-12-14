import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TrackingEventSchema } from '@/app/schemas/tracking';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = TrackingEventSchema.safeParse(body);

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
          return NextResponse.json({ error: createError.message }, { status: 500 });
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
        return NextResponse.json({ error: pageViewError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, pageViewId: pageView.id });
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
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // This should never be reached due to discriminated union validation
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
