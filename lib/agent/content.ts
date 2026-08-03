/**
 * Content search across published blog posts.
 *
 * The kit's `search_content` tool: returns fragments with their source URL so an
 * assertion can always be attributed. Nothing here paraphrases — callers get the
 * surrounding text and cite it.
 */

import { agentClient } from './client';
import { blogPostPath } from '@/lib/blog/slug';

export interface ContentHit {
  title: string;
  slug: string;
  locale: string;
  url: string;
  categoria: string;
  /** Text window around the first match. */
  fragmento: string;
  geoRespuestaCorta: string | null;
}

interface Row {
  title: string;
  slug: string;
  locale: string;
  categoria: string;
  categoria_slug: string;
  extracto: string | null;
  body_mdx: string;
  geo_respuesta_corta: string | null;
}

/**
 * Strips the markdown that would otherwise leak into an excerpt. Not a parser —
 * a fragment is a preview, and running mdast over every search hit to render a
 * 240-character teaser is not worth it.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images (caption + URL, all noise here)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their label
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // ATX headings
    .replace(/\{#[\w-]+\}/g, '') // custom heading ids
    .replace(/```[\s\S]*?```/g, '') // fenced code
    .replace(/(\*\*|__|\*|_|`)/g, '') // emphasis and inline code
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, '') // list bullets
    .replace(/\s+/g, ' ')
    .trim();
}

function windowAround(text: string, needle: string, size = 240): string {
  const clean = stripMarkdown(text);
  const idx = clean.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return clean.slice(0, size).trim();
  const start = Math.max(0, idx - size / 2);
  const slice = clean.slice(start, start + size).trim();
  return `${start > 0 ? '…' : ''}${slice}…`;
}

/**
 * Search published post bodies.
 *
 * @param q      free text
 * @param locale restrict to one locale
 */
export async function searchContent(q: string, locale?: 'es' | 'en'): Promise<ContentHit[]> {
  const needle = q.trim();
  if (!needle) return [];

  let query = agentClient()
    .from('blog_posts')
    .select('title, slug, locale, categoria, categoria_slug, extracto, body_mdx, geo_respuesta_corta')
    .eq('published', true);

  if (locale) query = query.eq('locale', locale);

  const { data, error } = await query;
  if (error) throw new Error(`blog_posts: ${error.message}`);

  const lower = needle.toLowerCase();

  return (data ?? [])
    .map((r) => r as Row)
    .filter((r) =>
      `${r.title} ${r.extracto ?? ''} ${r.body_mdx}`.toLowerCase().includes(lower)
    )
    .map((r) => ({
      title: r.title,
      slug: r.slug,
      locale: r.locale,
      url: blogPostPath(r.locale, r.categoria_slug, r.slug),
      categoria: r.categoria,
      fragmento: windowAround(r.body_mdx, needle),
      geoRespuestaCorta: r.geo_respuesta_corta,
    }));
}

/**
 * Section map of the site, as published.
 */
export async function listSecciones(): Promise<
  Array<{ seccion: string; total: number; categorias: string[] }>
> {
  const { data, error } = await agentClient()
    .from('blog_posts')
    .select('categoria, locale')
    .eq('published', true);

  if (error) throw new Error(`blog_posts: ${error.message}`);

  const byLocale = new Map<string, Set<string>>();
  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    const locale = row.locale as string;
    const cat = row.categoria as string;
    counts.set(locale, (counts.get(locale) ?? 0) + 1);
    const set = byLocale.get(locale) ?? new Set<string>();
    set.add(cat);
    byLocale.set(locale, set);
  }

  return [...byLocale.entries()].map(([locale, cats]) => ({
    seccion: `blog (${locale})`,
    total: counts.get(locale) ?? 0,
    categorias: [...cats],
  }));
}

/**
 * GEO layer of a post — the pre-extracted, citable material.
 */
export async function getNode(
  locale: 'es' | 'en',
  slug: string
): Promise<{
  title: string;
  url: string;
  geoPreguntas: string[];
  geoRespuestas: string[];
  geoRespuestaCorta: string | null;
  geoEntidades: string[];
  keywordPrincipal: string | null;
} | null> {
  const { data, error } = await agentClient()
    .from('blog_posts')
    .select(
      'title, slug, locale, categoria_slug, geo_preguntas, geo_respuestas, geo_respuesta_corta, geo_entidades, keyword_principal'
    )
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`blog_posts: ${error.message}`);
  if (!data) return null;

  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

  return {
    title: data.title as string,
    url: blogPostPath(data.locale as string, data.categoria_slug as string, data.slug as string),
    geoPreguntas: arr<string>(data.geo_preguntas),
    geoRespuestas: arr<string>(data.geo_respuestas),
    geoRespuestaCorta: (data.geo_respuesta_corta as string) ?? null,
    geoEntidades: arr<string>(data.geo_entidades),
    keywordPrincipal: (data.keyword_principal as string) ?? null,
  };
}
