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

/**
 * Generate ProfessionalService JSON-LD for a service page.
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": service.name,
    "description": service.description,
    "url": service.url,
    "provider": {
      "@type": "Organization",
      "name": "Alkitu",
      "url": BASE_URL,
    },
    "areaServed": [
      { "@type": "Country", "name": "Spain" },
      { "@type": "Country", "name": "United States" },
    ],
    "availableLanguage": ["Spanish", "English"],
  };
}

/**
 * Generate FAQPage JSON-LD for GEO optimization (+40% AI visibility).
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
