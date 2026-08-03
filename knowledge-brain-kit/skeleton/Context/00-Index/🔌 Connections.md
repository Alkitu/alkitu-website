---
title: Connections — Fuentes vivas
aliases: [Connections, Fuentes vivas, Datos volátiles, Conectores]
tipo: meta
nivel: raíz
dominio: [Meta]
estado: completo
creado: 2026-06-21
actualizado: 2026-06-21
---

# 🔌 Connections — Fuentes vivas

> Distinción clave (del modelo de "second brain"): **Context ≠ Connections.**
> - **Context** = lo **evergreen** (decisiones, blueprint, conocimiento que no se borra). Se **ingiere** y es la fuente de verdad.
> - **Connections** = lo **vivo/volátil** (datos que cambian semana a semana). **NO se ingiere** (sería ruido que habría que limpiar) — se le da al cerebro **acceso para ir a buscarlo bajo demanda**.

## Regla de oro
Antes de meter algo en Context, pregúntate: *¿esto seguirá siendo útil dentro de un año?*
- **Sí** → es evergreen → va a Context.
- **No** (cambia pronto) → es una Connection → **no lo copies**; documenta **dónde vive** y **cómo accederlo**.

## Fuentes vivas disponibles (conectores)

| Fuente | Acceso (MCP/herramienta) | Qué tiene |
|---|---|---|
| **Obsidian / vaults** | `mcp-obsidian` | la fuente de ingesta del concepto (glosario, notas, vaults) |
| **Supabase** | `claude.ai Supabase` | DB/auth/edge functions (cuando la web los use) |
| **MongoDB** | `mongodb-mcp-server` | colecciones/datos |
| **Figma** | `figma` MCP + skills | diseño del DS, variables, Code Connect |
| **Vercel** | `vercel` plugin | deploys, previews, env |
| **GitHub** | `gh` CLI | repos, PRs, issues |
| **Repos del ecosistema** | filesystem | fuentes de contenido/assets del concepto |

## Orden de lookup (cadena de fallback)

Para responder cualquier pregunta, en este orden, **parando en cuanto se encuentre**:

1. **`Context/`** — blueprint + hot-paths (¿está la respuesta en el mapa?).
2. **La fuente de ingesta del concepto** — wiki/glosario (conceptos, definiciones).
3. **El código** — vía `rutas-codigo` del nodo (¿está en la implementación?).
4. **Fuentes vivas** — los conectores MCP de arriba (¿está en una DB/Figma/repo?).
5. **Preguntar al responsable del proyecto** — si no vive en ningún sitio aún.

> Esto es lo que hace que el agente **sepa dónde mirar y en qué orden**, en vez de barrer todo o alucinar.

## Variables de entorno (nombres, no valores)

Los secretos viven en `apps/web/.env.local` (gitignored). Plantilla en `apps/web/.env.example`.
- **Base de datos** (Supabase/MongoDB según la stack elegida): URL de conexión + claves (pública/secreta).
- **Auth**: `AUTH_SECRET`.
- **Resend**: `RESEND_API_KEY` (secreta) · `RESEND_FROM` · `RESEND_TO`.
- **Regla**: ningún secreto en Context ni en git. Si se filtra uno (p. ej. por chat), **rotarlo**.

## Qué NO ingerir
Slack/emails, analítica cruda, datos de cliente, métricas que cambian a diario → **Connections, no Context**. El agente las consulta cuando hacen falta; no se copian al blueprint.
