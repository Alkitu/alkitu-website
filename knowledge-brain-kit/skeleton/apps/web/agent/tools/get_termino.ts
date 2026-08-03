import { defineTool } from "eve/tools";
import { z } from "zod";

import { getTermino } from "../../lib/agent/glosario";

export default defineTool({
  description:
    "Devuelve un término completo del glosario por slug: definición, taxonomía (hiperónimos, hipónimos, relacionados) y versión EN. Úsala para profundizar tras query_glosario.",
  inputSchema: z.object({
    slug: z.string().describe("Slug exacto del término (lo da query_glosario)"),
  }),
  async execute({ slug }) {
    const termino = getTermino(slug);
    return termino ?? { error: `No existe el término "${slug}" en el glosario.` };
  },
});
