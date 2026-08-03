---
id: design-md-ds-compatibility
version: "1.0.0"
last_updated: "2026-04-28"
updated_by: "research/google-design-md"
status: draft
type: reference
review_cycle: 90
---

# DESIGN.md ↔ Alkimia DS — Compatibility & Improvement Study

> Goal: keep the **Alkimia DS structure as the source of truth** and harvest only what
> from `google-labs-code/design.md` improves either (a) the **instructions** the DS
> ships to humans/agents, or (b) **features** of the DS itself we hadn't considered.
> No `DESIGN.md` file is adopted; no DS architecture is changed.

## How to read the percentages

Each candidate change is scored on **one specific dimension** (named explicitly).
Both numbers are heuristic estimates, not measurements:

- **% current** — how complete the DS is on that dimension *today*, 0–100.
- **Δ % expected** — points the change is expected to add. The cap is the dimension's
  ceiling, not 100% globally.
- Confidence band noted as `±N` when the estimate is fuzzy.

Anything below ±10 confidence is "directional, validate after implementing."

---

## 1. Executive summary — at a glance

| # | Change | Type | Coverage dimension | % current | Δ % | Cost |
|---|---|---|---|---|---|---|
| **A1** | Document `*-foreground` color-pair contract | Doc | Color usage clarity (agents + devs) | 60 ±10 | +25 | 1h |
| **A2** | Add formal "Do's and Don'ts" section with examples | Doc | DS rule discoverability for agents | 55 ±10 | +25 | 1.5h |
| **A3** | Adopt `{tokens.x}` reference vocabulary in agent docs | Doc | Agent prompt → DS token mapping fidelity | 45 ±15 | +20 | 1h |
| **A4** | Variants matrix per primitive | Doc | Variant discoverability | 35 ±10 | +35 | 4–6h |
| **A5** | Canonical 8-section README structure | Doc | Doc navigability for agents | 50 ±10 | +20 | 2h |
| **B1** | Auto contrast check in Theme Forge | Feature | Accessibility coverage of saved themes | 25 ±15 | +50 | 3–4h |
| **B2** | `fontFeatureSettings` + `fontVariationSettings` tokens | Feature | Typography expressiveness | 70 ±5 | +20 | 2h |
| **B3** | "Orphaned tokens" report in Theme Forge | Feature | Theme hygiene | 0 | +60 | 3h |
| **B4** | `broken-ref` validation in CI | Feature | Token rename safety | 0 | +70 | 2h |
| **B5** | Z-index tier system (`--z-*` tokens) | Feature | Layer/stacking determinism | 30 ±15 | +50 | 2–3h |
| **B6** | Material-style `surface-container-*` (optional) | Feature | Layered surface depth | 40 ±15 | +25 | 6–8h |

Aggregate from prior conversation top-3:
- **Phase 1 (≈4h)**: A1 + A2 + A3 → instructions much sharper for agents.
- **Phase 2 (≈6h)**: B1 + B2 → real DS feature gains, low risk.
- Phase 3 (rest): selectively, by need.

---

## 2. How the DS works (relevant slice)

Architecture (from `CLAUDE.md` + `packages/design-system/ARCHITECTURE.md`):

```
packages/design-system/web/components/
├── primitives/      67  Atomic Radix-based UI (Button, Input, Card, Badge, …)
├── compositions/    15  Composed (DataTable, Combobox, DatePicker, …)
├── patterns/        31  Feature kits (SidebarApp, DynamicForm, FilterSelect, …)
├── integrations/    —   Independent (Maps, 3D, Video, Calendars)
└── showcase/       116  Independent (Animations, Backgrounds, Text Effects)
```

**Token model** (verified at `packages/design-system/web/app/globals.css`):

- **Color tokens** flat semantic: `--background`, `--foreground`, `--primary`,
  `--primary-foreground`, `--primary-hover`, `--secondary`, `--muted`,
  `--accent`, `--destructive`, `--destructive-subtle`, `--destructive-border`,
  `--border`, `--input`, `--ring`, `--card`, `--card-foreground`,
  `--popover`, `--popover-foreground`, `--foreground-alt`,
  `--ghost-foreground`, `--ghost-hover`, `--backdrop`, `--body-background`,
  `--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`.
  Pair pattern: `<role>` ↔ `<role>-foreground` (shadcn-style).
  Color space: **OKLCH** (per ADR-007).
