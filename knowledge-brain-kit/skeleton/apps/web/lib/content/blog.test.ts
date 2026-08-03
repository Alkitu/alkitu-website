import { describe, it, expect } from "vitest";

import { blogFrontmatterSchema } from "./schema";
import { getAllPosts, getRelatedPosts } from "./blog";

describe("blogFrontmatterSchema", () => {
  it("rechaza frontmatter sin title (rompe el build con campo nombrado)", () => {
    const r = blogFrontmatterSchema.safeParse({ fecha: "18 jun 2026" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].path).toContain("title");
    }
  });

  it("acepta frontmatter válido y tipa tags con default []", () => {
    const r = blogFrontmatterSchema.safeParse({ title: "X" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.tags).toEqual([]);
  });

  it("expone campos SEO/GEO tipados (Capas 2-3)", () => {
    const r = blogFrontmatterSchema.parse({
      title: "X",
      canonical: "https://tuconcepto.com/blog/x",
      "schema-tipo": "Article",
      "geo-preguntas": ["¿qué es X?"],
    });
    expect(r.canonical).toBe("https://tuconcepto.com/blog/x");
    expect(r["schema-tipo"]).toBe("Article");
    expect(r["geo-preguntas"]).toEqual(["¿qué es X?"]);
  });
});

describe("capa de contenido del blog", () => {
  it("getAllPosts deriva del frontmatter (plantilla de ejemplo)", async () => {
    const posts = await getAllPosts();
    // La plantilla trae un artículo de ejemplo por locale.
    expect(posts.length).toBeGreaterThanOrEqual(1);
    expect(posts.map((p) => p.slug)).toContain("plantilla-articulo");
    // Todo post publicado tiene título
    for (const p of posts) expect(p.frontmatter.title.length).toBeGreaterThan(0);
  });

  it("getRelatedPosts excluye el actual y limita a 3", async () => {
    const rel = await getRelatedPosts("plantilla-articulo");
    expect(rel.length).toBeLessThanOrEqual(3);
    expect(rel.map((r) => r.slug)).not.toContain("plantilla-articulo");
  });
});
