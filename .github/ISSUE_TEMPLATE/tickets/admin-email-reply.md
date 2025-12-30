# 🚀 Feature Request: Responder Emails Directamente desde Admin Panel

**Labels:** `feature`, `P2`, `admin`, `email`, `resend`

---

## 📖 User Story

**Como** administrador del sitio
**Quiero** responder mensajes de contacto directamente desde el admin panel
**Para** gestionar toda la comunicación en un solo lugar sin cambiar de aplicación

**Escenario:** Administrador responde consulta de usuario
**Dado que** estoy viendo la lista de mensajes de contacto en `/admin/contact`
**Cuando** hago clic en "Responder" en un mensaje pendiente
**Entonces** se abre un modal/drawer con editor de email
**Y** puedo escribir mi respuesta con formato rich text
**Y** el email se envía mediante RESEND
**Y** el estado del mensaje cambia a "replied"
**Y** se guarda un historial de la conversación

---

## 🎯 Contexto de Producto

### Problema que resuelve
- Admin debe usar cliente de email separado para responder
- No hay registro centralizado de respuestas enviadas
- Dificulta seguimiento de conversaciones con clientes
- Workflow fragmentado entre admin panel y email

### Impacto esperado
- **Usuarios afectados**: Admin y usuarios que contacten
- **Métricas**:
  - Tiempo de respuesta reducido en 50%
  - Tasa de respuesta aumentada al 100%
  - Mejor organización de comunicaciones
  - Historial completo de conversaciones
  - Mejora en satisfacción del cliente

### Prioridad de negocio
🟡 **Medium (P2)** - Mejora significativa en workflow pero no crítico (puede usarse mailto: inicialmente)

---

## ✅ Criterios de Aceptación

### Admin Panel - Vista de Lista
- [ ] Página `/admin/contact` creada con lista de submissions
- [ ] Tabla muestra: nombre, email, asunto, estado, fecha
- [ ] Filtros: estado (pending/read/replied/archived), fecha
- [ ] Búsqueda por nombre, email, o mensaje
- [ ] Paginación (10 items por página)
- [ ] Click en fila abre modal de detalle
- [ ] Botón "Responder" en cada fila

### Modal de Detalle
- [ ] Muestra información completa del mensaje original:
  - Nombre y email del remitente
  - Asunto
  - Mensaje completo
  - Fecha de envío
  - Locale
  - IP address y user agent (metadata)
- [ ] Botón "Marcar como leído"
- [ ] Botón "Archivar"
- [ ] Botón "Responder" (abre editor)
- [ ] Historial de respuestas previas (si existen)

### Editor de Email
- [ ] Rich text editor (TipTap o similar)
- [ ] Funciones básicas: negrita, cursiva, listas, links
- [ ] Vista previa del email
- [ ] Campo "Para:" pre-llenado con email del remitente
- [ ] Campo "Asunto:" pre-llenado con "Re: {subject original}"
- [ ] Campo "De:" muestra `contacto@alkitu.com`
- [ ] Botón "Enviar respuesta"
- [ ] Botón "Cancelar"
- [ ] Loading state durante envío

### Envío de Email
- [ ] POST `/api/contact/[id]/reply` endpoint
- [ ] Validación Zod del contenido
- [ ] Sanitización HTML del contenido
- [ ] Envío mediante RESEND
- [ ] Error handling con mensajes claros
- [ ] Toast notification de éxito/error

### Base de Datos
- [ ] Tabla `contact_replies` creada:
  - id, submission_id (FK), admin_id (FK), content, sent_at
- [ ] Relación 1:N (submission → replies)
- [ ] RLS policies para admin access only
- [ ] Índices para búsquedas rápidas

### Estado de Submissions
- [ ] Actualiza `status` a "replied" después de envío
- [ ] Timestamp `replied_at` actualizado
- [ ] Admin que respondió guardado en `replied_by` (admin_id FK)

### Historial de Conversación
- [ ] Muestra todas las respuestas previas en orden cronológico
- [ ] Cada respuesta muestra: admin, fecha, contenido
- [ ] Permite ver thread completo de conversación

---

## 🔧 Especificaciones Técnicas

### Archivos a crear/modificar

