import { defineTool } from "eve/tools";
import { z } from "zod";

import { listSecciones } from "../../lib/agent/secciones";

export default defineTool({
  description:
    "Mapa del sitio: secciones disponibles, su URL y para qué sirve cada una. Úsala para orientar al usuario o cuando la pregunta queda fuera de la base de conocimiento.",
  inputSchema: z.object({}),
  async execute() {
    return { secciones: listSecciones() };
  },
});
