---
# ── Capa 1: Identidad semántica ──
title: Reviews
aliases: [Recomendaciones, Reviews, Recommendations, Recursos]
tipo: collection
nivel: hiperónimo
dominio: [Reviews]
hiperónimo: "[[🏠 Context — Índice]]"
hipónimos: ["[[Review-Entrada.es]]"]
campo-semántico: [reviews, reseñas, recursos, herramientas, recomendaciones]
relacionado:
  - "[[About.es]]"
  - "[[Blog.es]]"
  - "[[Review-Entrada.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "Reviews de [Concepto]: recursos y recomendaciones | [Concepto]"
metadescripcion: "Reviews honestas de recursos, herramientas y referencias relacionadas con [concepto]. Lo que se recomienda, con enlace a cada review."
keyword-principal: "reviews de [concepto]"
keywords-secundarias: ["recursos de [concepto]", herramientas recomendadas, "mejores recursos de [concepto]"]
tags: [reviews, recursos, herramientas]
intencion-busqueda: comercial
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /reviews
query-params: [categoria, tipo]      # categoria = silo de recurso ; tipo = uso|recomiendo
canonical: https://tuconcepto.com/reviews

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué recursos se recomiendan para [concepto]?"
  - "¿qué herramientas / referencias sirven para [concepto]?"
geo-respuesta-corta: "Reviews honestas de recursos, herramientas y referencias relacionadas con [concepto], cada una con su reseña enlazada."
geo-entidades: ["[Concepto]", "[Categoría de recurso]", Reviews]
geo-datos-citables: []
geo-formato: [lista, tabla]
schema-tipo: CollectionPage     # ItemList de Product/Review (cada tarjeta = un nodo del ItemList)

# ── Capa 4: Sitemap técnico ──
prioridad: 0.7
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /en/reviews

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/reviews/page.tsx"                 # Server Component: metadata + isla
  - "apps/web/app/[lang]/reviews/_components/ReviewsListado.tsx"  # isla cliente: filtro + paginación
  - "apps/web/app/[lang]/reviews/[slug]/page.tsx"          # detalle (SSG, dynamicParams=false) + JSON-LD Review + CTA afiliado
  - "apps/web/app/[lang]/reviews/_data/reviews.ts"         # FUENTE ÚNICA: reviews (grid+detalle) con afiliado?, enlace, pros/contras
componentes:                          # binding al DS
  - "ds:patterns/page-hero"           # cabecera de sección
  - "ds:patterns/filter-chips"        # chips de categoría
  - "ds:compositions/paginacion"      # paginación
  - "ds:primitives/estrellas"         # rating ★
datos:
  - "apps/web/app/[lang]/reviews/_data/reviews.ts  (reviews ES: cada una con afiliado?, enlace, pros/contras, rating)"
  - "apps/web/public/reviews/<slug>/logo.png  (logo/imagen de cada recurso; ruta derivada del slug con `imagenDe()`)"
fuentes:
  - "la fuente de ingesta del concepto (semilla de qué recursos reseñar)"
depende-de:
  - "[[Review-Entrada.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-07-14
---

# Reviews: `/reviews`

> [!definition] Propósito
> Catálogo tipo **tienda/ecommerce** pero que en realidad es **marketing de afiliados**: una lista de **recursos, herramientas y referencias** relacionadas con [concepto]. La mayoría de tarjetas **no son enlaces de afiliación directos**, sino que llevan a la **review** (dentro o fuera de la web) donde se explica con honestidad qué es y por qué se recomienda. Genera autoridad, confianza y enlaces entrantes.

## Modelo mental
Una página tipo **lista de productos estilo ecommerce**, pero adaptada a recursos del concepto:
- Como el contenido son **recursos/herramientas**, **NO se da peso a la imagen**. Nada de fotos grandes.
- Cada ítem es una **tarjeta compacta**: **imagen pequeña + título + descripción breve + enlace "Más información"**.
- El destino de "Más información" es la **[[Review-Entrada.es|review]]** (`/reviews/<slug>`), no un carrito.

