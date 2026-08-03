---
# ── Capa 1: Identidad semántica ──
title: Review (plantilla de entrada)
aliases: [Review Entry, Reseña, Plantilla de Review]
tipo: article                          # subtipo: review
nivel: hipónimo
dominio: [Reviews]
hiperónimo: "[[Reviews.es]]"
campo-semántico: [review, reseña, recurso, afiliados, veredicto, pros y contras]
relacionado:
  - "[[Reviews.es]]"
  - "[[Blog.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "{{Recurso}}: review honesta, ¿vale la pena? | [Concepto]"   # ≤ 60, con keyword
metadescripcion: "Review honesta de {{Recurso}}: qué es, para quién, pros y contras y mi veredicto tras usarlo."   # 120–155
keyword-principal: "{{recurso}} review"
keywords-secundarias: ["{{recurso}} opiniones", "{{recurso}} vale la pena", "alternativas a {{recurso}}", "{{recurso}} análisis"]
tags: [review, "{{categoria}}", "{{recurso}}"]
intencion-busqueda: comercial
og-image: /reviews/{{slug}}/logo.png     # logo/imagen real como og:image
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /reviews/{{slug}}
query-params: []
canonical: https://tuconcepto.com/reviews/{{slug}}

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué es {{Recurso}} y para qué sirve?"
  - "¿vale la pena {{Recurso}}?"
geo-respuesta-corta: "{{Veredicto en 1–3 frases: qué es, para quién, y si lo recomienda.}}"
geo-entidades: ["[Concepto]", "{{Recurso}}", "{{Proveedor}}", "{{Categoria}}"]
geo-datos-citables: []                 # specs, rating, fecha de prueba (con fuente), sin precio
geo-formato: [definicion, lista, tabla, faq]
schema-tipo: Review                    # con itemReviewed (Product/SoftwareApplication) + reviewRating

# ── Capa 4: Sitemap técnico ──
prioridad: 0.6
frecuencia-cambio: yearly              # las reviews se revisan, no cambian a diario
idiomas: [es, en]
hreflang-alt: /en/reviews/{{slug}}

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/reviews/[slug]/page.tsx"
componentes:
  - "ds:primitives/typography"         # cuerpo MDX
  - "ds:primitives/estrellas"          # rating ★
  - "ds:primitives/badge"              # categoría, rating, "lo que uso"
  - "ds:primitives/table"              # tabla de specs
  - "ds:compositions/alert-card"       # disclosure de afiliación
  - "ds:primitives/breadcrumb"
datos:
  - "content/reviews/{{slug}}.mdx  (cuerpo + frontmatter de la review)"
fuentes: []
depende-de:
  - "[[Reviews.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-21
---

# {{Recurso}}: review · `/reviews/{{slug}}`

> [!definition] Propósito
> **Plantilla de una review individual.** Página tipo blog pero orientada a decisión: normalmente con **un enlace saliente** (afiliado). CTA claro, repetido arriba y abajo. La categoría es uno de los silos de recurso del concepto.

## Estructura de la review (propuesta)
> Orden pensado para SEO/GEO (veredicto arriba = respuesta extraíble) y conversión.

1. **Ficha + veredicto (above the fold)**: imagen pequeña, nombre, categoría, **rating (★) visible en la ficha** y **veredicto en 1–3 frases** (= `geo-respuesta-corta`). **CTA saliente** aquí arriba. **Sin precio**. **Disclosure de afiliación obligatorio** encima/junto al primer CTA.
2. **Qué es / para quién**: contexto breve.
3. **Mi experiencia usándolo**: cuerpo MDX (lo que aporta la honestidad y E-E-A-T).
4. **Pros y contras**: bloque visual `pros-cons`.
5. **Specs** (si aplica): tabla de specs.
6. **Alternativas**: 1–3 opciones, enlazando a otras reviews del [[Reviews.es|catálogo]].
7. **Veredicto final + CTA saliente (repetido)**: cierre con el botón de nuevo.
8. **FAQ**: 2–4 preguntas (`geo-preguntas`) con respuesta directa.

