/**
 * Centralized analytics event helpers.
 *
 * Each helper is a no-op when:
 * - The relevant env var is not set, or
 * - The user has not granted the required cookie category, or
 * - The script global is not yet loaded.
 *
 * Cookie consent gating is handled by the script *loaders* (so events fire
 * only when the script is actually loaded), but we still re-check here as a
 * defensive belt-and-suspenders against early calls.
 */

import { isCategoryAllowed } from '@/lib/cookies/consent';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
    _fbq?: unknown;
  }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '';
const GOOGLE_ADS_CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || '';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

export const ANALYTICS_CONFIG = {
  ga4Id: GA4_ID,
  googleAdsId: GOOGLE_ADS_ID,
  googleAdsConversionLabel: GOOGLE_ADS_CONVERSION_LABEL,
  metaPixelId: META_PIXEL_ID,
  isGaConfigured: GA4_ID.length > 0,
  isGoogleAdsConfigured: GOOGLE_ADS_ID.length > 0 && GOOGLE_ADS_CONVERSION_LABEL.length > 0,
  isMetaPixelConfigured: META_PIXEL_ID.length > 0,
};

type LeadEventPayload = {
  source?: string;
  value?: number;
  currency?: 'EUR' | 'USD';
};

/**
 * GA4 page_view (rarely needed manually — gtag config handles it via SPA route changes)
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return;
  if (!ANALYTICS_CONFIG.isGaConfigured) return;
  if (!isCategoryAllowed('analytics')) return;

  window.gtag?.('event', 'page_view', {
    page_location: url,
    page_title: title,
    send_to: ANALYTICS_CONFIG.ga4Id,
  });
}

/**
 * GA4 generate_lead — fired when the lead form is submitted successfully.
 * https://support.google.com/analytics/answer/9267735
 */
export function trackGenerateLead(payload: LeadEventPayload = {}) {
  if (typeof window === 'undefined') return;
  if (!isCategoryAllowed('analytics')) return;

  if (ANALYTICS_CONFIG.isGaConfigured) {
    window.gtag?.('event', 'generate_lead', {
      send_to: ANALYTICS_CONFIG.ga4Id,
      currency: payload.currency || 'EUR',
      value: payload.value || 0,
      lead_source: payload.source,
    });
  }

  // Google Ads conversion (requires marketing consent)
  if (
    ANALYTICS_CONFIG.isGoogleAdsConfigured &&
    isCategoryAllowed('marketing')
  ) {
    window.gtag?.('event', 'conversion', {
      send_to: `${ANALYTICS_CONFIG.googleAdsId}/${ANALYTICS_CONFIG.googleAdsConversionLabel}`,
      value: payload.value || 0,
      currency: payload.currency || 'EUR',
    });
  }

  // Meta Pixel Lead (requires marketing consent)
  if (
    ANALYTICS_CONFIG.isMetaPixelConfigured &&
    isCategoryAllowed('marketing') &&
    typeof window.fbq === 'function'
  ) {
    window.fbq('track', 'Lead', {
      value: payload.value || 0,
      currency: payload.currency || 'EUR',
      content_name: payload.source,
    });
  }
}

/**
 * Custom GA4 event — generic helper for any other event we want to track later.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (!ANALYTICS_CONFIG.isGaConfigured) return;
  if (!isCategoryAllowed('analytics')) return;

  window.gtag?.('event', name, params);
}
