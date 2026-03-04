---
name: error-handling-patterns
description: This skill should be used when implementing error handling, designing API routes, adding Zod validation, handling Supabase errors, building resilient Next.js API endpoints, or improving application reliability. Covers ApiSuccess/ApiError response helpers, Zod schemas with bilingual messages, rate limiting, and graceful degradation patterns specific to the Alkitu stack (Next.js 16, TypeScript, Supabase, Zod).
---

# Error Handling Patterns — Alkitu Stack

Implement robust error handling across the Alkitu codebase using the established patterns for Next.js 16 API routes, Supabase operations, Zod validation, and client-side error management.

## When to Use This Skill

- Implementing error handling in new API routes
- Adding Zod validation to request bodies or query params
- Handling Supabase database or auth errors
- Building rate-limited endpoints
- Creating client-side error handling with ApiClient
- Designing bilingual error messages (Spanish/English)
- Implementing graceful degradation for non-critical operations

## Core Architecture

### Response Flow

```
Client Request
  → Zod Validation (400/422)
  → Auth Check (401/403)
  → Rate Limit Check (429)
  → Business Logic
    → Supabase Query
      → Success → ApiSuccess.ok() / .created()
      → DB Error → ApiError.database()
  → Catch-all → ApiError.internal()
```

### Standardized Response Shape

All API responses follow this structure (defined in `lib/api/response.ts`):

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: ValidationError[] | Record<string, unknown>;
    timestamp?: string;
  };
  meta?: { timestamp: string; total?: number; page?: number; };
}
```

## API Route Pattern

### Standard API Route Template

```typescript
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';

const RequestSchema = z.object({
  email: z.string()
    .email('Formato de email inválido / Invalid email format')
    .toLowerCase()
    .trim(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate
    const body = await request.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return ApiError.validationError(result.error);
    }

    // 2. Auth check (if protected route)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return ApiError.unauthorized('No autenticado / Not authenticated');
    }

    // 3. Business logic
    const { data, error } = await supabase
      .from('table')
      .insert(result.data)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return ApiError.database('Error al guardar / Failed to save');
    }

    return ApiSuccess.created(data, 'Creado exitosamente / Created successfully');

  } catch (error) {
    console.error('Error in POST /api/route:', error);
    return ApiError.internal('Error interno / Internal error');
  }
}
```

## Success Responses (ApiSuccess)

```typescript
ApiSuccess.ok(data, 'message', meta?)         // 200
ApiSuccess.created(data, 'message')            // 201
ApiSuccess.accepted(data?, 'message')          // 202
ApiSuccess.noContent()                         // 204
```

## Error Responses (ApiError)

```typescript
ApiError.validationError(zodError)             // 422 - Zod error auto-formatted
ApiError.badRequest('message', details?)       // 400
ApiError.unauthorized('message')               // 401
ApiError.forbidden('message')                  // 403
ApiError.notFound('message')                   // 404
ApiError.conflict('message')                   // 409
ApiError.rateLimitExceeded('message', retry?)  // 429
ApiError.database('message', error?)           // 500
ApiError.internal('message', error?)           // 500
```

## Zod Validation Patterns

### Bilingual Error Messages

All Zod error messages include both Spanish and English:

```typescript
const Schema = z.object({
  email: z.string()
    .email('Formato de email inválido / Invalid email format')
    .min(5, 'El email debe tener al menos 5 caracteres / Email must be at least 5 characters')
    .toLowerCase()
    .trim(),
  locale: z.enum(['en', 'es'], {
    message: 'Idioma debe ser "en" o "es" / Language must be "en" or "es"',
  }),
  name: z.string()
    .min(2, 'Nombre muy corto / Name too short')
    .max(100, 'Nombre muy largo / Name too long')
    .trim(),
});
```

### Validation in API Routes

```typescript
const result = Schema.safeParse(body);
if (!result.success) {
  return ApiError.validationError(result.error);
  // Auto-formats Zod issues into readable field-level errors
}
// Use result.data (typed and transformed)
```

### Common Zod Transforms

```typescript
.toLowerCase()              // Normalize emails
.trim()                     // Remove whitespace
.transform(Number)          // String to number
.pipe(z.number().min(1))    // Chain validations
.optional().default('es')   // Optional with default
```

## Supabase Error Handling

### Database Operations

```typescript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('featured', true);