## Componentes
> Binding al DS (`ds:<capa>/<nombre>`). Componente nuevo nace en el design system.

- `ds:patterns/affiliate-cta`: **NUEVO**. Botón CTA saliente: etiqueta clara ("Ver en {{tienda}} →"), microcopy de afiliación. **Sin precio**. `rel="sponsored nofollow noopener"` + `target="_blank"` **fijo** (no configurable). Composición de `ds:primitives/button` + `ds:primitives/badge`. Sticky en mobile (barra inferior).
- `ds:patterns/pros-cons`: **NUEVO**. Dos columnas (pros / contras) con iconos +/−. Composición de `ds:primitives/card` + `ds:primitives/icon`. Mobile: apila pros y luego contras.
- `ds:patterns/product-fact-sheet`: **NUEVO**. Ficha compacta del recurso (imagen pequeña, nombre, proveedor, categoría, **rating ★ visible**, meta). **Sin precio**. Composición de `ds:primitives/card` + `ds:primitives/badge` + `ds:primitives/aspect-ratio`.
- `ds:compositions/alert-card`: **disclosure de afiliación obligatorio** (banner honesto "este enlace puede ser de afiliación"). Presente en **toda review con enlace afiliado**.
- `ds:primitives/typography`: cuerpo MDX.
- `ds:primitives/table`: tabla de specs.
- `ds:primitives/breadcrumb`, `ds:primitives/badge`: navegación y metadatos.

## Diseño responsive / dispositivos
- **Mobile-first**: una columna; CTA de afiliación **sticky** abajo.
- **Tablet/desktop**: ficha + cuerpo en 2 columnas (ficha sticky lateral); CTA arriba y abajo.

## Notas SEO + GEO
- **SEO**: `schema-tipo: Review` con `itemReviewed` (`Product` o `SoftwareApplication`) + `reviewRating` (el rating es dato estructurado y citable). Keyword en `titulo` y H1.
- **GEO**: el **veredicto arriba** es la respuesta extraíble; pros/cons (lista), specs (tabla) y FAQ son formatos citables. Nombrar `geo-entidades` (recurso + proveedor).
- **Afiliación**: todos los enlaces de afiliación llevan `rel="sponsored nofollow noopener"` + `target="_blank"`, y **disclosure obligatorio** (Google lo pide para patrocinados).

## Decisiones de diseño
- **Rating SÍ / precio NO**: el **rating (★)** es visible en la ficha (`product-fact-sheet`) y va a `reviewRating` del schema. **No se muestra precio** en ningún punto (ficha ni CTA).
- **`rel` de los enlaces de afiliación**: **`rel="sponsored nofollow noopener"` + `target="_blank"`**, fijo en `affiliate-cta` (no configurable). Evita pasar PageRank y aísla la pestaña destino.
- **Disclosure de afiliación obligatorio**: presente en **toda review con enlace afiliado**, vía `ds:compositions/alert-card`, junto al primer CTA (above the fold).

## Pendiente / Bloqueos
- **Estructura**: ¿veredicto **arriba** (propuesto) o también un TL;DR repetido al final?
- **Tabla de specs**: ¿obligatoria para algunos tipos de recurso y opcional para otros? ¿esquema de specs por categoría?
- **CTA**: ¿texto fijo o variable por tienda?

## Runbook: par EN de una review

El flujo general (routing, generación por `lang`, hreflang/sitemap) es el del runbook de [[Blog-Entrada.es]]. Diferencia: el contenido de reviews vive en `apps/web/app/[lang]/reviews/_data/reviews.ts` (no MDX), así que el par EN requiere definir la convención de datos EN (p. ej. campos `tituloEn`/`resumenEn` o un `reviews.en.ts` hermano) antes de activar `{lang:'en'}` en `generateStaticParams`.
