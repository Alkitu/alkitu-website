# Analytics System Guide

Complete guide to the built-in analytics tracking system using session fingerprinting and page view tracking.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Middleware](#middleware)
5. [VisitTracker Component](#visittracker-component)
6. [API Endpoints](#api-endpoints)
7. [Admin Dashboard](#admin-dashboard)
8. [Privacy Considerations](#privacy-considerations)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Tracked?

The analytics system tracks:

- **Sessions**: Unique visitors with 1-hour session window
- **Page views**: Individual page visits with duration
- **Geolocation**: Country, region, city (from IP address)
- **User agent**: Browser and device information
- **Referrers**: Traffic sources (where visitors came from)

### Key Features

- **Session fingerprinting** - Identifies unique visitors across page navigations
- **No cookies for tracking** - Uses server-side fingerprinting
- **Privacy-focused** - No personal data collected
- **RESTful APIs** - Standardized endpoints with Zod validation
- **Real-time tracking** - Immediate data availability
- **Admin dashboard** - View metrics and statistics

---

## Architecture

### Data Flow

```
1. User visits website
   ↓
2. withTrackingMiddleware generates session fingerprint
   ↓
3. Sets session_fingerprint cookie (httpOnly: false)
   ↓
4. VisitTracker component reads cookie
   ↓
5. Creates/updates session via POST /api/analytics/sessions
   ↓
6. Creates page view via POST /api/analytics/page-views
   ↓
7. On navigation, updates exit time via PATCH /api/analytics/page-views/[id]
   ↓
8. Admin views data in /admin/dashboard
```

### Components

```
┌────────────────────────────────────────────────────────────┐
│                  Client Side                               │
├────────────────────────────────────────────────────────────┤
│ VisitTracker                                               │
│ - Reads session_fingerprint cookie                         │
│ - Calls analytics APIs                                     │
│ - Tracks page views on route change                        │
│ - Updates exit time on unmount                             │
└────────────────────────────────────────────────────────────┘
                        ↓ ↑
                     HTTP Requests
                        ↓ ↑
┌────────────────────────────────────────────────────────────┐
│                  Server Side                               │
├────────────────────────────────────────────────────────────┤
│ withTrackingMiddleware (proxy.ts)                          │
│ - Generates fingerprint: hash(IP + User Agent + timestamp) │
│ - Sets session_fingerprint cookie                          │
│                                                             │
│ API Routes (/api/analytics/*)                              │
│ - POST   /sessions          - Create/update session        │
│ - POST   /page-views        - Create page view             │
│ - PATCH  /page-views/[id]   - Update exit time             │
│                                                             │
│ Supabase Client (Analytics)                                │
│ - Always uses 'anon' role                                  │
│ - No session management                                    │
└────────────────────────────────────────────────────────────┘
                        ↓ ↑
                    Database Queries
                        ↓ ↑
┌────────────────────────────────────────────────────────────┐
│                  Database                                  │
├────────────────────────────────────────────────────────────┤
│ Supabase PostgreSQL                                        │
│ - sessions table                                           │
│ - page_views table                                         │
│ - RLS policies for 'anon' role                             │
└────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### `sessions` Table

Stores unique visitor sessions with 1-hour window.

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_fingerprint text NOT NULL UNIQUE,
  ip_address text,
  user_agent text,
  country text,
  region text,
  city text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX sessions_fingerprint_idx ON sessions(session_fingerprint);
CREATE INDEX sessions_created_at_idx ON sessions(created_at DESC);
```

**Key fields:**

- `session_fingerprint` - Unique identifier (hash of IP + User Agent + timestamp)
- `ip_address` - Visitor IP (for geolocation)
- `user_agent` - Browser/device string
- `country`, `region`, `city` - Geolocation data (optional, requires IP lookup service)

**RLS Policies:**

```sql
CREATE POLICY "anon_insert_sessions" ON sessions
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_sessions" ON sessions
FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_sessions" ON sessions
FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

---

### `page_views` Table

Tracks individual page visits with duration.

```sql
CREATE TABLE page_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  page_url text NOT NULL,
  referrer text,
  entry_time timestamptz DEFAULT now(),
  exit_time timestamptz,
  duration integer GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (exit_time - entry_time))::integer
  ) STORED,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX page_views_session_id_idx ON page_views(session_id);
CREATE INDEX page_views_page_url_idx ON page_views(page_url);
CREATE INDEX page_views_entry_time_idx ON page_views(entry_time DESC);
```

**Key fields:**

- `session_id` - Foreign key to sessions table
- `page_url` - Full URL of page viewed
- `referrer` - Where visitor came from
- `entry_time` - When page was loaded
- `exit_time` - When visitor left page (null until updated)
- `duration` - Auto-calculated in seconds (generated column)

**RLS Policies:**

```sql
CREATE POLICY "anon_insert_page_views" ON page_views
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_page_views" ON page_views
FOR SELECT TO anon USING (true);

CREATE POLICY "anon_update_page_views" ON page_views
FOR UPDATE TO anon USING (true) WITH CHECK (true);
```

**Important**: SELECT policies are required for `RETURNING` clauses.

---

## Middleware

### withTrackingMiddleware

**Location**: `middleware/withTrackingMiddleware.ts`

**Purpose**: Generates session fingerprints for all public routes.

**Implementation:**

```typescript
import { NextMiddleware, NextResponse } from 'next/server';
import crypto from 'crypto';

export function withTrackingMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname } = request.nextUrl;

    // Skip tracking for admin and API routes
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname.match(/^\/_next/) ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|woff|woff2)$/)
    ) {
      return next(request, event);
    }

    // Check if session fingerprint cookie exists
    let sessionFingerprint = request.cookies.get('session_fingerprint')?.value;

    // Generate fingerprint if missing
    if (!sessionFingerprint) {
      const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const timestamp = Date.now();
      const random = Math.random().toString(36);

      sessionFingerprint = crypto
        .createHash('sha256')
        .update(`${ip}-${userAgent}-${timestamp}-${random}`)
        .digest('hex')
        .substring(0, 32);
    }

    const response = await next(request, event);

    // Set session fingerprint cookie (1 hour expiry)
    if (response instanceof NextResponse) {
      response.cookies.set('session_fingerprint', sessionFingerprint, {
        httpOnly: false,  // ✅ Client needs to read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60,  // 1 hour
        path: '/',
      });
    }

    return response;
  };
}
```

**Key points:**

- **1-hour session window**: Cookie expires after 1 hour
- **`httpOnly: false`**: Client-side VisitTracker must read cookie
- **Excludes**: `/admin`, `/api`, static files
- **Fingerprint generation**: `hash(IP + User Agent + timestamp + random)`

---

## VisitTracker Component

**Location**: `app/components/analytics/VisitTracker.tsx`

### Implementation

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();
  const currentPageViewId = useRef<string | null>(null);

  useEffect(() => {
    // Skip admin routes
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Get session fingerprint from cookie
    const sessionFingerprint = document.cookie
      .split('; ')
      .find((row) => row.startsWith('session_fingerprint='))
      ?.split('=')[1];

    if (!sessionFingerprint) {
      console.error('Session fingerprint not found');
      return;
    }

    // Track visit
    trackVisit(sessionFingerprint, pathname);

    // Cleanup on unmount
    return () => {
      updateExitTime(currentPageViewId.current);
    };
  }, [pathname]);

  async function trackVisit(fingerprint: string, path: string) {
    try {
      // Create or update session
      const sessionRes = await fetch('/api/analytics/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionFingerprint: fingerprint }),
      });

      const sessionData = await sessionRes.json();

      // Create page view
      const pageViewRes = await fetch('/api/analytics/page-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionData.data.id,
          pageUrl: window.location.href,
          referrer: document.referrer || null,
        }),
      });

      const pageViewData = await pageViewRes.json();
      currentPageViewId.current = pageViewData.data.id;
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async function updateExitTime(pageViewId: string | null) {
    if (!pageViewId) return;

    try {
      // Use sendBeacon for reliable unload tracking
      const data = JSON.stringify({ exitTime: new Date().toISOString() });
      const blob = new Blob([data], { type: 'application/json' });

      navigator.sendBeacon(
        `/api/analytics/page-views/${pageViewId}`,
        blob
      );
    } catch (error) {
      // Fallback to fetch
      await fetch(`/api/analytics/page-views/${pageViewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exitTime: new Date().toISOString() }),
        keepalive: true,
      });
    }
  }

  return null;  // No UI
}
```

### Key Features

1. **Reads fingerprint from cookie** - Generated by middleware
2. **Creates session** - POST to `/api/analytics/sessions`
3. **Tracks page view** - POST to `/api/analytics/page-views`
4. **Updates on navigation** - Triggered by `pathname` change
5. **Updates exit time** - On component unmount
6. **Uses sendBeacon** - Reliable tracking even on page close

### Usage

```tsx
// app/[lang]/layout.tsx
import { VisitTracker } from '@/app/components/analytics/VisitTracker';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
```

---

## API Endpoints

### POST /api/analytics/sessions

**Purpose**: Create or update session

**Request:**

```typescript
POST /api/analytics/sessions
Content-Type: application/json

