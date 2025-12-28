# Internationalization (i18n) Guide

Complete guide to the dual i18n architecture supporting English and Spanish throughout the application.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Translation Files](#translation-files)
4. [Server-Side i18n](#server-side-i18n)
5. [Client-Side i18n](#client-side-i18n)
6. [Routing & Middleware](#routing--middleware)
7. [Adding New Translations](#adding-new-translations)
8. [Adding New Locales](#adding-new-locales)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Supported Locales

- **English** (`en`)
- **Spanish** (`es`) - Default locale

### Key Features

- **Dual i18n system**: Server-side + client-side translation loading
- **Automatic routing**: `/{locale}/*` URL structure
- **Cookie persistence**: User's language preference saved
- **SEO-friendly**: Each locale has dedicated URLs
- **Type-safe**: TypeScript types for translation keys
- **No flash**: Locale loads before initial render

---

## Architecture

### Dual i18n Approach

This project uses **two complementary i18n systems**:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Request                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
           ┌────────────────────────┐
           │  withI18nMiddleware    │
           │  (proxy.ts)            │
           │  - Detect locale       │
           │  - Set cookie          │
           │  - Redirect if needed  │
           └────────────┬───────────┘
                        │
            ┌───────────┴──────────┐
            │                      │
            ↓                      ↓
  ┌─────────────────┐    ┌─────────────────┐
  │  Server-Side    │    │  Client-Side    │
  │  i18n           │    │  i18n           │
  ├─────────────────┤    ├─────────────────┤
  │ getDictionary() │    │ useTranslations()│
  │ - Layouts       │    │ - Components    │
  │ - Pages         │    │ - Interactive   │
  │ - Metadata      │    │ - Real-time     │
  └─────────────────┘    └─────────────────┘
```

**Why Dual System?**

1. **Server-side**: For pages, layouts, metadata (SEO)
2. **Client-side**: For interactive components, dynamic content
3. **Flexibility**: Use right tool for the job
4. **Performance**: Server components don't ship i18n to browser

---

## Translation Files

### File Structure

```
app/dictionaries/
├── en.json     # English translations
└── es.json     # Spanish translations
```

**Both systems use the same JSON files** - no duplication.

### Translation Schema

```json
{
  "metadata": {
    "title": "Alkitu - Web Development",
    "description": "Modern portfolio website"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "projects": "Projects",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "title": "Welcome to",
      "titlePrimary": "Alkitu",
      "subtitle": "We build exceptional web experiences"
    },
    "sections": [
      { "id": "hero-section", "label": "Hero" },
      { "id": "projects-section", "label": "Projects" }
    ]
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Try again"
  }
}
```

### Nested Structure Guidelines

**Good nesting:**
```json
{
  "page": {
    "section": {
      "component": "Translation"
    }
  }
}
```

**Access:**
```typescript
text.page.section.component
```

**Keep depth reasonable** (max 4 levels):
- Level 1: Page (`home`, `about`, `projects`)
- Level 2: Section (`hero`, `skills`, `contact`)
- Level 3: Component (`title`, `subtitle`, `cta`)
- Level 4: Variant (rarely needed)

---

## Server-Side i18n

### Usage in Pages

```typescript
// app/[lang]/page.tsx
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <div>
      <h1>{text.home.hero.title}</h1>
      <p>{text.home.hero.subtitle}</p>
    </div>
  );
}
```

### Usage in Layouts

```typescript
// app/[lang]/layout.tsx
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <nav>{text.navigation.home}</nav>
        {children}
      </body>
    </html>
  );
}
```

### Metadata Generation

```typescript
// app/[lang]/page.tsx
import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}
```

### getDictionary Implementation

```typescript
// lib/dictionary.ts
import type { Locale } from '@/i18n.config';

