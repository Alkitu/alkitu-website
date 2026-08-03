// Fuente única de datos de Reviews (recomendaciones). La consumen tanto el grid
// (`reviews/page.tsx`) como el detalle (`reviews/[slug]/page.tsx`), para que no
// haya dos copias que puedan divergir.
//
// Modelo: catálogo tipo tienda. La tarjeta NO muestra precio; el enlace vive
// DENTRO de la review. Para reseñas de afiliación, `afiliado: true` añade el
// disclosure de comisión y `rel="sponsored"` al CTA.
//
// PLANTILLA: hay una única review de ejemplo ("plantilla-review") que ejercita
// el tipo. Duplícala por cada reseña real de tu [concepto].

import reviewsEn from "./reviews.en.json";

export type Categoria = "hardware" | "software" | "stack" | "metodología";
export type ReviewLang = "es" | "en";

export type Review = {
  slug: string;
  titulo: string;
  categoria: Categoria;
  rating: number; // 0–5
  /** Línea(s) de la tarjeta del grid. */
  descripcion: string;
  /** Logo/thumbnail en la tarjeta. Sin él → placeholder gris. `/reviews/<slug>/logo.webp` */
  logo?: string;
  /** Imagen de cabecera del detalle. Sin ella → placeholder gris. */
  imagen?: string;
  /** Entradilla del detalle. */
  resumen: string;
  /** Cuerpo del detalle, un string por párrafo. */
  cuerpo: string[];
  pros: string[];
  contras: string[];
  /** Texto del botón de cierre. */
  cta: string;
  /** Destino del CTA. Si se omite y es afiliado, cae al enlace por defecto del detalle. */
  enlace?: string;
  /** true = enlace de afiliación (rel sponsored + disclosure de comisión). false = enlace normal. */
  afiliado: boolean;
  /** Icono de lucide (clave de IconoReview) para reviews sin logo, p. ej. metodologías. */
  icono?: string;
};

export const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: "hardware", label: "Hardware" },
  { id: "software", label: "Software" },
  { id: "stack", label: "Stack" },
  { id: "metodología", label: "Metodología" },
];

export const REVIEWS: Review[] = [
  {
    slug: "plantilla-review",
    titulo: "[Concepto]",
    categoria: "software",
    rating: 4,
    descripcion:
      "Línea de la tarjeta del grid: qué es [concepto] y por qué lo recomiendas en una frase.",
    resumen:
      "Entradilla del detalle: presenta [concepto] y para quién resulta útil.",
    cuerpo: [
      "Primer párrafo del cuerpo: qué problema resuelve [concepto] y en qué contexto lo usas.",
      "Segundo párrafo: qué lo hace bueno y cómo se compara con las alternativas.",
      "Tercer párrafo: matices, límites y para quién lo recomendarías o no.",
    ],
    pros: [
      "Primer punto a favor",
      "Segundo punto a favor",
      "Tercer punto a favor",
    ],
    contras: [
      "Primer punto en contra",
      "Segundo punto en contra",
    ],
    cta: "Ver [concepto]",
    enlace: "https://example.com/",
    afiliado: false,
  },
];

// Overlay EN por slug (solo texto; rating/logo/enlace/afiliado vienen del ES).
type ReviewEn = Partial<Pick<Review, "titulo" | "descripcion" | "resumen" | "cuerpo" | "pros" | "contras" | "cta">>;
const REVIEWS_EN = reviewsEn as Record<string, ReviewEn>;

// Etiquetas de categoría por locale.
const CATEGORIA_EN: Record<Categoria, string> = {
  hardware: "Hardware",
  software: "Software",
  stack: "Stack",
  "metodología": "Methodology",
};
export function categoriaLabel(cat: Categoria, lang: ReviewLang): string {
  if (lang === "en") return CATEGORIA_EN[cat];
  return CATEGORIAS.find((c) => c.id === cat)?.label ?? cat;
}

// Aplica el overlay EN sobre una review (fallback a ES si falta traducción).
function localizar(r: Review, lang: ReviewLang): Review {
  if (lang === "es") return r;
  const en = REVIEWS_EN[r.slug];
  return en ? { ...r, ...en } : r;
}

export function getReviewSlugs(): string[] {
  return REVIEWS.map((r) => r.slug);
}

export function getReview(slug: string, lang: ReviewLang = "es"): Review | undefined {
  const r = REVIEWS.find((r) => r.slug === slug);
  return r ? localizar(r, lang) : undefined;
}

/** Todas las reviews en el idioma pedido (para el listado). */
export function reviewsLocalizados(lang: ReviewLang = "es"): Review[] {
  return REVIEWS.map((r) => localizar(r, lang));
}

/**
 * Imagen (logo) de una review: la trae de la carpeta local
 * `public/reviews/<slug>/logo.png`, salvo override explícito en `logo`/`imagen`.
 * Las metodologías no tienen logo (usan `icono` de lucide); para ellas, los componentes
 * NO llaman a esta función (deciden por `categoria === "metodología"`).
 */
export function imagenDe(slug: string, override?: string): string {
  return override ?? `/reviews/${slug}/logo.png`;
}