{
  "sessionFingerprint": "abc123..."
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "session_fingerprint": "abc123...",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "created_at": "2025-01-27T10:30:00Z"
  }
}
```

**Behavior:**

- If session exists (by fingerprint), updates `updated_at`
- If session doesn't exist, creates new session
- Returns session data with `RETURNING *`

---

### POST /api/analytics/page-views

**Purpose**: Create page view record

**Request:**

```typescript
POST /api/analytics/page-views
Content-Type: application/json

{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "pageUrl": "https://alkitu.com/en/projects",
  "referrer": "https://google.com"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Page view created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "page_url": "https://alkitu.com/en/projects",
    "referrer": "https://google.com",
    "entry_time": "2025-01-27T10:30:00Z",
    "exit_time": null,
    "duration": null
  }
}
```

---

### PATCH /api/analytics/page-views/[id]

**Purpose**: Update exit time for page view

**Request:**

```typescript
PATCH /api/analytics/page-views/660e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "exitTime": "2025-01-27T10:32:30Z"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Page view updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "page_url": "https://alkitu.com/en/projects",
    "entry_time": "2025-01-27T10:30:00Z",
    "exit_time": "2025-01-27T10:32:30Z",
    "duration": 150
  }
}
```

**Note**: `duration` is auto-calculated by database (exit_time - entry_time).

---

## Admin Dashboard

**Location**: `/admin/dashboard`

### Features

- **Total sessions** - Unique visitors
- **Total page views** - All page loads
- **Average session duration** - Time spent per session
- **Top pages** - Most visited URLs
- **Traffic sources** - Referrer breakdown
- **Session timeline** - Visitors over time

### Example Queries

**Total sessions (last 7 days):**

```sql
SELECT COUNT(*) FROM sessions
WHERE created_at > now() - interval '7 days';
```

**Top 10 pages:**

```sql
SELECT
  page_url,
  COUNT(*) AS views,
  AVG(duration) AS avg_duration
