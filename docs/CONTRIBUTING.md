# Contributing Guide

Thank you for your interest in contributing to the Alkitu Portfolio project! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** 2.x or higher

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/alkitu/alkitu-website.git
   cd alkitu-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Project Structure Familiarization

Before contributing, review these key documents:
- `docs/ARCHITECTURE.md` - System design and structure
- `docs/CODE_CONVENTIONS.md` - Coding standards
- `docs/API_REFERENCE.md` - API documentation
- `CLAUDE.md` - Claude Code instructions

## Development Workflow

### Branch Strategy

```
main              # Production-ready code
  ↓
feature/*         # New features
bugfix/*          # Bug fixes
refactor/*        # Code refactoring
docs/*            # Documentation updates
```

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Development Loop

1. **Make changes** following code conventions
2. **Test locally** - verify functionality
3. **Run linter** - `npm run lint`
4. **Build** - `npm run build` (ensure no errors)
5. **Commit** - follow commit guidelines
6. **Push** - push to your branch
7. **Create PR** - submit for review

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Utilities
npm run sync:projects    # Sync project data to dictionaries
```

## Code Standards

### TypeScript

- ✅ Use explicit types for function parameters
- ✅ Define interfaces for component props
- ✅ Use `unknown` instead of `any`
- ❌ Never use `any` type (enforced by ESLint)
- ❌ Avoid implicit types

Example:
```typescript
// ✅ Good
interface Props {
  title: string;
  count: number;
}

export default function Component({ title, count }: Props) {
  // ...
}

// ❌ Bad
export default function Component({ title, count }) {
  // Implicit any
}
```

### Component Guidelines

**File Naming:**
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.tsx`
- Utilities: `camelCase.ts`

**Component Structure:**
```typescript
'use client';  // If client component

// 1. Imports
import { useState } from 'react';
import { ComponentName } from '@/path/to/component';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export default function ComponentName({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleAction = () => {
    // ...
  };

  // 6. Render
  return (
    // JSX
  );
}
```

### Styling

- Use Tailwind utility classes
- Follow mobile-first approach
- Use custom color variables
- Avoid inline styles

```tsx
// ✅ Good
<div className="flex flex-col gap-4 md:flex-row lg:gap-6">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>

// ❌ Bad
<div style={{ display: 'flex', flexDirection: 'column' }}>
  <button style={{ background: '#00BB31' }}>
    Click me
  </button>
</div>
```

### Animation

Use Framer Motion with viewport-based triggers:

```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {content}
</motion.div>
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(projects): add project filtering by category"

# Bug fix
git commit -m "fix(navbar): resolve mobile menu not closing on route change"

# Refactoring
git commit -m "refactor(hooks): consolidate carousel hooks into single directory"

# Documentation
git commit -m "docs: add architecture documentation"
```

### Multi-line Commits

```bash
git commit -m "feat(blog): implement blog post grid layout

- Add BlogGrid component with responsive grid
- Implement category filtering
- Add Framer Motion animations for cards
- Update blog page to use new grid layout

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Commit Best Practices

- Write in present tense ("add feature" not "added feature")
- Be concise but descriptive
- Reference issue numbers if applicable (#123)
- Use conventional commit format
- One logical change per commit

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run quality checks**
   ```bash
   npm run lint           # Fix any linting errors
   npm run build          # Ensure build succeeds
   ```

3. **Test thoroughly**
   - Test in multiple browsers
   - Test responsive layouts
   - Test light/dark themes
   - Test both locales (en/es)

### Creating Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request** on GitHub with this template:

```markdown
## Summary
Brief description of changes

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested responsive layouts
- [ ] Tested dark/light themes
- [ ] Tested both locales (en/es)

## Screenshots
[Add screenshots if UI changes]

## Related Issues
Closes #123

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Review Process

1. **Code Review** - Maintainers review code
2. **Feedback** - Address review comments
3. **Approval** - Get approval from maintainer
4. **Merge** - Maintainer merges PR

### After Merge

- Delete your feature branch
- Pull latest main
- Start next feature

## Testing

### Manual Testing Checklist

**Functionality:**
- [ ] Feature works as expected
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Links navigate correctly
- [ ] Forms submit properly

**Responsive Design:**
- [ ] Mobile (320px - 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (1024px+)

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Themes:**
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme toggle works
- [ ] No flash of unstyled content

**Localization:**
- [ ] English translations display
- [ ] Spanish translations display
- [ ] Locale switching works
- [ ] URL updates with locale

### Performance Testing

```bash
# Build and analyze bundle
npm run build

# Check for:
# - Bundle size < 500KB
# - No duplicate dependencies
# - Proper code splitting
```

### Accessibility Testing

- Use keyboard navigation
- Test with screen reader
- Check color contrast
- Verify ARIA labels
- Ensure semantic HTML

## Documentation

### When to Update Documentation

Update docs when you:
- Add new features
- Change architecture
- Modify API contracts
- Update dependencies
- Change workflows

### Documentation Files

- `README.md` - Project overview and setup
- `CLAUDE.md` - Claude Code instructions
- `docs/CODE_CONVENTIONS.md` - Coding standards
- `docs/ARCHITECTURE.md` - System design
- `docs/CONTRIBUTING.md` - This file
- `docs/API_REFERENCE.md` - API documentation

### Component Documentation

Add JSDoc comments for complex components:

```typescript
/**
 * FlexCarousel - A flexible carousel component with drag support
 *
 * @param dataCards - Array of items to display
 * @param type - Carousel type: 'classic' | 'image' | 'testimonial'
 * @param width - Card width percentage (default: 60)
 * @param reduceGap - Gap reduction factor (default: 2)
 *
 * @example
 * <FlexCarousel
 *   dataCards={testimonials}
 *   type="testimonial"
 *   width={70}
 * />
 */
export default function FlexCarousel({ ... }: Props) {
  // ...
}
```

## Common Issues & Solutions

### Build Errors

**Issue:** TypeScript errors during build
```bash
# Solution
npx tsc --noEmit  # Check TypeScript errors
npm run lint      # Fix linting issues
```

**Issue:** CSS syntax errors
```bash
# Solution
# Check styles/globals.css for:
# - Unclosed braces
# - Invalid @layer directives
# - Malformed @apply statements
```

### Development Issues

**Issue:** Changes not reflecting
```bash
# Solution
rm -rf .next      # Clear Next.js cache
npm run dev       # Restart dev server
```

**Issue:** Port already in use
```bash
# Solution
lsof -ti:3000 | xargs kill  # Kill process on port 3000
npm run dev                  # Restart
```

## Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Create a GitHub Issue
- **Features:** Create a GitHub Issue with [Feature Request] tag
- **Security:** Email security@alkitu.com

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Recognition

Contributors will be acknowledged in:
- GitHub contributors list
- Project README
- Release notes

Thank you for contributing! 🎉
