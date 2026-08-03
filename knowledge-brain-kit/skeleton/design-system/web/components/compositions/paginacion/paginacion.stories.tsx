import type { Meta, StoryObj } from "@storybook/react";
import { ControlPaginacion, usePaginacion } from "./paginacion";

const meta: Meta<typeof ControlPaginacion> = {
  title: "Compositions/Paginacion",
  component: ControlPaginacion,
  tags: ["autodocs"],
};
export default meta;

export const Interactiva: StoryObj<typeof ControlPaginacion> = {
  render: () => {
    const items = Array.from({ length: 42 }, (_, i) => i + 1);
    const pag = usePaginacion(items, { porPaginaInicial: 8 });
    return (
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm text-neutral-500">Ítems visibles: {pag.slice.join(", ")}</p>
        <ControlPaginacion
          pagina={pag.pagina}
          totalPaginas={pag.totalPaginas}
          porPagina={pag.porPagina}
          setPagina={pag.setPagina}
          setPorPagina={pag.setPorPagina}
          opciones={[8, 12, 24]}
          desde={pag.desde}
          hasta={pag.hasta}
          total={pag.total}
        />
      </div>
    );
  },
};
