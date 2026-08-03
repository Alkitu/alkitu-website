---
# ── Capa 1: Identidad semántica ──
title: Entrada de Blog (plantilla)
aliases: [Artículo, Post, Blog Post, Entrada]
tipo: article
nivel: hipónimo
dominio: [Blog]
hiperónimo: "[[Blog.es]]"
campo-semántico: [artículo, ensayo, lectura, tipografía, contenido largo]
relacionado:
  - "[[Blog.es]]"
  - "[[Wiki.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "{{título del artículo}} | [Concepto]"      # ≤ 60 chars, se rellena por entrada
metadescripcion: "{{resumen del artículo en 120-155 chars}}"   # se rellena por entrada
keyword-principal: "{{keyword foco del artículo}}"
keywords-secundarias: [kw2, kw3]
tags: [blog, artículo]
intencion-busqueda: informacional
portada: /blog/{{slug}}/portada.webp   # cover REAL del artículo: miniatura + cabecera + og:image. Archivo en apps/web/public/blog/<slug>/. Opcional → sin él, placeholder gris.
og-image: ""                           # la `portada` hace de og:image (metadataBase la vuelve absoluta); este campo queda como override opcional
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /blog/{{slug}}
query-params: []
canonical: https://tuconcepto.com/blog/{{slug}}

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "{{pregunta NL que responde el artículo}}"
geo-respuesta-corta: "{{respuesta extraíble en 1-3 frases: primer párrafo del artículo}}"
geo-entidades: ["[Concepto]", "{{entidad principal del tema}}"]
geo-datos-citables: []
geo-formato: [definicion, lista]
schema-tipo: Article

# ── Capa 4: Sitemap técnico ──
prioridad: 0.7
frecuencia-cambio: yearly
idiomas: [es, en]
hreflang-alt: /en/blog/{{slug}}

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido  # render MDX: cabecera desde frontmatter + cuerpo MDX (next-mdx-remote/rsc)
rutas-codigo:
  - "apps/web/app/[lang]/blog/[slug]/page.tsx"                   # ruta dinámica: compila el MDX (remark-gfm para tablas + auto-enlazado) y arma la cabecera desde el frontmatter
  - "apps/web/lib/content/blog.ts"                        # capa de contenido: getAllPosts/getRelatedPosts/getPostSlugs/getPostSource (fuente única desde el frontmatter)
  - "apps/web/lib/content/schema.ts"                      # esquema zod del frontmatter (5 capas tipadas; rompe el build si es inválido)
  - "apps/web/lib/glosario.tsx"                           # índice de la wiki + plugin remark `remarkGlosarioLinks` (auto-enlaza términos → /wiki/<slug>); compartido con la wiki
  - "apps/web/app/[lang]/blog/_components/mdx-components.tsx"    # mapa de componentes MDX (h2/p/blockquote/tabla + Lead/Callout)
componentes:                        # binding al DS (verificado por scripts/validate-context.mjs)
  - "ds:primitives/typography"      # cuerpo del artículo (lectura cómoda)
  - "ds:primitives/aspect-ratio"    # imágenes/portada con ratio estable
  - "ds:primitives/separator"       # separadores entre secciones
  - "ds:primitives/alert"           # callouts / notas dentro del MDX
  - "ds:primitives/badge"           # categoría/tags del artículo
  - "ds:patterns/user-avatar"       # autor (bio), si se confirma autoría visible
  - "ds:primitives/card"            # artículos relacionados al pie
  - "ds:showcase/text-animations/scroll-reveal"   # revelado suave de bloques (opcional, sobrio)
datos:
  - "apps/web/content/blog/{{slug}}.es.mdx  (cuerpo del artículo en MDX con frontmatter)"
  - "apps/web/public/blog/{{slug}}/  (portada e imágenes del artículo; servidas como /blog/<slug>/…; campo `portada` del frontmatter)"
fuentes: []
depende-de:
  - "[[Blog.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-22
---

# Entrada de Blog (plantilla): `/blog/<slug>`

> [!definition] Propósito
> **Plantilla** de la página de artículo: **la forma se repite, el contenido cambia**. Apariencia de **lectura cómoda**: tipografía cómoda, ancho de medida controlado (~65-75 caracteres), buen interlineado, imágenes generosas y jerarquía clara. Cada artículo concreto hereda este frontmatter y rellena los `{{campos}}`.

