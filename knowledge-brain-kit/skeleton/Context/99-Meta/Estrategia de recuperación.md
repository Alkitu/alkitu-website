---
title: Estrategia de recuperación (niveles)
aliases: [Niveles, Retrieval strategy, Knowledge-base levels]
tipo: meta
nivel: raíz
dominio: [Meta]
estado: completo
creado: 2026-06-21
actualizado: 2026-06-21
---

# 🧠 Estrategia de recuperación (niveles)

> Marco de "5 niveles de second brain" aplicado a nuestro sistema. **Regla madre:** usa el **nivel más bajo que resuelve el dolor**. Sin dolor, no añadas arquitectura. Y **no todo el repo es un solo nivel** — cada carpeta puede estar en uno distinto.

## Niveles
1. **Router** — `CLAUDE.md`/`AGENTS.md` + carpetas; búsqueda exacta/routing.
2. **Wiki** — índices (MOCs) + drill-down; seguir un rastro y leer la página entera.
3. **Semántico** — vectores/embeddings; búsqueda por **significado** (X≈Y).
4. **Knowledge graph** — entidades + relaciones tipadas (graphify).
5. **Always-on** — sync autónomo (crons). *(No lo usamos — ver abajo.)*

## Nivel por carpeta (estado actual)

| Carpeta | Nivel | Por qué |
|---|---|---|
| `Context/` | **1 + 4** | Router (blueprint) + grafo de relaciones (graphify) |
| La fuente de ingesta del concepto | **2** | Wiki con MOCs e hiperónimos; candidato a **3** (semántico) |
| `Glosario` (contenido, futuro) | **3 + 4** | Búsqueda por significado + grafo de términos |
| Design system | **4** | Grafo de componentes (AST: qué compone qué) |
| Connections (vivo) | — | No es un nivel: es la capa volátil de **acceso bajo demanda** ([[🔌 Connections]]) |

## Plan de búsqueda semántica (Nivel 3) — pendiente de contenido

Hoy tenemos keyword + grafo, pero **no búsqueda por significado**. Cuando la Wiki/Blog tengan contenido real:

- **Por carpeta, no global**: solo vectoriza lo que se beneficia (glosario, blog, transcripts). El resto sigue en markdown.
- **Vectores vs markdown**: vectores para *aguja en pajar* (un snippet de un corpus enorme); **markdown para contexto completo** (un resumen necesita el archivo entero — los vectores trocean y pierden el todo).
- **Implementación** (cuando aplique): embeddings locales o un store ligero; indexar `apps/web/content/**`. Se decidirá al construir el contenido. *No se implementa ahora (no hay contenido).*

## Principio anti-Nivel 5 (decisión)

**No añadimos always-on / crons de auto-ingesta sin un dolor concreto.** Riesgo del L5: demasiado contexto hace más daño que bien, y perdemos el control de qué entra. Mantenemos la ingesta **bajo control humano**. `pnpm graph`/`--update` se corren a mano cuando cambia la estructura — eso basta.

> Nota honesta: ya estamos en Nivel 4 (grafo) + binding para una web de conocimiento. Parte va **por delante del dolor**, pero se mantiene porque **es la metodología del proyecto** (Spec-Driven Development), no por moda. La línea roja es el Nivel 5.
