---
title: Arquitectura de agentes
aliases: [Mapa de cerebros, Propiocepción del sistema, Agent Architecture]
tipo: meta
nivel: raíz
dominio: [Meta]
estado: completo
rutas-codigo:
  - "apps/web/lib/agent/"
  - "apps/web/scripts/agent/"
  - "scripts/preflight.mjs"
  - "scripts/build-glosario.py"
  - ".claude/skills/experto/SKILL.md"
creado: 2026-07-26
actualizado: 2026-07-26
---

# 🧠 Arquitectura de agentes — el mapa de cerebros del sistema

> Qué inteligencias operan sobre este cerebro de conocimiento, qué toca cada una,
> cómo deciden qué fuente usar y dónde están sus límites. La "propiocepción" del
> sistema no vive en ningún agente: vive en estos archivos versionados — los
> agentes son intercambiables; el esquema no. **Al instanciar el concepto, revisa
> este nodo: añade los cerebros propios de tu web (chatbots, copilotos) y ajusta
> los agujeros que apliquen.**

## Los cerebros (y sus fronteras duras)

| Cerebro | Qué es | Cuándo actúa | Frontera |
|---|---|---|---|
| **Claude (sesión)** | Desarrollo, skill `/experto`, tooling, radar, grafo, contenido | Cuando trabajas en la terminal | Muere al cerrar sesión; solo persiste lo escrito |
| **Agente eve** (opcional) | Widget de chat público sobre la base de conocimiento | Si activas el widget (ver `SETUP.md`) | Apagado por defecto |
| **graphify (backend LLM)** | Extracción semántica del grafo | **Absorbido por Claude**: la extracción la hace el agente de sesión, sin keys externas | — |

> Al instanciar, si tu web añade un agente en producción (un copiloto, un
> asistente con su propia API key), documéntalo aquí como cerebro nuevo con su
> frontera dura (qué toca, con qué credencial, qué NO comparte con los demás).

## El esquema corporal (dónde vive la propiocepción)

```
CLAUDE.md            → reglas de conducta del agente de sesión
Context/             → qué existe y dónde vive su código (5 capas; hot-paths)
glosario.json        → qué sabe el sistema (fuente: ingesta del concepto)
graphify-out/        → cómo se relaciona lo que sabe
Bitácora             → por qué es como es (memoria episódica)
.claude/skills/experto → cómo debe pensar el agente antes de actuar
apps/web/lib/agent/  → los sentidos: funciones puras que leen todo lo anterior
validate:context + gate → sistema nervioso: detecta drift, bloquea ship en rojo
```

## Árbol de decisión del agente de sesión (qué fuente usar)

1. **¿Pregunta del dominio/contenido del sitio?** → tools (`queryGlosario`, grafo,
   nodos). Sin fuente no hay afirmación; la respuesta canónica es la del sistema,
   aunque el modelo "sepa" la respuesta genérica.
2. **¿Estructura/código?** → protocolo hot-paths (grafo → nodo → Capa 5 → solo eso).
3. **¿Oficio general?** (cómo funciona Next, YAML, HMAC…) → conocimiento del modelo.
4. **¿Conducta?** → CLAUDE.md + skills + Bitácora.

La frontera fina es 1↔3: ante un término que el modelo conoce genéricamente pero
existe en la wiki, **gana la wiki** (es la entidad del sistema, no la del modelo).

## Cobertura: estructural + semántica

- **`pnpm validate:context`** — cobertura **estructural**: ¿existe lo que el nodo
  declara? Incluye un **ratchet de huérfanos** (`MAX_HUERFANOS`): todo archivo de
  `apps/web/app` debería tener un nodo que lo reclame; el número solo puede bajar.
  Al instanciar, asigna los huérfanos del arranque a sus nodos y baja el tope.
- **`pnpm audit:node <nodo>`** — cobertura **semántica**: ¿el nodo dice la verdad
  sobre el código? La máquina arma el dossier (cifras citadas vs realidad, rutas y
  comandos muertos, hot-paths, `ds:*`, par bilingüe, frescura git); el agente emite
  el veredicto. La máquina reúne hechos, no juzga intención.
- **`pnpm preflight`** — foto del terreno ANTES de trabajar (binding, tests del
  agente, glosario+EN, frescura del grafo, componentes DS sin import).

## Agujeros conocidos de la propiocepción (backlog de integridad)

Heredados del diseño del kit; revísalos al instanciar:

1. **Grafo puede quedar desfasado**: si añades nodos sin regenerar, `graphify-out/`
   se atrasa. `pnpm preflight` lo hace visible; el agente lo actualiza proyectando
   el frontmatter de cada nodo (sin keys externas).
2. **Dos grafos, dos verdades**: `graphify-out/` raíz (unificado 3 capas, `pnpm graph`)
   vs `Context/graphify-out/` (capa Context, lo lee el agente). El agente lee el de Context.
3. **Sombras de slug en el glosario**: `build-glosario.py` deduplica por slug —
   pero **denuncia y aborta** si una nota perdería contra otra del mismo slug.
4. **Huérfanos de código**: acotados por el ratchet de `validate:context` (solo baja).
5. **Componentes DS sin control de redundancia**: `pnpm preflight` lista los que
   nadie importa; antes de crear un componente, busca uno equivalente en el DS.
6. **`lib/agent` es un snapshot del kit**: si mejoras las tools en tu instancia,
   esas mejoras no vuelven al kit solas (ni al revés). Sincronización manual.
7. **`build-glosario.py` auto-vigilado pero sin tests de regresión**: aborta ante
   pérdida de traducciones EN y denuncia sombras, pero esa lógica no tiene test propio.

> Este nodo ES parte de la propiocepción: si la arquitectura de agentes cambia
> (nuevo cerebro, nueva regla de fuentes, agujero cerrado), se actualiza aquí
> en el mismo cambio.
