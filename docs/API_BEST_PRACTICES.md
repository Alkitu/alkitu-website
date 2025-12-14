# API Best Practices & Standards

This document outlines the standardized approach for building RESTful APIs in this project, including response formats, error handling, and client-side integration with toast notifications.

## Table of Contents

1. [Response Format Standards](#response-format-standards)
2. [HTTP Status Codes](#http-status-codes)
3. [Error Codes](#error-codes)
4. [Server-Side API Routes](#server-side-api-routes)
5. [Client-Side API Client](#client-side-api-client)
6. [Toast Notifications with Sonner](#toast-notifications-with-sonner)
7. [Examples](#examples)
8. [Migration Guide](#migration-guide)

---

## Response Format Standards

All API responses follow a standardized structure defined in `lib/api/response.ts`.

### Success Response Format

```typescript
{
  "success": true,
  "message": "Optional success message",
  "data": { /* Response payload */ },
  "meta": {
    "timestamp": "2025-01-15T10:30:00.000Z",
    "page": 1,          // For paginated responses
    "limit": 20,        // For paginated responses
    "total": 100,       // For paginated responses
    "hasMore": true,    // For paginated responses
    "requestId": "uuid" // Optional request tracking
  }
}
```

### Error Response Format

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [  // Optional, for validation errors
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "invalid_string"
      }
    ],
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

---

## HTTP Status Codes

### Success Codes (2xx)

| Code | Constant | Usage | Helper Method |
|------|----------|-------|---------------|
| 200 | `HttpStatus.OK` | Standard success response | `ApiSuccess.ok()` |
| 201 | `HttpStatus.CREATED` | Resource created successfully | `ApiSuccess.created()` |
| 202 | `HttpStatus.ACCEPTED` | Request accepted for processing | `ApiSuccess.accepted()` |
| 204 | `HttpStatus.NO_CONTENT` | Success with no response body | `ApiSuccess.noContent()` |

### Client Error Codes (4xx)

| Code | Constant | Usage | Helper Method |
|------|----------|-------|---------------|
| 400 | `HttpStatus.BAD_REQUEST` | Generic client error | `ApiError.badRequest()` |
| 401 | `HttpStatus.UNAUTHORIZED` | Authentication required | `ApiError.unauthorized()` |
| 403 | `HttpStatus.FORBIDDEN` | Insufficient permissions | `ApiError.forbidden()` |
| 404 | `HttpStatus.NOT_FOUND` | Resource not found | `ApiError.notFound()` |
| 409 | `HttpStatus.CONFLICT` | Resource conflict | `ApiError.conflict()` |
| 422 | `HttpStatus.UNPROCESSABLE_ENTITY` | Validation errors | `ApiError.validationError()` |
| 429 | `HttpStatus.TOO_MANY_REQUESTS` | Rate limit exceeded | `ApiError.rateLimitExceeded()` |

### Server Error Codes (5xx)

| Code | Constant | Usage | Helper Method |
|------|----------|-------|---------------|
| 500 | `HttpStatus.INTERNAL_SERVER_ERROR` | Generic server error | `ApiError.internal()` |
| 500 | `HttpStatus.INTERNAL_SERVER_ERROR` | Database error | `ApiError.database()` |

---

## Error Codes

Standardized error codes defined in `ErrorCode` constant:

### Validation Errors
- `VALIDATION_ERROR` - General validation failure
- `INVALID_INPUT` - Invalid input format
- `MISSING_FIELD` - Required field missing

### Authentication & Authorization
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `TOKEN_EXPIRED` - Authentication token expired
- `INVALID_CREDENTIALS` - Invalid login credentials

### Resource Errors
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Resource already exists
- `CONFLICT` - Resource state conflict

### Server Errors
- `INTERNAL_ERROR` - Generic server error
- `DATABASE_ERROR` - Database operation failed
- `EXTERNAL_SERVICE_ERROR` - Third-party service failed

### Rate Limiting
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## Server-Side API Routes

### Basic Structure

```typescript
// app/api/example/route.ts
import { NextRequest } from 'next/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { z } from 'zod';

// Define request schema
const RequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = RequestSchema.safeParse(body);
    if (!validation.success) {
      return ApiError.validationError(validation.error);
    }

    const { name, email } = validation.data;

    // Process request
    const result = await createUser(name, email);

    // Return success
    return ApiSuccess.created(
      { user: result },
      'User created successfully'
    );
  } catch (error) {
    return ApiError.internal('Failed to create user', error);
  }
}
```

### Response Helper Usage

#### Success Responses

```typescript
// 200 OK - Standard success
return ApiSuccess.ok({ users }, 'Users fetched successfully');

// 201 Created - Resource created
return ApiSuccess.created({ user }, 'User created successfully');

// 204 No Content - Success with no body
return ApiSuccess.noContent();

// 202 Accepted - Async processing
return ApiSuccess.accepted({ jobId }, 'Request queued for processing');
```

#### Error Responses

```typescript
// 422 Validation Error (with Zod)
const validation = schema.safeParse(body);
if (!validation.success) {
  return ApiError.validationError(validation.error);
}

// 400 Bad Request
return ApiError.badRequest('Invalid request format');

// 401 Unauthorized
return ApiError.unauthorized('Please log in to continue');

// 403 Forbidden
return ApiError.forbidden('You do not have permission to access this resource');

// 404 Not Found
return ApiError.notFound('User not found');

// 409 Conflict
return ApiError.conflict('Email already registered');

// 429 Rate Limit
return ApiError.rateLimitExceeded('Too many requests', 60); // Retry after 60s

// 500 Internal Server Error
return ApiError.internal('An unexpected error occurred', error);

// 500 Database Error
return ApiError.database('Failed to save to database', error);
```

### Complete Example: CRUD Resource

```typescript
// app/api/posts/route.ts
import { NextRequest } from 'next/server';
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  published: z.boolean().optional().default(false),
});

// GET /api/posts - List posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const posts = await db.posts.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.posts.count();

    return ApiSuccess.ok(
      { posts },
      undefined,
      {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      }
    );
  } catch (error) {
    return ApiError.database('Failed to fetch posts', error);
  }
}

// POST /api/posts - Create post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validation = PostSchema.safeParse(body);
    if (!validation.success) {
      return ApiError.validationError(validation.error);
    }

    // Check for duplicate
    const existing = await db.posts.findUnique({
      where: { title: validation.data.title },
    });

    if (existing) {
      return ApiError.conflict('Post with this title already exists');
    }

    // Create
    const post = await db.posts.create({
      data: validation.data,
    });

    return ApiSuccess.created({ post }, 'Post created successfully');
  } catch (error) {
    return ApiError.internal('Failed to create post', error);
  }
}

// PATCH /api/posts/[id] - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate ID
    const idValidation = z.string().uuid().safeParse(id);
    if (!idValidation.success) {
      return ApiError.badRequest('Invalid post ID format');
    }

    // Validate body
    const validation = PostSchema.partial().safeParse(body);
    if (!validation.success) {
      return ApiError.validationError(validation.error);
    }

    // Update
    const post = await db.posts.update({
      where: { id },
      data: validation.data,
    });

    if (!post) {
      return ApiError.notFound('Post not found');
    }

    return ApiSuccess.ok({ post }, 'Post updated successfully');
  } catch (error) {
    if (error.code === 'P2025') { // Prisma not found error
      return ApiError.notFound('Post not found');
    }
    return ApiError.database('Failed to update post', error);
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.posts.delete({
      where: { id },
    });

    return ApiSuccess.noContent();
  } catch (error) {
    if (error.code === 'P2025') {
      return ApiError.notFound('Post not found');
    }
    return ApiError.database('Failed to delete post', error);
  }
}
```

---

## Client-Side API Client

### Using the API Client

The API client (`lib/api/client.ts`) provides type-safe methods with automatic error handling and toast notifications.

```typescript
import { api, apiClient } from '@/lib/api/client';

// Basic GET request
const users = await api.get<User[]>('/api/users');

// POST with body
const newUser = await api.post<User, CreateUserDto>(
  '/api/users',
  { name: 'John', email: 'john@example.com' }
);

// PATCH with custom message
const updatedUser = await api.patch<User>(
  '/api/users/123',
  { name: 'Jane' },
  { successMessage: 'Profile updated!' }
);

// DELETE
await api.delete('/api/users/123', {
  successMessage: 'User deleted successfully'
});

// Silent request (no toasts)
const data = await api.get('/api/data', { showToasts: false });
```

### Convenience Methods

```typescript
// GET without toasts (for background operations)
const posts = await apiClient.getSilent<Post[]>('/api/posts');

// POST with custom success message
const post = await apiClient.postWithMessage<Post>(
  '/api/posts',
  { title: 'New Post' },
  'Post created! 🎉'
);

// DELETE with confirmation message
await apiClient.deleteWithMessage('/api/posts/123', 'Post deleted');
```

### Error Handling

```typescript
import { ApiClientError } from '@/lib/api/client';

try {
  const user = await api.post('/api/users', userData);
} catch (error) {
  if (error instanceof ApiClientError) {
    // Access error details
    console.log(error.message);  // Human-readable message
    console.log(error.code);     // Error code
    console.log(error.status);   // HTTP status
    console.log(error.details);  // Validation errors (if any)
  }
}
```

---

## Toast Notifications with Sonner

The project uses [Sonner](https://sonner.emilkowal.ski/) for toast notifications, configured in `app/components/ui/toaster.tsx`.

### Basic Usage

```typescript
import { toast } from 'sonner';

// Success toast
toast.success('Operation completed successfully');

// Error toast
toast.error('Something went wrong');

// Info toast
toast.info('New update available');

// Warning toast
toast.warning('Please review your changes');

// Loading toast
const toastId = toast.loading('Processing...');
// Later: dismiss or update it
toast.success('Done!', { id: toastId });
```

### Advanced Usage

```typescript
// Toast with action button
toast('Event created', {
  action: {
    label: 'View',
    onClick: () => router.push('/events/123'),
  },
});

// Toast with description
toast.success('Post published', {
  description: 'Your post is now visible to all users',
});

// Custom duration
toast.success('Quick message', {
  duration: 2000, // 2 seconds
});

// Promise-based toast
toast.promise(
  fetchData(),
  {
    loading: 'Loading data...',
    success: 'Data loaded successfully',
    error: 'Failed to load data',
  }
);
```

### Theme Integration

The Toaster component automatically follows the app's theme (light/dark mode):

```tsx
// app/components/ui/toaster.tsx
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="bottom-right"
      theme={resolvedTheme}
      richColors
      closeButton
      duration={4000}
    />
  );
}
```

---

## Examples

### Example 1: Form Submission with Validation

```tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

export function CreatePostForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
    };

    try {
      const post = await api.post('/api/posts', data, {
        successMessage: 'Post created successfully! 🎉',
      });

      // Redirect or update UI
      router.push(`/posts/${post.id}`);
    } catch (error) {
      // Error is automatically shown via toast
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### Example 2: Data Fetching with Error Handling

```tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';

export function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Silent request (no success toast)
        const data = await api.get<Post[]>('/api/posts', {
          showToasts: false,
        });
        setPosts(data);
      } catch (error) {
        // Error toast is shown automatically
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Example 3: Delete with Confirmation

```tsx
'use client';

import { api } from '@/lib/api/client';
import { toast } from 'sonner';

export function DeleteButton({ postId }: { postId: string }) {
  async function handleDelete() {
    // Show confirmation toast
    toast('Delete this post?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await api.delete(`/api/posts/${postId}`, {
              successMessage: 'Post deleted successfully',
            });
            router.refresh();
          } catch (error) {
            // Error toast shown automatically
          }
        },
      },
      cancel: {
        label: 'Cancel',
      },
    });
  }

  return (
    <button onClick={handleDelete} className="text-red-600">
      Delete
    </button>
  );
}
```

### Example 4: Optimistic Updates

```tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';

export function LikeButton({ postId, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    // Optimistic update
    setLikes((prev) => prev + 1);
    setLiked(true);

    try {
      await api.post(
        `/api/posts/${postId}/like`,
        {},
        { showToasts: false }
      );
    } catch (error) {
      // Revert on error
      setLikes((prev) => prev - 1);
      setLiked(false);
      toast.error('Failed to like post');
    }
  }

  return (
    <button onClick={handleLike} disabled={liked}>
      👍 {likes}
    </button>
  );
}
```

---

## Migration Guide

### Migrating Existing API Routes

**Before:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await createUser(body);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**After:**
```typescript
import { ApiSuccess, ApiError } from '@/lib/api/response';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validation = UserSchema.safeParse(body);
    if (!validation.success) {
      return ApiError.validationError(validation.error);
    }

    const user = await createUser(validation.data);

    return ApiSuccess.created({ user }, 'User created successfully');
  } catch (error) {
    return ApiError.internal('Failed to create user', error);
  }
}
```

### Migrating Client-Side Fetch Calls

**Before:**
```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData),
});

if (!response.ok) {
  const error = await response.json();
  toast.error(error.message || 'An error occurred');
  throw new Error(error.message);
}

const data = await response.json();
toast.success('User created!');
return data;
```

**After:**
```typescript
import { api } from '@/lib/api/client';

// Automatic error handling and toasts
const user = await api.post('/api/users', userData, {
  successMessage: 'User created!',
});
return user;
```

---

## Best Practices Checklist

✅ **Always use Zod for request validation**
- Provides type safety and automatic validation errors
- Use `ApiError.validationError(zodError)` for consistent error format

✅ **Use appropriate HTTP status codes**
- 200 for standard success
- 201 for resource creation
- 422 for validation errors (not 400)
- 404 for not found
- 500 for server errors

✅ **Include descriptive error messages**
- Messages should be user-friendly
- Provide actionable feedback

✅ **Log errors on the server**
- Use `console.error()` before returning error responses
- Include stack traces for debugging

✅ **Use the API client on the frontend**
- Automatic error handling
- Type safety
- Consistent toast notifications

✅ **Handle loading states**
- Show loading indicators during API calls
- Disable form submissions while pending

✅ **Implement optimistic updates where appropriate**
- Improve perceived performance
- Always have rollback logic

✅ **Use appropriate toast types**
- Success for successful operations
- Error for failures
- Info for informational messages
- Warning for potential issues

---

## Additional Resources

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Zod Documentation](https://zod.dev/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [RESTful API Design](https://restfulapi.net/)
