import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { CasosListado } from "./_components/CasosListado";

type RouteParams = { params: Promise<{ lang: Locale }> };

const META = {
  es: {
    title: "Casos de estudio | [Concepto]",
    description:
      "Casos de estudio sobre [concepto]: del problema al resultado, con el proceso y las decisiones que lo explican.",
  },
  en: {
    title: "Case studies | [Concept]",
    description:
      "Case studies on [concept]: from problem to outcome, with the process and decisions that explain it.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/casos-de-estudio", { hasEn: hasEnPair("/casos-de-estudio"), lang }),
  };
}

export default async function CasosDeEstudioPage({ params }: RouteParams) {
  const { lang } = await params;
  return <CasosListado lang={lang} />;
}
