#!/usr/bin/env node
/**
 * Validador del binding de 3 capas (blueprint ↔ componentes ↔ código).
 *   - ERROR  (falla): `rutas-codigo` que no resuelve, o `componentes` mal formado / capa desconocida.
 *   - AVISO  (no falla): `componentes` `ds:*` que aún no existe en el DS → "por crear" (backlog del DS).
 *   - AVISO  (no falla): nodos de Context tocados sin registrar en la Bitácora (recordatorio Regla #2).
 *   - BACKLOG (opcional, off por defecto): pares `*.es.md` sin su `*.en.md`. Activar con --check-en
 *     o CHECK_EN=1 cuando el ES esté completo. Nunca falla; solo lista.
 * Uso: node scripts/validate-context.mjs [--check-en]   (pnpm validate:context)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const CHECK_EN = process.argv.includes("--check-en") || process.env.CHECK_EN === "1";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTEXT = join(ROOT, "Context");
const DS_COMPONENTS = join(ROOT, "design-system", "web", "components");
const VALID_LAYERS = ["primitives", "compositions", "patterns", "integrations", "showcase", "foundations"];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "graphify-out" || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function frontmatter(text) {
  if (!text.startsWith("---")) return "";
  const end = text.indexOf("\n---", 3);
  return end === -1 ? "" : text.slice(3, end);
}

// items bajo `key:` — soporta inline [a, b] y bloque "  - item"; ignora comentarios `# ...`
function listField(fm, key) {
  const lines = fm.split("\n");
  const items = [];
  let capturing = false;
  for (const line of lines) {
    if (line.startsWith(key + ":")) {
      const inline = line.slice(key.length + 1).split("#")[0].trim();
      if (inline.startsWith("[")) {
        const end = inline.lastIndexOf("]");
        return inline.slice(1, end === -1 ? undefined : end)
          .split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      }
      capturing = true;
      continue;
    }
    if (capturing) {
      const m = line.match(/^\s*-\s*(.+)$/);
      if (m) items.push(m[1].split("#")[0].trim().replace(/^["']|["']$/g, ""));
      else if (/^\S/.test(line)) capturing = false;
    }
  }
  return items;
}

// valor escalar de `key:` (una línea), sin comillas ni comentario
function scalarField(fm, key) {
  for (const line of fm.split("\n")) {
    if (line.startsWith(key + ":")) {
      return line.slice(key.length + 1).split("#")[0].trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

// Estados que afirman "aún no construido". Si el código YA existe, el nodo miente.
const ESTADOS_NO_CONSTRUIDO = ["planeado", "planificado", "pendiente", "no-construido", "por-construir"];

const errors = [];
const warnings = [];
const toCreate = new Set();   // componentes ds: que faltan (backlog del DS)
const missingEn = [];         // pares *.es.md sin *.en.md (backlog ES→EN, off por defecto)
const coveredPaths = [];      // bases de rutas-codigo declaradas (para detectar huérfanos)
let nodes = 0, rutas = 0, comps = 0;

for (const file of walk(CONTEXT)) {
  // Backlog bilingüe: cada *.es.md debería tener su *.en.md hermano.
  if (file.endsWith(".es.md") && !existsSync(file.replace(/\.es\.md$/, ".en.md"))) {
    missingEn.push(file.replace(ROOT + "/", ""));
  }

  const fm = frontmatter(readFileSync(file, "utf8"));
  if (!fm) continue;
  nodes++;
  const rel = file.replace(ROOT + "/", "");

  // Se filtran comentarios/anotaciones ("#", "pendiente", "(nota)"), pero NO las
  // rutas reales con grupos de Next tipo app/(private)/ (Historia 7-1).
  const rutasNodo = listField(fm, "rutas-codigo").filter(
    (r) => r && !r.startsWith("#") && !r.startsWith("(") && !/pendiente/.test(r),
  );
  let todasExisten = rutasNodo.length > 0;
  for (const ruta of rutasNodo) {
    rutas++;
    const base = ruta.split("*")[0].replace(/\/$/, "");
    coveredPaths.push(base);
    if (!existsSync(join(ROOT, base))) {
      errors.push(`${rel}: rutas-codigo no resuelve → ${ruta}`);
      todasExisten = false;
    }
  }

  // Honestidad del estado (FR-38): si el nodo se declara "no construido" pero
  // todas sus rutas-codigo existen, miente → error.
  const estado = scalarField(fm, "estado-implementacion").toLowerCase();
  if (estado && todasExisten && ESTADOS_NO_CONSTRUIDO.some((e) => estado.includes(e))) {
    errors.push(`${rel}: estado-implementacion="${estado}" pero todas sus rutas-codigo existen (código construido)`);
  }

  for (const comp of listField(fm, "componentes")) {
    if (!comp || !comp.startsWith("ds:")) continue;
    comps++;
    const m = comp.match(/^ds:([a-z-]+)\/([A-Za-z0-9-]+)/);
    if (!m) { errors.push(`${rel}: componente mal formado → ${comp}`); continue; }
    const [, layer, name] = m;
    if (!VALID_LAYERS.includes(layer)) { errors.push(`${rel}: capa DS desconocida → ${comp}`); continue; }
    if (!existsSync(join(DS_COMPONENTS, layer, name))) toCreate.add(`ds:${layer}/${name}`);
  }
}

// --- Huérfanos (FR-37): archivos reales bajo apps/web/app no cubiertos por ningún
// rutas-codigo. AVISO (no falla): superficie el drift de incompletitud sin bloquear. ---
const APP_DIR = join(ROOT, "apps", "web", "app");
// Archivos de framework/tests que no representan contenido a documentar en un nodo.
const IGNORAR_HUERFANO = /(\.test\.[tj]sx?$|\/(loading|not-found|error|global-error|layout|sitemap|robots|opengraph-image)\.[tj]sx?$|\/icon\.|\/apple-icon\.|\/\[\.\.\.rest\]\/page\.[tj]sx?$)/;

function walkApp(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkApp(p, out);
    else if (/\.[tj]sx?$/.test(name)) out.push(p);
  }
  return out;
}

function cubierto(relFile) {
  return coveredPaths.some((base) => relFile === base || relFile.startsWith(base + "/") || relFile.startsWith(base));
}

const huerfanos = [];
for (const f of walkApp(APP_DIR)) {
  const rel = f.replace(ROOT + "/", "");
  if (IGNORAR_HUERFANO.test("/" + rel)) continue;
  if (!cubierto(rel)) huerfanos.push(rel);
}

// --- Recordatorio Regla #2: nodos de Context tocados sin registrar en la Bitácora ---
// AVISO, nunca falla (los cambios "se pueden acumular"; esto solo te lo recuerda).
function bitacoraReminder() {
  let out;
  try {
    out = execSync("git -c core.quotepath=false status --porcelain -z", {
      cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    });
  } catch { return null; }            // no es repo git / git no disponible → silencio
  const changed = out.split("\0").map((r) => r.slice(3).trim()).filter(Boolean);
  const ctxChanged = changed.filter(
    (p) => p.startsWith("Context/") && !p.includes("graphify-out/") && !p.includes("Bitácora"),
  );
  const bitacoraTouched = changed.some((p) => p.includes("Bitácora"));
  if (ctxChanged.length && !bitacoraTouched) return ctxChanged;
  return null;
}

console.log(`Context: ${nodes} nodos · ${rutas} rutas-codigo · ${comps} componentes ds:`);

if (toCreate.size) {
  console.log(`\n🆕 Componentes del DS por crear (${toCreate.size}) — backlog, no es drift:`);
  for (const c of [...toCreate].sort()) console.log("  · " + c);
}

if (CHECK_EN && missingEn.length) {
  console.log(`\n🌐 Pares EN por crear (${missingEn.length}) — backlog ES→EN, no es drift:`);
  for (const f of missingEn.sort()) console.log("  · " + f.replace(/\.es\.md$/, " → falta .en.md"));
} else if (CHECK_EN) {
  console.log(`\n🌐 Bilingüe: todos los *.es.md tienen su *.en.md.`);
}

const pendientesBitacora = bitacoraReminder();
if (pendientesBitacora) {
  console.log(`\n📝 Recordatorio (Regla #2): ${pendientesBitacora.length} nodo(s) de Context tocados sin registrar en la Bitácora.`);
  console.log(`   Si el cambio fue estructural, regístralo en Context/99-Meta/Bitácora de decisiones.md (en lote vale).`);
  for (const f of pendientesBitacora.slice(0, 8)) console.log("  · " + f);
  if (pendientesBitacora.length > 8) console.log(`  · …y ${pendientesBitacora.length - 8} más`);
}

// puede bajar. Si reduces huérfanos, baja este número en el mismo commit.
const MAX_HUERFANOS = 18;  // baseline del kit; baja al instanciar y asignar los huérfanos a nodos
if (huerfanos.length) {
  const excede = huerfanos.length > MAX_HUERFANOS;
  console.log(`\n🔍 Huérfanos (${huerfanos.length}/${MAX_HUERFANOS}) — archivos de apps/web/app sin nodo que los liste en rutas-codigo${excede ? "" : " (dentro del ratchet)"}:`);
  for (const h of huerfanos.slice(0, 12)) console.log("  · " + h);
  if (huerfanos.length > 12) console.log(`  · …y ${huerfanos.length - 12} más`);
  if (excede) {
    errors.push(
      `huérfanos: ${huerfanos.length} > ratchet ${MAX_HUERFANOS} — el código nuevo debe declararse en la Capa 5 de su nodo (o bajar la deuda y ajustar MAX_HUERFANOS)`,
    );
  }
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} error(es) de binding (drift):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("\n✓ binding OK: sin drift (rutas-codigo y formato de componentes válidos).");
