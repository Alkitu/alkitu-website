import { defineTool } from "eve/tools";
import { z } from "zod";

import { getNode, seccionesDisponibles } from "../../lib/agent/nodes";

export default defineTool({
  description:
    "Devuelve la ficha blueprint de una sección del sitio: respuesta corta citable, preguntas que responde y entidades. Úsala para '¿qué es esta web/sección?'.",
  inputSchema: z.object({
    seccion: z.enum(["landing", "about", "wiki", "blog", "reviews", "casos", "contacto"]).describe("Sección del sitio"),
  }),
  async execute({ seccion }) {
    return { ...getNode(seccion), disponibles: seccionesDisponibles() };
  },
});
