---
title: Contacto
aliases: [Contact, Hablemos, Get in touch]
tipo: page
nivel: hipónimo
dominio: [Contacto]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [contacto, formulario, redes, email, agenda]
relacionado:
  - "[[About.es]]"
  - "[[Landing.es]]"
  - "[[Casos.es]]"
  - "[[🔌 Connections]]"

titulo: "Contacto | [Concepto]"
metadescripcion: "¿Tienes un proyecto o una idea? Hablemos. Contacta a través de formulario, email y redes."
slug: /contacto
keyword-principal: "contactar [Concepto]"
keywords-secundarias: ["contacto [concepto]", hablemos, "email [concepto]", agendar llamada]
tags: [contacto, formulario, redes]
intencion-busqueda: transaccional
og-image: ""                         # hereda el generador OG branded (app/opengraph-image.tsx); sin openGraph.images propio
dominio-raiz: tuconcepto.com
subdominio: ""
query-params: [asunto, ref]          # asunto = preselección del motivo; ref = caso de estudio de origen (CTA)
canonical: https://tuconcepto.com/contacto

# ── Capa 3: GEO ──
geo-preguntas:
  - "¿cómo contactar?"
  - "¿cómo agendar una llamada?"
geo-respuesta-corta: "Vías de contacto: formulario, email y redes. Es el destino de los CTA de los casos de estudio."
geo-entidades: ["[Concepto]", contacto]
geo-datos-citables: []
geo-formato: [definicion, faq]
schema-tipo: ContactPage

# ── Capa 4: Sitemap técnico ──
prioridad: 0.6
frecuencia-cambio: yearly
idiomas: [es, en]
hreflang-alt: /en/contact

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/[lang]/contacto/page.tsx"                       # Server Component: metadata + isla
  - "apps/web/app/[lang]/contacto/_components/ContactoForm.tsx"   # isla cliente: form (useActionState) + honeypot + estados
  - "apps/web/app/[lang]/contacto/_actions.ts"                    # server action: valida + rate-limit + envío (Resend)
componentes:
  - "ds:patterns/dynamic-form"       # formulario configurable (campos + validación + estados)
  - "ds:primitives/input"            # nombre, email
  - "ds:primitives/textarea"         # mensaje
  - "ds:primitives/button"           # enviar / CTA
  - "ds:primitives/card"             # tarjeta de vías directas y de disponibilidad
datos:
  - "content/contacto/  (planeado: copy + lista de vías/redes; o inline en la página)"
  - "contact_submissions  (mensajes recibidos del formulario, visibles desde el panel admin)"
fuentes:
  - "firma de email existente (redes, branding)"
  - "Resend  (entrega del email de notificación)"
  - "base de datos (persistencia de contact_submissions)"
depende-de:
  - "[[Casos.es]]"        # esta página es el destino de sus CTA
  - "[[Estadisticas.es]]"            # los mensajes se ven en el panel admin
---

# Contacto: `/contacto`

> [!definition] Propósito
> Convertir interés en conversación. Página pública, simple y directa, con varias vías. Es el **destino de los CTA de los casos de estudio** (cada caso enlaza aquí, opcionalmente con `?ref=<caso>` para saber de dónde viene el lead).

## Secciones

1. **Mensaje / Hero**: "Hablemos" + 1 línea de a quién ayuda [concepto] y qué tipo de mensajes espera.
2. **Formulario**: nombre · email · mensaje (+ campo opcional **asunto/tipo**). **Anti-spam: honeypot + rate-limit** en el endpoint. Estados: enviando · éxito · error. Al enviar: (a) se **persiste el mensaje** en `contact_submissions` y (b) se **notifica por email vía Resend**. Si llega `?ref=<caso>`, se pre-rellena el asunto y se guarda la procedencia (campo `ref`).
3. **Vías directas**: email, LinkedIn, X/Twitter, GitHub.
4. **Agenda (opcional)**: bloque para reservar llamada (Cal.com / Calendly) si se decide ofrecerlo.
5. **Disponibilidad**: estado actual, con texto editable.

## Componentes

| Sección | Componente DS | Notas |
|---|---|---|
| Formulario | `ds:patterns/dynamic-form` | esquema de campos declarativo; valida y muestra estados |
| Campos | `ds:primitives/input`, `ds:primitives/textarea` | mobile-first; teclado adecuado por campo (email → `type=email`) |
| Acción | `ds:primitives/button` | CTA primario brand |
| Vías / disponibilidad | `ds:primitives/card` | tarjetas con iconos de red |

## Flujo de envío
1. **POST** del formulario a un endpoint del sitio (Route Handler / Server Action).
2. **Anti-spam**: si el **honeypot** viene relleno → se descarta silenciosamente; **rate-limit** por IP en el endpoint.
3. **Persistir** → insertar fila en `contact_submissions` (nombre, email, mensaje, asunto, `ref`, timestamp). Es lo que se ve luego en el panel de [[Estadisticas.es]].
4. **Notificar por email vía Resend** → aviso con el contenido del mensaje.
5. Responder estado al cliente: **éxito · error**.

> [!note] Responsividad y dispositivos
> Mobile-first. En desktop, formulario y vías conviven en 2 columnas.

## Notas SEO + GEO
- Datos estructurados `ContactPage` + `Person`.
- Bloque **FAQ** ("¿estás disponible?", "¿cómo agendamos?") → `schema-tipo` secundario `FAQPage` si se incluye.
- Las URLs con `?asunto`/`?ref` **no son canónicas**; `canonical` apunta siempre a `/contacto` limpio.
- Por defecto **indexable** (es página de conversión).

## Decisiones de diseño
- **Email = Resend**: la notificación del mensaje se entrega vía **Resend** (encaja con Next).
- **Persistencia**: cada envío se guarda en la tabla **`contact_submissions`**; los mensajes se consultan desde el panel de [[Estadisticas.es]].
- **Anti-spam = honeypot + rate-limit**: campo trampa + límite por IP en el endpoint (sin captcha por ahora).

## Pendiente / Bloqueos
- **Campos del formulario**: ¿solo nombre/email/mensaje, o se añade asunto/tipo/presupuesto?
- **Agenda**: ¿se integra Cal.com / Calendly, o solo email? Decidir si la sección 4 existe.
- **Esquema de `contact_submissions`**: columnas exactas (retención/limpieza de datos).
