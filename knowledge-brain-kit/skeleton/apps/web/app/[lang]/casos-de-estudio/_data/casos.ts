// Casos de estudio. Estructura fija-flexible (Contexto · Problema · Proceso ·
// Decisiones · Resultado · Aprendizajes). El render de [slug] busca aquí por
// slug y hace notFound() (HTTP 404) si no existe.
//
// PLANTILLA: hay un único caso de ejemplo ("plantilla-caso") que ejercita todas
// las piezas del tipo (párrafos, imágenes, tarjetas, métrica). Duplícalo y
// renómbralo por cada caso real de tu [concepto].

// Overlay EN (solo texto) — ver casoLocalizado() al final del archivo.
import casosEn from "./casos.en.json";

export interface ImagenCaso {
  /** ruta pública, p. ej. /casos/<slug>/pantalla.webp */
  src: string;
  alt: string;
  ancho: number;
  alto: number;
}

export interface Seccion {
  titulo: string;
  parrafos: string[];
  metrica?: { valor: string; label: string };
  /** galería opcional por sección (apoyo visual extendido) */
  imagenes?: ImagenCaso[];
  /** rejilla opcional de tarjetas (p. ej. narrativa por segmentos) */
  tarjetas?: { emoji: string; etiqueta: string; titulo: string; texto: string }[];
  /** tira de glosario opcional → enlaza a la Wiki */
  glosarioMarketing?: boolean;
}

export interface Caso {
  titulo: string;
  subtitulo: string;
  tags: string[];
  secciones: Seccion[];
  /** ruta pública opcional, p. ej. /casos/<slug>/portada.webp; sin ella → placeholder gris */
  portada?: string;
  /** id de vídeo de YouTube para una intro embebida en el hero (opcional) */
  video?: string;
  /**
   * Caso con acceso restringido: el detalle se bloquea tras una contraseña
   * (ver [slug]/_actions.ts) y se marca noindex.
   */
  protegido?: boolean;
}

export const CASOS: Record<string, Caso> = {
  "plantilla-caso": {
    titulo: "[Concepto]",
    subtitulo:
      "Descripción breve del caso de estudio en una o dos frases: qué problema resuelve [concepto], para quién, y cuál fue el resultado.",
    tags: ["[Etiqueta 1]", "[Etiqueta 2]", "[Etiqueta 3]"],
    secciones: [
      {
        titulo: "Contexto",
        parrafos: [
          "Describe el punto de partida: qué necesidad o situación da origen al caso y por qué merecía atención.",
          "Aporta el marco: quién participaba, cuál era el encargo y qué restricciones había desde el inicio.",
        ],
      },
      {
        titulo: "Problema",
        parrafos: [
          "Enuncia el problema central con precisión: qué había que resolver y qué lo hacía difícil.",
          "Añade la evidencia que lo respalda (investigación, datos, señales) para justificar el enfoque.",
        ],
      },
      {
        titulo: "Proceso",
        parrafos: [
          "Explica cómo abordaste el trabajo, paso a paso, y qué decisiones tomaste en el camino.",
          "Usa la galería para mostrar artefactos del proceso (bocetos, pantallas, diagramas).",
        ],
        imagenes: [
          {
            src: "/casos/plantilla-caso/imagen-1.webp",
            alt: "Descripción accesible de la primera imagen del proceso.",
            ancho: 1200,
            alto: 800,
          },
          {
            src: "/casos/plantilla-caso/imagen-2.webp",
            alt: "Descripción accesible de la segunda imagen del proceso.",
            ancho: 1200,
            alto: 800,
          },
        ],
      },
      {
        titulo: "Decisiones",
        parrafos: [
          "Resume las decisiones clave y el porqué de cada una: qué alternativa elegiste y qué descartaste.",
        ],
        tarjetas: [
          {
            emoji: "🔹",
            etiqueta: "Decisión",
            titulo: "[Título de la decisión]",
            texto: "Explicación breve de la decisión y su impacto.",
          },
          {
            emoji: "🔸",
            etiqueta: "Decisión",
            titulo: "[Otra decisión]",
            texto: "Explicación breve de la segunda decisión.",
          },
          {
            emoji: "🔺",
            etiqueta: "Decisión",
            titulo: "[Tercera decisión]",
            texto: "Explicación breve de la tercera decisión.",
          },
        ],
      },
      {
        titulo: "Resultado",
        parrafos: [
          "Describe el resultado final y su alcance: qué se entregó y qué cambió gracias a ello.",
        ],
        metrica: { valor: "100%", label: "Métrica destacable del resultado" },
      },
      {
        titulo: "Aprendizajes",
        parrafos: [
          "Cierra con lo aprendido: qué te llevas de este caso y qué harías igual o distinto la próxima vez.",
        ],
      },
    ],
  },
};


/** Devuelve el caso por slug, o `undefined` si no existe (el render hace notFound()). */
export function getCaso(slug: string): Caso | undefined {
  return CASOS[slug];
}

export const SLUGS_CASOS = Object.keys(CASOS);

// ── Overlay EN ────────────────────────────────────────────────────────────
// Solo texto: la estructura (imágenes src/tamaño, métrica.valor, emoji de
// tarjeta) es idioma-neutra y vive una sola vez en el ES. El overlay se aplica
// por índice de sección/array; si falta, cae al ES.
export type CasoLang = "es" | "en";

type SeccionEn = {
  titulo?: string;
  parrafos?: string[];
  metricaLabel?: string;
  tarjetas?: { etiqueta: string; titulo: string; texto: string }[];
  imagenesAlt?: string[];
};
type CasoEn = { titulo?: string; subtitulo?: string; tags?: string[]; secciones?: SeccionEn[] };
const CASOS_EN = casosEn as Record<string, CasoEn>;

function overlaySeccion(es: Seccion, en?: SeccionEn): Seccion {
  if (!en) return es;
  return {
    ...es,
    titulo: en.titulo ?? es.titulo,
    parrafos: en.parrafos ?? es.parrafos,
    metrica: es.metrica ? { ...es.metrica, label: en.metricaLabel ?? es.metrica.label } : es.metrica,
    tarjetas: es.tarjetas
      ? es.tarjetas.map((t, i) =>
          en.tarjetas?.[i] ? { ...t, etiqueta: en.tarjetas[i].etiqueta, titulo: en.tarjetas[i].titulo, texto: en.tarjetas[i].texto } : t,
        )
      : es.tarjetas,
    imagenes: es.imagenes
      ? es.imagenes.map((im, i) => (en.imagenesAlt?.[i] ? { ...im, alt: en.imagenesAlt[i] } : im))
      : es.imagenes,
  };
}

/** Caso por slug en el idioma pedido. EN aplica el overlay sobre el ES. */
export function casoLocalizado(slug: string, lang: CasoLang = "es"): Caso | undefined {
  const es = CASOS[slug];
  if (!es || lang === "es") return es;
  const en = CASOS_EN[slug];
  if (!en) return es;
  return {
    ...es,
    titulo: en.titulo ?? es.titulo,
    subtitulo: en.subtitulo ?? es.subtitulo,
    tags: en.tags ?? es.tags,
    secciones: es.secciones.map((s, i) => overlaySeccion(s, en.secciones?.[i])),
  };
}
