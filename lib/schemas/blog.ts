/**
 * Blog validation — the single gate shared by every authoring channel.
 *
 * Both the admin editor (`/api/admin/blog`) and Claude Code (`npm run blog:validate`)
 * run the same rules, so content written by either route is held to the same
 * standard. Encodes §5 (SEO) and §6 (GEO) of the knowledge-brain-kit contract.
 *
 * Two layers, deliberately separate:
 *
 *   `BlogPostInputSchema` — structural. What the API will accept: types, shapes,
 *   enums. Rejecting here is a hard failure.
 *
 *   `checkContract()` — editorial. Title length, meta-description range, aligned
 *   Q&A, etc. These are reported as findings rather than enforced by the parser,
 *   because the 23 imported posts predate the contract and would otherwise be
 *   unsavable. Publishing surfaces errors; drafts may carry them.
 */

import { z } from 'zod';

export const LOCALES = ['en', 'es'] as const;
export const ESTADOS = ['borrador', 'revisar', 'completo'] as const;
export const INTENCIONES = [
  'informacional',
  'navegacional',
  'comercial',
  'transaccional',
] as const;
export const FRECUENCIAS = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
] as const;
export const GEO_FORMATOS = [
  'definicion',
  'faq',
  'lista',
  'tabla',
  'paso-a-paso',
] as const;

/** Lowercase, alphanumeric + dashes. Matches the DB check constraint. */
const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(120, 'Slug must be under 120 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens');

const sectionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

const datoCitableSchema = z.object({
  dato: z.string().min(1),
  fuente: z.string().min(1),
});

/**
 * Structural schema for creating/updating a post.
 */
export const BlogPostInputSchema = z.object({
  // Layer 1 · identity
  title: z.string().min(1, 'Title is required').max(200),
  aliases: z.array(z.string()).default([]),
  campo_semantico: z.array(z.string()).default([]),
  relacionado: z.array(z.string()).default([]),

  // Layer 2 · SEO + URL
  locale: z.enum(LOCALES),
  slug: slugSchema,
  categoria: z.string().min(1, 'Category is required').max(100),
  canonical: z.string().url().optional().nullable(),
  titulo_seo: z.string().max(120).optional().nullable(),
  metadescripcion: z.string().max(300).optional().nullable(),
  keyword_principal: z.string().max(120).optional().nullable(),
  keywords_secundarias: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  intencion_busqueda: z.enum(INTENCIONES).optional().nullable(),
  og_image: z.string().optional().nullable(),

  // Layer 3 · GEO
  geo_preguntas: z.array(z.string()).default([]),
  geo_respuestas: z.array(z.string()).default([]),
  geo_respuesta_corta: z.string().max(600).optional().nullable(),
  geo_entidades: z.array(z.string()).default([]),
  geo_datos_citables: z.array(datoCitableSchema).default([]),
  geo_formato: z.array(z.enum(GEO_FORMATOS)).default([]),
  schema_tipo: z.string().default('Article'),

  // Layer 4 · sitemap
  prioridad: z.number().min(0).max(1).default(0.7),
  frecuencia_cambio: z.enum(FRECUENCIAS).default('yearly'),

  // Content
  body_mdx: z.string().default(''),
  extracto: z.string().max(600).optional().nullable(),
  portada: z.string().optional().nullable(),
  portada_alt: z.string().optional().nullable(),
  portada_credito: z.string().optional().nullable(),
  lectura: z.string().max(20).optional().nullable(),
  autor: z.string().max(120).optional().nullable(),
  autor_rol: z.string().max(160).optional().nullable(),
  author_username: z.string().max(60).optional().nullable(),
  secciones: z.array(sectionSchema).default([]),
  featured: z.boolean().default(false),

  // State
  estado: z.enum(ESTADOS).default('borrador'),
  published: z.boolean().default(false),
  published_at: z.string().optional().nullable(),
  content_updated_at: z.string().optional().nullable(),
  translation_group_id: z.string().uuid().optional(),
});

