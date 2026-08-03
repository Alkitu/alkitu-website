/**
 * Server-Side Theme CSS Generator
 *
 * Pure function that generates CSS custom properties from a ThemeConfig.
 * Replicates the same logic as ThemeProvider but outputs a CSS string
 * instead of calling DOM APIs. Used for SSR to prevent FOUC.
 */

import { ThemeConfig } from "./theme-config";
import { generateColorScale } from "./color-generator";

// ─── Neutral palettes: the monochromatic exception ────────────────────────
const NEUTRAL_PALETTES = new Set(["neutral", "slate", "gray", "zinc", "stone"]);

/**
 * Generate theme token CSS for a given brand + base + mode combination.
 * Mirrors the `applyThemeTokens()` logic in theme-provider.tsx.
 */
function generateThemeTokensCSS(
  brand: string,
  base: string,
  isDark: boolean,
): string {
  const lines: string[] = [];

  // 1. Secondary (Base-derived)
  if (isDark) {
    lines.push(`--secondary: var(--color-${base}-50);`);
    lines.push(`--secondary-foreground: var(--color-${base}-500);`);
  } else {
    lines.push(`--secondary: var(--color-${base}-600);`);
    lines.push(`--secondary-foreground: var(--color-${base}-50);`);
  }

  // 2. Brand Logic (Primary/Ring/Accent/Charts/Sidebar)
  if (NEUTRAL_PALETTES.has(brand)) {
    // Monochromatic: don't override primary (CSS defaults apply)
    if (isDark) {
      lines.push(`--accent: var(--color-${brand}-800);`);
      lines.push(`--accent-foreground: var(--color-${brand}-50);`);
      lines.push(`--chart-1: var(--color-${brand}-400);`);
      lines.push(`--chart-2: var(--color-${brand}-600);`);
      lines.push(`--chart-3: var(--color-${brand}-300);`);
      lines.push(`--chart-4: var(--color-${brand}-700);`);
      lines.push(`--chart-5: var(--color-${brand}-500);`);
      lines.push(`--sidebar-primary: var(--color-${brand}-50);`);
      lines.push(`--sidebar-primary-foreground: var(--color-${brand}-500);`);
      lines.push(`--sidebar-accent: var(--color-${brand}-800);`);
      lines.push(`--sidebar-accent-foreground: var(--color-${brand}-50);`);
    } else {
      lines.push(`--accent: var(--color-${brand}-100);`);
      lines.push(`--accent-foreground: var(--color-${brand}-900);`);
      lines.push(`--chart-1: var(--color-${brand}-800);`);
      lines.push(`--chart-2: var(--color-${brand}-600);`);
      lines.push(`--chart-3: var(--color-${brand}-900);`);
      lines.push(`--chart-4: var(--color-${brand}-500);`);
      lines.push(`--chart-5: var(--color-${brand}-700);`);
      lines.push(`--sidebar-primary: var(--color-${brand}-900);`);
      lines.push(`--sidebar-primary-foreground: var(--color-${brand}-50);`);
      lines.push(`--sidebar-accent: var(--color-${brand}-100);`);
      lines.push(`--sidebar-accent-foreground: var(--color-${brand}-900);`);
    }
  } else {
    // Color theme
    if (isDark) {
      lines.push(`--primary: var(--color-${brand}-500);`);
      lines.push(`--primary-foreground: var(--color-${brand}-50);`);
      lines.push(`--ring: var(--color-${brand}-500);`);
      lines.push(`--accent: var(--color-${brand}-800);`);
      lines.push(`--accent-foreground: var(--color-${brand}-50);`);
      lines.push(`--chart-1: var(--color-${brand}-500);`);
      lines.push(`--chart-2: var(--color-${brand}-300);`);
      lines.push(`--chart-3: var(--color-${brand}-600);`);
      lines.push(`--chart-4: var(--color-${brand}-400);`);
      lines.push(`--chart-5: var(--color-${brand}-700);`);
      lines.push(`--sidebar-primary: var(--color-${brand}-500);`);
      lines.push(`--sidebar-primary-foreground: var(--color-${brand}-50);`);
      lines.push(`--sidebar-accent: var(--color-${brand}-800);`);
      lines.push(`--sidebar-accent-foreground: var(--color-${brand}-50);`);
    } else {
      lines.push(`--primary: var(--color-${brand}-600);`);
      lines.push(`--primary-foreground: var(--color-${brand}-50);`);
      lines.push(`--ring: var(--color-${brand}-600);`);
      lines.push(`--accent: var(--color-${brand}-100);`);
      lines.push(`--accent-foreground: var(--color-${brand}-900);`);
      lines.push(`--chart-1: var(--color-${brand}-600);`);
      lines.push(`--chart-2: var(--color-${brand}-400);`);
      lines.push(`--chart-3: var(--color-${brand}-700);`);
      lines.push(`--chart-4: var(--color-${brand}-500);`);
      lines.push(`--chart-5: var(--color-${brand}-800);`);
      lines.push(`--sidebar-primary: var(--color-${brand}-600);`);
      lines.push(`--sidebar-primary-foreground: var(--color-${brand}-50);`);
      lines.push(`--sidebar-accent: var(--color-${brand}-100);`);
      lines.push(`--sidebar-accent-foreground: var(--color-${brand}-900);`);
    }
  }

  return lines.join("\n  ");
}

