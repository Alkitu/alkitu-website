'use client';

import { useEffect } from 'react';

/**
 * On the landing page, dark mode is the recommended default for ad creative
 * consistency, but we MUST respect any explicit preference the user has set.
 *
 * Strategy:
 * - If the user has *no* `theme` cookie yet (hasn't toggled), force dark.
 * - If they have one (light or dark), leave it alone.
 *
 * The root layout's inline script reads the cookie before paint to apply the
 * `.dark` class — so this hook only affects the cookie value (and updates the
 * `<html>` class for the current navigation).
 */
export default function LandingThemeDefault() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const themeCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('theme='))
      ?.split('=')[1];

    if (!themeCookie) {
      document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Strict';
      document.documentElement.classList.add('dark');
    }
  }, []);

  return null;
}