FROM page_views
WHERE entry_time > now() - interval '7 days'
GROUP BY page_url
ORDER BY views DESC
LIMIT 10;
```

**Traffic sources:**

```sql
SELECT
  CASE
    WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
    WHEN referrer LIKE '%google%' THEN 'Google'
    WHEN referrer LIKE '%facebook%' THEN 'Facebook'
    ELSE 'Other'
  END AS source,
  COUNT(*) AS visits
FROM page_views
WHERE entry_time > now() - interval '7 days'
GROUP BY source
ORDER BY visits DESC;
```

---

## Privacy Considerations

### What We Track

- ✅ **Session fingerprints** - Anonymous identifiers
- ✅ **Page URLs** - Which pages are visited
- ✅ **Referrers** - Traffic sources
- ✅ **User agents** - Browser/device types
- ✅ **IP addresses** - For geolocation only

### What We Don't Track

- ❌ **Personal information** - No names, emails, etc.
- ❌ **Cookies for tracking** - Only session fingerprint
- ❌ **Cross-site tracking** - Only this domain
- ❌ **Precise location** - Only country/region/city
- ❌ **Form inputs** - No keylogging or form tracking

### GDPR Compliance

**Right to be forgotten:**

```sql
-- Delete all data for a session
DELETE FROM sessions WHERE session_fingerprint = 'abc123...';
-- Cascade deletes all page_views
```

**Data retention:**

Consider implementing auto-deletion:

```sql
-- Delete sessions older than 90 days
DELETE FROM sessions WHERE created_at < now() - interval '90 days';
```

### Privacy Policy

Add to your privacy policy:

> We collect anonymous analytics data including page views, referrers, and general location (country/city). This data is used solely for improving website performance and is not shared with third parties. No personal information is collected.

---

## Troubleshooting

### No Sessions Being Created

**Symptom**: Empty `sessions` table despite traffic

**Solutions:**

1. **Check middleware is running**

```typescript
// Add console.log in withTrackingMiddleware
console.log('Generated fingerprint:', sessionFingerprint);
```

2. **Verify cookie is set**

Browser DevTools > Application > Cookies > `session_fingerprint`

3. **Check RLS policies**

```sql
SELECT * FROM pg_policies WHERE tablename = 'sessions';
```

Should show INSERT policy for `anon` role.

---

### Page Views Not Tracking

**Symptom**: Sessions exist but no page views

**Solutions:**

1. **Check VisitTracker is mounted**

```tsx
// Verify in app/[lang]/layout.tsx
<VisitTracker />
```

2. **Check browser console for errors**

F12 > Console > Look for fetch errors

3. **Verify API endpoint works**

```bash
curl -X POST http://localhost:3000/api/analytics/page-views \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","pageUrl":"test","referrer":null}'
```

---

### Duration Always Null

**Symptom**: `duration` field is always `null`

**Solution**: Ensure `exit_time` is being set

The `duration` field is a **generated column** that auto-calculates when `exit_time` is set:

```sql
-- Check if exit_time is null
SELECT id, entry_time, exit_time, duration FROM page_views;
```

If `exit_time` is null, `duration` will also be null. Ensure `updateExitTime()` in `VisitTracker` is being called.

---

## See Also

- [SUPABASE.md](SUPABASE.md) - Database setup
- [ADMIN_PANEL.md](ADMIN_PANEL.md) - Admin dashboard
- [MIDDLEWARE.md](MIDDLEWARE.md) - Middleware chain
- [API_BEST_PRACTICES.md](API_BEST_PRACTICES.md) - API patterns

---

**Analytics help you understand your users. Use insights to improve their experience.**
