import { createHash, randomInt } from "node:crypto";
import { headers } from "next/headers";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "knowledge_brain";

// Acceso por CÓDIGO de un solo uso (OTP), no por enlace: Resend envía un código
// de 6 dígitos y se pega en /login. Evita el enlace de tracking de Resend
// (que uBO bloquea) y el escáner de enlaces de Gmail (que pre-consume el token).
// En desarrollo el código se imprime además en la consola (`pnpm dev`) por si
// el email tarda o no llega.
const IS_DEV = process.env.NODE_ENV === "development";
const CODE_TTL_SECONDS = 10 * 60; // 10 min

function emailHtml(code: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:0 auto;padding:32px 0;color:#2b2b2b">
    <p style="font-size:14px;color:#737373;margin:0 0 8px">Área privada · tuconcepto.com</p>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 20px">Tu código de acceso</h1>
    <div style="font-size:34px;font-weight:700;letter-spacing:8px;background:#f4f4f4;color:#2b2b2b;padding:18px 0;text-align:center;border-radius:12px">${code}</div>
    <p style="font-size:13px;color:#737373;margin:20px 0 0">Caduca en 10 minutos. Si no lo pediste, ignora este correo.</p>
  </div>`;
}

// Alerta de seguridad: avisa por email la PRIMERA vez que se inicia sesión desde
// un dispositivo (identificado por email + user-agent). Los dispositivos vistos se
// guardan en `trusted_devices`, así solo llega una alerta por dispositivo nuevo.
// Best-effort: cualquier fallo aquí NUNCA debe bloquear el acceso (ya validado por OTP).
async function avisarSiDispositivoNuevo(email: string) {
  const h = await headers();
  const ua = h.get("user-agent") ?? "desconocido";
  const ip =
    (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "").split(",")[0].trim() || "desconocida";
  const fingerprint = createHash("sha256").update(`${email}|${ua}`).digest("hex").slice(0, 32);

  const client = await clientPromise;
  const col = client.db(DB_NAME).collection("trusted_devices");
  const conocido = await col.findOne({ email, fingerprint });
  if (conocido) return; // dispositivo de confianza ya registrado → sin alerta

  await col.insertOne({ email, fingerprint, userAgent: ua, ip, firstSeen: new Date() });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return; // sin Resend: se registra el dispositivo, no se envía
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: email,
      subject: "🔐 Nuevo inicio de sesión en tuconcepto.com",
      text: `Se ha iniciado sesión en tu área privada desde un dispositivo nuevo (no visto antes).\n\nDispositivo: ${ua}\nIP: ${ip}\nFecha: ${new Date().toISOString()}\n\nSi fuiste tú, ignora este correo. Si no reconoces este acceso, revisa la colección "admins" en tu base de datos.`,
    }),
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, { databaseName: DB_NAME }),
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
      maxAge: CODE_TTL_SECONDS,
      // El "token" que Auth.js guarda (hasheado) es este código de 6 dígitos.
      generateVerificationToken() {
        return String(randomInt(0, 1_000_000)).padStart(6, "0");
      },
      // Enviamos el CÓDIGO por email (no el enlace). `token` es el código crudo.
      async sendVerificationRequest({
        identifier,
        token,
      }: {
        identifier: string;
        token: string;
      }) {
        if (IS_DEV) {
          console.log(
            `\n\x1b[45m\x1b[97m CÓDIGO ${token} \x1b[0m \x1b[35m${identifier}\x1b[0m\n`,
          );
        }
        const apiKey = process.env.RESEND_API_KEY;
        const from = process.env.RESEND_FROM;
        if (!apiKey || !from) {
          if (IS_DEV) return; // sin Resend en dev: basta la consola
          throw new Error("Resend no configurado (RESEND_API_KEY / RESEND_FROM)");
        }
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: identifier,
            subject: `Tu código de acceso: ${token}`,
            text: `Tu código de acceso a tuconcepto.com es: ${token}\nCaduca en 10 minutos. Si no lo pediste, ignora este correo.`,
            html: emailHtml(token),
          }),
        });
        if (!res.ok) {
          throw new Error(`Resend error ${res.status}: ${await res.text()}`);
        }
      },
    }),
  ],
  callbacks: {
    // Gate single-admin: solo entran los emails presentes en la colección `admins`.
    async signIn({ user }) {
      if (!user?.email) return false;
      const client = await clientPromise;
      const admin = await client
        .db(DB_NAME)
        .collection("admins")
        .findOne({ email: user.email });
      if (!admin) return false; // sin doc → Auth.js redirige a /login?error=AccessDenied

      // Alerta de dispositivo nuevo (best-effort, nunca bloquea el acceso).
      await avisarSiDispositivoNuevo(user.email).catch(() => {});
      return true;
    },
  },
});
