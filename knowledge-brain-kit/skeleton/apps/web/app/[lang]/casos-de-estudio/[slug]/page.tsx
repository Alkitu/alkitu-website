import { Fragment } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCaso, casoLocalizado, SLUGS_CASOS, type CasoLang } from "../_data/casos";
import { LOCALES } from "@/lib/i18n/config";
import { enPathFor } from "@/lib/i18n/routes";
import { COOKIE_ACCESO_CASOS } from "../_data/acceso";
import { CasoProtegido } from "./_components/CasoProtegido";
import { CasoGaleria } from "./_components/CasoGaleria";
import { CarruselFila } from "./_components/CarruselFila";
import { GlosarioMarketing } from "./_components/GlosarioMarketing";

// Solo los slugs reales existen; un slug inventado devuelve 404 real (no placeholder).
export const dynamicParams = false;

const PRIMARY = "var(--primary)";

type RouteParams = { params: Promise<{ lang: CasoLang; slug: string }> };

// Textos del chrome del detalle por locale (el contenido llega ya traducido).
const T = {
  es: {
    noEncontrado: "Caso no encontrado | [Concepto]",
    sufijo: "— Caso de estudio",
    video: "Vídeo",
    cta: "Hablemos de tu proyecto",
    finalA: "¿Tienes un proyecto",
    finalB: "parecido",
    finalNota: "Cuéntanos tu caso: descríbelo y veamos cómo abordarlo.",
    contacto: "/contacto",
    // CTA opcional al final del caso: enlaza a un recurso interactivo (si aplica).
    jugarKicker: "Recurso",
    jugarTitulo: "Pruébalo aquí",
    jugarNota: "Un recurso interactivo enlazado a este caso, funcionando en esta misma web.",
    jugar: "Abrir recurso",
    // Títulos de sección (ES) que disparan lógica: vídeo tras «Web».
  },
  en: {
    noEncontrado: "Case study not found | [Concept]",
    sufijo: "— Case study",
    video: "Video",
    cta: "Let's talk about your project",
    finalA: "Have a similar",
    finalB: "project",
    finalNota: "Tell us about your case: describe it and let's figure out how to tackle it.",
    contacto: "/en/contact",
    jugarKicker: "Resource",
    jugarTitulo: "Try it here",
    jugarNota: "An interactive resource linked to this case, running on this very site.",
    jugar: "Open resource",
  },
} as const;

// Casos que enlazan a un recurso interactivo: al final del caso invitan a abrirlo.
// abrirla. Mapea aquí <slug del caso> → <ruta interna ES> (la EN se deriva con
// enPathFor). Déjalo vacío si tu [concepto] no tiene demos interactivas.
const JUEGOS_LAB: Record<string, string> = {};

const casosBase = (lang: CasoLang) => (lang === "en" ? "/en/case-studies" : "/casos-de-estudio");
const homeUrl = (lang: CasoLang) => (lang === "en" ? "/en" : "/");

// Palos y rangos para presentar una sección de tarjetas como una baraja de póker.
const PALOS = [
  { s: "♠", red: false },
  { s: "♥", red: true },
  { s: "♦", red: true },
  { s: "♣", red: false },
] as const;
const RANGOS = ["A", "K", "Q", "J", "10", "9", "8"] as const;

// Bottom-up con lang explícito. ES y EN comparten slug (par publicado 7-5).
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SLUGS_CASOS.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang, slug } = await params;
  const caso = casoLocalizado(slug, lang);
  if (!caso) return { title: T[lang].noEncontrado };
  const esUrl = `/casos-de-estudio/${slug}`;
  const enUrl = `/en/case-studies/${slug}`;
  return {
    // Los casos bajo propiedad intelectual no se indexan (su contenido va tras contraseña).
    robots: caso.protegido ? { index: false, follow: false } : undefined,
    title: `${caso.titulo} ${T[lang].sufijo} | ${lang === "en" ? "[Concept]" : "[Concepto]"}`,
    description: caso.subtitulo,
    alternates: {
      canonical: lang === "en" ? enUrl : esUrl,
      languages: { es: esUrl, en: enUrl, "x-default": esUrl },
    },
    openGraph: {
      title: `${caso.titulo} ${T[lang].sufijo}`,
      description: caso.subtitulo,
      type: "article",
      images: caso.portada ? [caso.portada] : undefined,
    },
    twitter: {
      card: caso.portada ? "summary_large_image" : "summary",
      images: caso.portada ? [caso.portada] : undefined,
    },
  };
}

