/**
 * Helper compartido de JSON-LD (Historia 4-3 / FR-20). Cada plantilla emite los
 * datos estructurados schema.org que le corresponden según su `schema-tipo`.
 * El componente <JsonLd> serializa el objeto en un <script type=application/ld+json>.
 */
const BASE = "https://tuconcepto.com";

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const PERSON = {
  "@type": "Person",
  name: "[Concepto]",
  url: BASE,
  jobTitle: "[Rol]",
  sameAs: [] as string[],
};

/** Person (schema.org) para /sobre-mi y como autor de artículos. */
export function personLd() {
  return { "@context": "https://schema.org", ...PERSON };
}

export function articleLd(a: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: `${BASE}${a.url}`,
    image: a.image ? `${BASE}${a.image}` : undefined,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: PERSON,
    publisher: PERSON,
  };
}

export function definedTermLd(t: { term: string; definition?: string; url: string; aliases?: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `${BASE}${t.url}`,
    alternateName: t.aliases?.length ? t.aliases : undefined,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Wiki de [Concepto] — [Concepto]",
      url: `${BASE}/wiki`,
    },
  };
}

export function reviewLd(r: {
  name: string;
  description?: string;
  url: string;
  rating: number;
  image?: string;
  pros?: string[];
  cons?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: r.name, image: r.image ? `${BASE}${r.image}` : undefined },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 0,
    },
    name: r.name,
    reviewBody: r.description,
    url: `${BASE}${r.url}`,
    author: PERSON,
    positiveNotes: r.pros?.length
      ? { "@type": "ItemList", itemListElement: r.pros.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p })) }
      : undefined,
    negativeNotes: r.cons?.length
      ? { "@type": "ItemList", itemListElement: r.cons.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c })) }
      : undefined,
  };
}

/** BreadcrumbList a partir de una ruta de migas {name, url}. */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE}${it.url}`,
    })),
  };
}

/** FAQPage (Historia 4-6) a partir de pares pregunta/respuesta. */
export function faqLd(qas: { pregunta: string; respuesta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.pregunta,
      acceptedAnswer: { "@type": "Answer", text: qa.respuesta },
    })),
  };
}
