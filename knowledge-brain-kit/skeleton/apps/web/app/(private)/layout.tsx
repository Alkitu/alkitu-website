import "../globals.css";
import type { ReactNode } from "react";
// Import por entrypoint dedicado del paquete (no el barrel compositions): evita
// arrastrar el resto de composiciones del DS, algunas con defectos RSC preexistentes.
import { SiteHeader } from "@brain/design-system-web/compositions/site-header";
import { SiteFooter } from "@brain/design-system-web/compositions/site-footer";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { TYPEFACE_INIT_SCRIPT } from "@/lib/typeface";

export const metadata = {
  metadataBase: new URL("https://tuconcepto.com"),
  title: "[Concepto]",
  description:
    "Sitio de referencia sobre [concepto]: blog, wiki, casos de estudio y reseñas.",
};

/**
 * Root layout del árbol privado (/admin, /login): fuera del juego de locales
 * (Historia 7-1), siempre ES. Mismo chrome que el árbol público.
 */
export default function PrivateRootLayout({ children }: { children: ReactNode }) {
  const dict = getDictionary("es");
  return (
    <html lang="es" className="light">
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
          currentLocale="es"
        />
        {children}
        <SiteFooter nav={dict.footer.nav} />
      </body>
    </html>
  );
}
