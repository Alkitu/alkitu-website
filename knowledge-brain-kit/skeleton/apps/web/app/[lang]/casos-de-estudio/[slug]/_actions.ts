"use server";

import { cookies } from "next/headers";

import { COOKIE_ACCESO_CASOS } from "../_data/acceso";

export type EstadoAcceso = { ok: boolean; error?: string };

// Contraseña de cortesía para casos con acceso restringido. No es seguridad
// dura: es una puerta editorial — quien quiera ver el trabajo pide acceso por
// /contacto y se le da la clave. Configúrala con la variable CASOS_PASSWORD.
const CASOS_PASSWORD = process.env.CASOS_PASSWORD ?? "acceso";

/**
 * Desbloquea los casos protegidos: si la contraseña es correcta pone una cookie
 * httpOnly (30 días) y la página, al re-renderizar, ya sirve el contenido.
 */
export async function desbloquearCasos(
  _prev: EstadoAcceso,
  formData: FormData,
): Promise<EstadoAcceso> {
  const clave = String(formData.get("clave") ?? "").trim().toLowerCase();
  if (clave !== CASOS_PASSWORD) {
    return { ok: false, error: "Contraseña incorrecta. Si no la tienes, escríbenos por contacto." };
  }
  const jar = await cookies();
  jar.set(COOKIE_ACCESO_CASOS, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return { ok: true };
}
