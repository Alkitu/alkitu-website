---
# ── Capa 1: Identidad semántica ──
title: Wiki
aliases: [Glosario, Glossary, Diccionario, Términos, Enciclopedia]
tipo: collection
nivel: hiperónimo
dominio: [Wiki]
hiperónimo: "[[🏠 Context — Índice]]"
hipónimos: ["[[Wiki-Termino.es]]"]
campo-semántico: [wiki, glosario, definiciones, términos]
relacionado:
  - "[[Blog.es]]"
  - "[[Wiki-Termino.es]]"

# ── Capa 2: SEO + URL/dominio ──
titulo: "Wiki de [Concepto] | [Concepto]"
metadescripcion: "Wiki abierta con cientos de términos de [concepto], definidos y conectados entre sí. Índice alfabético y buscador gratis."
keyword-principal: "wiki de [concepto]"
keywords-secundarias: ["glosario de [concepto]", "términos de [concepto]", "diccionario de [concepto]"]
tags: [wiki, glosario, "[concepto]"]
intencion-busqueda: informacional
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""                       # apex
slug: /wiki
query-params: [q, dominio, letra]    # q = búsqueda; dominio = silo temático; letra = A–Z
canonical: https://tuconcepto.com/wiki

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:
  - "¿qué es [término]?"
  - "¿qué significa [término] en [concepto]?"
  - "wiki / glosario de términos de [concepto]"
geo-respuesta-corta: "Wiki abierta que define y conecta entre sí, con índice alfabético y buscador, los términos clave de [concepto]."
geo-entidades: ["[Concepto]", "[Dominio temático]"]
geo-datos-citables:
  - "[N] términos estructurados en [M] dominios/silos temáticos; 0 enlaces rotos"
geo-formato: [definicion, lista, faq]
schema-tipo: DefinedTermSet

# ── Capa 4: Sitemap técnico ──
prioridad: 0.9
frecuencia-cambio: weekly
idiomas: [es, en]
hreflang-alt: /en/wiki

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/wiki/page.tsx"                  # server: cabecera + lista ligera
  - "apps/web/app/[lang]/wiki/_components/WikiBuscador.tsx"  # client: buscador + filtros por dominio + índice A–Z
  - "apps/web/lib/glosario.tsx"                   # índice del glosario + auto-enlazado (compartido con el blog)
  - "apps/web/content/wiki/glosario.json"         # snapshot generado (términos)
  - "scripts/build-glosario.py"                   # generador: fuente de ingesta → glosario.json
componentes:                        # binding al DS (verificado por scripts/validate-context.mjs)
  - "ds:compositions/command"       # buscador ⌘K de la wiki
  - "ds:primitives/input"           # campo de búsqueda
  - "ds:primitives/badge"           # chips de dominio y filtro por letra
  - "ds:primitives/card"            # tarjeta/celda de término en el listado
  - "ds:primitives/link-button"     # enlaces del índice A–Z
datos:
  - "apps/web/content/wiki/glosario.json  (términos en varios dominios; regenerar con `pnpm glosario:build`)"
fuentes:
  - "la fuente de ingesta del concepto (notas-concepto de dominio con relaciones hiperónimo/hipónimo/relacionado en el frontmatter)"
depende-de:
  - "[[Wiki-Termino.es]]"

estado: borrador
creado: 2026-06-21
actualizado: 2026-07-12
---

# Wiki: `/wiki`

> [!definition] Propósito
> El **motor de SEO/GEO long-tail** de la web. Una página estilo enciclopedia con **toda la lista de términos como enlaces**, ordenada **alfabéticamente** y en **diseño multi-columna**, con **buscador** e **índice A–Z**. Cada término tiene página propia (`/wiki/<termino>`) y se conecta con los demás por ejes de relación. Demuestra autoridad y atrae tráfico informacional sostenido.

## Origen del contenido

Los términos provienen de **la fuente de ingesta del concepto** (notas de dominio ya estructuradas en silos temáticos). Cada término migra añadiendo la **capa SEO/GEO** sobre su frontmatter. El detalle de la página por término vive en la plantilla [[Wiki-Termino.es]].

## Secciones

