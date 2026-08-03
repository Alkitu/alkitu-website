"use client";

import "./globals.css";

// Error boundary raíz (Historia 5-3 / FR-30): reemplaza el layout, así que
// renderiza su propio <html>/<body> e importa los tokens para el estilo del DS.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className="light">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <section className="mx-auto flex min-h-dvh max-w-page flex-col items-center justify-center px-6 py-32 text-center">
          <p className="text-sm tracking-wide text-neutral-400">Error del servidor</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Algo se rompió<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-neutral-600">
            Estamos teniendo un problema técnico. Reintenta en un momento.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-9 inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-body font-medium text-background transition-opacity hover:opacity-85"
          >
            Reintentar
          </button>
        </section>
      </body>
    </html>
  );
}
