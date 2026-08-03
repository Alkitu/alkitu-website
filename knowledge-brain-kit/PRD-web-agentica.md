# PRD — Web Agéntica (knowledge-brain + agente experto de su propio contenido)

**Versión:** 1.1 · **Fecha:** 2026-07-23 · **Estado:** en ejecución — E1 ✅ · E2 ✅ · E3 ✅ (opcional) · E4-E6 redefinidas (ver §9 Pivot)

> **⚠️ Pivot v1.1 (decisión de Leonel):** el agente es **para el dueño del sitio, no
> para visitantes**. El canal principal pasa a ser **Claude Code** (el asistente
> actúa como el agente experto, con las mismas tools de conocimiento y además
> capacidad de escritura validada). El widget público (E3/eve) queda como
> **capacidad opcional del kit** para forks que sí quieran chat de cara al público
> — construido y verificado, no se instala en leonelkrea.com. Ver §9.
**Ámbito:** `knowledge-brain-kit/skeleton` (motor) + `leonelkrea.com` (primera instancia real)

---

## 1 · Visión

Cada cerebro de conocimiento construido con el kit expone, además de la web, un
**agente experto de su propio contenido**: responde preguntas del concepto usando
exclusivamente la base de conocimiento del sitio (glosario, nodos, grafo, blog,
casos) y — en fase 2 — **produce contenido nuevo dentro del propio sistema de
reglas** (nodos con frontmatter de 5 capas, validados por `validate:context`).

El agente se hereda en cada fork del kit: clonar el kit = nacer con web + agente.

