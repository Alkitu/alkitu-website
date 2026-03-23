/**
 * SEO utility functions for generating consistent metadata across pages.
 * Provides hreflang alternates, canonical URLs, and common SEO patterns.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

/**
 * Generate alternates metadata (canonical + hreflang) for a bilingual page.
 * @param lang - Current locale ('en' | 'es')
 * @param path - Path after locale (e.g., '/about', '/projects')
 */
export function getSeoAlternates(lang: string, path: string = '') {
  return {
    canonical: `${BASE_URL}/${lang}${path}`,
    languages: {
      'es': `${BASE_URL}/es${path}`,
      'en': `${BASE_URL}/en${path}`,
      'x-default': `${BASE_URL}/es${path}`,
    },
  };
}
