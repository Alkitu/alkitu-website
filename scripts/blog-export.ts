/**
 * Exports the blog from Supabase back to MDX files.
 *
 * The database is the source of truth, but content shouldn't only exist there:
 * this writes `content/blog/{locale}/{slug}.mdx` so posts stay diffable and
 * reviewable in git, and so a full copy survives outside the database.
 *
 * One-directional by design. There is no import-from-MDX counterpart for edits
 * (only the initial `blog-import.ts` migration), which keeps the two copies from
 * ever disagreeing about who wins.
 *
 * Usage:
 *   npm run blog:export
 *   npm run blog:export -- --check   # fail if the export would change anything
 */

import fs from 'node:fs';
import path from 'node:path';
import { agentClient } from '../lib/agent/client';

const CHECK = process.argv.includes('--check');
const OUT_DIR = path.join(process.cwd(), 'content', 'blog');

interface Row {
  title: string;
  slug: string;
  locale: string;
  categoria: string;
  canonical: string | null;
  titulo_seo: string | null;
  metadescripcion: string | null;
  keyword_principal: string | null;
  keywords_secundarias: string[];
  tags: string[];
  intencion_busqueda: string | null;
  geo_preguntas: string[];
  geo_respuestas: string[];
  geo_respuesta_corta: string | null;
  geo_entidades: string[];
  geo_formato: string[];
  schema_tipo: string | null;
  prioridad: number | null;
  frecuencia_cambio: string | null;
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
  estado: string;
  published: boolean;
  published_at: string | null;
  content_updated_at: string | null;
  translation_group_id: string;
}

/** Minimal YAML emitter — enough for the scalar/array/object shapes we store. */
function yamlValue(v: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);

  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);

  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return (
      '\n' +
      v
        .map((item) => {
          if (item && typeof item === 'object') {
            const inner = Object.entries(item as Record<string, unknown>)
              .map(([k, val], i) => `${i === 0 ? '' : `${pad}    `}${k}: ${yamlValue(val)}`)
              .join('\n');
            return `${pad}  - ${inner}`;
          }
          return `${pad}  - ${yamlValue(item)}`;
        })
        .join('\n')
    );
  }
  return JSON.stringify(v);
}

function toMdx(r: Row): string {
  // Only emit fields that carry a value, so exported frontmatter stays readable
  // instead of a wall of nulls.
  const fields: Array<[string, unknown]> = [
    ['title', r.title],
    ['slug', r.slug],
    ['locale', r.locale],
    ['categoria', r.categoria],
    ['canonical', r.canonical],
    ['titulo_seo', r.titulo_seo],
    ['metadescripcion', r.metadescripcion],
    ['keyword_principal', r.keyword_principal],
    ['keywords_secundarias', r.keywords_secundarias],
    ['tags', r.tags],
    ['intencion_busqueda', r.intencion_busqueda],
    ['geo_preguntas', r.geo_preguntas],
    ['geo_respuestas', r.geo_respuestas],
    ['geo_respuesta_corta', r.geo_respuesta_corta],
    ['geo_entidades', r.geo_entidades],
    ['geo_formato', r.geo_formato],
    ['schema_tipo', r.schema_tipo],
    ['prioridad', r.prioridad],
    ['frecuencia_cambio', r.frecuencia_cambio],
    ['extracto', r.extracto],
    ['portada', r.portada],
    ['portada_alt', r.portada_alt],
    ['portada_credito', r.portada_credito],
    ['lectura', r.lectura],
    ['autor', r.autor],
    ['autor_rol', r.autor_rol],
    ['author_username', r.author_username],
    ['secciones', r.secciones],
    ['featured', r.featured],
    ['estado', r.estado],
    ['published', r.published],
    ['published_at', r.published_at],
    ['content_updated_at', r.content_updated_at],
    ['translation_group_id', r.translation_group_id],
  ];

  const frontmatter = fields
    .filter(([, v]) => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${yamlValue(v)}`)
    .join('\n');

  return `---\n${frontmatter}\n---\n\n${r.body_mdx.trim()}\n`;
}

async function main() {
  const { data, error } = await agentClient()
    .from('blog_posts')
    .select('*')
    .order('locale')
    .order('slug');

  if (error) {
    console.error(`Could not read blog_posts: ${error.message}`);
    process.exit(1);
  }

  const rows = (data ?? []) as Row[];
  let changed = 0;

  for (const row of rows) {
    const dir = path.join(OUT_DIR, row.locale);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${row.slug}.mdx`);
    const next = toMdx(row);
    const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;

    if (prev === next) continue;
    changed++;
    if (!CHECK) fs.writeFileSync(file, next);
  }

  if (CHECK) {
    if (changed) {
      console.error(`${changed} file(s) would change. Run: npm run blog:export`);
      process.exit(1);
    }
    console.log(`Export is up to date (${rows.length} posts).`);
    return;
  }

  console.log(`Exported ${rows.length} posts (${changed} written) to content/blog/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
