---
# ── Capa 1: Identidad semántica ──
title: Blog
aliases: [Artículos, Escritura, Notas]
tipo: collection
nivel: hiperónimo
dominio: [Blog]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [blog, artículos, ensayos, contenido, buscador, grid]
relacionado:
  - "[[Blog-Entrada.es]]"
  - "[[Wiki.es]]"
  - "[[Casos.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "Blog de [Concepto]"
metadescripcion: "Ensayos y artículos sobre [concepto]. Ideas, guías y análisis para entender [concepto] en profundidad."
keyword-principal: "blog de [concepto]"
keywords-secundarias: ["artículos de [concepto]", "ensayos de [concepto]", "guías de [concepto]"]
tags: [blog, ensayos, "[concepto]"]
intencion-busqueda: informacional
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /blog
query-params: [q, categoria, tag]    # q = búsqueda; categoria/tag = filtros de taxonomía
canonical: https://tuconcepto.com/blog

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué es [término del concepto]?"
  - "¿dónde leer artículos sobre [concepto]?"
geo-respuesta-corta: "Blog de [Concepto] con ensayos y artículos sobre [concepto]: guías, análisis e ideas para entenderlo en profundidad."
geo-entidades: ["[Concepto]", "[Entidad relacionada]"]
geo-datos-citables: []
geo-formato: [lista, faq]
schema-tipo: Blog

# ── Capa 4: Sitemap técnico ──
prioridad: 0.9
frecuencia-cambio: weekly
idiomas: [es, en]
hreflang-alt: /en/blog

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/blog/page.tsx"                          # Server Component: deriva del frontmatter + metadata
  - "apps/web/app/[lang]/blog/_components/BlogListado.tsx"       # island cliente: búsqueda + filtro + paginación
  - "apps/web/app/[lang]/blog/[slug]/page.tsx"                   # detalle MDX (dynamicParams=false) + JSON-LD Article + relacionados
  - "apps/web/app/[lang]/blog/_components/mdx-components.tsx"    # componentes MDX (Lead, Callout, FAQ/FAQPage)
  - "apps/web/app/blog/rss.xml/route.ts"                  # feed RSS del blog
  - "apps/web/lib/content/blog.ts"                        # capa de contenido (fuente única)
componentes:                        # binding al DS (verificado por scripts/validate-context.mjs)
  - "ds:patterns/page-hero"         # cabecera de sección
  - "ds:patterns/filter-chips"      # chips de filtro por categoría
  - "ds:compositions/paginacion"    # paginación
  - "ds:compositions/command"       # buscador (⌘K) de artículos
  - "ds:primitives/input"           # campo de búsqueda inline (fallback simple)
  - "ds:primitives/card"            # tarjeta de artículo en el grid
  - "ds:patterns/category-card"     # variante de tarjeta destacada/categoría
  - "ds:primitives/badge"           # chips de categoría/tag
  - "ds:patterns/filter-select"     # filtros por categoría/tag
  - "ds:primitives/tailwind-grid"   # rejilla responsiva de tarjetas
  - "ds:primitives/typography"      # títulos/extractos (lectura cómoda)
  - "ds:primitives/pagination"      # paginación (o infinite-scroll, ver Pendiente)
  - "ds:primitives/infinite-scroll" # alternativa a paginación
datos:
  - "content/blog/**  (planeado: 1 archivo MDX por artículo, content collection)"
fuentes:
  - "la fuente de ingesta del concepto (semilla de artículos)"
depende-de:
  - "[[Blog-Entrada.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-21
---

# Blog: `/blog`

> [!definition] Propósito
> Donde se construye **autoridad** y se atrae a la comunidad en torno a [concepto]. La página = **buscador + entradas en grid**, con apariencia de **lectura cómoda** (tipografía cómoda, aire, tarjetas limpias). Conecta con la wiki (define) y los casos (demuestra). Pieza central de la estrategia de contenido.

## Línea editorial: todo artículo parte de un problema

> [!important] Regla #1 del blog
> **Ningún artículo se publica si no parte de un problema real del lector.** El título responde a un problema (no a una metáfora ni a un nombre interno) y cada sección se justifica como un paso para resolverlo. Si no puedes formular en una frase el problema que ataca, el artículo todavía no está listo.

- **Título = problema, no etiqueta.**
- **Slug corto, con la keyword del problema o del término**: nunca narrativo.
- **Estructura problema → idea → cómo → en la práctica.** Abre nombrando el dolor; el primer párrafo es la `geo-respuesta-corta` (citabilidad GEO).
- **Los términos de la wiki se auto-enlazan** (no a mano): el render MDX enlaza la 1ª mención de cada término a `/wiki/<slug>` vía el plugin remark `apps/web/lib/glosario.tsx` (ver [[Blog-Entrada.es]]).

## Secciones (orden de la página)

1. **Cabecera del blog**: título, una frase de propósito y el **buscador** (`q`).
2. **Filtros**: chips/selector por **categoría** y **tag** (`categoria`, `tag`). Reflejan la taxonomía (pendiente de cerrar).
3. **Grid de entradas**: rejilla responsiva de tarjetas de artículo. Mobile: 1 columna; tablet: 2; desktop: 2-3.
4. **Carga de más**: paginación o scroll infinito (ver Pendiente).

## Componentes

- **Buscador** → `ds:compositions/command` (overlay ⌘K) con `ds:primitives/input` como fallback inline. Parámetro `q`.
- **Filtros** → `ds:patterns/filter-select` + `ds:primitives/badge` (chips de categoría/tag). Parámetros `categoria`, `tag`.
- **Grid** → `ds:primitives/tailwind-grid` con `ds:primitives/card` (y `ds:patterns/category-card` para destacados). Tipografía de tarjeta con `ds:primitives/typography`.
- **Tarjeta de artículo** → composición sobre `card`: portada, título, extracto, fecha, tiempo de lectura, categoría.
- **Paginación** → `ds:primitives/pagination` **o** `ds:primitives/infinite-scroll` (decisión en Pendiente).

## Arquitectura de la sección

- **Índice** (esta página): buscador + filtros + grid.
- **Categorías**: definir la taxonomía de categorías del concepto (ver Pendiente).
- **Artículo** → plantilla [[Blog-Entrada.es]] (`tipo: article`), URL `/blog/<slug>`.

## Notas SEO + GEO

- **SEO**: cada artículo ataca un cluster de keywords; el enlazado a términos de la [[Wiki.es|wiki]] es **automático** (auto-enlazado en el render MDX → topical authority sin trabajo manual). Las URLs con `q`/`categoria`/`tag` **no son canónicas**: `canonical` apunta siempre a `/blog` limpio.
- **GEO**: `schema-tipo: Blog` en el índice; cada entrada lleva `Article`. La cabecera abre con la `geo-respuesta-corta` para citabilidad. Además, cada artículo declara en frontmatter `geo-preguntas` + `geo-respuestas` que `blog/[slug]/page.tsx` emite como **`FAQPage` (JSON-LD)**. Bilingüe: mismos campos en `.en.mdx`.

## Pendiente / Bloqueos

- **¿Taxonomía de categorías** definitiva del concepto? ¿Hay también un sistema de **tags** libre además de las categorías?
- **¿Paginación o scroll infinito?** (afecta SEO de URLs paginadas y el componente del DS que se usa).
- **¿Qué campos lleva la tarjeta** del grid? (portada/imagen, título, extracto, fecha, tiempo de lectura, categoría, autor).
- **¿El buscador es client-side** (sobre el índice estático) o necesita backend/índice?
- **¿Orden por defecto** del grid? (más reciente primero, ¿hay destacados/pinned?).
