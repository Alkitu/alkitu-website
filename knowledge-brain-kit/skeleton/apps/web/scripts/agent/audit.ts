/**
 * Audit de nodo — nivel 1 del plan "Docs Live" (docs/manual-live-docs-agent.md §2.5),
 * sin bus ni overlay. Responde: **¿el nodo dice la verdad sobre el código?**
 *
 * Reparto de trabajo explícito:
 *   - LA MÁQUINA (este script) verifica lo verificable y arma el DOSSIER acotado:
 *     números citados vs realidad, rutas y comandos citados que ya no existen,
 *     estado de los hot-paths de la Capa 5, resolución de `ds:*`, stats de `datos`.
 *   - EL AGENTE lee el dossier y emite el VEREDICTO semántico
 *     (`code-complies` | `code-diverges` | `criterion-ambiguous`) + plan + doneWhen.
 * El script NO escribe nada y NO adivina intenciones.
 *
 * Uso:  pnpm audit:node <nodo>      (alias: wiki, blog, landing, legal… o ruta al .md)
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import matter from "gray-matter";

const REPO = resolve(process.cwd(), "../..");
const arg = process.argv[2];
if (!arg) {
  console.error("uso: pnpm audit:node <nodo>   (p. ej. `pnpm audit:node wiki` o una ruta a Context/**/*.md)");
  process.exit(1);
}

// ── Resolver el nodo (alias corto o ruta) ──
function resolverNodo(a: string): string | null {
  if (a.endsWith(".md")) {
    const p = a.startsWith("/") ? a : join(REPO, a);
    return existsSync(p) ? p : null;
  }
  const ctx = join(REPO, "Context");
  const found: string[] = [];
  const walk = (d: string) => {
    for (const n of readdirSync(d)) {
      if (n === "graphify-out") continue;
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.es\.md$|^[A-ZÁÉÍÓÚ].*\.md$/.test(n)) found.push(p);
    }
  };
  walk(ctx);
  const na = a.toLowerCase();
  return (
    found.find((f) => f.toLowerCase().includes(`/${na}.es.md`)) ??
    found.find((f) => f.toLowerCase().includes(na)) ??
    null
  );
}

const nodo = resolverNodo(arg);
if (!nodo) {
  console.error(`nodo no encontrado: ${arg}`);
  process.exit(1);
}
const relNodo = nodo.replace(REPO + "/", "");
const rawNodo = readFileSync(nodo, "utf8");
const { data: fm, content: body } = matter(rawNodo);
const fmRaw = rawNodo.slice(0, rawNodo.indexOf("\n---", 3));
const textoCompleto = fmRaw + "\n" + body; // los comentarios de la Capa 5 también afirman cosas

const flag = (ok: boolean) => (ok ? "✓" : "⚠");
const out: string[] = [];
let alertas = 0;

out.push(`# AUDIT — ${fm.title ?? relNodo}`);
out.push(`nodo: ${relNodo}`);
out.push(`estado: ${fm.estado ?? "—"} · estado-implementacion: ${fm["estado-implementacion"] ?? "—"}\n`);

// ── 1) Afirmaciones numéricas: "N términos", "N widgets", "N casos"… vs realidad ──
out.push("## 1 · Afirmaciones numéricas del nodo vs realidad");
const numAfirm = [...textoCompleto.matchAll(/(\d{2,4})\s+(términos|terminos|widgets|casos|reviews|nodos|artículos|articulos|componentes)/gi)];
if (!numAfirm.length) out.push("  (ninguna afirmación numérica detectada)");
const reales: Record<string, number> = {};
const glosPath = join(REPO, "apps/web/content/wiki/glosario.json");
if (existsSync(glosPath)) reales["términos"] = JSON.parse(readFileSync(glosPath, "utf8")).total;
const cuentaArchivos = (dir: string, filtro: RegExp) =>
  existsSync(join(REPO, dir)) ? readdirSync(join(REPO, dir)).filter((f) => filtro.test(f)).length : -1;
reales["widgets"] = cuentaArchivos("apps/web/app/[lang]/wiki/_components/interactive", /^[^_].*\.tsx$/); // excluye primitivos _Stepper/_RevealGrid
reales["artículos"] = cuentaArchivos("apps/web/content/blog", /\.es\.mdx$/);
for (const m of numAfirm) {
  const [, n, sust] = m;
  const clave = sust.toLowerCase().replace("terminos", "términos").replace("articulos", "artículos");
  const real = reales[clave];
  if (real === undefined || real < 0) { out.push(`  · "${n} ${sust}" — sin verificador automático`); continue; }
  const ok = Number(n) === real;
  if (!ok) alertas++;
  out.push(`  ${flag(ok)} "${n} ${sust}" → real: ${real}`);
}

