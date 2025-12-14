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
   - Translation files: `app/dictionaries/{locale}.json` (same as server-side)
   - API endpoint `/api/translations` dynamically loads translations when locale changes

3. **Middleware-based routing** (`middleware/withI18nMiddleware.ts`)
   - Custom middleware chain pattern in `middleware/chain.ts`
   - `withI18nMiddleware` handles locale detection and routing
   - Redirects `/` to `/{locale}` based on `NEXT_LOCALE` cookie
   - Automatically prefixes paths with locale if missing
   - **Default locale: `es`** (configured in `withI18nMiddleware.ts` as `DEFAULT_LOCALE`)
   - **Note**: `i18n.config.ts` shows `defaultLocale: 'en'` but middleware uses `es`
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
│   ├── rive-animation/  # Rive animation wrapper component
│   ├── card/          # Project cards
│   └── ...
├── organisms/         # Complex composed components
│   ├── navbar/        # Main navigation
│   ├── footer/        # Site footer
│   ├── hero-section/
│   ├── skills-section/
│   ├── projects-section/
│   ├── blog-content/   # Blog post content wrapper
│   ├── blog-grid/      # Grid layout for blog posts
│   ├── blog-list/      # List layout for blog posts
│   ├── blog-hero/      # Featured blog post hero
│   ├── page-header/    # Page header component
│   └── ...
└── templates/         # Page layouts
    └── grid/          # TailwindGrid wrapper
```

**Component Organization:**
- All components follow the pattern: `app/components/{atoms|molecules|organisms|templates}/component-name/`
- Each component folder contains its main file and an `index.ts` barrel export

### Key Configuration

- **TypeScript path aliases**: `@/*` maps to project root (configured in `tsconfig.json`)
- **Image optimization**: Disabled (`unoptimized: true`) with remote patterns for Unsplash, Picsum, Medium, and Google User Content
- **Styling**:
  - Tailwind CSS with `class` strategy for dark mode
  - Custom color palette: primary `#00BB31`, secondary `#00701D`, tertiary `#00FF19`
  - Custom font families: Hiruko (Regular, Bold, Black, Light)
  - CSS variables for theme colors: `--background`, `--foreground`, `--card`, `--border`, etc.
- **Animations**:
  - Rive animations via `@rive-app/react-canvas` (assets in `public/assets/rive/`)
  - Framer Motion for transitions and scroll animations
- **React Version**: React 19.2.0 with legacy-peer-deps for compatibility

### Theme System

The app uses a custom theme system with light/dark modes:

- **Theme Context**: `app/context/ThemeContext.tsx` provides `useTheme()` hook
- **Theme values**: `'light'` or `'dark'` (no system option - auto-detects on first visit)
- **First visit behavior**: Detects system theme and saves to cookie
- **Components**: Use `resolvedTheme` from context to get actual theme (light/dark)
- **Logo switching**: `AlkituLogo` component switches between light/dark SVG versions based on theme
- **SSR handling**: Theme script in `layout.tsx` prevents flash of unstyled content

### Important Patterns

**Adding new translations:**
- Server-side: Update `app/dictionaries/{locale}.json`
- Client-side: Uses same files via API endpoint
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
- **IMPORTANT**: All organism components MUST use TailwindGrid for layout consistency
  - Import: `import TailwindGrid from '@/app/components/templates/grid'`
  - Wrap content in `<TailwindGrid>` and use grid columns: `col-span-full lg:col-start-3 lg:col-end-13`
  - Example: PageHeader, PostHero, all section components

**Working with Rive animations:**
- Assets stored in `public/assets/rive/`
- Use `RiveAnimation` component from `app/components/molecules/rive-animation/`
- Props: `artboardName`, `hoverAnimationName`, `hover`
- Default source: `/assets/rive/web_portfolio.riv`
- **WASM Preloading**: The component uses `RuntimeLoader.setWasmUrl()` to preload the WASM runtime for better reliability and faster load times
- Webpack is configured to handle `.wasm` and `.riv` files as assets with `asyncWebAssembly` enabled

**Framer Motion animation patterns:**

This project uses **viewport-based animations** as the standard approach. Animations should trigger when elements scroll into view, not on page load.

**Core Animation Pattern:**
```tsx
// Standard viewport-based animation setup
const cardVariants = {
  hidden: { opacity: 0, /* + transform */ },
  show: { opacity: 1, /* + transform reset */ }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay between child animations
      delayChildren: 0.2     // Initial delay before first child
    }
  }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={cardVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Content */}
    </motion.div>
  ))}
</motion.div>
```

**Viewport Configuration:**
- `once: true` - Animation plays only once (won't re-trigger on scroll)
- `amount: 0.2` - Animation triggers when 20% of element is visible
- Always use `whileInView` instead of `animate` for scroll-triggered animations

**Animation Variants by Component Type:**

1. **Grid Layouts** (e.g., BlogGrid, ProjectGrid):
   - Entry: `scale: 0.8 → 1` with `opacity: 0 → 1`
   - Stagger: `0.1s` between children
   - Hover: `scale: 1.05`
   - Creates pop-in effect for card grids

2. **List Layouts** (e.g., BlogList):
   - Entry: `x: -20 → 0` with `opacity: 0 → 1` (slide from left)
   - Stagger: `0.15s` between children (longer than grid)
   - Hover: `scale: 1.02, x: 5` (subtle lift with slide)
   - Creates horizontal slide effect for vertical lists

3. **Hero/Featured Sections** (e.g., BlogHero):
   - Featured: `y: 30 → 0` with `opacity: 0 → 1` (slide from bottom)
   - Hover: `scale: 1.03, y: -5` (lift effect)
   - Recent/Side: `x: 20 → 0` with `opacity: 0 → 1` (slide from right)
   - Stagger delay: `0.3s` before children start

**Spring Physics Values:**
- Standard cards: `damping: 30, stiffness: 300`
- Hero sections: `damping: 25, stiffness: 200`
- Always use `type: "spring"` for natural motion

**Interaction States:**
- `whileHover`: Scale effects (1.02-1.05) with optional transforms
- `whileTap`: Scale down (0.95-0.98) for tactile feedback
- Apply to individual cards, not containers

**AnimatePresence Usage:**
- Use `mode="wait"` for content that should wait for exit before entering
- Always include unique `key` props on children for proper exit animations
- Wrap conditional rendering (e.g., filtered content)
- Example: BlogContent wraps category filtering with AnimatePresence

**Best Practices:**
- Remove CSS `transition` classes when using Framer Motion (they conflict)
- Use variants for cleaner animation orchestration
- Container animations should only handle stagger, not transforms
- Individual items handle their own transforms and interactions
- Consistent physics values across similar component types

**Logo components:**
- `Logo`: Text-based LuisUrdaneta logo with Tailwind animations (hover:scale-110)
- `AlkituLogo`: Theme-aware SVG logo that switches between light/dark versions
- Both have Link wrapper to homepage with locale

**Tailwind animations:**
- Use `hover:scale-110 active:scale-90 transition-transform` for scale effects
- Use `hover:shadow-[custom]` for glow effects
- Avoid inline styles; prefer Tailwind classes

**Git workflow:**
- Include co-authorship: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
- Add Claude Code attribution in commits when appropriate
