# STATUS — estado del skeleton

## Fase 4 — Web agéntica (PRD-web-agentica) · E1+E2 ✅

- **E1 Fundación eve:** paquete `eve` (Vercel, v0.27.x) instalado en `@brain/web`; `agent/{instructions.md,agent.ts}`; `next.config.mjs` con `withEve` (sesiones `/eve/v1/*`). Build verde con el wiring.
- **E2 Tools de lectura:** 6 tools (`query_glosario`, `get_termino`, `query_graph`, `get_node`, `search_content`, `list_secciones`) como wrappers finos sobre funciones puras en `lib/agent/` (NFR-4 portabilidad). **Tests 7/7 verdes** contra los assets reales del stub.
- **Bugs arreglados de paso:** YAML roto en 13 nodos Context (placeholders `[concepto]` sin quotear en arrays flow — herencia del agente de fase 3; ahora todo el frontmatter parsea); binario esbuild 0.28.1 sin build en pnpm (symlink manual — un `pnpm install` limpio en un fork lo resuelve solo).
- **E3 Canal web:** `ds:patterns/chat-widget` (presentacional puro, compone `chat-input`, tokens del DS, ARIA) + contenedor `apps/web/app/_components/AgentChat.tsx` (`useEveAgent` de `eve/react` → proyección parts→texto) montado global en `app/[lang]/layout.tsx`. Bilingüe. Build verde.
- **No probado aún:** conversación en vivo con modelo (necesita auth AI Gateway: OIDC en Vercel automático, API key en local). El wiring completo (widget → hook → `/eve/v1/*` → agente → tools) está; falta solo la credencial.
- **Pendiente PRD:** E4 instalación en leonelkrea.com (eval datos reales) · E5 escritura validada · E6 docs finales + nodo `Agente` en Context.

## Fase 3 — blank real (de-contaminación) · ✅ COMPLETA

Objetivo cumplido: cero contaminación de `leonelkrea.com` (product design / Leonel /
juegos / marca). Solo motor + instrucciones + plantillas vacías. Sirve para cualquier concepto.

**Verificación final:** `grep -riE "leonel|krea|alkitu|burdeos|product design|impostor|geocaching|copiloto|lobo|club promaker|differos"` sobre todo el skeleton (excl. node_modules) = **0 hits**. Único match relacionado que se conserva a propósito: **"Spec-Driven Development"** (metodología del sistema, no una marca). Dominio viejo `leonelkrea.com` = 0.

### De-marca (estructura + código)
- Scopes de paquete `@leonelkrea` + `@alkitu` → **`@brain`** (todo, incl. `ci.yml`). Root `knowledge-brain-monorepo`.
- **Directorio DS renombrado** `leonelkrea-ds/` → **`design-system/`** (+ `pnpm-workspace.yaml`, `tsconfig`, `globals.css @source`, `scripts/{validate-context,graph,build-graph}`, CLAUDE, refs Capa 5 de Context).
- **Marca** burdeos `#85283F` → ramp PLACEHOLDER azul; vars `--brand-primary*`; brand folder `brands/default`; `#AD1DEA` fuera; tokens/README/dark.css genéricos.

### Instrucciones (el "auto-organizar") reescritas agnósticas
- `CLAUDE.md` — reglas del cerebro genérico + sección "Cómo la web sabe auto-organizar su conocimiento".
- `Context/00-Index/📐 Contrato.md` y `🏠 Índice.md` — posicionamiento, dominios, entidades, fuentes, árbol → genéricos; dominio `tuconcepto.com`.

### Contenido purgado / neutralizado
- **Context** (agente): ~20 nodos de sección + templates + Bitácora + Connections + Estrategia → placeholders `[Concepto]`, frontmatter 5 capas intacto. Bitácora vaciada. `03-Wiki/{branding,marketing,metodo,niza}` (60+ términos) borrados.
- **apps/web** (agente + yo): casos/reviews/blog → 1 plantilla genérica c/u; borradas herramientas de naming (FichaDeNombre, differos, flows), 16 componentes wiki interactivos muertos, CiudadQR3D; Mongo `db("knowledge_brain")`; legal/contacto/layouts/auth/SEO(jsonld,sitemap,robots,llms,rss,og)/globals/analytics → genéricos; tests actualizados; e2e qr-city borrado.
- **DS** (yo): borrados `showcase/{copiloto,experiments/qr-city}` (+ barrel + exports package.json + paleta `--lk-qr-*`); swap Leonel/Alkitu→genérico en stories/emails/comments.
- **Home**: copy genérico; borrados componentes home product-specific.
- **Scripts personales** borrados: `casos-portada/`, `generate-cv.mjs`. **check-tokens/check-links** allowlists depuradas.
- **`.claude/skills` + `.github/skills`** (bundle vendored bmad/gds/wds — tooling redundante y contaminado) borrados. `.claude/prompt-templates.md` conservado (limpio).

