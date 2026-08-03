---
title: Context — Contrato y Convenciones
aliases: [Contrato de Context, Convenciones, SEO Schema, GEO, Contribution Guide]
tipo: meta
nivel: raíz
dominio: [Meta]
estado: completo
creado: 2026-06-21
actualizado: 2026-06-21
---

# 📐 Context — Contrato y Convenciones

> `Context/` es el **cerebro del proyecto tuconcepto.com**: el **blueprint vivo** de lo que se va a construir y lo construido, y el **índice de dónde vive cada cosa**. La carpeta es la fuente de verdad; el código es su consecuencia (Spec-Driven Development).

---

## 0 · Para qué sirve Context (dos propósitos)

1. **Blueprint vivo.** Todo se especifica **primero aquí en texto** y luego se implementa. Si algo cambia, se actualiza **primero en Context** y el código sigue.
2. **Índice de hot-paths.** Cada nodo apunta a **las rutas de código que le dan vida**, para **localizar qué leer sin barrer el repo**.

> [!important] Regla de oro: el texto manda
> Blueprint y código **sincronizados en ambos sentidos**. Cuando el código se cree o mueva, se actualiza `rutas-codigo` del nodo **en el mismo cambio**. Un `rutas-codigo` que no resuelve a archivos reales = nodo **desincronizado**.

## 0.1 · Protocolo de localización (hot-paths)

> [!tip]
> Ante una tarea: 1) abre el **nodo** de la sección, 2) lee su **Capa 5** (`rutas-codigo`, `componentes`, `datos`, `fuentes`), 3) lee **solo eso**, 4) si el código cambió de sitio, **actualiza la Capa 5**. El `CLAUDE.md` raíz enruta a esto.

---

## 0.2 · Modelo de 3 capas y binding al DS

El sistema vive en **un monorepo** con tres capas que se referencian entre sí:

1. **Blueprint (`Context/`)** — qué se construye, dónde, sus relaciones semánticas/infra y **de qué componentes se compone** cada página.
2. **Componentes (`design-system/`)** — las piezas gráficas (atomic design). Lo nuevo nace aquí como composición de primitivos; **la web no inventa componentes sueltos**.
3. **Web (`apps/web/`)** — el código Next que ensambla componentes + contenido **siguiendo el blueprint**.

**Binding verificable:**
- El campo **`componentes`** (Capa 5) referencia componentes reales del DS con el formato **`ds:<capa>/<nombre>`** (p. ej. `ds:primitives/button`, `ds:patterns/service-card`). Capas: `primitives · compositions · patterns · integrations · showcase · foundations`.
- **`scripts/validate-context.mjs`** (`pnpm validate:context`) comprueba que cada `componentes` (`ds:*`) y cada `rutas-codigo` **resuelven a archivos reales**. Lo que no resuelve = **drift** → falla.
- **Gobernanza:** componente nuevo → se crea en `design-system/`, se referencia desde el nodo, y `rutas-codigo` apunta a su uso. Las 3 capas cambian en el **mismo commit**.

**Grafo unificado:** `scripts/graph.sh` (`pnpm graph`) corre graphify sobre las 3 capas → un grafo donde se ve **Página (Context) → componentes (DS) → rutas (web)**, para localizar hot-paths de las tres a la vez.

## 1 · Filosofía

Híbrido **LYT + Zettelkasten ligero** con **5 capas de metadatos**: identidad · SEO/URL · **GEO** · sitemap técnico · implementación. Una nota = un nodo (URL, colección o MOC). Single source of truth. Grafo con `graphify Context`.

## 1.1 · Posicionamiento (decidido)

> Web = cerebro de conocimiento sobre **[Concepto]**. Audiencia y posicionamiento: DEFINIR al instanciar. Autoridad de contenido y citabilidad por encima de venta.

## 1.2 · Reglas de diseño (mobile-first)

- **Mobile-first**: se diseña primero para móvil y se escala hacia arriba. Soportar incluso **smartwatch** (el contenido clave debe ser visible/usable en pantalla mínima).
- **Componentes responsivos o adaptativos**: cada componente del DS se adapta al breakpoint. Si un componente **no puede** serlo de forma razonable → **variantes por breakpoint** o se **oculta** en el dispositivo que no aplique (solo-desktop / solo-tablet / solo-mobile).
- **Componente nuevo vive en `design-system/`** (composición de primitivos: botones, textos, sombras…), nunca suelto en `apps/web`.
- Breakpoints de referencia: `watch` (clave, ~≤200px) · `mobile` · `tablet` · `desktop`.
- **Subdominios**: por defecto ninguno (todo en apex). Candidato si una sección crece como app propia; o `admin.`/ruta `(private)` para panel/login. Decidir por sección.

