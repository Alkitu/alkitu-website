# 🚀 Feature Request: Base de Datos para Formularios de Contacto

**Labels:** `feature`, `P1`, `database`, `contact-form`

---

## 📖 User Story

**Como** visitante del sitio web
**Quiero** que mis mensajes de contacto se almacenen de forma segura
**Para** que el equipo de Alkitu pueda revisar y responder a mis consultas

**Escenario:** Usuario envía formulario de contacto
**Dado que** estoy en la página de contacto (`/{locale}/contact`)
**Cuando** relleno el formulario con nombre, email, asunto y mensaje
**Y** hago clic en "Enviar"
**Entonces** mi mensaje se almacena en la base de datos
**Y** recibo confirmación visual de que fue enviado exitosamente

---

## 🎯 Contexto de Producto

### Problema que resuelve
- Actualmente no hay forma de almacenar consultas de potenciales clientes
- Los mensajes de contacto se pierden o requieren configuración externa de email
- No hay trazabilidad de las consultas recibidas

### Impacto esperado
- **Usuarios afectados**: Todos los visitantes que quieran contactar
- **Métricas**:
  - Tasa de conversión de contacto (esperado: 2-5% de visitantes)
  - Tiempo de respuesta a consultas
  - Cantidad de leads generados

### Prioridad de negocio
🟠 **High (P1)** - Feature esencial para generar leads y oportunidades de negocio

---

## ✅ Criterios de Aceptación

### Base de Datos
- [ ] Tabla `contact_submissions` creada en Supabase con schema completo
- [ ] Campos: id, name, email, subject, message, locale, status, created_at, updated_at
- [ ] Row Level Security (RLS) configurado correctamente
- [ ] Policies: anon puede INSERT, solo admin puede SELECT/UPDATE
- [ ] Índices creados para búsquedas por email, status, created_at

### API
- [ ] POST `/api/contact/submit` endpoint creado
- [ ] Validación Zod para todos los campos
- [ ] Rate limiting implementado (max 3 envíos por IP/hora)
- [ ] Sanitización de inputs contra XSS/SQL injection
- [ ] Respuestas estandarizadas (ApiSuccess/ApiError)

### Frontend
- [ ] Formulario de contacto en `/{locale}/contact` con campos:
  - Nombre (text, required)
  - Email (email, required, validación formato)
  - Asunto (text, required)
  - Mensaje (textarea, required, min 10 caracteres)
- [ ] Validación client-side con feedback visual
- [ ] Loading state durante envío
- [ ] Toast notification de éxito/error (Sonner)
- [ ] Form reset después de envío exitoso

### Internacionalización
- [ ] Traducciones en `en.json` y `es.json`:
  - Labels de formulario
  - Placeholders
  - Mensajes de validación
  - Mensajes de éxito/error

### Testing
- [ ] Envío exitoso funciona en ambos locales
- [ ] Validaciones muestran errores apropiados
- [ ] Rate limiting funciona correctamente
- [ ] Datos se almacenan correctamente en Supabase
- [ ] Admin puede ver submissions en dashboard

---

## 🔧 Especificaciones Técnicas

### Archivos a crear

```
supabase/migrations/
└── YYYYMMDDHHMMSS_create_contact_submissions.sql

app/api/contact/
└── submit/
    └── route.ts

app/[lang]/contact/
├── page.tsx
└── ContactForm.tsx (client component)

app/dictionaries/
├── en.json (actualizar)
└── es.json (actualizar)

lib/validations/
└── contact.ts (Zod schema)
```

### Schema de Base de Datos

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  locale text NOT NULL DEFAULT 'es',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  user_agent text,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX contact_submissions_status_idx ON contact_submissions(status);
CREATE INDEX contact_submissions_email_idx ON contact_submissions(email);
CREATE INDEX contact_submissions_created_at_idx ON contact_submissions(created_at DESC);

-- RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anon_insert_contact" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admin_select_contact" ON contact_submissions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "admin_update_contact" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

### Zod Validation Schema

```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const contactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').max(255),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  locale: z.enum(['en', 'es']),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
```

### API Route Example

```typescript
// app/api/contact/submit/route.ts
import { NextRequest } from 'next/server';
import { createAnalyticsClient } from '@/lib/supabase/analytics';
import { contactSubmissionSchema } from '@/lib/validations/contact';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const limited = await rateLimit(ip, 3, 3600); // 3 per hour
  if (limited) {
    return ApiError.tooManyRequests('Too many submissions. Please try again later.');
  }

  // Parse and validate
  const body = await request.json();
  const result = contactSubmissionSchema.safeParse(body);

  if (!result.success) {
    return ApiError.validationError(result.error);
  }

  // Insert to database
  const supabase = createAnalyticsClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      ...result.data,
      user_agent: request.headers.get('user-agent'),
      ip_address: ip,
    })
    .select()
    .single();

  if (error) {
    console.error('Contact submission error:', error);
    return ApiError.internalServerError('Failed to submit contact form');
  }

  return ApiSuccess.created(data, 'Message sent successfully');
}
```

### Nuevas dependencias
- None (usa stack existente)

### Consideraciones
- **i18n**: Sí - formulario completo bilingüe
- **Analytics**: Sí - trackear envíos exitosos
- **Database changes**: Sí - nueva tabla `contact_submissions`
- **Rate limiting**: Sí - prevenir spam (3 envíos/hora por IP)
- **Security**: Sanitización de inputs, RLS policies, validación Zod

---

## 🎨 Diseño/Mockups

**Diseño de formulario:**
- Layout limpio con campos apilados verticalmente
- Spacing consistente (Tailwind spacing scale)
- Estados visuales claros:
  - Default
  - Focus (border primary color)
  - Error (border red, mensaje de error debajo)
  - Loading (botón deshabilitado, spinner)
  - Success (toast notification)

**Inspiración UI:**
- Similar a shadcn/ui Form components
- Usar componentes existentes del proyecto (Input, Textarea, Button)

---

## 🔗 Tickets Relacionados

**Depende de:**
- Ninguno

**Bloquea:**
- #[NEXT] - Integrar RESEND para envío de emails
- #[NEXT+1] - Admin panel para gestionar submissions

**Relacionado con:**
- Documentación: `docs/CONTACT_FORM.md` (crear después)

---

## ⏱️ Estimación

**Complejidad:** Media
**Esfuerzo estimado:** 6-8 horas

**Desglose:**
- Database migration + schema: 1h
- API route con validación: 2h
- Frontend form component: 2-3h
- i18n translations: 30min
- Testing manual: 1-2h
- Documentación: 30min
