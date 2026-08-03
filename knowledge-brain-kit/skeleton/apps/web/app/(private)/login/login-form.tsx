"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const PRIMARY = "var(--primary)";

type Step = "email" | "code";
type Status = "idle" | "sending" | "error";

export function LoginForm({
  error,
  redirectTo,
}: {
  error?: string;
  redirectTo: string;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [status, setStatus] = useState<Status>("idle");

  // Errores que llegan por URL tras un intento de verificación fallido.
  const accessDenied = error === "AccessDenied";
  const badCode = error === "Verification";

  // Paso 1: pedir el código (Resend lo envía por email).
  async function requestCode() {
    setStatus("sending");
    try {
      const res = await signIn("resend", { email, redirect: false, redirectTo });
      if (res?.error) {
        setStatus("error");
      } else {
        setStatus("idle");
        setStep("code");
      }
    } catch {
      setStatus("error");
    }
  }

  // Paso 2: verificar el código → navega al callback de Auth.js, que valida y
  // crea la sesión (o vuelve aquí con ?error=Verification si es inválido).
  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      callbackUrl: redirectTo,
      token: code.trim(),
      email,
    });
    window.location.href = `/api/auth/callback/resend?${params.toString()}`;
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1500px] items-center justify-center px-6 pb-24 pt-32 md:pt-44">
      <div className="w-full max-w-md">
        <div className="border border-neutral-300/70 bg-[var(--lk-fondo-alt)] p-9 md:p-11">
          <p className="mb-3 text-sm tracking-wide text-neutral-400">Área privada</p>
          <h1 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
            Acceso<span style={{ color: PRIMARY }}>.</span>
          </h1>

          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestCode();
              }}
              className="space-y-6"
            >
              <div className="border-b border-neutral-300/70 pb-3">
                <label htmlFor="email" className="mb-2 block text-sm text-neutral-500">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full bg-transparent text-lg text-foreground outline-none placeholder:text-neutral-400"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full px-9 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}
              >
                {status === "sending" ? "Enviando código…" : "Enviarme un código"}
              </button>

              {status === "error" && (
                <p className="text-[13px] text-primary">
                  No se pudo enviar el código. Revisa el email e inténtalo de nuevo.
                </p>
              )}
              {accessDenied && (
                <p className="text-[13px] text-primary">
                  Ese email no tiene acceso de administrador.
                </p>
              )}
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-6">
              <p className="text-[15px] leading-relaxed text-foreground">
                Te he enviado un código de 6 dígitos a{" "}
                <span className="font-medium">{email}</span>. Pégalo aquí.
              </p>

              <div className="border-b border-neutral-300/70 pb-3">
                <label htmlFor="code" className="mb-2 block text-sm text-neutral-500">
                  Código
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-transparent text-2xl tracking-[0.4em] text-foreground outline-none placeholder:tracking-[0.4em] placeholder:text-neutral-300"
                />
              </div>

              <button
                type="submit"
                disabled={code.length < 6}
                className="w-full px-9 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}
              >
                Entrar
              </button>

              {badCode && (
                <p className="text-[13px] text-primary">
                  Código incorrecto o caducado. Pide uno nuevo.
                </p>
              )}

              <div className="flex items-center justify-between text-[13px] text-neutral-400">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setStatus("idle");
                  }}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Cambiar email
                </button>
                <button
                  type="button"
                  onClick={requestCode}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Reenviar código
                </button>
              </div>
            </form>
          )}

          <p className="mt-7 text-[13px] leading-relaxed text-neutral-400">
            Solo para administradores. Recibirás un código de acceso en tu correo.
          </p>
        </div>
      </div>
    </section>
  );
}