- **Radius**: `--radius-xs/sm/md/lg/xl/2xl/3xl/full` (8 levels).
- **Shadow**: `--shadow-2xs/xs/sm/md/lg/xl/2xl` + semantic aliases
  (`--shadow-card`, `--shadow-card-hover`, `--shadow-dropdown`).
- **Spacing semantic**: `--spacing-lg` (and other component-bound spacings).
  Scale spacing comes from Tailwind v4.
- **Typography**: `--font-sans`, `--font-mono`, plus per-tag overrides through
  Theme Forge (`TypographyElement` interface):
  ```ts
  interface TypographyElement {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    wordSpacing?: string;
    textDecoration?: string;
    fontStyle?: string;
  }
  ```
- **Z-index**: ad-hoc; no canonical `--z-*` tier tokens.

**Dynamic theming**: Theme Forge stores per-tenant themes in MongoDB; OKLCH values
generate CSS variables at runtime. Validation pipeline today: schema-shape only,
no contrast / orphan / broken-ref checks.

**Documentation surface for agents**:
- `CLAUDE.md` — top-level rules ("USE DESIGN SYSTEM FIRST", "NO INLINE DS RECREATION")
- `docs/00-conventions/design-system-component-usage.md` — bridge layer + import patterns
- `docs/00-conventions/component-standards.md` — file/folder structure
- `docs/02-components/{simple,composed,complex}-component-template.md` — templates
- Storybook (in DS submodule) — visual reference
- `docs/component-sitemap.yaml` — inventory

---

## 3. How DESIGN.md works (relevant slice)

A single file with **YAML frontmatter** (machine-readable tokens) + **Markdown
prose** (the *why*). Spec is alpha. Authoritative source: `packages/cli/src/linter/spec-config.yaml`.

Top-level YAML keys:
- `version: alpha` (only valid value)
- `name`, `description`
- `colors:` flat map, hex sRGB only, Material-style role names
  (`primary` + `on-primary`, `surface` + `on-surface`, `surface-container-low/high`)
- `typography:` map of objects with `fontFamily`, `fontSize`, `fontWeight`,
  `lineHeight`, `letterSpacing`, **`fontFeature`**, **`fontVariation`**
- `rounded:` scale (incl. literal `DEFAULT` for the un-suffixed default)
- `spacing:` scale
- `components:` flat map; sub-tokens are `backgroundColor`, `textColor`,
  `typography`, `rounded`, `padding`, `size`, `height`, `width`. Variants and
  states are top-level keys with suffixes (`button-primary`, `button-primary-hover`).

Token references: `"{colors.primary}"` (curly braces, dot path, must be quoted).
Unknown ref → **`broken-ref` error**.

Markdown body — canonical H2 sections, in order: Overview, Colors, Typography,
Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.

8 lint rules:
- `broken-ref` (error) — refs that don't resolve.
- `missing-primary` (warn) — colors defined but no `primary`.
- `contrast-ratio` (warn) — component bg/text pair < WCAG AA 4.5:1.
- `orphaned-tokens` (warn) — token defined but not referenced.
- `missing-typography` (warn) — colors defined but no typography.
- `section-order` (warn) — H2s out of canonical order.
- `missing-sections` (info), `token-summary` (info).

Hard limits:
- No light/dark nesting (one file per mode, role names instead).
- No nested variants (flat suffix).
- sRGB hex only (no OKLCH).
- Components are atom-grain only (no layout/composition concept).

---

## 4. Translation map (concept ↔ concept)

