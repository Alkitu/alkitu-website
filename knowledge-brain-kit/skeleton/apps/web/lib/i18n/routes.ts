import routeMap from "./route-map.json";

/**
 * Traducción de slugs ES↔EN (Historia 7-1 / FR-41). El árbol EN del Índice usa
 * slugs traducidos (/en/about, /en/case-studies, /en/lab/werewolf…); los
 * segmentos internos de app/[lang]/ mantienen los nombres ES. El mapa vive en
 * route-map.json (única fuente, también la lee scripts/check-links.mjs).
 * Coincidencia por prefijo más largo respetando límites de segmento.
 */
const ES_TO_EN: ReadonlyArray<[string, string]> = Object.entries(routeMap);
const EN_TO_ES: ReadonlyArray<[string, string]> = ES_TO_EN.map(([es, en]) => [en, es]);

function translateSegments(path: string, entries: ReadonlyArray<[string, string]>): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (!clean) return "/";
  let best: [string, string] | undefined;
  for (const entry of entries) {
    const [from] = entry;
    if ((clean === from || clean.startsWith(`${from}/`)) && (!best || from.length > best[0].length)) {
      best = entry;
    }
  }
  return `/${best ? best[1] + clean.slice(best[0].length) : clean}`;
}

/** Ruta pública EN para una ruta ES sin prefijo: "/" → "/en", "/sobre-mi" → "/en/about". */
export function enPathFor(esPath: string): string {
  const translated = translateSegments(esPath, ES_TO_EN);
  return translated === "/" ? "/en" : `/en${translated}`;
}

/** Ruta interna (segmentos ES, sin prefijo) para una URL pública EN: "/en/about" → "/sobre-mi". */
export function esPathForEn(enPublicPath: string): string {
  const rest = enPublicPath.replace(/^\/en(?=\/|$)/, "");
  return translateSegments(rest || "/", EN_TO_ES);
}
