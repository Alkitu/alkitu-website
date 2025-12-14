# Code Conventions

This document outlines the coding standards and conventions for the Alkitu Portfolio project.

## Table of Contents

- [TypeScript](#typescript)
- [File Naming](#file-naming)
- [Component Structure](#component-structure)
- [Styling](#styling)
- [Imports](#imports)
- [State Management](#state-management)
- [Animations](#animations)
- [Internationalization](#internationalization)

## TypeScript

### Strict Mode Configuration

The project uses TypeScript strict mode with gradual enforcement:

```json
{
  "strict": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noImplicitAny": false,  // Gradually enabling
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

### Type Conventions

**✅ DO:**
- Use explicit types for function parameters and return values
- Define interfaces for component props
- Use `unknown` instead of `any` when type is uncertain
- Use `Record<string, unknown>` for flexible object types
- Create type aliases for complex types

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

**❌ DON'T:**
- Use `any` type (enforced by ESLint)
- Use implicit `any` in function parameters
- Skip type definitions for exported functions

```typescript
// ❌ Bad
export default function Button({ label, onClick, variant }) {  // Implicit any
  // ...
}
```

### Interfaces vs Types

- Use `interface` for component props and object shapes
- Use `type` for unions, intersections, and type aliases

```typescript
// ✅ Interface for props
interface CardProps {
  title: string;
  description: string;
}

// ✅ Type for unions
type Theme = 'light' | 'dark';
type Status = 'pending' | 'in_progress' | 'completed';
```

## File Naming

### Convention

- **Components**: PascalCase (e.g., `Button.tsx`, `NavBar.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTheme.tsx`, `useCarousel.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validators.ts`)
- **Types**: camelCase (e.g., `translations.ts`, `common.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### File Structure

Each component folder should contain:
```
component-name/
├── ComponentName.tsx       # Main component file
├── index.ts               # Barrel export
└── types.ts              # Component-specific types (optional)
```

Example barrel export (`index.ts`):
```typescript
export { default as ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Component Structure

### Atomic Design Organization

Components follow Atomic Design methodology:

```
app/components/
├── atoms/          # Smallest UI units (buttons, icons, logos)
├── molecules/      # Composed atoms (cards, forms, modals)
├── organisms/      # Complex compositions (navbar, footer, sections)
└── templates/      # Page layouts
```

### Component Template

```typescript
'use client';  // Only for client components

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SomeComponent } from '@/app/components/atoms/some-component';

// Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

// Variants (for Framer Motion)
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Component
export default function MyComponent({
  title,
  onAction,
  className = ''
}: MyComponentProps) {
  const [state, setState] = useState<string>('');

  const handleAction = () => {
    // Logic here
    onAction?.();
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      <h2>{title}</h2>
      {/* Component content */}
    </motion.div>
  );
}
```

### Client vs Server Components

**Use `'use client'` when:**
- Using React hooks (useState, useEffect, etc.)
- Using event handlers (onClick, onChange, etc.)
- Using browser APIs (window, document, etc.)
- Using context (useContext)
- Using third-party client libraries (Framer Motion, etc.)

**Keep as Server Component when:**
- Fetching data with async/await
- Accessing backend resources directly
- Using server-only utilities
- No interactivity needed

## Styling

### Tailwind CSS

- Use Tailwind utility classes directly in components
- Follow mobile-first responsive design
- Use custom color variables from `globals.css`

```tsx
// ✅ Good
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  <button className="bg-primary text-primary-foreground hover:scale-105 transition-transform">
    Click me
  </button>
</div>
```

### Custom Colors

Available color tokens:
- `primary` - Main brand color (#00BB31)
- `secondary` - Secondary brand color (#00701D)
- `background` / `foreground` - Base colors
- `card` / `card-foreground` - Card backgrounds
- `border` - Border colors
- `muted` / `muted-foreground` - Muted backgrounds/text

### Responsive Breakpoints

```
sm: 640px   // Small devices
md: 768px   // Medium devices
lg: 1024px  // Large devices
xl: 1280px  // Extra large devices
```

## Imports

### Import Order

1. External libraries (React, Next.js, etc.)
2. Internal types and interfaces
3. Components
4. Hooks
5. Utilities and helpers
6. Styles (if any)

```typescript
// ✅ Good import order
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import type { Translations } from '@/app/types/translations';

import { Button } from '@/app/components/atoms/button';
import { Card } from '@/app/components/molecules/card';

import { useTheme } from '@/app/hooks/ui/useTheme';
import { formatDate } from '@/lib/utils';
```

### Path Aliases

Use `@/` for absolute imports:

```typescript
// ✅ Good
import { Button } from '@/app/components/atoms/button';
import { useTheme } from '@/app/hooks/ui/useTheme';

// ❌ Bad
import { Button } from '../../../components/atoms/button';
```

## State Management

### Local State

Use `useState` for component-local state:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState<number>(0);
```

### Context

Use React Context for shared state:

```typescript
// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provide context
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Use context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Transitions

Use `useTransition` for non-blocking updates:

```typescript
const [isPending, startTransition] = useTransition();

const handleUpdate = () => {
  startTransition(() => {
    // Heavy computation
    updateData();
  });
};
```

## Animations

### Framer Motion Standards

**Viewport-based animations** (standard approach):

```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  transition={{ type: "spring", damping: 30, stiffness: 300 }}
>
  {content}
</motion.div>
```

**Common Animation Patterns:**

1. **Grid Layouts**: `scale: 0.8 → 1` with stagger
2. **List Layouts**: `x: -20 → 0` slide from left
3. **Hero Sections**: `y: 30 → 0` slide from bottom

**Spring Physics Values:**
- Standard: `damping: 30, stiffness: 300`
- Hero sections: `damping: 25, stiffness: 200`

### AnimatePresence

For conditional rendering:

```typescript
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

## Internationalization

### Using Translations

**Server Components:**
```typescript
import { getDictionary } from '@/lib/dictionary';

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return <h1>{text.home.title}</h1>;
}
```

**Client Components:**
```typescript
import { useTranslations } from '@/app/context/TranslationContext';

export default function Component() {
  const t = useTranslations();

  return <h1>{t('home.title')}</h1>;
}
```

### Adding New Translations

1. Add to both `app/dictionaries/en.json` and `app/dictionaries/es.json`
2. Update `Translations` interface in `app/types/translations.ts`
3. Use proper nesting structure

### Locale-aware Links

```typescript
import { useTranslationContext } from '@/app/context/TranslationContext';

export default function NavLink() {
  const { locale } = useTranslationContext();

  return (
    <Link href={`/${locale}/about`}>
      About
    </Link>
  );
}
```

## Best Practices

### Performance

- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` appropriately
- Lazy load images with `loading="lazy"`
- Use `priority` prop for above-the-fold images

### Accessibility

- Use semantic HTML
- Include `alt` text for images
- Use proper heading hierarchy (h1 → h2 → h3)
- Add ARIA labels when needed

### Error Handling

- Use try/catch for async operations
- Provide fallback UI for errors
- Log errors to console in development

### Code Quality

- Run `npm run lint` before committing
- Keep components focused and single-purpose
- Extract reusable logic into hooks
- Write descriptive variable and function names
- Add comments only for complex logic

## ESLint Rules

Key enforced rules:
- `@typescript-eslint/no-explicit-any`: error
- `@typescript-eslint/no-unused-vars`: error (except `_` prefixed)
- `react/react-in-jsx-scope`: off (Next.js 13+)
- `react/prop-types`: off (using TypeScript)