const dictionaries = {
  en: () => import('@/app/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/app/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
```

**Benefits:**
- Dynamic import (code splitting)
- Type-safe with TypeScript
- Cached by Next.js

---

## Client-Side i18n

### TranslationsProvider Setup

```tsx
// app/context/TranslationContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

type Dictionary = Record<string, any>;

const TranslationsContext = createContext<Dictionary | null>(null);

export function TranslationsProvider({
  children,
  initialTranslations,
}: {
  children: ReactNode;
  initialTranslations: Dictionary;
}) {
  return (
    <TranslationsContext.Provider value={initialTranslations}>
      {children}
    </TranslationsContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within TranslationsProvider');
  }
  return context;
}
```

### Wrapping App

```tsx
// app/[lang]/layout.tsx
import { TranslationsProvider } from '@/app/context/TranslationContext';
import { getDictionary } from '@/lib/dictionary';

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <TranslationsProvider initialTranslations={text}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
```

### Usage in Client Components

```tsx
'use client';

import { useTranslations } from '@/app/context/TranslationContext';

export function ClientComponent() {
  const t = useTranslations();

  return (
    <div>
      <h2>{t.home.hero.title}</h2>
      <button>{t.common.cta}</button>
    </div>
  );
}
```

### Dynamic Locale Switching

```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'en' | 'es') => {
    // Replace locale in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;  // Replace /en/ or /es/
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <div>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('es')}>Español</button>
    </div>
  );
}
```

---

## Routing & Middleware

### URL Structure

```
/                       → Redirects to /{defaultLocale} (/es)
/en                     → English homepage
/es                     → Spanish homepage
/en/about               → English about page
/es/projects/my-project → Spanish project detail
```

### withI18nMiddleware

Located in `middleware/withI18nMiddleware.ts`:

```typescript
import { NextMiddleware, NextResponse } from 'next/server';

const DEFAULT_LOCALE = 'es';
const SUPPORTED_LOCALES = ['en', 'es'];
const COOKIE_NAME = 'NEXT_LOCALE';

export function withI18nMiddleware(next: NextMiddleware): NextMiddleware {
  return async function middleware(request, event) {
    const { pathname, search } = request.nextUrl;
    let currentLocale = request.cookies.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;

    // Exclude admin routes from i18n
    if (pathname.startsWith('/admin')) {
      return next(request, event);
    }

    // Skip API routes and static files
    if (
      pathname.match(/^\/(?:api|_next|.*\..*)/) ||
      pathname === '/not-found'
    ) {
      return next(request, event);
    }

    const pathLocale = getLocaleFromPath(pathname);
    let response: NextResponse;

    // Root path → redirect to locale
    if (pathname === '/') {
      const redirectLocale = request.cookies.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
      response = NextResponse.redirect(
        new URL(`/${redirectLocale}${search}`, request.url)
      );
      currentLocale = redirectLocale;
    }
    // Path has locale → continue
    else if (pathLocale) {
      let result = (await next(request, event)) || NextResponse.next();
      if (!(result instanceof NextResponse)) {
        result = NextResponse.next(result);
      }
      response = result as NextResponse;
      currentLocale = pathLocale;
    }
    // Path missing locale → add it
    else {
      const newPathname = `/${currentLocale}${pathname}${search}`;
      response = NextResponse.redirect(new URL(newPathname, request.url));
    }

    // Set locale cookie
    response.cookies.set(COOKIE_NAME, currentLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,  // 1 year
      sameSite: 'strict',
    });

    return response;
  };
}

function getLocaleFromPath(pathname: string): string | null {
  const firstSegment = pathname.split('/')[1];
  return SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : null;
}
```

### Locale Detection Priority

1. **URL path** - `/en/...` or `/es/...`
2. **Cookie** - `NEXT_LOCALE` cookie
3. **Default** - `es` (Spanish)

**User flow:**

1. First visit: Redirect `/` → `/es` (default)
2. Switch to English: Navigate to `/en`, cookie set to `en`
3. Next visit: Redirect `/` → `/en` (from cookie)

---

## Adding New Translations

### Step 1: Add to JSON Files

**English (`app/dictionaries/en.json`):**
```json
{
  "newSection": {
    "title": "New Section",
    "description": "Description here"
  }
}
```

**Spanish (`app/dictionaries/es.json`):**
```json
{
  "newSection": {
    "title": "Nueva Sección",
    "description": "Descripción aquí"
  }
}
```

### Step 2: Use in Server Component

```tsx
// app/[lang]/page.tsx
export default async function Page({ params }) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return <h1>{text.newSection.title}</h1>;
}
```

### Step 3: Use in Client Component

```tsx
'use client';

import { useTranslations } from '@/app/context/TranslationContext';

export function Component() {
  const t = useTranslations();
  return <h1>{t.newSection.title}</h1>;
}
```

### Handling Text with Spacing

When splitting text between keys, add explicit spacing:

```tsx
// ❌ Wrong - missing space
<h1>
  {text.hero.title}
  {text.hero.titlePrimary}