### Fixes de integridad (build en plano de módulos)
- `middleware.ts` importaba `@/lib/copiloto/session` (borrado) → recuperada como **`lib/session.ts`** genérica (cookie `kb_sid`, `SESSION_SECRET`); import corregido.
- `admin-nav` sin links a rutas borradas (copiloto/geocaching); iconos sin uso quitados.
- `next.config.mjs` sin bloque `/037`; comentarios neutralizados.
- **0 imports colgantes** a libs/componentes borrados (verificado).

## ✅ Verificación de build (hecha)
- `pnpm install` → OK.
- `pnpm build` → **verde** (TypeScript pasa, todas las rutas generadas: landing/blog/wiki/casos/reviews/legal bilingües con slugs plantilla, admin+api, sitemap/robots/llms.txt/og).
- `pnpm validate:context` → **verde** (25 nodos, 81 rutas-código, 71 componentes `ds:` resuelven; 0 drift).

### Fixes para llegar a verde
- **`@types/geojson`** añadido a `design-system/web` **y** `apps/web` (lo aportaba el lockfile del origen, que se excluyó). El componente `maps` se conserva: `admin/analiticas` usa `AnalyticsMap`.
- **`lib/mongodb.ts`** → **lazy**: antes conectaba/lanzaba al importar (rompía la recolección de page-data sin `MONGODB_URI`); ahora la conexión/throw solo ocurre al `await` (thenable). El build no necesita DB; runtime degrada con try/catch.
- **Context bindings**: `estado-implementacion: planeado → construido` en 21 nodos (su código-motor existe); paths corregidos (`About` `sobre/`→`sobre-mi/`, `Login` `lib/db.ts`→`lib/mongodb.ts`).

## Pendiente (por diseño — trabajo del 1er instanciado, no bloqueante)
- `public/` vacío → refs `/hero/*`, `/og/*` dan 404 runtime hasta poner assets (no rompe build).
- Rellenar copy placeholder, definir taxonomía raíz + fuente de ingesta del concepto (ver `SETUP.md`).
- Runtime real (admin/analytics/auth) necesita `MONGODB_URI` + `AUTH_SECRET` (build no).
- Snapshots de parity apuntan a rutas viejas → primer run con `--update-snapshots`.

## Sin tocar
- Repo origen `leonelkrea.com`: intacto, read-only (git limpio).

## Fase 5 — Sistema operativo del agente portado desde la instancia de referencia (2026-07-26)

El kit se sincronizó con las herramientas maduradas en la instancia de referencia
(leonelkrea.com). Portado y **des-marcado** (`design-system/`, `@brain/web`, `[Concepto]`):

- **`pnpm preflight`** — foto del terreno antes de trabajar.
- **`pnpm audit:node <nodo>`** — cobertura semántica (¿el nodo dice la verdad?).
- **`pnpm radar` / `pnpm interlink`** — gaps del glosario + interlinking del blog.
- **`validate:context` con ratchet de huérfanos** (`MAX_HUERFANOS = 18`, baseline del
  kit; baja al instanciar y asignar los huérfanos a nodos).
- **`build-glosario.py` auto-vigilado** — denuncia sombras de slug, aborta ante
  pérdida de EN, lista desapariciones. FUENTES agnósticas (cada subcarpeta de
  `Context/03-Wiki` = un dominio) + guarda: sin fuentes NO sobrescribe el stub.
- **skill `/experto`** — protocolo del agente (grounding + contrato + gates), genérico.
- **nodo `Context/99-Meta/Arquitectura de agentes.md`** — mapa de cerebros genérico
  + 7 agujeros heredados a revisar al instanciar.
- `tsx` añadido a devDependencies de `apps/web` (lo usan los scripts).

**Verificado:** `pnpm preflight` verde en el kit (validate ✓, tests lib/agent 7/7,
glosario stub intacto). Contaminación de marca en lo portado: **0**.

**Deuda declarada (agujero #6):** kit y la instancia de referencia comparten estas
herramientas por copia, no por dependencia — cada mejora futura se sincroniza a mano.
