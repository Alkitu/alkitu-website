/**
 * Theme contract — single source of truth for the DS theme system.
 *
 * Defines:
 *   - The shape every persisted theme document MUST conform to.
 *   - Zod schemas to validate themes at the DB boundary, in tests, and at
 *     any other ingest point.
 *   - The TS types derived from those schemas (via `z.infer`).
 *
 * Consumers (current + planned):
 *   - DS itself (`generateThemeCSS`, `applyThemeTokens`).
 *   - Alkimia Core API when reading/writing the `Theme` MongoDB document.
 *   - Alkimia Core web layer for SSR injection and the Theme Forge editor.
 *   - Storybook, when wiring toolbar globals to runtime theme state.
 *
 * STATUS — 2026-04-29 — POPULATED
 *   All sub-schemas are now expanded with full field lists. Strict by default
 *   (rejects unknown fields) so drift surfaces early. Old DB documents that
 *   don't validate are expected to be handled at the API boundary with
 *   `safeParseThemeData` + fallback to the default theme; never throw the
 *   user out of the app for a schema mismatch.
 *
 * DESIGN DECISIONS (see `.problems-to-solve-design-system.md` for rationale)
 *   F. `schemaVersion` is a string literal `'1'` — bumped on breaking change.
 *   H. `colorOverrides` validates keys against a known CSS-variable enum
 *      (strict from day 1; rejects unknown vars).
 *   I. Single file (faster module resolution; one import for consumers).
 *   Top-level and sub-schemas use `.strict()`. Optional fields use
 *   `.optional()`; new fields with defaults use `.default(...)` so existing
 *   docs that lack them parse cleanly.
 */

import { z } from 'zod';
import {
  BASE_COLORS,
  BRAND_COLORS,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  SHADOW_OPTIONS,
  TRANSITION_OPTIONS,
} from '../theme-config';

// ════════════════════════════════════════════════════════════════════════════
// 0. Primitives — regexes, size limits
// ════════════════════════════════════════════════════════════════════════════

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Max size of an inline SVG payload for a brand logo. Protects against
 *  bloated DB documents and excessive serialization. */
const MAX_SVG_BYTES = 500_000; // 500 KB

// ════════════════════════════════════════════════════════════════════════════
// 1. Versioning
// ════════════════════════════════════════════════════════════════════════════

export const THEME_SCHEMA_VERSION = '1' as const;
export const themeSchemaVersionSchema = z.literal(THEME_SCHEMA_VERSION);

// ════════════════════════════════════════════════════════════════════════════
// 2. Color primitives — `OklchColor`, `RGBColor`, `HSVColor`, `ColorToken`
//
// `oklch` is the source of truth for every color in the system. The hex /
// rgb / hsv / oklchString fields are derived projections kept on the model
// for cheap UI rendering (avoid re-converting on every render).
// ════════════════════════════════════════════════════════════════════════════

export const oklchColorSchema = z
  .object({
    l: z.number().min(0).max(1),
    c: z.number().min(0).max(1), // OKLCH chroma can exceed 0.4 for vivid colors but practical max is < 1
    h: z.number().min(0).max(360),
    a: z.number().min(0).max(1).optional(),
  })
  .strict();

export const rgbColorSchema = z
  .object({
    r: z.number().int().min(0).max(255),
    g: z.number().int().min(0).max(255),
    b: z.number().int().min(0).max(255),
  })
  .strict();

export const hsvColorSchema = z
  .object({
    h: z.number().min(0).max(360),
    s: z.number().min(0).max(100),
    v: z.number().min(0).max(100),
  })
  .strict();