if (error) {
  console.error('Database error:', error);
  return ApiError.database('Error al consultar proyectos');
}

return ApiSuccess.ok(data);
```

### Auth Checks

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return ApiError.unauthorized();
}

// Admin check
const { data: adminUser } = await supabase
  .from('admin_users')
  .select('*')
  .eq('id', user.id)
  .single();

if (!adminUser) {
  return ApiError.forbidden('No tiene permisos de administrador');
}
```

### Handling Unique Constraint Violations

```typescript
const { error } = await supabase
  .from('newsletter_subscribers')
  .insert({ email: result.data.email });

if (error) {
  if (error.code === '23505') { // Unique violation
    return ApiError.conflict('Este email ya está registrado / Email already registered');
  }
  return ApiError.database('Error al guardar');
}
```

## Rate Limiting Pattern

```typescript
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = checkRateLimit(ip, { maxRequests: 5, windowMs: 60000 });

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Demasiadas solicitudes' },
      }),
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': rateLimit.resetAt.toISOString(),
          'Retry-After': String(rateLimit.retryAfter),
        },
      },
    );
  }
  // ... continue with request
}
```

## Client-Side Error Handling (ApiClient)

The `ApiClient` class in `lib/api/client.ts` provides automatic error handling with toast notifications:

```typescript
import { apiClient } from '@/lib/api/client';

// Auto-shows error toast on failure
const data = await apiClient.get<Project[]>('/api/admin/projects');

// Silent mode (no toasts)
const data = await apiClient.getSilent<Project[]>('/api/admin/projects');

// Custom success message
const data = await apiClient.postWithMessage<Project>(
  '/api/admin/projects',
  projectData,
  'Proyecto creado exitosamente'
);
```

Catches `ApiClientError` with `code`, `status`, and `details` properties for granular handling.

## Non-Fatal Error Pattern

For operations where failure should not block the main response (e.g., email sending):

```typescript
// Database insert (critical - fail the request)
const { data, error } = await supabase.from('contacts').insert(contactData).select().single();
if (error) {
  return ApiError.database('Error al guardar el mensaje');
}

// Email sending (non-critical - log and continue)
try {
  await sendEmail(contactData);
} catch (emailError) {
  console.error('Email sending failed:', emailError);
  // Do NOT return an error - the data was saved successfully
}

return ApiSuccess.created(data, 'Mensaje enviado exitosamente');
```

## Error Logging Convention

```typescript
// Always include descriptive context
console.error('Database error:', error);
console.error('Error in POST /api/admin/projects:', error);
console.error('Email sending failed:', emailError);

// Never log sensitive data (passwords, tokens, PII)
// Never log the full request body in production
```

## Best Practices

1. **Validate early** — Run Zod validation as the first operation in every API route
2. **Bilingual messages** — Include both Spanish and English in error strings: `'Mensaje / Message'`
3. **Use ApiSuccess/ApiError** — Always use the standardized response helpers from `lib/api/response.ts`
4. **Log before returning** — `console.error()` before every `ApiError.database()` or `ApiError.internal()`
5. **Catch-all wrapper** — Every API route must have a top-level try-catch returning `ApiError.internal()`
6. **Non-fatal errors** — Email sending and analytics should never fail the main request
7. **Typed Supabase results** — Always check `if (error)` after Supabase operations
8. **Transform inputs** — Use `.toLowerCase().trim()` on emails and text inputs in Zod schemas

## Error Code Reference

| Code | Status | When to Use |
|------|--------|-------------|
| `VALIDATION_ERROR` | 422 | Zod validation failure |
| `INVALID_INPUT` | 400 | Malformed request body |
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Not an admin user |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Duplicate entry (unique constraint) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `DATABASE_ERROR` | 500 | Supabase query failure |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Additional Resources

### Reference Files

For detailed patterns and examples, consult:
- **`references/api-response-patterns.md`** — Complete ApiSuccess/ApiError API with all methods and parameters
- **`references/zod-validation-patterns.md`** — Advanced Zod schemas, transforms, and bilingual message conventions
