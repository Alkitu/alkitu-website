/**
 * Public surface for the DS theme contract.
 *
 * This barrel re-exports the schema, derived types, parse helpers, and the
 * single-entry-point CSS generator.
 */

export {
  // Schema version
  THEME_SCHEMA_VERSION,
  themeSchemaVersionSchema,

  // Color primitives (oklch is source of truth)
  oklchColorSchema,
  rgbColorSchema,
  hsvColorSchema,
  colorTokenSchema,

  // Theme color tokens (~40 keys)
  themeColorsSchema,

  // DS preset layer
  dsThemeConfigSchema,

  // Color overrides
  colorOverridesSchema,

  // Typography
  typographyElementConfigSchema,
  themeTypographySchema,

  // Borders / Shadows / Spacing / Scroll
  borderRadiusControllerSchema,
  themeBordersSchema,
  themeShadowsSchema,
  themeSpacingSchema,
  themeScrollSchema,

  // Brand / logos
  logoVariantSchema,
  themeBrandSchema,

  // Top-level
  themeDataSchema,

  // Inferred types
  type OklchColor,
  type RGBColor,
  type HSVColor,
  type ColorToken,
  type ThemeColors,
  type DsThemeConfig,
  type ColorOverrides,
  type TypographyElementConfig,
  type ThemeTypography,
  type BorderRadiusController,
  type ThemeBorders,
  type ThemeShadows,
  type ThemeSpacing,
  type ThemeScroll,
  type LogoVariant,
  type ThemeBrand,
  type ThemeData,

  // Parse helpers
  parseThemeData,
  safeParseThemeData,

  // Tooling constants
  KNOWN_CSS_COLOR_VARIABLES,
} from './theme-data.schema';

// Single CSS generator (replaces the duplicated paths)
export {
  generateThemeCSS,
  type ColorOverridesByMode,
  type GenerateThemeCSSArgs,
} from './generate-theme-css';