| DESIGN.md concept | Alkimia DS equivalent | Adaptation needed |
|---|---|---|
| `colors.primary` (hex) | `--primary` (OKLCH via Theme Forge) | None — same role; only color space differs |
| `colors.on-primary` | `--primary-foreground` | **Naming convention to document**, not change |
| `colors.surface` / `surface-container-low/high` | `--background` + `--card` + `--popover` | Mostly equivalent; gap if "card-on-card" depth needed (see B6) |
| `typography.body-md.fontFeature` | (missing) | **Add** to `TypographyElement` interface (B2) |
| `typography.body-md.fontVariation` | (missing) | **Add** to `TypographyElement` interface (B2) |
| `rounded.DEFAULT` | `--radius` (DEFAULT scale) | DS already has it; equivalent |
| `components.button-primary` (atom-grain) | `primitives/ui/button` (CVA variants) | Different model: DS uses CVA, DESIGN.md uses flat keys. **No adoption** — only document the variant matrix per primitive (A4) |
| `{colors.primary}` ref syntax | `var(--primary)` in CSS, `text-primary` in Tailwind | **Adopt only in agent docs as shorthand** (A3) |
| Lint rule `broken-ref` | (none) | **Add** as CI step on theme JSON (B4) |
| Lint rule `contrast-ratio` | (none) | **Add** to Theme Forge save flow (B1) |
| Lint rule `orphaned-tokens` | (none) | **Add** as Theme Forge preview badge (B3) |
| `Do's and Don'ts` H2 | Rules dispersed across CLAUDE.md | **Centralize** in `design-system-component-usage.md` (A2) |
| 8 canonical H2 sections | Mixed across `ARCHITECTURE.md` + `PROJECT_OVERVIEW.md` | **Re-section** the DS README to match (A5) |
| Material-style `surface-container-*` | Not present (shadcn-style 3-level: bg/card/popover) | **Don't adopt** unless layered depth becomes a real need (B6) |

**Key insight**: DESIGN.md and the DS are at different abstraction levels.
DESIGN.md is a *handoff format* for AI agents. The DS is a *runtime + components*.
Almost nothing should be adopted as-is. We harvest **patterns** (token-pairing,
linting), **vocabulary** (ref syntax for prompts), and **structure** (8 canonical
sections, Do's/Don'ts) — never the file format.

---

## 5. Detailed change spec — Bucket A (instructions / docs)

### A1 · Document `*-foreground` color-pair contract

**DS today.** The `<role>` ↔ `<role>-foreground` pattern exists in CSS, used
throughout components, but there is **no doc** that says: *"every color usage
that places text on a background must reference a registered pair; do not mix
across pairs"*. Agents (and new devs) frequently invent ad-hoc combos
(`bg-primary` + `text-white`).

**DESIGN.md equivalent.** `colors.primary` + `colors.on-primary`, validated by
the `contrast-ratio` lint rule. Pair contract is built into the schema.

**Adaptation.** Add a "Color pairs" subsection to
`docs/00-conventions/design-system-component-usage.md`. List every registered
pair, the rule for when each is used, and a forbidden example.

**Concrete rules to add:**

```markdown
## Color pairs (must follow)

The DS color system is built on **role pairs**: a background role and its matching
text role. NEVER mix backgrounds and foregrounds across pairs.

| Background role | Foreground role | Use case |
|---|---|---|
| `--background` | `--foreground` | Page surface |
| `--card` | `--card-foreground` | Card / panel |
| `--popover` | `--popover-foreground` | Floating menus, dialogs |
| `--primary` | `--primary-foreground` | Primary buttons, brand surfaces |
| `--secondary` | `--secondary-foreground` | Secondary buttons |
| `--muted` | `--muted-foreground` | Disabled / placeholder / hint |
| `--accent` | `--accent-foreground` | Hover surfaces, selected rows |
| `--destructive` | `--destructive-foreground` | Error / delete confirm |

### Rules

- **R1** — Every `bg-<role>` MUST be paired with `text-<role>-foreground`.
- **R2** — Don't pair `bg-primary` with `text-white` (or any literal). The
  foreground is themed; the literal is not.
- **R3** — `text-foreground` outside the page surface is a smell — switch to the
  surrounding container's pair.
- **R4** — `--destructive-subtle` and `--destructive-border` are auxiliary tokens
  for the same role (low-emphasis surfaces, outlines). Their text MUST still
  use `--destructive` or `--destructive-foreground`.

### Anti-pattern

```tsx
// ❌ Wrong — text not paired
<div className="bg-primary text-white">…</div>

// ✅ Right — pair maintained
<div className="bg-primary text-primary-foreground">…</div>
```
```

