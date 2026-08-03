---
# ── Capa 1: Identidad semántica ──
title: Landing
aliases: [Inicio, Home, Página de inicio]
tipo: page
nivel: hipónimo
dominio: [Landing]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [inicio, presentación, hero, navegación]
relacionado:
  - "[[About.es]]"
  - "[[Casos.es]]"
  - "[[Blog.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "[Concepto] · [Título del concepto]"
metadescripcion: "[Descripción breve del concepto y de qué ofrece esta web. 120–155 caracteres.]"
keyword-principal: "[concepto]"
keywords-secundarias: [keyword secundaria 1, keyword secundaria 2]
tags: [concepto]
intencion-busqueda: navegacional
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /
query-params: []
canonical: https://tuconcepto.com/

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué es [concepto]?"
  - "¿de qué trata esta web sobre [concepto]?"
geo-respuesta-corta: "[Respuesta extraíble en 1-3 frases: qué es [concepto] y qué ofrece esta web.]"
geo-entidades: ["[Concepto]", "[Entidad relacionada]"]
geo-datos-citables: []
geo-formato: [definicion]
schema-tipo: WebSite

# ── Capa 4: Sitemap técnico ──
prioridad: 1.0
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /en/

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/page.tsx"                  # hero + secciones de la portada
  - "apps/web/app/[lang]/layout.tsx"
  - "apps/web/app/[lang]/_components/CasosStack.tsx"          # casos apilados (sticky-stack CSS)
  - "apps/web/app/[lang]/_components/BlogGaleria.tsx"         # galería horizontal del blog
  - "apps/web/lib/home/config.ts"                             # orden/selección de casos·blog en portada
  - "design-system/web/components/compositions/site-header/site-header.tsx"
  - "design-system/web/components/compositions/site-footer/site-footer.tsx"
componentes:                        # binding al DS (verificado por scripts/validate-context.mjs)
  - "ds:compositions/site-header"   # header global
  - "ds:compositions/site-footer"   # footer global
  - "ds:primitives/navigation-menu" # navegación (desktop)
  - "ds:primitives/sheet"           # menú off-canvas (mobile/tablet)
  - "ds:primitives/theme-toggle"    # selector de tema claro/oscuro
  - "ds:primitives/dropdown-menu"   # selector de idioma ES/EN
  - "ds:foundations/icons"          # logo SVG
  - "ds:primitives/typography"      # claim del hero
  - "ds:primitives/button"          # CTAs
  - "ds:primitives/link-button"     # enlaces de navegación
datos:
  - "home_config: orden/selección de casos y artículos del blog en portada (editable en /admin/inicio)"
fuentes:
  - "la fuente de ingesta del concepto (logo/branding)"
depende-de:
  - "[[Blog.es]]"
  - "[[Casos.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-21
---

# Landing: `/`

> [!definition] Propósito
> Primera impresión y **enrutador**. Página de **poco contenido pero estética premium**: comunica en segundos **de qué trata [concepto]** y ofrece el **menú/header** para navegar al resto de la web.

## Decisiones de arquitectura
- **Header = overlay** (flota sobre el contenido, no empuja el layout).
- Incluye **selector de idioma (ES/EN)** y **selector de tema (claro/oscuro)**.
- **Logo = SVG**.

## Estructura (mobile-first)

1. **Header overlay**: presente sobre todo el scroll. Contiene: logo · navegación a las páginas · selector de idioma · selector de tema. En **móvil** colapsa a logo + botón de menú (off-canvas con `sheet`).
2. **Hero / Presentación**: la sección de contenido principal: claim + **resumen de qué es [concepto]** y de esta web. Estética con mucho aire, tipografía grande y una animación con intención. CTA primario (Ver contenido) + secundario (Sobre el concepto).
3. **Secciones destacadas**: selección de casos ([[Casos.es]]) y artículos del [[Blog.es|blog]] en portada, configurable en `/admin/inicio`.
4. **Footer**: navegación secundaria (mismas rutas + legales), redes, idioma/tema, CTA a [[Contacto.es]].

## Componentes

- **Header overlay** → `ds:compositions/site-header`, compuesto de `navigation-menu` (desktop), `sheet` (off-canvas), `theme-toggle` (tema) y `dropdown-menu` (idioma). Logo vía `ds:foundations/icons`. Responsivo.
- **Hero** → `ds:primitives/typography` (claim) + `ds:primitives/button` (CTAs).

## Notas SEO + GEO
- Keyword **[concepto]** en el H1 del hero. Enlaces internos desde header/footer → distribución de autoridad. `prioridad: 1.0`.
- La sección de presentación abre con la `geo-respuesta-corta`. `schema-tipo: WebSite`.

## Pendiente / Bloqueos
- **Copy final** del claim + resumen (2-3 variantes).
- ¿El header overlay **se transforma al hacer scroll** (encoge / cambia de fondo)?
