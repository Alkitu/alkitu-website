# API Reference

This document provides detailed API documentation for hooks, utilities, context providers, and key functions in the Alkitu Portfolio project.

## Table of Contents

- [Hooks](#hooks)
  - [UI Hooks](#ui-hooks)
  - [Data Hooks](#data-hooks)
  - [DOM Hooks](#dom-hooks)
  - [Routing Hooks](#routing-hooks)
- [Context Providers](#context-providers)
- [Utilities](#utilities)
- [Components](#components)

## Hooks

All hooks are organized by category in `app/hooks/`:

```
app/hooks/
├── ui/          # UI-related hooks
├── data/        # Data fetching hooks
├── dom/         # DOM manipulation hooks
├── routing/     # Routing hooks
└── index.ts     # Barrel exports
```

### UI Hooks

#### `useTheme`

Manages theme state (light/dark mode).

**Location:** `app/context/ThemeContext.tsx`

**Usage:**
```typescript
import { useTheme } from '@/app/context/ThemeContext';

function Component() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

**API:**
```typescript
interface ThemeContextType {
  theme: Theme;              // Current theme setting
  setTheme: (theme: Theme) => void;  // Update theme
  resolvedTheme: Theme;      // Actual theme (never 'system')
}

type Theme = 'light' | 'dark';
```

**Notes:**
- Theme persists in cookies
- Auto-detects system theme on first visit
- `resolvedTheme` is the actual theme being displayed

---

#### `useCarousel`

Powers carousel/slider components with drag support.

**Location:** `app/hooks/ui/useCarousel.tsx`

**Usage:**
```typescript
import { useCarousel } from '@/app/hooks';

function Carousel({ dataCards }) {
  const {
    data,
    containerRef,
    centerOrder,
    paginate,
    handlePagerClick,
    itemWidth,
    containerWidth
  } = useCarousel(dataCards, 2);

  return (
    <div ref={containerRef}>
      {data.map((item, index) => (
        <Card key={index} data={item} />
      ))}
    </div>
  );
}
```

**Parameters:**
- `dataContainers`: Array of items to display
- `reduceGap`: Gap reduction factor (default: 2)

**Returns:**
```typescript
{
  data: any[];                    // Processed carousel items
  containerRef: RefObject;        // Ref for container element
  centerOrder: number;            // Current center item index
  paginate: (direction: number) => void;  // Navigate carousel
  handlePagerClick: (order: number) => void;  // Jump to specific item
  itemWidth: number | null;       // Width of carousel items
  containerWidth: number | null;  // Width of container
}
```

---

#### `useScreenWidth`

Returns current screen width with reactive updates.

**Location:** `app/hooks/ui/useScreenWidth.tsx`

**Usage:**
```typescript
import { useScreenWidth } from '@/app/hooks';

function ResponsiveComponent() {
  const screenWidth = useScreenWidth();

  return (
    <div>
      {screenWidth < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

**Returns:** `number | null` - Current window width in pixels

**Notes:**
- Returns `null` during SSR
- Updates on window resize
- Debounced for performance

---

#### `usePagination`

Manages pagination state for carousels.

**Location:** `app/hooks/ui/usePagination.tsx`

**Usage:**
```typescript
import { usePagination } from '@/app/hooks';

function PaginatedList({ items }) {
  const { data, centerOrder, paginate } = usePagination(items);

  return (
    <>
      <button onClick={() => paginate(-1)}>Previous</button>
      <button onClick={() => paginate(1)}>Next</button>
    </>
  );
}
```

**Parameters:**
- `dataContainers`: Array of items

**Returns:**
```typescript
{
  data: any[];            // Items with order property
  centerOrder: number;    // Current center index
  paginate: (direction: number, data: any[]) => void;  // Navigate
}
```

---

### DOM Hooks

#### `useElementRect`

Gets bounding rect of an element.

**Location:** `app/hooks/dom/useElementRect.tsx`

**Usage:**
```typescript
import { useElementRect } from '@/app/hooks';

function Component() {
  const { ref, rect } = useElementRect<HTMLDivElement>();

  return (
    <div ref={ref}>
      Width: {rect?.width}, Height: {rect?.height}
    </div>
  );
}
```

**Returns:**
```typescript
{
  ref: RefObject<T>;        // Ref to attach to element
  rect: DOMRect | null;     // Element bounding rect
}
```

**Notes:**
- Updates on window resize
- Returns `null` until element mounts

---

### Routing Hooks

#### `useLocalizedPath`

Generates locale-aware paths.

**Location:** `app/hooks/routing/useLocalizedPath.ts`

**Usage:**
```typescript
import { useLocalizedPath } from '@/app/hooks';

function NavLink() {
  const getPath = useLocalizedPath();

  return (
    <Link href={getPath('/projects')}>
      Projects
    </Link>
  );
}
```

**Returns:** `(path: string) => string` - Function that prefixes path with current locale

**Example:**
```typescript
getPath('/projects')  // Returns '/es/projects' or '/en/projects'
```

---

## Context Providers

### TranslationContext

Provides internationalization functionality.

**Location:** `app/context/TranslationContext.tsx`

**Provider:**
```typescript
<TranslationsProvider
  initialLocale="en"
  initialTranslations={translations}
>
  {children}
</TranslationsProvider>
```

**Hooks:**

#### `useTranslations`

Get translation function.

```typescript
const t = useTranslations();  // Global translations
const t = useTranslations('home');  // Scoped to 'home' namespace

// Usage
t('title')  // Returns translation for key
t('welcome', { name: 'John' })  // With params
```

#### `useTranslationContext`

Access full translation context.

```typescript
const {
  t,               // Translation function
  translations,    // Full translations object
  locale,          // Current locale
  setLocale,       // Change locale
  isLoading        // Loading state
} = useTranslationContext();
```

**API:**
```typescript
interface TranslationsContextType {
  t: (
    key: string,
    params?: Record<string, string | number>,
    namespace?: string
  ) => string;
  translations: Translations;
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  isLoading: boolean;
}

type Locale = 'en' | 'es';
```

---

### ThemeContext

Manages dark/light theme.

**Location:** `app/context/ThemeContext.tsx`

**Provider:**
```typescript
<ThemeProvider>
  {children}
</ThemeProvider>
```

**Hook:**
```typescript
const { theme, setTheme, resolvedTheme } = useTheme();
```

**API:**
```typescript
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme;  // Actual theme (light or dark)
}

type Theme = 'light' | 'dark';
```

---

### DropdownContext

Manages dropdown open/close state.

**Location:** `app/context/DropdownContext.tsx`

**Provider:**
```typescript
<DropdownProvider>
  {children}
</DropdownProvider>
```

**Hook:**
```typescript
const { setLanguageOpen } = useDropdownContext();

// Usage
setLanguageOpen(true);  // Open language dropdown
```

---

## Utilities

### `getDictionary`

Server-side function to load translations.

**Location:** `lib/dictionary.ts`

**Usage:**
```typescript
import { getDictionary } from '@/lib/dictionary';

export default async function Page({ params }) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return <h1>{text.home.title}</h1>;
}
```

**Signature:**
```typescript
async function getDictionary(locale: Locale): Promise<Translations>
```

**Parameters:**
- `locale`: `'en'` or `'es'`

**Returns:** `Promise<Translations>` - Full translation object

---

## Components

### Atomic Components

#### TailwindGrid

Grid layout wrapper for consistent spacing.

**Location:** `app/components/templates/grid/TailwindGrid.tsx`

**Usage:**
```typescript
import TailwindGrid from '@/app/components/templates/grid';

<TailwindGrid fullSize>
  <div className="col-span-full lg:col-start-3 lg:col-end-13">
    Content
  </div>
</TailwindGrid>
```

**Props:**
```typescript
interface TailwindGridProps {
  children: ReactNode;
  fullSize?: boolean;  // Full viewport height
  className?: string;
}
```

**Grid Structure:**
- 12 columns on desktop
- 4 columns on mobile/tablet
- Responsive gaps

---

### Organisms

#### FlexCarousel

Flexible carousel with drag support.

**Location:** `app/components/organisms/flex-carousel/FlexCarousel.tsx`

**Usage:**
```typescript
<FlexCarousel
  dataCards={items}
  type="testimonial"
  width={70}
  reduceGap={15}
/>
```

**Props:**
```typescript
interface FlexCarouselProps {
  width?: number;                    // Card width % (default: 60)
  reduceGap?: number;                // Gap reducer (default: 2)
  dataCards?: Record<string, unknown>[];  // Items to display
  className?: string;
  type?: 'classic' | 'image' | 'testimonial' | 'category' | 'post';
  setWordCategory?: (index: number) => void;  // Category callback
}
```

---

#### NavBar

Main navigation component.

**Location:** `app/components/organisms/navbar/NavBar.tsx`

**Features:**
- Responsive mobile/desktop layouts
- Animated menu transitions
- Scroll-based hide/show
- Theme toggle
- Language selector
- Contact modal

**Usage:**
```tsx
<NavBar />  // No props required
```

---

## Type Definitions

### Translations

Main translations type.

**Location:** `app/types/translations.ts`

```typescript
interface Translations {
  menu: {
    routes: Array<{
      name: string;
      pathname: string;
      iconLight: string;
      iconDark: string;
    }>;
    contact: string;
    languages: string;
    theme: string;
  };
  home: Record<string, unknown>;
  portfolio: Record<string, unknown>;
  blog: Record<string, unknown>;
  contact: Record<string, unknown>;
  // ... more sections
}
```

---

### Common Types

**Location:** `app/types/common.ts`

```typescript
type Locale = 'en' | 'es';
type Theme = 'light' | 'dark';

interface Route {
  name: string;
  pathname: string;
  iconLight: string;
  iconDark: string;
}
```

---

## Middleware

### withI18nMiddleware

Handles locale detection and routing.

**Location:** `middleware/withI18nMiddleware.ts`

**Behavior:**
1. Checks `NEXT_LOCALE` cookie
2. Falls back to `Accept-Language` header
3. Defaults to `es`
4. Redirects `/` to `/{locale}`
5. Validates locale in URL

**Configuration:**
```typescript
const DEFAULT_LOCALE: Locale = 'es';
const SUPPORTED_LOCALES: Locale[] = ['en', 'es'];
```

---

## Error Handling

### Translation Errors

When a translation key is not found:

```typescript
// Returns the key itself
t('missing.key')  // Returns 'missing.key'

// Console warning in development
console.warn('Translation key not found: missing.key')
```

### Type Errors

TypeScript strict mode is enabled with gradual enforcement:
- `noImplicitAny`: false (temporarily)
- `strictNullChecks`: true
- `strict`: true

---

## Performance

### Optimization Hooks

#### useMemo

Cache expensive computations:

```typescript
const riveConfig = useMemo(() => ({
  src: "/assets/rive/web_portfolio.riv",
  autoplay: true,
  artboard: artboardName
}), [artboardName]);
```

#### useCallback

Stabilize function references:

```typescript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

#### useTransition

Non-blocking state updates:

```typescript
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setData(newData);  // Non-blocking
});
```

---

## Best Practices

### Hook Usage

✅ **DO:**
- Use hooks at top level of component
- Add all dependencies to dependency arrays
- Use TypeScript for hook parameters and returns

❌ **DON'T:**
- Call hooks conditionally
- Call hooks in loops
- Call hooks in event handlers

### Context Usage

✅ **DO:**
- Create custom hooks for context access
- Throw errors if context is undefined
- Memoize context values

❌ **DON'T:**
- Use context for frequently changing values
- Create too many contexts
- Access context outside provider

---

## Migration Guide

### From JavaScript to TypeScript

1. Rename `.jsx` → `.tsx`
2. Add prop interfaces
3. Type hook returns
4. Fix implicit `any` errors

### From Class Components to Hooks

1. Convert `componentDidMount` → `useEffect`
2. Convert `this.state` → `useState`
3. Convert `this.method` → function
4. Lift context to hooks

---

## Troubleshooting

### Common Issues

**Issue:** Hook doesn't update
```typescript
// ❌ Missing dependency
useEffect(() => {
  doSomething(value);
}, []);

// ✅ Include all dependencies
useEffect(() => {
  doSomething(value);
}, [value]);
```

**Issue:** Infinite re-renders
```typescript
// ❌ Creating new object each render
useEffect(() => {
  setData({ key: 'value' });
}, [{ key: 'value' }]);

// ✅ Memoize object
const config = useMemo(() => ({ key: 'value' }), []);
useEffect(() => {
  setData(config);
}, [config]);
```

---

## Further Reading

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Framer Motion API](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
