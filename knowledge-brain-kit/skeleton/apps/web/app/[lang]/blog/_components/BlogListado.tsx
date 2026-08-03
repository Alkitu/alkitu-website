"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { PageHero } from "@brain/design-system-web/patterns/page-hero";
import { FilterChips } from "@brain/design-system-web/patterns/filter-chips";
import { usePaginacion, ControlPaginacion } from "@brain/design-system-web/compositions/paginacion";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const CATEGORIAS = [
  "[Categoría 1]",
  "[Categoría 2]",
  "[Categoría 3]",
  "[Categoría 4]",
] as const;

type Categoria = (typeof CATEGORIAS)[number];

// Plantilla por locale (Historia 7-3 / FR-43). Los artículos aún no tienen par
// EN: las tarjetas enlazan al detalle ES (URL canónica) también bajo /en/.
const T = {
  es: {
    lead: "Artículos y notas sobre [concepto]: ideas, guías y aprendizajes.",
    buscar: "Buscar artículos…",
    buscarAria: "Buscar artículos",
    todos: "Todos",
    vacio: "No hay artículos que coincidan con tu búsqueda.",
    lectura: "de lectura",
  },
  en: {
    lead: "Articles and notes on [concept]: ideas, guides and learnings.",
    buscar: "Search articles…",
    buscarAria: "Search articles",
    todos: "All",
    vacio: "No articles match your search.",
    lectura: "read",
  },
} as const;

export type PostListado = {
  slug: string;
  categoria: string;
  titulo: string;
  extracto: string;
  fecha: string;
  lectura: string;
  portada?: string;
};

export function BlogListado({ posts, lang = "es" }: { posts: PostListado[]; lang?: Locale }) {
  const t = T[lang];
  const dict = getDictionary(lang);
  // ES en raíz, EN bajo /en/ con el mismo slug de artículo.
  const base = lang === "en" ? "/en/blog" : "/blog";
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<Categoria | null>(null);

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const coincideFiltro = !filtro || post.categoria === filtro;
      const coincideBusqueda =
        !q ||
        post.titulo.toLowerCase().includes(q) ||
        post.extracto.toLowerCase().includes(q) ||
        post.categoria.toLowerCase().includes(q);
      return coincideFiltro && coincideBusqueda;
    });
  }, [posts, query, filtro]);

  const pag = usePaginacion(visibles, {
    porPaginaInicial: 6,
    resetKey: `${query}|${filtro}`,
  });

  return (
    <>
      {/* CABECERA */}
      <PageHero
        title="Blog"
        titleClassName="leading-[0.9] tracking-[-0.035em] text-balance text-[clamp(2.8rem,8vw,6rem)] md:col-span-7"
        leadClassName="md:col-span-5 md:pb-3"
        lead={<>{t.lead}</>}
      >
        {/* BUSCADOR */}
        <div className="mt-14 max-w-2xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.buscar}
            aria-label={t.buscarAria}
            className="w-full border-b border-neutral-300 bg-transparent pb-4 text-2xl font-light tracking-tight text-foreground outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-500 md:text-3xl"
          />
        </div>

        {/* FILTROS */}
        <FilterChips
          className="mt-8 items-center gap-2"
          paddingClassName="px-4 py-2"
          inactiveClassName="border-neutral-300 text-muted-foreground"
          allLabel={t.todos}
          value={filtro}
          onChange={(id) => setFiltro(id === filtro ? null : (id as Categoria | null))}
          options={CATEGORIAS.map((c) => ({ id: c, label: c }))}
        />
      </PageHero>

      {/* GRID DE ARTÍCULOS */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-page px-6 py-16 md:py-20">
          {visibles.length === 0 ? (
            <p className="py-16 text-center text-neutral-500">{t.vacio}</p>
          ) : (
            <>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {pag.slice.map((post) => (
                <article key={post.slug} className="group flex flex-col">
                  <a href={`${base}/${post.slug}`} className="flex flex-col">
                    {/* Portada */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-200">
                      {post.portada ? (
                        <Image
                          src={post.portada}
                          alt={post.titulo}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : null}
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                        {post.categoria}
                      </span>
                    </div>

                    {/* Texto */}
                    <h2 className="mt-5 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary md:text-2xl">
                      {post.titulo}
                    </h2>
                    <p className="mt-3 text-body leading-relaxed text-neutral-600">
                      {post.extracto}
                    </p>
                    <p className="mt-4 text-sm text-neutral-600">
                      {post.fecha} · {post.lectura} {t.lectura}
                    </p>
                  </a>
                </article>
              ))}
            </div>
            <ControlPaginacion
              pagina={pag.pagina}
              totalPaginas={pag.totalPaginas}
              porPagina={pag.porPagina}
              setPagina={pag.setPagina}
              setPorPagina={pag.setPorPagina}
              opciones={[6, 9, 12]}
              desde={pag.desde}
              hasta={pag.hasta}
              total={pag.total}
              labels={dict.paginacion}
            />
            </>
          )}
        </div>
      </section>
    </>
  );
}
