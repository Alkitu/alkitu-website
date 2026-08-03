---
id: theme-sitemap-guide
version: "1.0.0"
last_updated: "2026-03-22"
updated_by: "Claude Code"
status: active
type: guide
review_cycle: 90
---

# SITEMAP THEME EDITOR 3.0

This document describes the complete architecture of the **Theme Forge**, a modular and self-contained system for creating and customizing themes with UI components based on Shadcn UI and Tailwind CSS v4 (OKLCH).

## Architecture: 4 Main Blocks

The Theme Forge is divided into 4 main blocks that make up the user interface:

1. **THEME SELECTOR** - Theme selector and navigation (upper left)
2. **ACTIONS BAR** - Editor controls and actions (upper right)
3. **THEME EDITOR** - Theme property editor (lower left)
4. **PREVIEW** - Component preview (lower right)

### UI Layout
```
+-------------------+-------------------+
|  THEME            |  ACTIONS          |
|  SELECTOR         |  BAR              |
+-------------------+-------------------+
|                   |                   |
|  THEME            |  PREVIEW          |
|  EDITOR           |                   |
|                   |                   |
+-------------------+-------------------+
     ^                    ^
 Left Column         Right Column
 (Resizable)
```

## File Structure

```
theme-forge/
├── index.tsx                          # Main layout with 4-block distribution
├── types/                             # Global type definitions
│   ├── index.ts                       # Export barrel
│   ├── theme.types.ts                 # Theme types (OKLCH colors)
│   ├── viewport.types.ts              # Viewport/device types
│   ├── editor.types.ts                # Editor types
│   └── preview.types.ts               # Preview types
├── hooks/                             # Shared hooks
│   ├── index.ts                       # Export barrel
│   ├── useTheme.ts                    # Main theme hook
│   ├── useThemeHistory.ts             # Undo/redo hook (30 changes)
│   ├── useViewport.ts                 # Viewport/device hook
│   ├── useLayout.ts                   # Column handler hook
│   └── useThemeImport.ts             # Import hook
├── context/                           # Context providers
│   ├── ThemeEditorContext.tsx         # Main editor context
│   ├── HistoryContext.tsx             # Change history context
│   ├── ViewportContext.tsx            # Active viewport context
│   └── LayoutContext.tsx              # Layout/columns context
│
├── ui/                                # Base UI components (Shadcn UI wrappers)
│   ├── index.ts                       # Export barrel
│   ├── button.tsx                     # Re-export from @/components/ui/button
│   ├── input.tsx                      # Re-export from @/components/ui/input
│   ├── popover.tsx                    # Re-export from @/components/ui/popover
│   ├── dropdown-menu.tsx              # Re-export from @/components/ui/dropdown-menu
│   ├── tabs.tsx                       # Re-export from @/components/ui/tabs
│   ├── card.tsx                       # Re-export from @/components/ui/card
│   ├── badge.tsx                      # Re-export from @/components/ui/badge
│   ├── avatar.tsx                     # Re-export from @/components/ui/avatar
│   ├── checkbox.tsx                   # Re-export from @/components/ui/checkbox
│   ├── radio-group.tsx                # Re-export from @/components/ui/radio-group
│   ├── select.tsx                     # Re-export from @/components/ui/select
│   ├── slider.tsx                     # Re-export from @/components/ui/slider
│   ├── switch.tsx                     # Re-export from @/components/ui/switch
│   ├── separator.tsx                  # Re-export from @/components/ui/separator
│   ├── accordion.tsx                  # Re-export from @/components/ui/accordion
│   ├── alert.tsx                      # Re-export from @/components/ui/alert
│   ├── calendar.tsx                   # Re-export from @/components/ui/calendar
│   ├── carousel.tsx                   # Re-export from @/components/ui/carousel
│   ├── command.tsx                    # Re-export from @/components/ui/command
│   ├── dialog.tsx                     # Re-export from @/components/ui/dialog
│   ├── drawer.tsx                     # Re-export from @/components/ui/drawer
│   ├── form.tsx                       # Re-export from @/components/ui/form
│   ├── hover-card.tsx                 # Re-export from @/components/ui/hover-card
│   ├── menubar.tsx                    # Re-export from @/components/ui/menubar
│   ├── navigation-menu.tsx            # Re-export from @/components/ui/navigation-menu
│   ├── pagination.tsx                 # Re-export from @/components/ui/pagination
│   ├── progress.tsx                   # Re-export from @/components/ui/progress
│   ├── resizable.tsx                  # Re-export from @/components/ui/resizable
│   ├── scroll-area.tsx                # Re-export from @/components/ui/scroll-area
│   ├── sheet.tsx                      # Re-export from @/components/ui/sheet
│   ├── sidebar.tsx                    # Re-export from @/components/ui/sidebar
│   ├── skeleton.tsx                   # Re-export from @/components/ui/skeleton
│   ├── sonner.tsx                     # Re-export from @/components/ui/sonner
│   ├── table.tsx                      # Re-export from @/components/ui/table
│   ├── textarea.tsx                   # Re-export from @/components/ui/textarea
│   ├── tooltip.tsx                    # Re-export from @/components/ui/tooltip
│   ├── enhanced-color-picker.tsx      # Re-export from @/components/ui/enhanced-color-picker
│   └── simple-color-picker.tsx        # Re-export from @/components/ui/simple-color-picker
│
├── 1-theme-selector/                  # BLOCK 1: THEME SELECTOR
│   ├── index.tsx                      # Main ThemeSelector
│   ├── ThemeDropdown.tsx             # Dropdown with themes
│   ├── ThemeSearch.tsx               # Theme search
│   ├── ThemePreview.tsx              # Preview with colors
│   ├── ThemeNavigation.tsx           # Navigation arrows
│   ├── SavedThemes.tsx               # Saved themes
│   └── BuiltinThemes.tsx             # Built-in themes
│
├── 2-actions-bar/                     # BLOCK 2: ACTIONS BAR
│   ├── index.tsx                      # Main ActionsBar
│   ├── viewport-selector/             # Device selector
│   │   ├── index.tsx                  # Main ViewportSelector
│   │   ├── ViewportButton.tsx         # Individual button (TV, Desktop, Tablet, Smartphone)
│   │   └── ViewportIndicator.tsx      # Active indicator
│   ├── theme-mode/                    # Light/dark mode
│   │   ├── index.tsx                  # Main ThemeMode
│   │   └── ModeToggle.tsx             # Toggle switch
│   ├── history-controls/              # Undo/Redo
│   │   ├── index.tsx                  # Main HistoryControls
│   │   ├── UndoButton.tsx             # Undo button
│   │   └── RedoButton.tsx             # Redo button
│   ├── import-export/                 # Import/Code
│   │   ├── index.tsx                  # Main ImportExport
│   │   ├── ImportButton.tsx           # Import theme
│   │   └── CodeButton.tsx             # View/Export code
│   └── save-controls/                 # Save
│       ├── index.tsx                  # Main SaveControls
│       └── SaveButton.tsx             # Save theme
│
├── 3-theme-editor/                    # BLOCK 3: THEME EDITOR
│   ├── index.tsx                      # Main ThemeEditor with tabs
│   ├── navigation/                    # Navigation between sections
│   │   ├── index.tsx                  # Main EditorNavigation
│   │   └── EditorTabs.tsx             # Section tabs
│   ├── colors/                        # Color system (OKLCH)
│   │   ├── index.tsx                  # Main ColorsEditor
│   │   ├── OklchColorPicker.tsx       # OKLCH-specific picker
│   │   ├── ColorPalette.tsx           # Color palette
│   │   ├── ColorTokens.tsx            # Color tokens (CSS vars)
│   │   └── ColorConverter.tsx         # HEX/HSL/OKLCH converter
│   ├── typography/                    # Typography system
│   │   ├── index.tsx                  # Main TypographyEditor
│   │   ├── FontFamilySelector.tsx     # Font selector
│   │   ├── FontSizeScale.tsx          # Size scale
│   │   └── LineHeightControl.tsx      # Line height control
│   ├── brand/                         # Brand identity
│   │   ├── index.tsx                  # Main BrandEditor
│   │   ├── LogoUploader.tsx           # Logo upload
│   │   └── BrandColors.tsx            # Brand colors
│   ├── borders/                       # Border system
│   │   ├── index.tsx                  # Main BordersEditor
│   │   ├── BorderRadius.tsx           # Border radius
│   │   └── BorderWidth.tsx            # Border width
│   ├── spacing/                       # Spacing system
│   │   ├── index.tsx                  # Main SpacingEditor
│   │   ├── SpacingScale.tsx           # Spacing scale
│   │   └── SpacingPreview.tsx         # Preview
│   ├── shadows/                       # Shadow system
│   │   ├── index.tsx                  # Main ShadowsEditor
│   │   ├── ShadowEditor.tsx           # Shadow editor
│   │   └── ShadowPresets.tsx          # Shadow presets
│   └── scroll/                        # Scroll system
│       ├── index.tsx                  # Main ScrollEditor
│       ├── ScrollbarCustomizer.tsx    # Customizer
│       └── ScrollBehavior.tsx         # Behavior
│
├── 4-preview/                         # BLOCK 4: PREVIEW
│   ├── index.tsx                      # Main Preview with tabs
│   ├── navigation/                    # Navigation between views
│   │   ├── index.tsx                  # Main PreviewNavigation
│   │   └── PreviewTabs.tsx            # View tabs
│   ├── colors-preview/                # Color preview
│   │   ├── index.tsx                  # Main ColorsPreview
│   │   └── ColorSwatches.tsx          # Color swatches
│   ├── typography-preview/            # Typography preview
│   │   ├── index.tsx                  # Main TypographyPreview
│   │   └── FontSamples.tsx            # Font samples
│   ├── brand-preview/                 # Brand preview
│   │   ├── index.tsx                  # Main BrandPreview
│   │   └── BrandShowcase.tsx          # Brand showcase
│   ├── atomos-preview/                # Atoms preview (uses ui/ folder)
│   │   ├── index.tsx                  # Main AtomsPreview
│   │   ├── ButtonsShowcase.tsx        # Showcase using ui/button.tsx
│   │   ├── InputsShowcase.tsx         # Showcase using ui/input.tsx
│   │   ├── BadgesShowcase.tsx         # Showcase using ui/badge.tsx
│   │   ├── CheckboxesShowcase.tsx     # Showcase using ui/checkbox.tsx
│   │   ├── SwitchesShowcase.tsx       # Showcase using ui/switch.tsx
│   │   ├── SlidersShowcase.tsx        # Showcase using ui/slider.tsx
│   │   ├── AvatarsShowcase.tsx        # Showcase using ui/avatar.tsx
│   │   ├── ProgressShowcase.tsx       # Showcase using ui/progress.tsx
│   │   ├── AlertsShowcase.tsx         # Showcase using ui/alert.tsx
│   │   └── SeparatorsShowcase.tsx     # Showcase using ui/separator.tsx
│   ├── moleculas-preview/             # Molecules preview (uses ui/ folder)
│   │   ├── index.tsx                  # Main MoleculesPreview
│   │   ├── AccordionsShowcase.tsx     # Showcase using ui/accordion.tsx
│   │   ├── CardsShowcase.tsx          # Showcase using ui/card.tsx
│   │   ├── TabsShowcase.tsx           # Showcase using ui/tabs.tsx
│   │   ├── DropdownMenusShowcase.tsx  # Showcase using ui/dropdown-menu.tsx
│   │   ├── CalendarsShowcase.tsx      # Showcase using ui/calendar.tsx
│   │   ├── CarouselsShowcase.tsx      # Showcase using ui/carousel.tsx
│   │   ├── NavigationMenusShowcase.tsx # Showcase using ui/navigation-menu.tsx
│   │   ├── PaginationShowcase.tsx     # Showcase using ui/pagination.tsx
│   │   └── ToastersShowcase.tsx       # Showcase using ui/sonner.tsx
│   └── organismos-preview/            # Organisms preview (uses ui/ folder)
│       ├── index.tsx                  # Main OrganismsPreview
│       ├── DialogsShowcase.tsx        # Showcase using ui/dialog.tsx
│       ├── DrawersShowcase.tsx        # Showcase using ui/drawer.tsx
│       ├── SheetsShowcase.tsx         # Showcase using ui/sheet.tsx
│       ├── SidebarsShowcase.tsx       # Showcase using ui/sidebar.tsx
│       ├── CommandsShowcase.tsx       # Showcase using ui/command.tsx
│       ├── FormsShowcase.tsx          # Showcase using ui/form.tsx
│       ├── TablesShowcase.tsx         # Showcase using ui/table.tsx
│       ├── HoverCardsShowcase.tsx     # Showcase using ui/hover-card.tsx
│       ├── MenuBarsShowcase.tsx       # Showcase using ui/menubar.tsx
│       └── SkeletonsShowcase.tsx      # Showcase using ui/skeleton.tsx
│
├── layout/                            # Layout components
│   ├── index.tsx                      # Main layout
│   ├── ResizableColumns.tsx           # Resizable columns (uses ui/resizable.tsx)
│   ├── ColumnResizer.tsx              # Resize handler
│   └── LayoutProvider.tsx             # Layout provider
│
├── utils/                             # Self-contained utilities
│   ├── index.ts                       # Export barrel
│   ├── theme-generator.ts             # Theme generator (OKLCH)
│   ├── oklch-converter.ts             # OKLCH/HEX/HSL converter
│   ├── css-var-generator.ts           # CSS variable generator
│   ├── code-exporter.ts               # Code exporter
│   ├── token-parser.ts                # Token parser
│   ├── history-manager.ts             # History manager (30 changes)
│   ├── viewport-utils.ts              # Viewport utilities
│   └── validation.ts                  # Validations
│
├── constants/                         # Module constants
│   ├── index.ts                       # Export barrel
│   ├── default-theme.ts               # Default theme (OKLCH)
│   ├── oklch-color-spaces.ts          # OKLCH color spaces
│   ├── viewport-sizes.ts              # Viewport sizes
│   ├── editor-sections.ts             # Editor sections
│   ├── preview-sections.ts            # Preview sections
│   └── history-config.ts              # History configuration
│
└── assets/                            # Module assets
    ├── icons/                         # Editor-specific icons
    │   ├── viewport-icons.tsx         # TV, Desktop, Tablet, Smartphone icons
    │   └── action-icons.tsx           # Action icons
    └── themes/                        # Built-in themes
        ├── default-themes.ts          # Default themes (OKLCH)
        └── theme-presets.ts           # Theme presets
```

