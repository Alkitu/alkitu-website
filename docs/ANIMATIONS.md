# Animations Guide

Complete guide to implementing animations using Framer Motion and Rive in the Alkitu portfolio website.

---

## Table of Contents

1. [Overview](#overview)
2. [Framer Motion Patterns](#framer-motion-patterns)
3. [Rive Integration](#rive-integration)
4. [Viewport-Based Animations](#viewport-based-animations)
5. [AnimatePresence](#animatepresence)
6. [Performance Optimization](#performance-optimization)
7. [Best Practices](#best-practices)
8. [Examples by Component Type](#examples-by-component-type)

---

## Overview

### Animation Libraries

This project uses two complementary animation libraries:

1. **Framer Motion 12** - Declarative React animations
   - Viewport-based triggers
   - Spring physics
   - Gesture animations
   - Layout animations

2. **Rive 4.24** - Interactive vector animations
   - WASM-powered runtime
   - State machines
   - Artboard switching
   - Event-driven interactions

### Animation Philosophy

**Core Principles:**

- **Viewport-triggered** - Animations activate when scrolling into view (not on page load)
- **Spring physics** - Natural, organic motion using damping and stiffness
- **Staggered reveals** - Sequential animations for list/grid items
- **Performance-first** - GPU-accelerated transforms only (`x`, `y`, `scale`, `opacity`)

---

## Framer Motion Patterns

### Standard Animation Setup

```tsx
import { motion } from 'framer-motion';

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      Content here
    </motion.div>
  );
}
```

**Key Props:**

- `initial` - Starting state (hidden)
- `whileInView` - Target state when visible
- `viewport` - Trigger configuration
  - `once: true` - Animate only once (don't re-trigger on scroll)
  - `amount: 0.2` - Trigger when 20% visible
- `transition` - Animation timing and physics

---

### Viewport Configuration

**Recommended settings:**

```typescript
const viewportConfig = {
  once: true,      // ✅ Animate once (better UX)
  amount: 0.2,     // Trigger at 20% visibility
};

// ❌ Avoid - re-animates every scroll
const badConfig = {
  once: false,
  amount: 0.8,     // Too strict, animations trigger late
};
```

**Amount values:**

- `0.1` - Early trigger (good for large sections)
- `0.2` - Standard (recommended default)
- `0.5` - Half visible (good for cards)
- `1.0` - Fully visible (rarely used)

---

### Stagger Animations

**Parent-child pattern:**

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // Delay between children
      delayChildren: 0.2,    // Initial delay before first child
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={itemVariants}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Stagger timing guidelines:**

- **Grid layouts** (cards): `0.1s` - `0.15s` per item
- **List layouts** (vertical): `0.15s` - `0.2s` per item
- **Navigation items**: `0.05s` - `0.1s` per item

---

### Spring Physics

**Spring configuration:**

```typescript
const springConfig = {
  type: 'spring',
  damping: 30,      // Lower = more bounce (10-50)
  stiffness: 300,   // Higher = faster (100-500)
};

// Standard cards
const cardSpring = { type: 'spring', damping: 30, stiffness: 300 };

// Hero sections (slower, smoother)
const heroSpring = { type: 'spring', damping: 25, stiffness: 200 };

// Quick interactions (buttons)
const buttonSpring = { type: 'spring', damping: 20, stiffness: 400 };
```

**Comparison with duration-based:**

```tsx
// ✅ Spring - natural, organic motion
<motion.div
  animate={{ x: 100 }}
  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
/>

// ⚠️  Duration - mechanical, linear
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
/>
```

**When to use springs vs duration:**

- **Springs**: Card reveals, page transitions, gestures
- **Duration**: Loading spinners, progress bars, simple fades

---

### Interaction States

**Hover and tap effects:**

```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', damping: 20, stiffness: 400 }}
>
  Click me
</motion.button>
```

**Common interaction patterns:**

```tsx
// Cards - subtle lift
whileHover={{ scale: 1.03, y: -5 }}
whileTap={{ scale: 0.98 }}

// Buttons - press effect
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Images - zoom
whileHover={{ scale: 1.1 }}

// Links - slide
whileHover={{ x: 5 }}
```

**Apply to cards, not containers:**

```tsx
// ✅ Good - interactions on individual cards
<div>
  {items.map((item) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.05 }}
    >
      {item.content}
    </motion.div>
  ))}
</div>

// ❌ Bad - hover affects entire grid
<motion.div whileHover={{ scale: 1.05 }}>
  {items.map((item) => (
    <div key={item.id}>{item.content}</div>
  ))}
</motion.div>
```

---

## Rive Integration

### RiveAnimation Component

**Located**: `app/components/molecules/rive-animation/`

**Basic usage:**

```tsx
import { RiveAnimation } from '@/app/components/molecules/rive-animation';

<RiveAnimation
  artboardName="Artboard"
  hoverAnimationName="Hover"
  hover
/>
```

**Props:**

- `artboardName` - Name of artboard in Rive file
- `hoverAnimationName` - Animation to play on hover (optional)
- `hover` - Enable hover interactions (default: `false`)
- `src` - Path to `.riv` file (default: `/assets/rive/web_portfolio.riv`)

---

### WASM Preloading

The `RiveAnimation` component preloads the WASM runtime:

```typescript
import { useRive, RuntimeLoader } from '@rive-app/react-canvas';

// Preload WASM for faster load times
RuntimeLoader.setWasmUrl('/path/to/rive_runtime.wasm');
```

**Benefits:**

- Faster first load
- More reliable initialization
- Better user experience

**Webpack configuration** (`next.config.js`):

```javascript
module.exports = {
  webpack: (config) => {
    // Handle .riv files
    config.module.rules.push({
      test: /\.riv$/i,
      type: 'asset/resource',
    });

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/i,
      type: 'asset/resource',
    });

    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};
```

---

### Rive State Machines

**Example with state machine:**

```tsx
import { useRive } from '@rive-app/react-canvas';

export function InteractiveRive() {
  const { rive, RiveComponent } = useRive({
    src: '/assets/rive/animation.riv',
    artboard: 'MainArtboard',
    stateMachines: 'State Machine',
    autoplay: true,
  });

  const handleClick = () => {
    rive?.play('ClickAnimation');
  };

  return (
    <div onClick={handleClick}>
      <RiveComponent style={{ width: 400, height: 400 }} />
    </div>
  );
}
```

**Common use cases:**

- **Loading spinners** - Loop animations
- **Hover effects** - Interactive state changes
- **Success/error states** - One-shot animations
- **Page transitions** - Sequential animations

---

## Viewport-Based Animations

### Why Viewport-Based?

**Standard approach in this project:**

```tsx
// ✅ Recommended - viewport-based
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Content
</motion.div>

// ❌ Avoid - page load animations
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

**Benefits:**

- Better performance (only animates visible elements)
- Improved UX (animations as you scroll)
- Avoids animation overload on page load
- Works with infinite scroll

---

### Scroll-Triggered Patterns

**1. Fade up (standard entry):**

```tsx
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};
```

**2. Slide from left (list items):**

```tsx
const slideLeftVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};
```

**3. Pop in (grid cards):**

```tsx
const popInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 }
};
```

**4. Slide from right (side content):**

```tsx
const slideRightVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 }
};
```

---

## AnimatePresence

### Conditional Rendering

**Use for:**

- Modals/dialogs
- Filtered content
- Route transitions
- Conditional UI elements

**Basic pattern:**

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function ConditionalContent({ show }) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Content
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Key props:**

- `mode="wait"` - Wait for exit before entering new content
- `key` - Required on children for proper exit detection
- `exit` - Animation when component unmounts

---

### Filtered Lists

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function FilteredList({ items, filter }) {
  const filtered = items.filter((item) => item.category === filter);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {filtered.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Important**: Change `key` on parent when filter changes to trigger re-animation.

---

## Performance Optimization

### GPU-Accelerated Properties

**Fast (GPU-accelerated):**

```tsx
// ✅ Use these
<motion.div animate={{ x: 100 }} />          // transform: translateX()
<motion.div animate={{ y: 100 }} />          // transform: translateY()
<motion.div animate={{ scale: 1.5 }} />      // transform: scale()
<motion.div animate={{ rotate: 45 }} />      // transform: rotate()
<motion.div animate={{ opacity: 0.5 }} />    // opacity
```

**Slow (causes layout recalculation):**

```tsx
// ❌ Avoid these
<motion.div animate={{ width: 500 }} />      // triggers layout
<motion.div animate={{ height: 300 }} />     // triggers layout
<motion.div animate={{ marginTop: 20 }} />   // triggers layout
<motion.div animate={{ padding: 10 }} />     // triggers layout
```

---

### Will-Change CSS Property

**Add `willChange` for smoother animations:**

```tsx
<motion.div
  animate={{ opacity: 1, scale: 1 }}
  style={{ willChange: 'opacity, transform' }}
/>
```

**When to use:**

- Complex animations (multiple properties)
- Frequent animations (hover effects on many elements)
- Performance-critical sections

**When to avoid:**

- Overuse causes memory issues
- Don't apply to all elements
- Remove after animation completes (Framer Motion handles automatically)

---

### Reduce Motion for Accessibility

```tsx
import { useReducedMotion } from 'framer-motion';

function AccessibleAnimation() {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }  // Simple fade
    : { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };  // Full animation

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
    />
  );
}
```

**Respects user preference:**
- System Settings > Accessibility > Reduce Motion

---

## Best Practices

### 1. Remove CSS Transitions When Using Framer Motion

```css
/* ❌ Bad - conflicts with Framer Motion */
.card {
  transition: transform 0.3s ease;
}
```

```tsx
/* ✅ Good - only Framer Motion */
<motion.div
  className="card"
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', damping: 30 }}
/>
```

---

### 2. Use Variants for Complex Animations

```tsx
// ✅ Good - clean, reusable
const variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="show"
/>

// ❌ Bad - verbose, hard to maintain
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
/>
```

---

### 3. Container Handles Stagger, Items Handle Transforms

```tsx
// ✅ Good separation of concerns
const container = {
  show: {
    transition: { staggerChildren: 0.1 }  // Only timing
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },    // Actual transforms
  show: { opacity: 1, scale: 1 }
};

// ❌ Bad - mixed concerns
const container = {
  hidden: { opacity: 0, scale: 0.8 },    // Don't transform container
  show: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1 }
  }
};
```

---

### 4. Consistent Physics Across Similar Components

```tsx
// Define standard springs
const springs = {
  card: { damping: 30, stiffness: 300 },
  hero: { damping: 25, stiffness: 200 },
  button: { damping: 20, stiffness: 400 },
};

