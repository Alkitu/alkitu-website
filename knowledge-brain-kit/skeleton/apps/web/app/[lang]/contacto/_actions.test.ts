import { describe, it, expect, beforeEach } from "vitest";

import { enviarContacto, type EstadoContacto } from "./_actions";

const INI: EstadoContacto = { ok: false };

function fd(campos: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(campos)) f.append(k, v);
  return f;
}

describe("enviarContacto (Historia 5-1)", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY; // sin key: nunca envía de verdad en test
  });

  it("honeypot relleno → se rechaza en silencio (aparenta éxito, no envía)", async () => {
    const r = await enviarContacto(INI, fd({ nombre: "Bot", email: "b@b.com", mensaje: "hola", empresa: "spam" }));
    expect(r.ok).toBe(true);
    expect(r.enviado).toBe(false);
  });

  it("campos vacíos → error de validación", async () => {
    const r = await enviarContacto(INI, fd({ nombre: "", email: "", mensaje: "" }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/completa/i);
  });

  it("email inválido → error", async () => {
    const r = await enviarContacto(INI, fd({ nombre: "Ana", email: "no-es-email", mensaje: "hola" }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/email/i);
  });

  it("válido pero sin RESEND_API_KEY → error accionable (no rompe)", async () => {
    const r = await enviarContacto(INI, fd({ nombre: "Ana", email: "ana@ejemplo.com", mensaje: "hola" }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/configurad|hola@brain/i);
  });

  it("rate-limit: 4º envío del mismo email en la ventana → rechazo", async () => {
    const email = "spammer@ejemplo.com";
    for (let i = 0; i < 3; i++) {
      await enviarContacto(INI, fd({ nombre: "S", email, mensaje: "hola" }));
    }
    const r = await enviarContacto(INI, fd({ nombre: "S", email, mensaje: "hola" }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/demasiados/i);
  });
});
