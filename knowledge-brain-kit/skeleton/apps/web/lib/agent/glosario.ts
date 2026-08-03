import { readFileSync } from "node:fs";

import { resolveAsset } from "./paths";

/** Forma de un término tal como vive en content/wiki/glosario.json. */
export interface TerminoAgente {
  slug: string;
  titulo: string;
  dominio: string;
  dominios: string[];
  aliases: string[];
  definicion: string;
  hiperonimos: { nombre: string; slug: string }[];
  hiponimos: { nombre: string; slug: string }[];
  relacionados: { nombre: string; slug: string }[];
  tituloEn?: string;
  definicionEn?: string;
}

let cache: TerminoAgente[] | null = null;

function loadGlosario(): TerminoAgente[] {
  if (cache) return cache;
  const p = resolveAsset("content/wiki/glosario.json");
  if (!p) return [];
  try {
    const d = JSON.parse(readFileSync(p, "utf8"));
    cache = (d.terminos ?? []) as TerminoAgente[];
    return cache;
  } catch {
    return [];
  }
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Busca términos por texto (título, aliases, slug, definición). Léxico, sin embeddings. */
export function queryGlosario(q: string, dominio?: string, max = 8) {
  const terminos = loadGlosario();
  const nq = norm(q);
  const scored = terminos
    .filter((t) => !dominio || norm(t.dominio) === norm(dominio) || t.dominios?.some((d) => norm(d) === norm(dominio)))
    .map((t) => {
      let score = 0;
      if (norm(t.titulo) === nq || norm(t.slug) === nq) score = 100;
      else if (t.aliases?.some((a) => norm(a) === nq)) score = 90;
      else if (norm(t.titulo).includes(nq) || t.aliases?.some((a) => norm(a).includes(nq))) score = 60;
      else if (norm(t.definicion).includes(nq)) score = 30;
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
  return scored.map(({ t }) => ({
    slug: t.slug,
    titulo: t.titulo,
    dominio: t.dominio,
    definicion: t.definicion,
    url: `/wiki/${t.slug}`,
  }));
}

/** Término completo por slug (con taxonomía: hiperónimos/hipónimos/relacionados). */
export function getTermino(slug: string) {
  const t = loadGlosario().find((x) => x.slug === slug);
  if (!t) return null;
  return { ...t, url: `/wiki/${t.slug}` };
}

/** Total de términos cargados (0 = glosario no disponible). */
export function totalTerminos(): number {
  return loadGlosario().length;
}
