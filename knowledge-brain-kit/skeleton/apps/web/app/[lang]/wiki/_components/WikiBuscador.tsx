"use client";

import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/lib/i18n/config";

const PRIMARY = "var(--primary)";

// Plantilla por locale (Historia 7-3 / FR-43). Los términos no tienen par EN:
// cada entrada enlaza al detalle ES (URL canónica) también bajo /en/.
const T = {
  es: {
    buscarSr: "Buscar en la wiki",
    buscar: "Buscar un término…",
    dominio: "Dominio",
    todosDominios: "Todos",
    todasLetras: "Todas",
    vacio: "No hay términos para esta combinación. Prueba a quitar algún filtro.",
    resumen: (n: number, total: number) => `${n} de ${total} términos.`,
  },
  en: {
    buscarSr: "Search the wiki",
    buscar: "Search for a term…",
    dominio: "Domain",
    todosDominios: "All",
    todasLetras: "All",
    vacio: "No terms match this combination. Try removing a filter.",
    resumen: (n: number, total: number) => `${n} of ${total} terms.`,
  },
} as const;

export type TerminoLite = {
  nombre: string;
  slug: string;
  dominio: string;
  aliases?: string[];
};

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function inicial(nombre: string) {
  const c = nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

// Normaliza para búsqueda: minúsculas + sin diacríticos ("estrategico" casa "estratégico").
function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function WikiBuscador({ terminos, lang = "es" }: { terminos: TerminoLite[]; lang?: Locale }) {
  const t9n = T[lang];
  const base = lang === "en" ? "/en/wiki" : "/wiki";
  const [query, setQuery] = useState("");
  const [dominio, setDominio] = useState<string | null>(null);
  const [letra, setLetra] = useState<string | null>(null);

  // El breadcrumb de un término enlaza a /wiki?dominio=X. Se lee en cliente (no
  // en el server) para no de-optimizar el SSG estático de /wiki.
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("dominio");
    // Lectura de la URL SOLO tras montar (no en render): mantiene el SSG estático
    // de /wiki y evita desajuste de hidratación. useSearchParams() forzaría render
    // dinámico, así que el set-state-en-efecto es intencional aquí.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d) setDominio(d);
  }, []);

  const dominios = useMemo(
    () => [...new Set(terminos.map((t) => t.dominio))].sort((a, b) => a.localeCompare(b, "es")),
    [terminos],
  );

  const filtrados = useMemo(() => {
    const q = norm(query.trim());
    return terminos.filter((t) => {
      if (q && !norm(`${t.nombre} ${t.dominio} ${(t.aliases ?? []).join(" ")}`).includes(q)) return false;
      if (dominio && t.dominio !== dominio) return false;
      if (letra && inicial(t.nombre) !== letra) return false;
      return true;
    });
  }, [terminos, query, dominio, letra]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, TerminoLite[]>();
    for (const t of [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { numeric: true }))) {
      const k = inicial(t.nombre);
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k)!.push(t);
    }
    return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b, "es"));
  }, [filtrados]);

  const letrasActivas = useMemo(
    () => new Set(terminos.map((t) => inicial(t.nombre))),
    [terminos],
  );

  return (
    <>
      {/* BUSCADOR + FILTROS */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-12">
          <label htmlFor="wiki-buscador" className="sr-only">
            {t9n.buscarSr}
          </label>
          <input
            id="wiki-buscador"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t9n.buscar}
            className="w-full border-b border-neutral-300 bg-transparent pb-4 text-2xl font-medium text-foreground outline-none transition-colors placeholder:text-neutral-600 focus:border-primary md:text-3xl"
          />

          {/* Filtro por dominio */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="mr-1 text-sm text-neutral-600">{t9n.dominio}</span>
            <button
              type="button"
              onClick={() => setDominio(null)}
              aria-pressed={dominio === null}
              className="rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={
                dominio === null
                  ? { backgroundColor: PRIMARY, borderColor: PRIMARY, color: "var(--primary-foreground)" }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
              }
            >
              {t9n.todosDominios}
            </button>
            {dominios.map((d) => {
              const activo = dominio === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDominio(activo ? null : d)}
                  aria-pressed={activo}
                  className="rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={
                    activo
                      ? { backgroundColor: PRIMARY, borderColor: PRIMARY, color: "var(--primary-foreground)" }
                      : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                  }
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Índice A–Z */}
          <div className="mt-8 flex flex-wrap items-center gap-x-1 gap-y-2">
            <button
              type="button"
              onClick={() => setLetra(null)}
              aria-pressed={letra === null}
              className="px-2 py-1 text-sm font-medium tabular-nums transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={letra === null ? { color: PRIMARY } : { color: "var(--lk-neutral-500)" }}
            >
              {t9n.todasLetras}
            </button>
            {ALFABETO.map((l) => {
              const disponible = letrasActivas.has(l);
              const activa = letra === l;
              return (
                <button
                  key={l}
                  type="button"
                  disabled={!disponible}
                  onClick={() => setLetra(activa ? null : l)}
                  className="px-2 py-1 text-sm font-medium tabular-nums transition-opacity enabled:hover:opacity-60 disabled:cursor-default disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={activa ? { color: PRIMARY } : { color: "var(--lk-neutral-500)" }}
                  aria-pressed={activa}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LISTADO MULTI-COLUMNA */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16">
          {grupos.length === 0 ? (
            <p className="text-neutral-600">{t9n.vacio}</p>
          ) : (
            <div className="space-y-12">
              {grupos.map(([inicialLetra, items]) => (
                <div key={inicialLetra} id={`letra-${inicialLetra}`} className="scroll-mt-28">
                  <h2 className="mb-5 text-2xl font-bold tracking-tight" style={{ color: PRIMARY }}>
                    {inicialLetra}
                  </h2>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
                    {items.map((t) => (
                      <li key={t.slug}>
                        <a
                          href={`${base}/${t.slug}`}
                          className="group flex flex-col rounded-sm border-b border-neutral-200 pb-2 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          <span className="text-[15px] leading-snug transition-colors group-hover:text-primary">
                            {t.nombre}
                          </span>
                          <span className="text-xs text-neutral-600">{t.dominio}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <p className="mt-16 text-sm text-neutral-600" role="status" aria-live="polite">
            {t9n.resumen(filtrados.length, terminos.length)}
          </p>
        </div>
      </section>
    </>
  );
}
