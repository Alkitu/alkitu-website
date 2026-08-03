import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { analyticsDb, VISITORS } from "@/lib/analytics/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Renombra (o limpia) la etiqueta de un visitante estable. Solo admin: el mismo
 * gate que /admin (sesión NextAuth con email en la colección `admins`).
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { visitorKey?: unknown; label?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorKey = String(body.visitorKey ?? "");
  if (!/^[a-f0-9]{32}$/.test(visitorKey)) {
    return NextResponse.json({ ok: false, error: "bad-key" }, { status: 400 });
  }

  // label vacío/espacios → null (borra el nombre). Máx. 80 caracteres.
  const raw = typeof body.label === "string" ? body.label.trim().slice(0, 80) : "";
  const label = raw.length > 0 ? raw : null;

  try {
    const db = await analyticsDb();
    const res = await db
      .collection(VISITORS)
      .updateOne({ visitorKey }, { $set: { label } });
    if (res.matchedCount === 0) {
      return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, label });
  } catch {
    return NextResponse.json({ ok: false, error: "no-db" }, { status: 500 });
  }
}
