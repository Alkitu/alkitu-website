# Alkitu Website - Project Context

## Project Overview

This is a **Next.js 16** portfolio and website for "Alkitu" (Luis Urdaneta). It is a high-performance, interactive web application featuring internationalization (English/Spanish), a custom design system based on Atomic Design principles, and rich animations using Rive and Framer Motion.

## Technical Stack

*   **Framework:** Next.js 16 (App Router)
*   **Library:** React 19 (rc/canary versions for compatibility)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Class-based Dark Mode), Shadcn/UI (likely)
*   **Backend/Auth:** Supabase (SSR & Client)
*   **Internationalization:** Custom dual-strategy (Server + Client)
*   **Animations:**
    *   **Rive:** `@rive-app/react-canvas` (WASM preloading enabled)
    *   **Framer Motion:** Viewport-based scroll animations

## Architecture & Design System

The project strictly follows the **Atomic Design** methodology. All components are located in `app/components/` and categorized as follows:

*   **Atoms:** Basic, indivisible elements (Buttons, Icons, Spinners).
    *   *Path:* `app/components/atoms/`
*   **Molecules:** Groups of atoms functioning together (Cards, Selectors, Modals, Switches).
    *   *Path:* `app/components/molecules/`
*   **Organisms:** Complex sections formed by molecules (NavBar, Footer, HeroSection, Carousels).
    *   *Path:* `app/components/organisms/`
*   **Templates:** Page layouts and grids.
    *   *Path:* `app/components/templates/`
    *   *Key Template:* `TailwindGrid` (Used for all major layout sections).

### Key Architectural Rules

1.  **Grid System:** All "Organism" level components (sections like Hero, Skills, etc.) **MUST** use the `TailwindGrid` component for layout consistency.
2.  **Imports:** Use absolute paths `@/app/...` for all internal imports.
3.  **Barrel Exports:** Each component directory must have an `index.ts` file for clean exports.
4.  **Theme System:** Custom `ThemeContext` handling Light/Dark modes.
    *   Includes a script in `layout.tsx` to prevent FOUC (Flash of Unstyled Content).
    *   Uses `next-themes` logic manually implemented or similar.
    *   Components use `resolvedTheme` to detect active mode.

## Internationalization (i18n)

The app supports **English (`en`)** and **Spanish (`es`)**.
*   **Default Locale:** `es` (Spanish).
*   **Routing:** Middleware handles locale detection and URL rewriting (e.g., `/es/about`, `/en/about`).
*   **Implementation:**
    *   **Server:** `app/[lang]/` dynamic routes fetch dictionaries via `lib/dictionary.ts`.
    *   **Client:** `TranslationContext` provides translations to client components.

## Development Workflow

### Scripts

*   `npm run dev`: Start the development server (`http://localhost:3000`).
*   `npm run build`: Build the production application.
*   `npm run start`: Start the production server.
*   `npm run lint`: Run code quality checks.
*   `npm run sync:projects`: Sync project data to dictionaries.

### Git Conventions

*   **Co-Authorship:** When AI tools assist significantly, include `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>` (or equivalent for Gemini).

## Directory Structure Highlights

*   `app/`: App Router pages and layouts.
    *   `[lang]/`: Locale-dependent routes.
    *   `api/`: Backend API routes (Supabase, Translations).
*   `components/`: **Do not use.** Use `app/components/` instead. (Note: Root `components/` exists but appears to be for Shadcn/UI base components, while `app/components/` holds the Atomic Design system).
*   `context/`: React Context providers (Theme, Translation, Dropdown).
*   `dictionaries/`: JSON translation files (`en.json`, `es.json`).
*   `docs/specs/`: Architectural specifications (e.g., `atomic-design-specs.md`).
*   `lib/`: Utilities, Supabase client, project data helpers.
*   `middleware/`: Custom middleware chain for Auth, i18n, and Tracking.
*   `public/`: Static assets (Rive files in `assets/rive/`, Images).

## Coding Conventions

1.  **React 19:** Be aware of React 19 specifics (e.g., `use` hook, no `forwardRef` needed in some cases).
2.  **Animations:** Use `whileInView` for scroll animations with `viewport={{ once: true }}`.
3.  **Type Safety:** Strict TypeScript usage. Avoid `any`.
4.  **Rive:** Preload WASM for performance.
