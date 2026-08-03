import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { ContactoForm } from "./_components/ContactoForm";

type RouteParams = { params: Promise<{ lang: Locale }> };

const META = {
  es: {
    title: "Contacto | [Concepto]",
    description:
      "¿Tienes un proyecto relacionado con [concepto]? Hablemos.",
  },
  en: {
    title: "Contact | [Concept]",
    description:
      "Got a project related to [concept]? Let's talk.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/contacto", { hasEn: hasEnPair("/contacto"), lang }),
  };
}

export default async function ContactoPage({ params }: RouteParams) {
  const { lang } = await params;
  return <ContactoForm lang={lang} />;
}
