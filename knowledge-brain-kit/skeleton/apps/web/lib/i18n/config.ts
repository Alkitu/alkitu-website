/**
 * Locales del sitio (Historia 7-1 / FR-41): ES en raíz sin prefijo (URLs
 * intactas), EN bajo /en/. El locale llega a las páginas por `params.lang`
 * (segmento app/[lang]/), nunca por headers() — así el SSG se conserva.
 */
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