**Score.**
- Dimension: **color usage clarity** for agents/devs.
- % current: **60 ±10** — pattern exists, partly enforced by review, never documented.
- Δ %: **+25** — explicit contract eliminates a class of mistakes.
- Why not +40: lints and code review still do most of the catching; doc is
  prevention, not enforcement.

---

### A2 · Formal "Do's and Don'ts" section with examples

**DS today.** Rules exist in `CLAUDE.md` (lines 73–90, 102–115 area) — strong
imperatives like "USE DESIGN SYSTEM FIRST", "NO INLINE DS RECREATION", "PRIMITIVES
BRIDGE ONLY", "NO `@ui/` SHORTHAND". They're scattered, no concrete code examples.

**DESIGN.md equivalent.** Final canonical H2 ("Do's and Don'ts") with bullet
lists. Loosely structured but conventional.

**Adaptation.** Add a `## Do's and Don'ts` H2 to
`docs/00-conventions/design-system-component-usage.md` (or its public-facing
counterpart in the DS submodule). Each rule gets a Don't → Do code pair.

**Concrete rules to add (minimum 8 pairs, ordered by frequency-of-violation):**

1. **Reuse before recreate**

   ```tsx
   // ❌ <span className="rounded bg-blue-500 px-2 py-1 text-white">Active</span>
   // ✅ <Badge variant="success">Active</Badge>
   ```

2. **Bridge layer only**

   ```tsx
   // ❌ import { Button } from '@brain/design-system-web/...';
   // ❌ import { Slot } from '@radix-ui/react-slot';
   // ✅ import { Button } from '@/components/primitives/ui/button';
   ```

3. **No `@ui/` shorthand**

   ```tsx
   // ❌ import { Button } from '@ui/button';
   // ✅ import { Button } from '@/components/primitives/ui/button';
   ```

4. **Color pairs (mirror of A1)**

5. **No literal colors in JSX**

   ```tsx
   // ❌ <Card style={{ background: '#fff', color: '#111' }}>…
   // ✅ <Card className="bg-card text-card-foreground">…
   ```

6. **No raw radius / shadow values**

   ```tsx
   // ❌ className="rounded-[12px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
   // ✅ className="rounded-lg shadow-md"
   ```

7. **Translations in pages, not components**

   (Already in CLAUDE.md — restate with example.)

8. **Pages compose, components implement**

   (Already in CLAUDE.md — restate with example.)

**Score.**
- Dimension: **DS rule discoverability** — how often an agent applies a rule
  without having to be reminded.
- % current: **55 ±10** — rules exist but require reading a 500-line CLAUDE.md.
- Δ %: **+25** — concrete pairs make the rules actionable; agents can pattern-match.
- Cap: prose alone never beats lint enforcement.

---

### A3 · Adopt `{tokens.x}` reference vocabulary for agent docs

**DS today.** Agents are told to use Tailwind classes (`text-primary`) or CSS
vars (`var(--primary)`) — both context-dependent. There is no abstract way to
say "the primary brand color" without committing to a syntax.

**DESIGN.md equivalent.** `{colors.primary}` is a stable, format-agnostic
reference. Linters resolve it to whichever output format is needed.

**Adaptation.** Use `{role}` notation **only in agent-facing docs and
templates**, NEVER in code. It's a vocabulary, not a runtime.

**Concrete rule to add (in `CLAUDE.md` or `design-system-component-usage.md`):**

```markdown
## Token references in instructions

When discussing tokens in agent instructions, prompts, comments, or templates,
use the abstract reference form:

  {colors.primary}, {colors.primary-foreground}, {radius.lg}, {shadow.md},
  {typography.h1.fontSize}

Resolve at the call site:

| Context | Resolution |
|---|---|
| Tailwind class | `text-primary`, `bg-primary`, `rounded-lg`, `shadow-md` |
| Inline CSS / styled | `var(--primary)`, `var(--radius-lg)`, `var(--shadow-md)` |
| Theme Forge JSON | `lightColors.primary`, `borders.radius.lg` |

NEVER write `{colors.primary}` in actual code — it has no runtime meaning here.
```