## Secciones (orden de la página)

1. **Cabecera del artículo**: categoría/tag (`badge`), título (H1), extracto/subtítulo, metadatos (fecha, tiempo de lectura) y, si aplica, autor.
2. **Portada**: imagen destacada con `aspect-ratio` estable, vía el campo `portada` del frontmatter (renderizada con `next/image`). **Opcional**: sin ella, placeholder gris. La **misma imagen hace de `og:image`** (compartir en redes). Los archivos viven en `apps/web/public/blog/<slug>/` y se referencian como `/blog/<slug>/portada.webp`.
3. **Cuerpo (MDX)**: texto largo con tipografía del DS: H2/H3, párrafos, listas, citas, código, imágenes inline y **callouts** (`alert`). Ancho de medida limitado para lectura cómoda. El primer párrafo es la `geo-respuesta-corta` (citabilidad GEO).
4. **Pie del artículo**: tags, compartir (si se confirma), bio del autor (si se confirma).
5. **Artículos relacionados**: 2-3 tarjetas (`card`) enlazando a otras entradas del mismo cluster (interlinking, topical authority).

## Componentes

- **Tipografía / cuerpo** → `ds:primitives/typography` (la pieza central de la lectura).
- **Imágenes** → `ds:primitives/aspect-ratio` (portada e inline).
- **Bloques MDX** → `ds:primitives/alert` (callout/nota), `ds:primitives/separator` (cortes), `ds:primitives/badge` (categoría/tags). Más componentes MDX a definir según necesidades de escritura.
- **Autor** → `ds:patterns/user-avatar` (si hay bio visible, ver Pendiente).
- **Relacionados** → `ds:primitives/card` en rejilla al pie.
- **Animación** → `ds:showcase/text-animations/scroll-reveal` muy sobrio (opcional; la lectura manda sobre el efecto).

## Notas SEO + GEO

- **SEO**: `slug` corto con la keyword; `titulo` ≤ 60 con la keyword principal; enlaza a su hiperónimo [[Blog.es]] + artículos relacionados (ES↔ES y EN↔EN). El enlazado a términos de la [[Wiki.es|wiki]] es **automático**: el render MDX pasa el plugin remark `remarkGlosarioLinks` (`apps/web/lib/glosario.tsx`), que convierte la 1ª mención de cada término en enlace a `/wiki/<slug>` (no se enlaza a mano).
- **GEO**: `schema-tipo: Article` con autor `Person`, fecha de publicación/actualización. Abre con respuesta directa; usa listas/tablas y, si encaja, un bloque FAQ.

## Pendiente / Bloqueos

- **¿Autor / bio?** ¿Se muestra autor con avatar + bio corta al pie, o se omite por minimalismo?
- **¿Tabla de contenidos (TOC)?** ¿Lateral fija en desktop, colapsable en mobile, o sin TOC?
- **¿Botones de compartir?** (X/LinkedIn/copiar enlace): ¿sí, y en qué posición?
- **¿Artículos relacionados** automáticos (por categoría/tag) o curados a mano por entrada?
- **¿Comentarios?** (sí/no, y con qué proveedor si sí).
- **¿Qué bloques MDX personalizados** se necesitan además de callout?
- **¿Ancho de medida y escala tipográfica** exactos para la lectura (definir en tokens del DS).

## Runbook: crear el par EN de un artículo (convención por locale)

1. **Contenido**: crea el hermano `apps/web/content/blog/<slug>.en.mdx` junto al `.es.mdx` (mismo slug, sufijo de locale). El nodo del Context correspondiente ya tiene su par `.en.md` (lo comprueba `pnpm validate:context`).
2. **Routing**: la URL pública queda en `/en/blog/<slug>` sin tocar el middleware: los slugs EN de sección viven en `apps/web/lib/i18n/route-map.json`.
3. **Generación**: en `apps/web/app/[lang]/blog/[slug]/page.tsx`, `generateStaticParams` emite `{lang:'en', slug}` y carga la fuente `.en.mdx` según `lang`.
4. **hreflang + sitemap**: marca el par con `hasEn: true` en su metadata y añade la URL EN al sitemap. Con par → hreflang recíproco ES↔EN + x-default; sin par → no se emite nada (no hay hreflang roto).
