"use server";

import { Resend } from "resend";

import {
  journeyText,
  persistContactEvent,
  resolveJourney,
} from "@/lib/analytics/attribution";

export type EstadoContacto = { ok: boolean; error?: string; enviado?: boolean };

// Rate-limit best-effort en memoria (por instancia): máx 3 envíos / 10 min por email.
const RL_MAX = 3;
const RL_VENTANA = 10 * 60 * 1000;
const hits = new Map<string, { count: number; ts: number }>();

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Mensajes al usuario por idioma (el email interno al titular se queda en ES).
const MSG = {
  es: {
    faltan: "Completa nombre, email y mensaje.",
    emailInvalido: "Ese email no parece válido.",
    rate: "Demasiados envíos seguidos. Prueba de nuevo en unos minutos.",
    noConfig: "El envío aún no está configurado. Escríbenos a [email de contacto] mientras tanto.",
    fallo: "No se pudo enviar. Inténtalo de nuevo o escríbenos por email.",
    autoSubject: "Hemos recibido tu mensaje · [Concepto]",
    autoBody: (n: string) =>
      `Hola ${n},\n\nHemos recibido tu mensaje y te responderemos en menos de 48 horas.\n\nGracias por escribir,\n[Concepto]`,
  },
  en: {
    faltan: "Please fill in your name, email and message.",
    emailInvalido: "That email doesn't look valid.",
    rate: "Too many submissions in a row. Try again in a few minutes.",
    noConfig: "Sending isn't set up yet. Write to [email de contacto] in the meantime.",
    fallo: "Couldn't send it. Try again or reach us by email.",
    autoSubject: "We've received your message · [Concept]",
    autoBody: (n: string) =>
      `Hi ${n},\n\nWe've received your message and we'll get back to you within 48 hours.\n\nThanks for writing,\n[Concept]`,
  },
} as const;

/**
 * Server action del formulario de contacto (Historia 5-1 / FR-27). Valida,
 * filtra bots (honeypot + rate-limit) y entrega el mensaje vía Resend.
 * Sin RESEND_API_KEY el envío degrada a un error accionable (no rompe).
 */
export async function enviarContacto(
  _prev: EstadoContacto,
  formData: FormData,
): Promise<EstadoContacto> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();
  const honeypot = String(formData.get("empresa") ?? "").trim();
  const t = MSG[String(formData.get("lang") ?? "es") === "en" ? "en" : "es"];

  // Honeypot: un bot rellena el campo oculto → se rechaza en silencio (aparenta éxito).
  if (honeypot) return { ok: true, enviado: false };

  if (!nombre || !email || !mensaje) {
    return { ok: false, error: t.faltan };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: t.emailInvalido };
  }

  // Rate-limit (429 conceptual): demasiados envíos desde el mismo email.
  const now = Date.now();
  const key = email.toLowerCase();
  const rec = hits.get(key);
  const vigente = rec && now - rec.ts < RL_VENTANA;
  if (vigente && rec!.count >= RL_MAX) {
    return { ok: false, error: t.rate };
  }
  hits.set(key, { count: vigente ? rec!.count + 1 : 1, ts: vigente ? rec!.ts : now });

  // Brief del proyecto (wizard multi-paso): todos opcionales, se anexan al correo.
  const tipo = String(formData.get("tipo") ?? "").trim();
  const tamano = String(formData.get("tamano") ?? "").trim();
  const presupuesto = String(formData.get("presupuesto") ?? "").trim();
  const categorias = formData.getAll("categorias").map(String).filter(Boolean);
  const funcionalidades = formData.getAll("funcionalidades").map(String).filter(Boolean);
  // Rama de contratación/empleo: campos alternativos al brief de proyecto.
  const jornada = String(formData.get("jornada") ?? "").trim();
  const ubicacion = String(formData.get("ubicacion") ?? "").trim();
  const modalidad = String(formData.get("modalidad") ?? "").trim();
  const pago = String(formData.get("pago") ?? "").trim();
  const beneficios = String(formData.get("beneficios") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim();
  const cargo = String(formData.get("cargo") ?? "").trim();
  const brief = [
    tipo && `Tipo / razón: ${tipo}`,
    tamano && `Tamaño de empresa: ${tamano}`,
    presupuesto && `Presupuesto: ${presupuesto}`,
    jornada && `Jornada: ${jornada}`,
    ubicacion && `Ubicación: ${ubicacion}`,
    modalidad && `Modalidad: ${modalidad}`,
    pago && `Tipo de pago: ${pago}`,
    beneficios && `Beneficios: ${beneficios}`,
    sector && `Sector: ${sector}`,
    cargo && `Cargo: ${cargo}`,
    categorias.length ? `Categorías: ${categorias.join(", ")}` : "",
    funcionalidades.length ? `Funcionalidades: ${funcionalidades.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Adjuntos (referencias): best-effort, máx 5 archivos y 20 MB en total.
  const files = formData
    .getAll("archivos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, 5);
  const attachments: { filename: string; content: Buffer }[] = [];
  let totalBytes = 0;
  for (const f of files) {
    totalBytes += f.size;
    if (totalBytes > 20 * 1024 * 1024) break;
    attachments.push({ filename: f.name || "adjunto", content: Buffer.from(await f.arrayBuffer()) });
  }

  const apiKey = process.env.RESEND_API_KEY;
  // RESEND_TO admite varios destinatarios separados por coma.
  const to = (process.env.RESEND_TO ?? "hello@tuconcepto.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.RESEND_FROM ?? "Contacto web <onboarding@resend.dev>";
  if (!apiKey) {
    return { ok: false, error: t.noConfig };
  }

  // Atribución: recorrido de la sesión que envía (desde qué página, journey).
  // `sid` lo adjunta el cliente desde sessionStorage (VisitTracker). Best-effort.
  const sid = String(formData.get("sid") ?? "").trim() || null;
  const journey = await resolveJourney(sid);

  try {
    const resend = new Resend(apiKey);
    const cuerpo = `Nombre: ${nombre}\nEmail: ${email}${brief ? `\n\n${brief}` : ""}\n\nMensaje:\n${mensaje}${journeyText(journey)}`;
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Contacto web · ${nombre}${tipo ? ` · ${tipo}` : ""}`,
      text: cuerpo,
      attachments: attachments.length ? attachments : undefined,
    });
    if (error) {
      return { ok: false, error: t.fallo };
    }
    // Auto-respuesta al remitente (best-effort; no rompe el envío si falla o si
    // Resend está en modo test y solo permite enviar al titular).
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: t.autoSubject,
        text: t.autoBody(nombre),
      });
    } catch {
      /* silencioso: la auto-respuesta es opcional */
    }
    if (journey) await persistContactEvent(journey, nombre, email);
    return { ok: true, enviado: true };
  } catch {
    return { ok: false, error: t.fallo };
  }
}
