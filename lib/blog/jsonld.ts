/**
 * Structured data for blog content.
 *
 * Ported from the knowledge-brain-kit (`apps/web/lib/seo/jsonld.tsx`). The
 * previous implementation relied on a Contentlayer computed field, which meant
 * the schema could only ever describe an Article. Building it here unlocks the
 * GEO layer: when a post declares aligned `geo_preguntas` / `geo_respuestas`,
 * we can also emit a FAQPage — the format generative engines actually quote.
 */

import type { BlogPost } from '@/lib/types/blog';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Alkitu',
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/images/logo/alkitu-logo.png`,
  },
};

function absolute(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${SITE}${url}`;
}

/**
 * Article schema for a post.
 */
export function articleLd(post: BlogPost) {
  const url = `${SITE}${post.url}`;
  const image = absolute(post.image);

  return {
    '@context': 'https://schema.org',
    '@type': post.schemaTipo || 'Article',
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image: [image] } : {}),
    datePublished: post.date ?? undefined,
    dateModified: post.updatedAt ?? post.date ?? undefined,
    inLanguage: post.locale,
    keywords: post.keywords.length ? post.keywords.join(', ') : undefined,
    articleSection: post.categories[0],
    wordCount: post.wordCount,
    author: {
      '@type': 'Person',
      name: post.author ?? 'Alkitu',
      ...(post.authorUsername ? { url: `${SITE}/${post.locale}/profile/${post.authorUsername}` } : {}),
      ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
    },
    publisher: PUBLISHER,
  };
}

/**
 * FAQPage schema, built from the GEO layer.
 *
 * Only emitted when questions and answers are present AND index-aligned — the
 * kit's rule. A mismatched pair means the content isn't actually a Q&A set, and
 * publishing a malformed FAQPage is worse than publishing none.
 */
export function faqLd(post: BlogPost) {
  const { geoPreguntas: q, geoRespuestas: a } = post;
  if (!q.length || q.length !== a.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: q.map((question, i) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: a[i] },
    })),
  };
}

/**
 * BreadcrumbList schema mirroring the visible breadcrumb trail.
 */
export function breadcrumbLd(
  items: Array<{ name: string; path?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE}${item.path}` } : {}),
    })),
  };
}

/**
 * Every schema a post page should emit, already filtered.
 */
export function postSchemas(
  post: BlogPost,
  breadcrumb: Array<{ name: string; path?: string }>
) {
  return [articleLd(post), faqLd(post), breadcrumbLd(breadcrumb)].filter(Boolean);
}
