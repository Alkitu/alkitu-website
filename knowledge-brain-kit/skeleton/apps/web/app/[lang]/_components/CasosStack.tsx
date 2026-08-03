import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";

export type CasoStackItem = {
  slug: string;
  titulo: string;
  subtitulo: string;
  tags: string[];
  portada?: string;
};

const COPY: Record<Locale, { eyebrow: string; titulo: string; verTodos: string; verCaso: string; verTodosHref: string }> = {
  es: {
    eyebrow: "Trabajo seleccionado",
    titulo: "Casos de estudio",
    verTodos: "Ver todos los casos",
    verCaso: "Ver caso",
    verTodosHref: "/casos-de-estudio",
  },
  en: {
    eyebrow: "Selected work",
    titulo: "Case studies",
    verTodos: "See all case studies",
    verCaso: "View case",
    verTodosHref: "/en/case-studies",
  },
};

/**
 * Casos de estudio de la portada que se APILAN al hacer scroll (sticky-stack,
 * CSS puro, sin JS): cada tarjeta se queda pegada a un `top` incremental, así la
 * siguiente entra por debajo y monta sobre la anterior. El orden y la selección
 * los define el admin (/admin/inicio) vía lib/home/config. Fondo opaco para que
 * cada tarjeta tape a la de atrás.
 */
export function CasosStack({ casos, lang = "es" }: { casos: CasoStackItem[]; lang?: Locale }) {
  const t = COPY[lang];
  if (casos.length === 0) return null;

  return (
    <section className="border-t border-neutral-300/70">
      <div className="mx-auto max-w-page px-6 py-24 md:py-32">
        {/* Cabecera de sección */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-neutral-500">{t.eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-[3.4rem]">
              {t.titulo}
            </h2>
          </div>
          <Link
            href={t.verTodosHref}
            className="border-b border-foreground pb-1 text-body transition-opacity hover:opacity-60"
          >
            {t.verTodos}
          </Link>
        </div>

        {/* Stack apilable — contenido (no a sangre): más elegante y respirado */}
        <div className="mx-auto flex max-w-4xl flex-col gap-8 md:gap-12">
          {casos.map((caso, i) => (
            <article
              key={caso.slug}
              className="sticky"
              // top incremental bajo el header overlay (h-16 = 4rem): cada tarjeta
              // se pega un poco más abajo → se ve el borde de la anterior apilado.
              style={{ top: `calc(5rem + ${i * 1.75}rem)` }}
            >
              <Link
                href={`/casos-de-estudio/${caso.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-neutral-200/80 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-xl md:grid-cols-2"
              >
                {/* Portada */}
                <div className="relative flex aspect-[16/10] items-end overflow-hidden bg-accent md:aspect-auto md:min-h-[24rem]">
                  {caso.portada ? (
                    <Image
                      src={caso.portada}
                      alt={caso.titulo}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span aria-hidden className="p-8 text-3xl font-semibold tracking-tight text-primary">
                      {caso.titulo}
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex flex-col justify-center gap-5 p-8 md:p-12">
                  <span className="text-sm font-medium text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-4xl">
                    {caso.titulo}
                  </h3>
                  <p className="max-w-xl text-body leading-relaxed text-neutral-600">
                    {caso.subtitulo}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {caso.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/[0.07] px-3 py-1 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-2 inline-flex items-center gap-2 text-body font-medium">
                    {t.verCaso}
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
