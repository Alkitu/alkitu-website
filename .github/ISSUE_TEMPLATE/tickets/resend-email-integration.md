# 🚀 Feature Request: Integración RESEND para Envío de Emails

**Labels:** `feature`, `P1`, `email`, `integration`, `resend`

---

## 📖 User Story

**Como** administrador del sitio
**Quiero** recibir notificaciones por email cuando alguien envía el formulario de contacto
**Para** poder responder rápidamente a potenciales clientes

**Escenario:** Email de notificación al recibir contacto
**Dado que** un usuario ha enviado el formulario de contacto
**Cuando** la submission se guarda exitosamente en la base de datos
**Entonces** se envía automáticamente un email a `contacto@alkitu.com`
**Y** el email contiene toda la información del formulario
**Y** el usuario recibe un email de confirmación de recepción

---

## 🎯 Contexto de Producto

### Problema que resuelve
- Actualmente los mensajes se guardan en BD pero no hay notificación inmediata
- El equipo debe revisar manualmente el admin panel para ver nuevos mensajes
- Sin confirmación para el usuario de que su mensaje fue recibido
- Delay en respuestas afecta conversión de leads

### Impacto esperado
- **Usuarios afectados**: Admin y todos los visitantes que contacten
- **Métricas**:
  - Tiempo de respuesta: <2 horas (vs actual: días)
  - Tasa de respuesta: 100% (vs actual: inconsistente)
  - Satisfacción del usuario (confirmación inmediata)
  - Conversión de leads mejorada

### Prioridad de negocio
🟠 **High (P1)** - Critical para responder oportunamente a potenciales clientes

---

## ✅ Criterios de Aceptación

### Configuración RESEND
- [ ] Cuenta RESEND creada y verificada
- [ ] Dominio verificado (`alkitu.com` o `mg.alkitu.com`)
- [ ] API key obtenida y guardada en Vercel env vars
- [ ] Template emails configurados en RESEND dashboard

### API Integration
- [ ] Dependencia `resend` instalada: `npm install resend`
- [ ] Cliente RESEND configurado en `lib/resend.ts`
- [ ] Email templates creados (React Email o JSX)
- [ ] Función helper para envío de emails con error handling

### Email Flows

**Flow 1: Notificación a Admin**
- [ ] Trigger: Después de guardar submission en BD
- [ ] To: `contacto@alkitu.com` (configurable via env var)
- [ ] From: `noreply@alkitu.com`
- [ ] Reply-To: Email del usuario (para respuesta directa)
- [ ] Subject: `[Alkitu] Nuevo mensaje de contacto - {subject}`
- [ ] Body: Template con datos del formulario
- [ ] Include: nombre, email, asunto, mensaje, fecha, locale

**Flow 2: Confirmación al Usuario**
- [ ] Trigger: Después de notificación a admin exitosa
- [ ] To: Email del usuario
- [ ] From: `contacto@alkitu.com`
- [ ] Subject bilingüe según locale:
  - ES: `Hemos recibido tu mensaje - Alkitu`
  - EN: `We received your message - Alkitu`
- [ ] Body: Template de confirmación (bilingüe)
- [ ] Include: agradecimiento, expectativa de respuesta (24-48h)

### Error Handling
- [ ] Si email falla, submission aún se guarda en BD
- [ ] Log de errores de email en Vercel logs
- [ ] Retry logic (max 3 intentos)
- [ ] Admin notification si email falla consistentemente
- [ ] Graceful degradation (no afecta UX del usuario)

### Templates
- [ ] Template React Email para notificación admin (responsive)
- [ ] Template React Email para confirmación usuario ES
- [ ] Template React Email para confirmación usuario EN
- [ ] Templates son mobile-friendly
- [ ] Branding consistente (colores, logo Alkitu)

### Testing
- [ ] Email a admin se envía correctamente
- [ ] Email de confirmación en español funciona
- [ ] Email de confirmación en inglés funciona
- [ ] Reply-To funciona (respuesta llega al usuario)
- [ ] Emails se ven bien en Gmail, Outlook, Apple Mail
- [ ] Emails mobile-responsive
- [ ] No se envían emails en entorno desarrollo (flag)

---

## 🔧 Especificaciones Técnicas

### Archivos a crear/modificar

```
lib/
├── resend.ts                    (nuevo - cliente RESEND)
└── email-templates/             (nuevo - carpeta)
    ├── contact-notification.tsx (admin notification)
    ├── contact-confirmation-es.tsx
    └── contact-confirmation-en.tsx

app/api/contact/submit/
└── route.ts                     (modificar - agregar email logic)

.env.local
└── RESEND_API_KEY=...           (nuevo)

package.json
└── dependencies: resend, react-email (nuevo)
```

### Setup RESEND

```bash
# Instalar dependencias
npm install resend
npm install @react-email/components @react-email/render

# Crear cuenta en resend.com
# Verificar dominio
# Obtener API key
```

### Environment Variables

```env
# .env.local y Vercel
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@alkitu.com
RESEND_ADMIN_EMAIL=contacto@alkitu.com

# Optional: disable emails in dev
RESEND_ENABLED=true  # false for development
```

### Cliente RESEND

