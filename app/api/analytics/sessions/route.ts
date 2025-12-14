import { NextRequest } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';

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
    const supabase = createAnalyticsClient();
    const body = await request.json();

    // Validate request
    const validationResult = SessionSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiError.validationError(validationResult.error);
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
        return ApiError.database('Failed to create session', createError);
      }

      return ApiSuccess.created({ session: newSession }, 'Session created successfully');
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
      return ApiError.database('Failed to update session', updateError);
    }

    return ApiSuccess.ok({ session: updatedSession }, 'Session updated successfully');
  } catch (error) {
    console.error('Session API error:', error);
    return ApiError.internal('Failed to process session request', error);
  }
}
