"use client";

import Image from "next/image";
import { useState } from "react";

import { PageHero } from "@brain/design-system-web/patterns/page-hero";
import { FilterChips } from "@brain/design-system-web/patterns/filter-chips";
import { CATEGORIAS, reviewsLocalizados, imagenDe, type Categoria } from "../_data/reviews";
import { Estrellas } from "@brain/design-system-web/primitives/estrellas";
import { IconoReview } from "./IconoReview";
import { usePaginacion, ControlPaginacion } from "@brain/design-system-web/compositions/paginacion";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

// Plantilla por locale (Historia 7-3 / FR-43). Las reseñas no tienen par EN:
// las tarjetas (contenido ES) enlazan al detalle ES también bajo /en/.
const T = {
  es: {
    lead: "Reseñas de herramientas y recursos relacionados con [concepto], probados de verdad antes de recomendarlos.",
    disclosure:
      "Divulgación de afiliación: algunos enlaces de estas reseñas son de afiliados. Si compras a través de ellos podemos recibir una comisión sin coste adicional para ti. Solo recomendamos lo que usamos y nos convence.",
    masInfo: "Más información →",
    vacio: "No hay reseñas en esta categoría todavía.",
    categoria: (id: Categoria, label: string) => label,
  },
  en: {
    lead: "Reviews of tools and resources related to [concept], genuinely tested before being recommended.",
    disclosure:
      "Affiliate disclosure: some links in these reviews are affiliate links. If you buy through them we may earn a commission at no extra cost to you. We only recommend what we use and trust.",
    masInfo: "Learn more →",
    vacio: "No reviews in this category yet.",
    categoria: (id: Categoria, label: string) =>
      ({ hardware: "Hardware", software: "Software", stack: "Stack", "metodología": "Methodology" })[id] ?? label,
  },
} as const;

export function ReviewsListado({ lang = "es" }: { lang?: Locale }) {
  const t = T[lang];
  const dict = getDictionary(lang);
  const base = lang === "en" ? "/en/reviews" : "/reviews";
  const reviews = reviewsLocalizados(lang);
  const [activa, setActiva] = useState<Categoria | "todas">("todas");

  const visibles = (activa === "todas"
    ? reviews
    : reviews.filter((r) => r.categoria === activa)
  )
    .slice()
    .sort((a, b) =>
      a.titulo.localeCompare(b.titulo, "es", { numeric: true, sensitivity: "base" }),
    );

  const pag = usePaginacion(visibles, { porPaginaInicial: 8, resetKey: activa });

  return (
    <>
      {/* CABECERA */}
      <PageHero
        title="Reviews"
        titleClassName="leading-[0.95] tracking-[-0.035em] text-balance text-[clamp(2.8rem,8vw,6rem)] md:col-span-7"
        leadClassName="md:col-span-5 md:pb-3"
        lead={<>{t.lead}</>}
      >
        {/* Disclosure de afiliación */}
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-neutral-500">
          {t.disclosure}
        </p>
      </PageHero>

      {/* FILTROS + GRID */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-page px-6 py-14 md:py-20">
          {/* Chips de categoría */}
          <FilterChips
            className="mb-12 gap-3"
            value={activa === "todas" ? null : activa}
            onChange={(id) => setActiva((id as Categoria | null) ?? "todas")}
            options={CATEGORIAS.map((c) => ({ id: c.id, label: t.categoria(c.id, c.label) }))}
          />

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pag.slice.map((r) => (
              <a
                key={r.slug}
                href={`${base}/${r.slug}`}
                className="group flex flex-col rounded-xl border border-neutral-300/70 bg-white/40 p-6 transition-colors hover:border-neutral-400"
              >
                <div className="mb-5 flex items-start justify-between">
                  {/* Logo / icono */}
                  <div className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md bg-neutral-100">
                    {r.categoria === "metodología" ? (
                      <IconoReview nombre={r.icono ?? "layers"} className="h-6 w-6 text-neutral-700" />
                    ) : (
                      <Image
                        src={imagenDe(r.slug, r.logo)}
                        alt={r.titulo}
                        fill
                        sizes="44px"
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                  <span className="rounded-full border border-neutral-300/70 px-2.5 py-0.5 text-xs capitalize text-neutral-500">
                    {t.categoria(r.categoria, r.categoria)}
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight">{r.titulo}</h2>
                <div className="mt-2">
                  <Estrellas rating={r.rating} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                  {r.descripcion}
                </p>

                <span className="mt-5 inline-flex items-center text-sm font-medium text-primary transition-opacity group-hover:opacity-70">
                  {t.masInfo}
                </span>
              </a>
            ))}
          </div>

          {visibles.length === 0 ? (
            <p className="py-16 text-center text-neutral-500">{t.vacio}</p>
          ) : (
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
              labels={dict.paginacion}
            />
          )}
        </div>
      </section>
    </>
  );
}
