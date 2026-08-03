import { defineTool } from "eve/tools";
import { z } from "zod";

import { queryGraph } from "../../lib/agent/graph";

export default defineTool({
  description:
    "Consulta el grafo de conocimiento: qué se relaciona con un concepto (vecinos directos y su comunidad temática). Úsala para preguntas transversales o cuando el glosario no matchea.",
  inputSchema: z.object({
    concepto: z.string().describe("Concepto o etiqueta a localizar en el grafo"),
  }),
  async execute({ concepto }) {
    const r = queryGraph(concepto);
    return r ?? { error: "El grafo no está generado en este despliegue (pnpm graph). Usa query_glosario o search_content." };
  },
});
