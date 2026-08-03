import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getReview, getReviewSlugs, imagenDe, categoriaLabel, type ReviewLang } from "../_data/reviews";
import { LOCALES } from "@/lib/i18n/config";
import { Estrellas } from "@brain/design-system-web/primitives/estrellas";
import { IconoReview } from "../_components/IconoReview";
import { JsonLd, reviewLd, breadcrumbLd } from "@/lib/seo/jsonld";

const PRIMARY = "var(--primary)";

type RouteParams = { params: Promise<{ lang: ReviewLang; slug: string }> };

// Textos del chrome del detalle por locale (el contenido llega ya traducido).
const T = {
  es: {
    noEncontrada: "Review no encontrada | [Concepto]",
    volver: "← Todas las reviews",
    inicio: "Inicio",
    reviews: "Reviews",
    pros: "PROS",
    contras: "CONTRAS",
    ctaTituloAf: "¿Te ha convencido?",
    ctaTituloNo: "¿Quieres saber más?",
    ctaTextoAf: "Si lo consigues a través de este enlace, apoyas el contenido sin pagar de más.",
    ctaTextoNo: "Échale un vistazo y saca tus propias conclusiones.",
    disclosure: "Como afiliado, puedo recibir una comisión por las compras que cumplan los requisitos, sin coste adicional para ti.",
  },
  en: {
    noEncontrada: "Review not found | [Concept]",
    volver: "← All reviews",
    inicio: "Home",
    reviews: "Reviews",
    pros: "PROS",
    contras: "CONS",
    ctaTituloAf: "Convinced?",
    ctaTituloNo: "Want to know more?",
    ctaTextoAf: "If you get it through this link, you support the content at no extra cost.",
    ctaTextoNo: "Take a look and draw your own conclusions.",
    disclosure: "As an affiliate, I may earn a commission on qualifying purchases, at no extra cost to you.",
  },
} as const;

const reviewsBase = (lang: ReviewLang) => (lang === "en" ? "/en/reviews" : "/reviews");
const homeUrl = (lang: ReviewLang) => (lang === "en" ? "/en" : "/");

// SSG completo: toda review tiene página; un slug inexistente = 404 real (no
// streaming, para que el status 404 se preserve con loading.tsx).
export const dynamicParams = false;

// Bottom-up con lang explícito. ES y EN comparten slug (par publicado 7-5).
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => getReviewSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang, slug } = await params;
  const review = getReview(slug, lang);
  if (!review) return { title: T[lang].noEncontrada };
  const img = review.categoria === "metodología" ? undefined : imagenDe(slug, review.imagen);
  const esUrl = `/reviews/${slug}`;
  const enUrl = `/en/reviews/${slug}`;
  return {
    title: `${review.titulo} — Review | ${lang === "en" ? "[Concept]" : "[Concepto]"}`,
    description: review.resumen,
    alternates: {
      canonical: lang === "en" ? enUrl : esUrl,
      languages: { es: esUrl, en: enUrl, "x-default": esUrl },
    },
    openGraph: {
      title: `${review.titulo} — Review`,
      description: review.resumen,
      type: "article",
      images: img ? [img] : undefined,
    },
    twitter: {
      card: "summary",
      images: img ? [img] : undefined,
    },
  };
}

export default async function ReviewDetallePage({ params }: RouteParams) {
  const { lang, slug } = await params;
  const review = getReview(slug, lang);
  if (!review) notFound();

  const tr = T[lang];
  const base = reviewsBase(lang);

  return (
    <>
      <JsonLd
        data={[
          reviewLd({
            name: review.titulo,
            description: review.descripcion,
            url: `/reviews/${slug}`,
            rating: review.rating,
            image: imagenDe(review.slug, review.logo),
            pros: review.pros,
            cons: review.contras,
          }),
          breadcrumbLd([
            { name: tr.inicio, url: homeUrl(lang) },
            { name: tr.reviews, url: base },
            { name: review.titulo, url: `${base}/${slug}` },
          ]),
        ]}
      />

      {/* CABECERA */}
      <section className="mx-auto max-w-[1500px] px-6 pb-12 pt-32 md:pt-44">
        <Link
          href={base}
          className="inline-block text-sm text-neutral-500 transition-opacity hover:opacity-60"
        >
          {tr.volver}
        </Link>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-9">
            {/* Píldora de categoría */}
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-medium capitalize text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              {categoriaLabel(review.categoria, lang)}
            </span>
            <h1 className="mt-5 font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2.6rem,8vw,6rem)]">
              {review.titulo}
            </h1>
            <div className="mt-6">
              <Estrellas rating={review.rating} size="md" />
            </div>
          </div>

          {/* Logo / imagen */}
          <div className="md:col-span-3 md:justify-self-end">
            <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
              {review.categoria === "metodología" ? (
                <IconoReview nombre={review.icono ?? "layers"} className="h-12 w-12 text-neutral-700" />
              ) : (
                <Image
                  src={imagenDe(slug, review.imagen)}
                  alt={review.titulo}
                  fill
                  sizes="112px"
                  className="object-contain p-3"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CUERPO */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:py-24">
          <div className="grid gap-14 md:grid-cols-12">
            {/* Texto */}
            <div className="md:col-span-7">
              <p className="text-xl leading-relaxed text-neutral-700">
                {review.resumen}
              </p>
              <div className="mt-8 space-y-6 text-[17px] leading-relaxed text-neutral-600">
                {review.cuerpo.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </div>

            {/* Pros y contras */}
            <div className="md:col-span-5">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-sm font-semibold tracking-wide text-neutral-600">
                    {tr.pros}
                  </h2>
                  <ul className="space-y-3">
                    {review.pros.map((p, i) => (
                      <li key={i} className="flex gap-2.5 text-[15px] leading-snug text-neutral-700">
                        <span style={{ color: PRIMARY }} aria-hidden="true">
                          ✓
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="mb-4 text-sm font-semibold tracking-wide text-neutral-600">
                    {tr.contras}
                  </h2>
                  <ul className="space-y-3">
                    {review.contras.map((c, i) => (
                      <li key={i} className="flex gap-2.5 text-[15px] leading-snug text-neutral-700">
                        <span className="text-neutral-400" aria-hidden="true">
                          ✗
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA DE CIERRE (afiliado o enlace normal según la review) */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {review.afiliado ? tr.ctaTituloAf : tr.ctaTituloNo}
            </h2>
            <p className="mt-3 text-neutral-600">
              {review.afiliado ? tr.ctaTextoAf : tr.ctaTextoNo}
            </p>

            <a
              href={review.enlace ?? "https://example.com/"}
              target="_blank"
              rel={review.afiliado ? "sponsored nofollow noopener" : "noopener noreferrer"}
              className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: PRIMARY }}
            >
              {review.cta} →
            </a>

            {review.afiliado ? (
              <p className="mt-5 text-xs leading-relaxed text-neutral-600">
                <code className="text-neutral-500">rel=&quot;sponsored nofollow&quot;</code>. {tr.disclosure}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
