"use client";

import Link from "next/link";
import { useActionState } from "react";

import { desbloquearCasos, type EstadoAcceso } from "../_actions";

/**
 * Puerta de acceso de los casos protegidos por propiedad intelectual: aviso +
 * formulario de contraseña (server action → cookie) + CTA a contacto para
 * pedir acceso. El contenido del caso NO se renderiza detrás: la página solo
 * lo sirve cuando la cookie existe.
 */
export function CasoProtegido({ titulo, tags }: { titulo: string; tags: string[] }) {
  const [estado, action, pending] = useActionState<EstadoAcceso, FormData>(
    desbloquearCasos,
    { ok: false },
  );

  return (
    <section className="mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:pt-44">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] text-neutral-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-8 max-w-5xl font-bold leading-[0.95] tracking-[-0.035em] text-[clamp(2.6rem,8vw,7rem)]">
        {titulo}
        <span className="text-primary">.</span>
      </h1>

      <div className="mt-14 max-w-xl rounded-2xl border border-neutral-300/80 bg-white/50 p-8 md:p-10">
        <div className="flex items-center gap-3">
          {/* candado (lucide lock, inline) */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Contenido protegido
          </p>
        </div>

        <p className="mt-5 text-lg leading-relaxed text-neutral-700">
          Este caso está protegido por acuerdos de propiedad intelectual con el
          cliente. Si estás valorando trabajar conmigo y necesitas ver trabajo
          previo, <Link href="/contacto" className="font-medium text-primary underline underline-offset-4">contáctame</Link> y
          te doy acceso.
        </p>

        <form action={action} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            name="clave"
            required
            autoComplete="off"
            placeholder="Contraseña"
            aria-label="Contraseña de acceso"
            className="flex-1 rounded-sm border border-neutral-300 bg-white px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-foreground px-7 py-3.5 text-[15px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {pending ? "Comprobando…" : "Ver el caso"}
          </button>
        </form>
        {estado.error ? (
          <p role="alert" className="mt-3 text-sm text-primary">
            {estado.error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
