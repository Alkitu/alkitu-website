# Testing Guide

Complete guide for manual testing procedures and future automated testing implementation.

---

## Table of Contents

1. [Overview](#overview)
2. [Manual Testing Checklist](#manual-testing-checklist)
3. [Testing Routes and Pages](#testing-routes-and-pages)
4. [Testing Admin Panel](#testing-admin-panel)
5. [Testing Internationalization](#testing-internationalization)
6. [Testing Analytics](#testing-analytics)
7. [Browser Testing](#browser-testing)
8. [Performance Testing](#performance-testing)
9. [Future: Automated Testing](#future-automated-testing)

---

## Overview

### Current State

This project currently uses **manual testing** with comprehensive checklists.

**Why manual testing?**
- Fast iteration during development
- Good coverage for portfolio site (relatively simple)
- Lower maintenance overhead

**Future enhancement**: Automated E2E tests with Playwright.

---

### Testing Philosophy

**Test pyramid for this project:**

```
        /\
       /  \    E2E Tests (Future - Playwright)
      /----\
     /      \  Integration Tests (Future - Jest)
    /--------\
   /          \ Unit Tests (Current - Manual)
  /____________\
```

**Priority areas:**
1. **Critical user flows** - Login, project creation, page navigation
2. **i18n accuracy** - Both locales work correctly
3. **Data integrity** - CRUD operations succeed
4. **Cross-browser compatibility** - Chrome, Safari, Firefox

---

## Manual Testing Checklist

### Pre-Release Checklist

Use this before deploying to production:

**Build & Environment:**
- [ ] `npm run build` succeeds without errors
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No ESLint errors: `npm run lint`
- [ ] `.env.local` has all required variables
- [ ] Environment variables set in Vercel

**Core Functionality:**
- [ ] Homepage loads in both locales (`/en`, `/es`)
- [ ] Locale switching works (navbar toggle)
- [ ] Theme switching works (light/dark)
- [ ] All navigation links work
- [ ] Projects page shows data from Supabase
- [ ] Project detail pages load correctly
- [ ] Analytics tracking works (check Supabase `sessions` table)

**Admin Panel:**
- [ ] Login works with valid credentials
- [ ] Dashboard shows analytics
- [ ] Can create new project
- [ ] Can edit existing project
- [ ] Can delete project (with confirmation)
- [ ] Can create category
- [ ] Can assign categories to projects

**Mobile Responsiveness:**
- [ ] Navbar collapses on mobile
- [ ] Projects grid stacks on mobile
- [ ] Admin panel usable on tablet
- [ ] No horizontal scrolling on small screens

**Performance:**
- [ ] Lighthouse score >90 (Performance)
- [ ] Images are optimized (Next.js Image)
- [ ] No console errors in browser
- [ ] Page load time <3 seconds

---

## Testing Routes and Pages

### Public Routes

**Test each route in both locales:**

#### 1. Homepage (`/{locale}`)

**Test cases:**

```bash
# Visit in both locales
open http://localhost:3000/en
open http://localhost:3000/es
```

**Verify:**
- [ ] Hero section loads with Rive animation
- [ ] Section navigation sidebar appears
- [ ] Projects preview shows featured projects
- [ ] Skills section displays
- [ ] All translations are correct (no missing keys)
- [ ] Images load properly
- [ ] Framer Motion animations trigger on scroll

**Expected behavior:**
- Visiting `/` redirects to `/{defaultLocale}` (`/es`)
- Locale cookie is set: `NEXT_LOCALE=en` or `es`

---

#### 2. About Page (`/{locale}/about`)

```bash
open http://localhost:3000/en/about
open http://localhost:3000/es/about
```

**Verify:**
- [ ] About hero section loads
- [ ] Origin story section displays
- [ ] Principles section shows
- [ ] Team section (if applicable)
- [ ] Sidebar navigation works

---

#### 3. Projects Page (`/{locale}/projects`)

```bash
open http://localhost:3000/en/projects
open http://localhost:3000/es/projects
```

**Verify:**
- [ ] Projects grid loads with data
- [ ] Category filters work
- [ ] Pagination works (if >6 projects)
- [ ] Search functionality works (if implemented)
- [ ] Clicking project card navigates to detail page
- [ ] Grid animations trigger

**Edge cases:**
- Empty state (no projects): Should show "No projects found"
- Single project: Grid should still layout correctly
- Many projects (>20): Pagination should work

---

#### 4. Project Detail (`/{locale}/projects/[slug]`)

```bash
open http://localhost:3000/en/projects/sample-project
open http://localhost:3000/es/projects/sample-project
```

**Verify:**
- [ ] Project title and description load
- [ ] Image carousel works (if multiple images)
- [ ] Category tags display
- [ ] Technology tags display
- [ ] Project URLs are clickable
- [ ] Social sharing works
- [ ] "Back to projects" link works

**Edge cases:**
- Invalid slug: Should show 404
- Project with no gallery: Should show primary image only

---

#### 5. Contact Page (`/{locale}/contact`)

```bash
open http://localhost:3000/en/contact
open http://localhost:3000/es/contact
```

**Verify:**
- [ ] Contact form displays (if implemented)
- [ ] Form validation works
- [ ] Submit succeeds
- [ ] Success/error messages show

---

### Protected Routes (Admin)

#### 6. Login Page (`/{locale}/auth/login`)

```bash
open http://localhost:3000/es/auth/login
```

**Test cases:**

**Valid credentials:**
1. Enter admin email and password
2. Click "Login"
3. **Expected**: Redirect to `/admin/dashboard`

**Invalid credentials:**
1. Enter wrong email or password
2. Click "Login"
3. **Expected**: Error toast appears, stays on login page

**Missing fields:**
1. Leave email or password empty
2. Click "Login"
3. **Expected**: Validation errors show

**Redirect parameter:**
1. Visit `/admin/projects` (while logged out)
2. Should redirect to `/es/auth/login?redirectTo=/admin/projects`
3. After login, redirects to `/admin/projects`

---

## Testing Admin Panel

### Dashboard (`/admin/dashboard`)

**Verify:**
- [ ] Analytics cards show data
- [ ] Session timeline chart renders
- [ ] Top pages list displays
- [ ] Traffic sources breakdown shows
- [ ] Date filters work

**Test with no data:**
- [ ] Shows "No data yet" state (not errors)

---

### Project Management (`/admin/projects`)

**Create Project:**

1. Click "New Project" button
2. Fill in all required fields:
   - English title, description
   - Spanish título, descripción
   - Image URL
   - Tags (comma-separated)
   - Display order
   - Categories (checkboxes)
3. Click "Create"
4. **Expected**: Toast notification, project appears in list

**Validation errors:**
1. Leave required field empty
2. Click "Create"
3. **Expected**: Validation error shows

**Edit Project:**

1. Click "Edit" on existing project
2. Change title
3. Click "Save"
4. **Expected**: Toast notification, changes reflect in list

**Delete Project:**

1. Click "Delete" on project
2. Confirmation dialog appears
3. Click "Confirm"
4. **Expected**: Toast notification, project removed from list

**Cancel delete:**
1. Click "Delete"
2. Click "Cancel" in dialog
3. **Expected**: Dialog closes, project still exists

---

### Category Management (`/admin/project-categories`)

**Create Category:**

1. Click "New Category"
2. Fill in:
   - English name: "Web Development"
   - Spanish name: "Desarrollo Web"
   - Slug: Auto-generated or custom
3. Click "Create"
4. **Expected**: Category appears in list

**Delete Category (with projects):**

1. Try to delete category assigned to projects
2. **Expected**: Error message "Cannot delete category: X projects assigned"

**Delete Category (without projects):**

1. Delete unused category
2. **Expected**: Success, category removed

---

## Testing Internationalization

### Locale Routing

**Test locale detection:**

```bash
# Root path
curl -I http://localhost:3000/
# Should redirect to /es (default locale)

# Explicit locale
curl -I http://localhost:3000/en
# Should set cookie: NEXT_LOCALE=en

# Cookie persistence
# Visit /en, then /, should redirect to /en (from cookie)
```

---

### Translation Completeness

**Check for missing translations:**

1. Visit every page in both locales
2. Look for:
   - Untranslated text (still in English on Spanish pages)
   - Translation keys showing (e.g., `home.hero.title`)
   - Console errors about missing keys

**Test dynamic content:**

1. Create project with English and Spanish content
2. View in both locales
3. **Expected**: Correct language content shows

---

### Locale Switching

**Test navbar locale switcher:**

1. Start on `/en/projects`
2. Click "Español" in navbar
3. **Expected**: Navigate to `/es/projects`
4. Click "English"
5. **Expected**: Navigate to `/en/projects`

**Test via URL:**

1. Visit `/en/about`
2. Manually change URL to `/es/about`
3. **Expected**: Spanish content loads
4. Cookie updates to `NEXT_LOCALE=es`

---

## Testing Analytics

### Session Tracking

**Test session creation:**

1. Open browser in incognito mode
2. Visit homepage
3. Check Supabase `sessions` table
4. **Expected**: New session created with:
   - Unique fingerprint
   - IP address
   - User agent
   - Geolocation (if configured)

**Test session persistence:**

1. Navigate to multiple pages
2. Check `sessions` table
3. **Expected**: Same session ID, `updated_at` changes

**Test 1-hour window:**

1. Visit site
2. Wait 1 hour (or change `maxAge` in middleware for testing)
3. Visit again
4. **Expected**: New session created

---

### Page View Tracking

**Test page view creation:**

1. Visit page
2. Check `page_views` table
3. **Expected**: New row with:
   - Session ID (foreign key)
   - Page URL
   - Referrer
   - Entry time

**Test exit time tracking:**

1. Visit page
2. Navigate to another page
3. Check previous page view
4. **Expected**: `exit_time` set, `duration` calculated

**Test with sendBeacon:**

1. Visit page
2. Close tab (don't navigate)
3. Check `page_views`
4. **Expected**: Exit time still recorded (via `sendBeacon`)

---

## Browser Testing

### Supported Browsers

Test in these browsers:

- **Chrome** (latest)
- **Safari** (latest)
- **Firefox** (latest)
- **Edge** (latest)
- **Mobile Safari** (iOS)
- **Chrome Mobile** (Android)

---

### Browser-Specific Tests

**Safari (macOS/iOS):**
- [ ] Rive animations load
- [ ] WASM runtime works
- [ ] Cookies are set correctly
- [ ] Framer Motion animations smooth

**Firefox:**
- [ ] Image optimization works
- [ ] CSS Grid layouts correct
- [ ] Tailwind classes applied

**Mobile browsers:**
- [ ] Touch interactions work
- [ ] Viewport meta tag correct
- [ ] No horizontal scroll
- [ ] Font sizes readable

---

### Responsive Testing

**Test breakpoints:**

```css
/* Tailwind breakpoints */
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Devices to test:**

- **Mobile**: iPhone 12 (390px), Galaxy S21 (360px)
- **Tablet**: iPad (768px), iPad Pro (1024px)
- **Desktop**: 1920px, 2560px (4K)

**Chrome DevTools:**

1. Open DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select device or enter custom dimensions
4. Test all pages

---

## Performance Testing

### Lighthouse Audit

**Run in Chrome DevTools:**

1. Open DevTools > Lighthouse tab
2. Select:
   - **Mode**: Navigation
   - **Categories**: Performance, Accessibility, Best Practices, SEO
   - **Device**: Desktop or Mobile
3. Click "Analyze page load"

**Target scores:**

- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >95
- **SEO**: >90

**Common issues:**

- Large images: Use Next.js Image component
- Unused JavaScript: Code splitting
- Cumulative Layout Shift: Add width/height to images

---

### Core Web Vitals

**Measure in production:**

```bash
# Install web-vitals
npm install web-vitals

# Add to app
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

**Target metrics:**

- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

---

## Future: Automated Testing

### Recommended Stack

**E2E Testing:**
- **Playwright** - Fast, reliable browser automation
- Covers critical user flows
- Run in CI/CD pipeline

**Component Testing:**
- **Jest** - Unit tests for utilities
- **React Testing Library** - Component tests

**Visual Regression:**
- **Chromatic** - Screenshot diffing (Storybook)

---

### Example: Playwright E2E Tests

**Setup:**

```bash
npm install -D @playwright/test
npx playwright install
```

**Test file** (`tests/e2e/homepage.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('http://localhost:3000/en');

    // Check title
    await expect(page.locator('h1')).toContainText('Welcome to Alkitu');

    // Check Rive animation
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check projects section
    await page.locator('text=Featured Projects').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Featured Projects')).toBeVisible();
  });

  test('should switch locales', async ({ page }) => {
    await page.goto('http://localhost:3000/en');

    // Click Spanish button
    await page.click('text=Español');

    // Check URL changed
    await expect(page).toHaveURL('http://localhost:3000/es');

    // Check content changed
    await expect(page.locator('h1')).toContainText('Bienvenido a Alkitu');
  });
});
```

**Run tests:**

```bash
npx playwright test
```

---

### Example: Jest Unit Tests

**Setup:**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Test file** (`lib/__tests__/dictionary.test.ts`):

```typescript
import { getDictionary } from '@/lib/dictionary';

describe('getDictionary', () => {
  it('should return English translations', async () => {
    const dict = await getDictionary('en');
    expect(dict.home.hero.title).toBe('Welcome to Alkitu');
  });

  it('should return Spanish translations', async () => {
    const dict = await getDictionary('es');
    expect(dict.home.hero.title).toBe('Bienvenido a Alkitu');
  });
});
```

---

### CI/CD Testing

**GitHub Actions workflow** (`.github/workflows/test.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx playwright test
```

---

## See Also

- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment testing
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Debugging issues
- [Playwright Docs](https://playwright.dev/)
- [Jest Docs](https://jestjs.io/)

---

**Testing ensures quality. Start with manual testing, automate critical flows as the project grows.**
