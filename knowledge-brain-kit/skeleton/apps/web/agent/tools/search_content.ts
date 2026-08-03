import { defineTool } from "eve/tools";
import { z } from "zod";

import { searchContent } from "../../lib/agent/content";

export default defineTool({
  description:
    "Busca en el contenido largo del sitio (artículos del blog, casos de estudio, reviews). Devuelve fragmentos con URL fuente. Úsala cuando la pregunta pide detalle más allá de una definición.",
  inputSchema: z.object({
    q: z.string().describe("Texto a buscar"),
    seccion: z.enum(["blog", "casos", "reviews"]).optional().describe("Limitar a una sección"),
  }),
  async execute({ q, seccion }) {
    const fragmentos = searchContent(q, seccion);
    return fragmentos.length ? { fragmentos } : { fragmentos: [], nota: "Sin coincidencias en el contenido." };
  },
});
