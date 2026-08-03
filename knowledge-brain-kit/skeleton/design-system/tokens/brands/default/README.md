# Brand: default

Marca personal de **[Concepto]**. Override de tokens semánticos sobre la base neutral del DS, con los valores reales de la web aprobada (auditoría 2026-07-03).

- **Color firma:** marca `placeholder`. (Sustituye al púrpura `#AD1DEA` del prototipo; la web nunca llegó a usar el púrpura.)
- **Superficie / tinta:** fondo `#f4f4f2`, texto `#2b2b2b`.
- **Qué cambia:** `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--primary-foreground`, `--ring`, `--accent`, `--border`, `--input`, `--muted-foreground` (y `--brand`, `--sidebar-*`). El resto (radios, sombras, tipografía) se hereda del DS → cambia la *piel*, no la estructura.
- **Primitivas:** los semánticos alias-an a `../../primitives/colors.css` (`--lk-marca`, `--lk-fondo`, `--lk-tinta`, escala neutral). Ningún hex suelto en la web: solo clases-token.
- **Contraste:** blanco sobre primario ≈ AA para texto normal.
- **Dark:** deshabilitado a propósito (no hay diseño dark aprobado); `dark.css` es un marcador vacío y no se importa.

## Activación

`tokens/index.css` es el entry point: importa primitivas + brand light. La app web lo consume tras el globals del DS:

```css
@import "@brain/design-system-web/globals.css";
@import "@brain/design-tokens"; /* → index.css: primitivas + brand default (marca) */
```

## Ampliar / regenerar

Para una paleta completa (escala 50–950, estados, charts) usar las utilidades del DS:
`web/lib/color-generator.ts` + `web/lib/theme-css-generator.ts`, partiendo de `placeholder`.
