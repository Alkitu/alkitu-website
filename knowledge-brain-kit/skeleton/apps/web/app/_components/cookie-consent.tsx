"use client";

import * as React from "react";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";

// Consentimiento de cookies (RGPD): banner en la 1ª visita con aceptar/rechazar/
// personalizar por categoría. La decisión se guarda en localStorage; al guardar se
// emite `lk:cookie-consent` para que la analítica pueda respetarla. Reabrible con el
// evento `lk:open-cookie-preferences` (p. ej. desde un enlace del footer).
const CLAVE = "lk-cookie-consent-v1";
export const EVENTO_ABRIR = "lk:open-cookie-preferences";
export const EVENTO_CAMBIO = "lk:cookie-consent";

type Preferencias = { analytics: boolean; marketing: boolean };

const T = {
  es: {
    titulo: "Usamos cookies",
    cuerpo:
      "Usamos cookies para mejorar tu experiencia de navegación, ofrecer contenido personalizado y analizar nuestro tráfico. Puedes elegir qué cookies permites.",
    masInfo: "Para más información, consulta nuestra",
    cookies: "Política de Cookies",
    y: "y",
    privacidad: "Política de Privacidad",
    aceptar: "Aceptar todas",
    rechazar: "Rechazar todas",
    personalizar: "Personalizar",
    guardar: "Guardar preferencias",
    siempre: "Siempre activa",
    cats: {
      necesarias: {
        t: "Estrictamente necesarias",
        d: "Esenciales para el correcto funcionamiento del sitio web. No se pueden desactivar.",
      },
      analiticas: {
        t: "Analíticas",
        d: "Nos ayudan a entender cómo los visitantes interactúan con el sitio para mejorar nuestro contenido y servicios.",
      },
      marketing: {
        t: "Marketing",
        d: "Se utilizan para mostrar anuncios y campañas de marketing relevantes.",
      },
    },
    hrefCookies: "/politica-de-cookies",
    hrefPrivacidad: "/politica-de-privacidad",
  },
  en: {
    titulo: "We use cookies",
    cuerpo:
      "We use cookies to improve your browsing experience, offer personalised content and analyse our traffic. You can choose which cookies to allow.",
    masInfo: "For more information, see our",
    cookies: "Cookie Policy",
    y: "and",
    privacidad: "Privacy Policy",
    aceptar: "Accept all",
    rechazar: "Reject all",
    personalizar: "Customise",
    guardar: "Save preferences",
    siempre: "Always on",
    cats: {
      necesarias: {
        t: "Strictly necessary",
        d: "Essential for the site to work properly. They cannot be turned off.",
      },
      analiticas: {
        t: "Analytics",
        d: "Help us understand how visitors interact with the site to improve our content and services.",
      },
      marketing: {
        t: "Marketing",
        d: "Used to show relevant ads and marketing campaigns.",
      },
    },
    hrefCookies: "/en/politica-de-cookies",
    hrefPrivacidad: "/en/politica-de-privacidad",
  },
} as const;

function guardar(prefs: Preferencias) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...prefs, ts: Date.now() }));
  } catch {
    /* localStorage no disponible → no persistimos, pero cerramos el banner */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: prefs }));
}

export function CookieConsent({ lang }: { lang: Locale }) {
  const t = T[lang] ?? T.es;
  const [abierto, setAbierto] = React.useState(false);
  const [detalle, setDetalle] = React.useState(false);
  const [prefs, setPrefs] = React.useState<Preferencias>({ analytics: false, marketing: false });

  React.useEffect(() => {
    let decidido = false;
    try {
      decidido = !!localStorage.getItem(CLAVE);
    } catch {
      decidido = false;
    }
    if (!decidido) setAbierto(true);

    const reabrir = () => {
      setDetalle(true);
      setAbierto(true);
    };
    window.addEventListener(EVENTO_ABRIR, reabrir);
    return () => window.removeEventListener(EVENTO_ABRIR, reabrir);
  }, []);

  if (!abierto) return null;

  const cerrar = (p: Preferencias) => {
    guardar(p);
    setAbierto(false);
    setDetalle(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 md:inset-x-auto md:bottom-4 md:right-4 md:p-0">
      <div
        role="dialog"
        aria-label={t.titulo}
        className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 text-foreground shadow-2xl md:mx-0"
      >
        <h2 className="text-lg font-semibold">{t.titulo}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{t.cuerpo}</p>

        {detalle ? (
          <div className="mt-5 space-y-3">
            <CategoriaFija titulo={t.cats.necesarias.t} desc={t.cats.necesarias.d} etiqueta={t.siempre} />
            <CategoriaToggle
              titulo={t.cats.analiticas.t}
              desc={t.cats.analiticas.d}
              activo={prefs.analytics}
              onToggle={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
            />
            <CategoriaToggle
              titulo={t.cats.marketing.t}
              desc={t.cats.marketing.d}
              activo={prefs.marketing}
              onToggle={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
            />
          </div>
        ) : null}

        <p className="mt-5 text-xs leading-relaxed text-neutral-500">
          {t.masInfo}{" "}
          <Link href={t.hrefCookies} className="text-primary underline underline-offset-2 hover:opacity-80">
            {t.cookies}
          </Link>{" "}
          {t.y}{" "}
          <Link href={t.hrefPrivacidad} className="text-primary underline underline-offset-2 hover:opacity-80">
            {t.privacidad}
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {detalle ? (
            <button
              type="button"
              onClick={() => cerrar(prefs)}
              className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              {t.guardar}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => cerrar({ analytics: true, marketing: true })}
                className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                {t.aceptar}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => cerrar({ analytics: false, marketing: false })}
                  className="flex-1 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100"
                >
                  {t.rechazar}
                </button>
                <button
                  type="button"
                  onClick={() => setDetalle(true)}
                  className="flex-1 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-neutral-100"
                >
                  {t.personalizar}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoriaFija({ titulo, desc, etiqueta }: { titulo: string; desc: string; etiqueta: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{titulo}</p>
        <span className="text-xs font-medium text-primary">{etiqueta}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{desc}</p>
    </div>
  );
}

function CategoriaToggle({
  titulo,
  desc,
  activo,
  onToggle,
}: {
  titulo: string;
  desc: string;
  activo: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{titulo}</p>
        <button
          type="button"
          role="switch"
          aria-checked={activo}
          aria-label={titulo}
          onClick={onToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            activo ? "bg-primary" : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
              activo ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{desc}</p>
    </div>
  );
}
