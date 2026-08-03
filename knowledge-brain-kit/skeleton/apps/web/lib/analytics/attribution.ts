import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { analyticsDb, SESSIONS, PAGE_VIEWS, CONTACT_EVENTS } from "./db";
import { dayKey, fingerprint, getClientIp, getCountry } from "./fingerprint";

/**
 * Atribución de contacto: reconstruye el recorrido (journey) de la sesión que
 * envió el formulario, para saber DESDE QUÉ PÁGINA y por dónde pasó antes.
 * Todo best-effort: si falla, el contacto se envía igual (no bloquea).
 */
export type Journey = {
  fromPath: string | null;
  country: string | null;
  sessionId: ObjectId | null;
  pages: { path: string; timeOnPage: number | null }[];
  totalSeconds: number;
};

/**
 * @param sid sessionId exacto que el cliente adjunta al form (vía sessionStorage
 *   'lk-sid' que escribe el VisitTracker). Es el camino fiable. Si no llega, cae
 *   al fingerprint por IP+UA (funciona en prod/Vercel; menos fiable en local).
 */
export async function resolveJourney(sid?: string | null): Promise<Journey | null> {
  try {
    const h = await headers();
    const country = getCountry(h);
    const db = await analyticsDb();

    let session =
      sid && ObjectId.isValid(sid)
        ? await db.collection(SESSIONS).findOne({ _id: new ObjectId(sid) })
        : null;

    if (!session) {
      const fp = fingerprint(getClientIp(h), h.get("user-agent") ?? "", dayKey());
      session = await db
        .collection(SESSIONS)
        .findOne({ fp }, { sort: { lastActivityAt: -1 } });
    }

    if (!session) {
      return { fromPath: null, country, sessionId: null, pages: [], totalSeconds: 0 };
    }

    const pv = await db
      .collection(PAGE_VIEWS)
      .find({ sessionId: session._id }, { sort: { at: 1 } })
      .toArray();

    const nonContact = pv.filter((p) => p.section !== "contacto");
    const fromPath =
      nonContact[nonContact.length - 1]?.path ?? session.entryPath ?? null;
    const totalSeconds = pv.reduce((sum, p) => sum + (p.timeOnPage ?? 0), 0);

    return {
      fromPath,
      country: country ?? session.country ?? null,
      sessionId: session._id,
      pages: pv.map((p) => ({ path: p.path, timeOnPage: p.timeOnPage ?? null })),
      totalSeconds,
    };
  } catch {
    return null;
  }
}

export async function persistContactEvent(
  journey: Journey,
  nombre: string,
  email: string,
): Promise<void> {
  try {
    const db = await analyticsDb();
    await db.collection(CONTACT_EVENTS).insertOne({
      at: new Date(),
      name: nombre,
      email,
      fromPath: journey.fromPath,
      country: journey.country,
      sessionId: journey.sessionId,
      pageCount: journey.pages.length,
    });
    // Etiqueta la sesión anónima con el nombre del lead (aparece en la tabla).
    if (journey.sessionId) {
      await db
        .collection(SESSIONS)
        .updateOne({ _id: journey.sessionId }, { $set: { label: nombre } });
    }
  } catch {
    // best-effort
  }
}

/** Bloque de texto para incrustar el recorrido en el email de notificación. */
export function journeyText(journey: Journey | null): string {
  if (!journey || journey.pages.length === 0) return "";
  const pages = journey.pages.map((p) => `  · ${p.path}`).join("\n");
  const desde = journey.fromPath ? `\nDesde: ${journey.fromPath}` : "";
  const pais = journey.country ? `\nPaís: ${journey.country}` : "";
  return `\n\n— Recorrido antes de contactar (${journey.pages.length} páginas):${desde}${pais}\n${pages}`;
}
