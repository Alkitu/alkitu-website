# Migrations — cómo se aplican en este proyecto

> **TL;DR:** las migraciones se aplican con el **MCP de Supabase** o el **SQL Editor** del
> dashboard, **no** con `supabase db push`. Y **nunca** ejecutes el
> `supabase migration repair --status reverted ...` que el CLI sugiere.

## Convención: subcarpetas por dominio

```
supabase/migrations/
├── analytics/    contact/     newsletter/
├── auth/         profiles/    projects/
├── blog/         *.sql (sueltos, histórico)
```

Organizar por dominio hace el repo legible, pero tiene una consecuencia importante:

**El CLI de Supabase solo lee `supabase/migrations/*.sql` de primer nivel — ignora las
subcarpetas por completo.** Para el CLI, casi todas nuestras migraciones "no existen".

## Estado real (verificado 2026-08-03)

| | |
|---|---|
| Archivos locales | 26 |
| Entradas en el historial remoto | 42 |

Las dos listas **no se corresponden**:

- **16 migraciones remotas nunca se guardaron como archivo.** Se aplicaron desde el
  dashboard o el MCP (todo el esquema de billing, varias políticas RLS, `seed_projects_batch_2`,
  `remove_bio_character_limit`, etc.).
- **Las que sí se corresponden tienen timestamps distintos.** Ejemplo:
  `projects/20241215000001_create_projects_schema.sql` en local, pero en remoto figura como
  `20251214040511 create_projects_schema`. Mismo contenido, otra versión.
- Algunos archivos locales no llegaron nunca al remoto (`auth/*`,
  `projects/20260320000001_restructure_categories.sql`, …).

## Por qué `db push` y `db pull` fallan

Ambos exigen que el set local refleje exactamente el historial remoto. Como no es el caso,
los dos abortan y **sugieren la misma solución destructiva**:

```
supabase migration repair --status reverted 20260303195909   # ← NO
```

Marcar como `reverted` una migración que **sí está aplicada** hace que un `db push` posterior
intente **re-ejecutarla**: `create_billing_schema` contra tablas que ya existen, `seed_projects`
duplicando filas, etc. Es la forma más rápida de romper la base. Ignora esa sugerencia.

## Cómo aplicar una migración nueva

1. Escribe el `.sql` en la subcarpeta de su dominio (`blog/`, `profiles/`, …) con timestamp
   `YYYYMMDDHHMMSS_nombre_en_snake_case.sql`.
2. Aplícala con el MCP de Supabase (`apply_migration`, que además la registra en el historial)
   o pegándola en el SQL Editor del dashboard.
3. Verifica con `supabase migration list` o consultando
   `supabase_migrations.schema_migrations`.

Los seeds de contenido grandes **no** van como migración — se hacen con un script idempotente
en `scripts/` (ver `scripts/blog-import.ts`, que hace upsert sobre `(locale, slug)` y se puede
re-ejecutar sin duplicar).

## Si algún día se quiere `db push` funcionando (CI/CD)

Requiere reconciliar los dos universos, y es un trabajo aparte con riesgo real:

1. Volcar el esquema actual como **baseline** único y archivar las subcarpetas como
   documentación histórica; **o**
2. Reconstruir los 16 `.sql` que faltan a partir del esquema vivo y renombrar ~20 archivos
   para que su timestamp coincida con la versión remota, todo a primer nivel (se pierde la
   organización por dominio).

Hasta entonces, MCP/dashboard es el camino soportado y es el que se ha usado siempre.
