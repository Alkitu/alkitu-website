import "../globals.css";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
// Import por entrypoint dedicado del paquete (no el barrel compositions): evita
// arrastrar el resto de composiciones del DS, algunas con defectos RSC preexistentes.
import { SiteHeader } from "@brain/design-system-web/compositions/site-header";
import { SiteFooter } from "@brain/design-system-web/compositions/site-footer";

import { LOCALES, isLocale } from "@/lib/i18n/config";
import routeMap from "@/lib/i18n/route-map.json";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TYPEFACE_INIT_SCRIPT } from "@/lib/typeface";
import { VisitTracker } from "@/app/_components/visit-tracker";
import { AgentChat } from "@/app/_components/AgentChat";
import { Clarity } from "@/app/_components/clarity";
import { CookieConsent } from "@/app/_components/cookie-consent";

export const metadata = {
  metadataBase: new URL("https://tuconcepto.com"),
  title: "[Concepto]",
  description:
    "Sitio de referencia sobre [concepto]: blog, wiki, casos de estudio y reseñas.",
};

// Solo se generan los locales declarados; cualquier otro valor de [lang] es 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // Chrome desde diccionarios (Historia 7-2 / FR-42): nada de texto hardcodeado.
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className="light">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Fija el modo tipográfico (ET/Eari) antes del primer paint. */}
        <script dangerouslySetInnerHTML={{ __html: TYPEFACE_INIT_SCRIPT }} />
        <SiteHeader
          nav={dict.header.nav}
          homeHref={dict.header.homeHref}
          contact={dict.header.contact}
          menuLabel={dict.header.menuLabel}
          openMenuLabel={dict.header.openMenuLabel}
          closeMenuLabel={dict.header.closeMenuLabel}
          langSwitcher={dict.header.langSwitcher}
          currentLocale={lang}
          routeMap={routeMap}
        />
        {children}
        <SiteFooter nav={dict.footer.nav} />
        {/* Agente experto del sitio (PRD-web-agentica E3): burbuja flotante global. */}
        <AgentChat lang={lang} />
        <VisitTracker />
        <Clarity />
        <CookieConsent lang={lang} />
      </body>
    </html>
  );
}
