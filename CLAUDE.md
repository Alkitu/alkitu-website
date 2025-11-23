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

# Utilities
npm run sync:projects    # Sync project data to dictionaries (node lib/projects/sync-to-dictionaries.js)
```

## Troubleshooting

**Dev server showing stale errors:**
- Delete `.next` folder: `rm -rf .next`
- Restart dev server

**Deployment fails with dependency conflicts:**
- `.npmrc` with `legacy-peer-deps=true` is required for React 19 + @rive-app/react-canvas compatibility
- Do not remove this file

## Architecture Overview

This is a **Next.js 16** portfolio website with internationalization (i18n) support for English and Spanish. The project uses the **App Router** with **React 19** and follows **Atomic Design** principles.

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
   - **Default locale: `en`** (configured in `i18n.config.ts`)
   - Supported locales: `['en', 'es']`

### Component Architecture (Atomic Design)

Components are organized following Atomic Design methodology:

```
app/components/
├── atoms/              # Smallest UI components (buttons, logos, icons)
│   ├── logo/          # LuisUrdaneta text logo component
│   ├── alkitu-logo/   # Alkitu SVG logo (theme-aware)
│   ├── button/
│   └── ...
├── molecules/         # Composed atoms (cards, selectors, modals)
│   ├── select-theme/  # Theme selector dropdown
│   ├── select-language/ # Language selector dropdown
│   ├── card/          # Project cards
│   └── ...
├── organisms/         # Complex composed components
│   ├── navbar/        # Main navigation
│   ├── footer/        # Site footer
│   ├── hero-section/
│   ├── skills-section/
│   ├── projects-section/
│   └── ...
└── templates/         # Page layouts
    └── grid/          # TailwindGrid wrapper
```

**IMPORTANT:** There is NO `app/components/atomic/` folder. Components are directly under `atoms/`, `molecules/`, `organisms/`, and `templates/`.

### Key Configuration

- **TypeScript path aliases**: `@/*` maps to project root (configured in `tsconfig.json`)
- **Image optimization**: Disabled (`unoptimized: true`) with remote patterns for Unsplash, Picsum, Medium, and Google User Content
- **Styling**:
  - Tailwind CSS with `class` strategy for dark mode
  - Custom color palette: primary `#00BB31`, secondary `#00701D`, tertiary `#00FF19`
  - Custom font families: Hiruko (Regular, Bold, Black, Light)
  - CSS variables for theme colors: `--background`, `--foreground`, `--card`, `--border`, etc.
- **Animations**:
  - Rive animations via `@rive-app/react-canvas` (assets in `public/rive/`)
  - Framer Motion for transitions and scroll animations
- **React Version**: React 19.2.0 with legacy-peer-deps for compatibility

### Theme System

The app uses a custom theme system with light/dark modes:

- **Theme Context**: `app/context/ThemeContext.tsx` provides `useTheme()` hook
- **Theme values**: `'light'`, `'dark'`, or `'system'`
- **Components**: Use `resolvedTheme` from context to get actual theme (light/dark)
- **Logo switching**: `AlkituLogo` component switches between light/dark SVG versions based on theme

### Important Patterns

**Adding new translations:**
- Server-side: Update `app/dictionaries/{locale}.json`
- Client-side: Update `locales/{locale}/common.json`
- Access server-side: `const text = await getDictionary(lang); text.home.title`
- Access client-side: `const t = useTranslations(); t('home.title')`
- **Spacing**: When splitting text between `title` and `titlePrimary`, add `{' '}` in JSX to ensure proper spacing

**Creating locale-aware pages:**
- Accept `params: Promise<{ lang: Locale }>` prop
- Use `await params` to extract locale
- Pass `text` prop (from `getDictionary`) to all section components
- All section components expect `text` prop with structure `text.home.sectionName`

**Component organization:**
- Atoms: Smallest reusable components (buttons, logos, icons)
- Molecules: Composed components (cards, selectors)
- Organisms: Complex sections (navbar, footer, hero, skills, etc.)
- Templates: Page layouts
- **Import paths**: `import { ComponentName } from "@/app/components/atoms/component-name"`

**Working with Rive animations:**
- Assets stored in `public/rive/`
- Use `RiveAnimation` component with props: `artboardName`, `hoverAnimationName`, `hover`

**Framer Motion patterns:**
- Navbar uses `AnimatePresence` with `key` prop for exit animations
- `ParallaxText` component for scrolling background text with outline effect
- Always include `key` prop when using `AnimatePresence` for conditional rendering

**Logo components:**
- `Logo`: Text-based LuisUrdaneta logo with Tailwind animations (hover:scale-110)
- `AlkituLogo`: Theme-aware SVG logo that switches between light/dark versions
- Both have Link wrapper to homepage with locale

**Tailwind animations:**
- Use `hover:scale-110 active:scale-90 transition-transform` for scale effects
- Use `hover:shadow-[custom]` for glow effects
- Avoid inline styles; prefer Tailwind classes

**Git workflow:**
- Include co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`
- Add Claude Code attribution in commits when appropriate