## 2 · SEO vs GEO (los dos motores)

| | **SEO** (buscadores) | **GEO** (motores generativos) |
|---|---|---|
| Objetivo | Rankear en Google/Bing | Que **te citen** ChatGPT, Perplexity, Gemini, AI Overviews |
| Unidad | La página y su keyword | La **respuesta extraíble** y la **entidad** |
| Señales | title, meta, backlinks, slug | respuesta directa, datos estructurados, citabilidad, claridad de entidad |
| Formato | prosa optimizada | **definición + FAQ + listas + tablas**, lo que un LLM puede levantar |

Optimizamos para **ambos**: el glosario y el blog son a la vez motor de SEO long-tail **y** de GEO (responden preguntas con datos citables → material perfecto para respuestas de IA).

## 3 · Plantilla de frontmatter (5 capas)

```yaml
---
# ── Capa 1: Identidad semántica ──
title: Nombre canónico del nodo
aliases: [Sinónimo, Variante EN]
tipo: page                                 # ver §5
nivel: hipónimo                            # hiperónimo | hipónimo | hermano
dominio: [Glosario]                        # sección (ver §6)
hiperónimo: "[[Nodo padre]]"
hipónimos: ["[[Hijo]]"]
campo-semántico: [tema, subtema]
relacionado: ["[[Otro nodo]]"]

# ── Capa 2: SEO + URL/dominio ──
titulo: "Título SEO | [Concepto]"         # <title>, ≤ 60 chars
metadescripcion: "Resumen…"                # ≤ 155 chars
keyword-principal: "palabra clave foco"
keywords-secundarias: [kw2, kw3]
tags: [tag1, tag2]
intencion-busqueda: informacional          # informacional|navegacional|comercial|transaccional
og-image: /og/nodo.png
dominio-raiz: tuconcepto.com               # dominio apex
subdominio: ""                             # vacío = apex; p.ej. "lab" → lab.tuconcepto.com (si aplica)
slug: /glosario                            # ruta bajo el dominio
query-params: []                           # params que la URL acepta, p.ej. [q, dominio]  (vacío = ninguno)
canonical: https://tuconcepto.com/glosario

# ── Capa 3: GEO (motores generativos) ──
geo-preguntas:                             # preguntas NL que el nodo debe responder (answer targeting)
  - "¿qué es …?"
geo-respuesta-corta: "Respuesta extraíble en 1-3 frases (lo que un LLM cita)."
geo-entidades: [Entidad1, Entidad2]        # entidades nombradas para grounding/knowledge graph
geo-datos-citables: []                     # hechos/stats/citas con fuente (citabilidad, E-E-A-T)
geo-formato: [definicion]                  # formatos extraíbles presentes: definicion|faq|lista|tabla|paso-a-paso
schema-tipo: WebPage                        # schema.org: DefinedTerm|FAQPage|Article|HowTo|Person|VideoGame…

# ── Capa 4: Sitemap técnico (sitemap.xml) ──
prioridad: 0.8                             # 0.0–1.0
frecuencia-cambio: monthly
idiomas: [es, en]
hreflang-alt: /en/glossary

# ── Capa 5: Implementación (sincronía con el CÓDIGO) ──
estado-implementacion: planeado            # planeado | en-progreso | construido | obsoleto
rutas-codigo: []                           # globs/paths del código (HOT-PATHS)
componentes: []
datos: []
fuentes: []
depende-de: []

estado: borrador                           # madurez de CONTENIDO: borrador | revisar | completo
creado: 2026-06-21
actualizado: 2026-06-21
---
```

> [!note] Campos dispersos por diseño
> `subdominio`, `query-params` y varios `geo-*` **no se usan en todos los nodos** — se rellenan solo donde aportan. Un campo vacío es válido y explícito.

## 4 · URL, dominio, subdominio y query params

