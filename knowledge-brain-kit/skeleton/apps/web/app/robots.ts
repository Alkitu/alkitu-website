import type { MetadataRoute } from "next";

const BASE = "https://tuconcepto.com";

/**
 * robots.txt (Historia 4-2 / FR-19, NFR-6): permite el crawl público, bloquea
 * las rutas privadas (/admin, /login) y referencia el sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
