import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealHero } from "@brain/design-system-web/compositions/reveal-hero";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { CASOS } from "@/app/[lang]/casos-de-estudio/_data/casos";
import { CASOS_HOME_MAX, getHomeCasosSlugs } from "@/lib/home/config";

import { CasosStack, type CasoStackItem } from "./_components/CasosStack";
import { BlogGaleria } from "./_components/BlogGaleria";

// PLACEHOLDER (knowledge-brain-kit). Home en blanco, agnóstica al concepto.
// Conserva el patrón motor: hero + servicios + secciones que leen datos del
// concepto (casos, blog). Reemplaza COPY y las secciones por las del concepto.

type RouteParams = { params: Promise<{ lang: Locale }> };

// Los casos apilados se leen de Mongo (orden editable en /admin/inicio) → dinámico.
export const dynamic = "force-dynamic";

type Bloque = { titulo: string; descripcion: string; sub: string[] };

const COPY = {
  es: {
    metadata: {
      title: "[Concepto] · Cerebro de conocimiento",
      description:
        "Base de conocimiento sobre [concepto], organizada como sistema: términos, artículos y casos citables por buscadores y modelos de IA. Reemplaza este texto.",
    },
    heroTitleA: "Todo sobre",
    heroTitleB: "[el concepto]",
    heroScroll: "Desliza",
    bloquesEyebrow: "Qué encontrarás",
    bloquesTitulo: "Secciones",
    bloquesLead: "Cada pieza de conocimiento vive como un nodo interconectado y citable.",
    bloquesCta: "Explora el glosario",
    bloquesHref: "/wiki",
    bloques: [
      {
        titulo: "Glosario",
        descripcion: "Los términos del concepto, cada uno con una definición extraíble por IA.",
        sub: ["Definiciones", "Entidades", "Interlinking"],
      },
      {
        titulo: "Artículos",
        descripcion: "Notas y ensayos que desarrollan los temas en profundidad.",
        sub: ["Blog", "SEO long-tail", "GEO"],
      },
      {
        titulo: "Casos",
        descripcion: "Ejemplos y aplicaciones del concepto explicados de principio a fin.",
        sub: ["Casos de estudio", "Evidencia", "Referencias"],
      },
    ] as Bloque[],
  },
  en: {
    metadata: {
      title: "[Concept] · Knowledge brain",
      description:
        "Knowledge base about [concept], organized as a system: terms, articles and cases citable by search engines and AI models. Replace this text.",
    },
    heroTitleA: "Everything about",
    heroTitleB: "[the concept]",
    heroScroll: "Scroll",
    bloquesEyebrow: "What you'll find",
    bloquesTitulo: "Sections",
    bloquesLead: "Each piece of knowledge lives as an interconnected, citable node.",
    bloquesCta: "Explore the glossary",
    bloquesHref: "/en/wiki",
    bloques: [
      {
        titulo: "Glossary",
        descripcion: "The concept's terms, each with an AI-extractable definition.",
        sub: ["Definitions", "Entities", "Interlinking"],
      },
      {
        titulo: "Articles",
        descripcion: "Notes and essays that develop the topics in depth.",
        sub: ["Blog", "SEO long-tail", "GEO"],
      },
      {
        titulo: "Cases",
        descripcion: "Examples and applications of the concept explained end to end.",
        sub: ["Case studies", "Evidence", "References"],
      },
    ] as Bloque[],
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = COPY[lang].metadata;
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/", { hasEn: hasEnPair("/"), lang }),
  };
}

export default async function HomePage({ params }: RouteParams) {
  const { lang } = await params;
  const t = COPY[lang];

  // Casos apilados: orden/selección editable en /admin/inicio (Mongo), recortado
  // a los primeros CASOS_HOME_MAX. Fallback a todos los casos si no hay config.
  const slugs = (await getHomeCasosSlugs()).slice(0, CASOS_HOME_MAX);
  const casosHome: CasoStackItem[] = slugs.map((slug) => {
    const c = CASOS[slug];
    return { slug, titulo: c.titulo, subtitulo: c.subtitulo, tags: c.tags, portada: c.portada };
  });

  return (
    <>
      {/* HERO — apertura que revela la imagen al hacer scroll. Pon /hero/portada.jpg del concepto. */}
      <RevealHero
        titleTop={t.heroTitleA}
        titleBottom={t.heroTitleB}
        imageSrc="/hero/portada.jpg"
        imageAlt="[Concepto]"
        scrollLabel={t.heroScroll}
      />

      {/* SECCIONES — bloques genéricos del cerebro */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-page px-6 py-24 md:py-32">
          <div className="mb-14 max-w-2xl md:mb-20">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-neutral-500">
              {t.bloquesEyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-[3.4rem]">
              {t.bloquesTitulo}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">{t.bloquesLead}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.bloques.map((s) => (
              <Link
                key={s.titulo}
                href={t.bloquesHref}
                className="group relative flex flex-col rounded-2xl border border-neutral-300/70 p-8 transition-colors hover:border-primary/40 md:p-9"
              >
                <ArrowUpRight
                  className="absolute right-7 top-7 h-6 w-6 text-neutral-300 transition-colors group-hover:text-primary"
                  strokeWidth={1.75}
                />
                <h3 className="max-w-[10ch] text-2xl font-bold uppercase leading-[1.05] tracking-tight md:text-[1.75rem]">
                  {s.titulo}
                </h3>
                <p className="mt-4 text-body leading-relaxed text-neutral-600">{s.descripcion}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.sub.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-primary/[0.07] px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <Link
              href={t.bloquesHref}
              className="inline-flex items-center gap-2 rounded-sm bg-foreground px-6 py-3.5 text-body font-medium text-background transition-opacity hover:opacity-85"
            >
              {t.bloquesCta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CASOS — apilados al hacer scroll (leen datos del concepto) */}
      <CasosStack casos={casosHome} lang={lang} />

      {/* BLOG — galería horizontal de artículos */}
      <BlogGaleria lang={lang} />
    </>
  );
}
