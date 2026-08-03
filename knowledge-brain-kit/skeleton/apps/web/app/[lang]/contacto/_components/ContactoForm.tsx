"use client";

import { useActionState, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Paperclip } from "lucide-react";

import { enviarContacto, type EstadoContacto } from "../_actions";

import type { Locale } from "@/lib/i18n/config";

const ESTADO_INICIAL: EstadoContacto = { ok: false };

type Modo = "single" | "multi" | "datos";
type Paso = { key: string; modo: Modo; max?: number };

// Los pasos del wizard se calculan dentro del componente (bifurca por razón de contacto).

// Vías directas (columna del Hablemos, como en la versión pre-wizard).
const VIAS = [
  { label: "Email", valor: "hola@tuconcepto.com", href: "mailto:hola@tuconcepto.com" },
  { label: "LinkedIn", valor: "/in/tuusuario", href: "https://www.linkedin.com/in/tuusuario" },
  { label: "X", valor: "@tuusuario", href: "https://x.com/tuusuario" },
  { label: "GitHub", valor: "github.com/tuusuario", href: "https://github.com/tuusuario" },
];

// Copy por locale. Las opciones se envían con su etiqueta visible (legible en el correo).
const T = {
  es: {
    titulo: "Hablemos",
    lead: "¿Marca, producto o sistema, o las tres a la vez? Cuéntame en qué andas y te respondo personalmente.",
    leadNote: "Suelo responder en menos de 48 horas.",
    viasDirectas: "Vías directas",
    step: "Paso",
    de: "de",
    atras: "Atrás",
    siguiente: "Siguiente",
    enviar: "Enviar",
    enviando: "Enviando…",
    unaOpcion: "Selecciona una opción.",
    hastaTres: "Selecciona hasta tres.",
    todasAplican: "Selecciona todas las que apliquen.",
    honeypot: "Empresa (dejar vacío)",
    contratacion: "Contratación / empleo",
    pasos: {
      tipo: { q: "Describe tu tipo de proyecto o razón de contacto", hint: "unaOpcion", ops: ["Branding", "Mobile App", "Web App", "Website", "Google Ads", "SEO/GEO", "Contratación / empleo"] },
      tamano: { q: "¿Cuál es el tamaño de tu empresa?", hint: "unaOpcion", ops: ["Fundador solo", "Startup pequeña", "Empresa mediana", "Gran empresa"] },
      presupuesto: { q: "¿Cuál es tu presupuesto?", hint: "unaOpcion", ops: ["< 2.000 €", "2.000 – 5.000 €", "8.000 – 12.000 €", "12.000 – 15.000 €", "15.000 – 20.000 €", "+20.000 €"] },
      categorias: { q: "¿Cómo categorizarías tu producto?", hint: "hastaTres", ops: ["SaaS", "On-demand", "Gestión de proyectos", "E-commerce", "Marketplace", "Social media", "Herramienta interna", "CRM", "Bolsa de trabajo", "Productividad", "Sitio de marketing", "Gestión de datos", "Hotelería y gastronomía", "Otro"] },
      funcionalidades: { q: "¿Qué funcionalidades vas a necesitar?", hint: "todasAplican", ops: ["Pagos", "Membresías", "Envío de emails", "Google Maps", "Video", "Inicio de sesión social", "Audio", "Analíticas internas", "Dashboard", "Otro"] },
      jornada: { q: "¿Qué tipo de jornada?", hint: "unaOpcion", ops: ["Tiempo completo", "Media jornada", "Por proyecto", "Freelance / colaboración"] },
      ubicacion: { q: "¿De qué parte del mundo?", hint: "unaOpcion", ops: ["Europa", "Latinoamérica", "Norteamérica", "Asia", "Remoto global"] },
      modalidad: { q: "¿Modalidad de trabajo?", hint: "unaOpcion", ops: ["Presencial", "Híbrido", "Remoto"] },
      pago: { q: "¿Tipo de pago?", hint: "unaOpcion", ops: ["Salario fijo", "Por hora", "Equity / como inversor", "Mixto", "A convenir"] },
      beneficios: { q: "¿Incluye beneficios?", hint: "unaOpcion", ops: ["Con beneficios", "Sin beneficios", "A negociar"] },
      sector: { q: "¿En qué sector?", hint: "unaOpcion", ops: ["Tech / SaaS", "Startup", "Agencia / estudio", "Fintech", "E-commerce", "Educación", "Salud", "Otro"] },
      cargo: { q: "¿Qué tipo de cargo?", hint: "unaOpcion", ops: ["[Rol 1]", "[Rol 2]", "[Rol 3]", "[Rol 4]", "Otro"] },
    },
    datos: {
      q: "Tus datos",
      hint: "Para poder responderte.",
      nombre: "Tu Nombre",
      nombrePh: "Juan Pérez",
      email: "Correo Electrónico",
      emailPh: "juan@ejemplo.com",
      mensaje: "Cuéntame la necesidad de tu proyecto",
      mensajePh: "Describe qué necesitas, objetivos, plazos…",
      adjuntos: "Sube tus referencias",
      adjuntosHint: "PDF, imágenes o documentos (máx. 5 archivos)",
    },
    okTitulo: "Mensaje recibido",
    okTexto: "Pronto recibirás respuesta. Suelo contestar en menos de 48 horas.",
    error: "Revisa nombre, email y mensaje.",
  },
  en: {
    titulo: "Let's talk",
    lead: "Brand, product or systems — or all three at once? Tell me what you're working on and I'll reply personally.",
    leadNote: "I usually reply within 48 hours.",
    viasDirectas: "Direct channels",
    step: "Step",
    de: "of",
    atras: "Back",
    siguiente: "Next",
    enviar: "Send",
    enviando: "Sending…",
    unaOpcion: "Select one option.",
    hastaTres: "Select up to three.",
    todasAplican: "Select all that apply.",
    honeypot: "Company (leave empty)",
    contratacion: "Hiring / role",
    pasos: {
      tipo: { q: "Describe your project type or reason for contact", hint: "unaOpcion", ops: ["Branding", "Mobile App", "Web App", "Website", "Google Ads", "SEO/GEO", "Hiring / role"] },
      tamano: { q: "What is your company size?", hint: "unaOpcion", ops: ["Solo founder", "Small startup", "Mid-size company", "Large company"] },
      presupuesto: { q: "What is your budget?", hint: "unaOpcion", ops: ["< €2,000", "€2,000 – 5,000", "€8,000 – 12,000", "€12,000 – 15,000", "€15,000 – 20,000", "€20,000+"] },
      categorias: { q: "How would you categorise your product?", hint: "hastaTres", ops: ["SaaS", "On-demand", "Project management", "E-commerce", "Marketplace", "Social media", "Internal tool", "CRM", "Job board", "Productivity", "Marketing site", "Data management", "Hospitality & food", "Other"] },
      funcionalidades: { q: "What features will you need?", hint: "todasAplican", ops: ["Payments", "Memberships", "Email sending", "Google Maps", "Video", "Social login", "Audio", "Internal analytics", "Dashboard", "Other"] },
      jornada: { q: "What type of engagement?", hint: "unaOpcion", ops: ["Full-time", "Part-time", "Per project", "Freelance / collaboration"] },
      ubicacion: { q: "Which part of the world?", hint: "unaOpcion", ops: ["Europe", "Latin America", "North America", "Asia", "Global remote"] },
      modalidad: { q: "Work mode?", hint: "unaOpcion", ops: ["On-site", "Hybrid", "Remote"] },
      pago: { q: "Payment type?", hint: "unaOpcion", ops: ["Fixed salary", "Hourly", "Equity / as investor", "Mixed", "To agree"] },
      beneficios: { q: "Benefits included?", hint: "unaOpcion", ops: ["With benefits", "No benefits", "Negotiable"] },
      sector: { q: "Which sector?", hint: "unaOpcion", ops: ["Tech / SaaS", "Startup", "Agency / studio", "Fintech", "E-commerce", "Education", "Health", "Other"] },
      cargo: { q: "What kind of role?", hint: "unaOpcion", ops: ["[Role 1]", "[Role 2]", "[Role 3]", "[Role 4]", "Other"] },
    },
    datos: {
      q: "Your details",
      hint: "So I can get back to you.",
      nombre: "Your Name",
      nombrePh: "Jane Doe",
      email: "Email",
      emailPh: "jane@example.com",
      mensaje: "Tell me about your project's needs",
      mensajePh: "Describe what you need, goals, timeline…",
      adjuntos: "Upload your references",
      adjuntosHint: "PDF, images or documents (max. 5 files)",
    },
    okTitulo: "Message received",
    okTexto: "You'll hear back soon. I usually reply within 48 hours.",
    error: "Check name, email and message.",
  },
} as const;

