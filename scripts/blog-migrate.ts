/**
 * One-shot migration: content/blog/{en,es}/*.mdx  ->  SQL for the blog_posts table.
 *
 * Reads the legacy Contentlayer frontmatter, maps it onto the knowledge-brain-kit
 * 5-layer contract columns, and emits INSERT statements to stdout (dollar-quoted,
 * so MDX bodies survive verbatim).
 *
 * It also repairs three defects carried by the legacy content:
 *   1. `authorUsername: luis_urdaneta` is stale — that profile was renamed to
 *      `luiseum`, so the author-photo lookup currently resolves to nothing.
 *   2. `effective-research-techniques` (en) and `tecnicas-investigacion-efectivas`
 *      (es) are the same article under different slugs, so slug-based pairing
 *      could never emit hreflang. They are paired explicitly here.
 *   3. `marketing-4-0-evolucion` (es) duplicates `marketing-4-0-evolution` (es).
 *      It is imported unpublished for review rather than silently dropped; a 301
 *      handles the live URL.
 *
 * Usage:  npx tsx scripts/blog-migrate.ts > /tmp/blog-seed.sql
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** Kept in sync with lib/blog/slug.ts (that module is TS/ESM for app use). */
function categoriaToSlug(categoria: string): string {
  return categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Profile renames that happened after these posts were written. */
const USERNAME_FIXUPS: Record<string, string> = {
  luis_urdaneta: 'luiseum',
};

/** Same article, divergent slugs — pair them so hreflang can be emitted. */
const MANUAL_PAIRS: Array<[string, string]> = [
  ['effective-research-techniques', 'tecnicas-investigacion-efectivas'],
];

/** Duplicate content: import for review, do not publish. */
const DO_NOT_PUBLISH = new Set(['marketing-4-0-evolucion']);

interface LegacyFrontmatter {
  title: string;
  slug: string;
  metaDescription?: string;
  excerpt?: string;
  keywords?: string[];
  categories?: string[];
  tags?: string[];
  locale: 'en' | 'es';
  author?: string;
  authorRole?: string;
  authorUsername?: string;
  date?: string;
  updatedAt?: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  readTime?: string;
  featured?: boolean;
  sections?: Array<{ id: string; label: string }>;
}

interface Row {
  translation_group_id: string;
  title: string;
  locale: string;
  slug: string;
  categoria: string;
  categoria_slug: string;
  canonical: string;
  metadescripcion: string | null;
  keyword_principal: string | null;
  keywords_secundarias: string[];
  tags: string[];
  body_mdx: string;
  extracto: string | null;
  portada: string | null;
  portada_alt: string | null;
  portada_credito: string | null;
  lectura: string | null;
  autor: string | null;
  autor_rol: string | null;
  author_username: string | null;
  secciones: Array<{ id: string; label: string }>;
  featured: boolean;
  published: boolean;
  estado: string;
  published_at: string | null;
  content_updated_at: string | null;
}

const SITE = 'https://alkitu.com';

function readPosts(): Row[] {
  const rows: Row[] = [];
  // slug -> group id, so same-slug locale variants land in the same group
  const groupBySlug = new Map<string, string>();

  // Seed the manual pairs with a shared group id up front.
  for (const [a, b] of MANUAL_PAIRS) {
    const gid = crypto.randomUUID();
    groupBySlug.set(a, gid);
    groupBySlug.set(b, gid);
  }

  for (const locale of ['en', 'es'] as const) {
    const dir = path.join(BLOG_DIR, locale);
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort()) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const fm = data as LegacyFrontmatter;

      const categoria = fm.categories?.[0] ?? 'General';
      const categoriaSlug = categoriaToSlug(categoria);
      const slug = fm.slug;

      let gid = groupBySlug.get(slug);
      if (!gid) {
        gid = crypto.randomUUID();
        groupBySlug.set(slug, gid);
      }

      const [principal, ...secundarias] = fm.keywords ?? [];
      const username = fm.authorUsername
        ? (USERNAME_FIXUPS[fm.authorUsername] ?? fm.authorUsername)
        : null;
      const publish = !DO_NOT_PUBLISH.has(slug);

      rows.push({
        translation_group_id: gid,
        title: fm.title,
        locale: fm.locale ?? locale,
        slug,
        categoria,
        categoria_slug: categoriaSlug,
        canonical: `${SITE}/${fm.locale ?? locale}/blog/${categoriaSlug}/${slug}`,
        metadescripcion: fm.metaDescription ?? null,
        keyword_principal: principal ?? null,
        keywords_secundarias: secundarias,
        tags: fm.tags ?? [],
        body_mdx: content.trim(),
        extracto: fm.excerpt ?? null,
        portada: fm.image ?? null,
        portada_alt: fm.imageAlt ?? null,
        portada_credito: fm.imageCredit ?? null,
        lectura: fm.readTime ?? null,
        autor: fm.author ?? null,
        autor_rol: fm.authorRole ?? null,
        author_username: username,
        secciones: fm.sections ?? [],
        featured: fm.featured ?? false,
        published: publish,
        estado: publish ? 'completo' : 'revisar',
        published_at: fm.date ? `${fm.date}T00:00:00Z` : null,
        content_updated_at: fm.updatedAt ? `${fm.updatedAt}T00:00:00Z` : null,
      });
    }
  }

  return rows;
}