/**
 * Generate a complete CSS string from a ThemeConfig.
 *
 * Output includes:
 * - `:root` block with light-mode tokens + shared properties
 * - `.dark` block with dark-mode tokens
 * - Personalized color scale if applicable
 *
 * @param config - The DS ThemeConfig object
 * @returns CSS string ready for injection into a `<style>` tag
 */
export function generateThemeConfigCSS(config: ThemeConfig): string {
  const sections: string[] = [];

  // ─── Personalized color scale ───────────────────────────────────────
  if (config.brandColor === "personalized" && config.customBrandHex) {
    const scale = generateColorScale(config.customBrandHex);
    const scaleLines = Object.entries(scale)
      .map(([shade, hex]) => `--color-personalized-${shade}: ${hex};`)
      .join("\n  ");
    sections.push(`:root {\n  ${scaleLines}\n}`);
  }

  // ─── Radius ─────────────────────────────────────────────────────────
  const r = config.radius;
  const radiusCSS = [
    `--radius-xs-val: ${r * 0.25}rem;`,
    `--radius-sm-val: ${r * 0.5}rem;`,
    `--radius-md-val: ${r * 0.75}rem;`,
    `--radius-lg-val: ${r}rem;`,
    `--radius-xl-val: ${r * 1.5}rem;`,
    `--radius-2xl-val: ${r * 2}rem;`,
    `--radius-3xl-val: ${r * 3}rem;`,
    `--radius-card: calc(${r}rem + 4px);`,
    `--radius-input: ${r * 0.75}rem;`,
    `--radius-dropdown: ${r * 0.75}rem;`,
  ].join("\n  ");

  // ─── Spacing ────────────────────────────────────────────────────────
  const spacing = config.spacing ?? 1.5;
  const spacingCSS = `--spacing-lg: ${spacing}rem;`;

  // ─── Shadow ─────────────────────────────────────────────────────────
  const shadow = config.shadow ?? "md";
  let shadowCSS: string;
  if (shadow === "none") {
    shadowCSS = [
      "--shadow-card: none;",
      "--shadow-card-hover: none;",
    ].join("\n  ");
  } else {
    const shadowScale = ["sm", "md", "lg", "xl", "2xl"];
    const idx = shadowScale.indexOf(shadow);
    const hoverShadow = shadowScale[Math.min(idx + 1, shadowScale.length - 1)];
    shadowCSS = [
      `--shadow-card: var(--shadow-${shadow});`,
      `--shadow-card-hover: var(--shadow-${hoverShadow});`,
    ].join("\n  ");
  }

  // ─── Transition ─────────────────────────────────────────────────────
  const transition = config.transition ?? 200;
  // Curva fuerte tokenizada (motion.css); duración sigue siendo configurable.
  const transitionCSS = `--transition-base: ${transition}ms var(--lk-ease-out-strong, cubic-bezier(0.23, 1, 0.32, 1));`;

  // ─── Font ───────────────────────────────────────────────────────────
  let fontCSS = "";
  if (config.font && config.font !== "Geist") {
    fontCSS = `font-family: "${config.font}", system-ui, sans-serif;`;
  }

  // ─── Light mode tokens ──────────────────────────────────────────────
  const lightTokens = generateThemeTokensCSS(
    config.brandColor,
    config.baseColor,
    false,
  );

  // ─── Dark mode tokens ──────────────────────────────────────────────
  const darkTokens = generateThemeTokensCSS(
    config.brandColor,
    config.baseColor,
    true,
  );

  // ─── Assemble :root block ───────────────────────────────────────────
  const rootLines = [radiusCSS, spacingCSS, shadowCSS, transitionCSS];
  if (fontCSS) rootLines.push(fontCSS);
  rootLines.push(lightTokens);

  sections.push(`:root {\n  ${rootLines.join("\n  ")}\n}`);

  // ─── Assemble .dark block ──────────────────────────────────────────
  sections.push(`.dark {\n  ${darkTokens}\n}`);

  return sections.join("\n\n");
}
