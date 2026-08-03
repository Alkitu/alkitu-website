import type { MetadataRoute } from "next";

import { TERMINOS } from "@/lib/glosario";
import { getAllPosts } from "@/lib/content/blog";
import { hasEnPair } from "@/lib/i18n/pares";
import { enPathFor } from "@/lib/i18n/routes";
import { SLUGS_CASOS } from "./[lang]/casos-de-estudio/_data/casos";
import { getReviewSlugs } from "./[lang]/reviews/_data/reviews";

const BASE = "https://tuconcepto.com";

/**
 * Sitemap de todas las URLs públicas reales (Historia 4-2 / FR-18): páginas
 * estáticas + colecciones (wiki, blog, casos, reviews). `/admin` y `/login`
 * quedan fuera (privadas; ver robots.ts). Prioridad/frecuencia por tipo de
 * colección; `lastModified` del frontmatter donde existe.
 * Bilingüe (Historia 7-4 / FR-44): cada ruta con par EN (lib/i18n/pares.ts)
 * añade su URL /en/ (slug traducido vía enPathFor).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticasEs: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
    { path: "/wiki", changeFrequency: "weekly", priority: 0.9 },
    { path: "/reviews", changeFrequency: "weekly", priority: 0.8 },
    { path: "/casos-de-estudio", changeFrequency: "monthly", priority: 0.8 },
    { path: "/sobre-mi", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contacto", changeFrequency: "yearly", priority: 0.5 },
  ];

  const estaticas: MetadataRoute.Sitemap = estaticasEs.flatMap(({ path, ...resto }) => {
    const es = { url: `${BASE}${path}`, ...resto };
    if (!hasEnPair(path)) return [es];
    // El par EN hereda frecuencia y una prioridad un punto menor (versión secundaria).
    return [es, { url: `${BASE}${enPathFor(path)}`, ...resto, priority: Math.max(0.1, resto.priority - 0.1) }];
  });

  // Cada término tiene par EN (mismo slug bajo /en/wiki): emitimos ambas URLs.
  const wiki: MetadataRoute.Sitemap = TERMINOS.flatMap((t) => [
    { url: `${BASE}/wiki/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/en/wiki/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  // Cada artículo tiene par EN (mismo slug bajo /en/blog): emitimos ambas URLs.
  const posts = await getAllPosts();
  const blog: MetadataRoute.Sitemap = posts.flatMap((p) => {
    const ult = p.frontmatter.actualizado;
    const lastModified = ult ? new Date(ult) : undefined;
    return [
      { url: `${BASE}/blog/${p.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
      { url: `${BASE}/en/blog/${p.slug}`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 },
    ];
  });

  // Casos con par EN (slug compartido; el segmento se traduce: /en/case-studies).
  const casos: MetadataRoute.Sitemap = SLUGS_CASOS.flatMap((slug) => [
    { url: `${BASE}/casos-de-estudio/${slug}`, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${BASE}/en/case-studies/${slug}`, changeFrequency: "yearly" as const, priority: 0.5 },
  ]);

  const reviews: MetadataRoute.Sitemap = getReviewSlugs().flatMap((slug) => [
    { url: `${BASE}/reviews/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/en/reviews/${slug}`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  return [...estaticas, ...wiki, ...blog, ...casos, ...reviews];
}