```
supabase/migrations/
└── YYYYMMDDHHMMSS_create_contact_replies.sql

app/admin/contact/
├── page.tsx                     (nuevo - lista de submissions)
├── ContactList.tsx              (nuevo - tabla)
├── ContactDetail.tsx            (nuevo - modal detalle)
└── ReplyEditor.tsx              (nuevo - editor email)

app/api/contact/[id]/
├── reply/
│   └── route.ts                 (nuevo - enviar respuesta)
└── status/
    └── route.ts                 (nuevo - actualizar estado)

lib/
├── email-templates/
│   └── admin-reply.tsx          (nuevo - template de respuesta)
└── validations/
    └── contact-reply.ts         (nuevo - Zod schema)

app/dictionaries/
├── en.json                      (actualizar - traducciones admin)
└── es.json                      (actualizar - traducciones admin)
```

### Schema de Base de Datos

```sql
-- Migration: create_contact_replies.sql

-- Modificar tabla existente
ALTER TABLE contact_submissions
ADD COLUMN replied_at timestamptz,
ADD COLUMN replied_by uuid REFERENCES admin_users(id);

-- Nueva tabla para replies
CREATE TABLE contact_replies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id uuid NOT NULL REFERENCES contact_submissions(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES admin_users(id),
  content text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX contact_replies_submission_id_idx ON contact_replies(submission_id);
CREATE INDEX contact_replies_admin_id_idx ON contact_replies(admin_id);
CREATE INDEX contact_replies_sent_at_idx ON contact_replies(sent_at DESC);

-- RLS
ALTER TABLE contact_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_access_replies" ON contact_replies
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Function to auto-update status
CREATE OR REPLACE FUNCTION update_submission_status_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contact_submissions
  SET
    status = 'replied',
    replied_at = NEW.sent_at,
    replied_by = NEW.admin_id,
    updated_at = now()
  WHERE id = NEW.submission_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_submission_on_reply
  AFTER INSERT ON contact_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_submission_status_on_reply();
```

### Zod Validation

```typescript
// lib/validations/contact-reply.ts
import { z } from 'zod';

export const contactReplySchema = z.object({
  submissionId: z.string().uuid(),
  content: z
    .string()
    .min(10, 'Reply must be at least 10 characters')
    .max(10000, 'Reply too long'),
  subject: z.string().min(3).max(200),
});

export type ContactReply = z.infer<typeof contactReplySchema>;
```

### API Route - Send Reply

```typescript
// app/api/contact/[id]/reply/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, RESEND_CONFIG } from '@/lib/resend';
import { contactReplySchema } from '@/lib/validations/contact-reply';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import AdminReplyTemplate from '@/lib/email-templates/admin-reply';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return ApiError.unauthorized();
  }

  // Verify admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!adminUser) {
    return ApiError.forbidden();
  }

  // Parse and validate
  const body = await request.json();
  const result = contactReplySchema.safeParse({
    submissionId: id,
    ...body,
  });

  if (!result.success) {
    return ApiError.validationError(result.error);
  }

  // Get original submission
  const { data: submission } = await supabase
    .from('contact_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!submission) {
    return ApiError.notFound('Submission not found');
  }

  // Send email via RESEND
  try {
    await resend.emails.send({
      from: RESEND_CONFIG.fromEmail,
      to: submission.email,
      subject: result.data.subject,
      react: AdminReplyTemplate({
        recipientName: submission.name,
        content: result.data.content,
        originalSubject: submission.subject,
      }),
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    return ApiError.internalServerError('Failed to send email');
  }

  // Save reply to database
  const { data: reply, error: replyError } = await supabase
    .from('contact_replies')
    .insert({
      submission_id: id,
      admin_id: user.id,
      content: result.data.content,
    })
    .select()
    .single();

  if (replyError) {
    console.error('Failed to save reply:', replyError);
    return ApiError.internalServerError('Failed to save reply');
  }

  // Trigger updates submission status automatically
  return ApiSuccess.ok(reply, 'Reply sent successfully');
}
```

### Email Template - Admin Reply

