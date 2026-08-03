---
id: theme-development-rules
version: "1.1.0"
last_updated: "2026-03-22"
updated_by: "Claude Code"
status: active
type: guide
review_cycle: 90
---

# THEME EDITOR 3.0 - DEVELOPMENT RULES & GUIDELINES

**⚠️ CRITICAL**: This document MUST be read and followed during EVERY development session on the Theme Forge project. Failure to follow these rules WILL result in system breakage.

**Last Updated**: 2025-01-14
**Component Path**: `/packages/web/src/components/features/theme-forge`

---

## 🚨 CRITICAL RULES - MUST FOLLOW FOR EVERY CODE CHANGE

### Core Development Rules

1. **NEVER DELETE**: Do not delete ANY code until you are 100% certain it is not essential or being used elsewhere
2. **NEVER CREATE**: Do not create ANY new component/file until you verify a similar one doesn't already exist
3. **ALWAYS REUSE**: Always try to reuse existing code and update it when possible
4. **MAINTAIN COMPATIBILITY**: Any updates MUST be backward compatible - never break existing functionality
5. **COMMUNICATE FIRST**: Always explain what you're going to do BEFORE making any changes
6. **NO EXTERNAL DEPENDENCIES**: Do NOT install any external dependencies unless EXTREMELY necessary

### Dependency Management Rules

- 🚫 **NEVER** install new packages without checking existing dependencies first
- 📦 **ALWAYS** review `package.json` files (root and all workspaces) before suggesting new dependencies
- ✅ **VERIFY** if functionality can be achieved with existing packages
- 🔍 **CHECK** all these locations before installing anything:
  - `/package.json` (root)
  - `/packages/api/package.json`
  - `/packages/web/package.json`
  - `/packages/mobile/package.json`
  - `/packages/shared/package.json`
- ⚠️ Only install new dependencies when absolutely no alternative exists

### Before Making ANY Changes

- ✅ Check if the component/function already exists
- ✅ Verify the code is not being used elsewhere
- ✅ Ensure changes are backward compatible
- ✅ Review existing dependencies before suggesting new ones
- ✅ Explain the planned changes to the user first
- ✅ Get confirmation before proceeding with significant changes

---

## 🛡️ THEME EDITOR SPECIFIC PROTECTION RULES

### DO NOT TOUCH - Critical System Components

These components are WORKING and must NOT be modified without explicit approval:

```typescript
// PROTECTED COMPONENTS - DO NOT MODIFY
❌ /core/context/ThemeEditorContext.tsx     // Central state management
❌ /core/types/theme.types.ts               // Type definitions used everywhere
❌ /lib/utils/color/color-conversions-v2.ts // Color conversion algorithms
❌ /lib/utils/css/css-variables.ts          // CSS variable application
❌ /layout/ResizableLayout.tsx              // Layout structure
```

### MUST PRESERVE - Working Functionality

These features are CURRENTLY WORKING and must remain functional:

```typescript
✅ Theme switching (light/dark mode)
✅ Color picker with OKLCH conversion
✅ Real-time preview updates
✅ Export functionality (CSS, JSON, Tailwind)
✅ Undo/Redo system (30 history entries)
✅ Theme persistence in localStorage
✅ Responsive viewport switching
```

### CAN MODIFY WITH CAUTION - Enhancement Areas

These areas can be modified BUT must maintain backward compatibility:

```typescript
⚠️ /design-system/atoms/*     // Can add tests, NOT modify interfaces
⚠️ /design-system/molecules/* // Can add tests, NOT modify props
⚠️ /design-system/organisms/* // Can add tests, NOT modify structure
⚠️ /preview/*                 // Can enhance, NOT break existing tabs
⚠️ /theme-editor/editor/*     // Can improve, NOT change data flow
```

---

## 🎯 OBJECTIVES BY DEVELOPMENT PHASE

