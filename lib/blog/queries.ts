/**
 * Blog data access.
 *
 * Reads from Supabase with the anonymous client (`createAnalyticsClient`) rather
 * than the cookie-bound server client. That matters: the cookie-bound client
 * opts a route out of static rendering, which is why the previous implementation
 * logged "couldn't be rendered statically because it used `cookies`" on every
 * blog build. Blog content is public, so the anon client + RLS
 * (`public_read_published_blog_posts`) is both correct and statically renderable.
 *
 * All exported readers are wrapped in React `cache()` so a single render pass
 * hits the database once per distinct query.
 */

import { cache } from 'react';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { blogPostPath } from '@/lib/blog/slug';
import type { BlogPost, BlogPostRow, BlogLocale } from '@/lib/types/blog';

/** Columns needed for listings — skips `body_mdx`, which dominates row size. */
const LIST_COLUMNS = `
  id, translation_group_id, title, locale, slug, categoria, categoria_slug,
  canonical, metadescripcion, keyword_principal, keywords_secundarias, tags,
  extracto, portada, portada_alt, portada_credito, lectura,
  autor, autor_rol, author_username, secciones, featured,
  geo_preguntas, geo_respuestas, geo_respuesta_corta, geo_entidades, schema_tipo,
  prioridad, frecuencia_cambio, published, estado,
  published_at, content_updated_at
`;

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Cheap word count for the "N palabras" line; mirrors the old computed field. */
function countWords(mdx: string): number {
  return mdx.trim().split(/\s+/).filter(Boolean).length;
}

function toPost(row: Partial<BlogPostRow>): BlogPost {
  const keywordPrincipal = row.keyword_principal ? [row.keyword_principal] : [];
  const body = row.body_mdx ?? '';

  return {
    id: row.id!,
    translationGroupId: row.translation_group_id!,

    slug: row.slug!,
    locale: row.locale as BlogLocale,
    title: row.title!,

    categories: row.categoria ? [row.categoria] : [],
    categorySlug: row.categoria_slug!,
    url: blogPostPath(row.locale!, row.categoria_slug!, row.slug!),

    metaDescription: row.metadescripcion ?? null,
    excerpt: row.extracto ?? null,
    keywords: [...keywordPrincipal, ...arr<string>(row.keywords_secundarias)],
    tags: arr<string>(row.tags),

    image: row.portada ?? null,
    imageAlt: row.portada_alt ?? null,
    imageCredit: row.portada_credito ?? null,

    author: row.autor ?? null,
    authorRole: row.autor_rol ?? null,
    authorUsername: row.author_username ?? null,

    date: row.published_at ?? null,
    updatedAt: row.content_updated_at ?? null,
    readTime: row.lectura ?? null,
    featured: row.featured ?? false,
    sections: arr(row.secciones),

    body,
    wordCount: countWords(body),

    geoPreguntas: arr<string>(row.geo_preguntas),
    geoRespuestas: arr<string>(row.geo_respuestas),
    geoRespuestaCorta: row.geo_respuesta_corta ?? null,
    geoEntidades: arr<string>(row.geo_entidades),
    schemaTipo: row.schema_tipo ?? 'Article',

    prioridad: row.prioridad ?? 0.7,
    frecuenciaCambio: row.frecuencia_cambio ?? 'yearly',
    canonical: row.canonical ?? null,
    published: row.published ?? false,
    estado: row.estado ?? 'borrador',
  };
}

/**
 * Published posts for a locale, newest first. Bodies are not fetched.
 */
export const getPosts = cache(async (locale: BlogLocale): Promise<BlogPost[]> => {
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('locale', locale)
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[blog] getPosts:', error.message);
    return [];
  }
  return (data ?? []).map((r) => toPost(r as Partial<BlogPostRow>));
});

/**
 * Every published post across locales — for sitemap, RSS and llms.txt.
 */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[blog] getAllPosts:', error.message);
    return [];
  }
  return (data ?? []).map((r) => toPost(r as Partial<BlogPostRow>));
});

/**
 * A single published post, body included.
 */
export const getPost = cache(
  async (locale: BlogLocale, slug: string): Promise<BlogPost | null> => {
    const supabase = createAnalyticsClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('locale', locale)
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('[blog] getPost:', error.message);
      return null;
    }
    return data ? toPost(data as BlogPostRow) : null;
  }
);

/**
 * Every published post, both locales, for `generateStaticParams`.
 */
export const getPostRoutes = cache(
  async (): Promise<Array<{ lang: string; category: string; id: string }>> => {
    const supabase = createAnalyticsClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('locale, slug, categoria_slug')
      .eq('published', true);

    if (error) {
      console.error('[blog] getPostRoutes:', error.message);
      return [];
    }
    return (data ?? []).map((r) => ({
      lang: r.locale as string,
      category: r.categoria_slug as string,
      id: r.slug as string,
    }));
  }
);

/**
 * The counterpart of a post in the other locale, resolved via
 * `translation_group_id` rather than by matching slugs.
 *
 * This is what makes hreflang work for pairs whose slugs diverge — e.g.
 * `effective-research-techniques` (en) and `tecnicas-investigacion-efectivas`
 * (es), which slug-based pairing could never connect.
 */
export const getTranslation = cache(
  async (translationGroupId: string, otherLocale: BlogLocale): Promise<BlogPost | null> => {
    const supabase = createAnalyticsClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select(LIST_COLUMNS)
      .eq('translation_group_id', translationGroupId)
      .eq('locale', otherLocale)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('[blog] getTranslation:', error.message);
      return null;
    }
    return data ? toPost(data as Partial<BlogPostRow>) : null;
  }
);

/**
 * Related posts: same locale, sharing a category or a tag, newest first.
 */
export const getRelatedPosts = cache(
  async (post: BlogPost, limit = 3): Promise<BlogPost[]> => {
    const all = await getPosts(post.locale);
    return all
      .filter((p) => p.slug !== post.slug)
      .filter(
        (p) =>
          p.categories.some((c) => post.categories.includes(c)) ||
          p.tags.some((t) => post.tags.includes(t))
      )
      .slice(0, limit);
  }
);

/**
 * Distinct categories present in a locale, with their stored URL slug.
 */
export const getCategories = cache(
  async (locale: BlogLocale): Promise<Array<{ name: string; slug: string }>> => {
    const posts = await getPosts(locale);
    const seen = new Map<string, string>();
    for (const p of posts) {
      const name = p.categories[0];
      if (name && !seen.has(name)) seen.set(name, p.categorySlug);
    }
    return [...seen.entries()].map(([name, slug]) => ({ name, slug }));
  }
);

/**
 * Author avatar, resolved from `user_profiles.username`.
 * Cached so a page render queries at most once per author.
 */
export const getAuthorPhoto = cache(async (username: string | null): Promise<string | null> => {
  if (!username) return null;
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('photo_url')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('[blog] getAuthorPhoto:', error.message);
    return null;
  }
  return data?.photo_url ?? null;
});