### 1 · Buscador (header de la wiki)
Búsqueda instantánea sobre el título y los alias de cada término. Estilo paleta de comandos (⌘K). Refleja el estado en el query-param `q`. Sin resultados → sugiere términos cercanos.

### 2 · Índice alfabético (A–Z)
Barra navegable de letras `A · B · C … Z` (más `#`/`0-9` y `Otros` para símbolos/diacríticos). Al pulsar una letra se filtra el listado y se actualiza el query-param `letra`. Ancla de scroll a cada bloque de letra. **Diseño de varias columnas** para el listado.

### 3 · Filtro por dominio
Chips conmutables por **silo temático** (badge). Acotan el listado y alimentan el query-param `dominio`. Combinables con `letra` y `q`.

### 4 · Listado multi-columna de términos
La lista completa de palabras, **cada una como enlace** a `/wiki/<termino>`. Orden **alfabético**, agrupado por letra, en **layout de varias columnas** (estilo índice de enciclopedia). Estilo similar al [[Blog.es|Blog]] pero ordenado por abecedario en vez de cronológicamente.

### 5 · Datos estructurados
`DefinedTermSet` que envuelve la colección; cada ítem referencia su `DefinedTerm` (la página de término). `hreflang` ES↔EN (`/wiki` ↔ `/en/wiki`).

## Componentes

> Binding al DS (`ds:<capa>/<nombre>`). Verificado por `pnpm validate:context`.

- **Buscador** → `ds:compositions/command` + `ds:primitives/input`.
- **Índice A–Z navegable** → `ds:primitives/link-button` (enlaces de letra) + `ds:primitives/badge` (letra activa).
- **Filtro por dominio** → `ds:primitives/badge` (chips de silo temático conmutables).
- **Listado de términos** → `ds:primitives/link-button` por término + `ds:primitives/card` para agrupar bloques de letra.
- **Layout multi-columna** → composición responsiva. No reinventar en `apps/web`.

> Diseño **mobile-first**. **Columnas por breakpoint (sugerido):** móvil = **2** · tablet = **3** · desktop = **5** (sobre retícula de 12; 4–6 es aceptable según densidad).

## Plan de migración (pendiente de priorizar)

1. Elegir subconjunto inicial de términos de mayor volumen de búsqueda.
2. Añadir capa SEO/GEO + slug a cada uno (plantilla [[Wiki-Termino.es]]).
3. Tejer los ejes de relación (hiperónimos ↑ · hipónimos ↓ · hermanos ↔).
4. Generar los silos temáticos.

## Notas SEO + GEO

- **SEO**: silos temáticos = clusters; enlazar término ↔ término ↔ artículo de [[Blog.es|blog]]. Cada término hereda los enlaces de la fuente de ingesta (0 enlaces rotos). URLs con query (`q`, `dominio`, `letra`) **no canónicas**; `canonical` apunta siempre a `/wiki` limpio.
- **GEO**: cada término abre con su **definición literal** (respuesta extraíble), lleva `schema-tipo: DefinedTerm`, nombra sus `geo-entidades` y, cuando aplica, un bloque **FAQ**. Formato que los motores generativos (ChatGPT, Perplexity, AI Overviews) citan.

## Implementación / Hot-paths

> Capa 5 = dónde vive el código de esta sección. Protocolo en [[📐 Context — Contrato]].

**Para añadir o cambiar un término de la wiki**, los hot-paths son:
- **Contenido del término** → `datos` (un archivo por término en `content/wiki/**`).
- **Render del término** → página `/wiki/<termino>` (ver [[Wiki-Termino.es]]).
- **Índice/búsqueda** → componentes del buscador + índice A–Z + listado multi-columna.
- **Origen** → la fuente de ingesta del concepto (de donde se migra el término).

## Pendiente / Bloqueos

- **¿Índice A–Z navegable** como barra fija, o selector compacto en pantallas pequeñas?
- **¿Filtro por dominio** visible siempre o plegable en móvil?
- **¿Cuántos términos migramos primero** (subconjunto inicial vs. todos de golpe)?
- **¿El layout multi-columna** es un componente nuevo en el DS o composición de primitivos existentes (`card` + `link-button` + grid)?