## Technical Features

### Core Technologies
- **React 18** - Main framework
- **TypeScript** - Static typing
- **Shadcn UI** - Base component system
- **Tailwind CSS v4** - CSS framework with OKLCH support
- **OKLCH Color Space** - Modern color space for better precision

### Color Architecture
- **CSS Variables** - System based on custom properties
- **OKLCH Support** - Modern colors with better visual perception
- **Dynamic Theming** - Dynamic switching between light and dark modes
- **Color Tokens** - Token system for consistency

### Main Features

#### Theme Selector
- Search for built-in themes
- Arrow key navigation
- Color-coded preview
- Saved and favorite themes

#### Actions Bar
- Viewport selector (TV, Desktop, Tablet, Smartphone)
- Light/dark mode toggle
- Undo/redo history (30 changes)
- Import/export code
- Save themes

#### Theme Editor
- **Colors** - OKLCH editor with converters
- **Typography** - Fonts, sizes, line height
- **Brand** - Logo and brand colors
- **Borders** - Border radius and width
- **Spacing** - Spacing scale
- **Shadows** - Shadow editor and presets
- **Scroll** - Scroll customizer

#### Preview
- **Colors Preview** - Palettes and swatches
- **Typography Preview** - Typography samples
- **Brand Preview** - Brand showcase
- **Atoms** - Basic components (buttons, inputs, etc.)
- **Molecules** - Intermediate components (cards, tabs, etc.)
- **Organisms** - Complex components (dialogs, tables, etc.)