**Why this helps.** Agents can produce reusable instruction templates that
survive Tailwind upgrades and CSS-var renames. The DS team gets a stable
vocabulary for Slack threads, ADRs, PR descriptions.

**Score.**
- Dimension: **agent prompt → DS token mapping fidelity** (how often an agent
  writes a literal that should have been a token).
- % current: **45 ±15** — agents lean on Tailwind classes; CSS var awareness
  inconsistent.
- Δ %: **+20** — vocabulary nudges the agent to think tokens-first.
- Risk: introducing a third syntax could confuse new contributors. Mitigate by
  using it ONLY in instructional prose, not code.

---

### A4 · Variants matrix per primitive

**DS today.** Variants live in CVA `cva()` calls inside each primitive
(`button.tsx`, `badge.tsx`, …). Discoverable only by reading the file.
`docs/component-sitemap.yaml` lists components by name but no variant detail.

**DESIGN.md equivalent.** Flat suffix variants are first-class top-level keys.
Each is enumerable.

**Adaptation.** Don't change the implementation. Add a **machine-readable
matrix** as a single doc artifact. Two options:

- **Option α** — generate from CVA introspection (real, auto-updating, ~6h tooling).
- **Option β** — hand-author Markdown table for the top-20 most-used primitives
  (~4h, manual maintenance).

Recommend **β first**, keep α as follow-up.

**Concrete artifact (suggested path):
`packages/design-system/web/components/primitives/ui/VARIANTS.md`**

```markdown
# Primitive variants matrix

> Source of truth: each primitive's `cva()` call. Update when `*.types.ts`
> changes a variant or size.

## Button

| variant | size | extras |
|---|---|---|
| default · destructive · outline · secondary · ghost · link | default · sm · lg · icon | asChild · loading |

## Badge

| variant |
|---|
| default · secondary · destructive · outline · success · warning · info |

…
```

**Score.**
- Dimension: **variant discoverability** for an agent that needs to pick the
  right one.
- % current: **35 ±10** — agents currently grep CVA, often miss a variant.
- Δ %: **+35** — matrix is the first thing they read; one source.
- Risk: drift if not regenerated. The α version (introspection) eliminates this.

---

### A5 · Canonical 8-section README structure

**DS today.** `packages/design-system/ARCHITECTURE.md` (architecture),
`PROJECT_OVERVIEW.md` (stack), `THEME_DB_INTEGRATION.md` (theme persistence).
Information is correct but distributed across three files with overlapping
content; an agent has to crawl all three to answer "what radius scale exists?"

**DESIGN.md equivalent.** Single file, fixed H2 order: Overview · Colors ·
Typography · Layout · Elevation · Shapes · Components · Do's/Don'ts.

**Adaptation.** Refactor `packages/design-system/README.md` (or
`ARCHITECTURE.md`) to follow the 8-section order. Keep deep-dive content in the
existing files but link from the canonical README.

**Concrete rules:**

```markdown
# Alkimia DS

## Overview
- 3 layers (primitives / compositions / patterns) + 2 islands
  (integrations / showcase). Stack: Tailwind v4 + Radix + OKLCH.
- See ARCHITECTURE.md for the full deep-dive.

## Colors
- 26 semantic CSS variables. OKLCH color space. Pair pattern: `<role>` +
  `<role>-foreground`. See `design-system-component-usage.md` § Color pairs.

## Typography
- 9 typographic tokens (h1–h4, p variants, small, mini, mono) + 6 semantic
  (label, caption, overline, nav-item, btn-text, lead). Per-tag override via
  Theme Forge.

## Layout
- (Spacing, gaps — point to Tailwind v4 scale doc.)

## Elevation
- 7 shadow levels + 3 semantic. Z-index: ad-hoc (see TODO).

## Shapes (Radius)
- 8 radius levels + `--radius-full`. Tailwind: `rounded-{xs,sm,md,lg,xl,2xl,3xl,full}`.

## Components
- 67 primitives, 15 compositions, 31 patterns. Inventory:
  `docs/component-sitemap.yaml`.
- Variants matrix: `primitives/ui/VARIANTS.md` (A4).

## Do's and Don'ts
- See `design-system-component-usage.md` § Do's and Don'ts (A2).
```

