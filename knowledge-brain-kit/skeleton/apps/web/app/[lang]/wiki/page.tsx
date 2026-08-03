import type { Metadata } from "next";

import { TERMINOS, tituloDe, dominioLabel } from "@/lib/glosario";
import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { WikiBuscador, type TerminoLite } from "./_components/WikiBuscador";

type RouteParams = { params: Promise<{ lang: Locale }> };

const PRIMARY = "var(--primary)";

// Plantilla por locale (Historia 7-3 / FR-43). Los términos aún no tienen par
// EN: el buscador enlaza al detalle ES (URL canónica) también bajo /en/.
const T = {
  es: {
    metadata: {
      title: "Wiki · Glosario de [Concepto] — [Concepto]",
      description:
        "Glosario abierto de [concepto]: términos definidos y conectados entre sí.",
    },
    kicker: "Wiki",
    leadBefore: "Un glosario abierto de [concepto]. ",
    leadStrong: (n: number) => `${n} términos`,
    leadAfter:
      " definidos y conectados entre sí: navega por el índice alfabético, filtra por dominio o busca lo que necesites.",
  },
  en: {
    metadata: {
      title: "Wiki · [Concept] glossary — [Concept]",
      description:
        "An open glossary of [concept]: terms defined and connected to each other.",
    },
    kicker: "Wiki",
    leadBefore: "An open glossary of [concept]. ",
    leadStrong: (n: number) => `${n} terms`,
    leadAfter:
      " defined and connected to each other: browse the alphabetical index, filter by domain or search for what you need.",
  },
} as const;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = T[lang].metadata;
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/wiki", { hasEn: hasEnPair("/wiki"), lang }),
  };
}

// Lista ligera para el cliente (sin definiciones ni relaciones), en el idioma
// del locale: nombre y dominio traducidos si el término tiene par EN.
function listaLite(lang: Locale): TerminoLite[] {
  return TERMINOS.map((t) => ({
    nombre: tituloDe(t, lang),
    slug: t.slug,
    dominio: dominioLabel(t.dominio, lang),
    aliases: t.aliases,
  }));
}

export default async function WikiPage({ params }: RouteParams) {
  const { lang } = await params;
  const t = T[lang];
  const terminos = listaLite(lang);

  return (
    <>
      {/* CABECERA */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-32 md:pt-44">
        <p className="mb-6 text-sm tracking-wide text-neutral-600">{t.kicker}</p>
        <h1 className="max-w-4xl font-bold leading-[0.95] tracking-[-0.03em] text-[clamp(2.8rem,8vw,6.5rem)]">
          Wiki<span style={{ color: PRIMARY }}>.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
          {t.leadBefore}
          <strong className="font-medium text-foreground">{t.leadStrong(terminos.length)}</strong>
          {t.leadAfter}
        </p>
      </section>

      <WikiBuscador terminos={terminos} lang={lang} />
    </>
  );
}
