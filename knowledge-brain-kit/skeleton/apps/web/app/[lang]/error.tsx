"use client";

import Link from "next/link";
import { useEffect } from "react";

// Error boundary de segmento (Historia 5-3 / FR-30): estilo del DS + reintento.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registra el error para diagnóstico (visible en logs del servidor/cliente).
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-page flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm tracking-wide text-neutral-400">Algo salió mal</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
        Se produjo un error<span className="text-primary">.</span>
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-neutral-600">
        Ha fallado algo al cargar esta página. Puedes reintentar o volver al inicio.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-body font-medium text-background transition-opacity hover:opacity-85"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="border-b border-foreground pb-1 text-body transition-opacity hover:opacity-60"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
