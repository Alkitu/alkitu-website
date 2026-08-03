---
title: Context — Índice
aliases: [Índice, Context Index, Mapa del proyecto, Home, MOC raíz]
tipo: moc
nivel: raíz
dominio: [Meta]
hipónimos:
  - "[[Landing.es]]"
  - "[[About.es]]"
  - "[[Wiki.es]]"
  - "[[Blog.es]]"
  - "[[Reviews.es]]"
  - "[[Casos.es]]"
  - "[[Contacto.es]]"
campo-semántico: [índice, blueprint, arquitectura, hot-paths, mapa de contexto]
estado: completo
creado: 2026-06-21
actualizado: 2026-06-21
---

# 🏠 Context — Índice · [Concepto]

> Punto de entrada al **blueprint vivo** de este cerebro de conocimiento sobre
> **[Concepto]**. Bilingüe ES (raíz) + EN (`/en/`). Reglas y protocolo en
> [[📐 Context — Contrato]]. Plantilla en blanco: reemplaza los placeholders al instanciar.

## Árbol del sitio

```
tuconcepto.com
├── 🏠 Landing                /              · /en/
├── 👤 About                  /sobre-mi      · /en/about
├── 📖 Wiki (Glosario)        /wiki          · /en/wiki         ← motor SEO long-tail. Nombre canónico: Wiki
├── ✍️ Blog                   /blog          · /en/blog
├── ⭐ Reviews                 /reviews       · /en/reviews
├── 📂 Casos de Estudio       /casos-de-estudio · /en/case-studies
└── ✉️ Contacto               /contacto      · /en/contact
```

> Secciones **base** del kit. Activa, renombra o añade las que pida el concepto
> (p. ej. Jurisprudencia para derecho, Protocolos para medicina). Cada sección
> nueva = nodo `.es`+`.en` con frontmatter de 5 capas.

## Estado de contenido (los nodos)

| Sección | Tipo | ES | EN | Nodos |
|---|---|:--:|:--:|---|
| Landing | page | ⬜ | ⬜ | [[Landing.es]] · [[Landing.en]] |
| About | page | ⬜ | ⬜ | [[About.es]] · [[About.en]] |
| **Wiki** (Glosario) | collection | ⬜ | ⬜ | [[Wiki.es]] · [[Wiki.en]] |
| · Término (plantilla) | glossary-term | ⬜ | ⬜ | [[Wiki-Termino.es]] |
| Blog | collection | ⬜ | ⬜ | [[Blog.es]] · [[Blog.en]] |
| · Entrada (plantilla) | article | ⬜ | ⬜ | [[Blog-Entrada.es]] |
| **Reviews** | collection | ⬜ | ⬜ | [[Reviews.es]] · [[Reviews.en]] |
| · Entrada (plantilla) | article | ⬜ | ⬜ | [[Review-Entrada.es]] |
| Casos de Estudio | collection | ⬜ | ⬜ | [[Casos.es]] · [[Casos.en]] |
| · Entrada (plantilla) | case-study | ⬜ | ⬜ | [[Caso-Entrada.es]] |
| Contacto | page | ⬜ | ⬜ | [[Contacto.es]] · [[Contacto.en]] |
| 🔒 Login | admin | ⬜ | ⬜ | [[Login.es]] |
| 🔒 Estadísticas | admin | ⬜ | ⬜ | [[Estadisticas.es]] |

Leyenda contenido: 🟢 completo · 🟡 borrador · ⬜ pendiente (todo en blanco en el kit).

## 🔥 Mapa de código / Hot-paths (índice de implementación)

> Dónde vive el código de cada sección. **Stack: Next 16 + React 19 + Tailwind v4**
> (monorepo pnpm: `apps/web` ensambla el DS). La fuente de verdad por nodo es su
> **Capa 5**. Las rutas son las del motor; el **contenido** lo pones tú.

| Sección | Rutas de código (hot-paths) | Datos | Fuente que la alimenta |
|---|---|---|---|
| Landing | `app/[lang]/page.tsx` (ES+EN) | — | — |
| About | `app/[lang]/sobre-mi/page.tsx` | — | — |
| Glosario (Wiki) | `app/[lang]/wiki/[termino]/page.tsx` · `lib/glosario.tsx` · `content/wiki/glosario.json` | términos (JSON) | ingesta del concepto |
| Blog | `app/[lang]/blog/` · `lib/content/blog.ts` · `content/blog/*.mdx` | frontmatter MDX | — |
| Reviews | `app/[lang]/reviews/` · `_data/reviews.ts` | reviews (data file) | ingesta del concepto |
| Casos de Estudio | `app/[lang]/casos-de-estudio/` · `_data/casos.ts` | casos (data file) | — |
| Contacto | `app/[lang]/contacto/` · `_actions.ts` (Resend) | — (email) | — |
| Admin | `app/(private)/admin/` | MongoDB (auth) + content | — |
| SEO/GEO (infra) | `app/sitemap.ts` · `app/robots.ts` · `app/opengraph-image.tsx` · `app/llms.txt/` · `lib/seo/` | — | — |
| i18n (infra) | `middleware.ts` · `lib/i18n/` (config · route-map.json · dictionaries · pares) | mapa slugs ES↔EN + pares hreflang | — |

> [!note] Dominio, subdominio y query
> Todo vive en el apex `tuconcepto.com`. Subdominio solo si una sección crece como
> app propia. Query params por sección (Glosario `?q,dominio`; Blog `?categoria,tag`);
> las URLs con query **nunca son canónicas**. Optimizamos para **SEO y GEO**.

## 🏗️ Arquitectura del sistema (las 3 capas)

- **Blueprint** = este `Context/` (el blueprint vivo, Spec-Driven Development).
- **Componentes** = `design-system/` (design system; el código nuevo nace aquí).
- **Web** = `apps/web/` (Next que ensambla blueprint + componentes).
- **Frontmatter de 5 capas** — contrato de metadatos de cada nodo. Su **Capa 5** = hot-paths.
- **Binding al DS (`ds:<capa>/<nombre>`)** — lo verifica `pnpm validate:context`.
- **graphify** — genera el grafo (`graphify-out/`) para navegar relaciones sin barrer el repo.

## Cómo usar este Context

1. **Para entender el proyecto** → lee [[📐 Context — Contrato]].
2. **Para una tarea de código** → abre el nodo de la sección, lee su **Capa 5** (hot-paths), lee solo eso.
3. **Para ver relaciones** → `Context/graphify-out/graph.html`.
4. **Decisiones** → [[Bitácora de decisiones]].

---

**Tags**: #context #blueprint #hot-paths #seo #bilingue
