---
title: Bitácora de decisiones
aliases: [Decision Log, Changelog estructural]
tipo: meta
nivel: raíz
dominio: [Meta]
estado: completo
creado: 2026-06-21
actualizado: 2026-06-21
---

# 📝 Bitácora de decisiones — Context · [Concepto]

> Registro cronológico de decisiones estructurales. Consultar antes de mover/renombrar carpetas o cambiar convenciones. Se pueden acumular varias decisiones antes de registrarlas, pero no se dejan pasar en silencio.

> **Sin decisiones aún — registra aquí.** Formato: una entrada por decisión, con fecha en el encabezado y el detalle debajo. Ejemplo:

## AAAA-MM-DD — Título breve de la decisión

Descripción de la decisión estructural: qué se decidió, por qué, y qué nodos/archivos afecta. Enlaza los nodos implicados con `[[Nodo]]`.

- **Contexto**: qué motivó la decisión.
- **Decisión**: qué se acordó.
- **Impacto**: qué se toca (nodos, rutas de código, convenciones).
- **Verificado**: `pnpm validate:context` y, si cambió la estructura, `pnpm graph`.
