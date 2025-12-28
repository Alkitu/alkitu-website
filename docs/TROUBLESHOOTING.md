# Troubleshooting Guide

Common issues and solutions for the Alkitu portfolio website.

---

## Table of Contents

1. [Development Issues](#development-issues)
2. [Build Errors](#build-errors)
3. [Runtime Errors](#runtime-errors)
4. [Database Issues](#database-issues)
5. [Deployment Problems](#deployment-problems)
6. [Performance Issues](#performance-issues)
7. [Getting Help](#getting-help)

---

## Development Issues

### Dev Server Won't Start

**Symptom**: `npm run dev` fails immediately or shows port conflict

**Possible Causes:**

1. **Port 3000 already in use**

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 PID_NUMBER
```

2. **Missing dependencies**

```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

3. **Corrupted `.next` cache**

```bash
# Delete build cache
rm -rf .next
npm run dev
```

---

### Hot Reload Not Working

**Symptom**: Changes to code don't reflect in browser without manual refresh

**Solutions:**

1. **Check file watcher limits (Linux/macOS)**

```bash
# Increase file watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. **Disable antivirus** (Windows)
   - Antivirus may block file watching
   - Add project directory to exclusions

3. **Use webpack instead of turbopack** (if using Next.js dev with turbo)

```json
// package.json
{
  "scripts": {
    "dev": "next dev --webpack"  // Force webpack mode
  }
}
```

---

### TypeScript Errors Not Showing in IDE

**Symptom**: VSCode doesn't show TypeScript errors

**Solutions:**

1. **Restart TypeScript server**
   - VSCode: `Cmd+Shift+P` > "TypeScript: Restart TS Server"

2. **Check TypeScript version**

```bash
# Should be 5.9+
npx tsc --version
```

3. **Verify VSCode is using workspace TypeScript**
   - Bottom right of VSCode > Click TypeScript version
   - Select "Use Workspace Version"

4. **Check `tsconfig.json`**

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

### Environment Variables Not Loading

**Symptom**: `process.env.NEXT_PUBLIC_SUPABASE_URL` is `undefined`

**Solutions:**

1. **Check file name** - Must be `.env.local` (not `.env`)

2. **Restart dev server** after changing `.env.local`

```bash
# Stop server (Ctrl+C)
npm run dev
```

3. **Verify variable prefix**

```env
# ✅ Accessible in browser
NEXT_PUBLIC_SUPABASE_URL=https://...

# ❌ Only accessible server-side
SUPABASE_URL=https://...
```

4. **Check `.gitignore`** includes `.env.local`

```bash
# Should be in .gitignore
cat .gitignore | grep .env.local
```

---

## Build Errors

### Dependency Conflicts (React 19)

**Symptom**: `npm install` fails with peer dependency errors

```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Found: react@19.2.3
npm ERR! node_modules/react
npm ERR!   peer react@"^18.0.0" from @rive-app/react-canvas@4.24.0
```

**Solution**: Ensure `.npmrc` exists with `legacy-peer-deps=true`

```bash
# Create .npmrc
echo "legacy-peer-deps=true" > .npmrc

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

**Why**: React 19 is not yet officially supported by all libraries. `legacy-peer-deps` allows installation despite version mismatches.

---

### Build Fails: "Module not found"

**Symptom**: Build fails with module resolution errors

```
Module not found: Can't resolve '@/components/ui/button'
```

**Solutions:**

1. **Check import path is correct**

```typescript
// ✅ Correct (with @/ alias)
import { Button } from '@/components/ui/button';

// ❌ Wrong path
import { Button } from '@/components/button';
```

2. **Verify file exists**

```bash
ls components/ui/button.tsx
```

3. **Check `tsconfig.json` paths**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

4. **Restart TypeScript server** (VSCode)

---

### Tailwind Classes Not Applied

**Symptom**: Tailwind classes in code don't generate styles

**Solutions:**

1. **Check Tailwind v4 configuration**

Ensure using **CSS-based config**, not `tailwind.config.js`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #00BB31;
  /* ... */
}
```

2. **Purge cache and rebuild**

```bash
rm -rf .next
npm run build
```

3. **Verify PostCSS config** (`postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
```

4. **Check class name syntax**

```tsx
// ✅ Correct
<div className="bg-primary text-white" />

// ❌ Wrong (no template literals needed)
<div className={`bg-primary text-white`} />
```

---

### Build Fails: "Unexpected token" in WASM/Rive

**Symptom**: Build fails when importing Rive animations

```
Unexpected token '<' in .wasm file
```

**Solution**: Verify webpack configuration in `next.config.js`

```javascript
// next.config.js
module.exports = {
  webpack: (config) => {
    // Handle .riv files
    config.module.rules.push({
      test: /\.riv$/i,
      type: 'asset/resource',
    });

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/i,
      type: 'asset/resource',
    });

    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};
```

---

## Runtime Errors

### Hydration Mismatch Errors

**Symptom**: Console shows "Hydration failed" or "Text content does not match"

```
Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Common Causes:**

1. **Client/Server Date Differences**

```tsx
// ❌ Wrong - server and client generate different dates
<div>{new Date().toLocaleString()}</div>

// ✅ Correct - use useEffect or suppressHydrationWarning
'use client';
import { useEffect, useState } from 'react';

function DateTime() {
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);
  return <div>{date}</div>;
}
```

2. **Theme Flash (Light/Dark Mode)**

Ensure theme script runs before React hydration:

```tsx
// app/[lang]/layout.tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          const theme = document.cookie.match(/theme=([^;]+)/)?.[1] || 'light';
          document.documentElement.setAttribute('data-theme', theme);
        })();
      `
    }}
  />
</head>
```

3. **Browser Extensions**

Disable browser extensions (ad blockers, React DevTools) and test again.

---

### "Cannot read property of undefined" in Translations

**Symptom**: Runtime error when accessing translations

```
TypeError: Cannot read property 'title' of undefined
```

**Solutions:**

1. **Check translation key exists**

```typescript
// ❌ Wrong - typo in key
const title = text.home.titel;

// ✅ Correct
const title = text.home.title;
```

2. **Use optional chaining**

```typescript
// ✅ Safe
const title = text?.home?.title ?? 'Default Title';
```

3. **Verify dictionary structure**

```json
// app/dictionaries/en.json
{
  "home": {
    "title": "Welcome"
  }
}
```

---

### Rive Animation Not Loading

**Symptom**: Rive animation doesn't appear, console shows 404 or loading error

**Solutions:**

1. **Check file path**

```tsx
// ✅ Correct (public folder)
<RiveAnimation src="/assets/rive/animation.riv" />

// ❌ Wrong (missing leading slash)
<RiveAnimation src="assets/rive/animation.riv" />
```

2. **Verify file exists**

```bash
ls public/assets/rive/animation.riv
```

3. **Ensure WASM runtime is loaded**

The `RiveAnimation` component automatically preloads WASM. If custom implementation:

```typescript
import { RuntimeLoader } from '@rive-app/react-canvas';

// Preload WASM
RuntimeLoader.setWasmUrl('/path/to/rive.wasm');
```

4. **Check browser console** for specific Rive errors

---

### "Proxy is not defined" Error

**Symptom**: Error in Next.js 16 about missing proxy

```
Error: Proxy configuration is invalid
```

**Solution**: Ensure using correct Next.js 16 proxy convention

```typescript
// proxy.ts (not middleware.ts)
import { NextRequest, NextFetchEvent } from 'next/server';

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  // Your middleware logic
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Note**: Next.js 16 renamed `middleware.ts` to `proxy.ts` with named `proxy` export.

---

## Database Issues

### RLS Blocking Queries

**Symptom**: Queries return empty arrays despite data existing

```typescript
const { data } = await supabase.from('projects').select('*');
// data = []
```

**Solutions:**

1. **Check RLS policies exist**

```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'projects';
```

2. **Add SELECT policy for anon role**

```sql
CREATE POLICY "public_read_projects"
ON projects
FOR SELECT
TO anon, authenticated
USING (true);
```

3. **Verify RLS is enabled**

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'projects';
-- rowsecurity should be 't' (true)
```

4. **Temporarily disable for testing** (NEVER in production)

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
-- Test query
-- Re-enable immediately
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

---

### Migration Fails: "Already Exists"

**Symptom**: `supabase db push` fails

```
Error: relation "categories" already exists
```

**Solutions:**

1. **Check remote migration history**

```bash
supabase migration list --remote
```

2. **Skip migration if already applied**

```sql
-- Manually mark as applied
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES ('20240127120000');
```

3. **Or reset migrations** (development only, destroys data)

```bash
supabase db reset
```

---

### Slow Query Performance

**Symptom**: Database queries take >2 seconds

**Solutions:**

1. **Check query plan**

```sql
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE content->'en'->>'title' ILIKE '%search%';
```

2. **Add index for JSONB queries**

```sql
CREATE INDEX projects_en_title_idx
ON projects ((content->'en'->>'title'));
```

3. **Use pagination**

```typescript
// ✅ Paginate
const { data } = await supabase
  .from('projects')
  .select('*')
  .range(0, 9);  // First 10 results

// ❌ Fetch all (slow with many rows)
const { data } = await supabase.from('projects').select('*');
```

4. **Check connection pooling** (use port 6543, not 5432)

```env
# ✅ Pooled
SUPABASE_URL=postgresql://postgres@db.xxx.supabase.co:6543/postgres

# ❌ Direct connection (exhausts pool)
SUPABASE_URL=postgresql://postgres@db.xxx.supabase.co:5432/postgres
```

---

## Deployment Problems

### Vercel Build Fails: Dependency Errors

**Symptom**: Build succeeds locally but fails on Vercel

**Solutions:**

1. **Ensure `.npmrc` is committed**

```bash
git add .npmrc
git commit -m "fix: add .npmrc for React 19 compatibility"
git push
```

2. **Check Node.js version** in Vercel

Vercel Settings > General > Node.js Version > Select `18.x` or `20.x`

3. **Clear Vercel build cache**

Vercel Dashboard > Deployments > ⋯ > "Redeploy" > ✅ "Use existing Build Cache"

---

### 404 on All Routes After Deployment

**Symptom**: All pages return 404 on Vercel

**Solutions:**

1. **Check `proxy.ts` is present**

```bash
ls proxy.ts
```

2. **Verify proxy export name**

```typescript
// ✅ Correct
export async function proxy(request, event) { }

// ❌ Wrong
export default function middleware(request) { }
```

3. **Check matcher excludes static files**

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### Environment Variables Not Working in Production

**Symptom**: API calls fail with "Invalid Supabase URL"

**Solutions:**

1. **Verify environment variables in Vercel**

Settings > Environment Variables > Ensure all required vars present

2. **Check variable names** (case-sensitive)

```env
# ✅ Correct
NEXT_PUBLIC_SUPABASE_URL=https://...

# ❌ Wrong
NEXT_PUBLIC_SUPABASE_url=https://...
```

3. **Redeploy after adding variables**

Deployments > ⋯ > Redeploy

---

### Database Connection Fails in Production

**Symptom**: API routes return 500 errors, logs show "Failed to connect"

**Solutions:**

1. **Check Supabase project is not paused**

Supabase Dashboard > Project status should be "Active"

2. **Verify API keys are production keys**

Supabase Dashboard > Settings > API > Copy production keys

3. **Check RLS policies allow anon access**

```sql
-- Must have policies for anon role
SELECT * FROM pg_policies WHERE grantee = 'anon';
```

---

## Performance Issues

### Slow Initial Page Load

**Symptom**: First page load takes >5 seconds

**Solutions:**

1. **Enable ISR for static pages**

```typescript
// app/[lang]/projects/page.tsx
export const revalidate = 3600;  // Revalidate every hour
```

2. **Optimize images with Next.js Image**

```tsx
import Image from 'next/image';

// ✅ Optimized
<Image src="/image.jpg" width={800} height={600} alt="..." />

// ❌ Not optimized
<img src="/image.jpg" alt="..." />
```

3. **Check Vercel Analytics** for bottlenecks

Vercel Dashboard > Analytics > Identify slow functions

4. **Reduce JavaScript bundle size**

```bash
# Analyze bundle
npm run build
# Check output for large chunks
```

---

### Animations Causing Lag

**Symptom**: Framer Motion animations stutter or freeze

**Solutions:**

1. **Use `will-change` CSS property**

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  style={{ willChange: 'opacity' }}
/>
```

2. **Reduce stagger delay**

```typescript
// ❌ Too many items with stagger
const variants = {
  show: {
    transition: {
      staggerChildren: 0.5  // 50 items × 0.5s = 25 seconds!
    }
  }
};

// ✅ Reasonable stagger
const variants = {
  show: {
    transition: {
      staggerChildren: 0.1  // 50 items × 0.1s = 5 seconds
    }
  }
};
```

3. **Use `transform` instead of layout properties**

```tsx
// ✅ Fast (GPU-accelerated)
<motion.div animate={{ x: 100 }} />

// ❌ Slow (forces layout recalculation)
<motion.div animate={{ marginLeft: 100 }} />
```

4. **Disable animations on low-end devices**

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
/>
```

---

### Memory Leaks

**Symptom**: Page becomes slow after prolonged use, browser tab uses excessive RAM

**Solutions:**

1. **Clean up event listeners**

```typescript
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener('scroll', handleScroll);

  // ✅ Cleanup
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

2. **Cancel pending requests on unmount**

```typescript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(/* ... */);

  // ✅ Abort on unmount
  return () => controller.abort();
}, []);
```

3. **Use React DevTools Profiler** to identify leaks

Chrome DevTools > Profiler > Record > Interact with app > Stop > Analyze

---

## Getting Help

### Before Asking for Help

**Gather information:**

1. **Check browser console** for errors (F12 > Console)
2. **Check Network tab** for failed requests (F12 > Network)
3. **Check Vercel logs** (Deployments > Functions > View Logs)
4. **Check Supabase logs** (Logs > Database/API)
5. **Try in incognito mode** (eliminate extension conflicts)
6. **Reproduce in clean environment** (fresh clone, `npm install`)

---

### Where to Ask

**Project-Specific Issues:**

- [GitHub Issues](https://github.com/alkitu/alkitu-website/issues)
- Include:
  - Steps to reproduce
  - Expected vs actual behavior
  - Browser/OS version
  - Relevant logs/screenshots

**Next.js Issues:**

- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Next.js Discord](https://nextjs.org/discord)

**Supabase Issues:**

- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)

**React/TypeScript Issues:**

- [Stack Overflow](https://stackoverflow.com/) with tags: `reactjs`, `typescript`, `next.js`

---

### Creating a Good Bug Report

**Template:**

```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 14.1
- Browser: Chrome 120
- Node: 20.10.0
- Next.js: 16.0.10
- npm packages: (output of `npm list`)

## Logs
```
Paste relevant error logs here
```

## Screenshots
[Attach if applicable]
```

---

### Emergency Rollback

If production is broken:

1. **Vercel**: Deployments > Find last working deployment > ⋯ > "Promote to Production"
2. **Database**: Contact Supabase support for backup restoration
3. **Git**: Revert commit and redeploy

```bash
git revert HEAD
git push origin main
```

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [SUPABASE.md](SUPABASE.md) - Database troubleshooting
- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization
- [SETUP.md](SETUP.md) - Initial setup guide

---

**Still stuck? Don't hesitate to ask for help in the project's GitHub Issues!**