export const colorTokenSchema = z
  .object({
    name: z.string().min(1),
    /** OKLCH is the source of truth. */
    oklch: oklchColorSchema,
    /** Display hex — derived. */
    hex: z.string().regex(HEX_COLOR_RE).optional(),
    /** UI string like "oklch(0.62 0.19 259.81)" — derived. */
    oklchString: z.string().optional(),
    /** RGB representation — derived. */
    rgb: rgbColorSchema.optional(),
    /** HSV representation for color picker — derived. */
    hsv: hsvColorSchema.optional(),
    description: z.string().optional(),
    /** Color-linking system: this token mirrors another. */
    linkedTo: z.string().optional(),
    linkedColors: z.array(z.string()).optional(),
    /** Legacy field — older documents stored the printable color string here. */
    value: z.string().optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 3. ThemeColors — ~40 semantic color tokens (light/dark mode each)
//
// `info`/`infoForeground` were promoted from CSS-only orphans to editable
// tokens in PR 2. `overlay`, `destructiveBorder`, `destructiveSubtle` and
// `scrollbarThumbHover` were promoted in PR 5 (load-bearing tokens that had
// real consumers but no editor surface). All promoted tokens are optional to
// keep backward compat with themes saved before each promotion.
// ════════════════════════════════════════════════════════════════════════════

export const themeColorsSchema = z
  .object({
    background: colorTokenSchema,
    foreground: colorTokenSchema,
    card: colorTokenSchema,
    cardForeground: colorTokenSchema,
    popover: colorTokenSchema,
    popoverForeground: colorTokenSchema,
    primary: colorTokenSchema,
    primaryForeground: colorTokenSchema,
    secondary: colorTokenSchema,
    secondaryForeground: colorTokenSchema,
    accent: colorTokenSchema,
    accentForeground: colorTokenSchema,
    muted: colorTokenSchema,
    mutedForeground: colorTokenSchema,
    destructive: colorTokenSchema,
    destructiveForeground: colorTokenSchema,
    destructiveBorder: colorTokenSchema.optional(),
    destructiveSubtle: colorTokenSchema.optional(),
    warning: colorTokenSchema.optional(),
    warningForeground: colorTokenSchema.optional(),
    success: colorTokenSchema.optional(),
    successForeground: colorTokenSchema.optional(),
    info: colorTokenSchema.optional(),
    infoForeground: colorTokenSchema.optional(),
    border: colorTokenSchema,
    input: colorTokenSchema,
    ring: colorTokenSchema,
    chart1: colorTokenSchema,
    chart2: colorTokenSchema,
    chart3: colorTokenSchema,
    chart4: colorTokenSchema,
    chart5: colorTokenSchema,
    sidebar: colorTokenSchema,
    sidebarForeground: colorTokenSchema,
    sidebarPrimary: colorTokenSchema,
    sidebarPrimaryForeground: colorTokenSchema,
    sidebarAccent: colorTokenSchema,
    sidebarAccentForeground: colorTokenSchema,
    sidebarBorder: colorTokenSchema,
    sidebarRing: colorTokenSchema,
    scrollbarTrack: colorTokenSchema,
    scrollbarThumb: colorTokenSchema,
    scrollbarThumbHover: colorTokenSchema.optional(),
    overlay: colorTokenSchema.optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 4. DS preset layer — `dsThemeConfig`
//
// Mirrors `ThemeConfig` from theme-config.ts but with strict validation tied
// to the actual preset arrays. If those arrays change, this schema picks up
// the change automatically (single source of truth).
// ════════════════════════════════════════════════════════════════════════════

const baseColorValueSet = new Set<string>(BASE_COLORS.map((c) => c.value));
const brandColorValueSet = new Set<string>(BRAND_COLORS.map((c) => c.value));
const radiusValueSet = new Set<number>(RADIUS_OPTIONS.map((r) => r.value));
const spacingValueSet = new Set<number>(SPACING_OPTIONS.map((s) => s.value));
const shadowValueSet = new Set<string>(SHADOW_OPTIONS.map((s) => s.value));
const transitionValueSet = new Set<number>(TRANSITION_OPTIONS.map((t) => t.value));

type BaseColorValue = (typeof BASE_COLORS)[number]['value'];
type BrandColorValue = (typeof BRAND_COLORS)[number]['value'];
type RadiusValue = (typeof RADIUS_OPTIONS)[number]['value'];
type SpacingValue = (typeof SPACING_OPTIONS)[number]['value'];
type ShadowValue = (typeof SHADOW_OPTIONS)[number]['value'];
type TransitionValue = (typeof TRANSITION_OPTIONS)[number]['value'];

export const dsThemeConfigSchema = z
  .object({
    baseColor: z
      .string()
      .refine((v): v is BaseColorValue => baseColorValueSet.has(v), {
        message: `must be one of: ${[...baseColorValueSet].join(', ')}`,
      }),
    brandColor: z
      .string()
      .refine((v): v is BrandColorValue => brandColorValueSet.has(v), {
        message: `must be one of: ${[...brandColorValueSet].join(', ')}`,
      }),
    font: z.string().min(1),
    radius: z
      .number()
      .refine((v): v is RadiusValue => radiusValueSet.has(v), {
        message: `must be one of the 9 RADIUS_OPTIONS: ${[...radiusValueSet].join(', ')}`,
      }),
    spacing: z
      .number()
      .refine((v): v is SpacingValue => spacingValueSet.has(v), {
        message: `must be one of: ${[...spacingValueSet].join(', ')}`,
      }),
    shadow: z
      .string()
      .refine((v): v is ShadowValue => shadowValueSet.has(v), {
        message: `must be one of: ${[...shadowValueSet].join(', ')}`,
      }),
    transition: z
      .number()
      .refine((v): v is TransitionValue => transitionValueSet.has(v), {
        message: `must be one of: ${[...transitionValueSet].join(', ')}`,
      }),
    customBrandHex: z.string().regex(HEX_COLOR_RE).optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 5. Color overrides — `colorOverrides`
//
// Keys are CSS variable names (with `--` prefix) since they're applied as
// raw CSS properties (`root.style.setProperty(key, value)`).
//
// STRICT validation: keys must be in the known CSS-variable set. PR 5
// promoted four load-bearing orphans into the canonical set (--overlay,
// --destructive-border, --destructive-subtle, --scrollbar-thumb-hover).
// ════════════════════════════════════════════════════════════════════════════

const KNOWN_CSS_COLOR_VARIABLES = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--accent',
  '--accent-foreground',
  '--muted',
  '--muted-foreground',
  '--destructive',
  '--destructive-foreground',
  '--destructive-border',
  '--destructive-subtle',
  '--warning',
  '--warning-foreground',
  '--success',
  '--success-foreground',
  '--info',
  '--info-foreground',
  '--border',
  '--input',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
  '--scrollbar-track',
  '--scrollbar-thumb',
  '--scrollbar-thumb-hover',
  '--overlay',
] as const;

const knownCssColorVariableSet = new Set<string>(KNOWN_CSS_COLOR_VARIABLES);

const cssColorVariableNameSchema = z
  .string()
  .refine((v) => knownCssColorVariableSet.has(v), {
    message: 'unknown CSS color variable',
  });

const overridesByModeSchema = z.record(cssColorVariableNameSchema, z.string());

export const colorOverridesSchema = z
  .object({
    light: overridesByModeSchema.optional(),
    dark: overridesByModeSchema.optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 6. Typography — `TypographyElementConfig` and `ThemeTypography`
//
// 17 tag overrides cover the canonical typographic scale of the platform.
// Each tag is independent; missing tags inherit the family defaults from
// `fontFamilies`. This is the canonical model: the previous 8-key model in
// `packages/web/src/types/typography.ts` was deleted in PR 3.
// ════════════════════════════════════════════════════════════════════════════

export const typographyElementConfigSchema = z
  .object({
    fontFamily: z.string(),
    fontSize: z.string(),
    fontWeight: z.string(),
    lineHeight: z.string(),
    letterSpacing: z.string(),
    wordSpacing: z.string().optional(),
    textDecoration: z.string().optional(),
    fontStyle: z.string().optional(),
    /** OpenType / variable-font controls. CSS string format, e.g. "'tnum' 1". */
    fontFeatureSettings: z.string().optional(),
    fontVariationSettings: z.string().optional(),
  })
  .strict();

export const themeTypographySchema = z
  .object({
    fontFamilies: z
      .object({
        sans: z.string(),
        serif: z.string(),
        mono: z.string(),
      })
      .strict(),
    trackingNormal: z.string(),
    h1: typographyElementConfigSchema.optional(),
    h2: typographyElementConfigSchema.optional(),
    h3: typographyElementConfigSchema.optional(),
    h4: typographyElementConfigSchema.optional(),
    paragraph: typographyElementConfigSchema.optional(),
    'p-medium': typographyElementConfigSchema.optional(),
    'p-bold': typographyElementConfigSchema.optional(),
    small: typographyElementConfigSchema.optional(),
    mini: typographyElementConfigSchema.optional(),
    mono: typographyElementConfigSchema.optional(),
    label: typographyElementConfigSchema.optional(),
    caption: typographyElementConfigSchema.optional(),
    overline: typographyElementConfigSchema.optional(),
    'nav-item': typographyElementConfigSchema.optional(),
    'btn-text': typographyElementConfigSchema.optional(),
    lead: typographyElementConfigSchema.optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 7. Borders — `BorderRadiusController` and `ThemeBorders`
//
// `globalRadius` is the master controller; component-specific controllers
// (cards, buttons, checkbox) can override it independently. The computed
// CSS values (`radius`, `radiusSm`, etc.) are emitted into globals.css and
// downstream components consume them via `var(--radius-*)`.
// ════════════════════════════════════════════════════════════════════════════

export const borderRadiusControllerSchema = z
  .object({
    /** Base value in px. */
    value: z.number(),
    /** Whether this controller follows globalRadius or is independent. */
    isLinked: z.boolean(),
    /** CSS calc() formula for nested-element offsets. */
    formula: z.string(),
  })
  .strict();

export const themeBordersSchema = z
  .object({
    // Controllers (UI-level)
    globalRadius: borderRadiusControllerSchema.optional(),
    cardsRadius: borderRadiusControllerSchema.optional(),
    buttonsRadius: borderRadiusControllerSchema.optional(),
    checkboxRadius: borderRadiusControllerSchema.optional(),

    // Computed CSS values (auto-generated from controllers)
    radius: z.string(),
    radiusSm: z.string().optional(),
    radiusMd: z.string().optional(),
    radiusLg: z.string().optional(),
    radiusXl: z.string().optional(),

    // Component-specific (derived from per-component controllers)
    radiusCard: z.string().optional(),
    radiusCardInner: z.string().optional(),
    radiusButton: z.string().optional(),
    radiusButtonInner: z.string().optional(),
    radiusCheckbox: z.string().optional(),
    radiusCheckboxInner: z.string().optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 8. Shadows — `ThemeShadows`
//
// 8-level shadow scale. Component-specific shadows (--shadow-card,
// --shadow-dialog, etc.) live in globals.css as calc/var derivations off
// these base levels — see audit doc §3.
// ════════════════════════════════════════════════════════════════════════════

export const themeShadowsSchema = z
  .object({
    shadow2xs: z.string(),
    shadowXs: z.string(),
    shadowSm: z.string(),
    shadow: z.string(),
    shadowMd: z.string(),
    shadowLg: z.string(),
    shadowXl: z.string(),
    shadow2xl: z.string(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 9. Spacing — `ThemeSpacing`
//
// Base value plus optional per-step scale. The scale keys are arbitrary
// strings (xs/sm/md/lg/xl/2xl/3xl in current usage) and values are CSS
// length strings. The audit doc §2 fix is implicit here: `scale` only
// accepts string values, so [object Object] can't sneak in.
// ════════════════════════════════════════════════════════════════════════════

export const themeSpacingSchema = z
  .object({
    /** Base spacing value (e.g. "1.5rem"). */
    spacing: z.string(),
    /** Optional per-step scale: { xs: "0.25rem", sm: "0.5rem", ... }. */
    scale: z.record(z.string(), z.string()).optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 10. Scroll — `ThemeScroll`
//
// Scrollbar geometry and behavior. Colors live in `themeColors` under
// `scrollbarTrack` / `scrollbarThumb`.
// ════════════════════════════════════════════════════════════════════════════

export const themeScrollSchema = z
  .object({
    width: z.string(),
    behavior: z.enum(['auto', 'smooth', 'instant']),
    smooth: z.boolean(),
    hide: z.boolean(),
    /** Border radius for scrollbar track (riel). */
    trackRadius: z.string().optional(),
    /** Border radius for scrollbar thumb (deslizador). */
    thumbRadius: z.string().optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 11. Brand — logos and identity
//
// Logos hold inline SVG content (`svgContent`) capped at MAX_SVG_BYTES.
// The dual-mode config (lightMode/darkMode) lets a brand serve different
// assets per color scheme.
// ════════════════════════════════════════════════════════════════════════════

const logoColorVariantsSchema = z
  .object({
    original: z.string(),
    white: z.string(),
    black: z.string(),
    gray: z.string(),
  })
  .strict();

const logoModeConfigSchema = z
  .object({
    variants: logoColorVariantsSchema,
    monoColor: z.string(),
    isLinkedToPrimary: z.boolean(),
  })
  .strict();

const logoMetadataSchema = z
  .object({
    fileName: z.string(),
    fileSize: z.string(),
    dimensions: z.string(),
    viewBox: z.string(),
    colorCount: z.number().int().min(0),
    hasGradients: z.boolean(),
  })
  .strict();

export const logoVariantSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    type: z.enum(['icon', 'horizontal', 'vertical']),
    aspectRatio: z.string(),
    svgContent: z.string().max(MAX_SVG_BYTES),
    detectedColors: z.array(z.string()),
    variants: logoColorVariantsSchema.optional(),
    lightMode: logoModeConfigSchema.optional(),
    darkMode: logoModeConfigSchema.optional(),
    darkModeVersion: z
      .object({
        svgContent: z.string().max(MAX_SVG_BYTES),
        variants: logoColorVariantsSchema,
        metadata: logoMetadataSchema,
      })
      .strict()
      .optional(),
    metadata: logoMetadataSchema,
  })
  .strict();

export const themeBrandSchema = z
  .object({
    // Identity
    name: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    voice: z.string().optional(),
    tone: z.string().optional(),
    colorGuidelines: z.string().optional(),

    // Logos (one per layout type, all nullable)
    logos: z
      .object({
        icon: logoVariantSchema.nullable(),
        horizontal: logoVariantSchema.nullable(),
        vertical: logoVariantSchema.nullable(),
      })
      .strict()
      .optional(),

    // Brand colors
    primaryColor: colorTokenSchema,
    secondaryColor: colorTokenSchema,
    brandColors: z.array(colorTokenSchema).optional(),

    /** Legacy: a single logo URL/data-URI before the structured logos field. */
    logo: z.string().optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 12. Top-level — `ThemeData`
//
// Persisted shape of the `themes` MongoDB document. `id`, `createdAt`,
// `updatedAt` are managed by the DB. `schemaVersion` defaults to '1' so
// existing docs without the field still parse cleanly during the rollout.
// ════════════════════════════════════════════════════════════════════════════

export const themeDataSchema = z
  .object({
    // Versioning — defaults to '1' to allow parsing pre-PR-4 documents
    schemaVersion: themeSchemaVersionSchema.default(THEME_SCHEMA_VERSION),

    // Identity
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    version: z.string().optional(),
    author: z.string().optional(),

    // DS preset layer (high-level Quick Setup)
    dsThemeConfig: dsThemeConfigSchema,

    // Color overrides layer (per-token fine adjustments)
    lightColors: themeColorsSchema,
    darkColors: themeColorsSchema,
    colorOverrides: colorOverridesSchema.optional(),

    // Mode-independent sub-systems
    typography: themeTypographySchema,
    brand: themeBrandSchema,
    spacing: themeSpacingSchema,
    borders: themeBordersSchema,
    shadows: themeShadowsSchema,
    scroll: themeScrollSchema,

    // Persisted metadata
    tags: z.array(z.string()).default([]),
    isPublic: z.boolean().default(false),
    isFavorite: z.boolean().default(false),
    isActive: z.boolean().default(false),
    isDefault: z.boolean().default(false), // legacy, kept for backward compatibility

    // DB-managed timestamps
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .strict();

// ════════════════════════════════════════════════════════════════════════════
// 13. Inferred TS types
// ════════════════════════════════════════════════════════════════════════════

export type OklchColor = z.infer<typeof oklchColorSchema>;
export type RGBColor = z.infer<typeof rgbColorSchema>;
export type HSVColor = z.infer<typeof hsvColorSchema>;
export type ColorToken = z.infer<typeof colorTokenSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type DsThemeConfig = z.infer<typeof dsThemeConfigSchema>;
export type ColorOverrides = z.infer<typeof colorOverridesSchema>;
export type TypographyElementConfig = z.infer<typeof typographyElementConfigSchema>;
export type ThemeTypography = z.infer<typeof themeTypographySchema>;
export type BorderRadiusController = z.infer<typeof borderRadiusControllerSchema>;
export type ThemeBorders = z.infer<typeof themeBordersSchema>;
export type ThemeShadows = z.infer<typeof themeShadowsSchema>;
export type ThemeSpacing = z.infer<typeof themeSpacingSchema>;
export type ThemeScroll = z.infer<typeof themeScrollSchema>;
export type LogoVariant = z.infer<typeof logoVariantSchema>;
export type ThemeBrand = z.infer<typeof themeBrandSchema>;
export type ThemeData = z.infer<typeof themeDataSchema>;

// ════════════════════════════════════════════════════════════════════════════
// 14. Parse helpers
//
// `parseThemeData` throws on invalid input — use at trust boundaries where
// failure is unrecoverable.
// `safeParseThemeData` returns a SafeParseReturnType — use when you want to
// fall back to a default or log the error without crashing.
// ════════════════════════════════════════════════════════════════════════════

export function parseThemeData(input: unknown): ThemeData {
  return themeDataSchema.parse(input);
}

export function safeParseThemeData(input: unknown) {
  return themeDataSchema.safeParse(input);
}

// ════════════════════════════════════════════════════════════════════════════
// 15. Constants re-exported for tooling
//
// Exposed so consumers (Theme Forge UI, Storybook decorators, codegen)
// can read the canonical set without duplicating it.
// ════════════════════════════════════════════════════════════════════════════

export { KNOWN_CSS_COLOR_VARIABLES };