</h1>
// Renders: "Welcome toAlkitu"

// ✅ Correct - explicit space
<h1>
  {text.hero.title}
  {' '}
  {text.hero.titlePrimary}
</h1>
// Renders: "Welcome to Alkitu"
```

---

## Adding New Locales

### Step 1: Update i18n Config

```typescript
// i18n.config.ts
export const i18n = {
  defaultLocale: 'es',
  locales: ['en', 'es', 'fr'],  // Add 'fr'
} as const;

export type Locale = (typeof i18n)['locales'][number];
```

### Step 2: Create Translation File

```bash
# Create French translations
cp app/dictionaries/en.json app/dictionaries/fr.json
# Translate content in fr.json
```

### Step 3: Update Dictionary Loader

```typescript
// lib/dictionary.ts
const dictionaries = {
  en: () => import('@/app/dictionaries/en.json').then((m) => m.default),
  es: () => import('@/app/dictionaries/es.json').then((m) => m.default),
  fr: () => import('@/app/dictionaries/fr.json').then((m) => m.default),  // Add
};
```

### Step 4: Update Middleware

```typescript
// middleware/withI18nMiddleware.ts
const SUPPORTED_LOCALES = ['en', 'es', 'fr'];  // Add 'fr'
```

### Step 5: Add to Language Switcher

```tsx
<button onClick={() => switchLocale('fr')}>Français</button>
```

---

## Best Practices

### 1. Keep Keys Semantic, Not Literal

```json
// ✅ Good - semantic keys
{
  "hero": {
    "title": "Welcome",
    "cta": "Get Started"
  }
}

// ❌ Bad - literal keys
{
  "hero": {
    "welcome": "Welcome",
    "getStarted": "Get Started"
  }
}
```

### 2. Use Consistent Nesting

```json
// ✅ Good - consistent structure
{
  "home": { "hero": { "title": "..." } },
  "about": { "hero": { "title": "..." } }
}

// ❌ Bad - inconsistent
{
  "home": { "heroTitle": "..." },
  "about": { "title": "..." }
}
```

### 3. Avoid Hardcoded Text

```tsx
// ❌ Bad
<button>Click here</button>

// ✅ Good
<button>{t.common.cta}</button>
```

### 4. Provide Fallbacks

```tsx
// ✅ Safe with optional chaining
const title = text?.home?.hero?.title ?? 'Default Title';
```

### 5. Extract Common Translations

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

Reuse across components:

```tsx
<button>{t.common.save}</button>
<button>{t.common.cancel}</button>
```

---

## Troubleshooting

### Translation Key Not Found

**Symptom**: `Cannot read property 'title' of undefined`

**Solutions:**

1. **Check key exists in both `en.json` and `es.json`**

2. **Verify nesting structure matches**

```typescript
// Check structure
console.log(JSON.stringify(text, null, 2));
```

3. **Use optional chaining**

```typescript
const title = text?.home?.hero?.title ?? 'Fallback';
```

---

### Locale Not Switching

**Symptom**: Clicking language switcher doesn't change content

**Solutions:**

1. **Check cookie is being set**

```bash
# In browser DevTools > Application > Cookies
# Should see: NEXT_LOCALE = en or es
```

2. **Verify middleware is running**

```typescript
// Add console.log in withI18nMiddleware.ts
console.log('Current locale:', currentLocale);
```

3. **Clear browser cache** and cookies

---

### Hydration Mismatch with Translations

**Symptom**: "Hydration failed" error with translated content

**Solution**: Ensure server and client receive same translations

```tsx
// ✅ Correct - TranslationsProvider initialized with server data
<TranslationsProvider initialTranslations={text}>
  {children}
</TranslationsProvider>
```

---

### Missing Translations in Production

**Symptom**: Works locally, broken in Vercel

**Solution**: Verify JSON files are committed

```bash
git add app/dictionaries/en.json app/dictionaries/es.json
git commit -m "fix: add translation files"
git push
```

---

## See Also

- [MIDDLEWARE.md](MIDDLEWARE.md) - Middleware chain details
- [SETUP.md](SETUP.md) - Initial setup
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

---

**Pro Tip**: Use a translation management service like [Locize](https://locize.com/) or [Phrase](https://phrase.com/) for larger projects with many translators.