// ── 2) Hot-paths declarados (Capa 5) ──
out.push("\n## 2 · Hot-paths (Capa 5 · rutas-codigo)");
const rutas: string[] = (fm["rutas-codigo"] ?? []).filter((r: string) => r && !/^[#(]/.test(r) && !/pendiente/i.test(r));
for (const r of rutas) {
  const base = r.split("*")[0].replace(/\/$/, "");
  const p = join(REPO, base);
  if (!existsSync(p)) { alertas++; out.push(`  ⚠ NO EXISTE → ${r}`); continue; }
  const st = statSync(p);
  const info = st.isDirectory()
    ? `${readdirSync(p).length} entradas`
    : `${readFileSync(p, "utf8").split("\n").length} líneas`;
  out.push(`  ✓ ${base} (${info})`);
}
if (!rutas.length) out.push("  (sin rutas-codigo declaradas)");

// ── 3) Rutas y carpetas citadas EN PROSA que ya no existen ──
out.push("\n## 3 · Rutas citadas en el texto");
const citadas = new Set<string>();
for (const m of textoCompleto.matchAll(/`([A-Za-z0-9_@./[\]-]+\/[A-Za-z0-9_@./[\]{},-]*)`/g)) citadas.add(m[1]);
let citadasChecked = 0;
for (const c of citadas) {
  const limpio = c.replace(/\{[^}]*\}/, "").replace(/\/$/, "");
  if (!/^(apps|scripts|Context|design-system|design-system|content|lib)\//.test(limpio)) continue;
  citadasChecked++;
  // una ruta citada puede ser relativa a la raíz o a apps/web (los nodos usan ambas)
  const existeEnAlguna = (r: string) => existsSync(join(REPO, r)) || existsSync(join(REPO, "apps/web", r));
  const ok = existeEnAlguna(limpio);
  if (!ok) alertas++;
  // expandir llaves tipo {metodo,niza}: comprobar cada rama
  const braces = c.match(/\{([^}]*)\}/);
  if (braces && ok === false) {
    const ramas = braces[1].split(",").map((s) => s.trim());
    const prefix = c.slice(0, c.indexOf("{"));
    const faltan = ramas.filter((r) => !existeEnAlguna(prefix + r));
    out.push(`  ⚠ ${c} → ramas inexistentes: ${faltan.join(", ") || "(todas existen; ruta con llaves)"}`);
    // ¿hay hermanas no citadas?
    const padre = [join(REPO, prefix), join(REPO, "apps/web", prefix)].find((d) => existsSync(d)) ?? "";
    if (padre && existsSync(padre)) {
      const hermanas = readdirSync(padre).filter((n) => statSync(join(padre, n)).isDirectory() && !ramas.includes(n));
      if (hermanas.length) out.push(`      ↳ carpetas hermanas NO citadas: ${hermanas.join(", ")}`);
    }
    continue;
  }
  out.push(`  ${flag(ok)} ${c}`);
}
if (!citadasChecked) out.push("  (ninguna ruta citada en el texto)");

// ── 4) Componentes del DS ──
out.push("\n## 4 · Componentes (ds:)");
const comps: string[] = (fm.componentes ?? []).filter((c: string) => c?.startsWith("ds:"));
for (const c of comps) {
  const m = c.match(/^ds:([a-z-]+)\/([A-Za-z0-9-]+)/);
  const ok = !!m && existsSync(join(REPO, "design-system/web/components", m[1], m[2]));
  if (!ok) alertas++;
  out.push(`  ${flag(ok)} ${c}`);
}
if (!comps.length) out.push("  (sin componentes declarados)");

// ── 5) Comandos citados ──
out.push("\n## 5 · Comandos citados (pnpm)");
const pkgRaiz = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8"));
const pkgWeb = JSON.parse(readFileSync(join(REPO, "apps/web/package.json"), "utf8"));
const cmds = new Set([...textoCompleto.matchAll(/pnpm ([a-z][a-z:-]+)/g)].map((m) => m[1]));
for (const c of cmds) {
  const ok = !!pkgRaiz.scripts?.[c] || !!pkgWeb.scripts?.[c] || ["install", "dev", "add"].includes(c);
  if (!ok) alertas++;
  out.push(`  ${flag(ok)} pnpm ${c}`);
}
if (!cmds.size) out.push("  (ninguno)");

// ── 6) Par bilingüe ──
const par = nodo.replace(/\.es\.md$/, ".en.md");
if (nodo.endsWith(".es.md")) {
  const ok = existsSync(par);
  if (!ok) alertas++;
  out.push(`\n## 6 · Par bilingüe\n  ${flag(ok)} ${par.replace(REPO + "/", "")}`);
}

// ── 7) Git: ¿el código cambió después del nodo? (señal de doc rezagada) ──
out.push("\n## 7 · Frescura (git)");
try {
  const fechaNodo = execSync(`git log -1 --format=%ct -- "${relNodo}"`, { cwd: REPO }).toString().trim();
  for (const r of rutas.slice(0, 8)) {
    const base = r.split("*")[0].replace(/\/$/, "");
    const f = execSync(`git log -1 --format=%ct -- "${base}"`, { cwd: REPO }).toString().trim();
    if (fechaNodo && f && Number(f) > Number(fechaNodo)) {
      alertas++;
      const dias = Math.round((Number(f) - Number(fechaNodo)) / 86400);
      out.push(`  ⚠ ${base} cambió ${dias}d DESPUÉS que el nodo`);
    }
  }
  if (!out[out.length - 1].startsWith("  ⚠")) out.push("  ✓ el nodo es igual o más reciente que su código");
} catch {
  out.push("  (sin git)");
}

out.push(`\n---\n**${alertas} señal(es) de posible drift.** El veredicto semántico`);
out.push(`(code-complies | code-diverges | criterion-ambiguous) + plan + doneWhen lo emite`);
out.push(`el AGENTE leyendo este dossier y los hot-paths de arriba — la máquina no juzga intención.`);

console.log(out.join("\n"));
