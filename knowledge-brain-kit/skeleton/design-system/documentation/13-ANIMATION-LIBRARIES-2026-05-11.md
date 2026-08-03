---
id: animation-libraries
version: "1.0.0"
last_updated: "2026-05-11"
updated_by: "Claude Code"
status: approved
type: convention
review_cycle: 180
---

# Animation Libraries — Framer Motion + Anime.js

> The DS ships two animation libraries with **complementary**, non-overlapping responsibilities. This document is the source of truth for *which library to reach for*. Code patterns and live demos live in Storybook under `Showcase / Animations`.

## TL;DR

- **Framer Motion v12** → React-idiomatic component animation (enter/exit, layout, gestures, scroll-linked values).
- **Anime.js v4** → SVG path drawing, shape morphing, motion paths, text split/scramble, complex timelines, timers.
- **One element, one library.** Do not animate the same CSS property on the same DOM node with both.
- **Both require Client Components.** Neither works in React Server Components.

## Division of labor (canonical matrix)

| Use case | Library | Key API |
|---|---|---|
| Component enter / exit (modals, drawers, tabs) | **Framer** | `<AnimatePresence>`, `<motion.div initial exit>` |
| Layout transitions / shared element | **Framer** | `layoutId`, `<LayoutGroup>` |
| Hover / tap / focus on UI | **Framer** | `whileHover`, `whileTap`, `whileFocus` |
| Drag a single element | **Framer** | `<motion.div drag>` |
| Drag-to-reorder a list | **`@dnd-kit`** | `useSortable` (not Framer, not Anime) |
| Scroll-linked CSS values (parallax, progress bar) | **Framer** | `useScroll` + `useTransform` |
| Variants and orchestrated child animations | **Framer** | `variants` prop |
| Page transitions (App Router) | **Framer** | + `next/view-transitions` when possible |
| **SVG path drawing (sketch effect)** | **Anime.js** | `createDrawable` |
| **SVG shape morphing** | **Anime.js** | `morphTo` |
| **Particle / object following an SVG path** | **Anime.js** | `createMotionPath` |
| **Scroll-triggered SVG animation** | **Anime.js** | `createDrawable` + `onScroll` |
| **Text split + per-char/word/line stagger** | **Anime.js** | `splitText` + `stagger` |
| **Scramble text** (Matrix / decode effect) | **Anime.js** | `scrambleText` |
| **Animated numeric counter / KPI** | **Anime.js** | `animate({ value: [0, 100] })` |
| **Timer with play/pause/seek (no DOM)** | **Anime.js** | `createTimer` |
| **Complex timeline with labels** | **Anime.js** | `createTimeline` |
| Canvas / game-loop driving | **Anime.js** | `Animatable`, ticker |

If a use case is missing from this table, default to **Framer** for anything tied to a React component tree, and **Anime.js** for anything that targets SVG attributes, raw DOM, or detached time.

## Compatibility rules

1. **Same element, same property → one library only.** If you `animate` an element's `transform` with Framer, never touch `transform` on that element with Anime.js (or vice versa). Last writer wins and the result is non-deterministic.
2. **Both need Client Components.** Mark the file `'use client'`. Neither library will execute during RSC rendering.
3. **Anime.js requires cleanup.** Always store the animation handle returned by `animate(...)` and call `.revert()` in the `useEffect` cleanup. Failing to do this leaks listeners and replays on re-mount.
4. **Reduced motion**:
   - Framer respects user preference via `useReducedMotion()` — call it and short-circuit decorative animations.
   - Anime.js does **not**. Guard manually:
     ```ts
     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
     ```
5. **Do not install `@types/animejs`.** That package is for v3 only and conflicts with v4's built-in types.
6. **Bundle hygiene.** Both libraries are tree-shakeable. Always use named imports (`import { animate, createDrawable } from 'animejs'`), never `import * as anime`.

## Where to put new animations

