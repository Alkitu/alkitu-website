/**
 * Interlinking pass — protocolo /experto. ESCRIBE en content/blog/*.mdx:
 * enlaza la PRIMERA mención de cada término del glosario aún no enlazado en el
 * artículo, con guardas (frontmatter, código, JSX, headings, links existentes).
 * Uso: `pnpm interlink` (raíz). Después: revisar `git diff` (los aliases cortos
 * pueden dar falsos positivos — p. ej. "plano"→blueprint; se corrigen a mano)
 * y correr los gates. Excluye slugs `clase-*` (ruido de aliases NIZA).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

const glosario = JSON.parse(readFileSync("content/wiki/glosario.json", "utf8"));
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const ACC: Record<string, string> = { a: "[aáàä]", e: "[eéèë]", i: "[iíìï]", o: "[oóòö]", u: "[uúùü]", n: "[nñ]" };
const pat = (name: string) =>
  norm(name)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .split("")
    .map((c) => ACC[c] ?? c)
    .join("");

function pass(lang: "es" | "en") {
  const dir = "content/blog";
  const suffix = `.${lang}.mdx`;
  const urlBase = lang === "es" ? "/wiki/" : "/en/wiki/";
  const report: Record<string, number> = {};
  for (const f of readdirSync(dir).filter((x) => x.endsWith(suffix))) {
    const raw = readFileSync(join(dir, f), "utf8");
    const fm = matter(raw);
    const bodyStart = raw.indexOf(fm.content);
    const lines = fm.content.split("\n");
    const linked = new Set([...fm.content.matchAll(/\/wiki\/([a-z0-9-]+)/g)].map((m) => m[1]));
    let added = 0;

    // clasificar cada línea UNA vez: prosa vs no-tocar. OJO: el cierre </X> se
    // comprueba ANTES que la apertura <X (si no, re-activa inJsx para siempre).
    const prose: boolean[] = [];
    let inCode = false,
      inJsx = false;
    for (const L of lines) {
      const t = L.trim();
      if (t.startsWith("```")) { inCode = !inCode; prose.push(false); continue; }
      if (inCode) { prose.push(false); continue; }
      if (/^<\//.test(t)) { inJsx = false; prose.push(false); continue; }
      if (/^<[A-Za-z]/.test(t)) {
        if (!/\/>\s*$/.test(t) && !/<\/[A-Za-z]+>\s*$/.test(t)) inJsx = true;
        prose.push(false); continue;
      }
      if (inJsx) { if (/\/>\s*$/.test(t)) inJsx = false; prose.push(false); continue; }
      if (t.startsWith("#")) { prose.push(false); continue; }
      prose.push(true);
    }

    // Un alias que ES el título canónico de OTRO término no puede secuestrarlo
    // (p. ej. "Blueprint" es alias de Service Blueprint; el término propio manda).
    const titulos = new Set(glosario.terminos.map((t: any) => t.titulo.toLowerCase()));
    const terms = glosario.terminos
      .filter((t: any) => !t.slug.startsWith("clase-"))
      .map((t: any) => ({
        slug: t.slug,
        names: [lang === "es" ? t.titulo : t.tituloEn || t.titulo, ...(lang === "es" ? t.aliases || [] : [])].filter(
          (n: string) =>
            n && n.length >= 4 && (n.toLowerCase() === t.titulo.toLowerCase() || !titulos.has(n.toLowerCase())),
        ),
      }))
      .filter((t: any) => t.names.length)
      .sort((a: any, b: any) => b.names[0].length - a.names[0].length);

    for (const t of terms) {
      if (linked.has(t.slug)) continue;
      outer: for (let i = 0; i < lines.length; i++) {
        if (!prose[i]) continue;
        const L = lines[i];
        const spans: [number, number][] = [];
        for (const m of L.matchAll(/\[[^\]]*\]\([^)]*\)|`[^`]*`/g)) spans.push([m.index!, m.index! + m[0].length]);
        for (const name of t.names) {
          const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${pat(name)})(?=[^\\p{L}\\p{N}]|$)`, "iu");
          const m = re.exec(L);
          if (!m) continue;
          const idx = m.index + m[1].length;
          if (spans.some(([a, b]) => idx >= a && idx < b)) continue;
          const original = L.slice(idx, idx + m[2].length);
          lines[i] = L.slice(0, idx) + `[${original}](${urlBase}${t.slug})` + L.slice(idx + m[2].length);
          linked.add(t.slug);
          added++;
          break outer;
        }
      }
    }
    if (added) {
      writeFileSync(join(dir, f), raw.slice(0, bodyStart) + lines.join("\n"));
      report[f.replace(suffix, "")] = added;
    }
  }
  return report;
}
console.log("ES:", JSON.stringify(pass("es")));
console.log("EN:", JSON.stringify(pass("en")));
console.log("→ revisa `git diff content/blog` (falsos positivos de alias) y corre los gates.");
