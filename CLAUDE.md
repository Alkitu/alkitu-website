# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev          # Start development server at http://localhost:3000

# Building
npm run build        # Build production bundle
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## Architecture Overview

This is a **Next.js 16** portfolio website with internationalization (i18n) support for English and Spanish. The project uses the **App Router** with a custom i18n implementation.

### Internationalization Architecture

The app uses a **dual i18n approach**:

1. **Server-side i18n** via `[lang]` dynamic route segments
   - Pages are located in `app/[lang]/page.tsx` and `app/[lang]/layout.tsx`
   - Server components fetch translations using `getDictionary(lang)` from `lib/dictionary.ts`
   - Translation files: `app/dictionaries/en.json` and `app/dictionaries/es.json`

2. **Client-side i18n** via React Context
   - `TranslationsProvider` in `app/context/TranslationContext.tsx` wraps the app
   - Client components use `useTranslations()` or `useTranslationContext()` hooks
   - Translation files: `locales/en/common.json` and `locales/es/common.json`
   - API endpoint `/api/translations` dynamically loads translations when locale changes

3. **Middleware-based routing** (`proxy.ts`)
   - Custom middleware chain pattern in `middleware/chain.ts`
   - `withI18nMiddleware` handles locale detection and routing
   - Redirects `/` to `/{locale}` based on `NEXT_LOCALE` cookie
   - Automatically prefixes paths with locale if missing
   - Default locale: `es`, supported locales: `['en', 'es']`

### Key Configuration

- **TypeScript path aliases**: `@/*` maps to project root (configured in `tsconfig.json`)
- **Image optimization**: Disabled (`unoptimized: true`) with remote patterns for Unsplash, Picsum, Medium, and Google User Content
- **Styling**: Tailwind CSS with custom color palette (primary: `#00BB31`, secondary: `#00701D`) and custom font family (Hiruko)
- **Animations**: Rive animations via `@rive-app/react-canvas` (e.g., `RiveAnimation` component uses `/rive/web_portfolio.riv`)
- **Motion**: Framer Motion for transitions and animations

### Project Structure

```
app/
├── [lang]/              # Locale-specific pages
│   ├── layout.tsx       # Root layout with TranslationsProvider
│   ├── page.tsx         # Home page
│   └── components/      # Locale-specific components (Header, LanguageSelector)
├── components/          # Shared React components
│   ├── sections/        # Page sections (Hero, Skills, Projects, etc.)
│   ├── ui/              # UI primitives (buttons, carousel, backdrop)
│   ├── rive/            # Rive animation components
│   └── ...
├── context/             # React contexts (TranslationContext, languageContext)
├── api/                 # API routes (translations endpoint)
├── dictionaries/        # Server-side translation files
└── styles/              # Global CSS

middleware/              # Custom middleware implementations
lib/                     # Utility functions (dictionary loader)
locales/                 # Client-side translation files
i18n.config.ts          # i18n configuration (locales, default locale)
proxy.ts                 # Middleware entry point
```

### Important Patterns

**Adding new translations:**
- Server-side: Update `app/dictionaries/{locale}.json`
- Client-side: Update `locales/{locale}/common.json`
- Access server-side: `const text = await getDictionary(lang); text.home.title`
- Access client-side: `const t = useTranslations(); t('home.title')`

**Creating locale-aware pages:**
- Place in appropriate directory (e.g., `app/projects/[lang]/page.tsx` or `app/[lang]/projects/page.tsx`)
- Accept `params: Promise<{ lang: Locale }>` prop
- Use `await params` to extract locale
- Pass locale to components or fetch translations with `getDictionary(lang)`

**Component organization:**
- Section components go in `app/components/sections/`
- Reusable UI components go in `app/components/ui/`
- Locale-specific components go in `app/[lang]/components/`

**Working with Rive animations:**
- Assets stored in `public/rive/`
- Use `RiveAnimation` component with props: `artboardName`, `hoverAnimationName`, `hover`