| Type of animation | Location |
|---|---|
| Reusable across pages | `packages/design-system/web/components/showcase/animations/` |
| Reusable text effect | `packages/design-system/web/components/showcase/text-animations/` |
| One-off marketing / landing | `packages/web/src/components/marketing/` |
| Tied to a specific composition | Co-locate with that composition |

**Rule of thumb**: if you would use the animation in more than one page or one product surface, build it in the DS and consume via the primitives bridge. If it is unique to a single section of a single page, keep it in `packages/web`.

## Code patterns

### Framer Motion — enter/exit

```tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

export function Drawer({ open, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 24 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Framer Motion — scroll-linked progress

```tsx
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <motion.div style={{ scaleX, transformOrigin: '0%' }} className="h-1 bg-primary" />;
}
```

### Anime.js — SVG draw on scroll

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { animate, createDrawable, onScroll } from 'animejs';

export function DrawOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const a = animate(createDrawable('.path'), {
      draw: ['0 0', '0 1'],
      duration: 1400,
      autoplay: onScroll({ container: root, enter: 'bottom-=120 top' }),
    });
    return () => a.revert();
  }, []);
  return (
    <div ref={ref}>
      <svg viewBox="0 0 200 100"><path className="path" d="M 10 50 Q 100 0 190 50" fill="none" stroke="currentColor" /></svg>
    </div>
  );
}
```

### Anime.js — animated counter

```tsx
'use client';
import { useEffect, useState } from 'react';
import { animate } from 'animejs';

export function Counter({ to }: { to: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const obj = { v: 0 };
    const a = animate(obj, {
      v: to,
      duration: 1200,
      ease: 'outQuad',
      onUpdate: () => setValue(Math.round(obj.v)),
    });
    return () => a.revert();
  }, [to]);
  return <span>{value}</span>;
}
```

## Gotchas

- **`morphTo` requires a real `<path>` element**, not a raw `d` string. Place targets in `<defs>` and reference by ID/selector:
  ```tsx
  <defs><path id="shape-star" d="M ..." /></defs>
  // then:
  animate(target, { d: morphTo('#shape-star') });
  ```
  Passing the string directly raises `SyntaxError: ... is not a valid selector` because Anime.js tries `document.querySelectorAll(d)`.

- **`createDrawable` accepts a selector or NodeList**, not an HTMLElement scope. To scope to a subtree, query first and pass the NodeList: `createDrawable(root.querySelectorAll('.path'))`.

- **`animate('.selector', ...)` queries the whole `document`** — not the component subtree. In Storybook or multi-instance contexts, query inside a ref and pass the element list explicitly.

## Anti-patterns

- ❌ Wrapping a Framer `motion.div` and *also* animating its `transform` with `animate(ref.current, { translateX: ... })` from Anime.js.
- ❌ Reaching for Anime.js for a hover state because "I already imported it for an SVG." Use Framer's `whileHover` — it is one line and React-native.
- ❌ Mounting Anime.js animations in render (without `useEffect`) — they will run during SSR hydration and double-fire on every re-render.
- ❌ Forgetting `.revert()` in the cleanup function.
- ❌ Animating layout-affecting properties (`width`, `height`, `top`, `left`) with either library on lists. Use Framer's `layout` prop or rebuild with grid/flex.

## Live examples

Run the Storybook in `packages/design-system/web` and look at:

- **Showcase / Animations / Framer Motion** — enter/exit, layout shared element, scroll-linked progress.
- **Showcase / Animations / Anime.js** — SVG draw, SVG morph, motion path.

Each story is a minimum-viable demo of the corresponding API, intended as a starting template — copy, adapt, ship.

## References

- ADR-028: Animation Libraries Strategy (`_bmad-output/alkimia-core/adr/00-ADR-028-animation-libraries-strategy-2026-05-11.md`)
- Anime.js v4 docs: https://animejs.com/documentation/
- Framer Motion v12 docs: https://www.framer.com/motion/