## Design Principles

### Modularity
- Each block is independent and reusable
- Self-contained components with no external dependencies
- Easy migration to other projects

### Scalability
- Architecture prepared for new components
- Extensible type system
- Reusable hooks for common logic

### Consistency
- Uniform use of Shadcn UI
- Clear naming patterns
- Export barrels for clean imports

### Performance
- Lazy loading by section
- Re-render optimization
- Efficient state management

## Workflow

1. **Theme Selection** - Choose a base theme from the Theme Selector
2. **Viewport Configuration** - Select the target device
3. **Property Editing** - Modify colors, typography, etc.
4. **Real-Time Preview** - View changes on components
5. **Export** - Generate CSS/JSON code
6. **Save** - Persist the customized theme

## Implementation Notes

- All UI components are Shadcn UI wrappers
- Previews reuse the `ui/` folder (no component duplication)
- The color system is optimized for OKLCH
- History keeps a maximum of 30 changes
- Resizable layout between left and right columns
- Full support for light and dark modes
- Export is compatible with Tailwind CSS v4

## CRITICAL DEVELOPMENT RULES

### Docker and Build Rules
- **NEVER build** - The project runs with Docker
- **DO NOT use pnpm run build commands** - Docker handles compilation
- **Development only with pnpm run dev** - Hot reload in Docker

