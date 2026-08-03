import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import { resolveAsset } from "./paths";
// Data files de casos y reviews (imports relativos: robustos ante el bundler de eve).
import { CASOS } from "../../app/[lang]/casos-de-estudio/_data/casos";
import { REVIEWS } from "../../app/[lang]/reviews/_data/reviews";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Fragmento de contenido con su fuente citable. */
export interface Fragmento {
  tipo: "blog" | "caso" | "review";
  titulo: string;
  url: string;
  extracto: string;
}

function extracto(texto: string, nq: string, ancho = 240): string {
  const i = norm(texto).indexOf(nq);
  if (i < 0) return texto.slice(0, ancho);
  const start = Math.max(0, i - Math.floor(ancho / 3));
  return (start > 0 ? "…" : "") + texto.slice(start, start + ancho) + "…";
}

/** Búsqueda léxica sobre blog (MDX), casos y reviews. Cada hit lleva URL fuente. */
export function searchContent(q: string, seccion?: "blog" | "casos" | "reviews", max = 6): Fragmento[] {
  const nq = norm(q);
  const out: Fragmento[] = [];

  if (!seccion || seccion === "blog") {
    const dir = resolveAsset("content/blog");
    if (dir) {
      for (const f of readdirSync(dir).filter((f) => f.endsWith(".es.mdx"))) {
        try {
          const raw = readFileSync(join(dir, f), "utf8");
          const { data, content } = matter(raw);
          const slug = f.replace(/\.es\.mdx$/, "");
          if (norm(String(data.title ?? "")).includes(nq) || norm(slug).includes(nq) || norm(content).includes(nq)) {
            out.push({
              tipo: "blog",
              titulo: String(data.title ?? f),
              url: `/blog/${slug}`,
              extracto: extracto(content, nq),
            });
          }
        } catch {
          /* archivo ilegible → se salta */
        }
      }
    }
  }

  if (!seccion || seccion === "casos") {
    for (const [slug, c] of Object.entries(CASOS)) {
      const texto = [c.titulo, c.subtitulo, ...c.secciones.flatMap((s) => s.parrafos)].join(" ");
      if (norm(texto).includes(nq)) {
        out.push({ tipo: "caso", titulo: c.titulo, url: `/casos-de-estudio/${slug}`, extracto: extracto(texto, nq) });
      }
    }
  }

  if (!seccion || seccion === "reviews") {
    for (const r of REVIEWS) {
      const texto = [r.titulo, r.resumen ?? ""].join(" ");
      if (norm(texto).includes(nq)) {
        out.push({ tipo: "review", titulo: r.titulo, url: `/reviews/${r.slug}`, extracto: extracto(texto, nq) });
      }
    }
  }

  return out.slice(0, max);
}