```typescript
// lib/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const RESEND_CONFIG = {
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@alkitu.com',
  adminEmail: process.env.RESEND_ADMIN_EMAIL || 'contacto@alkitu.com',
  enabled: process.env.RESEND_ENABLED !== 'false',
} as const;
```

### Email Template Example (Admin Notification)

```typescript
// lib/email-templates/contact-notification.tsx
import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from '@react-email/components';

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  submittedAt: string;
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  locale,
  submittedAt,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nuevo Mensaje de Contacto</Heading>

          <Section style={section}>
            <Text style={label}>De:</Text>
            <Text style={value}>{name} ({email})</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Asunto:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Mensaje:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={metaSection}>
            <Text style={meta}>Locale: {locale}</Text>
            <Text style={meta}>Recibido: {submittedAt}</Text>
            <Link href={`mailto:${email}`} style={button}>
              Responder directamente
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const section = {
  padding: '0 40px',
  marginBottom: '24px',
};

const label = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
};

const value = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
};

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const metaSection = {
  padding: '0 40px',
};

const meta = {
  color: '#999',
  fontSize: '12px',
  margin: '4px 0',
};

const button = {
  backgroundColor: '#00BB31',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  marginTop: '16px',
};
```

### Integración en API Route

```typescript
// app/api/contact/submit/route.ts (modificar)
import { resend, RESEND_CONFIG } from '@/lib/resend';
import ContactNotification from '@/lib/email-templates/contact-notification';
import ContactConfirmationES from '@/lib/email-templates/contact-confirmation-es';
import ContactConfirmationEN from '@/lib/email-templates/contact-confirmation-en';
import { render } from '@react-email/render';

export async function POST(request: NextRequest) {
  // ... validación y guardado en BD existente ...

  // Send emails (don't block response)
  if (RESEND_CONFIG.enabled) {
    try {
      // 1. Notify admin
      await resend.emails.send({
        from: RESEND_CONFIG.fromEmail,
        to: RESEND_CONFIG.adminEmail,
        replyTo: result.data.email,
        subject: `[Alkitu] Nuevo mensaje de contacto - ${result.data.subject}`,
        react: ContactNotification({
          name: result.data.name,
          email: result.data.email,
          subject: result.data.subject,
          message: result.data.message,
          locale: result.data.locale,
          submittedAt: new Date().toLocaleString(),
        }),
      });

      // 2. Send confirmation to user
      const ConfirmationTemplate =
        result.data.locale === 'es' ? ContactConfirmationES : ContactConfirmationEN;

      await resend.emails.send({
        from: RESEND_CONFIG.fromEmail,
        to: result.data.email,
        subject:
          result.data.locale === 'es'
            ? 'Hemos recibido tu mensaje - Alkitu'
            : 'We received your message - Alkitu',
        react: ConfirmationTemplate({
          name: result.data.name,
        }),
      });
    } catch (emailError) {
      // Log but don't fail request
      console.error('Email sending failed:', emailError);
      // TODO: Consider adding to queue for retry
    }
  }

  return ApiSuccess.created(data, 'Message sent successfully');
}
```

### Nuevas dependencias
- `resend` - Email service SDK
- `@react-email/components` - React email components
- `@react-email/render` - Render React to HTML email

### Consideraciones
- **i18n**: Sí - templates bilingües (ES/EN)
- **Analytics**: Sí - trackear tasa de envío exitoso
- **Database changes**: No - solo lógica en API
- **Error handling**: Sí - emails no deben bloquear submission
- **Rate limiting**: Revisar límites RESEND free tier (100 emails/day)
- **Cost**: RESEND free tier 100 emails/day, Pro $20/month 50k emails

---

## 🎨 Diseño/Mockups

**Email Templates:**
- Responsive design (mobile-friendly)
- Clean, professional layout
- Alkitu branding (logo, colors: #00BB31 primary, #00701D secondary)
- Clear CTA buttons
- Footer con información de contacto y redes sociales

**Inspiración:**
- Vercel transactional emails
- Linear notification emails
- Resend example templates

---

## 🔗 Tickets Relacionados

**Depende de:**
- #[PREV] - Base de datos para formularios de contacto (DEBE estar completado primero)

**Bloquea:**
- #[NEXT] - Admin panel para responder emails directamente

**Relacionado con:**
- Documentación: `docs/EMAIL_INTEGRATION.md` (crear después)

---

## ⏱️ Estimación

**Complejidad:** Media
**Esfuerzo estimado:** 4-6 horas

**Desglose:**
- Setup RESEND account + domain verification: 1h
- Instalar dependencias y configurar cliente: 30min
- Crear email templates (3 templates): 2-3h
- Integrar en API route: 1h
- Testing en diferentes clientes email: 1h
- Documentación: 30min

---

## 📚 Recursos

- [RESEND Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [RESEND Email Previews](https://resend.com/docs/dashboard/emails/send-test-emails)
- [Email HTML Best Practices](https://www.emailonacid.com/blog/)

---

## ⚠️ Notas Importantes

1. **Domain Verification**: Requiere configurar DNS records (SPF, DKIM, DMARC)
2. **Free Tier Limits**: 100 emails/day - considerar upgrade si se excede
3. **Deliverability**: Monitorear spam score y bounce rate
4. **Development**: Usar flag `RESEND_ENABLED=false` para evitar enviar emails en dev
5. **Reply-To**: Configurar correctamente para que respuestas lleguen al usuario original
