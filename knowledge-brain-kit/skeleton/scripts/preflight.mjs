#!/usr/bin/env node
/**
 * Preflight — foto del terreno ANTES de trabajar (protocolo /experto).
 * Corre las comprobaciones baratas y pinta el estado del sistema para que el
 * agente (o tú) sepa dónde pisa: binding Context↔código, tests de la capa
 * de conocimiento, frescura del grafo y deuda conocida. Uso: `pnpm preflight`.
 * No escribe nada. Sale 1 si algo duro falla (validate o tests).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, cwd = ROOT) => execSync(cmd, { cwd, stdio: "pipe" }).toString();
let fallo = false;

console.log("🛫 Preflight — estado del sistema\n");

// 1) Binding Context ↔ código (duro)
try {
  const out = run("node scripts/validate-context.mjs");
  console.log("✅ validate:context — " + (out.match(/Context: .*/)?.[0] ?? "OK"));
  const h = out.match(/Huérfanos \((\d+)\/(\d+)\)/);
  if (h) console.log(`   huérfanos de Capa 5: ${h[1]}/${h[2]} (ratchet)`);
} catch (e) {
  console.log("❌ validate:context FALLÓ:\n" + String(e.stdout || e.message).slice(-500));
  fallo = true;
}

// 2) Capa de conocimiento del agente (duro)
try {
  const out = run("npx vitest run lib/agent/agent.test.ts --reporter=dot 2>&1", join(ROOT, "apps/web"));
  console.log("✅ tests lib/agent — " + (out.match(/Tests {2}.*/)?.[0]?.trim() ?? "OK"));
} catch (e) {
  console.log("❌ tests lib/agent FALLARON:\n" + String(e.stdout || e.message).slice(-400));
  fallo = true;
}

// 3) Glosario: tamaño + cobertura EN (informativo)
const glos = JSON.parse(readFileSync(join(ROOT, "apps/web/content/wiki/glosario.json"), "utf8"));
const conEn = glos.terminos.filter((t) => t.definicionEn).length;
console.log(`📖 glosario: ${glos.total} términos · EN ${conEn}/${glos.total}${conEn < glos.total ? " ⚠" : ""}`);

// 4) Frescura del grafo Context (informativo — agujero #1)
const gPath = join(ROOT, "Context/graphify-out/graph.json");
if (existsSync(gPath)) {
  const g = JSON.parse(readFileSync(gPath, "utf8"));
  const termNodes = g.nodes.filter((n) => String(n.source_file ?? "").includes("03-Wiki")).length;
  const ctxTerms = Number(run(`find Context/03-Wiki -name '*.md' | wc -l`).trim());
  const stale = termNodes < ctxTerms - 3; // margen: plantillas/índices
  console.log(
    `🕸  grafo Context: ${g.nodes.length} nodos · ${termNodes} de 03-Wiki vs ${ctxTerms} notas${stale ? " ⚠ DESFASADO (extracción pendiente del agente)" : ""}`,
  );
} else {
  console.log("🕸  grafo Context: NO GENERADO ⚠");
}

// 5) Componentes DS potencialmente muertos (informativo — agujero #5)
import("node:fs").then(() => {}); // (import estático arriba ya disponible)
{
  const { readdirSync } = await import("node:fs");
  const muertos = [];
  for (const capa of ["patterns", "compositions"]) {
    const base = join(ROOT, "design-system/web/components", capa);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)) {
      let usado = "";
      try {
        usado = run(
          `grep -rl -m1 --include='*.ts' --include='*.tsx' -e '/${name}"' -e "/${name}'" apps/web/app apps/web/lib design-system/web/app design-system/web/index.ts 2>/dev/null | head -1 || true`,
        ).trim();
      } catch {
        /* grep sin matches */
      }
      if (!usado) muertos.push(`${capa}/${name}`);
    }
  }
  if (muertos.length) console.log(`🧩 componentes DS sin import detectado (${muertos.length}): ${muertos.join(", ")} ⚠ (revisar antes de crear algo parecido)`);
  else console.log("🧩 componentes DS: todos con import detectado");
}

console.log(fallo ? "\n🛑 Preflight con fallos duros — no trabajes sobre terreno roto." : "\n🟢 Terreno listo.");
process.exit(fallo ? 1 : 0);
