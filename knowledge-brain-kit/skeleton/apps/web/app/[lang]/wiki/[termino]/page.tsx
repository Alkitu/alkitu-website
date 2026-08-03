import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import {
  TERMINOS,
  POR_SLUG,
  linkifyToReact,
  tituloDe,
  definicionDe,
  dominioLabel,
  type Lang,
  type Relacion,
  type Termino,
} from "@/lib/glosario";
import { LOCALES } from "@/lib/i18n/config";
import { INTERACTIVE } from "../_components/interactive/registry";
import { JsonLd, definedTermLd, breadcrumbLd } from "@/lib/seo/jsonld";

const PRIMARY = "var(--primary)";

type Cercano = Relacion & { motivo: string };
type RouteParams = { params: Promise<{ lang: Lang; termino: string }> };

// Textos del chrome del detalle por locale (los datos del término salen del glosario).
const T = {
  es: {
    noEncontrado: "Término no encontrado · Wiki",
    inicio: "Inicio",
    wiki: "Wiki",
    migas: "Migas de pan",
    definicion: "Definición",
    exploralo: "Explóralo",
    relaciones: "Relaciones",
    cercanos: "Términos cercanos",
    cercanosIntro: "Conceptos vinculados a este por una relación real del glosario.",
    pasaCursor: "Pasa el cursor",
    paraVer: " sobre cada uno para ver por qué es cercano.",
    ejes: {
      hiper: { etiqueta: "Hiperónimos", ayuda: "es-un / más general" },
      hipo: { etiqueta: "Hipónimos", ayuda: "tipos-de / más específico" },
      rel: { etiqueta: "Relacionados", ayuda: "mismo campo semántico" },
    },
    hermano: (x: string) => `Hermano · ambos son tipos de «${x}»`,
    campo: (x: string) => `Mismo campo semántico: ${x}`,
    pilar: (x: string) => `Mismo pilar del glosario: ${x}`,
  },
  en: {
    noEncontrado: "Term not found · Wiki",
    inicio: "Home",
    wiki: "Wiki",
    migas: "Breadcrumb",
    definicion: "Definition",
    exploralo: "Explore it",
    relaciones: "Relationships",
    cercanos: "Related terms",
    cercanosIntro: "Concepts linked to this one by a real relationship in the glossary.",
    pasaCursor: "Hover",
    paraVer: " over each one to see why it's related.",
    ejes: {
      hiper: { etiqueta: "Hypernyms", ayuda: "is-a / broader" },
      hipo: { etiqueta: "Hyponyms", ayuda: "types-of / more specific" },
      rel: { etiqueta: "Related", ayuda: "same semantic field" },
    },
    hermano: (x: string) => `Sibling · both are types of “${x}”`,
    campo: (x: string) => `Same semantic field: ${x}`,
    pilar: (x: string) => `Same glossary pillar: ${x}`,
  },
} as const;

const wikiBase = (lang: Lang) => (lang === "en" ? "/en/wiki" : "/wiki");
const homeUrl = (lang: Lang) => (lang === "en" ? "/en" : "/");

// Nombre de una relación resuelto al idioma (usa el título EN del término destino).
function relLabel(r: Relacion, lang: Lang): string {
  const t = POR_SLUG.get(r.slug);
  return t ? tituloDe(t, lang) : r.nombre;
}
function relLang(items: Relacion[], lang: Lang): Relacion[] {
  return items.map((r) => ({ slug: r.slug, nombre: relLabel(r, lang) }));
}

// SSG completo: todo término tiene página; un slug inexistente = 404 real (no
// streaming, para que el status 404 se preserve con loading.tsx).
export const dynamicParams = false;

// Bottom-up con lang explícito (el encadenado top-down de params no genera
// rutas en Next 16/Turbopack). ES y EN comparten slug (par publicado 7-5).
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => TERMINOS.map((t) => ({ lang, termino: t.slug })));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang, termino } = await params;
  const t = POR_SLUG.get(termino);
  if (!t) return { title: T[lang].noEncontrado };
  const titulo = tituloDe(t, lang);
  const esUrl = `/wiki/${t.slug}`;
  const enUrl = `/en/wiki/${t.slug}`;
  return {
    title: `${titulo} · Wiki — ${lang === "en" ? "[Concept]" : "[Concepto]"}`,
    description: definicionDe(t, lang).slice(0, 155),
    alternates: {
      canonical: lang === "en" ? enUrl : esUrl,
      languages: { es: esUrl, en: enUrl, "x-default": esUrl },
    },
  };
}