### PHASE 0: Foundation & Setup ✅
**Objective**: Setup testing infrastructure WITHOUT breaking existing code
```typescript
MUST DO:
- Add Jest configuration alongside existing code
- Create test utilities in NEW files only
- Setup coverage reports without modifying source
- Add Storybook as SEPARATE concern

MUST NOT:
- Modify any existing component code
- Change import/export patterns
- Alter file structure
- Remove any existing functionality
```

### PHASE 1: Critical Path Testing 🧪
**Objective**: Add tests WITHOUT modifying component implementation
```typescript
MUST DO:
- Create *.test.tsx files alongside components
- Use existing component APIs as-is
- Test current functionality, not ideal functionality
- Document bugs found but DON'T fix yet

MUST NOT:
- Refactor components "to make them testable"
- Change component props or interfaces
- Add new props for testing purposes
- Modify state management
```

### PHASE 2: Accessibility Compliance ♿
**Objective**: Add accessibility WITHOUT breaking visual design
```typescript
MUST DO:
- ADD aria-labels to existing elements
- ADD keyboard handlers alongside mouse handlers
- ADD focus indicators via CSS only
- ADD screen reader announcements

MUST NOT:
- Change HTML structure for accessibility
- Modify existing event handlers
- Remove or replace existing interactions
- Change component hierarchy
```

### PHASE 3: Performance Optimization ⚡
**Objective**: Optimize WITHOUT changing functionality
```typescript
MUST DO:
- Add React.memo() as wrappers
- Add useMemo/useCallback to existing hooks
- Implement lazy loading at route level
- Add performance monitoring

MUST NOT:
- Restructure component tree
- Change state management pattern
- Modify data flow
- Replace working algorithms
```

### PHASE 4: Comprehensive Testing 🎯
**Objective**: Achieve 85% coverage WITHOUT refactoring
```typescript
MUST DO:
- Test edge cases of existing code
- Add integration tests for current flows
- Create E2E tests for actual user paths
- Setup visual regression for current UI

MUST NOT:
- Refactor to improve testability
- Change interfaces for better testing
- Modify component structure
- Alter business logic
```

### PHASE 5: Documentation & Polish 📚
**Objective**: Document existing system AS-IS
```typescript
MUST DO:
- Document current component APIs
- Create Storybook stories for existing props
- Write guides for current functionality
- Record videos of actual workflows

MUST NOT:
- Document ideal/future functionality
- Change APIs to match documentation
- Add features during documentation
- Modify behavior for consistency
```

### PHASE 6: Production Preparation 🚀
**Objective**: Prepare for production WITHOUT new features
```typescript
MUST DO:
- Optimize build configuration
- Add error boundaries around existing components
- Implement monitoring for current metrics
- Setup deployment for existing codebase

MUST NOT:
- Add "nice to have" features
- Refactor for "cleaner code"
- Change architecture patterns
- Modify core functionality
```

### PHASE 7: Standalone Migration 📦
**Objective**: Extract to package WITHOUT dependencies
```typescript
MUST DO:
- Copy existing code structure exactly
- Create abstraction layer for external deps
- Maintain exact same API surface
- Preserve all existing functionality

MUST NOT:
- Refactor during migration
- "Improve" code while extracting
- Change folder structure
- Modify import patterns
```

---

## 🔍 VERIFICATION CHECKLIST - RUN BEFORE EVERY CHANGE

### Pre-Change Verification
```bash
□ Did you check if this component/function already exists?
□ Did you search for similar implementations?
□ Did you verify no other component depends on this?
□ Did you check all package.json files for existing deps?
□ Did you test that current functionality still works?
```

### Post-Change Verification
```bash
□ Does theme switching still work?
□ Does color picker still update preview?
□ Does export still generate valid output?
□ Does undo/redo still function?
□ Do all existing tests still pass?
□ Is the UI visually unchanged?
```

---

## 🚫 FORBIDDEN ACTIONS - NEVER DO THESE

### Package Management
```bash
❌ pnpm install [any-new-package]      # Check existing first
❌ pnpm remove [any-package]        # May break dependencies
❌ pnpm update                          # Can break compatibility
❌ pnpm audit --fix              # Can break versions
```

