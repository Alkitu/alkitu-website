'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * VisitTracker component
 * Tracks page views and sessions using RESTful analytics endpoints
 */
export function VisitTracker() {
  const pathname = usePathname();
  const currentPageViewIdRef = useRef<string | null>(null);
  const pageEntryTimeRef = useRef<Date | null>(null);

  // Track page view on mount and route change
  useEffect(() => {
    // Skip tracking for admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    const trackPageView = async () => {
      try {
        // Update exit time for previous page view
        if (currentPageViewIdRef.current && pageEntryTimeRef.current) {
          const timeOnPage = Math.floor((Date.now() - pageEntryTimeRef.current.getTime()) / 1000);

          await fetch(`/api/analytics/page-views/${currentPageViewIdRef.current}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeOnPage }),
          });
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

        // Create or update session
        const sessionResponse = await fetch('/api/analytics/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionFingerprint }),
        });

        if (!sessionResponse.ok) {
          console.error('Error creating/updating session:', await sessionResponse.text());
          return;
        }

        const { data: sessionData } = await sessionResponse.json();
        const sessionId = sessionData.session.id;

        // Extract locale from pathname
        const locale = pathname.split('/')[1] || 'es';

        // Create new page view
        const pageViewResponse = await fetch('/api/analytics/page-views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            pagePath: pathname,
            locale,
            referrer: document.referrer,
          }),
        });

        if (!pageViewResponse.ok) {
          console.error('Error creating page view:', await pageViewResponse.text());
          return;
        }

        const { data: pageViewData } = await pageViewResponse.json();
        currentPageViewIdRef.current = pageViewData.pageView.id;
        pageEntryTimeRef.current = new Date();
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();

    // Track exit on visibility change (when user leaves tab/closes window)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && currentPageViewIdRef.current && pageEntryTimeRef.current) {
        const timeOnPage = Math.floor((Date.now() - pageEntryTimeRef.current.getTime()) / 1000);

        // Use sendBeacon for reliability when page is unloading
        const data = JSON.stringify({ timeOnPage });
        const blob = new Blob([data], { type: 'application/json' });

        // Try sendBeacon first (more reliable for unload events)
        const sent = navigator.sendBeacon(
          `/api/analytics/page-views/${currentPageViewIdRef.current}`,
          blob
        );

        // Fallback to fetch if sendBeacon is not supported
        if (!sent) {
          fetch(`/api/analytics/page-views/${currentPageViewIdRef.current}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true,
          }).catch(err => console.error('Error updating page view on exit:', err));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
