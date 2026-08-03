/**
 * `generateThemeCSS` — single entry point for generating theme CSS as a string.
 *
 * Replaces the dual-generator state where SSR (in `packages/web`) used a
 * combination of preset-only logic in the DS plus its own legacy color/
 * typography/border/shadow/spacing emitter. From this PR on, every consumer
 * (SSR layout, future runtime injectors, Storybook decorators) goes through
 * this function so the contract is enforced in one place.
 *
 * What it does:
 *   1. Calls `generateThemeConfigCSS(dsThemeConfig)` for the preset layer
 *      (`:root` + `.dark` blocks built from baseColor/brandColor/font/radius/
 *      spacing/shadow/transition).
 *   2. If `colorOverrides` are present, appends `:root { ... }` and
 *      `.dark { ... }` blocks containing the per-token overrides on top.
 *   3. If `meta` is present, prefixes the output with a comment for traceability.
 *
 * What it does NOT do (yet):
 *   - Emit per-element typography (`--typography-h1-*`, etc.).
 *   - Emit custom shadows / borders / spacing scales.
 *   These will land when the corresponding sub-schemas are populated. For
 *   now, the SSR thin wrapper in `packages/web/src/lib/theme/inline-css-
 *   generator.ts` keeps its legacy code path for documents that need them
 *   until the schema migration finishes.
 */

import { generateThemeConfigCSS } from '../theme-css-generator';
import type { ThemeConfig } from '../theme-config';

export interface ColorOverridesByMode {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}

export interface GenerateThemeCSSArgs {
  /** DS preset layer (source of truth for baseColor/brandColor/font/etc). */
  dsThemeConfig: ThemeConfig;
  /** Per-token overrides applied on top of the preset. */
  colorOverrides?: ColorOverridesByMode;
  /** Optional theme metadata for traceability comments in the output. */
  meta?: {
    id?: string;
    name?: string;
  };
}

function buildOverrideBlock(
  selector: ':root' | '.dark',
  overrides: Record<string, string> | undefined,
): string | null {
  if (!overrides || Object.keys(overrides).length === 0) {
    return null;
  }
  const lines = Object.entries(overrides)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join('\n');
  return `${selector} {\n${lines}\n}`;
}

export function generateThemeCSS(args: GenerateThemeCSSArgs): string {
  const { dsThemeConfig, colorOverrides, meta } = args;

  const baseCSS = generateThemeConfigCSS(dsThemeConfig);

  const sections: string[] = [];

  if (meta?.id || meta?.name) {
    const tag = [meta?.name, meta?.id ? `(ID: ${meta.id})` : null]
      .filter(Boolean)
      .join(' ');
    sections.push(`/* Theme: ${tag} — DS config */`);
  }

  sections.push(baseCSS);

  if (colorOverrides) {
    const lightBlock = buildOverrideBlock(':root', colorOverrides.light);
    const darkBlock = buildOverrideBlock('.dark', colorOverrides.dark);

    if (lightBlock || darkBlock) {
      sections.push('/* Color overrides */');
      if (lightBlock) sections.push(lightBlock);
      if (darkBlock) sections.push(darkBlock);
    }
  }

  return sections.join('\n\n');
}