function CtaOscuro({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}

function CtaPrimary({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-sm px-7 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85"
      style={{ backgroundColor: PRIMARY }}
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}

export default async function CasoPage({ params }: RouteParams) {
  const { lang, slug } = await params;
  // ES para la estructura y los disparadores por título (Problema/Web); overlay
  // localizado para el texto visible. Ambos comparten índice de sección.
  const casoEs = getCaso(slug);
  const caso = casoLocalizado(slug, lang);
  if (!caso || !casoEs) notFound();

  const tr = T[lang];
  const base = casosBase(lang);
  const ctaHref = tr.contacto;
  // Si el caso enlaza a un recurso interactivo (ES interno; EN vía enPathFor).
  const juegoEs = JUEGOS_LAB[slug];
  const playHref = juegoEs ? (lang === "en" ? enPathFor(juegoEs) : juegoEs) : null;

  // Casos bajo acuerdos de propiedad intelectual: sin la cookie de acceso, el
  // contenido no se renderiza (ni viaja en el HTML) — solo la puerta.
  if (caso.protegido) {
    const jar = await cookies();
    if (jar.get(COOKIE_ACCESO_CASOS)?.value !== "ok") {
      return <CasoProtegido titulo={caso.titulo} tags={caso.tags} />;
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="flex flex-wrap gap-2">
          {caso.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-8 max-w-5xl font-bold leading-[0.95] tracking-[-0.035em] text-[clamp(2.6rem,8vw,7rem)]">
          {caso.titulo}
          <span style={{ color: PRIMARY }}>.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">
          {caso.subtitulo}
        </p>

        {/* Imagen grande (portada) */}
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-200 md:mt-16">
          {caso.portada ? (
            <Image
              src={caso.portada}
              alt={caso.titulo}
              fill
              sizes="(min-width: 1500px) 1500px, 100vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>
      </section>

      {/* SECCIONES */}
      {caso.secciones.map((seccion, i) => (
        <Fragment key={seccion.titulo}>
        <section className="border-t border-neutral-300/70">
          <div className="mx-auto max-w-[1500px] px-6 py-20 md:py-28">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-3">
                <p
                  className="mb-3 text-sm font-medium tabular-nums"
                  style={{ color: PRIMARY }}
                >
                  0{i + 1}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-[2rem]">
                  {seccion.titulo}
                </h2>
              </div>

              <div className="max-w-3xl md:col-span-9">
                <div className="space-y-6 text-lg leading-relaxed text-neutral-700">
                  {seccion.parrafos.map((parrafo, j) => (
                    <p key={j}>{parrafo}</p>
                  ))}
                </div>

                {seccion.tarjetas && (
                  <div className="mt-10">
                    <CarruselFila className="gap-5">
                    {seccion.tarjetas.map((t, i) => {
                      const palo = PALOS[i % PALOS.length];
                      const rango = RANGOS[i % RANGOS.length];
                      const paloClass = palo.red ? "text-primary" : "text-foreground";
                      return (
                        <div
                          key={t.titulo}
                          className="relative flex aspect-[5/7] w-60 shrink-0 snap-center flex-col rounded-2xl border border-neutral-900/10 bg-white p-5 shadow-lg ring-1 ring-black/[0.03]"
                        >
                          {/* esquina superior izquierda */}
                          <div className={`flex w-fit flex-col items-center leading-none ${paloClass}`}>
                            <span className="text-sm font-semibold">{rango}</span>
                            <span className="text-base">{palo.s}</span>
                          </div>

                          {/* centro */}
                          <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <span className="text-4xl" aria-hidden>
                              {t.emoji}
                            </span>
                            <p
                              className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${paloClass}`}
                            >
                              {t.etiqueta}
                            </p>
                            <h3 className="mt-1 text-lg font-bold tracking-tight text-foreground">
                              {t.titulo}
                            </h3>
                            <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                              {t.texto}
                            </p>
                          </div>

                          {/* esquina inferior derecha (rotada) */}
                          <div
                            className={`flex w-fit rotate-180 flex-col items-center self-end leading-none ${paloClass}`}
                          >
                            <span className="text-sm font-semibold">{rango}</span>
                            <span className="text-base">{palo.s}</span>
                          </div>
                        </div>
                      );
                    })}
                    </CarruselFila>
                  </div>
                )}

                {seccion.imagenes && <CasoGaleria imagenes={seccion.imagenes} />}

                {seccion.glosarioMarketing && <GlosarioMarketing />}

                {seccion.metrica && (
                  <div className="mt-12">
                    <p
                      className="font-bold leading-none tracking-[-0.04em] text-[clamp(3.5rem,9vw,7rem)]"
                      style={{ color: PRIMARY }}
                    >
                      {seccion.metrica.valor}
                    </p>
                    <p className="mt-4 text-sm text-neutral-500">
                      {seccion.metrica.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* VÍDEO (intro de marca) — tras la sección Web, antes de Aprendizajes */}
        {caso.video && casoEs.secciones[i]?.titulo === "Web" && (
          <section className="border-t border-neutral-300/70">
            <div className="mx-auto max-w-[1500px] px-6 py-20 md:py-28">
              <div className="mx-auto max-w-3xl">
                <p className="mb-6 text-sm tracking-wide text-neutral-600">{tr.video}</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${caso.video}`}
                    title={`${caso.titulo} — vídeo`}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </section>
        )}
        </Fragment>
      ))}

      {/* CTA opcional: casos que enlazan a un recurso interactivo (ver JUEGOS_LAB) */}
      {playHref && (
        <section className="border-t border-neutral-300/70">
          <div className="mx-auto max-w-[1500px] px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-9">
                <p className="text-sm uppercase tracking-widest text-neutral-500">{tr.jugarKicker}</p>
                <h2 className="mt-3 font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2rem,5vw,4rem)]">
                  {tr.jugarTitulo}
                  <span style={{ color: PRIMARY }}>.</span>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
                  {tr.jugarNota}
                </p>
              </div>
              <div className="md:col-span-3 md:pb-2">
                <CtaPrimary href={playHref} label={tr.jugar} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-28 md:py-40">
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <h2 className="font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2.2rem,6vw,5rem)] md:col-span-9">
              {tr.finalA}
              <br />
              {tr.finalB}<span style={{ color: PRIMARY }}>?</span>
            </h2>
            <div className="md:col-span-3 md:pb-4">
              <p className="mb-7 text-lg leading-relaxed text-neutral-600">
                {tr.finalNota}
              </p>
              <CtaOscuro href={ctaHref} label={tr.cta} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
