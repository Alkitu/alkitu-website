import { getAllPosts } from "@/lib/content/blog";
import { TERMINOS } from "@/lib/glosario";
import { CASOS } from "../[lang]/casos-de-estudio/_data/casos";
import { REVIEWS } from "../[lang]/reviews/_data/reviews";

/**
 * /llms.txt (estándar llmstxt.org): mapa curado del sitio para IAs
 * (ChatGPT, Perplexity, AI Overviews) — objetivo GEO. Se genera del contenido
 * REAL (blog, wiki, casos, reviews), así no se desincroniza. La versión pública
 * canónica es la ES (raíz); el sitio es bilingüe (EN bajo /en/).
 */
export const dynamic = "force-static";

const BASE = "https://tuconcepto.com";

function trunc(s: string, n = 140): string {
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > n ? clean.slice(0, n - 1).trimEnd() + "…" : clean;
}

export async function GET() {
  const posts = await getAllPosts();

  const secciones = [
    ["/sobre-mi", "Sobre mí", "Quién está detrás de [concepto], su método y su trayectoria."],
    ["/blog", "Blog", "Artículos y notas de campo sobre [concepto]."],
    ["/wiki", "Wiki", `Glosario de ${TERMINOS.length} términos de [concepto], cada uno con definición citable.`],
    ["/reviews", "Reviews", "Reseñas de herramientas y recursos relacionados con [concepto]."],
    ["/casos-de-estudio", "Casos de estudio", "Casos de [concepto] explicados de principio a fin."],
    ["/contacto", "Contacto", "Cómo ponerse en contacto."],
  ];

  const lines: string[] = [];
  lines.push("# [Concepto]");
  lines.push("");
  lines.push(
    "> Sitio sobre [concepto]: contenido de referencia (blog, wiki, casos de estudio y reseñas), pensado para ser citable. Bilingüe: español en la raíz, inglés bajo /en/.",
  );
  lines.push("");

  lines.push("## Secciones");
  for (const [path, name, desc] of secciones) {
    lines.push(`- [${name}](${BASE}${path}): ${desc}`);
  }
  lines.push("");

  lines.push("## Blog");
  for (const p of posts) {
    const d = p.frontmatter.extracto ? `: ${trunc(p.frontmatter.extracto)}` : "";
    lines.push(`- [${p.frontmatter.title}](${BASE}/blog/${p.slug})${d}`);
  }
  lines.push("");

  lines.push("## Casos de estudio");
  for (const [slug, caso] of Object.entries(CASOS)) {
    const d = caso.subtitulo ? `: ${trunc(caso.subtitulo)}` : "";
    lines.push(`- [${caso.titulo}](${BASE}/casos-de-estudio/${slug})${d}`);
  }
  lines.push("");

  lines.push("## Reviews");
  for (const r of REVIEWS) {
    const d = r.resumen ? `: ${trunc(r.resumen, 120)}` : "";
    lines.push(`- [${r.titulo}](${BASE}/reviews/${r.slug})${d}`);
  }
  lines.push("");

  lines.push("## Wiki");
  lines.push(
    `- [Glosario completo](${BASE}/wiki): ${TERMINOS.length} términos definidos de [concepto]. Cada término tiene página propia con definición citable y datos estructurados (schema.org DefinedTerm).`,
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