**Score.**
- Dimension: **doc navigability for agents** — time to answer a token-shape
  question.
- % current: **50 ±10** — info exists, lookup cost is "read 3 files".
- Δ %: **+20** — one canonical entry, predictable section names.

---

## 6. Detailed change spec — Bucket B (DS features)

### B1 · Auto contrast check in Theme Forge

**DS today.** Theme Forge persists OKLCH values to MongoDB. No validation step
ensures `<role>` and `<role>-foreground` pass WCAG AA. A user can save a tenant
theme that produces unreadable text.

**DESIGN.md equivalent.** `contrast-ratio` lint rule iterates components with
both `backgroundColor` + `textColor` and reports any pair < 4.5:1.

**Adaptation.** Add a validation pass in Theme Forge's save flow. Iterate the
8 known pairs (background/foreground, card/card-foreground, primary/primary-
foreground, etc.), compute WCAG contrast, surface a warning if any pair fails.

**Implementation rules:**

1. Use `culori` (already a dep): `wcagContrast(parse(oklch), parse(oklchFg))`.
2. Pairs to check (light + dark):
   ```ts
   const PAIRS = [
     ['background', 'foreground'],
     ['card', 'card-foreground'],
     ['popover', 'popover-foreground'],
     ['primary', 'primary-foreground'],
     ['secondary', 'secondary-foreground'],
     ['muted', 'muted-foreground'],
     ['accent', 'accent-foreground'],
     ['destructive', 'destructive-foreground'],
   ];
   ```
3. Threshold: WCAG AA = **4.5:1** for normal text, 3:1 for large.
4. Outcome on fail:
   - **Hard block** if `<= 3.0` (catastrophic, very likely a bug).
   - **Warning + override checkbox** if `3.0 < ratio < 4.5`.
   - **Pass silently** if `>= 4.5`.
5. Surface the result in the save modal: list of pairs with badges
   (`✅ 7.2`, `⚠ 4.1`, `❌ 2.8`).

**File touchpoints (estimated):**
- `packages/web/src/components/features/theme-forge/lib/utils/contrast.ts` (new, ~80 LOC)
- `packages/web/src/components/features/theme-forge/theme-editor/actions-bar/save-controls/apply-button.tsx` (modify ~30 LOC)
- `packages/web/src/components/features/theme-forge/theme-editor/save-modal.tsx` (or equivalent — add report UI ~80 LOC)

**Score.**
- Dimension: **accessibility coverage of saved themes**.
- % current: **25 ±15** — the default theme passes; tenant overrides are unchecked.
- Δ %: **+50** — every save now has a verified report.
- Why not +75: still doesn't cover non-text contrast (icons, focus rings, borders),
  doesn't enforce APCA, doesn't audit per-component combinations beyond the 8 pairs.
- Risk: adds latency to save (negligible — 8 contrast computations is sub-ms).

---

### B2 · `fontFeatureSettings` + `fontVariationSettings` tokens

**DS today.** `TypographyElement` exposes `fontFamily / fontSize / fontWeight /
lineHeight / letterSpacing / wordSpacing / textDecoration / fontStyle`.

Missing: control of OpenType features (ligatures, tabular numerals,
discretionary ligatures, slashed zero) and variable-font axes (wght, wdth, opsz,
ital). Without these, a `<table>` with monetary columns can't get tabular-nums;
a `<code>` block can't disable contextual ligatures; variable fonts can't be
finely tuned per token.

**DESIGN.md equivalent.** `fontFeature: "tnum"`, `fontVariation: "wght 700, wdth 95"`.

**Adaptation.** Extend the `TypographyElement` type and the
`applyTypographyElements` runtime to emit `font-feature-settings` and
`font-variation-settings` CSS properties.

**Implementation rules:**

1. Update the type:
   ```ts
   export interface TypographyElement {
     fontFamily: string;
     fontSize: string;
     fontWeight: string;
     lineHeight: string;
     letterSpacing: string;
     wordSpacing?: string;
     textDecoration?: string;
     fontStyle?: string;
     fontFeatureSettings?: string;   // NEW: e.g. "'tnum' 1, 'ss01' 1"
     fontVariationSettings?: string; // NEW: e.g. "'wght' 600, 'opsz' 14"
   }
   ```
