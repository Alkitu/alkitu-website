'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_CHANGE_EVENT, isCategoryAllowed, type CookieConsent } from '@/lib/cookies/consent';
import { ANALYTICS_CONFIG } from '@/lib/analytics/events';

/**
 * Loads Google Analytics 4 (and Google Ads, if configured) via gtag.js.
 *
 * Loading rules:
 * - GA4 requires `analytics` consent.
 * - Google Ads also requires `marketing` consent (we only init it when both are granted).
 * - Scripts mount only after consent is given; we re-evaluate on the
 *   `cookie-consent-change` window event so the user doesn't have to reload.
 *
 * Returns `null` and emits no scripts when no relevant env var is set.
 */
export function GoogleAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const update = () => {
      setAnalyticsAllowed(isCategoryAllowed('analytics'));
      setMarketingAllowed(isCategoryAllowed('marketing'));
    };
    update();

    const onChange = (_e: Event) => update();
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  const shouldLoadGa = ANALYTICS_CONFIG.isGaConfigured && analyticsAllowed;
  const shouldInitGoogleAds = ANALYTICS_CONFIG.isGoogleAdsConfigured && marketingAllowed;

  if (!shouldLoadGa && !shouldInitGoogleAds) return null;

  // The first configured ID is what loads gtag.js
  const primaryId = shouldLoadGa ? ANALYTICS_CONFIG.ga4Id : ANALYTICS_CONFIG.googleAdsId;

  return (
    <>
      <Script
        id="gtag-base"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            'analytics_storage': '${analyticsAllowed ? 'granted' : 'denied'}',
            'ad_storage': '${marketingAllowed ? 'granted' : 'denied'}',
            'ad_user_data': '${marketingAllowed ? 'granted' : 'denied'}',
            'ad_personalization': '${marketingAllowed ? 'granted' : 'denied'}'
          });
          ${shouldLoadGa ? `gtag('config', '${ANALYTICS_CONFIG.ga4Id}', { anonymize_ip: true });` : ''}
          ${shouldInitGoogleAds ? `gtag('config', '${ANALYTICS_CONFIG.googleAdsId}');` : ''}
        `}
      </Script>
    </>
  );
}

export default GoogleAnalytics;
