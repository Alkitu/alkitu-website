# knowledge-brain — guía del proyecto (plantilla base)

Base reutilizable para construir un **cerebro de conocimiento** sobre **cualquier
concepto** (medicina, derecho, finanzas, lo que sea): web bilingüe (ES raíz + EN
`/en/`) donde el conocimiento vive como una red de nodos auto-organizados,
optimizada para SEO y GEO (que la citen buscadores y modelos de IA).

> ⚙️ Esto es una **plantilla en blanco**. No contiene datos de ningún concepto:
> los nodos, el copy y la marca son placeholders. Instánciala siguiendo `SETUP.md`
> del kit padre. Al hacerlo, reemplaza este posicionamiento por el del concepto.

## 🧭 Regla #1 — Context manda (léelo antes que el código)

Todo se especifica primero en **`Context/`**, el blueprint vivo y **fuente de
verdad** de qué existe y **dónde vive su código**. El código es su consecuencia
(Spec-Driven Development). El sistema sabe auto-organizarse porque cada pieza de
conocimiento es un **nodo** con un contrato de metadatos fijo.

**Antes de tocar nada:**
1. Lee `Context/00-Index/🏠 Context — Índice.md` (mapa general + hot-paths).
2. Lee `Context/00-Index/📐 Context — Contrato.md` (reglas, frontmatter de 5 capas, protocolo).

## 🔥 Protocolo de hot-paths (no leas todo el repo)

**Pregunta conceptual/transversal** ("¿qué se relaciona con X?", "impacto de tocar Z"):
consulta el **grafo** primero (capa "vectorial" del repo), no grepees a ciegas:
- `Context/graphify-out/GRAPH_REPORT.md` → **god nodes** (abstracciones núcleo) y
  **comunidades** = mapa de navegación.
- `Context/graphify-out/graph.json` → nodos+edges para trazar relaciones exactas.
  Tras cambios estructurales, regenera con `pnpm graph`.

**Tarea sobre una sección concreta**:
1. Abre el **nodo** de esa sección en `Context/`.
2. Lee su **Capa 5** del frontmatter: `rutas-codigo`, `componentes`, `datos`, `fuentes`.
3. Esos son los **hot-paths** → lee y edita **solo eso**.
4. Si el código se crea/mueve, **actualiza la Capa 5 del nodo en el mismo cambio** (sync bidireccional).

Un nodo cuyo `rutas-codigo` no apunta a archivos reales está **desincronizado**: corrígelo.

## 🔄 Regla #2 — Sincroniza Context con cada cambio

Cualquier cambio estructural (nuevo nodo/página, mover código, decisión de
arquitectura, nueva convención) se refleja en **`Context/`**: el nodo afectado y/o
la **Bitácora** (`Context/99-Meta/Bitácora de decisiones.md`). Se pueden acumular,
pero antes de cerrar un turno con cambios estructurales sin registrar, **avisa** y
ofrece actualizar en lote. Tras tocar código: `pnpm validate:context` y, si cambió
la estructura, `pnpm graph`.

## 🎯 Regla #3 — Apunta antes de disparar

En toda acción (sobre todo destructiva: merge, deploy, `git push`, borrar/mover,
migraciones, `install`):
1. **Declara el límite de scope** antes de ejecutar (qué tocas y qué NO).
2. **Propón un "Done when:" observable** y verifica contra él al terminar.
3. **Ante un rechazo vago** ("no funciona"): diagnostica la causa probable y
   confírmala antes de tocar código.
4. **Merge/deploy con gate:** nunca sin que `pnpm build` y `pnpm validate:context` pasen.

## 💸 Regla #4 — Altitud y coste

1. **Cuestiona antes de picar código**: ¿lo resuelve el DS / un nodo / la stdlib? Reutilizar > escribir.
2. **Cambios quirúrgicos** hacia un objetivo verificable.
3. **Comandos compactos**: `git diff --stat`, `rg -l` acotado; nunca `ls -R` masivos ni `cat` de archivos grandes.
4. **Concisión**: resultado primero, datos sobre prosa.

## Monorepo (3 capas)

```
knowledge-brain/                 ← raíz (pnpm + git)
├── Context/                     ← 1) BLUEPRINT (qué/dónde/relaciones/componentes)
├── design-system/               ← 2) COMPONENTES (design system; el código nuevo vive aquí)
│   ├── web/    (@brain/design-system-web · Next/React/Tailwind v4/shadcn)
│   └── tokens/ (@brain/design-tokens + marca PLACEHOLDER)
└── apps/web/                    ← 3) WEB (@brain/web — Next 16 que ensambla 1+2)
```

- **Stack** (lo fija el DS): Next 16 · React 19 · Tailwind v4 · shadcn/Radix.
- **Componente nuevo** → se crea en `design-system/` (composición de primitivos), **nunca** suelto en `apps/web`.
- **Binding:** el nodo referencia componentes con `ds:<capa>/<nombre>`; `pnpm validate:context` comprueba que `componentes` y `rutas-codigo` resuelven a archivos reales.
- **Grafo unificado:** `pnpm graph` — las 3 capas en un grafo (`Context/graphify-out/`).
- `pnpm dev` arranca `apps/web`.

> El directorio del DS se sigue llamando `design-system/` por herencia de la
> plantilla; puedes renombrarlo (actualiza `pnpm-workspace.yaml` y este mapa).

## Cómo la web sabe auto-organizar su conocimiento

1. **Cada nodo = par `Nodo.es.md` + `Nodo.en.md`** con frontmatter de **5 capas**
   (semántica · SEO/URL · GEO · sitemap · implementación). El contrato es agnóstico
   al concepto: sirve para términos legales, médicos, financieros, etc.
2. **La taxonomía se declara en el frontmatter** (hiperónimo/hipónimos/relacionado)
   → `graphify` la convierte en grafo navegable (god nodes + comunidades).
3. **`validate:context`** garantiza que blueprint y código no se desincronicen.
4. **Las secciones** (Glosario/Wiki, Blog, Casos, Reviews, About, Contacto) son
   moldes genéricos: cada una lee su contenido del concepto y lo ensambla.
5. **SEO + GEO** salen del mismo contrato: definición extraíble primero, FAQ,
   entidades, datos citables → material que un LLM cita y un buscador rankea.

## Convenciones rápidas

- Optimizamos para **SEO y GEO**. Dominio apex del concepto; subdominio solo si una sección crece como app.
- Interlinking ES↔ES **y** EN↔EN.
- Registra decisiones estructurales en `Context/99-Meta/Bitácora de decisiones.md`.
- Al instanciar: reemplaza marca (tokens), renombra paquetes si quieres, define la
  taxonomía raíz del concepto y conecta la fuente de ingesta. Ver `SETUP.md` del kit.
