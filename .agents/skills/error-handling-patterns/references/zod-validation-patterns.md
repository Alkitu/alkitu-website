# Zod Validation Patterns — Alkitu Stack

Comprehensive reference for Zod schema patterns used across the Alkitu codebase.

## Core Conventions

### Bilingual Error Messages

All Zod error messages include both Spanish and English separated by ` / `:

```typescript
z.string().email('Formato de email inválido / Invalid email format')
z.string().min(2, 'Muy corto / Too short')
z.enum(['en', 'es'], { message: 'Debe ser "en" o "es" / Must be "en" or "es"' })
```

### Input Normalization

Always normalize string inputs:

```typescript
z.string().toLowerCase().trim()  // For emails
z.string().trim()                // For names, messages
```

---

## Common Schema Patterns

### Email Field

```typescript
email: z.string()
  .email('Formato de email inválido / Invalid email format')
  .min(5, 'El email debe tener al menos 5 caracteres / Email must be at least 5 characters')
  .max(255, 'El email es muy largo / Email is too long')
  .toLowerCase()
  .trim()
```

### Name Field

```typescript
name: z.string()
  .min(2, 'El nombre debe tener al menos 2 caracteres / Name must be at least 2 characters')
  .max(100, 'El nombre es muy largo / Name is too long')
  .trim()
```

### Locale Field

```typescript
locale: z.enum(['en', 'es'], {
  message: 'Idioma debe ser "en" o "es" / Language must be "en" or "es"',
})
```

### Optional with Default

```typescript
status: z.enum(['active', 'inactive']).optional().default('active')
locale: z.enum(['en', 'es']).optional().default('es')
page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1))
```

### UUID Field

```typescript
id: z.string().uuid('ID inválido / Invalid ID')
```

### URL Field

```typescript
url: z.string()
  .url('URL inválida / Invalid URL')
  .optional()
```

### Text Area / Message

```typescript
message: z.string()
  .min(10, 'El mensaje debe tener al menos 10 caracteres / Message must be at least 10 characters')
  .max(5000, 'El mensaje es muy largo / Message is too long')
  .trim()
```

### Boolean from String

```typescript
featured: z.string()
  .optional()
  .transform(val => val === 'true')
```

### Number from Query String

```typescript
page: z.string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1, 'Página debe ser al menos 1 / Page must be at least 1'))

limit: z.string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(1).max(100))
```

### Tags Array

```typescript
tags: z.array(z.string().trim()).optional().default([])
```

### JSONB Content (Bilingual)

```typescript
content: z.object({
  en: z.object({
    title: z.string().min(1, 'Title required'),
    description: z.string().min(1, 'Description required'),
    features: z.array(z.string()).optional().default([]),
    technologies: z.array(z.string()).optional().default([]),
  }),
  es: z.object({
    title: z.string().min(1, 'Título requerido'),
    description: z.string().min(1, 'Descripción requerida'),
    features: z.array(z.string()).optional().default([]),
    technologies: z.array(z.string()).optional().default([]),
  }),
})
```

---

## Validation in API Routes

### POST/PUT — Body Validation

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = CreateSchema.safeParse(body);

    if (!result.success) {
      return ApiError.validationError(result.error);
    }

    // result.data is typed and transformed
    const { email, name, locale } = result.data;
    // ...
  } catch (error) {
    console.error('Error:', error);
    return ApiError.internal();
  }
}
```

### GET — Query Parameter Validation

```typescript
const QuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().optional().default('10').transform(Number).pipe(z.number().min(1).max(100)),
  status: z.enum(['active', 'inactive', 'all']).optional().default('all'),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = QuerySchema.safeParse(searchParams);

  if (!result.success) {
    return ApiError.validationError(result.error);
  }

  const { page, limit, status, search } = result.data;
  // ...
}
```

### Dynamic Route Params

```typescript
const ParamSchema = z.object({
  id: z.string().uuid('ID inválido / Invalid ID'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = ParamSchema.safeParse({ id });

  if (!result.success) {
    return ApiError.validationError(result.error);
  }
  // ...
}
```

---

## Schema Organization

### File Location

Store schemas in `lib/schemas/`:

```
lib/schemas/
├── newsletter.ts      # Newsletter-related schemas
├── billing.ts         # Billing schemas
├── stripe.ts          # Stripe-specific schemas
└── contact.ts         # Contact form schemas (if needed)
```

### Schema Naming Convention

```typescript
// Create operation
export const CreateProjectSchema = z.object({ ... });

// Update operation (partial)
export const UpdateProjectSchema = CreateProjectSchema.partial();

// Query parameters
export const ProjectQuerySchema = z.object({ ... });

// Specific operation
export const SubscribeNewsletterSchema = z.object({ ... });
export const UnsubscribeNewsletterSchema = z.object({ ... });
```

### Export Pattern

```typescript
// lib/schemas/newsletter.ts
import { z } from 'zod';

export const SubscribeSchema = z.object({
  email: z.string().email('...').toLowerCase().trim(),
  name: z.string().min(2, '...').trim().optional(),
  locale: z.enum(['en', 'es']).optional().default('es'),
});

export type SubscribeInput = z.infer<typeof SubscribeSchema>;
// Use z.infer for derived types
```

---

## Advanced Patterns

### Conditional Validation

```typescript
const Schema = z.object({
  type: z.enum(['individual', 'company']),
  companyName: z.string().optional(),
}).refine(
  (data) => data.type !== 'company' || data.companyName,
  {
    message: 'Nombre de empresa requerido / Company name required',
    path: ['companyName'],
  }
);
```

### Discriminated Unions

```typescript
const EventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('subscription'),
    email: z.string().email(),
    plan: z.enum(['free', 'pro']),
  }),
  z.object({
    type: z.literal('cancellation'),
    reason: z.string().min(10),
  }),
]);
```

### Reusable Field Schemas

```typescript
// Reuse across multiple schemas
const emailField = z.string()
  .email('Formato de email inválido / Invalid email format')
  .toLowerCase()
  .trim();

const localeField = z.enum(['en', 'es'], {
  message: 'Idioma inválido / Invalid language',
}).optional().default('es');

// Use in schemas
const ContactSchema = z.object({
  email: emailField,
  locale: localeField,
  message: z.string().min(10).trim(),
});

const NewsletterSchema = z.object({
  email: emailField,
  locale: localeField,
  name: z.string().optional(),
});
```

### Supabase-Compatible Date Handling

```typescript
const dateField = z.string()
  .datetime({ message: 'Fecha inválida / Invalid date' })
  .optional();

// Or transform to Date
const dateTransform = z.string()
  .datetime()
  .transform(val => new Date(val));
```

---

## Error Message Guidelines

### Format

```
'Spanish message / English message'
```

### Tone

- Descriptive, not accusatory
- Explain what's expected, not just what's wrong
- Keep both languages roughly the same length

### Examples

```typescript
// Good
'El email debe tener al menos 5 caracteres / Email must be at least 5 characters'
'Formato de email inválido / Invalid email format'
'Este campo es requerido / This field is required'

// Bad - too vague
'Error / Error'
'Inválido / Invalid'

// Bad - accusatory
'Ingresaste mal el email / You entered the email wrong'
```
