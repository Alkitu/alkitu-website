# @brain/web

La web del cerebro de conocimiento (**tuconcepto.com**). App **Next 16** que consume el design system del monorepo.

## Consume
- `@brain/design-system-web` — primitives, compositions, patterns, showcase, integrations.
- `@brain/design-tokens` + brand **default** (color PLACEHOLDER; reemplázalo por la marca del concepto).

## Finalizar (requiere red)
```bash
# desde la raíz del monorepo
pnpm install          # reconcilia el lockfile con el nuevo workspace
pnpm dev              # arranca esta app
```

## Estructura
- `app/` — App Router. Las rutas siguen el **blueprint** en `../../Context/`.
- `app/globals.css` — importa los estilos del DS + el brand default.
- *(próximamente)* `content/` — MDX del glosario / blog / casos (Content Collections).

## Reglas del sistema (3 capas)
- El **blueprint** (`Context/`) dicta qué páginas existen, sus URLs y **de qué componentes se componen**.
- Componente nuevo → se crea en **`design-system/`** (composición de primitivos), **no** aquí.
- Validar el binding página↔componente↔código: `pnpm validate:context` (desde la raíz).