- **`dominio-raiz`**: casi siempre `tuconcepto.com`.
- **`subdominio`**: por defecto vacío (apex). Candidato a subdominio si una sección crece como app propia (p. ej. `app.tuconcepto.com`), o un futuro panel. Decisión por sección; documentar aquí antes de implementar.
- **`slug`**: ruta bajo el dominio (ES en raíz, EN bajo `/en/`).
- **`query-params`**: parámetros que la página interpreta. Ejemplos por sección:
  - Glosario: `q` (búsqueda), `dominio` (filtro por subdominios del concepto, p. ej. Rama-A/Rama-B/Rama-C).
  - Blog: `categoria`, `tag`.
  - (Ejemplo de sección-app: params propios de esa app.)
  - **Regla SEO/GEO**: las URLs con query no son canónicas; `canonical` apunta siempre a la versión limpia (evita duplicados e indexación de combinaciones).

## 5 · Reglas SEO (no negociables)

1. `titulo` ≤ 60, con `keyword-principal`. 2. `metadescripcion` 120–155. 3. **Una** keyword por nodo, sin canibalización. 4. `slug` corto con la keyword. 5. Interlinking a hiperónimo + 1–3 relacionados (ES↔ES **y** EN↔EN). 6. `canonical` siempre.

## 6 · Reglas GEO (para que te citen los LLM)

1. **Respuesta primero**: cada nodo abre con `geo-respuesta-corta` literal en el contenido (los LLM levantan el primer párrafo que resuelve la pregunta).
2. **Q&A explícito**: incluir bloque FAQ con `geo-preguntas` → respuesta directa. Marcar con `schema-tipo: FAQPage` cuando aplique.
3. **Datos estructurados**: `schema-tipo` correcto por nodo (DefinedTerm para términos, Article para blog, Person para About).
4. **Entidades claras**: nombrar y enlazar `geo-entidades` (las entidades núcleo del concepto) → grounding consistente entre páginas.
5. **Citabilidad (E-E-A-T)**: afirmaciones con `geo-datos-citables` (hecho + fuente). Los LLM prefieren lo verificable.
6. **Formato extraíble**: definiciones, listas y tablas (`geo-formato`) por encima de prosa larga.
7. **`llms.txt`** en la raíz del dominio (estándar emergente): índice en texto plano de qué es el sitio y qué páginas son canónicas para que los agentes lo entiendan. **Implementado** como route handler en `app/llms.txt/route.ts`, que genera el índice desde el contenido real (blog, wiki, casos, reviews) — **no** desde un script `scripts/llms-txt.mjs`.

## 7 · Tipos (`tipo`)

`moc · page · collection · article · glossary-term · case-study · legal · system` (añade tipos propios del concepto si hacen falta).

> [!note] Excepción de formato — nodos de término migrados del vault
> Los nodos de término bajo `Context/03-Wiki/<subcarpetas>/` pueden conservar el **frontmatter nativo de su fuente** (`título · aliases · dominio · nivel · campo-semántico · relacionado · rutas-codigo`) en vez del de 5 capas: son **contenido** migrado de una fuente externa, no páginas con URL propia de sección. `validate:context` no les exige las Capas 2–3 (SEO/GEO); su capa SEO/GEO se añade al proyectarlos a `glosario.json`.

## 8 · Dominios (`dominio`) = secciones

`Landing · About · Glosario · Blog · Reviews · Casos de Estudio · Contacto · Meta · Legal` (secciones base; activa/añade las del concepto).

## 9 · Estados

- Contenido (`estado`): `borrador → revisar → completo`.
- Código (`estado-implementacion`): `planeado → en-progreso → construido → obsoleto`.

## 10 · graphify

```bash
graphify Context            # grafo completo → Context/graphify-out/
graphify Context --update   # incremental (caché por contenido)
```

## 11 · Fuentes externas

La **fuente de ingesta** del concepto (vault, DB o API) alimenta el Glosario y demás secciones. Se declara al instanciar y se accede bajo demanda (no se ingiere en Context; ver `SETUP.md` del kit).

---

> **Workflow:** verificar duplicado → `dominio`+`hiperónimo` → `tipo`/`nivel` → rellenar las **5 capas** (las que apliquen) → interlinking ES y EN → `rutas-codigo` si hay código → Índice + `99-Meta/Bitácora` → `graphify Context --update`.