// Términos cercanos para seguir navegando, CADA UNO con el motivo explícito de
// por qué es cercano. Solo vínculos reales (se descarta el relleno "mismo dominio",
// que juntaba conceptos sin relación). Prioridad: hermano > campo semántico > pilar.
function cercanos(t: Termino, lang: Lang): Cercano[] {
  const tr = T[lang];
  const yaListados = new Set([
    t.slug,
    ...t.hiperonimos.map((r) => r.slug),
    ...t.hiponimos.map((r) => r.slug),
    ...t.relacionados.map((r) => r.slug),
  ]);
  const padres = new Map(t.hiperonimos.map((r) => [r.slug, r.nombre]));
  const campoT = new Set(t.campoSemantico);

  const candidatos: (Cercano & { peso: number })[] = [];
  for (const o of TERMINOS) {
    if (yaListados.has(o.slug)) continue;
    const base = { nombre: tituloDe(o, lang), slug: o.slug };

    const padreComun = o.hiperonimos.find((h) => padres.has(h.slug));
    if (padreComun) {
      const padre = POR_SLUG.get(padreComun.slug);
      const nombrePadre = padre ? tituloDe(padre, lang) : padres.get(padreComun.slug)!;
      candidatos.push({ ...base, peso: 0, motivo: tr.hermano(nombrePadre) });
      continue;
    }
    const comunes = o.campoSemantico.filter((c) => campoT.has(c));
    if (comunes.length) {
      candidatos.push({ ...base, peso: 1, motivo: tr.campo(comunes.join(", ")) });
      continue;
    }
    if (t.pilar && o.pilar === t.pilar) {
      candidatos.push({ ...base, peso: 2, motivo: tr.pilar(t.pilar) });
      continue;
    }
    // sin vínculo real → NO es cercano
  }

  candidatos.sort((a, b) => a.peso - b.peso || a.nombre.localeCompare(b.nombre, "es", { numeric: true }));
  return candidatos.slice(0, 15).map(({ peso: _peso, ...c }) => c);
}

