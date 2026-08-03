/**
 * emails/tokens.ts
 * Design token bridge for React Email.
 *
 * CSS variables can't be used in email HTML — this file maps the
 * [Brand] Design System semantic tokens to hardcoded hex values
 * (light-mode defaults from globals.css).
 */

export const tokens = {
    /* ── Backgrounds ─────────────────────────────────────── */
    background: '#ffffff',
    card: '#ffffff',
    muted: '#f5f5f5',

    /* ── Text ────────────────────────────────────────────── */
    foreground: '#0a0a0a',
    foregroundAlt: '#404040',
    mutedForeground: '#737373',
    primaryForeground: '#fafafa',
    cardForeground: '#0a0a0a',

    /* ── Primary (monochrome brand) ──────────────────────── */
    primary: '#171717',
    primaryHover: '#404040',

    /* ── Accent / Secondary ──────────────────────────────── */
    accent: '#f5f5f5',
    accentForeground: '#171717',

    /* ── Borders ─────────────────────────────────────────── */
    border: '#e5e5e5',

    /* ── Destructive ─────────────────────────────────────── */
    destructive: '#dc2626',
    destructiveForeground: '#dc2626',
    destructiveSubtle: '#fef2f2',
    destructiveBorder: '#ef4444',

    /* ── Raw neutrals (for fine-grained control) ─────────── */
    neutral50: '#fafafa',
    neutral100: '#f5f5f5',
    neutral200: '#e5e5e5',
    neutral300: '#d4d4d4',
    neutral400: '#a3a3a3',
    neutral500: '#737373',
    neutral600: '#525252',
    neutral700: '#404040',
    neutral800: '#262626',
    neutral900: '#171717',
    neutral950: '#0a0a0a',

    /* ── Raw color accents (for branding / CTAs) ─────────── */
    blue500: '#3b82f6',
    blue600: '#2563eb',
    green500: '#22c55e',
    green600: '#16a34a',
    red500: '#ef4444',
    red600: '#dc2626',

    /* ── Typography ──────────────────────────────────────── */
    fontFamily: "'Geist', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    fontFamilyMono: "'Geist Mono', 'Menlo', 'Monaco', monospace",

    /* ── Layout ──────────────────────────────────────────── */
    maxWidth: '600px',
    borderRadius: '8px',
    borderRadiusSm: '4px',
    borderRadiusLg: '12px',
} as const;

export type Tokens = typeof tokens;
