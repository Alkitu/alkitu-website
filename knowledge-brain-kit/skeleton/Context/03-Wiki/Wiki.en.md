---
title: Glossary (EN)
aliases: [Glossary, Dictionary, Terms]
tipo: collection
nivel: hiperónimo
dominio: [Glosario]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [glossary, definitions, terms]
relacionado:
  - "[[Wiki.es]]"

titulo: "[Concept] Glossary"
metadescripcion: "An open glossary with hundreds of connected [concept] terms — defined and cross-linked. Learn and reference for free."
slug: /en/glossary
keyword-principal: "[concept] glossary"
keywords-secundarias: ["[concept] dictionary", "[concept] terms"]
tags: [glossary, "[concept]"]
intencion-busqueda: informacional
og-image: ""                         # inherits the branded OG generator (app/opengraph-image.tsx); no own openGraph.images
dominio-raiz: tuconcepto.com
subdominio: ""
query-params: [q, dominio]
canonical: https://tuconcepto.com/en/glossary

# ── Capa 3: GEO ──
geo-preguntas:
  - "what is [term]?"
  - "what does [term] mean in [concept]?"
geo-respuesta-corta: "An open glossary defining, with examples and links, the key terms of [concept]."
geo-entidades: ["[Concept]", "[Topic domain]"]
geo-datos-citables:
  - "[N] terms structured (source: the concept's ingest source, 0 broken links)"
geo-formato: [definicion, lista, faq]
schema-tipo: DefinedTermSet

# ── Capa 4: Sitemap técnico ──
prioridad: 0.9
frecuencia-cambio: weekly
idiomas: [es, en]
hreflang-alt: /glosario

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/wiki/page.tsx"
  - "apps/web/app/[lang]/wiki/_components/WikiBuscador.tsx"
componentes: []
datos: []
fuentes:
  - "the concept's ingest source (terms, 0 broken links)"
depende-de: []

estado: borrador
creado: 2026-06-21
actualizado: 2026-07-14
---

# Glossary (EN) — `/en/glossary`

> [!definition] Purpose
> English counterpart of [[Wiki.es]]. The long-tail SEO engine: hundreds of terms (sourced from the concept's ingest source), each its own URL `/en/glossary/<term>`, defined and interlinked. Structured data `DefinedTerm`. Topical silos by domain.
