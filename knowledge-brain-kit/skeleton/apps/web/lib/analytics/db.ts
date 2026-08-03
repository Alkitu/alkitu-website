import type { Db } from "mongodb";

/**
 * Acceso a las colecciones de analítica propia (misma BD que auth). Import
 * dinámico de mongodb.ts: lanza al importar si falta MONGODB_URI, así los
 * consumidores pueden degradar a "sin datos" en vez de romper (p. ej. CI).
 */
export const SESSIONS = "analytics_sessions";
export const PAGE_VIEWS = "analytics_page_views";
export const CONTACT_EVENTS = "analytics_contact_events";
/** Visitantes estables (clave persistente IP+UA) con etiqueta editable por el admin. */
export const VISITORS = "analytics_visitors";

export async function analyticsDb(): Promise<Db> {
  const { default: clientPromise } = await import("@/lib/mongodb");
  const client = await clientPromise;
  return client.db("knowledge_brain");
}