```typescript
// lib/email-templates/admin-reply.tsx
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
} from '@react-email/components';

interface AdminReplyProps {
  recipientName: string;
  content: string;
  originalSubject: string;
}

export default function AdminReply({
  recipientName,
  content,
  originalSubject,
}: AdminReplyProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hola {recipientName},</Heading>

          <Text style={paragraph}>
            Gracias por contactarnos. En respuesta a tu consulta sobre:{' '}
            <strong>{originalSubject}</strong>
          </Text>

          <Hr style={hr} />

          <Section
            style={replyContent}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <Hr style={hr} />

          <Text style={footer}>
            Saludos,
            <br />
            Equipo Alkitu
            <br />
            <a href="https://alkitu.com" style={link}>
              alkitu.com
            </a>
          </Text>
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
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
};

const paragraph = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '0 0 16px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 40px',
};

const replyContent = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '20px 0',
};

const footer = {
  color: '#999',
  fontSize: '14px',
  padding: '0 40px',
  margin: '20px 0',
};

const link = {
  color: '#00BB31',
  textDecoration: 'none',
};
```

### Admin Panel Component

```typescript
// app/admin/contact/ContactList.tsx
'use client';

import { useState } from 'react';
import { ContactDetail } from './ContactDetail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  created_at: string;
  locale: string;
}

export function ContactList({ submissions }: { submissions: Submission[] }) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      read: 'secondary',
      replied: 'success',
      archived: 'outline',
    };

    return (
      <Badge variant={variants[status] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
            onClick={() => setSelectedSubmission(submission)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{submission.name}</h3>
                <p className="text-sm text-muted-foreground">{submission.email}</p>
              </div>
              {getStatusBadge(submission.status)}
            </div>

            <p className="text-sm font-medium mb-1">{submission.subject}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {submission.message}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                {new Date(submission.created_at).toLocaleDateString()}
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSubmission(submission);
                }}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <ContactDetail
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </>
  );
}
```

### Nuevas dependencias
- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - Editor presets
- Usar componentes existentes: shadcn/ui (Button, Badge, Dialog, etc.)

### Consideraciones
- **i18n**: Sí - interfaz admin en español, pero puede estar en un solo idioma
- **Analytics**: Sí - trackear tasa de respuesta, tiempo de respuesta
- **Database changes**: Sí - nueva tabla `contact_replies`
- **Security**: Validación estricta, sanitización HTML, RLS admin-only
- **UX**: Rich text editor con preview, confirmación antes de enviar

---

## 🎨 Diseño/Mockups

**Admin Contact List:**
- Tabla o cards estilo Gmail/Linear
- Filtros en sidebar (status, fecha)
- Búsqueda en header
- Badge de estado con colores

**Detail Modal:**
- Drawer desde la derecha (estilo Vercel dashboard)
- Sección superior: info del remitente
- Sección media: mensaje original
- Sección inferior: editor de respuesta
- Historial de replies abajo

**Rich Text Editor:**
- Toolbar simple (bold, italic, lists, links)
- Vista previa opcional
- Botones: Enviar (primary), Cancelar (secondary)

---

## 🔗 Tickets Relacionados

**Depende de:**
- #[PREV-1] - Base de datos para formularios de contacto
- #[PREV] - Integración RESEND para envío de emails

**Bloquea:**
- Ninguno

**Relacionado con:**
- Futuro: Sistema de templates de respuesta (snippets)
- Futuro: Auto-respuestas basadas en keywords

---

## ⏱️ Estimación

**Complejidad:** Alta
**Esfuerzo estimado:** 8-10 horas

**Desglose:**
- Database migration + schema: 1h
- API routes (reply, status update): 2h
- Admin UI components (list, detail, editor): 4-5h
- Email template admin reply: 1h
- Testing e2e workflow: 1-2h
- Documentación: 30min

---

## 📚 Recursos

- [TipTap Editor Documentation](https://tiptap.dev/docs)
- [shadcn/ui Dialog Component](https://ui.shadcn.com/docs/components/dialog)
- [RESEND React Email](https://resend.com/docs/send-with-react-email)
- Inspiración UI: Linear, Vercel Support, Help Scout

---

## ⚠️ Notas Importantes

1. **Rich Text Security**: Sanitizar HTML antes de guardar/enviar para prevenir XSS
2. **Email Deliverability**: Monitorear bounce rate y spam reports
3. **Thread History**: Considerar limitar replies visibles (últimos 10) para performance
4. **Attachments**: No incluido en MVP, considerar para v2
5. **Templates**: Considerar agregar templates de respuesta rápida en futuro
6. **Signatures**: Agregar firma automática del admin en emails
