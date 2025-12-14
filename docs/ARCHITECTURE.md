# Architecture Documentation

This document provides an overview of the Alkitu Portfolio website architecture, design decisions, and system organization.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Routing & Navigation](#routing--navigation)
- [Internationalization (i18n)](#internationalization-i18n)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Data Flow](#data-flow)
- [Performance Optimizations](#performance-optimizations)

## Technology Stack

### Core Framework
- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5.x** - Type-safe development

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Rive** - Interactive animation runtime

### Build & Development
- **Webpack** - Module bundler (via Next.js)
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS transformation

### Utilities
- **Zod** - Runtime type validation
- **cookies-next** - Cookie management
- **next-themes** - Theme management (custom implementation)

## Project Structure

```
alkitu-website/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # Localized routes
│   │   ├── layout.tsx           # Root layout with locale
│   │   ├── page.tsx             # Home page
│   │   ├── projects/            # Projects section
│   │   ├── blog/                # Blog section
│   │   └── contact/             # Contact page
│   │
│   ├── components/              # Component library
│   │   ├── atoms/               # Basic UI elements
│   │   ├── molecules/           # Composed components
│   │   ├── organisms/           # Complex sections
│   │   └── templates/           # Page layouts
│   │
│   ├── context/                 # React Context providers
│   │   ├── ThemeContext.tsx    # Theme state
│   │   ├── TranslationContext.tsx  # i18n state
│   │   ├── DropdownContext.tsx # Dropdown state
│   │   └── Providers.tsx        # Provider composition
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── data/               # Data fetching hooks
│   │   ├── dom/                # DOM manipulation hooks
│   │   ├── routing/            # Routing hooks
│   │   └── ui/                 # UI-related hooks
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── translations.ts     # i18n types
│   │   ├── common.ts           # Shared types
│   │   ├── project.ts          # Project types
│   │   └── blog.ts             # Blog types
│   │
│   ├── dictionaries/            # Translation files
│   │   ├── en.json             # English
│   │   └── es.json             # Spanish
│   │
│   └── data/                    # Static data
│       ├── blog-posts.json     # Blog post metadata
│       └── projects.json        # Project data
│
├── lib/                         # Shared utilities
│   ├── dictionary.ts           # i18n loader
│   └── utils.ts                # Helper functions
│
├── middleware/                  # Next.js middleware
│   ├── chain.ts                # Middleware composition
│   ├── withI18nMiddleware.ts   # Locale routing
│   ├── withAuthMiddleware.ts   # Authentication (admin)
│   └── withTrackingMiddleware.ts  # Analytics
│
├── public/                      # Static assets
│   ├── assets/                 # Images, icons, etc.
│   │   └── rive/               # Rive animation files
│   └── icons/                  # SVG icons
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind & custom CSS
│
└── docs/                        # Documentation
    ├── CODE_CONVENTIONS.md
    ├── ARCHITECTURE.md
    ├── CONTRIBUTING.md
    └── API_REFERENCE.md
```

## Routing & Navigation

### App Router Structure

The application uses Next.js App Router with dynamic locale segments:

```
/[lang]/                    # Locale-specific routes
  ├── /                     # Home page
  ├── /projects             # Projects listing
  │   └── /[project]        # Individual project
  ├── /blog                 # Blog listing
  └── /contact              # Contact page
```

### Locale Handling

**Supported Locales:** `en` (English), `es` (Spanish)
**Default Locale:** `es`

Route examples:
- `/es` → Spanish home page
- `/en/projects` → English projects page
- `/es/projects/alkitu-website` → Spanish project detail

### Middleware Chain

```typescript
// middleware.ts
export default chain([
  withI18nMiddleware,      // Locale detection & routing
  withAuthMiddleware,       // Admin authentication
  withTrackingMiddleware    // Analytics tracking
]);
```

**Flow:**
1. Request arrives → i18n middleware detects locale
2. Redirects `/` to `/{locale}` based on `NEXT_LOCALE` cookie
3. Auth middleware checks admin routes
4. Tracking middleware logs page views
5. Request proceeds to page component

## Internationalization (i18n)

### Dual i18n Approach

The app uses both server-side and client-side internationalization:

#### Server-Side (Pages & Layouts)
```typescript
// app/[lang]/page.tsx
import { getDictionary } from '@/lib/dictionary';

export default async function Page({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return <Component text={text} />;
}
```

#### Client-Side (Interactive Components)
```typescript
// Component.tsx
'use client';
import { useTranslations } from '@/app/context/TranslationContext';

export default function Component() {
  const t = useTranslations();

  return <h1>{t('home.title')}</h1>;
}
```

### Translation Structure

```json
{
  "menu": {
    "routes": [...],
    "contact": "Contact me"
  },
  "home": {
    "heroSection": {...},
    "aboutSection": {...}
  },
  "portfolio": {...},
  "blog": {...}
}
```

**Type Safety:**
All translations are typed via `Translations` interface in `app/types/translations.ts`.

## Component Architecture

### Atomic Design Methodology

```
Atoms → Molecules → Organisms → Templates → Pages
```

**Atoms** (Basic building blocks)
- `Button`, `Logo`, `Icon`
- Self-contained, highly reusable
- No business logic

**Molecules** (Simple combinations)
- `Card`, `Modal`, `FilterButtons`
- Compose multiple atoms
- Limited business logic

**Organisms** (Complex sections)
- `NavBar`, `Hero`, `Footer`
- Compose molecules & atoms
- May contain business logic
- All use `TailwindGrid` for layout consistency

**Templates** (Page layouts)
- `TailwindGrid` - Grid system wrapper
- Define page structure
- No content-specific logic

**Pages** (Routes)
- Server components in `app/[lang]/`
- Fetch data and pass to organisms
- Handle locale and routing

### Component Patterns

#### Server Component (Data Fetching)
```typescript
// app/[lang]/projects/page.tsx
export default async function ProjectsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return <ProjectsPreview text={text} />;
}
```

#### Client Component (Interactivity)
```typescript
// app/components/organisms/navbar/NavBar.tsx
'use client';

export default function NavBar() {
  const [isOpen, toggleOpen] = useCycle(false, true);
  // Interactive logic...

  return (
    <motion.nav>
      {/* Animated UI */}
    </motion.nav>
  );
}
```

## State Management

### State Hierarchy

```
Global State (Context)
  ├── ThemeContext          # light/dark theme
  ├── TranslationContext    # locale & translations
  └── DropdownContext       # dropdown state

Component State (useState)
  └── Local UI state        # modals, tabs, forms
```

### Context Providers

All contexts are composed in `Providers.tsx`:

```typescript
<ThemeProvider>
  <TranslationsProvider locale={locale} initialTranslations={translations}>
    <DropdownProvider>
      {children}
    </DropdownProvider>
  </TranslationsProvider>
</ThemeProvider>
```

**Access patterns:**
```typescript
const { theme, setTheme, resolvedTheme } = useTheme();
const { locale, setLocale, translations } = useTranslationContext();
const t = useTranslations();  // Scoped translation function
```

## Styling System

### Tailwind Configuration

**Custom Colors:**
```css
--primary: 0 187 49;        /* #00BB31 */
--secondary: 0 112 29;      /* #00701D */
--tertiary: #00FF19;
```

**Theme Switching:**
- Light/Dark mode via `.dark` class
- Automatic detection on first visit
- Persisted in cookies
- CSS variables for all colors

### CSS Architecture

```css
@theme { /* Tailwind v4 theme tokens */ }
@layer base { /* CSS variables */ }

/* Dark mode */
.dark {
  --background: 15 15 15;
  --foreground: 250 250 250;
}
```

### Animation System

**Framer Motion Standards:**
- Viewport-based triggers (`whileInView`)
- Spring physics for natural motion
- Staggered children for lists
- AnimatePresence for conditionals

**Common Variants:**
```typescript
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
```

## Data Flow

### Server → Client Data Flow

```
1. Request → Middleware (locale detection)
2. Page Component (server) → getDictionary(locale)
3. Pass translations to client components
4. Client components use TranslationContext
5. Render with localized content
```

### Example Flow: Projects Page

```typescript
// 1. Server: Fetch translations
const text = await getDictionary(lang);

// 2. Server: Pass to organism
<ProjectsPreview text={text} />

// 3. Organism: Distribute to molecules
<FilterButtons categories={text.portfolio.categories} />

// 4. Molecule: Use translations
{category.name}
```

### State Updates

```
User Action → Event Handler → setState → Re-render
           ↓
    Context Update (if global)
           ↓
    All subscribed components re-render
```

## Performance Optimizations

### Image Optimization

```typescript
<Image
  src={image}
  width={1080}
  height={720}
  loading="lazy"          // Lazy load off-screen images
  priority={index === 0}  // Priority for above-fold
  placeholder="blur"      // Blur placeholder
  blurDataURL="..."
/>
```

### Code Splitting

- Route-based automatic splitting via Next.js App Router
- Dynamic imports for heavy components
- Lazy loading for images and animations

### Caching Strategy

- Static page generation where possible
- Client-side translation caching via Context
- Cookie-based locale persistence

### Bundle Optimization

```javascript
// next.config.js
webpack: (config) => {
  config.experiments = { asyncWebAssembly: true };
  // WASM support for Rive animations
}
```

### Rive Animation Optimization

```typescript
// Preload WASM runtime
RuntimeLoader.setWasmUrl(riveWASMResource);

// Memoize animation config
const riveConfig = useMemo(() => ({
  src: "/assets/rive/web_portfolio.riv",
  autoplay: true,
  artboard: artboardName
}), [artboardName]);
```

## Security Considerations

### Type Safety

- TypeScript strict mode (gradual enforcement)
- Zod schemas for runtime validation
- ESLint rules prevent `any` types

### Authentication

- Admin routes protected via middleware
- Cookie-based session management
- Route guards in `withAuthMiddleware`

### XSS Prevention

- React escapes content by default
- Sanitized user inputs
- CSP headers (configured in Next.js)

## Deployment Architecture

### Build Process

```bash
npm run build
  ↓
Next.js compilation
  ↓
Static optimization
  ↓
Asset generation
  ↓
Production bundle
```

### Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://alkitu.com
NEXT_LOCALE=es
```

### Edge Cases Handled

1. Missing locale → Redirect to default (`es`)
2. Invalid locale → 404 or redirect
3. Missing translations → Fallback to key
4. Theme flash → Blocking script in `<head>`
5. Hydration mismatches → Server/client theme sync

## Future Considerations

### Scalability

- Currently static data (JSON files)
- Consider CMS for content management
- API routes for dynamic content
- Database for user-generated content

### Features to Add

- Search functionality
- Blog comments
- Analytics dashboard
- Admin panel improvements
- PWA support

### Performance Monitoring

- Consider adding performance metrics
- Lighthouse CI integration
- Web Vitals tracking
- Error boundary logging
