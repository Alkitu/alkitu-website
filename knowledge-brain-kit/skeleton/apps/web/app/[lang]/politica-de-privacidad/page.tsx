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
    title: "Política de Privacidad | [Concepto]",
    description:
      "Cómo [titular] recoge, usa y protege tus datos personales: formulario de contacto, analítica propia y acceso al área privada.",
    actualizado: "Última actualización: 12 de julio de 2026",
    intro:
      "Esta política explica qué datos personales trata [Concepto] (tuconcepto.com), con qué fin y qué derechos tienes. Nos tomamos en serio tu privacidad y solo pedimos lo imprescindible.",
    secciones: [
      {
        h: "Responsable del tratamiento",
        p: [
          "El responsable es [titular], en adelante «nosotros». Para cualquier cuestión sobre tus datos puedes escribir a [email de contacto].",
        ],
      },
      {
        h: "Qué datos recogemos",
        items: [
          "Formulario de contacto: tu nombre, tu correo, el mensaje y los detalles del proyecto que nos facilites (tipo de proyecto, presupuesto, funcionalidades…), además de los archivos que decidas adjuntar.",
          "Analítica propia: datos de navegación agregados y sin identificarte personalmente (páginas vistas, país aproximado, referente, duración de sesión). No usamos cookies de publicidad de terceros.",
          "Acceso al área privada: reservado al titular del sitio, mediante un código de un solo uso enviado por correo. No hay registro abierto de usuarios.",
        ],
      },
      {
        h: "Con qué fin y con qué base legal",
        items: [
          "Responder a tu consulta y valorar un posible proyecto — base: tu consentimiento y el interés legítimo en atender tu solicitud.",
          "Medir y mejorar el sitio con analítica agregada — base: tu consentimiento (que gestionas desde el banner de cookies).",
          "Garantizar la seguridad del acceso privado — base: interés legítimo en proteger el sitio.",
        ],
      },
      {
        h: "Quién trata los datos por nosotros",
        p: [
          "Nos apoyamos en proveedores que actúan como encargados del tratamiento y solo procesan datos siguiendo nuestras instrucciones:",
        ],
        items: [
          "Resend — envío de los correos del formulario y de los códigos de acceso.",
          "MongoDB Atlas — almacenamiento de los mensajes y de la analítica agregada.",
          "Vercel — alojamiento del sitio y entrega de las páginas.",
        ],
      },
      {
        h: "Cuánto tiempo conservamos tus datos",
        p: [
          "Conservamos los mensajes del formulario mientras sean necesarios para atender tu solicitud y la relación que surja de ella. La analítica se guarda de forma agregada y sin identificarte. Puedes pedirnos la supresión en cualquier momento.",
        ],
      },
      {
        h: "Tus derechos",
        p: [
          "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [email de contacto]. Si crees que no hemos atendido bien tu solicitud, tienes derecho a reclamar ante la autoridad de control competente (en España, la Agencia Española de Protección de Datos).",
        ],
      },
      {
        h: "Cookies",
        p: [
          "Usamos cookies estrictamente necesarias para que el sitio funcione y, solo con tu permiso, cookies de analítica y de marketing. El detalle y la forma de gestionarlas está en nuestra Política de Cookies.",
        ],
      },
      {
        h: "Cambios en esta política",
        p: [
          "Podemos actualizar esta política para reflejar cambios en el sitio o en la normativa. La fecha de «última actualización» indica la versión vigente.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy | [Concept]",
    description:
      "How [holder] collects, uses and protects your personal data: contact form, first-party analytics and private-area access.",
    actualizado: "Last updated: 12 July 2026",
    intro:
      "This policy explains what personal data [Concept] (tuconcepto.com) processes, for what purpose and what rights you have. We take your privacy seriously and only ask for what is essential.",
    secciones: [
      {
        h: "Data controller",
        p: [
          "The controller is [holder], hereinafter “we”. For any question about your data, write to [email de contacto].",
        ],
      },
      {
        h: "What data we collect",
        items: [
          "Contact form: your name, email, message and the project details you share (project type, budget, features…), plus any files you choose to attach.",
          "First-party analytics: aggregated, non-identifying browsing data (page views, approximate country, referrer, session duration). We do not use third-party advertising cookies.",
          "Private-area access: reserved for the site owner via a one-time code sent by email. There is no open user sign-up.",
        ],
      },
      {
        h: "Purpose and legal basis",
        items: [
          "To reply to your enquiry and assess a possible project — basis: your consent and our legitimate interest in handling your request.",
          "To measure and improve the site with aggregated analytics — basis: your consent (managed from the cookie banner).",
          "To keep the private area secure — basis: legitimate interest in protecting the site.",
        ],
      },
      {
        h: "Who processes data on our behalf",
        p: [
          "We rely on providers acting as processors that only handle data on our instructions:",
        ],
        items: [
          "Resend — sending the form emails and the access codes.",
          "MongoDB Atlas — storing messages and aggregated analytics.",
          "Vercel — hosting the site and serving the pages.",
        ],
      },
      {
        h: "How long we keep your data",
        p: [
          "We keep form messages for as long as they are needed to handle your request and any relationship arising from it. Analytics are stored in aggregated, non-identifying form. You can ask us to delete your data at any time.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You can exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to [email de contacto]. If you believe your request was not handled properly, you have the right to lodge a complaint with the competent supervisory authority.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "We use strictly necessary cookies for the site to work and, only with your permission, analytics and marketing cookies. The detail and how to manage them is in our Cookie Policy.",
        ],
      },
      {
        h: "Changes to this policy",
        p: [
          "We may update this policy to reflect changes in the site or in the law. The “last updated” date shows the version in force.",
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
    ...alternatesFor("/politica-de-privacidad", {
      hasEn: hasEnPair("/politica-de-privacidad"),
      lang,
    }),
  };
}

export default async function PrivacidadPage({ params }: RouteParams) {
  const { lang } = await params;
  const t = COPY[lang];
  return (
    <LegalLayout
      titulo={lang === "en" ? "Privacy Policy" : "Política de Privacidad"}
      actualizado={t.actualizado}
      intro={t.intro}
      secciones={t.secciones}
    />
  );
}
