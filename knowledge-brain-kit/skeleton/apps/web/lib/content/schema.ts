import { z } from "zod";

/**
 * Esquema del frontmatter de un artículo de blog (colección `content/blog`).
 * Fuente única: el listado, los relacionados y el detalle se derivan de aquí.
 * Los campos de las Capas 2 (SEO/URL) y 3 (GEO) del Contrato van tipados y
 * opcionales para poder cablearlos en la Épica 4 sin `[key: string]: unknown`.
 */
export const blogFrontmatterSchema = z.object({
  // Capa 1 — semántica / presentación
  title: z.string().min(1),
  fecha: z.string().optional(),
  autor: z.string().optional(),
  categoria: z.string().optional(),
  tags: z.array(z.string()).default([]),
  lectura: z.string().optional(),
  extracto: z.string().optional(),
  portada: z.string().optional(),
  estado: z.string().optional(),
  // Capa 2 — SEO / URL
  "keyword-principal": z.string().optional(),
  "keywords-secundarias": z.array(z.string()).optional(),
  "schema-tipo": z.string().optional(),
  "intencion-busqueda": z.string().optional(),
  slug: z.string().optional(),
  canonical: z.string().optional(),
  "hreflang-alt": z.string().optional(),
  idiomas: z.array(z.string()).optional(),
  // Capa 3 — GEO
  "geo-preguntas": z.array(z.string()).optional(),
  // Respuestas alineadas por índice con geo-preguntas → FAQPage (JSON-LD).
  "geo-respuestas": z.array(z.string()).optional(),
  "geo-respuesta-corta": z.string().optional(),
  "geo-entidades": z.array(z.string()).optional(),
  "geo-datos-citables": z.array(z.string()).optional(),
  // Capa 5 — metadatos de archivo (YAML puede parsearlos como Date)
  creado: z.union([z.string(), z.date()]).optional(),
  actualizado: z.union([z.string(), z.date()]).optional(),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
