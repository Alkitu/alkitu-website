import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { blogFrontmatterSchema, type BlogFrontmatter } from "./schema";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** Sufijo de archivo por locale: `<slug>.es.mdx` / `<slug>.en.mdx`. */
const suffixFor = (lang: string) => `.${lang}.mdx`;

export type { BlogFrontmatter };

export type BlogPost = {
  slug: string;
  frontmatter: BlogFrontmatter;
};

// Abreviaturas de mes ES + EN (los `.en.mdx` usan "DD Mon YYYY" en inglés).
const MESES: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
  jan: 0, apr: 3, aug: 7, dec: 11,
};

/** Convierte una `fecha` de display ("18 jun 2026") en epoch ms para ordenar. 0 si no parsea. */
function fechaMs(fecha?: string): number {
  if (!fecha) return 0;
  const m = /^(\d{1,2})\s+([a-záéíóú]{3})\.?\s+(\d{4})$/i.exec(fecha.trim());
  if (!m) return 0;
  const mes = MESES[m[2].toLowerCase().slice(0, 3)];
  if (mes === undefined) return 0;
  return Date.UTC(Number(m[3]), mes, Number(m[1]));
}

/** Lee y valida el frontmatter de todos los MDX del blog en `lang`. Un frontmatter inválido rompe el build. */
async function readAll(lang: string = "es"): Promise<BlogPost[]> {
  const suffix = suffixFor(lang);
  let files: string[] = [];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    return [];
  }
  const mdx = files.filter((f) => f.endsWith(suffix));
  const posts = await Promise.all(
    mdx.map(async (f) => {
      const slug = f.slice(0, -suffix.length);
      const raw = await fs.readFile(path.join(BLOG_DIR, f), "utf8");
      const { data } = matter(raw);
      const parsed = blogFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        throw new Error(
          `Frontmatter inválido en content/blog/${f}: campo "${issue.path.join(".") || "(raíz)"}" — ${issue.message}`,
        );
      }
      return { slug, frontmatter: parsed.data };
    }),
  );
  return posts;
}

/**
 * Todos los artículos, ordenados por `fecha` descendente. Desempate por slug
 * descendente para un orden estable y determinista (reproduce el orden actual).
 */
export async function getAllPosts(lang: string = "es"): Promise<BlogPost[]> {
  const posts = await readAll(lang);
  return posts.sort((a, b) => {
    const d = fechaMs(b.frontmatter.fecha) - fechaMs(a.frontmatter.fecha);
    return d !== 0 ? d : b.slug.localeCompare(a.slug);
  });
}

/** Artículos relacionados: los más recientes excluyendo el actual. */
export async function getRelatedPosts(slug: string, lang: string = "es", limit = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts(lang);
  return posts.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Slugs de los artículos con cuerpo MDX en `lang`. El slug es el nombre de archivo sin `.<lang>.mdx`. */
export async function getPostSlugs(lang: string = "es"): Promise<string[]> {
  const posts = await readAll(lang);
  return posts.map((p) => p.slug);
}

/** Fuente MDX cruda del artículo en `lang`, o `null` si el archivo no existe. */
export async function getPostSource(slug: string, lang: string = "es"): Promise<string | null> {
  const file = path.join(BLOG_DIR, `${slug}${suffixFor(lang)}`);
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}
