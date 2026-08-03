import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { ReviewsListado } from "./_components/ReviewsListado";

type RouteParams = { params: Promise<{ lang: Locale }> };

const META = {
  es: {
    title: "Reviews | [Concepto]",
    description:
      "Reseñas honestas de herramientas y recursos relacionados con [concepto], con divulgación de afiliación cuando la hay.",
  },
  en: {
    title: "Reviews | [Concept]",
    description:
      "Honest reviews of tools and resources related to [concept], with affiliate disclosure where applicable.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/reviews", { hasEn: hasEnPair("/reviews"), lang }),
  };
}

export default async function ReviewsPage({ params }: RouteParams) {
  const { lang } = await params;
  return <ReviewsListado lang={lang} />;
}
