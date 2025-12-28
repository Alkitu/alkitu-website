# Middleware Guide

Complete guide to the Next.js 16 proxy system and custom middleware chain pattern.

---

## Table of Contents

1. [Overview](#overview)
2. [Next.js 16 Proxy Convention](#nextjs-16-proxy-convention)
3. [Chain Pattern](#chain-pattern)
4. [Middleware Stack](#middleware-stack)
5. [Creating New Middleware](#creating-new-middleware)
6. [Execution Flow](#execution-flow)
7. [Debugging](#debugging)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

---

## Overview

### What is Middleware?

Middleware in Next.js allows you to run code **before a request is completed**. Common use cases:

- **Authentication** - Protect routes
- **Redirects** - Locale detection, URL canonicalization
- **Rewriting** - Proxy requests to different URLs
- **Headers** - Add security headers, CORS
- **Analytics** - Track requests
- **A/B testing** - Feature flags

### This Project's Middleware

We use a **custom chain pattern** to compose multiple middleware functions:

1. **withSupabaseMiddleware** - Refresh auth sessions
2. **withAuthMiddleware** - Protect admin routes
3. **withI18nMiddleware** - Handle locale routing
4. **withTrackingMiddleware** - Analytics fingerprinting

---

## Next.js 16 Proxy Convention

### Breaking Change from Next.js 15

**Next.js 16 renamed `middleware.ts` to `proxy.ts`**

**Old (Next.js 15):**
```typescript
// middleware.ts
export default function middleware(request) {
  // ...
}
```

**New (Next.js 16):**
```typescript
// proxy.ts
export async function proxy(request, event) {
  // ...
}
```

**Changes:**

- File: `middleware.ts` → `proxy.ts`
- Export: `default` → **named export `proxy`**
- Signature: Added `event: NextFetchEvent` parameter
- Runtime: Node.js only (Edge runtime **not supported**)

---

### Why "Proxy"?

The name better reflects the purpose:

> Middleware = "In the middle" of request/response
> Proxy = "Intercept and potentially modify" requests

**Use cases align with proxy behavior:**

- Forwarding requests (proxy)
- Modifying headers (proxy)
- Redirecting requests (proxy)

---

### Basic Proxy Example

```typescript
// proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Example: Block specific path
  if (pathname === '/blocked') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continue to page
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## Chain Pattern

### Problem: Multiple Middleware

**Without chaining:**

```typescript
// ❌ Can't compose multiple middleware
export async function proxy(request, event) {
  // Auth logic
  // i18n logic
  // Tracking logic
  // Becomes messy and hard to maintain
}
```

**Solution: Chain pattern**

```typescript
// ✅ Composable, maintainable
export async function proxy(request, event) {
  const handler = chain([
    withSupabaseMiddleware,
    withAuthMiddleware,
    withI18nMiddleware,
    withTrackingMiddleware,
  ]);

  return handler(request, event);
}
```

---

### Chain Implementation

**Location**: `middleware/chain.ts`

```typescript
import { NextMiddleware, NextRequest, NextFetchEvent } from 'next/server';

export function chain(middlewares: NextMiddleware[]): NextMiddleware {
  return async function composedMiddleware(
    request: NextRequest,
    event: NextFetchEvent
  ) {
    // Build chain from right to left
    let index = middlewares.length - 1;

    const next: NextMiddleware = async (req, evt) => {
      if (index < 0) {
        // No more middleware, call default Next.js handler
        const { NextResponse } = await import('next/server');
        return NextResponse.next();
      }

      const currentMiddleware = middlewares[index];
      index--;

      return currentMiddleware(req, evt);
    };

    // Start chain with first middleware
    index = 0;
    return middlewares[0](request, event);
  };
}
```

**How it works:**

1. Accepts array of middleware functions
2. Each middleware receives `next` function
3. Middleware can:
   - Call `next()` to continue chain
   - Return response to short-circuit chain
4. Chain executes left-to-right (order matters!)

---

## Middleware Stack

### Current Stack

**File**: `proxy.ts`

```typescript
import { NextRequest, NextFetchEvent } from 'next/server';
import { chain } from './middleware/chain';
import { withSupabaseMiddleware } from './middleware/withSupabaseMiddleware';
import { withAuthMiddleware } from './middleware/withAuthMiddleware';
import { withI18nMiddleware } from './middleware/withI18nMiddleware';
import { withTrackingMiddleware } from './middleware/withTrackingMiddleware';

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const handler = chain([
    withSupabaseMiddleware,    // 1. Refresh auth
    withAuthMiddleware,        // 2. Protect admin routes
    withI18nMiddleware,        // 3. Locale routing
    withTrackingMiddleware,    // 4. Analytics
  ]);

  return handler(request, event);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### Middleware Responsibilities

#### 1. withSupabaseMiddleware

**Purpose**: Refresh Supabase auth session cookies

**Runs on**: All routes (except static files)

**Implementation**:

```typescript
import { createServerClient } from '@supabase/ssr';

export function withSupabaseMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    let response = await next(request, event);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            response.cookies.set(name, value, options);
          },
          remove: (name) => {
            response.cookies.delete(name);
          },
        },
      }
    );

    // Triggers session refresh
    await supabase.auth.getUser();

    return response;
  };
}
```

**Why first?** Must run before auth check to ensure fresh session.

---

#### 2. withAuthMiddleware

**Purpose**: Protect `/admin` routes

**Runs on**: Only `/admin/*` paths

**Implementation**:

```typescript
export function withAuthMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (!pathname.startsWith('/admin')) {
      return next(request, event);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    if (user) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (adminUser) {
        // Update last_login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        return next(request, event);
      }
    }

    // Redirect to login
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  };
}
```

**Why second?** Requires fresh session from `withSupabaseMiddleware`.

---

#### 3. withI18nMiddleware

**Purpose**: Handle locale routing and redirects

**Runs on**: All routes except `/admin`, `/api`, static files

**Key logic**:

```typescript
const DEFAULT_LOCALE = 'es';
const SUPPORTED_LOCALES = ['en', 'es'];

export function withI18nMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname, search } = request.nextUrl;

    // Exclude admin routes
    if (pathname.startsWith('/admin')) {
      return next(request, event);
    }

    // Root path → redirect to locale
    if (pathname === '/') {
      const redirectLocale = request.cookies.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE;
      return NextResponse.redirect(new URL(`/${redirectLocale}${search}`, request.url));
    }

    // Path without locale → add locale
    const pathLocale = getLocaleFromPath(pathname);
    if (!pathLocale) {
      const currentLocale = request.cookies.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE;
      return NextResponse.redirect(new URL(`/${currentLocale}${pathname}${search}`, request.url));
    }

    // Set locale cookie
    const response = await next(request, event);
    response.cookies.set('NEXT_LOCALE', pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  };
}
```

**Why third?** Needs to run before tracking to ensure proper locale.

---

#### 4. withTrackingMiddleware

**Purpose**: Generate session fingerprints for analytics

**Runs on**: Public routes only (excludes `/admin`, `/api`, static files)

**Implementation**:

```typescript
import crypto from 'crypto';

export function withTrackingMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Skip admin, API, and static files
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.match(/^\/_next/) ||
      pathname.match(/\.(ico|png|jpg|svg)$/)
    ) {
      return next(request, event);
    }

    let sessionFingerprint = request.cookies.get('session_fingerprint')?.value;

    if (!sessionFingerprint) {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      sessionFingerprint = crypto
        .createHash('sha256')
        .update(`${ip}-${userAgent}-${Date.now()}-${Math.random()}`)
        .digest('hex')
        .substring(0, 32);
    }

    const response = await next(request, event);

    response.cookies.set('session_fingerprint', sessionFingerprint, {
      httpOnly: false,  // Client needs to read
      maxAge: 60 * 60,  // 1 hour
    });

    return response;
  };
}
```

**Why last?** Non-critical, runs after core functionality.

---

## Creating New Middleware

### Step 1: Create Middleware File

```typescript
// middleware/withMyMiddleware.ts
import { NextMiddleware, NextResponse } from 'next/server';

export function withMyMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Your logic here
    console.log('Processing:', pathname);

    // Option 1: Continue chain
    const response = await next(request, event);

    // Modify response if needed
    response.headers.set('X-Custom-Header', 'Value');

    return response;

    // Option 2: Short-circuit chain
    // return NextResponse.redirect(new URL('/other-page', request.url));
  };
}
```

---

### Step 2: Add to Chain

```typescript
// proxy.ts
import { withMyMiddleware } from './middleware/withMyMiddleware';

export async function proxy(request, event) {
  const handler = chain([
    withSupabaseMiddleware,
    withAuthMiddleware,
    withI18nMiddleware,
    withMyMiddleware,      // ← Add here
    withTrackingMiddleware,
  ]);

  return handler(request, event);
}
```

**Order matters!** Place based on dependencies:

- **Before**: If middleware depends on this
- **After**: If this depends on other middleware

---

## Execution Flow

### Request Lifecycle

```
1. User requests /en/projects
   ↓
2. Next.js invokes proxy()
   ↓
3. Chain starts:
   │
   ├─ withSupabaseMiddleware
   │  └─ Refreshes auth session
   │     └─ Calls next()
   │        ↓
   ├─ withAuthMiddleware
   │  └─ Checks /admin route? No
   │     └─ Calls next()
   │        ↓
   ├─ withI18nMiddleware
   │  └─ Locale 'en' detected
   │     └─ Sets NEXT_LOCALE cookie
   │        └─ Calls next()
   │           ↓
   ├─ withTrackingMiddleware
   │  └─ Generates session fingerprint
   │     └─ Sets session_fingerprint cookie
   │        └─ Calls next()
   │           ↓
   └─ NextResponse.next() (default handler)
      ↓
4. Page renders
   ↓
5. Response sent to user
```

---

### Short-Circuit Example

```
1. User requests /admin/projects (not logged in)
   ↓
2. Chain starts:
   │
   ├─ withSupabaseMiddleware
   │  └─ Refreshes auth (no session found)
   │     └─ Calls next()
   │        ↓
   ├─ withAuthMiddleware
   │  └─ Checks /admin route? Yes
   │     └─ Checks user authenticated? No
   │        └─ Returns NextResponse.redirect(...)
   │           ↓
   │        CHAIN STOPS HERE
   │           ↓
3. User redirected to /es/auth/login
```

---

## Debugging

### Console Logging

Add logs to trace execution:

```typescript
export function withMyMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    console.log('[MyMiddleware] Start:', request.nextUrl.pathname);

    const response = await next(request, event);

    console.log('[MyMiddleware] End:', response.status);

    return response;
  };
}
```

**Output:**

```
[MyMiddleware] Start: /en/projects
[MyMiddleware] End: 200
```

---

### Middleware Not Running

**Symptom**: Middleware logic doesn't execute

**Solutions:**

1. **Check matcher** - Ensure path matches:

```typescript
// proxy.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

2. **Verify file name** - Must be `proxy.ts` (not `middleware.ts`)

3. **Check export** - Must be **named export `proxy`**:

```typescript
// ✅ Correct
export async function proxy(request, event) { }

// ❌ Wrong
export default function middleware(request) { }
```

---

### Response Headers Not Set

**Symptom**: Headers added in middleware don't appear

**Solution**: Ensure modifying response from `next()`:

```typescript
// ✅ Correct - modify response from next()
const response = await next(request, event);
response.headers.set('X-Custom', 'Value');
return response;

// ❌ Wrong - creates new response
return NextResponse.next();
```

---

## Best Practices

### 1. Order Matters

**Critical dependencies first:**

```typescript
// ✅ Correct order
chain([
  withSupabaseMiddleware,  // Must run first (auth refresh)
  withAuthMiddleware,      // Depends on Supabase
  withI18nMiddleware,      // Independent
  withTrackingMiddleware,  // Last (non-critical)
]);

// ❌ Wrong order
chain([
  withAuthMiddleware,      // Runs before auth refresh!
  withSupabaseMiddleware,
]);
```

---

### 2. Skip Irrelevant Routes Early

```typescript
// ✅ Good - early return
export function withMyMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    if (!shouldProcess(request)) {
      return next(request, event);  // Skip immediately
    }

    // Expensive logic only runs when needed
    const data = await fetchData();
    // ...
  };
}

// ❌ Bad - processes all requests
export function withMyMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const data = await fetchData();  // Runs for every request!

    if (!shouldProcess(request)) {
      return next(request, event);
    }
    // ...
  };
}
```

---

### 3. Avoid Heavy Operations

**Middleware should be fast (<50ms):**

```typescript
// ✅ Good - lightweight
const userAgent = request.headers.get('user-agent');
const isBot = /bot|crawler/i.test(userAgent);

// ⚠️  Avoid - database query in middleware
const user = await supabase.from('users').select('*').single();
```

**Exception**: Auth checks are acceptable (cached by Supabase).

---

### 4. Use Cookies for State

```typescript
// ✅ Good - persist with cookies
response.cookies.set('locale', 'en', {
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'strict',
});

// ❌ Bad - state lost on next request
let userLocale = 'en';  // Doesn't persist
```

---

### 5. Test in Development

```bash
# Test specific routes
curl http://localhost:3000/
curl http://localhost:3000/en/projects
curl http://localhost:3000/admin/dashboard

# Check cookies
curl -v http://localhost:3000/ | grep -i set-cookie
```

---

## Examples

### Security Headers

```typescript
export function withSecurityHeaders(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const response = await next(request, event);

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  };
}
```

---

### A/B Testing

```typescript
export function withABTesting(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const variant = request.cookies.get('ab_variant')?.value ||
      (Math.random() > 0.5 ? 'A' : 'B');

    const response = await next(request, event);

    response.cookies.set('ab_variant', variant, {
      maxAge: 60 * 60 * 24 * 30,  // 30 days
    });

    response.headers.set('X-AB-Variant', variant);

    return response;
  };
}
```

---

### Rate Limiting

```typescript
const rateLimit = new Map<string, number[]>();

export function withRateLimit(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60000;  // 1 minute
    const maxRequests = 100;

    const timestamps = rateLimit.get(ip) || [];
    const recentRequests = timestamps.filter((t) => now - t < windowMs);

    if (recentRequests.length >= maxRequests) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);

    return next(request, event);
  };
}
```

---

## See Also

- [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - i18n middleware details
- [ANALYTICS.md](ANALYTICS.md) - Tracking middleware details
- [ADMIN_PANEL.md](ADMIN_PANEL.md) - Auth middleware usage
- [Next.js Proxy Docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

---

**Middleware is powerful. Use it wisely to enhance performance and security, not hinder it.**
