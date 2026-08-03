"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, GripVertical, Plus, X } from "lucide-react";

import type { EstadoInicio } from "../_actions";

export type ItemOrden = { id: string; titulo: string };
export type GuardarAccion = (ids: string[]) => Promise<EstadoInicio>;

/**
 * Lista reordenable + seleccionable genérica para la config de la portada
 * (casos · blog). "En portada" es el orden guardado; el resto
 * queda en "Disponibles". Si `maxHome` está definido, solo los primeros N se
 * muestran en la home (se avisa); si no, se muestran todos los seleccionados.
 * `guardar` es un server action inyectado por la página.
 */
export function ListaOrdenable({
  items,
  ordenInicial,
  guardar,
  maxHome,
  ayuda,
  okMsg = "Guardado. La portada ya refleja el cambio.",
}: {
  items: ItemOrden[];
  ordenInicial: string[];
  guardar: GuardarAccion;
  maxHome?: number;
  ayuda: string;
  okMsg?: string;
}) {
  const tituloDe = (id: string) => items.find((c) => c.id === id)?.titulo ?? id;

  const [orden, setOrden] = useState<string[]>(ordenInicial);
  const [pendiente, startTransition] = useTransition();
  const [estado, setEstado] = useState<{ ok: boolean; msg: string } | null>(null);

  const enPortada = orden.filter((id) => items.some((c) => c.id === id));
  const disponibles = items.filter((c) => !enPortada.includes(c.id));

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= enPortada.length) return;
    const next = [...enPortada];
    [next[i], next[j]] = [next[j], next[i]];
    setOrden(next);
    setEstado(null);
  };
  const quitar = (id: string) => {
    setOrden(enPortada.filter((s) => s !== id));
    setEstado(null);
  };
  const anadir = (id: string) => {
    setOrden([...enPortada, id]);
    setEstado(null);
  };

  const onGuardar = () => {
    setEstado(null);
    startTransition(async () => {
      const r = await guardar(enPortada);
      setEstado(r.ok ? { ok: true, msg: okMsg } : { ok: false, msg: r.error ?? "No se pudo guardar." });
    });
  };

  const sinCambios = JSON.stringify(orden) === JSON.stringify(ordenInicial);

  return (
    <div className="max-w-2xl">
      {/* EN PORTADA */}
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">En portada</h3>
        <span className="text-xs text-neutral-400">{ayuda}</span>
      </div>

      {enPortada.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-6 text-sm text-neutral-500">
          Nada en portada. Añade algo desde «Disponibles».
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {enPortada.map((id, i) => {
            const visible = maxHome === undefined || i < maxHome;
            return (
              <li
                key={id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                  visible ? "border-neutral-300/70 bg-foreground/[0.02]" : "border-neutral-200 opacity-60"
                }`}
              >
                <GripVertical className="h-4 w-4 shrink-0 text-neutral-300" strokeWidth={1.75} />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-xs font-medium text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{tituloDe(id)}</span>
                {!visible && <span className="shrink-0 text-xs text-neutral-400">fuera de la home</span>}
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                    className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-foreground/[0.05] hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(i, 1)}
                    disabled={i === enPortada.length - 1}
                    aria-label="Bajar"
                    className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-foreground/[0.05] hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => quitar(id)}
                    aria-label="Quitar de portada"
                    className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-primary/[0.06] hover:text-primary"
                  >
                    <X className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* DISPONIBLES */}
      {disponibles.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-500">Disponibles</h3>
          <ul className="flex flex-col gap-2">
            {disponibles.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] text-neutral-600">{c.titulo}</span>
                <button
                  type="button"
                  onClick={() => anadir(c.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Añadir
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* GUARDAR */}
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onGuardar}
          disabled={pendiente || sinCambios}
          className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3 text-body font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {pendiente ? "Guardando…" : "Guardar orden"}
        </button>
        {estado && (
          <span
            className={`inline-flex items-center gap-1.5 text-sm ${estado.ok ? "text-primary" : "text-red-600"}`}
          >
            {estado.ok && <Check className="h-4 w-4" strokeWidth={2} />}
            {estado.msg}
          </span>
        )}
      </div>
    </div>
  );
}