2. Update `applyTypographyElements` (`packages/web/src/components/features/theme-forge/lib/utils/css/css-variables.ts`)
   to emit both properties on each tag override.
3. Provide UI controls in the Theme Forge typography editor (a single text
   input is acceptable in v1; advanced UI later).
4. **Backward compat** — fields are optional; missing values render no rule.
5. Update the `TypographyElementConfig` mirror in
   `core/types/theme.types.ts` to match.

**Score.**
- Dimension: **typography expressiveness** — how many real-world typographic
  needs can be met without dropping to inline CSS.
- % current: **70 ±5** — covers basics, fails on data-heavy UIs and variable fonts.
- Δ %: **+20** — adds tabular numbers, ligatures, variable axes.
- Cap: 100% would also need character classes (`unicode-range`),
  per-language pairing, font-loading control — out of scope.

---

### B3 · "Orphaned tokens" report in Theme Forge

**DS today.** A tenant can define custom tokens in Theme Forge that no
component references. There's no visibility — orphan tokens accumulate during
A/B experimentation.

**DESIGN.md equivalent.** `orphaned-tokens` lint rule scans the YAML and
reports any color/typography/spacing key not referenced from `components:`.

**Adaptation.** In Theme Forge's preview pane, scan the saved theme JSON
against the *static* list of CSS variables consumed by primitives (extract
from the DS source once, ship as a JSON manifest).

**Implementation rules:**

1. Build a manifest at DS build time: `packages/design-system/web/dist/used-tokens.json`
   — list every CSS variable name referenced anywhere in `primitives/`,
   `compositions/`, `patterns/`. Generate via grep:
   ```sh
   rg -o "var\(--[a-z][a-z0-9-]+\)" packages/design-system/web/components/ \
     | sed 's/var(--//; s/)//' | sort -u > used-tokens.json
   ```
2. In Theme Forge preview, compute `tokensInTheme - tokensInManifest = orphans`.
3. Show a collapsed badge: `3 orphaned tokens` → click to expand list.
4. Provide a "Remove all orphans" action.

**Score.**
- Dimension: **theme hygiene** (% of saved tokens that are live).
- % current: **0** — no signal at all.
- Δ %: **+60** — catches the obvious; doesn't catch tokens used inside `app/`
  but not the DS, which would still be flagged.
- Risk: false positives. Manifest must include consuming app's `packages/web`
  references too. Mitigate by extending the grep to `packages/web/src/`.

---

### B4 · `broken-ref` validation in CI

**DS today.** When a CSS variable is renamed, only runtime errors surface (and
only in components that exercise the rename). There is no static check.

**DESIGN.md equivalent.** `broken-ref` lint rule (error severity) verifies
every `{x.y}` resolves.

**Adaptation.** Add a CI step that grep-validates every `var(--<name>)` in
the consumer code against the declared variable list in
`packages/design-system/web/app/globals.css` (and `themes.css`).

**Implementation rules:**

1. Build the declared-tokens set:
   ```sh
   rg -o "^\s*--([a-z][a-z0-9-]+):" packages/design-system/web/app/{globals,themes}.css \
     | sed 's/.*--\([a-z][a-z0-9-]*\).*/\1/' | sort -u > declared.txt
   ```
2. Build the referenced-tokens set:
   ```sh
   rg -o "var\(--([a-z][a-z0-9-]+)" packages/web/src packages/design-system/web/components \
     | sed 's/.*--\([a-z][a-z0-9-]*\).*/\1/' | sort -u > referenced.txt
   ```
3. Diff: `comm -23 referenced.txt declared.txt` → any output is a broken ref.
4. Wire into `.github/workflows/quality-gates.yml` (or local `pnpm lint:tokens`).
5. Allow `--` prefix exceptions for known runtime-injected vars (Tailwind
   internals, third-party, etc.) via an allowlist file.

**Score.**
- Dimension: **token rename safety** — chance a rename breaks production.
- % current: **0**.
- Δ %: **+70** — catches static refs; runtime-built names (`var(--something-${dynamic})`)
  remain a gap.
