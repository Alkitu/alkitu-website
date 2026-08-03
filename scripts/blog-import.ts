/**
 * Imports content/blog/{en,es}/*.mdx into the `blog_posts` table.
 *
 * Companion to scripts/blog-migrate.ts (which emits SQL for inspection); this one
 * writes straight to Supabase using the service-role key, so the 450KB of MDX
 * never has to be round-tripped through a SQL string.
 *
 * Idempotent: upserts on the (locale, slug) unique constraint, so re-running
 * refreshes rows rather than duplicating them. Existing translation_group_id
 * values are preserved on re-run.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (gitignored).
 *
 * Usage:
 *   npx tsx scripts/blog-import.ts            # import
 *   npx tsx scripts/blog-import.ts --dry-run  # report only, no writes
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

// --- env -------------------------------------------------------------------

function loadEnvLocal() {
  const file = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}
loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}
if (!SERVICE_KEY && !DRY_RUN) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local.\n' +
      'Supabase Dashboard > Project Settings > API > service_role (secret).\n' +
      'Run with --dry-run to preview without it.'
  );
  process.exit(1);
}

// --- mapping ---------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const SITE = 'https://alkitu.com';

/** Kept in sync with lib/blog/slug.ts */
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

/** Same article, divergent slugs — pair so hreflang can be emitted. */
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

function buildRows() {
  const rows: Record<string, unknown>[] = [];
  const groupBySlug = new Map<string, string>();

  for (const [a, b] of MANUAL_PAIRS) {
    const gid = crypto.randomUUID();
    groupBySlug.set(a, gid);
    groupBySlug.set(b, gid);
  }

  for (const locale of ['en', 'es'] as const) {
    const dir = path.join(BLOG_DIR, locale);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx')).sort();

    for (const file of files) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      const fm = data as LegacyFrontmatter;

      const categoria = fm.categories?.[0] ?? 'General';
      const categoriaSlug = categoriaToSlug(categoria);
      const slug = fm.slug;
      const postLocale = fm.locale ?? locale;

      let gid = groupBySlug.get(slug);
      if (!gid) {
        gid = crypto.randomUUID();
        groupBySlug.set(slug, gid);
      }

      const [principal, ...secundarias] = fm.keywords ?? [];
      const publish = !DO_NOT_PUBLISH.has(slug);

      rows.push({
        translation_group_id: gid,
        title: fm.title,
        locale: postLocale,
        slug,
        categoria,
        categoria_slug: categoriaSlug,
        canonical: `${SITE}/${postLocale}/blog/${categoriaSlug}/${slug}`,
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
        author_username: fm.authorUsername
          ? (USERNAME_FIXUPS[fm.authorUsername] ?? fm.authorUsername)
          : null,
        secciones: fm.sections ?? [],
        featured: fm.featured ?? false,
        published: publish,
        estado: publish ? 'completo' : 'revisar',
        published_at: fm.date ? `${fm.date}T00:00:00Z` : null,
        content_updated_at: fm.updatedAt ? `${fm.updatedAt}T00:00:00Z` : null,
        schema_tipo: 'Article',
        prioridad: 0.7,
        frecuencia_cambio: 'yearly',
      });
    }
  }

  return rows;
}

// --- run -------------------------------------------------------------------

async function main() {
  const rows = buildRows();

  const groups = new Map<string, string[]>();
  for (const r of rows) {
    const gid = r.translation_group_id as string;
    groups.set(gid, [...(groups.get(gid) ?? []), `${r.locale}:${r.slug}`]);
  }

  console.log(`parsed:        ${rows.length} posts`);
  console.log(`  en:          ${rows.filter((r) => r.locale === 'en').length}`);
  console.log(`  es:          ${rows.filter((r) => r.locale === 'es').length}`);
  console.log(`paired groups: ${[...groups.values()].filter((g) => g.length === 2).length}`);
  console.log(`unpublished:   ${rows.filter((r) => !r.published).map((r) => r.slug).join(', ') || 'none'}`);

  if (DRY_RUN) {
    console.log('\n--dry-run: nothing written.');
    return;
  }

  const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Preserve group ids already assigned on a previous run.
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('locale, slug, translation_group_id');

  if (existing?.length) {
    const known = new Map(
      existing.map((e) => [`${e.locale}:${e.slug}`, e.translation_group_id as string])
    );
    for (const r of rows) {
      const prior = known.get(`${r.locale}:${r.slug}`);
      if (prior) r.translation_group_id = prior;
    }
    console.log(`\nfound ${existing.length} existing rows — preserving their group ids`);
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(rows, { onConflict: 'locale,slug' })
    .select('locale, slug');

  if (error) {
    console.error('\nimport failed:', error.message);
    process.exit(1);
  }

  console.log(`\nupserted ${data?.length ?? 0} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
