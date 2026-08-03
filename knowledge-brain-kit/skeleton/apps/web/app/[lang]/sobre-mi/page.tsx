import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";

// PLACEHOLDER (knowledge-brain-kit). Página About en blanco: conserva el patrón
// motor (metadata + hreflang) y deja el contenido para instanciar por concepto.
// El contenido original (acoplado a datos personales) se retiró del skeleton.
// Reemplaza este copy por el About del concepto.

type RouteParams = { params: Promise<{ lang: Locale }> };

const COPY = {
  es: {
    title: "Sobre este proyecto · [Concepto]",
    description:
      "Quién está detrás y por qué existe este cerebro de conocimiento. Reemplaza este texto por el About del concepto.",
    heading: "Sobre este proyecto",
    body: "Placeholder del knowledge-brain-kit. Describe aquí el concepto, la autoridad detrás del contenido y el propósito del sitio.",
  },
  en: {
    title: "About this project · [Concept]",
    description:
      "Who is behind this knowledge brain and why it exists. Replace this text with the concept's About.",
    heading: "About this project",
    body: "knowledge-brain-kit placeholder. Describe the concept, the authority behind the content, and the site's purpose here.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = COPY[lang];
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/sobre-mi", { hasEn: hasEnPair("/sobre-mi"), lang }),
  };
}

export default async function AboutPage({ params }: RouteParams) {
  const { lang } = await params;
  const t = COPY[lang];

  return (
    <section className="mx-auto max-w-page px-6 py-24 md:py-32">
      <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">{t.heading}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{t.body}</p>
    </section>
  );
}
