import Link from "next/link";

// 404 global (Historia 5-3 / FR-30): estilo editorial del DS con tokens.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-page flex-col items-center justify-center px-6 py-32 text-center">
      <p className="text-sm tracking-wide text-neutral-400">Error 404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
        Esta página no existe<span className="text-primary">.</span>
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-neutral-600">
        El enlace puede estar roto o la página se movió. Desde la portada llegas a
        todo el contenido.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-body font-medium text-background transition-opacity hover:opacity-85"
      >
        Volver al inicio <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