// Use consistently
<motion.div transition={{ type: 'spring', ...springs.card }} />
```

---

### 5. Limit Animations Per Viewport

```tsx
// ❌ Bad - too many simultaneous animations
<section>
  <motion.div>Title</motion.div>        // Animates
  <motion.div>Subtitle</motion.div>     // Animates
  <motion.div>Paragraph 1</motion.div>  // Animates
  <motion.div>Paragraph 2</motion.div>  // Animates
  <motion.div>Image 1</motion.div>      // Animates
  <motion.div>Image 2</motion.div>      // Animates
</section>

// ✅ Good - grouped animations
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
>
  <div>Title</div>
  <div>Subtitle</div>
  {/* Static content */}
</motion.section>
```

---

## Examples by Component Type

### Grid Layouts (BlogGrid, ProjectGrid)

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 }
};

<motion.div
  className="grid grid-cols-3 gap-4"
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
>
  {projects.map((project) => (
    <motion.div
      key={project.id}
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Card content */}
    </motion.div>
  ))}
</motion.div>
```

---

### List Layouts (BlogList)

```tsx
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

<motion.div
  variants={listVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  {posts.map((post) => (
    <motion.article
      key={post.id}
      variants={itemVariants}
      whileHover={{ scale: 1.02, x: 5 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* List item content */}
    </motion.article>
  ))}
</motion.div>
```

---

### Hero Sections

```tsx
const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.section
  variants={heroVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  <motion.h1 variants={contentVariants}>
    Welcome to Alkitu
  </motion.h1>
  <motion.p variants={contentVariants}>
    Building amazing web experiences
  </motion.p>
  <motion.button variants={contentVariants}>
    Get Started
  </motion.button>
</motion.section>
```

---

## See Also

- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Animation debugging
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Rive Docs](https://rive.app/community/doc/)

---

**Animation is emotion. Use it to delight users, not distract them.**
