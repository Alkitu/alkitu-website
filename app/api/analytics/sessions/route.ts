import { NextRequest } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { z } from 'zod';
import geoip from 'geoip-lite';
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
      // Resolve location from IP (Local DB)
      let geo = geoip.lookup(ip);
      let country = geo?.country || null;
      let region = geo?.region || null;
      let city = geo?.city || null;
      let latitude = geo?.ll?.[0] || null;
      let longitude = geo?.ll?.[1] || null;

      // Fallback if region is missing
      if (!region && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
        const fallback = await fetchGeoFallback(ip);
        if (fallback) {
          country = fallback.country || country;
          region = fallback.region || region;
          city = fallback.city || city;
          latitude = fallback.latitude || latitude;
          longitude = fallback.longitude || longitude;
        }
      }

      // Create new session
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
        console.error('Error creating session:', createError);
        return ApiError.database('Failed to create session', createError);
      }

      return ApiSuccess.created({ session: newSession }, 'Session created successfully');
    }

    // Resolve location from IP (update in case it changed or was missing)
    let geo = geoip.lookup(ip);
    let country = geo?.country || undefined;
    let region = geo?.region || undefined;
    let city = geo?.city || undefined;
    let latitude = geo?.ll?.[0] || undefined;
    let longitude = geo?.ll?.[1] || undefined;

    // Fallback on update if region is missing
    if (!region && ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
       const fallback = await fetchGeoFallback(ip);
       if (fallback) {
         country = fallback.country || country;
         region = fallback.region || region;
         city = fallback.city || city;
         latitude = fallback.latitude || latitude;
         longitude = fallback.longitude || longitude;
       }
    }
    
    // Update existing session
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
      console.error('Error updating session:', updateError);
      return ApiError.database('Failed to update session', updateError);
    }

    return ApiSuccess.ok({ session: updatedSession }, 'Session updated successfully');
  } catch (error) {
    console.error('Session API error:', error);
    return ApiError.internal('Failed to process session request', error);
  }
}
