import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

/**
 * Schema for session creation/update
 */
const SessionSchema = z.object({
  sessionFingerprint: z.string().min(1, 'Session fingerprint is required'),
});

/**
 * POST /api/analytics/sessions
 * Create or update a session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request
    const validationResult = SessionSchema.safeParse(body);

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

    const { sessionFingerprint } = validationResult.data;

    // Get IP and User Agent from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Find existing session (within last hour)
    let { data: session } = await supabase
      .from('sessions')
      .select('id, session_fingerprint, started_at, last_activity_at')
      .eq('session_fingerprint', sessionFingerprint)
      .gte('last_activity_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .single();

    if (!session) {
      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('sessions')
        .insert({
          session_fingerprint: sessionFingerprint,
          ip_address: ip,
          user_agent: userAgent,
        })
        .select('id, session_fingerprint, started_at, last_activity_at')
        .single();

      if (createError) {
        console.error('Error creating session:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }

      return NextResponse.json({
        session: newSession,
        created: true
      }, { status: 201 });
    }

    // Update existing session
    const { data: updatedSession, error: updateError } = await supabase
      .from('sessions')
      .update({
        last_activity_at: new Date().toISOString(),
        ip_address: ip,
      })
      .eq('id', session.id)
      .select('id, session_fingerprint, started_at, last_activity_at')
      .single();

    if (updateError) {
      console.error('Error updating session:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      session: updatedSession,
      created: false
    }, { status: 200 });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
