# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## Documentation Reference

### Critical Rule: ALWAYS Read Documentation First

**Before starting ANY task, you MUST:**

1. Read **@CLAUDE.md** (this file) - Core conventions and patterns
2. Read the **task-specific documentation** listed below
3. Understand the architecture before making changes

### Task-Specific Documentation (MUST READ)

| When working on... | Read these files FIRST |
|-------------------|------------------------|
| **Any task** | @/Users/luiseurdanetamartucci/Desktop/alkitu-website/CLAUDE.md (this file) |
| **New features** | @CLAUDE.md → @docs/INTERNATIONALIZATION.md → Feature-specific docs |
| **GitHub issues/PRs** | @docs/GITHUB_WORKFLOW.md |
| **Internationalization** | @docs/INTERNATIONALIZATION.md |
| **Animations** | @docs/ANIMATIONS.md |
| **Database/Supabase** | @docs/SUPABASE.md |
| **Admin panel** | @docs/ADMIN_PANEL.md |
| **Middleware/Proxy** | @docs/MIDDLEWARE.md |
| **Analytics** | @docs/ANALYTICS.md |
| **Performance** | @docs/PERFORMANCE.md |
| **Deployment** | @docs/DEPLOYMENT.md, @docs/ENVIRONMENT.md |
| **Bugs/Issues** | @docs/TROUBLESHOOTING.md |
| **Testing** | @docs/TESTING.md |
| **Initial setup** | @docs/SETUP.md |
| **Blog content creation** | @docs/SEO_BLOG_GUIDE.md, @docs/templates/blog-post-template.mdx |

### Complete Documentation Index

- **@docs/README.md** - Full documentation index with all guides organized by use case

**IMPORTANT**: Never guess or assume - always read the relevant documentation before implementing any change.

---

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Utilities
npm run sync:projects    # Sync project data to dictionaries
```

---

## Quick Troubleshooting

**Dev server issues:**
- Stale errors → Delete `.next` folder: `rm -rf .next`
- Port in use → `lsof -i :3000` then `kill -9 PID`
- Module errors → `rm -rf node_modules package-lock.json && npm install`

**Build issues:**
- Dependency conflicts → `.npmrc` with `legacy-peer-deps=true` is required
- TypeScript errors → Check `tsconfig.json` paths configuration

**Next.js 16 Proxy:**
- File is `proxy.ts` (not `middleware.ts`)
- Export: `export async function proxy(request, event)`
- Runtime: Node.js only (Edge not supported)

**More troubleshooting**: See @docs/TROUBLESHOOTING.md

---

## Core Architecture

### Stack

- **Next.js 16** App Router with React 19
- **TypeScript 5.9** with strict mode
- **Tailwind CSS v4** (CSS-based config, no tailwind.config.js)
- **Supabase** PostgreSQL + Auth
- **Framer Motion** + **Rive** for animations

### Project Structure

```
app/
├── [lang]/              # Localized routes (en/es)
│   ├── page.tsx         # Homepage
│   ├── about/
│   ├── projects/
│   ├── blog/
│   └── auth/login/
├── admin/               # Protected CMS routes
├── api/                 # API routes
├── components/          # Atomic Design structure
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── context/             # React contexts
└── dictionaries/        # i18n translations (en.json, es.json)

middleware/              # Proxy chain middleware
├── chain.ts
├── withI18nMiddleware.ts
├── withAuthMiddleware.ts
├── withSupabaseMiddleware.ts
└── withTrackingMiddleware.ts

lib/                     # Utilities and helpers
supabase/migrations/     # Database migrations
```

**Detailed architecture**: See README.md and docs/

---

## Core Conventions

### 1. Internationalization (i18n)

**Dual i18n system** - Always support both:

```typescript
// Server-side (pages, layouts)
const text = await getDictionary(lang);

// Client-side (components)
const t = useTranslations();
```

**Key rules:**
- ALL text must be in both `en.json` and `es.json`
- Default locale: Spanish (`es`)
- Routes: `/{locale}/*` (e.g., `/en/about`, `/es/proyectos`)
- Admin routes: Fixed to Spanish, no locale prefix

**Details**: @docs/INTERNATIONALIZATION.md

---

### 2. Component Organization (Atomic Design)

```
atoms/       → Smallest UI (buttons, logos, icons)
molecules/   → Composed atoms (cards, selectors)
organisms/   → Complex sections (navbar, hero, footer)
templates/   → Page layouts (TailwindGrid)
```

**Import pattern:**
```typescript
import { Button } from '@/app/components/atoms/button';
```

**Key rule**: ALL organism components MUST use TailwindGrid for layout consistency

---

### 3. Animations

**Standard pattern: Viewport-based** (NOT page load)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
>
```

**Key rules:**
- Use `whileInView`, not `animate`
- Spring physics: `damping: 30, stiffness: 300` (standard)
- Stagger: `0.1s` for grids, `0.15s` for lists
- Only transform/opacity for performance

**Details**: @docs/ANIMATIONS.md

---

### 4. Database (Supabase)

**Three client types:**

```typescript
// Server components, API routes
import { createClient } from '@/lib/supabase/server';

// Analytics only
import { createAnalyticsClient } from '@/lib/supabase/analytics';

// Browser components
import { createClient } from '@/lib/supabase/client';
```

**Key rules:**
- Row Level Security (RLS) enabled on ALL tables
- Use PgBouncer (port 6543) for connections
- Always validate with Zod in API routes

**Schema & details**: @docs/SUPABASE.md

---

### 5. Middleware Chain (Next.js 16 Proxy)

**Execution order matters:**

```typescript
// proxy.ts
export async function proxy(request, event) {
  return chain([
    withSupabaseMiddleware,    // 1. Auth refresh (must be first)
    withAuthMiddleware,        // 2. Protect /admin
    withI18nMiddleware,        // 3. Locale routing
    withTrackingMiddleware,    // 4. Analytics
  ])(request, event);
}
```

**Key rule**: Dependencies must run before dependents

**Details**: @docs/MIDDLEWARE.md

---

### 6. API Standards

**All API routes must:**

```typescript
import { z } from 'zod';
import { ApiSuccess, ApiError } from '@/lib/api/response';

// 1. Define Zod schema
const Schema = z.object({ /* ... */ });