export const BlogPostUpdateSchema = BlogPostInputSchema.partial();

export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

// ---------------------------------------------------------------------------
// Editorial contract checks
// ---------------------------------------------------------------------------

export type FindingLevel = 'error' | 'warning';

export interface ContractFinding {
  level: FindingLevel;
  field: string;
  message: string;
}

interface CheckablePost {
  title?: string | null;
  titulo_seo?: string | null;
  metadescripcion?: string | null;
  keyword_principal?: string | null;
  canonical?: string | null;
  extracto?: string | null;
  geo_preguntas?: string[];
  geo_respuestas?: string[];
  geo_respuesta_corta?: string | null;
  body_mdx?: string | null;
  published?: boolean;
}

/**
 * Contract rules from `Context/00-Index/📐 Context — Contrato.md` §5–§6.
 *
 * `error` blocks publishing; `warning` is advisory. A draft is allowed to be
 * incomplete — the point is that nothing goes live half-specified.
 */
export function checkContract(post: CheckablePost): ContractFinding[] {
  const findings: ContractFinding[] = [];
  const add = (level: FindingLevel, field: string, message: string) =>
    findings.push({ level, field, message });

  // §5.1 — SEO title under 60 chars, containing the main keyword
  const seoTitle = post.titulo_seo?.trim() || post.title?.trim() || '';
  if (!seoTitle) {
    add('error', 'title', 'A title is required.');
  } else if (seoTitle.length > 60) {
    add('warning', 'titulo_seo', `SEO title is ${seoTitle.length} characters; the contract caps it at 60.`);
  }
  if (post.keyword_principal && seoTitle) {
    const kw = post.keyword_principal.toLowerCase();
    if (!seoTitle.toLowerCase().includes(kw)) {
      add('warning', 'titulo_seo', `The title does not contain the main keyword ("${post.keyword_principal}").`);
    }
  }

  // §5.2 — meta description between 120 and 155 characters
  const meta = post.metadescripcion?.trim() ?? '';
  if (!meta) {
    add('error', 'metadescripcion', 'A meta description is required.');
  } else if (meta.length < 120 || meta.length > 155) {
    add(
      'warning',
      'metadescripcion',
      `Meta description is ${meta.length} characters; the contract asks for 120–155.`
    );
  }

  // §5.3 — exactly one main keyword, to avoid cannibalisation
  if (!post.keyword_principal?.trim()) {
    add('warning', 'keyword_principal', 'No main keyword set.');
  }

  // §5.6 — canonical is always present
  if (!post.canonical?.trim()) {
    add('warning', 'canonical', 'No canonical URL set.');
  }

  // §6.2 — FAQ block: questions and answers must be index-aligned, or no
  // FAQPage schema can be emitted.
  const q = post.geo_preguntas ?? [];
  const a = post.geo_respuestas ?? [];
  if (q.length !== a.length) {
    add(
      'error',
      'geo_respuestas',
      `${q.length} question(s) but ${a.length} answer(s). They must match 1:1 or the FAQ schema is suppressed.`
    );
  }
  if (q.length && a.some((x) => !x.trim())) {
    add('error', 'geo_respuestas', 'Every question needs a non-empty answer.');
  }
  if (!q.length) {
    add('warning', 'geo_preguntas', 'No GEO questions — this post will not emit FAQPage schema.');
  }

  // §6.1 — an extractable short answer is what generative engines quote
  if (!post.geo_respuesta_corta?.trim()) {
    add('warning', 'geo_respuesta_corta', 'No short answer set; llms.txt will fall back to the excerpt.');
  }

  if (!post.extracto?.trim()) {
    add('warning', 'extracto', 'No excerpt — listings and share cards will look empty.');
  }

  if (!post.body_mdx?.trim()) {
    add('error', 'body_mdx', 'The post has no body.');
  }

  return findings;
}

/** True when nothing blocks publishing. */
export function canPublish(post: CheckablePost): boolean {
  return !checkContract(post).some((f) => f.level === 'error');
}
