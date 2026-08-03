# Color System Architecture

> **Live Reference:** [http://localhost:3000/es/color-system](http://localhost:3000/es/color-system)

How a color flows from the Design System to a rendered component in Alkimia Core.

## Complete Flow

```mermaid
flowchart TD
    subgraph DS["Design System (packages/design-system/)"]
        A1["globals.css<br/>-----------<br/>231 Color Primitives<br/>--color-red-50 -> --color-red-950<br/>--color-blue-50 -> --color-blue-950<br/>...(21 families x 11 shades)"]
        A2["globals.css :root<br/>-----------<br/>45 Semantic Tokens<br/>--primary: oklch(0.205 0 0)<br/>--background: oklch(1 0 0)<br/>--chart-1 -> --chart-5<br/>--sidebar-* tokens"]
        A3["globals.css .dark<br/>-----------<br/>45 Semantic Tokens (dark)<br/>--primary: oklch(0.922 0 0)<br/>--background: oklch(0.145 0 0)"]
        A4["themes.css<br/>-----------<br/>Class toggles for base neutral<br/>html.theme-slate -> --color-neutral-* = --color-slate-*<br/>html.theme-gray<br/>html.theme-zinc<br/>html.theme-stone<br/>html.theme-black"]
        A5["ThemeProvider<br/>-----------<br/>applyThemeTokens()<br/>Sets 17 tokens via inline style:<br/>--primary, --secondary, --accent,<br/>--ring, --chart-1->5, --sidebar-*"]
        A6["theme-config.ts<br/>-----------<br/>ThemeConfig type:<br/>baseColor, brandColor, font,<br/>radius, spacing, shadow, transition"]
    end

    subgraph WEB["Alkimia Core (packages/web/)"]
        B1["globals.css<br/>-----------<br/>@import DS globals.css<br/>@import DS themes.css<br/>-----------<br/>@layer base: typography rules<br/>h1->h4, p, small, code<br/>inherit from --typography-* vars<br/>-----------<br/>Component-specific:<br/>--radius-button, --shadow-card,<br/>--typography-button-*, z-index"]
        B2["tailwind.config.ts<br/>-----------<br/>Maps ALL 45 tokens to classes:<br/>bg-primary -> var(--primary)<br/>text-foreground -> var(--foreground)<br/>border-border -> var(--border)<br/>bg-chart-1 -> var(--chart-1)<br/>..."]
        B3["GlobalThemeProvider<br/>-----------<br/>DSThemeProvider (outermost)<br/>└── ThemeEditorProvider<br/>    └── DSConfigSync<br/>        watches state.dsThemeConfig<br/>        calls setThemeConfig()"]
        B4["Theme Forge<br/>-----------<br/>Quick Setup:<br/>  NeutralSelector -> baseColor<br/>  PrimarySelector -> brandColor<br/>  FontSelector -> font<br/>  RadiusPreset -> radius<br/>-----------<br/>Semantic Token Overrides:<br/>  Per-token color picker<br/>  -> state.activeOverrides<br/>  -> style.setProperty()"]
        B5["DSConfigSync<br/>-----------<br/>1. Detects dsThemeConfig change<br/>2. Calls setThemeConfig() on DS<br/>3. ThemeProvider re-applies presets<br/>4. Re-applies activeOverrides on top"]
    end

    subgraph RENDER["Rendered Component"]
        C1["Button component<br/>-----------<br/>className='bg-primary<br/>text-primary-foreground'<br/>-----------<br/>Tailwind resolves to:<br/>background: var(--primary)<br/>color: var(--primary-foreground)"]
        C2["Recharts Bar<br/>-----------<br/>fill={resolvedHex}<br/>-----------<br/>resolveColor('--chart-1')<br/>-> reads from DOM<br/>-> checks activeOverrides first"]
        C3["h1 element<br/>-----------<br/>@layer base rule:<br/>font-size: var(--typography-h1-font-size)<br/>font-weight: var(--typography-h1-font-weight)<br/>font-family: inherit (from ThemeProvider)"]
    end

    A1 -->|"imported by"| B1
    A2 -->|"imported by"| B1
    A3 -->|"imported by"| B1
    A4 -->|"imported by"| B1
    A6 -->|"consumed by"| A5
    A5 -->|"inline styles on :root"| C1
    B1 -->|"CSS vars available"| B2
    B2 -->|"Tailwind classes"| C1
    B3 -->|"mounts"| A5
    B4 -->|"dispatches SET_DS_CONFIG"| B5
    B5 -->|"calls setThemeConfig()"| A5
    B4 -->|"SET_ACTIVE_OVERRIDES"| C1
    B4 -->|"style.setProperty()"| C2
    B1 -->|"@layer base typography"| C3
```

## Token Lifecycle

```mermaid
sequenceDiagram
    participant DS as DS globals.css
    participant TP as ThemeProvider
    participant TE as Theme Editor
    participant DOM as document.documentElement
    participant TW as Tailwind Class
    participant UI as Component

    Note over DS: Page loads
    DS->>DOM: :root { --primary: oklch(0.205 0 0) }
    DS->>DOM: :root { --chart-1: oklch(0.81 0.1 252) }
    
    Note over TP: ThemeProvider mounts
    TP->>DOM: style.setProperty('--primary', 'var(--color-neutral-900)')
    TP->>DOM: style.setProperty('--chart-1', 'var(--color-neutral-800)')
    TP->>DOM: classList.add('theme-neutral')
    
    Note over UI: Component renders
    UI->>TW: className="bg-primary"
    TW->>DOM: reads var(--primary)
    DOM->>UI: oklch(0.205 0 0) -> renders dark background

    Note over TE: User selects "Blue" in Quick Setup
    TE->>TE: dispatch SET_DS_CONFIG { brandColor: 'blue' }
    TE->>TP: DSConfigSync -> setThemeConfig({ brandColor: 'blue' })
    TP->>DOM: style.setProperty('--primary', 'var(--color-blue-600)')
    TP->>DOM: style.setProperty('--chart-1', 'var(--color-blue-600)')
    UI->>TW: className="bg-primary" (same class)
    TW->>DOM: reads var(--primary)
    DOM->>UI: #2563eb -> renders blue background

    Note over TE: User overrides --chart-1 to red
    TE->>DOM: style.setProperty('--chart-1', '#dc2626')
    TE->>TE: dispatch SET_ACTIVE_OVERRIDES { '--chart-1': '#dc2626' }
    Note over UI: Charts re-resolve
    UI->>DOM: resolveColor('--chart-1')
    DOM->>UI: #dc2626 -> chart bar turns red
```

## CSS Specificity Chain

```mermaid
flowchart LR
    subgraph SPECIFICITY["Who wins? (highest -> lowest)"]
        S1["Inline style<br/>(ThemeProvider +<br/>activeOverrides)<br/>-----------<br/>HIGHEST"]
        S2["Unlayered CSS<br/>(DS globals.css)<br/>-----------<br/>HIGH"]
        S3["@layer base<br/>(Web globals.css)<br/>-----------<br/>LOW"]
        S4["Tailwind utilities<br/>(generated classes)<br/>-----------<br/>LOWEST*"]
    end

    S1 --> S2 --> S3 --> S4

    style S1 fill:#ef4444,color:#fff
    style S2 fill:#f97316,color:#fff
    style S3 fill:#eab308,color:#000
    style S4 fill:#22c55e,color:#fff
```

> *Tailwind utilities read from CSS variables, so they automatically reflect whichever value wins above.

## Token Categories

```mermaid
graph LR
    ROOT["45 Semantic Tokens"]

    ROOT --> STR["Structure<br/>background, body-background,<br/>foreground, foreground-alt,<br/>ghost-foreground"]
    ROOT --> PRI["Brand / Primary<br/>primary, primary-foreground,<br/>primary-hover, ring"]
    ROOT --> SEC["Secondary / Muted / Accent<br/>secondary+fg, muted+fg,<br/>accent+fg"]
    ROOT --> CAR["Card / Popover<br/>card+fg, popover+fg"]
    ROOT --> INP["Inputs / Borders<br/>border, input"]
    ROOT --> DES["Destructive<br/>destructive+fg,<br/>destructive-subtle,<br/>destructive-border"]
    ROOT --> STA["Status<br/>success+fg, warning+fg,<br/>info+fg"]
    ROOT --> OVR["Overlays<br/>ghost-hover, backdrop"]
    ROOT --> SCR["Scrollbar<br/>scrollbar-track,<br/>scrollbar-thumb,<br/>scrollbar-thumb-hover"]
    ROOT --> CHT["Charts<br/>chart-1 to chart-5"]
    ROOT --> SDB["Sidebar<br/>sidebar+fg,<br/>sidebar-primary+fg,<br/>sidebar-accent+fg,<br/>sidebar-border, sidebar-ring"]

    style STR fill:#f0fdf4,stroke:#16a34a
    style PRI fill:#eff6ff,stroke:#2563eb
    style SEC fill:#faf5ff,stroke:#9333ea
    style DES fill:#fef2f2,stroke:#dc2626
    style STA fill:#fffbeb,stroke:#d97706
    style CHT fill:#ecfeff,stroke:#0891b2
    style SDB fill:#f8fafc,stroke:#64748b
```

## Override Behavior

```mermaid
flowchart TD
    A["User changes --chart-1 in<br/>Semantic Token Overrides"] --> B{"Token set by<br/>ThemeProvider?"}
    
    B -->|"NO (28 tokens)<br/>background, card, border,<br/>destructive, success, etc."| C["Override sticks OK<br/>CSS default replaced<br/>by inline style"]
    
    B -->|"YES (17 tokens)<br/>primary, secondary, accent,<br/>chart-1->5, sidebar-*"| D["Override applied OK<br/>Stored in activeOverrides<br/>Re-applied after ThemeProvider"]
    
    D --> E["DSConfigSync re-applies<br/>overrides after every<br/>ThemeProvider update"]
    
    C --> F["Component reads<br/>var(--token) -> new value"]
    E --> F
```

## File Map

```
Design System (source of truth)
├── web/app/globals.css          ← 231 primitives + 45 semantic tokens + typography
├── web/app/themes.css           ← neutral scale class toggles (6 options)
├── web/components/theme-provider.tsx  ← applies 17 tokens via JS inline styles
└── web/lib/theme-config.ts      ← ThemeConfig type + constants

Alkimia Core (consumer)
├── src/app/[lang]/globals.css   ← imports DS + component-specific tokens
├── tailwind.config.ts           ← maps ALL 45 tokens to Tailwind classes
├── src/context/GlobalThemeProvider.tsx  ← DSConfigSync bridge
└── src/components/features/theme-forge/
    ├── core/context/             ← state: dsThemeConfig + activeOverrides
    ├── theme-editor/editor/colors/
    │   ├── ds-preset-selectors.tsx  ← Quick Setup (presets)
    │   └── semantic-token-overrides.tsx  ← Per-token overrides
    └── preview/tabs/elements/    ← Elements preview (reads resolved colors)
```

## Brechas conocidas en la cadena de tokens

> Las métricas globales de "completitud" se retiraron porque mezclaban capas (cobertura de Theme Forge, cobertura de Tailwind, cobertura de la cascada CSS) y daban una falsa sensación de integridad. Lo que sí es accionable es el listado concreto de tokens que la app emite vs. los que quedan congelados en CSS estático.

- **Spacing:** `ThemeProvider` solo setea `--spacing-lg`. El resto de la escala (`--spacing-xs` … `--spacing-3xl`) existe en CSS pero no responde al `SpacingPresetSelector`. Muchos componentes consumen clases Tailwind con valores fijos (`p-4`, `gap-3`).
- **Shadows:** se emiten `--shadow-card` y `--shadow-card-hover`. Sombras de botón, diálogo y tooltip (`--shadow-button`, `--shadow-dialog`, `--shadow-tooltip`) viven como valores estáticos.
- **Border-radius:** la app emite un subconjunto reducido de variables `--radius-*`. El resto de los radios queda servido por fallbacks en `globals.css`. Tracking detallado: ver `.problems-to-solve-design-system.md`.
- **Tipografía:** existen dos definiciones distintas de `ThemeTypography` en el código (`packages/web/src/types/typography.ts` vs. `packages/web/src/components/features/theme-forge/core/types/theme.types.ts`). Tracking en `.problems-to-solve-design-system.md`.
- **Tokens huérfanos:** `--info` y `--info-foreground` se definen en `globals.css` para `:root` y `.dark`, pero no aparecen en `ThemeColors` ni en `CSS_VARIABLE_MAP`, por lo que Theme Forge no puede editarlos. Tracking en `.problems-to-solve-design-system.md`.

## Advanced Overrides (Future: Per-Component)

The current Semantic Token Overrides system allows changing global CSS variables
(`--primary`, `--chart-1`, etc.) that affect ALL components using that token.

The next level is **per-component overrides** — changing a property for ONE specific
component without affecting others. This would work by ID or component class.

### How it would work

```
Global Override (current):
  --radius: 0.5rem         -> ALL rounded-lg components get 0.5rem

Per-Component Override (future):
  #login-button { --radius: 9999px }    -> only login button gets full round
  .card-stats  { --shadow-card: none }  -> only stat cards lose shadow
  #hero-title  { --typography-h1-font-size: 64px } -> only hero h1 gets bigger
```

### Target components for per-ID overrides

| Component | CSS Variable | What it controls |
|-----------|-------------|-----------------|
| Button | `--radius-button` | Corner radius for all buttons |
| Card | `--radius-card`, `--shadow-card` | Corner radius + shadow depth |
| Dialog | `--radius-dialog`, `--shadow-dialog` | Modal corners + shadow |
| Input | `--radius-input` | Input field corners |
| Badge | `--radius-badge` | Badge pill shape |
| Avatar | `--radius-avatar` | Avatar circle/square |
| Tooltip | `--radius-tooltip`, `--shadow-tooltip` | Tooltip corners + shadow |
| Toast | `--radius-toast` | Toast notification corners |
| Tabs | `--radius-tabs` | Tab button corners |
| Select | `--radius-select` | Select dropdown corners |

### Implementation approach

These component-specific CSS variables already exist in `globals.css`:
```css
--radius-button: var(--radius);
--radius-card: calc(var(--radius) + 4px);
--radius-dialog: calc(var(--radius) + 8px);
--shadow-card: var(--shadow-md);
--shadow-dialog: var(--shadow-2xl);
```

They derive from the global `--radius` and `--shadow-*` presets.
A per-component override would use `style.setProperty()` scoped to
a specific element ID or class, overriding only that component's variable.

This does NOT require changes to the DS ThemeProvider. It's an alkimia-core
Theme Editor feature that adds inline styles to specific DOM elements.