// 2. Validate
const result = Schema.safeParse(body);
if (!result.success) {
  return ApiError.validationError(result.error);
}

// 3. Return standardized response
return ApiSuccess.ok(data, 'Success message');
```

**Details**: See CLAUDE.md "API Standards" section or create docs/API.md

---

## Important Patterns

### Adding Translations

```bash
# 1. Add to both dictionaries
app/dictionaries/en.json
app/dictionaries/es.json

# 2. Use in server component
const text = await getDictionary(lang);

# 3. Use in client component
const t = useTranslations();
```

**With spacing:**
```tsx
<h1>
  {text.title}
  {' '}  {/* Explicit space */}
  {text.titlePrimary}
</h1>
```

---

### Creating Locale-Aware Pages

```typescript
// app/[lang]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <div>
      <h1>{text.home.title}</h1>
    </div>
  );
}
```

---

### Working with Rive Animations

```tsx
import { RiveAnimation } from '@/app/components/molecules/rive-animation';

<RiveAnimation
  artboardName="Artboard"
  hoverAnimationName="Hover"
  hover
/>
```

**Assets location**: `public/assets/rive/`

---

### GitHub Workflow & Issues

**Creating Issues:**
- Use appropriate template from `.github/ISSUE_TEMPLATE/`
  - 🚀 Feature Request - New functionality
  - 🐛 Bug Report - Errors or unexpected behavior
  - ✅ Task - Technical/operational work
  - ❓ Question - Discussions or inquiries
  - ⚡ Enhancement - Improvements to existing features
- Add priority labels: P0 (Critical) → P3 (Low)
- Reference related issues: `#123`

**Commit messages:**
```bash
git commit -m "feat: add new section

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Conventional commit types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation
- `chore:` - Maintenance
- `perf:` - Performance
- `test:` - Testing

**Pull Requests:**
- Reference issues: `Closes #123`
- Use descriptive titles
- Fill PR template completely

**Complete workflow guide**: @docs/GITHUB_WORKFLOW.md

---

## Key Configuration Files

### TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Import example:**
```typescript
import { Button } from '@/components/ui/button';
```

---

### Tailwind CSS v4

**No `tailwind.config.js`** - Uses CSS-based configuration:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #00BB31;
  --color-secondary: #00701D;
  --font-family-sans: "Hiruko", system-ui, sans-serif;
}

@custom-variant dark (&:is(.dark *));
```

---

### Image Optimization

**Remote patterns** in `next.config.js`:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'alkitu.com' },
  ],
}
```

**Always use Next.js Image:**
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority  // For above-fold images
/>
```

---

## Security & Best Practices

### Environment Variables

**Public** (browser-accessible):
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Private** (server-only):
```env
SUPABASE_SERVICE_ROLE_KEY=...  # NEVER expose in client
```

**Details**: @docs/ENVIRONMENT.md

---

### Row Level Security (RLS)

**Always enable RLS** on new tables:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "policy_name" ON table_name
FOR SELECT TO anon
USING (true);
```

**Details**: @docs/SUPABASE.md

---

### Performance

**Core Web Vitals targets:**
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1

**Always:**
- Use `next/image` component
- Enable ISR: `export const revalidate = 3600`
- GPU-accelerated transforms only (`x`, `y`, `scale`, `opacity`)

**Details**: @docs/PERFORMANCE.md

---

## Documentation is Your Source of Truth

**Remember:**

1. **Don't guess** - Read the relevant documentation
2. **Don't assume** - Verify in the docs
3. **Don't skip** - Documentation reading is NOT optional
4. **Don't improvise** - Follow established patterns

**When in doubt**: Start with @docs/README.md for the documentation index.

---

## Getting Help

- **Bugs/Issues**: @docs/TROUBLESHOOTING.md
- **Creating issues/PRs**: @docs/GITHUB_WORKFLOW.md
- **Setup questions**: @docs/SETUP.md
- **Architecture questions**: @docs/README.md → Specific guides
- **Deployment issues**: @docs/DEPLOYMENT.md

**This file is a guide, not a reference manual. For detailed information, always consult the specialized documentation.**
