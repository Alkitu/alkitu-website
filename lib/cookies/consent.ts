/**
 * Cookie Consent Management
 *
 * GDPR-compliant cookie consent system.
 * Manages user preferences for different cookie categories.
 */

export type CookieCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: string;  // ISO date when consent was given/updated
}

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Default consent state - only necessary cookies enabled
 */
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: '',
};

/**
 * Read cookie consent preferences from the cookie
 */
export function getConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!cookie) return null;

  try {
    const value = decodeURIComponent(cookie.split('=')[1]);
    return JSON.parse(value) as CookieConsent;
  } catch {
    return null;
  }
}

/**
 * Save cookie consent preferences to a cookie.
 * The consent cookie itself is classified as "necessary" (strictly required for GDPR).
 */
export function setConsent(consent: CookieConsent): void {
  if (typeof document === 'undefined') return;

  const value = encodeURIComponent(JSON.stringify({
    ...consent,
    necessary: true, // Always true
    timestamp: new Date().toISOString(),
  }));

  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Check if user has given consent (banner was already shown and responded to)
 */
export function hasConsent(): boolean {
  return getConsent() !== null;
}

/**
 * Check if a specific cookie category is allowed
 */
export function isCategoryAllowed(category: CookieCategory): boolean {
  if (category === 'necessary') return true;
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}

/**
 * Accept all cookies
 */
export function acceptAll(): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString(),
  };
  setConsent(consent);
  return consent;
}

/**
 * Reject all optional cookies (only necessary remain)
 */
export function rejectAll(): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  };
  setConsent(consent);
  removeNonConsentedCookies(consent);
  return consent;
}

/**
 * Save custom preferences
 */
export function savePreferences(analytics: boolean, marketing: boolean): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  };
  setConsent(consent);
  if (!analytics || !marketing) {
    removeNonConsentedCookies(consent);
  }
  return consent;
}

/**
 * Remove cookies that the user has not consented to
 */
function removeNonConsentedCookies(consent: CookieConsent): void {
  if (typeof document === 'undefined') return;

  if (!consent.analytics) {
    // Remove analytics cookies
    document.cookie = 'session_fingerprint=; path=/; max-age=0';
  }
}

/**
 * Get consent cookie name (for use in middleware)
 */
export const CONSENT_COOKIE = CONSENT_COOKIE_NAME;
