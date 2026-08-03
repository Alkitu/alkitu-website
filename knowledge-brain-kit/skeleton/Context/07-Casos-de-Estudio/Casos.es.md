---
# ── Capa 1: Identidad semántica ──
title: Casos de Estudio
aliases: [Case Studies, Casos, Portfolio, Ejemplos]
tipo: collection
nivel: hiperónimo
dominio: [Casos de Estudio]
hiperónimo: "[[🏠 Context — Índice]]"
hipónimos: ["[[Caso-Entrada.es]]"]
campo-semántico: [casos de estudio, portfolio, proceso, resultados, ejemplos]
relacionado:
  - "[[Landing.es]]"
  - "[[Blog.es]]"
  - "[[Caso-Entrada.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "Casos de Estudio de [Concepto] | [Concepto]"
metadescripcion: "Casos de estudio de [concepto]: contexto, proceso y resultados. Ejemplos reales aplicados a [concepto]."
slug: /casos-de-estudio
keyword-principal: "casos de estudio de [concepto]"
keywords-secundarias: ["ejemplos de [concepto]", "case study de [concepto]", "proceso de [concepto]"]
tags: [casos, portfolio, ejemplos, proceso]
intencion-busqueda: comercial
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); los CASOS individuales usan su `portada` como og:image (ver Caso-Entrada)
dominio-raiz: tuconcepto.com
subdominio: ""
query-params: [tipo]                 # tipo = silo de caso (a definir)
canonical: https://tuconcepto.com/casos-de-estudio

# ── Capa 3: GEO ──
geo-preguntas:
  - "¿qué casos de estudio de [concepto] hay?"
  - "¿cómo se aplica [concepto] en la práctica?"
geo-respuesta-corta: "Casos de estudio de [concepto]: contexto, proceso, decisiones y resultados de ejemplos reales."
geo-entidades: ["[Concepto]", "[Entidad relacionada]"]
geo-datos-citables: []
geo-formato: [lista]
schema-tipo: CollectionPage

# ── Capa 4: Sitemap técnico ──
prioridad: 0.9
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /en/case-studies

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/casos-de-estudio/page.tsx"                    # Server Component: metadata + isla
  - "apps/web/app/[lang]/casos-de-estudio/_components/CasosListado.tsx" # isla cliente: grid + paginación
  - "apps/web/app/[lang]/casos-de-estudio/[slug]/page.tsx"             # detalle (SSG, dynamicParams=false) + JSON-LD + notFound
  - "apps/web/app/[lang]/casos-de-estudio/_data/casos.ts"             # FUENTE ÚNICA de los casos + secciones[{imagenes, tarjetas, ficha}]
  - "apps/web/app/[lang]/casos-de-estudio/[slug]/_components/CasoGaleria.tsx"       # slider de imágenes por sección (scroll-snap + flechas + dots)
componentes:
  - "ds:primitives/card"             # base de la tarjeta de caso
  - "ds:primitives/badge"            # tipo de caso, año, rol
  - "ds:primitives/link-button"      # CTA "Ver caso"
  - "ds:patterns/page-hero"          # cabecera de sección
  - "ds:compositions/paginacion"     # paginación
  - "ds:primitives/breadcrumb"
datos:
  - "apps/web/app/[lang]/casos-de-estudio/_data/casos.ts  (fuente única, TS)"
  - "apps/web/public/casos/<slug>/*  (imágenes por caso)"
fuentes:
  - "la fuente de ingesta del concepto (ejemplos/proyectos reales); portadas generadas"
depende-de:
  - "[[Caso-Entrada.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-07-14
---

# Casos de Estudio: `/casos-de-estudio`

> [!definition] Propósito
> La **prueba**. Donde se demuestra con ejemplos reales cómo se aplica [concepto]. La página es en parte como un blog, pero **solo muestra entradas de casos** (explicativas): contexto → proceso → decisiones → resultados. Clave para generar confianza y para cerrar conversiones.

## Modelo mental
Página tipo **blog/portfolio** pero filtrada a **un solo tipo de entrada: casos**. Cada tarjeta lleva a su [[Caso-Entrada.es|caso completo]] (`/casos-de-estudio/<slug>`).

## Secciones
1. **Hero / intro**: qué demuestran estos casos (1–2 frases, = `geo-respuesta-corta`).
2. **Filtro por tipo**: silos de caso (param `tipo`, a definir). Mobile: colapsado.
3. **Grid de casos**: tarjetas con thumbnail, título, tipo, rol, año y resultado destacado.
4. **CTA de cierre**: enlace a [[Contacto.es]] ("¿Tienes un proyecto?").

## Tarjeta de caso (anatomía)
```
┌──────────────────────────────┐
│ [thumbnail]                   │
│ Tipo · Año                    │
│ Título del caso               │
│ Rol: resultado destacado      │
│                     Ver caso →│
└──────────────────────────────┘
```

## Capacidades de la entrada de caso
Definidas por sección en `casos.ts` y renderizadas en `[slug]/page.tsx`:
- `imagenes[]` → **slider** (`CasoGaleria`): flechas + dots, scroll-snap; ratio adaptable por `aspect-ratio`.
- `tarjetas[]` → **fila en scroll horizontal** con flechas, para narrativas por pasos.
- `ficha` → ficha de datos del caso en la sección que corresponda.
- `portada` → generada con el generador de portadas: `--device phone` (móvil) o `desktop` (monitor) + fondo temático SVG.
- `protegido: true` → **caso bajo acuerdo de confidencialidad**: el detalle se bloquea tras una contraseña (gate en servidor + cookie httpOnly) y se marca `robots: noindex`. El contenido nunca viaja en el HTML sin la cookie.

## Componentes
> Binding al DS (`ds:<capa>/<nombre>`). Componente nuevo nace en el design system.

- `ds:patterns/case-card`: **NUEVO**. Tarjeta de caso: thumbnail + tipo + título + rol/resultado + CTA. Composición de `ds:primitives/card` + `ds:primitives/badge` + `ds:primitives/link-button` + `ds:primitives/aspect-ratio`. Mobile-first.
- `ds:patterns/filter-select`: filtro por `tipo`.
- `ds:primitives/card`, `ds:primitives/badge`, `ds:primitives/link-button`, `ds:primitives/breadcrumb`.

## Diseño responsive / dispositivos
- **Mobile-first**: 1 columna; filtro colapsado.
- **Tablet/desktop**: grid 2–3 columnas.

## Notas SEO + GEO
- **SEO**: `intencion-busqueda: comercial`; cada tarjeta enlaza a su caso (silo). URL con `tipo` no canónica → `canonical` a `/casos-de-estudio`.
- **GEO**: `schema-tipo: CollectionPage`; la intro abre con `geo-respuesta-corta`.

## Pendiente / Bloqueos
- **Metadatos por caso**: ¿qué mostramos en la tarjeta? Propuesta: **rol · año · resultado destacado** (+ tipo). ¿Cliente visible o anónimo?
- **Filtro por tipo**: ¿qué silos de caso tiene el concepto?
- **Orden**: ¿por fecha, por destacados manuales, o ambos?
