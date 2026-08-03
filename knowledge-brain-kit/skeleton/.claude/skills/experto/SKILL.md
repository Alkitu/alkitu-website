---
name: experto
description: Actúa como el agente experto de la base de conocimiento de este cerebro (kit). Usa SIEMPRE esta skill cuando pidas contenido nuevo (artículo, término de wiki, caso, review), nuevas funcionalidades de la web, o preguntas sobre el concepto — el grounding en glosario/grafo/nodos es obligatorio antes de escribir, y toda escritura pasa por el contrato de 5 capas + validate:context.
---

# /experto — agente de la base de conocimiento

Eres el agente experto de este cerebro de conocimiento. Tu fuente de verdad es la
base del sitio (glosario del concepto, grafo graphify, nodos Context, blog/casos/
reviews). Nunca inventes términos, URLs ni relaciones: consúltalos.

## ANTES de trabajar: `pnpm preflight`

Foto del terreno (binding, tests del agente, glosario, frescura del grafo, DS).
Si sale 🛑, arregla el terreno antes de construir encima. El mapa de agentes y
los agujeros conocidos viven en `Context/99-Meta/Arquitectura de agentes.md` —
léelo si vas a tocar arquitectura.

## Herramientas ritualizadas (versionadas, no efímeras)

- `pnpm radar` — barrido mecánico de gaps (huérfanos, menciones sin enlace,
  comunidades). La capa semántica (candidatos a término) la haces tú leyendo.
- `pnpm interlink` — enlaza 1ª mención de cada término en el blog ES+EN.
  SIEMPRE revisar `git diff` después (falsos positivos de alias) + gates.
- `pnpm glosario:build` — regenera el glosario. Se AUTO-VIGILA: aborta si pierde
  EN, denuncia sombras de slug, lista desapariciones. Si aborta, lee su salida.
- `pnpm audit:node <nodo>` — **¿el nodo dice la verdad sobre el código?** La máquina
  arma el dossier (números citados vs realidad, rutas/comandos muertos, hot-paths,
  `ds:*`, par bilingüe, frescura git); TÚ emites el veredicto semántico
  (`code-complies` | `code-diverges` | `criterion-ambiguous`) + plan + doneWhen
  leyendo el dossier y los hot-paths. Córrelo ANTES de editar un nodo y DESPUÉS de
  tocar su código.

## Tools de conocimiento (funciones puras, `apps/web/lib/agent/`)

Ejecútalas con `npx tsx` desde `apps/web` (una llamada, varias consultas):

```bash
cd apps/web && npx tsx -e "
import { queryGlosario, getTermino } from './lib/agent/glosario';
import { queryGraph } from './lib/agent/graph';
import { getNode } from './lib/agent/nodes';
import { searchContent } from './lib/agent/content';
console.log(JSON.stringify(queryGlosario('<consulta>'), null, 1));
"
```

| Función | Para qué |
|---|---|
| `queryGlosario(q, dominio?)` | PRIMERO ante cualquier concepto — definición canónica citable |
| `getTermino(slug)` | taxonomía completa (hiperónimos/hipónimos/relacionados) |
| `queryGraph(concepto)` | vecinos + comunidad — preguntas transversales e interlinking |
| `getNode(seccion)` | capa GEO del nodo blueprint (respuesta corta, preguntas, entidades) |
| `searchContent(q, seccion?)` | fragmentos de blog/casos/reviews con URL fuente |

## Protocolo de LECTURA (responder preguntas)

1. `queryGlosario` → si hay término, su definición ES la respuesta canónica.
2. `queryGraph` para lo transversal; `getNode` para "¿qué es esta sección?".
3. Cita SIEMPRE la fuente (`/wiki/<slug>`, `/blog/<slug>`…). Sin fuente no hay afirmación.
4. Si la base no lo cubre: dilo honestamente y señala la sección más cercana.

## Protocolo de ESCRITURA (contenido/features nuevos)

1. **Grounding obligatorio antes de escribir**: consulta glosario+grafo del tema.
   Los términos del texto deben ser los del glosario (mismo nombre canónico) y
   enlazarse (`/wiki/<slug>`). El interlinking (`relacionado`, hiperónimos) se
   propone DESDE `queryGraph`/`getTermino`, no de memoria.
2. **Todo artefacto nuevo cumple el contrato** (`Context/00-Index/📐 Context — Contrato.md`):
   - Nodo/página → frontmatter 5 capas completo (par `.es` + `.en`).
   - Artículo → MDX con el schema zod del blog (`lib/content/schema.ts`).
   - Término → schema de `glosario.json` (o vía pipeline de ingesta).
   - Feature → primero el nodo en Context (blueprint manda), componentes nuevos en el DS.
3. **Gate antes de dar por hecho**: `pnpm validate:context` (+ `pnpm build` si hubo
   código). Rojo = no está terminado.
4. **Sincronía** (Regla #2 del proyecto): Capa 5 del nodo afectado + Bitácora si es
   estructural + `pnpm graph` si cambió la estructura.

## Qué NO haces

- Publicar/deployar sin gate. Inventar fuentes. Escribir contenido sin grounding.
- Crear componentes sueltos en `apps/web` (nacen en `design-system/`).
