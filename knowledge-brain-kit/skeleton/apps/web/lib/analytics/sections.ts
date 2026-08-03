/**
 * Sección canónica de una ruta pública (para "top por sección"). Normaliza el
 * prefijo de locale y los slugs EN a la misma sección que su equivalente ES.
 */
export const SECTIONS = [
  "home",
  "blog",
  "wiki",
  "casos-de-estudio",
  "reviews",
  "sobre-mi",
  "contacto",
  "otros",
] as const;

export type Section = (typeof SECTIONS)[number];

// Primer segmento (ES o EN) → sección canónica.
const SEGMENT_TO_SECTION: Record<string, Section> = {
  blog: "blog",
  wiki: "wiki",
  "casos-de-estudio": "casos-de-estudio",
  "case-studies": "casos-de-estudio",
  reviews: "reviews",
  "sobre-mi": "sobre-mi",
  about: "sobre-mi",
  contacto: "contacto",
  contact: "contacto",
};

export function sectionForPath(path: string): Section {
  const clean = path.split("?")[0]!.replace(/^\/(en|es)(?=\/|$)/, "");
  if (clean === "" || clean === "/") return "home";
  const seg = clean.split("/").filter(Boolean)[0] ?? "";
  return SEGMENT_TO_SECTION[seg] ?? "otros";
}

export const SECTION_LABEL: Record<Section, string> = {
  home: "Inicio",
  blog: "Blog",
  wiki: "Wiki",
  "casos-de-estudio": "Casos",
  reviews: "Reviews",
  "sobre-mi": "Sobre mí",
  contacto: "Contacto",
  otros: "Otros",
};
