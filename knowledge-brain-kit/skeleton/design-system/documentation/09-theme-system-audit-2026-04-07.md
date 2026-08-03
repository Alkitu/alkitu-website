---
id: theme-theme-system-audit
version: "1.2.0"
last_updated: "2026-04-29"
updated_by: "Claude Code"
status: active
type: guide
review_cycle: 90
---

# Theme System Audit

> **Última verificación contra el código:** 2026-04-29 01:39 CEST.
> **Compilación TypeScript:** `tsc --noEmit` pasa con 0 errores.

El sistema de tema funciona en runtime gracias a **patrones de fallback resilientes** en `globals.css` y a estilos inline a nivel de componente. Sin embargo, persisten varias inconsistencias estructurales entre el schema de Prisma, los generadores CSS y los tipos TypeScript. Este documento mantiene **únicamente** los hallazgos que se pueden verificar contra el código actual y que no están ya tratados como problemas a resolver en `.problems-to-solve-design-system.md`.

> Los siguientes hallazgos previos se movieron a `.problems-to-solve-design-system.md` para evitar duplicación:
>
> - Fragmentación de tipografía (antes "Issue 1 — Three incompatible typography type systems").
> - Brecha de emisión de variables `--radius-*` desde Theme Forge (antes "Issue 2 — applyBorderElements MISSING component-specific radii").
> - Tokens huérfanos `--info` / `--info-foreground` (antes mencionado en "Issue 5").

---

## 1. Hallazgos vigentes

| # | Hallazgo | Severidad | Estado |
|---|----------|-----------|--------|
| 1 | `generateSpacingCSS()` puede emitir CSS malformado | MEDIA | OPEN |
| 2 | Sombras componente-específicas sólo cubiertas por fallback | BAJA | OPEN (por diseño) |
| 3 | `DbTheme` usa `any` para campos JSON | BAJA | OPEN |
| 4 | Variables de transición y z-index estáticas | INFO | Por diseño |
| 5 | Dos generadores CSS paralelos (SSR + runtime) | INFO | Intencional |

---

## 2. `generateSpacingCSS()` — bug latente

**Severidad: MEDIA.** Si `themeData.spacing` viene con la forma de `ThemeSpacing` (objeto con `spacing` + `scale`), el generador SSR produce CSS malformado.

```ts
function generateSpacingCSS(themeData: any): string {
  const spacing = themeData?.spacing;
  return Object.entries(spacing)
    .map(([key, value]) => `    --spacing-${key}: ${value};`)
    .join('\n');
}
```

Con `themeData.spacing = { spacing: "2.2rem", scale: { xs: "0.25rem" } }` esto emite:

- `--spacing-spacing: 2.2rem;` (debería ser `--spacing: 2.2rem;`)
- `--spacing-scale: [object Object];` (objeto serializado como string)

No ha reventado porque el campo `spacing` se persiste como `Json` y, en el cliente, `applySpacingElements()` lo blindara con `if (loadedTheme.spacing && Object.keys(loadedTheme.spacing).length > 0)` antes de aplicar.

Fix sugerido:

```ts
function generateSpacingCSS(themeData: any): string {
  const spacing = themeData?.spacing;
  if (!spacing?.spacing) return '';
  const properties: string[] = [`    --spacing: ${spacing.spacing};`];
  if (spacing.scale && typeof spacing.scale === 'object') {
    Object.entries(spacing.scale).forEach(([key, value]) => {
      if (typeof value === 'string') properties.push(`    --spacing-${key}: ${value};`);
    });
  }
  return properties.join('\n');
}
```

---

## 3. Sombras componente-específicas — sólo fallback

**Severidad: BAJA.** `globals.css` define `--shadow-button`, `--shadow-card`, `--shadow-dialog`, `--shadow-popover`, `--shadow-dropdown`, `--shadow-tooltip`, `--shadow-toast` apuntando a un nivel de la escala base (`--shadow-sm`/`-md`/`-lg`/`-xl`/`-2xl`).

El sistema de tema sólo emite las 8 variables base (`--shadow-2xs` … `--shadow-2xl`) — `ThemeShadows` sólo tiene esos campos. Eso significa que el editor no controla la sombra de un tipo específico de componente; sólo controla la escala global y los componentes la heredan vía `var(--shadow-card, var(--shadow-md))`.

Es aceptable como diseño actual. Si en el futuro se requiere granularidad (p. ej. "diálogos con sombra más pesada que tarjetas"), habría que extender `ThemeShadows` y agregar UI dedicada.

---

## 4. `DbTheme` — `any` en campos JSON

**Severidad: BAJA.**

```ts
interface DbTheme {
  lightModeConfig: any;
  darkModeConfig: any;
  typography?: any;
  themeData?: any;
}
```

Prisma devuelve `JsonValue`, pero todo se castea a `any`. Consecuencias:

- Sin autocompletado al acceder a `theme.colors.primary` etc.
- Sin error de compilación si la forma del JSON cambia.
- Sin validación de que el JSON guardado coincida con `ThemeColors`/`ThemeBorders`/etc.

Fix sugerido: tipar `DbThemeData` con la forma esperada y validar en el límite de lectura con Zod (los schemas ya existen en `@brain/shared`).

---

## 5. Transiciones y z-index — estáticos por diseño

**Severidad: INFO.** `--transition-fast`, `--transition-base`, `--transition-slow`, `--transition-theme` y `--z-dropdown` … `--z-toast` viven en `globals.css` y nunca son emitidos por el sistema de tema. Es intencional: estos tokens no necesitan personalización por tema.

---

## 6. Dos generadores CSS paralelos — arquitectura intencional

| Archivo | Propósito | Consumidor |
|---------|-----------|-----------|
| `lib/theme/css-variables.ts` | API de inyección genérica | (Sin call sites en runtime) |
| `lib/theme/inline-css-generator.ts` | Genera `<style>` en SSR | `layout.tsx` (server) |
| `theme-forge/lib/utils/css/css-variables.ts` | Inyección en DOM (runtime) | `ThemeEditorContext` (client) |

`lib/theme/css-variables.ts` parece una API unificada planeada que aún no está cableada al pipeline. La emisión real está dividida entre el inline-generator (SSR) y el módulo CSS del theme-editor (cliente). Ver tracking de "fragmentación de generadores" en `.problems-to-solve-design-system.md`.

---

## 7. Resumen de prioridad

| # | Hallazgo | Severidad | Impacto | Esfuerzo |
|---|----------|-----------|---------|----------|
| 1 | `generateSpacingCSS()` malformado | MEDIA | CSS roto si spacing tiene forma `ThemeSpacing` | Bajo |
| 2 | Sombras componente-específicas estáticas | BAJA | Sin control granular por tipo | Medio |
| 3 | `DbTheme` con `any` | BAJA | Sin type safety en frontera DB | Medio |
| 4 | Transiciones / z-index estáticos | INFO | Por diseño | — |
| 5 | Dos generadores paralelos | INFO | Intencional | — |

Para los problemas de mayor envergadura (tipografía dual, brecha en `--radius-*`, tokens huérfanos `--info`, package mobile vacío) ver el listado vigente en `.problems-to-solve-design-system.md`.
