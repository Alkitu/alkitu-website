"use client";

import { useState } from "react";

export const PRIMARY = "var(--primary)";

export type RevealItem = {
  badge: string; // letra/símbolo (puede ir vacío para usar solo color)
  nombre: string;
  sub?: string; // lema o pregunta
  detalle: string;
  color?: string; // acento opcional (p. ej. sombreros de color)
};

export function RevealGrid({
  items,
  cols = "lg:grid-cols-4",
}: {
  items: RevealItem[];
  cols?: string;
}) {
  const [activo, setActivo] = useState(0);
  const item = items[activo];
  const acc = item.color ?? PRIMARY;

  return (
    <div className="text-foreground">
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${cols}`}>
        {items.map((it, i) => {
          const on = i === activo;
          const c = it.color ?? PRIMARY;
          return (
            <button
              key={it.nombre}
              type="button"
              aria-pressed={on}
              aria-label={it.sub ? `${it.nombre}: ${it.sub}` : it.nombre}
              onClick={() => setActivo(i)}
              className="flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: on ? c : "rgba(212,212,212,0.7)",
                backgroundColor: on ? c : "#ffffff",
                color: on ? "#ffffff" : "#2b2b2b",
              }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-semibold leading-none text-white"
                style={{ backgroundColor: on ? "rgba(255,255,255,0.22)" : c }}
              >
                {it.badge}
              </span>
              <span className="text-sm font-medium leading-tight">{it.nombre}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-300/70 bg-neutral-100 p-5">
        <div className="flex items-start gap-4">
          <span
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-xl font-semibold text-white"
            style={{ backgroundColor: acc }}
            aria-hidden="true"
          >
            {item.badge}
          </span>
          <div>
            <p className="text-base font-semibold" style={{ color: acc }}>
              {item.nombre}
            </p>
            {item.sub ? (
              <p className="mt-0.5 text-sm font-medium text-neutral-700">{item.sub}</p>
            ) : null}
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.detalle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