### Code Modifications
```typescript
❌ Deleting "unused" imports          // May be used dynamically
❌ Removing "dead" code               // May be used conditionally
❌ Refactoring "messy" code          // Focus on testing first
❌ Updating deprecated methods        // Maintain compatibility
❌ Changing file locations           // Breaks imports
❌ Renaming components               // Breaks references
```

### Git Operations
```bash
❌ git reset --hard                  # Loses work
❌ git push --force                  # Overwrites history
❌ git rebase                        # Can lose commits
❌ Committing without testing        # Breaks CI/CD
```

---

## ✅ SAFE ACTIONS - ALWAYS ALLOWED

### Testing Additions
```typescript
✅ Adding *.test.tsx files
✅ Adding *.spec.tsx files
✅ Creating test utilities
✅ Adding test fixtures
✅ Setting up test helpers
```

### Documentation Additions
```typescript
✅ Adding README files
✅ Creating JSDoc comments
✅ Writing Storybook stories
✅ Adding inline comments
✅ Creating example files
```

### Non-Breaking Enhancements
```typescript
✅ Adding aria-labels
✅ Adding data-testid attributes
✅ Adding performance.mark() calls
✅ Adding console.warn() for deprecations
✅ Adding error boundaries
```

---

## 📊 SUCCESS METRICS - TRACK THESE

### Quality Metrics
```yaml
Current Baseline (MUST MAINTAIN):
  Functionality: 100% working
  Visual Design: 0 regressions
  Performance: No degradation
  Bundle Size: No increase > 5%

Target Improvements (MUST ACHIEVE):
  Test Coverage: 2% → 85%
  Accessibility: 0% → 100% WCAG AA
  Performance: Establish baseline
  Documentation: 0% → 100%
```

### Development Velocity
```yaml
Expected Progress:
  Week 1-2: Testing setup (0 components modified)
  Week 3-6: Add tests (0 components modified)
  Week 7-8: Add a11y (only attributes added)
  Week 9-10: Optimize (only wrappers added)
  Week 11-12: Document (only docs added)
  Week 13-14: Deploy (only config changed)
  Week 15-16: Extract (only copying files)
```

---

## 🆘 EMERGENCY PROCEDURES

### If Something Breaks
```bash
1. STOP immediately
2. Run: git status
3. Run: git diff
4. Run: pnpm test
5. If broken: git checkout -- [broken-file]
6. Document what broke and why
7. Seek approval before trying again
```

### If Tests Fail
```bash
1. Check if you modified source code
2. Revert any source modifications
3. Fix test to match existing behavior
4. Document if existing code has bugs
5. DO NOT fix bugs until approved
```

### If Build Fails
```bash
1. Check for new dependencies
2. Verify import statements
3. Check TypeScript errors
4. Revert recent changes
5. Rebuild from clean state
```

---

## 📋 DAILY CHECKLIST

### Start of Day
```bash
□ Read this document completely
□ Check current git branch
□ Pull latest changes
□ Run existing tests
□ Verify working functionality
```

### Before Each Task
```bash
□ Document planned changes
□ Get approval for approach
□ Create feature branch
□ Test current functionality
□ Take screenshots if UI work
```

### After Each Task
```bash
□ Run all tests
□ Check visual regression
□ Verify functionality preserved
□ Document what was done
□ Commit with descriptive message
```

### End of Day
```bash
□ Push changes to feature branch
□ Update progress tracking
□ Document blockers
□ Plan next day tasks
□ Verify nothing broken
```

---

## 🎯 GOLDEN RULE

> **"If it works, DON'T BREAK IT. Add tests, add docs, add accessibility, but NEVER break working functionality."**

---

## 📞 CONTACT FOR APPROVAL

For any changes that require approval:
1. Document the proposed change
2. Explain why it's necessary
3. Show it won't break existing functionality
4. Get written approval before proceeding

---

**REMEMBER**: The goal is to make Theme Forge production-ready WITHOUT breaking what already works. Every change must be additive, not destructive.

**SUCCESS CRITERIA**: At the end of this project, EVERYTHING that works now must still work, PLUS have tests, accessibility, performance optimization, and documentation.