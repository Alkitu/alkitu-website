"use client";

import { useState } from "react";

export const PRIMARY = "var(--primary)";

export type Step = { nombre: string; sub?: string; detalle: string };

export function Stepper({ steps, escala }: { steps: Step[]; escala?: string }) {
  const [activo, setActivo] = useState(0);
  const item = steps[activo];

  return (
    <div className="text-foreground">
      <div className="flex flex-col gap-2 sm:flex-row">
        {steps.map((s, i) => {
          const on = i === activo;
          return (
            <button
              key={s.nombre}
              type="button"
              aria-pressed={on}
              onClick={() => setActivo(i)}
              className="flex flex-1 items-center gap-3 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-col sm:items-start"
              style={{
                borderColor: on ? PRIMARY : "rgba(212,212,212,0.7)",
                backgroundColor: on ? PRIMARY : "#ffffff",
                color: on ? "#ffffff" : "var(--foreground)",
              }}
            >
              <span
                className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: on ? "rgba(255,255,255,0.22)" : PRIMARY }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium leading-tight">{s.nombre}</span>
            </button>
          );
        })}
      </div>

      {escala ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
          <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--primary) 15%, transparent), var(--primary))" }} />
          {escala} →
        </p>
      ) : null}

      <div className="mt-4 rounded-xl border border-neutral-300/70 bg-neutral-100 p-5">
        <p className="text-base font-semibold" style={{ color: PRIMARY }}>
          {item.nombre}
        </p>
        {item.sub ? <p className="mt-0.5 text-sm font-medium text-neutral-700">{item.sub}</p> : null}
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.detalle}</p>
      </div>
    </div>
  );
}
