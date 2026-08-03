---
title: Landing (EN)
aliases: [Home, Start]
tipo: page
nivel: hipónimo
dominio: [Landing]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [home, hero, value proposition]
relacionado:
  - "[[Landing.es]]"

titulo: "[Concept] · [Concept tagline]"
metadescripcion: "[Short description of the concept and what this site offers. 120–155 characters.]"
slug: /en/
keyword-principal: "concept"
keywords-secundarias: [secondary keyword 1, secondary keyword 2]
tags: [concept]
intencion-busqueda: navegacional
og-image: ""                         # inherits the branded OG generator (app/opengraph-image.tsx); no own openGraph.images
dominio-raiz: tuconcepto.com
subdominio: ""
query-params: []
canonical: https://tuconcepto.com/en/

# ── Capa 3: GEO ──
geo-preguntas:
  - "what is [concept]?"
  - "what is this site about?"
geo-respuesta-corta: "[Extractable answer in 1-3 sentences: what [concept] is and what this site offers.]"
geo-entidades: ["[Concept]", "[Related entity]"]
geo-datos-citables: []
geo-formato: [lista]
schema-tipo: WebSite

# ── Capa 4: Sitemap técnico ──
prioridad: 1.0
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /
# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/page.tsx"
  - "apps/web/app/[lang]/_components/CasosStack.tsx"          # stacked cases (sticky-stack CSS)
  - "apps/web/lib/home/config.ts"                             # order of cases on the homepage
  - "apps/web/lib/i18n/route-map.json"
componentes: []
datos:
  - "home_config — order/selection of cases on the homepage"
fuentes:
  - "the concept's ingest source (logo/branding)"
depende-de: []

estado: borrador
creado: 2026-06-21
actualizado: 2026-07-06
---

# Landing (EN) — `/en/`

> [!definition] Purpose
> English counterpart of [[Landing.es]]. Same structure and intent, tuned for the international audience. Keyword: **concept**.

## Page sections
Mirror of the ES version (Hero · What it is · Featured content · Writing · Contact). Copy to be adapted, not literally translated, to keep idiomatic SEO.

## SEO notes
- `hreflang` pair with [[Landing.es]] (`/` ↔ `/en/`).
- Keyword **concept** in H1 + first paragraph.
