/**
 * Blog types.
 *
 * `BlogPostRow` mirrors the `blog_posts` table (knowledge-brain-kit 5-layer
 * contract). `BlogPost` is the view the app renders — it keeps the field names
 * the existing components already expect (PostHero, RelatedPosts, BlogContent,
 * BlogNotFound), so swapping the storage engine from Contentlayer to Supabase
 * required no changes to those components.
 */

export type BlogLocale = 'en' | 'es';
export type BlogEstado = 'borrador' | 'revisar' | 'completo';
export type IntencionBusqueda =
  | 'informacional'
  | 'navegacional'
  | 'comercial'
  | 'transaccional';

/** Table of contents entry. */
export interface BlogSection {
  id: string;
  label: string;
}

/** A citable fact with its source (GEO layer). */
export interface DatoCitable {
  dato: string;
  fuente: string;
}

/** Raw row as stored in Supabase. */
export interface BlogPostRow {
  id: string;
  translation_group_id: string;

  // Layer 1 · semantic identity
  title: string;
  aliases: string[];
  campo_semantico: string[];
  relacionado: string[];

  // Layer 2 · SEO + URL
  locale: BlogLocale;
  slug: string;
  categoria: string;
  categoria_slug: string;
  canonical: string | null;
  titulo_seo: string | null;
  metadescripcion: string | null;
  keyword_principal: string | null;
  keywords_secundarias: string[];
  tags: string[];
  intencion_busqueda: IntencionBusqueda | null;
  og_image: string | null;

  // Layer 3 · GEO
  geo_preguntas: string[];
  geo_respuestas: string[];
  geo_respuesta_corta: string | null;
  geo_entidades: string[];
  geo_datos_citables: DatoCitable[];
  geo_formato: string[];
  schema_tipo: string | null;

  // Layer 4 · technical sitemap
  prioridad: number | null;
  frecuencia_cambio: string | null;

  // Content
  body_mdx: string;
  extracto: string | null;
  portada: string | null;
  portada_alt: string | null;
  portada_credito: string | null;
  lectura: string | null;
  autor: string | null;
  autor_rol: string | null;
  author_username: string | null;
  secciones: BlogSection[];
  featured: boolean;

  // Editorial state
  estado: BlogEstado;
  published: boolean;
  published_at: string | null;
  content_updated_at: string | null;

  created_at: string;
  updated_at: string;
}

/**
 * Render-facing post. Field names deliberately match what the existing
 * components consume, so they keep working unchanged.
 */
export interface BlogPost {
  id: string;
  translationGroupId: string;

  slug: string;
  locale: BlogLocale;
  title: string;

  /** Array form kept for component compatibility; always a single entry. */
  categories: string[];
  categorySlug: string;

  /** Canonical public path, e.g. `/es/blog/desarrollo-web/mi-post`. */
  url: string;

  metaDescription: string | null;
  excerpt: string | null;
  keywords: string[];
  tags: string[];

  image: string | null;
  imageAlt: string | null;
  imageCredit: string | null;

  author: string | null;
  authorRole: string | null;
  authorUsername: string | null;

  date: string | null;
  updatedAt: string | null;
  readTime: string | null;
  featured: boolean;
  sections: BlogSection[];

  /** Raw MDX source; compiled at render time. */
  body: string;
  wordCount: number;

  // GEO layer — feeds FAQPage JSON-LD and llms.txt
  geoPreguntas: string[];
  geoRespuestas: string[];
  geoRespuestaCorta: string | null;
  geoEntidades: string[];
  schemaTipo: string;

  prioridad: number;
  frecuenciaCambio: string;
  canonical: string | null;
  published: boolean;
  estado: BlogEstado;
}
