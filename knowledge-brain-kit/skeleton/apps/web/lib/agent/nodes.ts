import { readFileSync } from "node:fs";

import matter from "gray-matter";

import { resolveAsset } from "./paths";

/** Secciones del cerebro → su nodo de Context (Capa 3 GEO = respuestas pre-extraídas). */
const NODOS: Record<string, string> = {
  landing: "Context/01-Landing/Landing.es.md",
  about: "Context/02-About/About.es.md",
  wiki: "Context/03-Wiki/Wiki.es.md",
  blog: "Context/04-Blog/Blog.es.md",
  reviews: "Context/05-Reviews/Reviews.es.md",
  casos: "Context/07-Casos-de-Estudio/Casos.es.md",
  contacto: "Context/08-Contacto/Contacto.es.md",
};

export function seccionesDisponibles(): string[] {
  return Object.keys(NODOS);
}

/**
 * Lee el nodo blueprint de una sección y devuelve su capa GEO: respuesta corta
 * citable, preguntas que responde, entidades y URL. Es la fuente de verdad de
 * "qué es esta sección" — el agente cita desde aquí sin generar de cero.
 */
export function getNode(seccion: string) {
  const rel = NODOS[seccion.toLowerCase()];
  if (!rel) return { error: `Sección desconocida. Disponibles: ${seccionesDisponibles().join(", ")}` };
  const p = resolveAsset(rel, `../../${rel}`);
  if (!p) return { error: "Nodo de Context no disponible en este despliegue." };
  try {
    const { data } = matter(readFileSync(p, "utf8"));
    return {
      seccion,
      titulo: data.title ?? seccion,
      respuestaCorta: data["geo-respuesta-corta"] ?? null,
      preguntas: data["geo-preguntas"] ?? [],
      entidades: data["geo-entidades"] ?? [],
      slug: data.slug ?? null,
      estadoContenido: data.estado ?? null,
    };
  } catch {
    return { error: "No se pudo leer el nodo." };
  }
}
