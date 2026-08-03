/**
 * Pares ES↔EN publicados (Historia 7-4 / FR-44): rutas ES (sin prefijo) cuya
 * versión EN sirve contenido/plantilla EN real. Única fuente para hreflang
 * (alternatesFor) y para las URLs EN del sitemap. Al publicar un par nuevo
 * (runbook en los nodos -Entrada del Context), añádelo aquí.
 */
export const PARES_EN: ReadonlySet<string> = new Set([
  "/",
  "/sobre-mi",
  "/blog",
  "/wiki",
  "/reviews",
  "/casos-de-estudio",
  "/contacto",
]);

export function hasEnPair(esPath: string): boolean {
  return PARES_EN.has(esPath);
}
