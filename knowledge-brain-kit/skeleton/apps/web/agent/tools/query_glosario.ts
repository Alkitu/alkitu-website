import { defineTool } from "eve/tools";
import { z } from "zod";

import { queryGlosario } from "../../lib/agent/glosario";

export default defineTool({
  description:
    "Busca términos en el glosario del sitio por texto (título, alias o definición). Devuelve slug, definición citable y URL. Úsala PRIMERO ante cualquier pregunta conceptual.",
  inputSchema: z.object({
    q: z.string().describe("Texto a buscar"),
    dominio: z.string().optional().describe("Filtro opcional por dominio/rama del concepto"),
  }),
  async execute({ q, dominio }) {
    const resultados = queryGlosario(q, dominio);
    return resultados.length ? { resultados } : { resultados: [], nota: "Sin coincidencias en el glosario." };
  },
});
