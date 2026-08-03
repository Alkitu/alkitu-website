"use client";

import { useEffect, useState } from "react";

/** Valor de "Todos" en el selector de items por página. */
export const TODOS = 9999;

/**
 * Hook de paginación en cliente. Recibe la lista (ya filtrada) y devuelve la
 * porción de la página actual + los controles. Resetea a la página 1 cuando
 * cambia `resetKey` (p. ej. un filtro/búsqueda) o el nº de items por página.
 * ds:compositions/paginacion.
 */
export function usePaginacion<T>(
  items: T[],
  opts?: { porPaginaInicial?: number; resetKey?: unknown },
) {
  const [porPagina, setPorPagina] = useState<number>(opts?.porPaginaInicial ?? 9);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setPagina(1);
  }, [opts?.resetKey, porPagina]);

  const total = items.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const actual = Math.min(pagina, totalPaginas);
  const desde = total === 0 ? 0 : (actual - 1) * porPagina + 1;
  const hasta = Math.min(actual * porPagina, total);
  const slice = items.slice((actual - 1) * porPagina, actual * porPagina);

  return { pagina: actual, setPagina, porPagina, setPorPagina, total, totalPaginas, desde, hasta, slice };
}

/** Textos del control (diccionarios por locale — Historia 7-2 / FR-42). */
export type PaginacionLabels = {
  mostrando: string;
  de: string;
  porPagina: string;
  todos: string;
  pagina: string;
  porPaginaAria: string;
  anteriorAria: string;
  siguienteAria: string;
};

const LABELS_ES: PaginacionLabels = {
  mostrando: "Mostrando",
  de: "de",
  porPagina: "Por página",
  todos: "Todos",
  pagina: "Página",
  porPaginaAria: "Elementos por página",
  anteriorAria: "Página anterior",
  siguienteAria: "Página siguiente",
};

/** Administrador de paginación: items por página + navegación anterior/siguiente. */
export function ControlPaginacion({
  pagina,
  totalPaginas,
  porPagina,
  setPagina,
  setPorPagina,
  opciones = [9, 12, 24],
  desde,
  hasta,
  total,
  labels = LABELS_ES,
}: {
  pagina: number;
  totalPaginas: number;
  porPagina: number;
  setPagina: (n: number) => void;
  setPorPagina: (n: number) => void;
  opciones?: number[];
  desde: number;
  hasta: number;
  total: number;
  labels?: PaginacionLabels;
}) {
  if (total === 0) return null;

  const btn =
    "grid h-9 w-9 place-items-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:border-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600";

  return (
    <div className="mt-14 flex flex-col gap-5 border-t border-neutral-300/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        {labels.mostrando} <span className="text-neutral-800">{desde}–{hasta}</span> {labels.de}{" "}
        <span className="text-neutral-800">{total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-6">
        {/* Items por página */}
        <label className="flex items-center gap-2 text-sm text-neutral-500">
          {labels.porPagina}
          <select
            value={porPagina}
            onChange={(e) => setPorPagina(Number(e.target.value))}
            className="rounded-full border border-neutral-300 bg-white py-1.5 pl-3 pr-7 text-sm text-neutral-800 outline-none transition-colors hover:border-neutral-500 focus:border-neutral-900"
            aria-label={labels.porPaginaAria}
          >
            {opciones.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value={TODOS}>{labels.todos}</option>
          </select>
        </label>

        {/* Anterior / Siguiente */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina <= 1}
            aria-label={labels.anteriorAria}
            className={btn}
          >
            ←
          </button>
          <span className="min-w-[5.5rem] text-center text-sm text-neutral-500">
            {labels.pagina} <span className="text-neutral-800">{pagina}</span> / {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina >= totalPaginas}
            aria-label={labels.siguienteAria}
            className={btn}
            style={pagina < totalPaginas ? { color: "var(--primary)", borderColor: "var(--primary)" } : undefined}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
