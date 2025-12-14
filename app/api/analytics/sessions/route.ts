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
 * Fetch fallback geolocation data from ip-api.com
 */
async function fetchGeoFallback(ip: string) {
  try {
    // ip-api.com free endpoint (45 req/min limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode,regionName,city,lat,lon`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.countryCode,
        region: data.regionName, // Use full name e.g. "Miranda" instead of "M"
        city: data.city,
        latitude: data.lat,
        longitude: data.lon
      };
    }
  } catch (error) {
    console.error('Error fetching geo fallback:', error);
  }
  return null;
}

/**
 * POST /api/analytics/sessions
 * Create or update a session
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Sessions API] POST request received');
    const supabase = createAnalyticsClient();
    const body = await request.json();
    console.log('[Sessions API] Request body:', body);

    // Validate request
    const validationResult = SessionSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[Sessions API] Validation error:', validationResult.error);
      return ApiError.validationError(validationResult.error);
    }

    const { sessionFingerprint } = validationResult.data;
    console.log('[Sessions API] Session fingerprint:', sessionFingerprint);

    // Get IP and User Agent from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    console.log('[Sessions API] Client info - IP:', ip, 'User Agent:', userAgent.substring(0, 50));

    // Find existing session (within last hour)
    console.log('[Sessions API] Checking for existing session');
    let { data: session } = await supabase
      .from('sessions')
      .select('id, session_fingerprint, started_at, last_activity_at')
      .eq('session_fingerprint', sessionFingerprint)
      .gte('last_activity_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .single();

    if (session) {
      console.log('[Sessions API] Found existing session:', session.id);
    } else {
      console.log('[Sessions API] No existing session found, will create new one');
    }

    if (!session) {
      // Resolve location from IP using ip-api.com
      console.log('[Sessions API] Creating new session for IP:', ip);

      let country = null;
      let region = null;
      let city = null;
      let latitude = null;
      let longitude = null;

      // Fetch geolocation for valid IPs
      if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
        console.log('[Sessions API] Fetching geolocation for IP:', ip);
        const geo = await fetchGeoFallback(ip);
        if (geo) {
          country = geo.country;
          region = geo.region;
          city = geo.city;
          latitude = geo.latitude;
          longitude = geo.longitude;
          console.log('[Sessions API] Geolocation resolved:', { country, region, city });
        } else {
          console.warn('[Sessions API] Failed to resolve geolocation for IP:', ip);
        }
      } else {
        console.log('[Sessions API] Skipping geolocation for local/unknown IP:', ip);
      }

      // Create new session
      console.log('[Sessions API] Inserting new session with fingerprint:', sessionFingerprint);
      const { data: newSession, error: createError } = await supabase
        .from('sessions')
        .insert({
          session_fingerprint: sessionFingerprint,
          ip_address: ip,
          user_agent: userAgent,
          country,
          region,
          city,
          latitude,
          longitude,
        })
        .select('id, session_fingerprint, started_at, last_activity_at')
        .single();

      if (createError) {
        console.error('[Sessions API] Error creating session:', createError);
        console.error('[Sessions API] Failed data:', { sessionFingerprint, ip, userAgent, country, region, city });
        return ApiError.database('Failed to create session', createError);
      }

      console.log('[Sessions API] Session created successfully:', newSession.id);
      return ApiSuccess.created({ session: newSession }, 'Session created successfully');
    }

    // Resolve location from IP using ip-api.com (update in case it changed or was missing)
    console.log('[Sessions API] Updating existing session:', session.id, 'for IP:', ip);

    let country = undefined;
    let region = undefined;
    let city = undefined;
    let latitude = undefined;
    let longitude = undefined;

    // Fetch geolocation for valid IPs
    if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
      console.log('[Sessions API] Fetching geolocation for IP:', ip);
      const geo = await fetchGeoFallback(ip);
      if (geo) {
        country = geo.country;
        region = geo.region;
        city = geo.city;
        latitude = geo.latitude;
        longitude = geo.longitude;
        console.log('[Sessions API] Geolocation resolved:', { country, region, city });
      } else {
        console.warn('[Sessions API] Failed to resolve geolocation for IP:', ip);
      }
    } else {
      console.log('[Sessions API] Skipping geolocation for local/unknown IP:', ip);
    }
    
    // Update existing session
    console.log('[Sessions API] Updating session record in database');
    const { data: updatedSession, error: updateError } = await supabase
      .from('sessions')
      .update({
        last_activity_at: new Date().toISOString(),
        ip_address: ip,
        country,
        region,
        city,
        latitude,
        longitude,
      })
      .eq('id', session.id)
      .select('id, session_fingerprint, started_at, last_activity_at')
      .single();

    if (updateError) {
      console.error('[Sessions API] Error updating session:', updateError);
      console.error('[Sessions API] Failed data:', { sessionId: session.id, ip, country, region, city });
      return ApiError.database('Failed to update session', updateError);
    }

    console.log('[Sessions API] Session updated successfully:', updatedSession.id);
    return ApiSuccess.ok({ session: updatedSession }, 'Session updated successfully');
  } catch (error) {
    console.error('[Sessions API] Unexpected error:', error);
    console.error('[Sessions API] Error type:', error instanceof Error ? error.name : typeof error);
    console.error('[Sessions API] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[Sessions API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return ApiError.internal('Failed to process session request', error);
  }
}