/** Dollar-quote with a tag guaranteed absent from the payload. */
function dq(value: string): string {
  let tag = 'q';
  while (value.includes(`$${tag}$`)) tag += 'q';
  return `$${tag}$${value}$${tag}$`;
}

function sqlText(value: string | null): string {
  return value === null ? 'NULL' : dq(value);
}

function sqlJson(value: unknown): string {
  return `${dq(JSON.stringify(value))}::jsonb`;
}

function toInsert(r: Row): string {
  return `INSERT INTO blog_posts (
  translation_group_id, title, locale, slug, categoria, categoria_slug, canonical,
  metadescripcion, keyword_principal, keywords_secundarias, tags,
  body_mdx, extracto, portada, portada_alt, portada_credito, lectura,
  autor, autor_rol, author_username, secciones, featured,
  published, estado, published_at, content_updated_at,
  schema_tipo, prioridad, frecuencia_cambio
) VALUES (
  '${r.translation_group_id}', ${sqlText(r.title)}, '${r.locale}', ${sqlText(r.slug)},
  ${sqlText(r.categoria)}, ${sqlText(r.categoria_slug)}, ${sqlText(r.canonical)},
  ${sqlText(r.metadescripcion)}, ${sqlText(r.keyword_principal)},
  ${sqlJson(r.keywords_secundarias)}, ${sqlJson(r.tags)},
  ${sqlText(r.body_mdx)}, ${sqlText(r.extracto)}, ${sqlText(r.portada)},
  ${sqlText(r.portada_alt)}, ${sqlText(r.portada_credito)}, ${sqlText(r.lectura)},
  ${sqlText(r.autor)}, ${sqlText(r.autor_rol)}, ${sqlText(r.author_username)},
  ${sqlJson(r.secciones)}, ${r.featured},
  ${r.published}, '${r.estado}',
  ${r.published_at ? `'${r.published_at}'` : 'NULL'},
  ${r.content_updated_at ? `'${r.content_updated_at}'` : 'NULL'},
  'Article', 0.7, 'yearly'
) ON CONFLICT (locale, slug) DO NOTHING;`;
}

const rows = readPosts();

if (process.argv.includes('--report')) {
  const groups = new Map<string, string[]>();
  for (const r of rows) {
    const list = groups.get(r.translation_group_id) ?? [];
    list.push(`${r.locale}:${r.slug}`);
    groups.set(r.translation_group_id, list);
  }
  console.error(`rows: ${rows.length}`);
  console.error(`paired groups (2 locales): ${[...groups.values()].filter((g) => g.length === 2).length}`);
  console.error(`single-locale groups: ${[...groups.values()].filter((g) => g.length === 1).length}`);
  for (const [, list] of groups) {
    if (list.length !== 2) console.error(`  single: ${list.join(', ')}`);
  }
  console.error(`unpublished: ${rows.filter((r) => !r.published).map((r) => r.slug).join(', ') || 'none'}`);
  process.exit(0);
}

console.log(rows.map(toInsert).join('\n\n'));
