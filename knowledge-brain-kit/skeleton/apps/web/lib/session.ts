/**
 * Identidad anónima del visitante. Una cookie `httpOnly` **firmada por el
 * servidor** (HMAC), no falsificable por el cliente: útil como clave de sesión
 * anónima (p. ej. "1 acción por sesión"). Edge-safe (Web Crypto, sin `Buffer`).
 */
export const SESSION_COOKIE = "kb_sid";
const MAX_AGE = 60 * 60 * 8; // 8 h

function secret(): string {
  return process.env.SESSION_SECRET ?? process.env.AUTH_SECRET ?? "session-dev-secret";
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(new Uint8Array(sig));
}

/** Acuña el valor de la cookie: `<sid>.<hmac(sid)>`. */
export async function mintSessionValue(): Promise<string> {
  const sid = b64url(crypto.getRandomValues(new Uint8Array(16)));
  return `${sid}.${await hmac(sid)}`;
}

/** Verifica la firma y devuelve el `sid`, o null si es inválida/ausente. */
export async function verifySession(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const sid = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmac(sid);
  // comparación de longitud constante-ish
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? sid : null;
}

/** Opciones de la cookie de sesión del visitante. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  };
}