export default async function TerminoPage({ params }: RouteParams) {
  const { lang, termino } = await params;
  const entrada = POR_SLUG.get(termino);
  if (!entrada) notFound();

  const tr = T[lang];
  const base = wikiBase(lang);
  const titulo = tituloDe(entrada, lang);
  const definicion = definicionDe(entrada, lang);
  const dominio = dominioLabel(entrada.dominio, lang);
  const cerca = cercanos(entrada, lang);
  // Los widgets interactivos siguen en ES (React hardcodeado) hasta traducirlos.
  const Interactive = INTERACTIVE[entrada.slug];

  return (
    <>
      <JsonLd
        data={[
          definedTermLd({
            term: titulo,
            definition: definicion,
            url: `${base}/${entrada.slug}`,
            aliases: entrada.aliases,
          }),
          breadcrumbLd([
            { name: tr.inicio, url: homeUrl(lang) },
            { name: tr.wiki, url: base },
            { name: titulo, url: `${base}/${entrada.slug}` },
          ]),
        ]}
      />

      {/* BREADCRUMB + CABECERA */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-32 md:pt-44">
        <nav aria-label={tr.migas} className="mb-10 text-sm text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={base} className="transition-colors hover:text-primary">
                {tr.wiki}
              </Link>
            </li>
            <li aria-hidden className="text-neutral-300">/</li>
            <li>
              <a
                href={`${base}?dominio=${encodeURIComponent(dominio)}`}
                className="transition-colors hover:text-primary"
              >
                {dominio}
              </a>
            </li>
            <li aria-hidden className="text-neutral-300">/</li>
            <li className="text-neutral-700">{titulo}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
            style={{ backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)", color: PRIMARY }}
          >
            {dominio}
          </span>
          {entrada.pilar ? (
            <span className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
              {entrada.pilar}
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 max-w-4xl font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2.6rem,7vw,5.5rem)]">
          {titulo}
          <span style={{ color: PRIMARY }}>.</span>
        </h1>
      </section>

      {/* DEFINICIÓN (callout) */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16">
          <div className="max-w-4xl border-l-2 pl-6 md:pl-8" style={{ borderColor: PRIMARY }}>
            <p className="mb-3 text-sm tracking-wide text-neutral-600">{tr.definicion}</p>
            <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-[2rem]">
              {linkifyToReact(definicion, entrada.slug, lang)}
            </p>
          </div>
        </div>
      </section>

      {/* WIDGET INTERACTIVO (si el término tiene uno) */}
      {Interactive ? (
        <section className="border-t border-neutral-300/70">
          <div className="mx-auto max-w-[1500px] px-6 py-16">
            <p className="mb-10 text-sm tracking-wide text-neutral-600">{tr.exploralo}</p>
            <Interactive />
          </div>
        </section>
      ) : null}

      {/* RELACIONES (ejes) */}
      {entrada.hiperonimos.length + entrada.hiponimos.length + entrada.relacionados.length > 0 ? (
        <section className="border-t border-neutral-300/70">
          <div className="mx-auto max-w-[1500px] px-6 py-16">
            <p className="mb-10 text-sm tracking-wide text-neutral-600">{tr.relaciones}</p>
            <div className="grid gap-10 md:grid-cols-3">
              <EjeRelacion etiqueta={tr.ejes.hiper.etiqueta} flecha="↑" ayuda={tr.ejes.hiper.ayuda} items={relLang(entrada.hiperonimos, lang)} base={base} />
              <EjeRelacion etiqueta={tr.ejes.hipo.etiqueta} flecha="↓" ayuda={tr.ejes.hipo.ayuda} items={relLang(entrada.hiponimos, lang)} base={base} />
              <EjeRelacion etiqueta={tr.ejes.rel.etiqueta} flecha="↔" ayuda={tr.ejes.rel.ayuda} items={relLang(entrada.relacionados, lang)} base={base} />
            </div>
          </div>
        </section>
      ) : null}

      {/* TÉRMINOS CERCANOS (antes del footer) */}
      {cerca.length > 0 ? (
        <section className="border-t border-neutral-300/70">
          <div className="mx-auto max-w-[1500px] px-6 py-20">
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              {tr.cercanos}
            </h2>
            <p className="mb-12 max-w-2xl text-neutral-500">
              {tr.cercanosIntro}{" "}
              <span className="text-neutral-700">{tr.pasaCursor}</span>{tr.paraVer}
            </p>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {cerca.map((t) => (
                <li key={t.slug} className="group/term relative">
                  <a
                    href={`${base}/${t.slug}`}
                    className="flex items-baseline justify-between border-b border-neutral-200 pb-2 transition-colors hover:border-primary focus:outline-none focus-visible:border-primary"
                  >
                    <span className="text-[15px] leading-snug transition-colors group-hover/term:text-primary">
                      {t.nombre}
                    </span>
                    <span
                      className="text-sm opacity-0 transition-opacity group-hover/term:opacity-100"
                      style={{ color: PRIMARY }}
                    >
                      →
                    </span>
                  </a>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-[16rem] rounded-md px-3 py-1.5 text-xs leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/term:opacity-100 group-focus-within/term:opacity-100"
                    style={{ backgroundColor: "var(--foreground)" }}
                  >
                    {t.motivo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}

function EjeRelacion({
  etiqueta,
  flecha,
  ayuda,
  items,
  base,
}: {
  etiqueta: string;
  flecha: string;
  ayuda: string;
  items: Relacion[];
  base: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-lg font-semibold" style={{ color: PRIMARY }}>{flecha}</span>
        <h3 className="text-lg font-semibold tracking-tight">{etiqueta}</h3>
      </div>
      <p className="mb-5 text-sm text-neutral-600">{ayuda}</p>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">—</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <a
              key={t.slug}
              href={`${base}/${t.slug}`}
              className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]"
              style={{ borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)", color: PRIMARY }}
            >
              {t.nombre}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
