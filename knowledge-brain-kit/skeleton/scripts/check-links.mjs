#!/usr/bin/env node
/**
 * Check de enlaces internos (Historia 4-7 / FR-36). Tras `pnpm build`, recorre el
 * HTML prerenderizado y comprueba que cada enlace interno (href="/...") apunta a
 * una página realmente generada. Falla si algún enlace interno resolvería en 404.
 * Sin navegador: mapea cada href a su .html en .next/server/app.
 *
 * Uso: node scripts/check-links.mjs   (requiere haber corrido pnpm build)
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, "apps/web/.next/server/app");
const PUBLIC = join(ROOT, "apps/web/public");

// Rutas válidas sin .html (dinámicas / route handlers): no son 404.
// Las páginas `force-dynamic` no generan .html en el build (p. ej. el mapa de
// secciones con datos en vivo) → se listan aquí para no marcarlas como rotas.
const DYNAMIC_OK = [
  "/login",
  "/admin",
  "/blog/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
];

if (!existsSync(APP)) {
  console.error("❌ No existe .next/server/app — corre `pnpm build` antes del check de enlaces.");
  process.exit(2);
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// Locales (Historia 7-1 / FR-41): las páginas viven bajo app/[lang]/ con
// segmentos internos ES; el middleware traduce las URLs públicas. Este check
// replica esa traducción: `/blog` → es/blog.html · `/en/about` → en/sobre-mi.html.
// El mapa de slugs ES↔EN es el mismo que usa la web (route-map.json).
const ROUTE_MAP = JSON.parse(
  readFileSync(join(ROOT, "apps/web/lib/i18n/route-map.json"), "utf8"),
);
const EN_TO_ES = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([es, en]) => [en, es]),
);

/** URL pública → ruta interna prerenderizada (sin barra inicial). */
function toInternal(path) {
  if (path === "/en" || path.startsWith("/en/")) {
    const rest = path.replace(/^\/en\/?/, "");
    if (!rest) return "en";
    let best = "";
    for (const en of Object.keys(EN_TO_ES)) {
      if ((rest === en || rest.startsWith(`${en}/`)) && en.length > best.length) best = en;
    }
    return `en/${best ? EN_TO_ES[best] + rest.slice(best.length) : rest}`;
  }
  return path === "/" ? "es" : `es${path}`;
}

/** ¿Existe el destino de este href (página o asset público)? */
function pageExists(path) {
  if (path.startsWith("/_next/")) return true; // assets de build (siempre válidos)
  if (DYNAMIC_OK.includes(path)) return true;
  const rel = path.replace(/^\//, "");
  // Asset con extensión (imagen, pdf, svg…): en public/ o como ruta de app (icon.svg).
  if (/\.[a-z0-9]+$/i.test(rel)) return existsSync(join(PUBLIC, rel)) || existsSync(join(APP, rel));
  // Página: .html generado (árbol [lang]) o, para el árbol privado sin locale
  // ((private) no añade segmento: /login, /admin), en la raíz de app.
  const internal = toInternal(path);
  return (
    existsSync(join(APP, `${internal}.html`)) ||
    existsSync(join(APP, internal, "index.html")) ||
    existsSync(join(APP, `${rel}.html`)) ||
    existsSync(join(APP, rel, "index.html"))
  );
}

const htmlFiles = walk(APP);
const roto = new Map(); // href → páginas donde aparece

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const origen = "/" + file.slice(APP.length + 1).replace(/(index)?\.html$/, "").replace(/\/$/, "");
  for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    let href = m[1];
    if (href.length > 1) href = href.replace(/\/$/, ""); // normaliza trailing slash
    if (href.startsWith("//")) continue; // protocol-relative externo
    if (!pageExists(href)) {
      if (!roto.has(href)) roto.set(href, new Set());
      roto.get(href).add(origen || "/");
    }
  }
}

if (roto.size) {
  console.error(`\n❌ Check de enlaces: ${roto.size} enlace(s) interno(s) que resolverían en 404:\n`);
  for (const [href, origenes] of roto) {
    console.error(`  ${href}\n     ← en: ${[...origenes].slice(0, 5).join(", ")}`);
  }
  console.error("");
  process.exit(1);
}
console.log(`✓ Check de enlaces: ${htmlFiles.length} páginas revisadas, 0 enlaces internos rotos.`);
