"use client";

import Image from "next/image";

import { PageHero } from "@brain/design-system-web/patterns/page-hero";
import { usePaginacion, ControlPaginacion } from "@brain/design-system-web/compositions/paginacion";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
// La portada (imagen destacada) se lee de _data/casos.ts — misma fuente que el
// detalle, para que listado y detalle NUNCA se desincronicen. Aquí solo vive la
// copia de la tarjeta (descripción, rol, año, resultado), específica del listado.
import { getCaso } from "../_data/casos";

type CasoCard = {
  slug: string;
  titulo: string;
  descripcion: string;
  rol: string;
  anio: string;
  resultado: string;
};

// Plantilla por locale (Historia 7-3 / FR-43). Los casos no tienen par EN:
// las tarjetas enlazan al detalle ES (URL canónica) también bajo /en/.
const T: Record<Locale, { title: string; lead: string; leadNote: string; casos: CasoCard[] }> = {
  es: {
    title: "Casos de estudio",
    lead: "Casos de estudio sobre [concepto]: del problema al resultado.",
    leadNote: "Proceso, decisiones y aprendizajes.",
    casos: [
      {
        slug: "plantilla-caso",
        titulo: "[Concepto]",
        descripcion:
          "Descripción breve del caso para la tarjeta del listado: qué resuelve [concepto] y para quién.",
        rol: "[Rol]",
        anio: "2025",
        resultado: "[Resultado destacable]",
      },
    ],
  },
  en: {
    title: "Case studies",
    lead: "Case studies on [concept]: from problem to outcome.",
    leadNote: "Process, decisions and learnings.",
    casos: [
      {
        slug: "plantilla-caso",
        titulo: "[Concept]",
        descripcion:
          "Short card description for the listing: what [concept] solves and for whom.",
        rol: "[Role]",
        anio: "2025",
        resultado: "[Noteworthy outcome]",
      },
    ],
  },
};

export function CasosListado({ lang = "es" }: { lang?: Locale }) {
  const t = T[lang];
  const dict = getDictionary(lang);
  // La URL pública EN traduce el segmento (route-map): /en/case-studies.
  const base = lang === "en" ? "/en/case-studies" : "/casos-de-estudio";
  const pag = usePaginacion(t.casos, { porPaginaInicial: 4 });
  return (
    <>
      {/* HERO */}
      <PageHero
        title={t.title}
        className="pb-24 pt-32 md:pb-32 md:pt-44"
        gridClassName="gap-12"
        titleClassName="leading-[0.95] tracking-[-0.035em] text-balance text-[clamp(2.6rem,7vw,6rem)] md:col-span-9"
        leadClassName="md:col-span-3 md:pb-4"
        lead={
          <>
            {t.lead}
            <span className="mt-2 block text-neutral-600">{t.leadNote}</span>
          </>
        }
      />

      {/* GRID DE CASOS */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-page px-6 py-20 md:py-28">
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
            {pag.slice.map((caso) => {
              const portada = getCaso(caso.slug)?.portada;
              return (
              <a
                key={caso.slug}
                href={`${base}/${caso.slug}`}
                className="group block"
              >
                {/* Portada */}
                <div className="relative flex aspect-[4/3] w-full items-end overflow-hidden rounded-sm bg-accent transition-opacity group-hover:opacity-90">
                  {portada ? (
                    <Image
                      src={portada}
                      alt={caso.titulo}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden className="p-6 text-2xl font-semibold leading-tight tracking-tight text-primary md:text-3xl">
                      {caso.titulo}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors md:text-[1.9rem] group-hover:text-primary">
                    {caso.titulo}
                  </h2>
                  <p className="mt-3 max-w-xl text-body leading-relaxed text-neutral-600">
                    {caso.descripcion}
                  </p>

                  {/* Meta */}
                  <p className="mt-5 text-sm text-neutral-500">
                    {caso.rol}
                    <span className="mx-2 text-neutral-300">·</span>
                    {caso.anio}
                    <span className="mx-2 text-neutral-300">·</span>
                    <span className="font-medium text-primary">
                      {caso.resultado}
                    </span>
                  </p>
                </div>
              </a>
              );
            })}
          </div>
          {pag.totalPaginas > 1 && (
            <ControlPaginacion
              pagina={pag.pagina}
              totalPaginas={pag.totalPaginas}
              porPagina={pag.porPagina}
              setPagina={pag.setPagina}
              setPorPagina={pag.setPorPagina}
              opciones={[4, 6, 10]}
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
