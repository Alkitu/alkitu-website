# Performance Optimization Guide

Complete guide to optimizing performance for the Alkitu portfolio website.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Web Vitals](#core-web-vitals)
3. [Image Optimization](#image-optimization)
4. [Code Splitting & Bundle Size](#code-splitting--bundle-size)
5. [Static Generation & ISR](#static-generation--isr)
6. [Database Optimization](#database-optimization)
7. [CDN & Caching](#cdn--caching)
8. [Monitoring & Metrics](#monitoring--metrics)

---

## Overview

### Performance Goals

**Target Lighthouse scores:**
- Performance: **>90**
- Accessibility: **>95**
- Best Practices: **>95**
- SEO: **>90**

**Target Core Web Vitals:**
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

---

### Current Optimizations

**Already implemented:**
- ✅ Next.js 16 App Router (automatic optimizations)
- ✅ Next.js Image component (automatic image optimization)
- ✅ Vercel Edge Network (global CDN)
- ✅ Framer Motion viewport-based animations (lazy loading)
- ✅ PgBouncer connection pooling (Supabase)

---

## Core Web Vitals

### Largest Contentful Paint (LCP)

**What it measures**: Time until largest content element renders

**Target**: <2.5 seconds

---

**Optimization strategies:**

#### 1. Optimize Hero Images

```tsx
import Image from 'next/image';

// ✅ Good - priority loading
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority  // Loads immediately, not lazy
  quality={90}
/>

// ❌ Bad - lazy loads above fold
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
/>
```

**Use `priority` for**:
- Hero images (above the fold)
- Logo
- First content image

---

#### 2. Preload Critical Resources

```tsx
// app/[lang]/layout.tsx
<head>
  {/* Preload hero image */}
  <link
    rel="preload"
    as="image"
    href="/hero.jpg"
    type="image/jpeg"
  />

  {/* Preload fonts */}
  <link
    rel="preload"
    href="/fonts/Hiruko-Regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
</head>
```

---

#### 3. Use Edge Runtime for API Routes

```typescript
// app/api/projects/route.ts
export const runtime = 'edge';  // Faster than Node.js

export async function GET() {
  // Runs on Edge, closer to users
}
```

**When to use**:
- Simple data fetching
- No Node.js-specific APIs needed

---

### First Input Delay (FID)

**What it measures**: Time from user interaction to browser response

**Target**: <100ms

---

**Optimization strategies:**

#### 1. Reduce JavaScript Execution Time

**Defer non-critical scripts**:

```tsx
// ❌ Bad - blocks rendering
<script src="/analytics.js" />

// ✅ Good - loads after page interactive
<script src="/analytics.js" defer />
```

---

#### 2. Code Split Large Components

```tsx
// ✅ Good - dynamic import
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

// ❌ Bad - bundles everything
import { HeavyComponent } from './HeavyComponent';
```

---

#### 3. Optimize Event Handlers

```tsx
// ✅ Good - debounced
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((query) => {
  // Expensive search
}, 300);

// ❌ Bad - runs on every keystroke
const handleSearch = (query) => {
  // Expensive search runs immediately
};
```

---

### Cumulative Layout Shift (CLS)

**What it measures**: Visual stability (unexpected layout shifts)

**Target**: <0.1

---

**Optimization strategies:**

#### 1. Always Specify Image Dimensions

```tsx
// ✅ Good - reserves space
<Image
  src="/project.jpg"
  width={800}
  height={600}
  alt="Project"
/>

// ❌ Bad - causes layout shift
<img src="/project.jpg" alt="Project" />
```

---

#### 2. Reserve Space for Dynamic Content

```tsx
// ✅ Good - fixed height placeholder
{isLoading ? (
  <div className="h-96 bg-gray-200 animate-pulse" />
) : (
  <ProjectCard project={project} />
)}

// ❌ Bad - height jumps when loaded
{isLoading ? <Spinner /> : <ProjectCard project={project} />}
```

---

#### 3. Avoid Injecting Content Above Existing Content

```tsx
// ✅ Good - append to bottom
<div>
  {existingContent}
  {newContent}
</div>

// ❌ Bad - shifts existing content down
<div>
  {newContent}
  {existingContent}
</div>
```

---

## Image Optimization

### Next.js Image Component

**Always use `next/image`**:

```tsx
import Image from 'next/image';

<Image
  src="/project.jpg"
  alt="Project screenshot"
  width={800}
  height={600}
  quality={85}  // Default: 75, higher = better quality
  placeholder="blur"  // Shows blur while loading
  blurDataURL="data:image/..."  // Base64 blur
/>
```

**Benefits**:
- Automatic WebP/AVIF conversion
- Responsive images (`srcset`)
- Lazy loading (except `priority`)
- CDN optimization via Vercel

---

### Image Formats

**Use modern formats:**

1. **AVIF** - Best compression (50% smaller than JPEG)
2. **WebP** - Good compression (30% smaller than JPEG)
3. **JPEG** - Fallback for older browsers

Next.js automatically serves best format based on browser support.

---

### Image Sizing

**Use correct dimensions:**

```tsx
// ❌ Bad - loads 4K image, displays at 400px
<Image src="/4k-image.jpg" width={400} height={300} />

// ✅ Good - image is 800px (2x for retina)
<Image src="/800px-image.jpg" width={400} height={300} />
```

**Rule of thumb**: Image width = display width × 2 (for retina displays)

---

### External Images

**Configure in `next.config.js`**:

```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'alkitu.com',
      },
    ],
  },
};
```

---

## Code Splitting & Bundle Size

### Analyze Bundle

```bash
# Install analyzer
npm install @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});

# Analyze
ANALYZE=true npm run build
```

**Opens browser with bundle visualization.**

---

### Dynamic Imports

**For large components:**

```tsx
// ✅ Good - loads only when needed
const RiveAnimation = dynamic(
  () => import('@/app/components/molecules/rive-animation'),
  { ssr: false }  // Don't render on server
);

// ❌ Bad - always bundled
import { RiveAnimation } from '@/app/components/molecules/rive-animation';
```

---

### Tree Shaking

**Import only what you need:**

```tsx
// ✅ Good - imports specific function
import { motion } from 'framer-motion';

// ❌ Bad - imports entire library
import * as FramerMotion from 'framer-motion';
const { motion } = FramerMotion;
```

---

### Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove package
npm uninstall unused-package
```

---

## Static Generation & ISR

### Static Site Generation (SSG)

**Pre-render pages at build time:**

```typescript
// app/[lang]/projects/page.tsx
export const revalidate = false;  // Static generation

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsGrid projects={projects} />;
}
```

**Benefits**:
- Instant page loads
- Served from CDN
- No server compute

**Use for**: Content that rarely changes

---

### Incremental Static Regeneration (ISR)

**Rebuild pages periodically:**

```typescript
// app/[lang]/projects/page.tsx
export const revalidate = 3600;  // Rebuild every hour

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsGrid projects={projects} />;
}
```

**Benefits**:
- Fast like static
- Updates automatically
- No cache invalidation needed

**Use for**: Content that changes occasionally (blog posts, projects)

---

### On-Demand Revalidation

**Rebuild when content changes:**

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { path } = await request.json();

  revalidatePath(path);

  return Response.json({ revalidated: true });
}
```

**Call after content update:**

```typescript
// After creating project
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ path: '/en/projects' }),
});
```

---

## Database Optimization

### Connection Pooling

**Use PgBouncer (port 6543)**:

```env
# ✅ Good - pooled connection
SUPABASE_URL=postgresql://postgres@db.xxx.supabase.co:6543/postgres

# ❌ Bad - direct connection (exhausts pool)
SUPABASE_URL=postgresql://postgres@db.xxx.supabase.co:5432/postgres
```

---

### Query Optimization

**Add indexes for frequent queries:**

```sql
-- Slow without index
SELECT * FROM projects WHERE featured = true;

-- Fast with index
CREATE INDEX projects_featured_idx ON projects(featured) WHERE featured = true;
```

**Check query performance:**

```sql
EXPLAIN ANALYZE
SELECT * FROM projects WHERE featured = true;
```

---

### Reduce Query Payload

**Select only needed columns:**

```typescript
// ✅ Good - specific columns
const { data } = await supabase
  .from('projects')
  .select('id, title, image_url');

// ❌ Bad - fetches everything
const { data } = await supabase
  .from('projects')
  .select('*');
```

---

### Use Pagination

```typescript
// ✅ Good - paginated
const { data } = await supabase
  .from('projects')
  .select('*')
  .range(0, 9);  // First 10 items

// ❌ Bad - fetches all rows
const { data } = await supabase
  .from('projects')
  .select('*');
```

---

## CDN & Caching

### Vercel Edge Network

**Automatic CDN for:**
- Static pages
- Images via `next/image`
- `public/` folder assets

**Locations**: 100+ edge locations worldwide

---

### Cache Headers

**Set cache headers for API routes:**

```typescript
// app/api/projects/route.ts
export async function GET() {
  const projects = await getProjects();

  return Response.json(projects, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**Header breakdown:**
- `public` - Cacheable by CDN
- `s-maxage=3600` - CDN caches for 1 hour
- `stale-while-revalidate=86400` - Serve stale for 24 hours while revalidating

---

### Browser Caching

**Static assets automatically cached:**

```
/_next/static/*  → Cached 1 year (immutable)
/public/*        → Cached based on file type
```

---

## Monitoring & Metrics

### Vercel Analytics

**Enable in Vercel Dashboard:**

1. Project > Analytics
2. Enable Web Analytics
3. Add to app:

```tsx
// app/[lang]/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Metrics tracked:**
- Real User Monitoring (RUM)
- Core Web Vitals
- Page load times
- Geographic distribution

---

### Lighthouse CI

**Automated performance testing:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://preview-url.vercel.app/en
            https://preview-url.vercel.app/es
          uploadArtifacts: true
```

**Fails PR if scores drop below threshold.**

---

### Custom Performance Monitoring

```tsx
// app/components/PerformanceMonitor.tsx
'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function PerformanceMonitor() {
  useEffect(() => {
    getCLS((metric) => console.log('CLS', metric));
    getFID((metric) => console.log('FID', metric));
    getFCP((metric) => console.log('FCP', metric));
    getLCP((metric) => console.log('LCP', metric));
    getTTFB((metric) => console.log('TTFB', metric));
  }, []);

  return null;
}
```

**Add to layout** for tracking.

---

## Performance Checklist

### Before Deployment

- [ ] Run `npm run build` - No errors
- [ ] Lighthouse score >90 on all pages
- [ ] Images use `next/image` component
- [ ] Heavy components use dynamic imports
- [ ] API routes have cache headers
- [ ] Database queries have indexes
- [ ] Using PgBouncer for database (port 6543)
- [ ] ISR enabled on dynamic pages
- [ ] No console errors in production build

### After Deployment

- [ ] Check Vercel Analytics for Core Web Vitals
- [ ] Monitor Supabase database performance
- [ ] Review slow API routes in Vercel Functions
- [ ] Test in slow 3G network (Chrome DevTools)
- [ ] Test on mobile devices
- [ ] Check bundle size hasn't increased significantly

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Production optimizations
- [ANIMATIONS.md](ANIMATIONS.md) - Animation performance
- [SUPABASE.md](SUPABASE.md) - Database optimization
- [TESTING.md](TESTING.md) - Performance testing

---

**Performance is a feature. Fast sites convert better, rank higher, and delight users.**
