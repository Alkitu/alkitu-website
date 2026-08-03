# knowledge-brain-kit

Starter reutilizable para construir un **cerebro de conocimiento** (web + grafo + SEO/GEO) sobre **cualquier concepto**. Es la abstracción del motor detrás de `leonelkrea.com`, separado de su contenido personal.

> Un "cerebro" = web bilingüe donde una taxonomía de nodos (términos, artículos, casos) se especifica primero en texto (`Context/`, blueprint vivo), se ensambla con un design system, y se optimiza para que la citen buscadores (SEO) y LLMs (GEO).

## Idea núcleo: motor ≠ contenido

`leonelkrea.com` no es una web de contenido fijo: es un **motor genérico de agrupar información** con un contenido concreto encima (diseño de producto, marca personal de Leonel). Este kit extrae el motor y tira el contenido.

| | Motor (se queda, reusable) | Contenido (se reemplaza por concepto) |
|---|---|---|
| Qué | Frontmatter 5 capas · grafo `graphify` · monorepo 3 capas · SEO/GEO infra · i18n · secciones-plantilla | Nodos concretos · fuente de ingesta · brand tokens · secciones activas |
| Ejemplo | tipos `page/collection/glossary-term/article/legal` | 419 términos de diseño → N términos legales |

## Para qué sirve

Mañana quieres una web-cerebro de **conceptos legales** (o médicos, o financieros): forkeas este kit, defines la taxonomía raíz del concepto, conectas una fuente de ingesta, y el motor ensambla la web solo.

## Docs de este kit

1. **`README.md`** (esto) — qué es y la filosofía motor/contenido.
2. **`EXTRACTION-MAP.md`** — mapa exacto path-por-path del repo `leonelkrea.com`: qué se **COPIA** (motor), qué se **BORRA** (contenido personal), qué se **ADAPTA** (parametrizar por marca/concepto).
3. **`SETUP.md`** — receta paso a paso para arrancar un cerebro nuevo desde el kit.

## Fuente

Repo origen: `/Volumes/ARC_Reactor/Code_Projects_SSD/LeonelKre@/leonelkrea.com`
Stack fijado por el DS: Next 16 · React 19 · Tailwind v4 · shadcn/Radix · pnpm monorepo.

## Estado

🟢 **Fase 3 completa — blank real.** `skeleton/` de-contaminado al 100%: `grep` de `leonel|krea|alkitu|burdeos|product design|juegos` = 0 (solo "Spec-Driven Development" = metodología del sistema). Motor + instrucciones agnósticas + plantillas vacías. Paquetes `@brain/*`, dir `design-system/`, marca PLACEHOLDER. **Verificado:** `pnpm build` ✅, `pnpm validate:context` ✅ y `pnpm preflight` ✅. Incluye el sistema operativo del agente (preflight · audit:node · radar · interlink · /experto · builder auto-vigilado · ratchet). Detalle en `STATUS.md`.