- Cost: low; the script is trivial. Mostly maintenance: keep allowlist current.

---

### B5 · Z-index tier system

**DS today.** Z-index used ad-hoc in components (`z-50`, `z-[100]`, occasional
literals). No canonical tiers. Bug-prone when nesting Dialog ⊃ Tooltip ⊃ Popover.

**DESIGN.md equivalent.** Not directly addressed — DESIGN.md punts on layout
beyond spacing. This is a DS-internal gap.

**Adaptation.** Define `--z-*` tier tokens and migrate components.

**Concrete rules:**

```css
:root {
  --z-base:        0;     /* default flow */
  --z-dropdown:    1000;
  --z-sticky:      1020;
  --z-fixed:       1030;
  --z-modal-backdrop: 1040;
  --z-modal:       1050;
  --z-popover:     1060;
  --z-tooltip:     1070;
  --z-toast:       1080;
}
```

Tailwind v4 plugin or arbitrary `[z-(--z-modal)]`. Migrate Radix portal-based
primitives (Dialog, Popover, Tooltip, DropdownMenu) to use the tier tokens.

**Score.**
- Dimension: **layer/stacking determinism**.
- % current: **30 ±15** — Radix handles most stacking via portals, but
  custom code routinely conflicts.
- Δ %: **+50** — shared lexicon eliminates `z-[9999]` patches.
- Risk: migration touches many primitives. Schedule alongside next radix bump.

---

### B6 · Material-style `surface-container-*` (optional, deprioritized)

**DS today.** Three-level surface system (`background` < `card` < `popover`).
Sufficient for the present component inventory.

**DESIGN.md equivalent.** Five-level Material 3 system (`surface`,
`surface-container-low`, `surface-container`, `surface-container-high`,
`surface-container-highest`) + `inverse-surface`.

**Adaptation.** Don't adopt unless real "card-on-card with visible elevation"
becomes a UX requirement (e.g., dashboards with stacked panels). Migration cost
is high (touches every container component, breaks shadcn lineage), gain is
small without that requirement.

**Score.**
- Dimension: **layered surface depth**.
- % current: **40 ±15** — fine for current screens; cracks on dashboards.
- Δ %: **+25** — but only if the use case materializes. Otherwise +0.
- Recommendation: **defer**. Revisit if dashboard density increases.

---

## 7. Compatibility verdict

DESIGN.md is **conceptually compatible** with the Alkimia DS — every harvested
idea adapts cleanly to existing structures. It is **format-incompatible**: the
single-file YAML+Markdown handoff doesn't fit a runtime DS with OKLCH, dynamic
theming, and CVA variants. So we never adopt the format.

**No change in this study modifies the 3-layer architecture.**
Phase 1 + Phase 2 (≈10h total) deliver the bulk of value with no architectural
risk. Phase 3 changes are opportunistic.

## 8. Recommended order of execution

1. **A1 + A2** (≈2.5h, doc only) — pure win, pure prevention. Do first.
2. **A3** (≈1h, doc only) — vocabulary that benefits later phases.
3. **B2** (≈2h, feature) — small, isolated, high ergonomic value for typography.
4. **B1** (≈3–4h, feature) — accessibility safety net for tenant themes.
5. **A4** (≈4h, doc) — variants matrix (β version), upgrade to α (introspection)
   later.
6. **B4** (≈2h, feature) — token rename safety, cheap insurance.
7. **B3** (≈3h, feature) — orphan report; lower urgency than B4.
8. **A5** (≈2h, doc) — canonical README; can wait until A1–A3 land.
9. **B5** (≈2–3h, feature) — z-index system; schedule with next Radix bump.
10. **B6** — defer indefinitely.

## 9. What we are NOT doing

- Not adopting the `DESIGN.md` file format.
- Not adding a new YAML frontmatter to anything.
- Not changing the OKLCH color model to hex.
- Not adopting Material's `surface-container-*` (B6 deferred).
- Not flattening CVA variants into top-level keys.
- Not running `npx @google/design.md lint` against the DS.
- Not adding the `Stitch` skill or any external generator pipeline.

The DS architecture is the source of truth. DESIGN.md is a quarry.
