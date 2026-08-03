---
# ── Capa 1: Identidad semántica ──
title: Caso de Estudio (plantilla de entrada)
aliases: [Case Study Entry, Caso, Plantilla de Caso]
tipo: case-study
nivel: hipónimo
dominio: [Casos de Estudio]
hiperónimo: "[[Casos.es]]"
campo-semántico: [caso de estudio, proceso, problema, solución, resultado]
relacionado:
  - "[[Casos.es]]"
  - "[[Contacto.es]]"
  - "[[Blog.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "{{Caso}}: caso de estudio de [concepto] | [Concepto]"   # ≤ 60, con keyword
metadescripcion: "Cómo se abordó {{Caso}}: contexto, problema, proceso y resultados. Un caso real aplicado a [concepto]."   # 120–155
keyword-principal: "{{caso}} caso de estudio"
keywords-secundarias: ["{{cliente}} [concepto]", "[concepto] {{sector}}", "{{caso}} ejemplo"]
tags: [caso, "{{tipo}}", "{{cliente}}"]
intencion-busqueda: comercial
og-image: ""                         # usa la `portada` del caso como og:image (metadataBase la vuelve absoluta)
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /casos-de-estudio/{{slug}}
query-params: []
canonical: https://tuconcepto.com/casos-de-estudio/{{slug}}

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿cómo se abordó {{Caso}}?"
  - "¿qué resultados tuvo {{Caso}}?"
geo-respuesta-corta: "{{Resumen en 1–3 frases: qué problema, qué se hizo y qué resultado.}}"
geo-entidades: ["[Concepto]", "{{Cliente}}", "{{Sector}}"]
geo-datos-citables: []               # métricas/resultados con fuente (E-E-A-T)
geo-formato: [definicion, lista, paso-a-paso]
schema-tipo: CreativeWork            # caso de estudio como obra creativa (autor: Person)

# ── Capa 4: Sitemap técnico ──
prioridad: 0.7
frecuencia-cambio: yearly
idiomas: [es, en]
hreflang-alt: /en/case-studies/{{slug}}

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/casos-de-estudio/[slug]/page.tsx"
componentes:
  - "ds:patterns/page-hero"          # hero de sección
  - "ds:primitives/typography"       # cuerpo MDX / secciones
  - "ds:compositions/kpi-card"       # métricas/resultados visibles
  - "ds:primitives/aspect-ratio"     # imágenes editoriales
  - "ds:primitives/badge"            # tipo, rol, año
  - "ds:primitives/breadcrumb"
datos:
  - "content/casos/{{slug}}.mdx  (cuerpo + frontmatter del caso)"
fuentes: []
depende-de:
  - "[[Casos.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-21
---

# {{Caso}}: caso de estudio · `/casos-de-estudio/{{slug}}`

> [!definition] Propósito
> **Plantilla de un caso individual.** Diseño **editorial y visual**, pensado para **generar confianza y cerrar conversiones**: con **CTAs a [[Contacto.es]]** en la página. Cuenta un caso aplicado a [concepto]: contexto → problema → proceso → resultado.

## Estructura del caso (fija pero flexible)
> **Esqueleto común obligatorio** (siempre, en este orden): **Contexto · Problema · Proceso · Decisiones · Resultado · Aprendizajes**. Sobre él se pueden **añadir secciones opcionales** (testimonios, métricas, galería) según el caso. Layout largo, scroll editorial, mucho aire y apoyo visual. CTA a [[Contacto.es]] **al final**, con mensaje contextual.

1. **Hero del caso**: título, cliente/proyecto, tipo, rol, año + imagen grande. Resumen extraíble (= `geo-respuesta-corta`).
2. **Contexto**: quién es el cliente / qué es el caso y su punto de partida. *(esqueleto)*
3. **Problema / reto**: qué había que resolver. *(esqueleto)*
4. **Proceso**: cómo se abordó (paso a paso). Apoyo visual abundante. *(esqueleto)*
5. **Decisiones**: las decisiones clave y su porqué. *(esqueleto)*
6. **Resultado / impacto**: qué cambió. *(esqueleto)*
7. **Aprendizajes**: qué se aprendió del caso. *(esqueleto)*
8. **CTA final fuerte**: "¿Tienes un reto parecido? Hablemos" → [[Contacto.es]], con mensaje contextual.

> **Secciones opcionales** (insertables donde aporten, no obligatorias): **Testimonios** (cita del cliente), **Métricas** (KPI cards cuando haya datos duros), **Galería** (apoyo visual extendido). Su ausencia no rompe el esqueleto.

## Componentes
> Binding al DS (`ds:<capa>/<nombre>`). Componente nuevo nace en el design system.

- `ds:patterns/case-hero`: **NUEVO**. Hero editorial: título + meta (cliente/tipo/rol/año) + imagen grande. Composición de `ds:primitives/typography` + `ds:primitives/badge` + `ds:primitives/aspect-ratio`. Mobile: imagen full-width arriba, texto debajo.
- `ds:patterns/contact-cta`: **NUEVO**. Bloque CTA a [[Contacto.es]] (`/contacto`), reutilizable e insertable entre secciones. Composición de `ds:primitives/card` + `ds:primitives/button` (link-button). Variante inline (banda) y variante final (destacada).
- `ds:compositions/kpi-card`: métricas/resultados, **sección opcional**; se omite en casos sin métricas duras.
- `ds:primitives/typography`: cuerpo MDX y secciones.
- `ds:primitives/aspect-ratio`, `ds:primitives/badge`, `ds:primitives/breadcrumb`.

## Diseño responsive / dispositivos
- **Mobile-first**: una columna editorial; CTAs como bandas full-width; imágenes apiladas.
- **Tablet/desktop**: layout editorial con anchos de lectura controlados, imágenes a sangre/bleed.

## Notas SEO + GEO
- **SEO**: `schema-tipo: CreativeWork` con autor `Person`. Keyword en `titulo` y H1; enlaces a [[Blog.es|blog]] y a otros casos.
- **GEO**: resumen del hero = respuesta extraíble; proceso en paso-a-paso y resultados con métricas (citables).

## Decisiones de diseño
- **Estructura fija pero flexible**: esqueleto común obligatorio **Contexto · Problema · Proceso · Decisiones · Resultado · Aprendizajes**; sobre él, **secciones opcionales** (testimonios, métricas, galería) según el caso.
- **Sin rating ni precio**: un caso no es una review; no lleva puntuación ni precio.
- **Testimonios = sección opcional**: cita del cliente, solo si existe.
- **Métricas = sección opcional**: KPI cards solo cuando haya datos duros; un caso sin métricas (NDA / interno) es válido sin ellas.

## Pendiente / Bloqueos
- **CTAs**: texto exacto de cada CTA (¿fijo o variable por caso?).
- **Privacidad**: ¿cliente con nombre o anonimizado por defecto? (afecta a `geo-entidades` y al hero).

## Runbook: par EN de un caso

El flujo general (routing, generación por `lang`, hreflang/sitemap) es el del runbook de [[Blog-Entrada.es]]. Diferencia: el contenido de casos vive en `apps/web/app/[lang]/casos-de-estudio/_data/casos.ts` (no MDX), así que el par EN requiere definir la convención de datos EN antes de activar `{lang:'en'}` en `generateStaticParams`.