### Full Self-Containment
This module must be **100% self-contained** and not depend on files outside the `theme-forge/` folder:

#### Allowed Dependencies
- Components from the `ui/` folder (re-exported locally)
- Native React hooks (`useState`, `useEffect`, etc.)
- Native TypeScript types
- Standard JavaScript utilities

#### PROHIBITED Dependencies
- Imports from outside `theme-forge/`
- Dependencies on other project components
- External global contexts
- External stores (Zustand, Redux, etc.)
- Non-self-contained external APIs

### Dependency Audit
Every **2 weeks**, perform a dependency analysis:
1. **Search for external imports** with `grep -r "from ['\"]@/"`
2. **List found dependencies**
3. **Propose internalization** of each dependency
4. **Document in this file** the current dependencies

#### Current Dependency Analysis (Last review: August 3, 2025)

**EXTERNAL DEPENDENCIES DETECTED:**

1. **@/components/ui/*** (79 imports detected)
   - **Status:** CRITICAL - Massive external dependency
   - **Affected files:** Virtually all components
   - **Solution:** Create `ui/` folder with local re-exports
   - **Priority:** HIGH - Blocks migration

2. **@/lib/utils** (1 import detected)
   - **Status:** PENDING - `cn` function used
   - **Affected file:** `layout/ResizableLayout.tsx`
   - **Solution:** Create internal `utils/cn.ts`
   - **Priority:** MEDIUM

3. **culori** (1 import detected)
   - **Status:** ALLOWED - Standard package
   - **Affected file:** `utils/color-conversions-v2.ts`
   - **Note:** Types only, not implementation
   - **Priority:** LOW

**CRITICAL METRICS:**
- **Total external dependencies:** 81
- **Affected UI components:** 79 (98.8%)
- **Current self-containment:** 2% (CRITICAL)
- **Target goal:** 100% self-containment

**SELF-CONTAINMENT PLAN:**

```typescript
// Required structure for self-containment:
theme-forge/
├── ui/                          # PENDING: Create this folder
│   ├── button.tsx               # Re-export from @/components/ui/button
│   ├── input.tsx                # Re-export from @/components/ui/input
│   ├── card.tsx                 # Re-export from @/components/ui/card
│   ├── tabs.tsx                 # Re-export from @/components/ui/tabs
│   ├── dialog.tsx               # Re-export from @/components/ui/dialog
│   ├── [... 25+ more components]
│   └── index.ts                 # Export barrel
├── utils/
│   ├── cn.ts                    # PENDING: Local implementation
│   └── index.ts                 # Updated export barrel
```

### Full Element Control

#### Custom Colors
- **File:** `constants/default-theme.ts`
- **Format:** CSS variables with OKLCH
- **Control:** All color classes must be defined locally
- **Do not use:** Default Tailwind classes without redefining

#### Custom Typography
- **File:** `constants/typography-system.ts` (create if it does not exist)
- **Control:** All font families, sizes, and weights
- **Variables:** CSS custom properties for typography
- **Do not use:** Default Tailwind classes

#### Atoms and Components
- **Folder:** `ui/` (Shadcn UI re-exports)
- **Control:** Each component must have a local override
- **Customization:** All styles in CSS variables
- **Migration:** Easy design system swap

#### Token System
```typescript
// Required control structure:
theme-forge/
├── constants/
│   ├── color-tokens.ts      # All colors
│   ├── typography-tokens.ts # All typography
│   ├── spacing-tokens.ts    # All spacing
│   ├── border-tokens.ts     # All borders
│   ├── shadow-tokens.ts     # All shadows
│   └── component-tokens.ts  # Component tokens
```

### Migration to Other Projects
To ensure easy migration:
1. **Copy the entire folder** `theme-forge/`
2. **Verify dependencies** in the analysis file
3. **Install only listed dependencies**
4. **Configure CSS variables** in the target project
5. **Run full testing** of all features

### Self-Containment Metrics
- **Goal:** 0 external dependencies
- **Current:** 81 external dependencies (CRITICAL)
- **Self-containment:** 2% (98% dependent)
- **Next review:** Every 2 weeks
- **Last updated:** August 3, 2025

### Validation Commands
Run every 2 weeks to validate self-containment:

```bash
# 1. Search for all @/ dependencies
cd packages/web/src/components/admin/theme-forge
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts"

# 2. Count external dependencies
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts" | wc -l

# 3. List dependent files
grep -r "from ['\"]@/" . --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq

# 4. Verify external library imports (not npm)
grep -r "from ['\"]../" . --include="*.tsx" --include="*.ts"
```

### SELF-CONTAINMENT ALERT
**CURRENT STATUS: CRITICAL**
- Not migratable to other projects
- 79 external UI components
- Dependencies on @/lib/utils
- Requires massive refactoring for self-containment

**MANDATORY NEXT STEPS:**
1. Create `ui/` folder with all re-exports
2. Implement local `utils/cn.ts`
3. Update all internal imports
4. Validate 100% self-containment

---

**Author:** Theme Forge Team
**Version:** 1.0.0
**Date:** August 3, 2025
**Rules updated:** August 3, 2025
