/**
 * Radar de gaps (mecánico) — protocolo /experto. Solo lectura; imprime informe.
 * Detecta: (1) términos huérfanos de taxonomía, (2) menciones de términos
 * existentes sin enlazar en el blog ES, (3) tamaño de comunidades del grafo.
 * La capa SEMÁNTICA (candidatos a término nuevo) la hace el agente leyendo el
 * contenido — esto es el barrido barato previo. Uso: `pnpm radar` (raíz).
 * Ver docs/radar-gaps-*.md para el formato de informe completo.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

const glosario = JSON.parse(readFileSync("content/wiki/glosario.json", "utf8"));
const terminos = glosario.terminos as any[];
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ── 1) Huérfanos de taxonomía ──
const huerfanos = terminos.filter((t) => !t.hiperonimos.length && !t.hiponimos.length && !t.relacionados.length);
console.log(`## Huérfanos de taxonomía: ${huerfanos.length}/${terminos.length}`);
for (const t of huerfanos.slice(0, 40)) console.log(`- ${t.slug} (${t.dominio})`);

// ── 2) Menciones sin enlace (blog ES) — excluye ruido de aliases NIZA ──
const dir = "content/blog";
console.log("\n## Menciones sin enlace (blog ES)");
const indexables = terminos.filter((t) => !t.slug.startsWith("clase-") && t.titulo.length >= 4);
for (const f of readdirSync(dir).filter((f) => f.endsWith(".es.mdx"))) {
  const { content } = matter(readFileSync(join(dir, f), "utf8"));
  const slug = f.replace(/\.es\.mdx$/, "");
  const linked = new Set([...content.matchAll(/\/wiki\/([a-z0-9-]+)/g)].map((m) => m[1]));
  const ncontent = norm(content);
  const missing: string[] = [];
  for (const t of indexables) {
    if (linked.has(t.slug)) continue;
    const names = [t.titulo, ...(t.aliases || [])].filter((x: string) => x && x.length >= 4);
    if (
      names.some((nm: string) =>
        new RegExp(`(^|[^a-z0-9])${norm(nm).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(ncontent),
      )
    ) {
      missing.push(t.slug);
    }
  }
  if (missing.length)
    console.log(`- **${slug}**: ${missing.length} → ${missing.slice(0, 12).join(", ")}${missing.length > 12 ? "…" : ""}`);
}

// ── 3) Comunidades del grafo Context ──
try {
  const g = JSON.parse(readFileSync("../../Context/graphify-out/graph.json", "utf8"));
  const byCom: Record<string, string[]> = {};
  for (const n of g.nodes) (byCom[n.community ?? "?"] ||= []).push(n.label);
  console.log("\n## Comunidades del grafo (top 8 por tamaño)");
  for (const [c, labels] of Object.entries(byCom)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)) {
    console.log(`- comunidad ${c} (${labels.length}): ${labels.slice(0, 8).join(" · ")}`);
  }
} catch {
  console.log("\n## Grafo no disponible (Context/graphify-out/graph.json)");
}