## Secciones
1. **Hero / intro corto**: qué es esto (reviews honestas, posible disclosure de afiliación a nivel sección) + buscador opcional.
2. **Filtros**: barra de filtros por `categoria` (silos de recurso, a definir) y `tipo` ("lo que uso" vs "lo que recomiendo"). Mobile: filtros colapsados en sheet/drawer.
3. **Grid de tarjetas compactas**: el núcleo. Tarjeta = imagen pequeña + título + descripción + badge(s) + **rating (★)** + CTA "Más información". **Sin precio**.
4. **CTA de cierre**: enlace al [[Blog.es|blog]] / [[About.es|about]] o newsletter.

## Tarjeta de review (anatomía)
```
┌──────────────────────────────┐
│ [img sm]  Título del recurso  │
│           categoría · badge   │
│  Descripción breve (1–2 líneas)│
│  ★ rating          Más info → │
└──────────────────────────────┘
```
- Imagen **pequeña** (logo/thumbnail), no protagonista.
- Badge: categoría y, si se decide, "Lo que uso" vs "Recomiendo".
- **Rating (★) visible** en la tarjeta (puntuación/estrella). **Sin precio** (evita desactualización y aspecto de tienda real).
- CTA "Más información" → review. (El enlace de afiliación vive **dentro** de la review, no en la tarjeta.)

> [!note] Propuesta alternativa a las tarjetas
> Si el catálogo crece mucho, una **tabla/lista densa** (`ds:primitives/table`) con columnas (recurso · categoría · uso/recomiendo · **rating** · enlace) escala mejor que un grid y es más "extraíble" para GEO. Propuesta: **grid en mobile, toggle a tabla en desktop** cuando haya muchas entradas.

## Componentes
> Binding al DS (`ds:<capa>/<nombre>`). Componente nuevo nace en el design system.

- `ds:patterns/review-card`: **NUEVO**. Tarjeta compacta: imagen pequeña + título + descripción + badge + CTA. Composición de `ds:primitives/card` + `ds:primitives/badge` + `ds:primitives/link-button` + `ds:primitives/aspect-ratio` (img). Mobile-first.
- `ds:patterns/filter-select`: filtros por `categoria` y `tipo`.
- `ds:primitives/card`, `ds:primitives/badge`, `ds:primitives/link-button`, `ds:primitives/breadcrumb`: primitivos base.
- `ds:primitives/table`: opcional, para la vista densa en desktop.

## Diseño responsive / dispositivos
- **Mobile-first**: 1 columna; filtros en sheet/drawer.
- **Tablet/desktop**: grid 2–4 columnas; opción de vista tabla.

## Notas SEO + GEO
- **SEO**: `intencion-busqueda: comercial`; cada tarjeta enlaza a su review (silo). URLs con `categoria`/`tipo` **no canónicas** → `canonical` a `/reviews` limpio.
- **GEO**: `schema-tipo: CollectionPage` con un **ItemList** donde cada ítem es `Product`/`Review`. La intro abre con `geo-respuesta-corta`. Formato lista/tabla = citable.
- Los recursos pueden enlazar a su término en la [[Wiki.es|wiki]] cuando exista.

## Decisiones de diseño
- **Categorías**: definir la taxonomía de silos de recurso del concepto. Se usan en `query-params` (`?categoria`), en los filtros y en los badges de la tarjeta.
- **Rating SÍ**: puntuación/estrella (★) **visible en la tarjeta** (y en la review). Es un dato citable para GEO.
- **Precio NO**: no se muestra precio ni rango (evita desactualización y aspecto de tienda real).

## Pendiente / Bloqueos
- **Taxonomía de categorías** de recurso del concepto.
- **Filtro "lo que uso" vs "lo que recomiendo"**: ¿es un filtro (`tipo`) o un badge informativo, o ambos?
- **Grid vs tabla**: ¿grid mobile + tabla densa en desktop, o solo grid?
- **Afiliación**: ¿disclosure a nivel sección (banner) además del de cada review? (el de cada review ya es obligatorio, ver [[Review-Entrada.es]]).
