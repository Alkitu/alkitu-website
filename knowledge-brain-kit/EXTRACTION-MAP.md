# EXTRACTION-MAP

Mapa path-por-path del repo `leonelkrea.com` para armar el kit. Tres verbos:

- **COPY** → motor genérico, va al kit tal cual.
- **ADAPT** → va al kit pero vaciando/parametrizando (marca, concepto, valores).
- **STRIP** → contenido personal de Leonel, NO va al kit.

Basado en la estructura real del repo (inspeccionada, no supuesta).

---

## Raíz del monorepo

| Path | Verbo | Nota |
|---|:--:|---|
| `package.json` (scripts: dev/build/typecheck/lint/test/validate:context/graph/glosario:build/check:*) | ADAPT | conserva scripts; cambia `--filter @leonelkrea/*` por nombre del nuevo paquete |
| `pnpm-workspace.yaml` | COPY | packages: `apps/*`, `leonelkrea-ds/web`, `leonelkrea-ds/tokens` — genérico |
| `pnpm-lock.yaml` | COPY | regenera con `pnpm install` |
| `CLAUDE.md` | ADAPT | reglas de Context/hot-paths/gate = genéricas; posicionamiento "Leonel Krea" = parametrizar |
| `.gitignore` · `.github/` | COPY | CI del build/gate reusable |
| `scripts/validate-context.mjs` | COPY | valida frontmatter + `ds:*` + `rutas-codigo` — agnóstico |
| `scripts/graph.sh` · `build-graph.py` | COPY | grafo de las 3 capas — agnóstico |
| `scripts/check-tokens.mjs` · `check-links.mjs` · `gate.sh` | COPY | tooling de calidad |
| `scripts/build-glosario.py` | ADAPT | pipeline de ingesta — la **lógica** sirve; el **origen** (Second-Brain vault) se reemplaza |
| `scripts/naming/` · `copy_asset.py` · `crop_border.py` · `remove_bg.py` | STRIP | utilidades puntuales de Leonel |
| `AGENTS.md` · `DESIGN.md` · `PLAYBOOK.md` · `PRODUCT.md` · `log.md` | STRIP | docs de producto personales (reescribir por concepto) |
| `_bmad/` · `_bmad-output/` · `.impeccable/` · `docs/` · `design-artifacts/` · `.agents/` | STRIP | tooling/salidas de trabajo, no motor |
| `graphify-out/` (raíz) | STRIP | salida generada; se regenera |

---

## `Context/` (blueprint) — el corazón del motor

| Path | Verbo | Nota |
|---|:--:|---|
| `Context/00-Index/📐 Context — Contrato.md` | ADAPT | contrato de 5 capas + SEO/GEO = motor puro; ejemplos de dominio (Glosario/Casos…) = parametrizar |
| `Context/00-Index/🏠 Context — Índice.md` | ADAPT | plantilla de índice; vaciar el árbol concreto, dejar estructura |
| `Context/00-Index/🔌 Connections.md` | COPY | doc de fuentes vivas vs ingeridas — genérico |
| `Context/01-Landing` … `08-Contacto` | ADAPT | conservar 1 **nodo-plantilla** por tipo (`page`, `collection`, `glossary-term`, `article`, `case-study`); borrar los nodos con contenido real |
| `Context/06-Laboratorio` (juegos Lobo/Impostor/Rol/Geocaching) | STRIP | 100% personal de Leonel |
| `Context/09-Admin` | ADAPT | login/estadísticas = patrón reusable; contenido específico fuera |
| `Context/99-Meta/Bitácora de decisiones.md` | ADAPT | vaciar decisiones; dejar la plantilla de entrada |
| `Context/graphify-out/` | STRIP | regenerar con `pnpm graph` |

> **Nodos-plantilla a conservar** (ya existen como `*-Entrada`/`*-Termino` en el repo): `Wiki-Termino.es`, `Blog-Entrada.es`, `Review-Entrada.es`, `Caso-Entrada.es`. Son los moldes vacíos con las 5 capas.

---

## `leonelkrea-ds/` (design system) — motor visual

| Path | Verbo | Nota |
|---|:--:|---|
| `leonelkrea-ds/web/` (`@alkitu/design-system-web`: components, hooks, lib, app, storybook) | COPY | atomic design agnóstico al tema |
| `leonelkrea-ds/tokens/` (`@alkitu/design-tokens`) | ADAPT | estructura de tokens = motor; **valor brand** (burdeos `#85283F`) = reemplazar por marca del concepto |
| `leonelkrea-ds/web/emails/` · `remotion/` | COPY | plantillas reusables (email, vídeo) |
| `leonelkrea-ds/documentation/` | ADAPT | conservar estructura, revisar copy |
| `leonelkrea-ds/Nivel I.svg` | STRIP | asset de marca Leonel |
| `.mcp.json` · `skills/` · `.claude/` | COPY | tooling agnóstico |

---

## `apps/web/` (la web Next) — ensamblador

| Path | Verbo | Nota |
|---|:--:|---|
| `app/[lang]/` (routing bilingüe) | COPY | patrón i18n genérico |
| `app/sitemap.ts` · `robots.ts` · `opengraph-image.tsx` · `llms.txt/` · `global-error.tsx` | COPY | infra SEO/GEO agnóstica |
| `app/[lang]/{wiki,blog,reviews,casos-de-estudio,sobre-mi,contacto}/` | ADAPT | **estructura de ruta** reusable; el contenido leído de data/content = vaciar |
| `app/[lang]/laboratorio/` · `app/037` · `app/p` | STRIP | juegos y experimentos personales |
| `app/(private)/admin/` | ADAPT | patrón panel + auth; datos concretos fuera |
| `lib/i18n/` (config, route-map.json, dictionaries) | COPY | motor i18n; vaciar el mapa de slugs concretos |
| `lib/seo/` | COPY | helpers SEO/GEO |
| `lib/content/` · `lib/glosario.tsx` | ADAPT | **loaders** genéricos; apuntan a content nuevo |
| `lib/mongodb.ts` · `auth.ts` | COPY | infra auth/DB (parametrizar conexión) |
| `lib/{copiloto,cv,geocaching,rol,home,analytics}/` | STRIP | features específicas de Leonel |
| `content/wiki/glosario.json` · `content/blog/*.mdx` | STRIP | contenido real (regenerar por concepto) |
| `middleware.ts` · `next.config.mjs` · `postcss.config.mjs` · `tsconfig.json` · configs de test (`vitest`, `playwright`) | COPY | infra build/test |
| `.env.example` | COPY | plantilla de env |
| `.env.local` · `.next/` · `test-results/` · `node_modules/` · `undefined` | STRIP | locales/generados |
| `public/` | ADAPT | quitar assets de marca Leonel; dejar estructura |

---

## Lo único no-trivial (atención en fase 2)

1. **Pipeline de ingesta** — `build-glosario.py` lee la vault Obsidian `Second-Brain/` de Leonel y proyecta a `glosario.json`. El **destino** (JSON + schema) es reusable; el **origen** hay que reescribirlo por cada concepto (nueva vault/DB/API legal). Es un adaptador, no el motor.
2. **Acoplamientos personales dispersos** — logo león 3D (`web-leonelkrea/`), dossier About, features `copiloto/cv/rol`. Están listados como STRIP arriba; revisar que ninguna infra COPY los importe de forma dura antes de arrancar el build.
