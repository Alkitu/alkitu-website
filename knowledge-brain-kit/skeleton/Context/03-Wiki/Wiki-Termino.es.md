---
# ── Capa 1: Identidad semántica ──
title: "[Término]"                   # nombre canónico del término (plantilla)
aliases: [Sinónimo1, Variante EN]
tipo: glossary-term
nivel: hipónimo                      # según su lugar en la jerarquía: hiperónimo | hipónimo | hermano
dominio: [Wiki]                      # silo temático (uno)
hiperónimo: "[[Termino padre]]"      # ↑ eje ascendente (es-un)
hipónimos: ["[[Termino hijo]]"]      # ↓ eje descendente (tipos-de)
campo-semántico: [tema, subtema]     # ↔ hermanos / relacionados del mismo campo
relacionado: ["[[Otro termino]]", "[[Articulo del Blog que lo cita]]"]

# ── Capa 2: SEO + URL/dominio ──
titulo: "[Término]: qué es y para qué sirve | [Concepto]"   # ≤ 60 chars, con keyword
metadescripcion: "Definición de [término] en [concepto]: qué es, cómo se usa y términos relacionados."  # 120–155
keyword-principal: "[término] significado"
keywords-secundarias: ["qué es [término]", "definición de [término]"]
tags: [wiki, glosario, "[dominio]"]
intencion-busqueda: informacional
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""
slug: /wiki/<termino>                # kebab-case del término
query-params: []                    # las páginas de término no usan query
canonical: https://tuconcepto.com/wiki/<termino>

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué es [término]?"
  - "¿para qué sirve [término] en [concepto]?"
geo-respuesta-corta: "Definición extraíble de [término] en 1-3 frases (lo que un LLM cita literalmente)."
geo-entidades: ["[Concepto]", "[Entidad relacionada]"]
geo-datos-citables: []              # hecho/dato con fuente si aplica
geo-formato: [definicion, faq]
schema-tipo: DefinedTerm

# ── Capa 4: Sitemap técnico ──
prioridad: 0.7
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /en/wiki/<term>

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/wiki/[termino]/page.tsx"        # SSG + notFound() (auto-enlazado vía el lib)
  - "apps/web/lib/glosario.tsx"                   # índice + `linkifyToReact` (auto-enlaza la definición), compartido con el blog
  - "apps/web/content/wiki/glosario.json"         # fuente de datos (definición + ejes de relación)
componentes:                        # binding al DS (verificado por scripts/validate-context.mjs)
  - "ds:primitives/badge"           # chips de relaciones (hiperónimos/hipónimos/hermanos) y dominio
  - "ds:primitives/breadcrumb"      # breadcrumb de hiperónimos (eje ↑)
  - "ds:primitives/link-button"     # enlaces a términos relacionados y al Blog
  - "ds:primitives/card"            # contenedor de la sección de relaciones
datos:
  - "apps/web/content/wiki/glosario.json  (entrada por slug: definicion + hiperonimos/hiponimos/relacionados)"
fuentes:
  - "la fuente de ingesta del concepto (términos de dominio; hipónimos = inversa del hiperónimo)"
depende-de:
  - "[[Wiki.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-06-21
---

# [Término]: `/wiki/<termino>`

> [!definition] Propósito
> **Plantilla de entrada de wiki** (`tipo: glossary-term`). Rellena los `[campos]`. Cada término es la **pieza GEO estrella**: una **respuesta extraíble** (definición literal arriba) + **FAQ**, conectada a los demás términos por **todos los ejes de relación** (hiperónimos ↑, hipónimos ↓, hermanos/relacionados ↔). Es la unidad que citan los motores generativos.

## Secciones

### 1 · Breadcrumb de hiperónimos (eje ↑)
Ruta de migas que sube por la jerarquía: `Wiki › [hiperónimo] › [Término]`. Permite viajar hacia conceptos más generales.

### 2 · Definición (respuesta extraíble)
El término abre con su `geo-respuesta-corta` **literal** como primer párrafo (lo que un LLM levanta). Después: contexto, matices y, cuando aplique, ejemplo de uso.

### 3 · Cuerpo del término
- **Título** del término (H1).
- **Texto de definición** (extraíble + ampliado).
- **Ejemplos / aplicación** dentro de [concepto].

### 4 · FAQ (GEO)
Bloque Q&A con las `geo-preguntas` → respuesta directa. `schema-tipo: FAQPage` adicional cuando aplique.

### 5 · Palabras relacionadas (antes del footer): navegación por ejes
La sección clave: poder **viajar por todos los ejes de relación**. Tres grupos de chips:
- **↑ Hiperónimos** (es-un / más general) → `hiperónimo`.
- **↓ Hipónimos** (tipos-de / más específico) → `hipónimos`.
- **↔ Hermanos / relacionados** (mismo campo semántico) → `relacionado` + `campo-semántico`.
- Opcional: **enlaces a artículos del [[Blog.es|Blog]]** que citen el término.

### 6 · Datos estructurados
`DefinedTerm` (con `inDefinedTermSet` apuntando a [[Wiki.es]]). `hreflang` ES↔EN (`/wiki/<termino>` ↔ `/en/wiki/<term>`).

## Componentes

> Binding al DS (`ds:<capa>/<nombre>`). Verificado por `pnpm validate:context`.

- **Definición** → tipografía del DS (`ds:primitives/typography`, vía render de contenido).
- **Chips de relaciones** → `ds:primitives/badge` (un color/variante por eje: ↑ hiperónimo · ↓ hipónimo · ↔ hermano).
- **Navegación por ejes** → `ds:primitives/link-button` (cada relación enlaza a su término) dentro de `ds:primitives/card`.
- **Breadcrumb de hiperónimos** → `ds:primitives/breadcrumb`.

> Diseño **mobile-first**: chips de relaciones envuelven (wrap) y se apilan en móvil.

## Pendiente / Bloqueos

- **¿Breadcrumb de hiperónimos** completo (toda la cadena ascendente) o solo el padre directo?
- **¿Grafo visual mini** de relaciones además de los chips, o solo chips?
- **¿Enlazar a artículos del [[Blog.es|Blog]]** que citen el término? ¿Automático o curado?
- ¿Un color/variante de `badge` por eje (↑/↓/↔), o un solo estilo con icono direccional?
