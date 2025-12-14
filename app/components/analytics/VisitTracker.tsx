'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function VisitTracker() {
  const pathname = usePathname();
  const supabase = createClient();
  const currentPageViewIdRef = useRef<string | null>(null);
  const pageEntryTimeRef = useRef<Date | null>(null);

  // Track page view on mount and route change
  useEffect(() => {
    // Skip tracking for admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    const trackPageView = async () => {
      // Update exit time for previous page view
      if (currentPageViewIdRef.current && pageEntryTimeRef.current) {
        const timeOnPage = Math.floor((Date.now() - pageEntryTimeRef.current.getTime()) / 1000);

        await supabase
          .from('page_views')
          .update({
            exit_time: new Date().toISOString(),
            time_on_page_seconds: timeOnPage,
          })
          .eq('id', currentPageViewIdRef.current);
      }

      // Get session fingerprint from cookie
      const sessionFingerprint = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_fingerprint='))
        ?.split('=')[1];

      if (!sessionFingerprint) {
        console.warn('No session fingerprint found');
        return;
      }

      // Get or create session
      let { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('id')
        .eq('session_fingerprint', sessionFingerprint)
        .gte('last_activity_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Active in last hour
        .single();

      if (sessionError || !session) {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('sessions')
          .insert({
            session_fingerprint: sessionFingerprint,
            ip_address: null, // Will be set by server
            user_agent: navigator.userAgent,
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating session:', createError);
          return;
        }

        session = newSession;
      } else {
        // Update existing session activity
        await supabase
          .from('sessions')
          .update({
            last_activity_at: new Date().toISOString(),
          })
          .eq('id', session.id);
      }

      // Extract locale from pathname
      const locale = pathname.split('/')[1] || 'es';

      // Create new page view
      const { data: pageView, error: pageViewError } = await supabase
        .from('page_views')
        .insert({
          session_id: session.id,
          page_path: pathname,
          locale: locale,
          referrer: document.referrer,
          entry_time: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (pageViewError) {
        console.error('Error creating page view:', pageViewError);
        return;
      }

      currentPageViewIdRef.current = pageView.id;
      pageEntryTimeRef.current = new Date();

      // Update session total page views
      await supabase.rpc('increment_session_page_views', { session_id: session.id });
    };

    trackPageView();

    // Track exit on visibility change (when user leaves tab/closes window)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && currentPageViewIdRef.current && pageEntryTimeRef.current) {
        const timeOnPage = Math.floor((Date.now() - pageEntryTimeRef.current.getTime()) / 1000);

        await supabase
          .from('page_views')
          .update({
            exit_time: new Date().toISOString(),
            time_on_page_seconds: timeOnPage,
          })
          .eq('id', currentPageViewIdRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, supabase]);

  return null; // This component doesn't render anything
}