export function ContactoForm({ lang = "es" }: { lang?: Locale }) {
  const t = T[lang];
  const [estado, formAction, pending] = useActionState(enviarContacto, ESTADO_INICIAL);
  const sidRef = useRef<HTMLInputElement>(null);

  const [paso, setPaso] = useState(0);
  const [single, setSingle] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, string[]>>({ categorias: [], funcionalidades: [] });
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [archivos, setArchivos] = useState<string[]>([]);

  // El flujo se bifurca según la razón de contacto: proyecto vs. contratación/empleo.
  const esContratacion = single.tipo === t.contratacion;
  const pasos: Paso[] = esContratacion
    ? [
        { key: "tipo", modo: "single" },
        { key: "tamano", modo: "single" },
        { key: "jornada", modo: "single" },
        { key: "ubicacion", modo: "single" },
        { key: "modalidad", modo: "single" },
        { key: "pago", modo: "single" },
        { key: "beneficios", modo: "single" },
        { key: "sector", modo: "single" },
        { key: "cargo", modo: "single" },
        { key: "datos", modo: "datos" },
      ]
    : [
        { key: "tipo", modo: "single" },
        { key: "tamano", modo: "single" },
        { key: "presupuesto", modo: "single" },
        { key: "categorias", modo: "multi", max: 3 },
        { key: "funcionalidades", modo: "multi" },
        { key: "datos", modo: "datos" },
      ];
  // Al cambiar de razón de contacto (en el paso 0) el flujo puede acortarse; clamp defensivo.
  const idx = Math.min(paso, pasos.length - 1);
  const actual = pasos[idx];
  const ultimo = idx === pasos.length - 1;
  const keysActivas = new Set(pasos.map((p) => p.key));

  function toggleMulti(key: string, val: string, max?: number) {
    setMulti((prev) => {
      const arr = prev[key] ?? [];
      if (arr.includes(val)) return { ...prev, [key]: arr.filter((v) => v !== val) };
      if (max && arr.length >= max) return prev;
      return { ...prev, [key]: [...arr, val] };
    });
  }

  // ¿Se puede avanzar desde el paso actual?
  const puedeAvanzar = (() => {
    if (actual.modo === "single") return !!single[actual.key];
    if (actual.modo === "multi") return actual.max ? (multi[actual.key]?.length ?? 0) > 0 : true;
    return !!(nombre.trim() && email.trim() && mensaje.trim());
  })();

  function attachSid() {
    if (sidRef.current) {
      try {
        sidRef.current.value = sessionStorage.getItem("lk-sid") ?? "";
      } catch {}
    }
  }

  const pregunta =
    actual.modo === "datos"
      ? { q: t.datos.q, hint: t.datos.hint }
      : {
          q: t.pasos[actual.key as keyof typeof t.pasos].q,
          hint: t[t.pasos[actual.key as keyof typeof t.pasos].hint as "unaOpcion"],
        };

  return (
    <section className="mx-auto max-w-[1500px] px-6 pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="grid gap-16 md:grid-cols-12 md:gap-x-20">
        {/* Izquierda: Hablemos + vías directas (layout pre-wizard) */}
        <div className="md:col-span-5">
          <h1 className="font-bold leading-[0.95] tracking-[-0.035em] text-[clamp(3rem,8vw,7.5rem)]">
            {t.titulo}
            <span className="text-primary">.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-neutral-600">
            {t.lead}
            <span className="mt-2 block text-neutral-400">{t.leadNote}</span>
          </p>

          <div className="mt-16">
            <p className="mb-6 text-sm tracking-wide text-neutral-400">{t.viasDirectas}</p>
            <ul>
              {VIAS.map((via) => (
                <li key={via.label}>
                  <a
                    href={via.href}
                    target={via.href.startsWith("http") ? "_blank" : undefined}
                    rel={via.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline justify-between border-t border-neutral-300/70 py-5 transition-colors hover:bg-neutral-200/30"
                  >
                    <span className="text-xl font-semibold tracking-tight">{via.label}</span>
                    <span className="text-[15px] text-neutral-500 transition-colors group-hover:text-primary">
                      {via.valor}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Derecha: formulario por pasos */}
        <div className="md:col-span-7 md:pt-4">
          {estado.ok ? (
            <div className="flex h-full flex-col justify-center border-t border-neutral-300/70 pt-10 md:border-t-0 md:pt-0">
              <p className="mb-3 text-sm font-medium text-primary">✓</p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {t.okTitulo}
                <span className="text-primary">.</span>
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-600">{t.okTexto}</p>
            </div>
          ) : (
            <>
              {/* Progreso */}
              <div className="mb-10">
                <p className="mb-2 text-sm font-medium tabular-nums text-primary">
                  {t.step} {idx + 1} {t.de} {pasos.length}
                </p>
                <div className="h-px w-full bg-neutral-300/70">
                  <div
                    className="h-px bg-primary transition-all duration-300"
                    style={{ width: `${((idx + 1) / pasos.length) * 100}%` }}
                  />
                </div>
              </div>

              <form action={formAction} onSubmit={attachSid}>
                {/* Honeypot anti-bots (oculto). */}
                <div className="hidden" aria-hidden>
                  <label htmlFor="empresa">{t.honeypot}</label>
                  <input id="empresa" name="empresa" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <input ref={sidRef} type="hidden" name="sid" />
                {/* Idioma → la server action localiza errores y auto-respuesta. */}
                <input type="hidden" name="lang" value={lang} />

                {/* Valores recogidos en pasos anteriores → van al submit final.
                    Solo se envían los campos del flujo activo (keysActivas). */}
                {Object.entries(single)
                  .filter(([k, v]) => v && keysActivas.has(k))
                  .map(([k, v]) => (
                    <input key={k} type="hidden" name={k} value={v} />
                  ))}
                {Object.entries(multi)
                  .filter(([k]) => keysActivas.has(k))
                  .flatMap(([k, arr]) =>
                    (arr ?? []).map((v) => (
                      <input key={`${k}-${v}`} type="hidden" name={k} value={v} />
                    )),
                  )}

                <h2 className="text-2xl font-semibold tracking-tight">{pregunta.q}</h2>
                <p className="mt-2 text-sm text-neutral-500">{pregunta.hint}</p>

                {actual.modo !== "datos" ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {t.pasos[actual.key as keyof typeof t.pasos].ops.map((op) => {
                      const seleccionado =
                        actual.modo === "single"
                          ? single[actual.key] === op
                          : (multi[actual.key] ?? []).includes(op);
                      return (
                        <button
                          key={op}
                          type="button"
                          aria-pressed={seleccionado}
                          onClick={() =>
                            actual.modo === "single"
                              ? setSingle((s) => ({ ...s, [actual.key]: op }))
                              : toggleMulti(actual.key, op, actual.max)
                          }
                          className={`rounded-full border px-5 py-2.5 text-[15px] transition-colors ${
                            seleccionado
                              ? "border-foreground bg-foreground text-background"
                              : "border-neutral-300 text-neutral-700 hover:border-neutral-500"
                          }`}
                        >
                          {op}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <Campo label={t.datos.nombre}>
                      <input
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder={t.datos.nombrePh}
                        className="w-full border-b border-neutral-300 bg-transparent pb-2.5 text-lg text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-foreground"
                      />
                    </Campo>
                    <Campo label={t.datos.email}>
                      <input
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.datos.emailPh}
                        className="w-full border-b border-neutral-300 bg-transparent pb-2.5 text-lg text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-foreground"
                      />
                    </Campo>
                    <div className="sm:col-span-2">
                      <Campo label={t.datos.mensaje}>
                        <textarea
                          name="mensaje"
                          rows={3}
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                          placeholder={t.datos.mensajePh}
                          className="w-full resize-none border-b border-neutral-300 bg-transparent pb-2.5 text-lg text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-foreground"
                        />
                      </Campo>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-sm border border-dashed border-neutral-300 px-6 py-8 text-center transition-colors hover:border-neutral-500">
                        <Paperclip className="h-5 w-5 text-neutral-400" aria-hidden />
                        <span className="text-sm font-medium text-foreground">{t.datos.adjuntos}</span>
                        <span className="text-xs text-neutral-500">{t.datos.adjuntosHint}</span>
                        {archivos.length > 0 ? (
                          <span className="mt-1 text-xs text-neutral-600">{archivos.join(", ")}</span>
                        ) : null}
                        <input
                          name="archivos"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setArchivos(Array.from(e.target.files ?? []).map((f) => f.name))}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {estado.error ? (
                  <p role="alert" className="mt-6 text-sm text-primary">
                    {estado.error}
                  </p>
                ) : null}

                {/* Navegación */}
                <div className="mt-12 flex items-center justify-between">
                  {idx > 0 ? (
                    <button
                      type="button"
                      onClick={() => setPaso(idx - 1)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      {t.atras}
                    </button>
                  ) : (
                    <span />
                  )}

                  {ultimo ? (
                    <button
                      type="submit"
                      disabled={pending || !puedeAvanzar}
                      className="inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
                    >
                      {pending ? t.enviando : t.enviar}
                      {!pending ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!puedeAvanzar}
                      onClick={() => setPaso(idx + 1)}
                      className="inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-4 text-[15px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-40"
                    >
                      {t.siguiente}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-3 block text-sm text-neutral-500">{label}</label>
      {children}
    </div>
  );
}
