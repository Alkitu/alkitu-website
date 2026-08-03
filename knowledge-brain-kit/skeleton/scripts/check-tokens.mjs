#!/usr/bin/env node
/**
 * Guard anti-hardcodeo (Historia 2-8 / FR-35). Falla si aparece un color hex
 * (#rgb / #rrggbb…) en apps/web/app fuera de la allowlist de contenido acoplado.
 * Blinda el 0-hex logrado en la Épica 2: la web se estiliza solo con clases-token
 * (bg-primary, text-foreground…) o var(--token). Los arbitrarios no-color
 * (clamps de hero, tracking puntual) NO se marcan: no tienen token equivalente.
 *
 * Uso: node scripts/check-tokens.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

// Contenido acoplado: su hex ES contenido (demos de color, diagramas). Se
// documenta como excepción; no es piel del sistema. Añade aquí los componentes
// de contenido del concepto que legítimamente usen hex literal.
const ALLOWLIST = [
  "wiki/_components/interactive/",
  // Generadores de imágenes OG (next/og): son PNG generados en build, fuera del
  // DOM y del sistema de tokens; el color de marca va en literal por necesidad.
  "opengraph-image.tsx",
];

// Directorios escaneados. `app` = piel del sistema (con allowlist de contenido
// acoplado). `lib` = helpers (glosario, seo, i18n…): sin contenido-hex legítimo,
// así que allowlist vacía → blinda las migraciones a token de FR-15/16.
const SCAN_DIRS = [
  { dir: join(ROOT, "apps/web/app"), label: "apps/web/app", allow: ALLOWLIST },
  { dir: join(ROOT, "apps/web/lib"), label: "apps/web/lib", allow: [] },
];

const HEX = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|css)$/.test(name)) out.push(p);
  }
  return out;
}

const violations = [];
for (const { dir, label, allow } of SCAN_DIRS) {
  for (const file of walk(dir)) {
    const rel = relative(dir, file);
    if (allow.some((a) => rel.startsWith(a) || rel.includes(a))) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (HEX.test(line)) violations.push(`  ${label}/${rel}:${i + 1}  ${line.trim().slice(0, 100)}`);
    });
  }
}

if (violations.length) {
  console.error(`\n❌ Guard de tokens: ${violations.length} color(es) hex fuera de la allowlist.`);
  console.error("   Usa clases-token (bg-primary, text-foreground…) o var(--token), no hex.\n");
  console.error(violations.join("\n"));
  console.error("");
  process.exit(1);
}
console.log("✓ Guard de tokens: 0 hex fuera de la allowlist en apps/web/{app,lib}.");
