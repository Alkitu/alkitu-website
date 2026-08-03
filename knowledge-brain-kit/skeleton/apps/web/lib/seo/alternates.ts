import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { enPathFor } from "@/lib/i18n/routes";

/**
 * Infraestructura hreflang (Historia 4-7 / FR-26, activada en la 7-4 / FR-44):
 * construye `alternates` con canonical del locale actual y, SOLO si existe la
 * versión EN (par en lib/i18n/pares.ts), los `languages` ES/EN recíprocos +
 * x-default. Sin par EN no emite hreflang (evita alternates rotos). La URL EN
 * sale de enPathFor() (slugs traducidos del route-map: /sobre-mi → /en/about).
 *
 *   ...alternatesFor("/blog", { lang })                  // solo canonical del locale
 *   ...alternatesFor("/blog", { hasEn: true, lang })     // + hreflang ES/EN recíproco
 */
export function alternatesFor(
  path: string,
  opts?: { hasEn?: boolean; lang?: Locale },
): Pick<Metadata, "alternates"> {
  const enPath = enPathFor(path);
  const canonical = opts?.lang === "en" ? enPath : path;
  if (!opts?.hasEn) return { alternates: { canonical } };
  return {
    alternates: {
      canonical,
      languages: {
        es: path,
        en: enPath,
        "x-default": path,
      },
    },
  };
}
