# API Response Patterns — Complete Reference

Detailed reference for `ApiSuccess` and `ApiError` classes defined in `lib/api/response.ts`.

## Response Structure

All API responses share a consistent shape:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiErrorBody;
  meta?: ApiMeta;
}

interface ApiErrorBody {
  code: string;       // Machine-readable error code
  message: string;    // Human-readable description (bilingual)
  details?: ValidationError[] | Record<string, unknown>;
  timestamp?: string; // ISO 8601
  path?: string;      // Request path (optional)
}

interface ApiMeta {
  timestamp: string;
  total?: number;     // For paginated responses
  page?: number;
  limit?: number;
}

interface ValidationError {
  field: string;      // Dot-notation field path
  message: string;    // Bilingual error message
}
```

## ApiSuccess Methods

### `ApiSuccess.ok<T>(data, message?, meta?)`

**Status**: 200 OK

```typescript
// Basic
return ApiSuccess.ok(projects);

// With message
return ApiSuccess.ok(projects, 'Proyectos obtenidos / Projects retrieved');

// With pagination meta
return ApiSuccess.ok(projects, 'OK', {
  total: 42,
  page: 1,
  limit: 10,
});
```

### `ApiSuccess.created<T>(data, message?)`

**Status**: 201 Created

```typescript
return ApiSuccess.created(newProject, 'Proyecto creado / Project created');
```

Use after successful INSERT operations.

### `ApiSuccess.accepted<T>(data?, message?)`

**Status**: 202 Accepted

```typescript
return ApiSuccess.accepted(null, 'Solicitud recibida / Request accepted');
```

Use for async operations where processing happens later.

### `ApiSuccess.noContent()`

**Status**: 204 No Content

```typescript
return ApiSuccess.noContent();
```

Use after successful DELETE operations.

---

## ApiError Methods

### `ApiError.validationError(zodError | errors[], message?)`

**Status**: 422 Unprocessable Entity

Accepts either a Zod error object or a manual array of validation errors:

```typescript
// From Zod safeParse
const result = Schema.safeParse(body);
if (!result.success) {
  return ApiError.validationError(result.error);
}

// Manual validation errors
return ApiError.validationError([
  { field: 'email', message: 'Email ya registrado / Email already registered' },
  { field: 'name', message: 'Nombre requerido / Name required' },
]);
```

**Zod Auto-Formatting**: Automatically transforms Zod issues into `{ field, message }` pairs using the field path and issue message.

### `ApiError.badRequest(message, details?, code?)`

**Status**: 400 Bad Request

```typescript
return ApiError.badRequest('Cuerpo de solicitud inválido / Invalid request body');

// With details
return ApiError.badRequest('Parámetros faltantes', {
  missing: ['page', 'limit'],
});

// With custom code
return ApiError.badRequest('ID inválido', undefined, 'INVALID_ID');
```

### `ApiError.unauthorized(message?, code?)`

**Status**: 401 Unauthorized

```typescript
return ApiError.unauthorized();
// Default: "No autorizado / Unauthorized"

return ApiError.unauthorized('Sesión expirada / Session expired', 'TOKEN_EXPIRED');
```

### `ApiError.forbidden(message?, code?)`

**Status**: 403 Forbidden

```typescript
return ApiError.forbidden('No tiene permisos de administrador / Not an admin');
```

### `ApiError.notFound(message?, code?)`

**Status**: 404 Not Found

```typescript
return ApiError.notFound('Proyecto no encontrado / Project not found');
```

### `ApiError.conflict(message?, code?)`

**Status**: 409 Conflict

```typescript
return ApiError.conflict('Este email ya está registrado / Email already registered');
```

Use for unique constraint violations (Supabase error code `23505`).

### `ApiError.rateLimitExceeded(message?, retryAfter?)`

**Status**: 429 Too Many Requests

```typescript
return ApiError.rateLimitExceeded(
  'Demasiadas solicitudes / Too many requests',
  60 // seconds until retry
);
```

### `ApiError.database(message?, error?)`

**Status**: 500 Internal Server Error (code: `DATABASE_ERROR`)

```typescript
console.error('Database error:', error);
return ApiError.database('Error al consultar la base de datos');
```

Always `console.error` before calling this method.

### `ApiError.internal(message?, error?, code?)`

**Status**: 500 Internal Server Error

```typescript
console.error('Unexpected error:', error);
return ApiError.internal('Error interno del servidor');
```

Use in catch-all blocks. Never expose the original error message to the client.

---

## Client-Side: ApiClient

The `ApiClient` class (`lib/api/client.ts`) wraps `fetch` with automatic error handling:

### Standard Methods

```typescript
// GET - auto-shows error toast on failure
const projects = await apiClient.get<Project[]>('/api/admin/projects');

// POST
const newProject = await apiClient.post<Project>('/api/admin/projects', data);

// PUT
const updated = await apiClient.put<Project>(`/api/admin/projects/${id}`, data);

// PATCH
const patched = await apiClient.patch<Project>(`/api/admin/projects/${id}`, partial);

// DELETE
await apiClient.delete(`/api/admin/projects/${id}`);
```

### Silent Methods (No Toast)

```typescript
const data = await apiClient.getSilent<Project[]>('/api/admin/projects');
```

### Methods with Custom Success Message

```typescript
const data = await apiClient.postWithMessage<Project>(
  '/api/admin/projects',
  projectData,
  'Proyecto creado exitosamente'
);

await apiClient.deleteWithMessage(
  `/api/admin/projects/${id}`,
  'Proyecto eliminado'
);
```

### Error Handling in Components

```typescript
try {
  const data = await apiClient.post<Project>('/api/admin/projects', formData);
  // Success - toast already shown by ApiClient
} catch (error) {
  if (error instanceof ApiClientError) {
    if (error.status === 422) {
      // Validation errors - toasts already shown per field
    } else if (error.status === 409) {
      // Conflict - handle duplicate
    }
  }
  // Generic errors already handled by ApiClient with toast
}
```

---

## HTTP Headers for Rate Limiting

When implementing rate limiting, include these standard headers:

```typescript
const headers = {
  'X-RateLimit-Limit': String(limit),           // Max requests in window
  'X-RateLimit-Remaining': String(remaining),    // Requests left
  'X-RateLimit-Reset': resetAt.toISOString(),    // Window reset time
  'Retry-After': String(retryAfterSeconds),      // Seconds to wait (HTTP standard)
};
```

## CORS Headers (Public Endpoints)

For public-facing endpoints (newsletter, contact):

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
```

---

## Error Code Quick Reference

| Code | Status | Usage |
|------|--------|-------|
| `VALIDATION_ERROR` | 422 | Zod validation failure |
| `INVALID_INPUT` | 400 | Malformed request |
| `MISSING_FIELD` | 400 | Required field missing |
| `UNAUTHORIZED` | 401 | No session / invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `TOKEN_EXPIRED` | 401 | Session expired |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `ALREADY_EXISTS` | 409 | Duplicate resource |
| `CONFLICT` | 409 | State conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `DATABASE_ERROR` | 500 | Supabase query failure |
| `EXTERNAL_SERVICE_ERROR` | 500 | Third-party API failure |
