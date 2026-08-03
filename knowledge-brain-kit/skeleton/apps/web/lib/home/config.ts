import type { Db } from "mongodb";

import { SLUGS_CASOS } from "@/app/[lang]/casos-de-estudio/_data/casos";

/**
 * Configuración editable de la portada (home). Por ahora solo el orden y la
 * selección de casos de estudio que se apilan en la sección "Casos". Vive en la
 * misma BD "knowledge_brain" que auth/analítica. Import dinámico de
 * mongodb.ts (lanza si falta MONGODB_URI) para poder DEGRADAR en vez de romper
 * la home pública: sin conexión → fallback a todos los casos (patrón de
 * lib/analytics/db.ts).
 */
const COLECCION = "home_config";
const DOC_ID = "casos";

/** Máximo de casos que se muestran apilados en la home. */
export const CASOS_HOME_MAX = 4;

type HomeCasosDoc = { _id: string; slugs: string[] };

async function homeDb(): Promise<Db> {
  const { default: clientPromise } = await import("@/lib/mongodb");
  const client = await clientPromise;
  return client.db("knowledge_brain");
}

/** Solo slugs que existen de verdad, sin duplicar, preservando el orden dado. */
function normaliza(slugs: string[]): string[] {
  const validos = new Set(SLUGS_CASOS);
  const vistos = new Set<string>();
  return slugs.filter((s) => validos.has(s) && !vistos.has(s) && vistos.add(s) !== undefined);
}

/**
 * Orden guardado de los casos de la home (todos los seleccionados, sin recortar).
 * Fallback a todos los `SLUGS_CASOS` si no hay doc o Mongo no responde: la home
 * nunca queda vacía por un fallo de configuración.
 */
export async function getHomeCasosSlugs(): Promise<string[]> {
  try {
    const db = await homeDb();
    const doc = await db.collection<HomeCasosDoc>(COLECCION).findOne({ _id: DOC_ID });
    if (!doc?.slugs?.length) return [...SLUGS_CASOS];
    const orden = normaliza(doc.slugs);
    return orden.length ? orden : [...SLUGS_CASOS];
  } catch {
    return [...SLUGS_CASOS];
  }
}

/** Persiste el orden/selección de casos de la home (upsert). Ignora slugs inexistentes. */
export async function setHomeCasosSlugs(slugs: string[]): Promise<void> {
  const db = await homeDb();
  await db
    .collection<HomeCasosDoc>(COLECCION)
    .updateOne({ _id: DOC_ID }, { $set: { slugs: normaliza(slugs) } }, { upsert: true });
}

// ─── Blog en la home (mismo doc `home_config`, otro _id) ──────────

const DOC_BLOG = "blog";

/** Máximo de artículos del blog que se muestran en la home. */
export const BLOG_HOME_MAX = 6;

type HomeIdsDoc = { _id: string; ids: string[] };

/** Sin duplicados, preservando el orden; si se pasa `validos`, descarta lo que no exista. */
function dedupe(ids: string[], validos?: Set<string>): string[] {
  const vistos = new Set<string>();
  return ids.filter(
    (s) => (!validos || validos.has(s)) && !vistos.has(s) && vistos.add(s) !== undefined,
  );
}

/**
 * Orden/selección de artículos del blog en la home. Los slugs válidos son
 * dinámicos (archivos de contenido) → aquí solo se deduplica; la galería
 * reconcilia contra los posts reales y descarta los que ya no existan. Vacío =
 * sin config → la galería usa el orden por defecto (reciente→antiguo).
 */
export async function getHomeBlogSlugs(): Promise<string[]> {
  try {
    const db = await homeDb();
    const doc = await db.collection<HomeIdsDoc>(COLECCION).findOne({ _id: DOC_BLOG });
    return doc?.ids?.length ? dedupe(doc.ids) : [];
  } catch {
    return [];
  }
}

export async function setHomeBlogSlugs(slugs: string[]): Promise<void> {
  const db = await homeDb();
  await db
    .collection<HomeIdsDoc>(COLECCION)
    .updateOne({ _id: DOC_BLOG }, { $set: { ids: dedupe(slugs) } }, { upsert: true });
}