**Framework:** [eve](https://eve.dev) (Vercel, beta) — filesystem-first: `agent/`
con `instructions.md`, `agent.ts`, `tools/*.ts`. Corre en Vercel Functions con
sesiones durables (Workflows) y modelos vía AI Gateway.

## 2 · Por qué es viable ya (análisis previo)

El 80% del coste de un agente experto es curar/estructurar conocimiento. Ya está:

| Necesita un agente | Ya existe en la estructura |
|---|---|
| System prompt | `CLAUDE.md` + `Contrato.md` (protocolo hot-paths = estrategia de retrieval) |
| Conocimiento consultable | `glosario.json` · `casos.ts` · `reviews.ts` · MDX blog |
| Índice de relaciones | `graph.json` + `GRAPH_REPORT` (god nodes, comunidades) |
| Respuestas pre-extraídas | frontmatter Capa 3 (`geo-respuesta-corta`, `geo-preguntas`, entidades) |
| Guardarraíl de escritura | `validate:context` (schema 5 capas como contrato de output) |
| Sesión anónima | `lib/session.ts` (cookie HMAC edge-safe) |
| Infra | Next + Vercel, AI Gateway disponible |

Falta solo la capa fina: runtime eve + tools que leen assets existentes.

## 3 · Requisitos funcionales

### FR-1 · Runtime del agente (eve)
- `agent/` en el monorepo según convención eve: `instructions.md`, `agent.ts`, `tools/`.
- `instructions.md` = destilado del Contrato + Índice: identidad ("experto en [Concepto]"),
  orden de lookup (glosario → grafo → nodos → contenido), regla de oro: **responder
  solo desde tools, citando el nodo/término fuente**; si no está en la base, decirlo.
- `agent.ts`: modelo vía AI Gateway (string `provider/model` configurable por instancia).

### FR-2 · Tools de lectura (fase 1)
Cada tool = `defineTool` + lectura de un asset existente. Sin DB nueva, sin embeddings.

| Tool | Fuente | Devuelve |
|---|---|---|
| `query_glosario(q, dominio?)` | `content/wiki/glosario.json` | términos que matchean (slug/título/aliases/definición) |
| `get_termino(slug)` | ídem | término completo + hiperónimos/hipónimos/relacionados |
| `query_graph(concepto)` | `Context/graphify-out/graph.json` | vecinos, comunidad, god node más cercano |
| `get_node(seccion)` | frontmatter del nodo Context | Capa 3 GEO (respuesta corta, preguntas, entidades) + hot-paths |
| `search_content(q, seccion?)` | MDX blog + data casos/reviews | fragmentos con ruta/slug fuente |
| `list_secciones()` | `llms.txt` route / Índice | mapa del sitio con descripciones |

### FR-3 · Canal web (fase 1)
- Widget de chat en la web: componente nuevo en `design-system/` (patterns), consumido
  por `apps/web` (regla del monorepo: componentes nacen en el DS).
- Consume la API de sesiones de eve (`/eve/v1/session` + stream NDJSON).
- Identidad de sesión: reutiliza `lib/session.ts` (cookie `kb_sid`).
- Bilingüe: responde en el idioma de la pregunta (ES/EN).

### FR-4 · Tools de escritura validada (fase 2)
- `draft_termino(datos)` → propone entrada de glosario con el schema de `glosario.json`.
- `draft_node(tipo, datos)` → genera nodo Context con frontmatter 5 capas completo.
- `draft_articulo(tema)` → MDX con frontmatter válido según el schema zod del blog.
- `propose_interlinks(slug)` → sugiere `relacionado`/hiperónimos usando el grafo.
- **Gate duro:** todo draft pasa por `validate:context` (y el schema zod si es MDX)
  antes de aceptarse. Output inválido = rechazado con el error como feedback al modelo.
- **Human-in-the-loop:** los drafts NO se publican; quedan en cola de revisión en
  `/admin` (nueva sección "Drafts del agente"). Publicar = acción humana.

### FR-5 · Seguridad y guardarraíles
- Fase 1 = **solo lectura**. Tools de escritura (fase 2) solo con sesión admin (Auth.js existente).
- Rate-limit por sesión en el endpoint del agente (patrón rate-limiter ya probado en el origen).
- El agente nunca ejecuta código ni toca el filesystem fuera de sus tools.
- Sin datos personales en prompts; sesiones anónimas.

### FR-6 · Observabilidad
- Agent Runs en el dashboard Vercel (sesiones, turnos, tools, tokens) — lo da eve.
- Métrica propia mínima: nº de sesiones/día y top preguntas sin respuesta (gap de contenido → alimenta el backlog editorial).

## 4 · Requisitos no funcionales

- **NFR-1 Coste:** modelo pequeño por defecto para lookups (las tools hacen el trabajo);
  configurable por instancia. Respuestas desde `geo-respuesta-corta` cuando exista (0 generación extra).
- **NFR-2 Latencia:** streaming NDJSON desde el primer token; tools de lectura < 100 ms (fs local).
- **NFR-3 Anti-alucinación:** política "solo desde tools + cita de fuente". Pregunta fuera
  de la base → respuesta honesta "no está en mi base" + sección más cercana vía grafo.
- **NFR-4 Portabilidad (riesgo eve beta):** las tools se escriben como **funciones puras**
  (`lib/agent/*.ts`) envueltas por `defineTool`. Si eve cambia de API o se descarta,
  se re-envuelven con AI SDK / Tool Runner sin reescribir la lógica.
- **NFR-5 Herencia:** todo lo del agente vive en rutas genéricas del kit; un fork no
  necesita tocar nada del agente salvo `instructions.md` (2-3 líneas de identidad).

## 5 · Épicas y orden

| # | Épica | Alcance | Done when |
|---|---|---|---|
| **E1** | Fundación eve | `agent/` + instructions destiladas + `agent.ts` + eve en el monorepo | `pnpm dev` levanta el endpoint de sesión y responde un "hola" con identidad correcta |
| **E2** | Tools de lectura | Las 6 tools FR-2 como funciones puras + wrappers | El agente responde 10 preguntas de prueba citando término/nodo fuente; pregunta fuera de base → respuesta honesta |
| **E3** | Canal web | Widget chat en DS + integración en `apps/web` + sesión + stream | Chat usable en la web local, bilingüe, con streaming |
| **E4** | Instalación en leonelkrea.com | Copiar `agent/` + wiring de rutas; eval con los 427 términos y grafo real | Mismo done de E2/E3 pero sobre datos reales; gate `build`+`validate:context` verde |
| **E5** | Escritura validada | Tools FR-4 + cola de drafts en admin + gate | Un draft inválido es rechazado por el gate con feedback; uno válido aparece en admin para revisión |
| **E6** | Docs del kit | `SETUP.md` §8 (activar agente), `EXTRACTION-MAP` actualizado, este PRD → estado | Un fork nuevo activa su agente siguiendo solo el SETUP |

**Fases:** F1 = E1-E4 (agente de lectura en ambos). F2 = E5-E6 (escritura + docs).

## 6 · Estrategia de implementación: kit primero, leonelkrea segundo

**Decisión: se construye en el kit y se instala en leonelkrea.com (E4), no al revés.**

1. **Descontaminar es caro** (lección de este proyecto: 3 fases + 2 agentes).
   Construir en leonelkrea y extraer después = repetir ese coste. Construir genérico
   una vez e instalar dos veces = casi copy-paste, porque leonelkrea **tiene la misma
   estructura** (el kit es su abstracción; mismos schemas de glosario/grafo/frontmatter).
2. **El kit es el objetivo multiplicador** ("clonar y hacer webs agénticas"): el agente
   debe nacer genérico para heredarse en cada fork.
3. **El stub del kit (1 término) no valida calidad** → por eso E4 (leonelkrea, 427
   términos + grafo real) es el **entorno de evaluación real** y va inmediatamente
   después de E2/E3, antes de la fase 2.

## 7 · Riesgos

| Riesgo | Mitigación |
|---|---|
| eve en beta (API cambia / se descarta) | NFR-4: lógica en funciones puras; re-envolver con AI SDK cuesta horas, no días |
| Alucinación / respuestas fuera de base | NFR-3: solo-desde-tools + citas + respuesta honesta |
| Coste de tokens en producción | NFR-1 + rate-limit + modelo pequeño por defecto |
| Escritura contamina el blueprint | FR-4: gate `validate:context` + human-in-the-loop; el agente nunca publica |
| Stub del kit insuficiente para probar | E4 con datos reales de leonelkrea como eval obligatoria de fase 1 |

## 8 · Fuera de alcance (v1)

- Embeddings / búsqueda vectorial (el grafo + aliases cubren; reevaluar si el corpus > ~2k items).
- Multi-agente, canales externos (Slack/WhatsApp), voz.
- Auto-publicación sin revisión humana.
- Fine-tuning.

## 9 · Pivot v1.1 — canal dueño (Claude Code) sobre canal público

**Decisión:** el usuario del agente es Leonel, no el visitante. Consecuencias:

| Épica | v1.0 | v1.1 |
|---|---|---|
| E3 widget chat | Canal principal | **Opcional del kit** (hecha; forks con público la activan vía SETUP §8; leonelkrea NO la instala) |
| E4 instalación leonelkrea | Widget + eve + eval | **Portar `lib/agent/` (funciones puras + tests) + skill `/experto` de Claude Code**; sin eve, sin widget, sin deps nuevas |
| E5 escritura validada | Tools eve + cola admin | **La ejerce Claude Code vía skill**: grounding con las tools → draft con frontmatter 5 capas + interlinking desde el grafo → gate `validate:context` antes de darlo por hecho. Sin cola admin (el humano ya está en el loop: es la conversación) |
| E6 docs | igual | igual + registrar el pivot en la Bitácora de leonelkrea |

**Racional:** para uso propio, Claude Code domina a eve en todo (lee, escribe, valida,
buildea, conversa) y no necesita credenciales de Gateway. eve solo aportaba valor de
cara al público — ese caso queda disponible en el kit, no activo por defecto en la
instancia del dueño. Las funciones puras (`lib/agent/`) sirven a AMBOS canales sin
cambios (NFR-4 cumplido: mismo conocimiento, distinto cerebro).

**Done when (v1.1):**
- `lib/agent` en leonelkrea.com con tests verdes contra los 427 términos y el grafo real.
- Skill `/experto` invocable en el repo; toda petición de contenido/features pasa por
  grounding (glosario→grafo→nodos) y escritura dentro del contrato.
- Demo: 1 borrador de artículo groundeado con frontmatter válido y `validate:context` verde.
- Bitácora de leonelkrea actualizada. Gates verdes.
