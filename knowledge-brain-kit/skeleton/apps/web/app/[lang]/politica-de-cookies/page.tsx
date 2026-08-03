import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n/config";
import { alternatesFor } from "@/lib/seo/alternates";
import { hasEnPair } from "@/lib/i18n/pares";
import { LegalLayout, type SeccionLegal } from "../_components/LegalLayout";

type RouteParams = { params: Promise<{ lang: Locale }> };

const COPY: Record<
  Locale,
  { title: string; description: string; actualizado: string; intro: string; secciones: SeccionLegal[] }
> = {
  es: {
    title: "Política de Cookies | [Concepto]",
    description:
      "Qué cookies usa tuconcepto.com (necesarias, analíticas y de marketing) y cómo gestionar tu consentimiento.",
    actualizado: "Última actualización: 12 de julio de 2026",
    intro:
      "Esta política explica qué son las cookies, cuáles utiliza tuconcepto.com y cómo puedes decidir cuáles permites en cualquier momento.",
    secciones: [
      {
        h: "Qué son las cookies",
        p: [
          "Una cookie es un pequeño archivo que un sitio guarda en tu dispositivo para recordar información entre visitas: por ejemplo, tus preferencias o si ya aceptaste este aviso. Usamos también tecnologías equivalentes (como el almacenamiento local del navegador) con el mismo propósito.",
        ],
      },
      {
        h: "Categorías que usamos",
        items: [
          "Estrictamente necesarias — imprescindibles para que el sitio funcione (por ejemplo, recordar tu elección de cookies o mantener el acceso al área privada). Siempre activas; no requieren tu permiso.",
          "Analíticas — nos ayudan a entender cómo se usa el sitio de forma agregada para mejorarlo. Solo se activan si las aceptas.",
          "Marketing — permitirían mostrar u optimizar campañas relevantes. Solo se activan si las aceptas.",
        ],
      },
      {
        h: "Detalle",
        p: [
          "Cookies necesarias: guardan tu decisión sobre las cookies y, en el área privada, la sesión de acceso. Duran, como mucho, lo que exija su función (de la sesión a unos meses).",
          "Analíticas: alimentan nuestra propia analítica —agregada y sin identificarte—; no compartimos estos datos con redes publicitarias.",
          "Marketing: si en el futuro se activa alguna, se listará aquí con su proveedor y duración antes de usarse.",
        ],
      },
      {
        h: "Cómo gestionar tu consentimiento",
        p: [
          "La primera vez que visitas el sitio te mostramos un banner para aceptar todas, rechazar todas o personalizar por categoría. Puedes cambiar tu decisión cuando quieras volviendo a abrir las preferencias de cookies, y también borrar o bloquear cookies desde la configuración de tu navegador.",
          "Rechazar las cookies opcionales no afecta al funcionamiento básico del sitio; solo desactiva la medición y, en su caso, el marketing.",
        ],
      },
      {
        h: "Cambios en esta política",
        p: [
          "Podemos actualizar esta política si cambian las cookies que usamos o la normativa aplicable. La fecha de «última actualización» indica la versión vigente. Para más contexto sobre el tratamiento de tus datos, consulta la Política de Privacidad.",
        ],
      },
    ],
  },
  en: {
    title: "Cookie Policy | [Concept]",
    description:
      "What cookies tuconcepto.com uses (necessary, analytics and marketing) and how to manage your consent.",
    actualizado: "Last updated: 12 July 2026",
    intro:
      "This policy explains what cookies are, which ones tuconcepto.com uses and how you can decide which to allow at any time.",
    secciones: [
      {
        h: "What cookies are",
        p: [
          "A cookie is a small file a site stores on your device to remember information between visits: for example, your preferences or whether you already accepted this notice. We also use equivalent technologies (such as the browser's local storage) for the same purpose.",
        ],
      },
      {
        h: "Categories we use",
        items: [
          "Strictly necessary — required for the site to work (for example, remembering your cookie choice or keeping the private-area session). Always on; they don't need your permission.",
          "Analytics — help us understand how the site is used, in aggregate, to improve it. Enabled only if you accept them.",
          "Marketing — would allow showing or optimising relevant campaigns. Enabled only if you accept them.",
        ],
      },
      {
        h: "Detail",
        p: [
          "Necessary cookies: store your cookie decision and, in the private area, the access session. They last, at most, as long as their function requires (from the session to a few months).",
          "Analytics: feed our own aggregated, non-identifying analytics; we do not share this data with ad networks.",
          "Marketing: if any is enabled in the future, it will be listed here with its provider and duration before being used.",
        ],
      },
      {
        h: "How to manage your consent",
        p: [
          "The first time you visit, we show a banner to accept all, reject all or customise by category. You can change your decision at any time by reopening the cookie preferences, and you can also delete or block cookies from your browser settings.",
          "Rejecting optional cookies does not affect the basic operation of the site; it only turns off measurement and, where applicable, marketing.",
        ],
      },
      {
        h: "Changes to this policy",
        p: [
          "We may update this policy if the cookies we use or the applicable law change. The “last updated” date shows the version in force. For more context on how we process your data, see the Privacy Policy.",
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang } = await params;
  const m = COPY[lang];
  return {
    title: m.title,
    description: m.description,
    ...alternatesFor("/politica-de-cookies", {
      hasEn: hasEnPair("/politica-de-cookies"),
      lang,
    }),
  };
}

export default async function CookiesPage({ params }: RouteParams) {
  const { lang } = await params;
  const t = COPY[lang];
  return (
    <LegalLayout
      titulo={lang === "en" ? "Cookie Policy" : "Política de Cookies"}
      actualizado={t.actualizado}
      intro={t.intro}
      secciones={t.secciones}
    />
  );
}
