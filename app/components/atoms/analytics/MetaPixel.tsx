'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_CHANGE_EVENT, isCategoryAllowed } from '@/lib/cookies/consent';
import { ANALYTICS_CONFIG } from '@/lib/analytics/events';

/**
 * Loads Meta (Facebook) Pixel.
 *
 * Loading rules:
 * - Requires `marketing` consent.
 * - Re-evaluates on `cookie-consent-change`.
 * - No-op when NEXT_PUBLIC_META_PIXEL_ID is not configured.
 */
export function MetaPixel() {
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const update = () => setMarketingAllowed(isCategoryAllowed('marketing'));
    update();

    const onChange = (_e: Event) => update();
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  if (!ANALYTICS_CONFIG.isMetaPixelConfigured || !marketingAllowed) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${ANALYTICS_CONFIG.metaPixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      {/* Noscript fallback for Meta Pixel */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${ANALYTICS_CONFIG.metaPixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export default MetaPixel;
