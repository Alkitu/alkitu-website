import { NextResponse, type NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { analyticsDb, PAGE_VIEWS } from "@/lib/analytics/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cierra una page_view con el tiempo en página (segundos). Se invoca vía
 * navigator.sendBeacon al ocultar/abandonar la pestaña, así que la respuesta
 * es best-effort. Capa el valor a 1h para descartar pestañas olvidadas.
 */
export async function POST(req: NextRequest) {
  let body: { pvId?: string; timeOnPage?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.pvId || !ObjectId.isValid(body.pvId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const seconds = Math.min(Math.max(Number(body.timeOnPage) || 0, 0), 3600);

  try {
    const db = await analyticsDb();
    await db
      .collection(PAGE_VIEWS)
      .updateOne(
        { _id: new ObjectId(body.pvId), timeOnPage: null },
        { $set: { timeOnPage: seconds } },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, skipped: "no-db" });
  }
}
