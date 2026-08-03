import { NextResponse, type NextRequest } from "next/server";

import { analyticsDb, SESSIONS, PAGE_VIEWS, VISITORS } from "@/lib/analytics/db";
import {
  dayKey,
  fingerprint,
  getClientIp,
  getGeo,
  isBot,
  looksAutomated,
  stableFingerprint,
} from "@/lib/analytics/fingerprint";
import { sectionForPath } from "@/lib/analytics/sections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_GAP_MS = 30 * 60 * 1000; // 30 min de inactividad → nueva sesión

/**
 * Registra una visita: upsert de sesión (ventana de 30 min) + una page_view.
 * Descarta bots y rutas privadas. Devuelve `pvId` para que el cliente cierre
 * la vista con el tiempo en página vía /api/analytics/leave (sendBeacon).
 */
export async function POST(req: NextRequest) {
  const h = req.headers;
  const ua = h.get("user-agent");
  if (isBot(ua) || looksAutomated(h)) return NextResponse.json({ ok: true, skipped: "bot" });

  let body: { path?: string; referrer?: string | null; locale?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = String(body.path ?? "/");
  if (path.startsWith("/admin") || path.startsWith("/login")) {
    return NextResponse.json({ ok: true, skipped: "private" });
  }

  const now = new Date();
  const ip = getClientIp(h);
  const fp = fingerprint(ip, ua ?? "", dayKey(now));
  const visitorKey = stableFingerprint(ip, ua ?? "");
  const geo = getGeo(h);
  const country = geo.country;
  const hasCoords = geo.lat != null && geo.lng != null;
  const section = sectionForPath(path);
  // Solo guardamos referrers externos reales (los internos y los previews de
  // Vercel son navegación propia, no una fuente de tráfico).
  const ref = body.referrer && !/localhost|tuconcepto\.com|vercel\.(app|com)/.test(body.referrer)
    ? body.referrer
    : null;

  try {
    const db = await analyticsDb();

    const recent = await db.collection(SESSIONS).findOne(
      { fp, lastActivityAt: { $gt: new Date(now.getTime() - SESSION_GAP_MS) } },
      { sort: { lastActivityAt: -1 } },
    );

    // Geo que solo se aplica cuando llega (nunca sobreescribe con null).
    const geoSet = {
      ...(country ? { country } : {}),
      ...(geo.city ? { city: geo.city } : {}),
      ...(hasCoords ? { lat: geo.lat, lng: geo.lng } : {}),
    };

    let sessionId;
    const isNewSession = !recent;
    if (recent) {
      sessionId = recent._id;
      await db.collection(SESSIONS).updateOne(
        { _id: sessionId },
        {
          $set: { lastActivityAt: now, ...geoSet },
          $inc: { views: 1 },
        },
      );
    } else {
      const res = await db.collection(SESSIONS).insertOne({
        fp,
        visitorKey,
        startedAt: now,
        lastActivityAt: now,
        country: country ?? null,
        city: geo.city ?? null,
        lat: geo.lat ?? null,
        lng: geo.lng ?? null,
        ua: ua ?? null,
        referrer: ref,
        locale: body.locale ?? null,
        entryPath: path,
        views: 1,
        label: null, // se rellena al atribuir un contacto
      });
      sessionId = res.insertedId;
    }

    const pv = await db.collection(PAGE_VIEWS).insertOne({
      fp,
      visitorKey,
      sessionId,
      path,
      section,
      locale: body.locale ?? null,
      referrer: ref,
      country: country ?? null,
      city: geo.city ?? null,
      lat: geo.lat ?? null,
      lng: geo.lng ?? null,
      at: now,
      timeOnPage: null,
    });

    // Visitante estable: reconoce recurrentes entre días y guarda su etiqueta.
    await db.collection(VISITORS).updateOne(
      { visitorKey },
      {
        $setOnInsert: { visitorKey, firstSeen: now, label: null },
        $set: { lastSeen: now, lastPath: path, ua: ua ?? null, ...geoSet },
        $inc: { pageViews: 1, ...(isNewSession ? { sessions: 1 } : {}) },
        ...(country ? { $addToSet: { countries: country } } : {}),
      },
      { upsert: true },
    );

    return NextResponse.json({
      ok: true,
      pvId: pv.insertedId.toString(),
      sessionId: sessionId.toString(),
    });
  } catch {
    // Sin BD (p. ej. build/CI): no rompemos la navegación del usuario.
    return NextResponse.json({ ok: false, skipped: "no-db" });
  }
}
