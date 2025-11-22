# Atomic Design System - Migration Specifications

## 📋 Estructura de Diseño Atómico

Basado en la metodología de Atomic Design, organizaremos los componentes en 5 niveles:

```
app/components/atomic/
├── atoms/           # Elementos básicos e indivisibles
├── molecules/       # Grupos de átomos que funcionan juntos
├── organisms/       # Grupos de moléculas que forman secciones
└── templates/       # Layouts y estructuras de página
```

---

## 🔹 ATOMS (Átomos)
*Componentes básicos e indivisibles. No pueden descomponerse más sin perder su función.*

### ✅ Botones
- [ ] **Button** (MIGRADO ✓)
  - **Ubicación actual**: `app/components/atomic/button/Button.tsx`
  - **Ubicación final**: `app/components/atomic/atoms/button/`
  - **Variantes**: primary, secondary, outline, ghost, link
  - **Archivos**: `Button.tsx`, `button.type.ts`, `index.ts`, `README.md`

- [ ] **ThemeToggle**
  - **Ubicación actual**: `app/components/ui/buttons/ThemeToggle.tsx`
  - **Ubicación final**: `app/components/atomic/atoms/theme-toggle/`
  - **Descripción**: Botón para cambiar entre tema claro/oscuro

### 🔄 Inputs (Futuros)
- [ ] **Input**
  - **Ubicación final**: `app/components/atomic/atoms/input/`
  - **Descripción**: Campo de texto básico
  - **Variantes**: text, email, password, number

- [ ] **Textarea**
  - **Ubicación final**: `app/components/atomic/atoms/textarea/`
  - **Descripción**: Campo de texto multilínea

- [ ] **Checkbox**
  - **Ubicación final**: `app/components/atomic/atoms/checkbox/`
  - **Descripción**: Casilla de verificación

- [ ] **Radio**
  - **Ubicación final**: `app/components/atomic/atoms/radio/`
  - **Descripción**: Botón de radio

### 🎨 Visual Elements
- [ ] **Icon**
  - **Ubicación actual**: Dispersos en componentes
  - **Ubicación final**: `app/components/atomic/atoms/icon/`
  - **Descripción**: Componente unificado para iconos SVG

- [ ] **Image**
  - **Ubicación final**: `app/components/atomic/atoms/image/`
  - **Descripción**: Wrapper de Next.js Image con estilos

- [ ] **Logo**
  - **Ubicación actual**: Inline en NavBar
  - **Ubicación final**: `app/components/atomic/atoms/logo/`
  - **Descripción**: Logo `<LuisUrdaneta />`

- [ ] **Divider**
  - **Ubicación final**: `app/components/atomic/atoms/divider/`
  - **Descripción**: Líneas divisoras

### 📝 Text Elements
- [ ] **Heading**
  - **Ubicación final**: `app/components/atomic/atoms/heading/`
  - **Descripción**: h1, h2, h3, h4, h5, h6 con estilos
  - **Variantes**: display, title, subtitle

- [ ] **Text**
  - **Ubicación final**: `app/components/atomic/atoms/text/`
  - **Descripción**: Párrafos y texto
  - **Variantes**: body, caption, small

- [ ] **Link**
  - **Ubicación final**: `app/components/atomic/atoms/link/`
  - **Descripción**: Enlaces con estilos
  - **Variantes**: default, primary, underline

### 🎭 Animations
- [ ] **Spinner**
  - **Ubicación actual**: `app/components/loaders/`
  - **Ubicación final**: `app/components/atomic/atoms/spinner/`
  - **Archivos a mover**:
    - `loader.tsx`
    - `loaderSkills.tsx`
    - `loaderDots.jsx`

---

## 🔹 MOLECULES (Moléculas)
*Combinaciones de átomos que trabajan juntos como una unidad.*

### 🎴 Cards
- [ ] **Card**
  - **Ubicación actual**: `app/components/card/`
  - **Ubicación final**: `app/components/atomic/molecules/card/`
  - **Archivos a mover**:
    - `BaseCard.tsx`
    - `ProjectCard.tsx`
    - `ProjectsCards.tsx`
    - `SkillCard.jsx`

- [ ] **TestimonialsCard**
  - **Ubicación actual**: `app/components/ui/carousel/flex-carousel/cards/TestimonialsCard.tsx`
  - **Ubicación final**: `app/components/atomic/molecules/testimonials-card/`
  - **Variantes**: mobile, desktop

- [ ] **PostCard**
  - **Ubicación actual**: `app/components/ui/carousel/flex-carousel/cards/PostsCard.tsx`
  - **Ubicación final**: `app/components/atomic/molecules/post-card/`
  - **Variantes**: mobile, desktop

- [ ] **CategoryCard**
  - **Ubicación actual**: `app/components/ui/carousel/flex-carousel/cards/CategoriesCard.tsx`
  - **Ubicación final**: `app/components/atomic/molecules/category-card/`

- [ ] **ImageCard**
  - **Ubicación actual**: `app/components/ui/carousel/flex-carousel/cards/ImageCard.tsx`
  - **Ubicación final**: `app/components/atomic/molecules/image-card/`

### 📱 Form Components
- [ ] **FormField**
  - **Ubicación final**: `app/components/atomic/molecules/form-field/`
  - **Descripción**: Input + Label + Error message

- [ ] **SearchBar**
  - **Ubicación final**: `app/components/atomic/molecules/search-bar/`
  - **Descripción**: Input + Search icon

### 🔘 Selectors
- [ ] **SelectLanguage**
  - **Ubicación actual**: `app/components/navbar/select-language/selectLanguage.jsx`
  - **Ubicación final**: `app/components/atomic/molecules/select-language/`
  - **Descripción**: Dropdown de selección de idioma

- [ ] **SelectTheme**
  - **Ubicación actual**: `app/components/navbar/select-theme/SelectTheme.tsx`
  - **Ubicación final**: `app/components/atomic/molecules/select-theme/`
  - **Descripción**: Dropdown de selección de tema

- [ ] **Switch**
  - **Ubicación actual**: `app/components/ui/switch/`
  - **Ubicación final**: `app/components/atomic/molecules/switch/`
  - **Archivos a mover**:
    - `basicSwitch.jsx`
    - `animatedSwitch.jsx`
    - `languaguesSwitch.jsx`

### 🎬 Modals & Backdrops
- [ ] **Backdrop**
  - **Ubicación actual**: `app/components/ui/backdrop/`
  - **Ubicación final**: `app/components/atomic/molecules/backdrop/`
  - **Archivos a mover**:
    - `BackdropLeftToRigth.tsx`
    - `BackdropUpToDown.tsx`

- [ ] **Modal**
  - **Ubicación actual**: `app/components/ui/modals/`
  - **Ubicación final**: `app/components/atomic/molecules/modal/`
  - **Archivos a mover**:
    - `modalContact.jsx`
    - `modalCookies.jsx`

### 🎨 Visual Components
- [ ] **SocialButton**
  - **Ubicación actual**: `app/components/ui/contact/SocialButtons.jsx`
  - **Ubicación final**: `app/components/atomic/molecules/social-button/`

- [ ] **ArrowButton**
  - **Ubicación actual**: `app/components/ui/carousel/ArrowButton.jsx`
  - **Ubicación final**: `app/components/atomic/molecules/arrow-button/`

### ✨ Animated Text
- [ ] **AnimatedWords**
  - **Ubicación actual**: `app/components/ui/texts/`
  - **Ubicación final**: `app/components/atomic/molecules/animated-text/`
  - **Archivos a mover**:
    - `wordsAnimation.jsx`
    - `wordsChangers.jsx`
    - `basic-animation/basicWordsAnimation.jsx`
    - `basic-animation/basicLettersAnimation.jsx`
    - `blink-animation/blinkWordsAnimation.jsx`
    - `blink-animation/blinkWordsChangersy.jsx`

### 🎯 Rive Animations
- [ ] **RiveAnimation**
  - **Ubicación actual**: `app/components/rive/`
  - **Ubicación final**: `app/components/atomic/molecules/rive-animation/`
  - **Archivos a mover**:
    - `RiveAnimation.tsx`
    - `RiveFloatAnimation.tsx`

---

## 🔹 ORGANISMS (Organismos)
*Secciones complejas formadas por moléculas y átomos.*

### 📊 Navigation
- [ ] **NavBar**
  - **Ubicación actual**: `app/components/navbar/NavBar.jsx`
  - **Ubicación final**: `app/components/atomic/organisms/navbar/`
  - **Archivos a mover**:
    - `NavBar.jsx`
    - `main-menu/MainMenu.jsx`
    - `sub-menu/SubMenu.jsx`
    - `toggle-menu/ToggleMenu.jsx`
    - `hook/use-dimensions.jsx`

- [ ] **SideBar**
  - **Ubicación actual**: `app/components/sidebars/SideBar.tsx`
  - **Ubicación final**: `app/components/atomic/organisms/sidebar/`

- [ ] **Footer**
  - **Ubicación actual**: `app/components/footer/Footer.tsx`
  - **Ubicación final**: `app/components/atomic/organisms/footer/`

### 🎠 Carousels
- [ ] **FlexCarousel**
  - **Ubicación actual**: `app/components/ui/carousel/flex-carousel/`
  - **Ubicación final**: `app/components/atomic/organisms/carousel/flex-carousel/`
  - **Archivos a mover**:
    - `FlexCarousel.tsx`
    - `drag-container/DragContainer.tsx`
    - `hooks/useCarousel.tsx`
    - `hooks/usePagination.tsx`
    - `hooks/useScreenWitdh.tsx`

- [ ] **BasicCarousel**
  - **Ubicación actual**: `app/components/ui/carousel/`
  - **Ubicación final**: `app/components/atomic/organisms/carousel/basic-carousel/`
  - **Archivos a mover**:
    - `BasicCarousel.jsx`
    - `Carousel.jsx`
    - `CarouselSlider.jsx`
    - `CardsCarouselSlider.tsx`

### 📄 Sections
- [ ] **HeroSection**
  - **Ubicación actual**: `app/components/sections/hero/`
  - **Ubicación final**: `app/components/atomic/organisms/hero-section/`
  - **Archivos a mover**:
    - `Hero.tsx`
    - `HeroImage.tsx`

- [ ] **SkillsSection**
  - **Ubicación actual**: `app/components/sections/skills/`
  - **Ubicación final**: `app/components/atomic/organisms/skills-section/`
  - **Archivos a mover**:
    - `Skills.tsx`

- [ ] **ProjectsPreview**
  - **Ubicación actual**: `app/components/sections/projects/`
  - **Ubicación final**: `app/components/atomic/organisms/projects-section/`
  - **Archivos a mover**:
    - `ProjectsPreview.tsx`

- [ ] **PassionSection**
  - **Ubicación actual**: `app/components/sections/passion/`
  - **Ubicación final**: `app/components/atomic/organisms/passion-section/`
  - **Archivos a mover**:
    - `Passion.tsx`
    - `PassionImage.tsx`

- [ ] **TestimonialsSection**
  - **Ubicación actual**: `app/components/sections/testimonials/`
  - **Ubicación final**: `app/components/atomic/organisms/testimonials-section/`
  - **Archivos a mover**:
    - `Testimonials.tsx`

- [ ] **CategoriesSection**
  - **Ubicación actual**: `app/components/sections/categories/`
  - **Ubicación final**: `app/components/atomic/organisms/categories-section/`
  - **Archivos a mover**:
    - `Categories.tsx`

### 🗂️ Lists & Grids
- [ ] **ResponsiveList**
  - **Ubicación actual**: `app/components/list/`
  - **Ubicación final**: `app/components/atomic/organisms/list/`
  - **Archivos a mover**:
    - `ResponsiveList.tsx`
    - `DynamicListItem.tsx`
    - `DynamicList.tsx`
    - `SimpleList.tsx`

- [ ] **FilterCategories**
  - **Ubicación actual**: `app/components/filter/FilterCategories.tsx`
  - **Ubicación final**: `app/components/atomic/organisms/filter-categories/`

- [ ] **Pagination**
  - **Ubicación actual**: `app/components/pagination/Pagination.jsx`
  - **Ubicación final**: `app/components/atomic/organisms/pagination/`

### 🖱️ Interactive Components
- [ ] **DotFollower**
  - **Ubicación actual**: `app/components/mouse/DotFollower.tsx`
  - **Ubicación final**: `app/components/atomic/organisms/dot-follower/`

- [ ] **ParallaxText**
  - **Ubicación actual**: `app/components/slider/ParallaxText.tsx`
  - **Ubicación final**: `app/components/atomic/organisms/parallax-text/`

---

## 🔹 TEMPLATES (Plantillas)
*Layouts y estructuras de página completas.*

### 🏗️ Layouts
- [ ] **TailwindGrid**
  - **Ubicación actual**: `app/components/grid/TailwindGrid.tsx`
  - **Ubicación final**: `app/components/atomic/templates/grid/`
  - **Descripción**: Sistema de grid base

- [ ] **MainLayout**
  - **Ubicación final**: `app/components/atomic/templates/main-layout/`
  - **Descripción**: Layout principal con navbar, footer, sidebar

- [ ] **ProjectsLayout**
  - **Ubicación final**: `app/components/atomic/templates/projects-layout/`
  - **Descripción**: Layout específico para página de proyectos

---

## 📦 COMPONENTES A MANTENER FUERA DE ATOMIC

### Providers (Contextos)
- **Ubicación**: `app/components/providers/`
- **Razón**: Son contextos de React, no componentes visuales
- **Archivos**:
  - `ThemeProvider.tsx`

### API Components
- **Ubicación**: `app/components/api/`
- **Razón**: Lógica de API, no componentes visuales

### SVG Components
- **Ubicación**: `app/components/svg/`
- **Razón**: Archivos SVG puros
- **Archivos**:
  - `Symbol.tsx`

---

## 🗂️ ESTRUCTURA FINAL

```
app/components/
├── atomic/
│   ├── atoms/
│   │   ├── button/
│   │   ├── theme-toggle/
│   │   ├── input/
│   │   ├── textarea/
│   │   ├── checkbox/
│   │   ├── radio/
│   │   ├── icon/
│   │   ├── image/
│   │   ├── logo/
│   │   ├── divider/
│   │   ├── heading/
│   │   ├── text/
│   │   ├── link/
│   │   └── spinner/
│   │
│   ├── molecules/
│   │   ├── card/
│   │   ├── testimonials-card/
│   │   ├── post-card/
│   │   ├── category-card/
│   │   ├── image-card/
│   │   ├── form-field/
│   │   ├── search-bar/
│   │   ├── select-language/
│   │   ├── select-theme/
│   │   ├── switch/
│   │   ├── backdrop/
│   │   ├── modal/
│   │   ├── social-button/
│   │   ├── arrow-button/
│   │   ├── animated-text/
│   │   └── rive-animation/
│   │
│   ├── organisms/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   ├── footer/
│   │   ├── carousel/
│   │   │   ├── flex-carousel/
│   │   │   └── basic-carousel/
│   │   ├── hero-section/
│   │   ├── skills-section/
│   │   ├── projects-section/
│   │   ├── passion-section/
│   │   ├── testimonials-section/
│   │   ├── categories-section/
│   │   ├── list/
│   │   ├── filter-categories/
│   │   ├── pagination/
│   │   ├── dot-follower/
│   │   └── parallax-text/
│   │
│   └── templates/
│       ├── grid/
│       ├── main-layout/
│       └── projects-layout/
│
├── providers/       # Contextos de React
├── api/            # Lógica de API
└── svg/            # Archivos SVG puros
```

---

## 📝 NOTAS IMPORTANTES

### ⚠️ Reglas de Migración

1. **NO mover archivos automáticamente** - Solo se crean las carpetas
2. **Mantener imports actualizados** - Al mover un archivo, actualizar todas sus importaciones
3. **Crear index.ts** - Cada carpeta debe tener su `index.ts` para exports limpios
4. **Documentar en README.md** - Cada componente debe tener su documentación
5. **TypeScript** - Todos los componentes nuevos deben usar TypeScript
6. **Tailwind CSS** - Eliminar Framer Motion gradualmente, usar solo Tailwind

### 🎯 Prioridades de Migración

#### Fase 1 - Átomos Básicos (COMPLETADO)
- [x] Button

#### Fase 2 - Átomos Complementarios
- [ ] ThemeToggle
- [ ] Input
- [ ] Icon
- [ ] Logo

#### Fase 3 - Moléculas de Formulario
- [ ] FormField
- [ ] Select (Language/Theme)
- [ ] Modal

#### Fase 4 - Moléculas de Contenido
- [ ] Card
- [ ] TestimonialsCard
- [ ] PostCard

#### Fase 5 - Organismos de Navegación
- [ ] NavBar
- [ ] Footer
- [ ] SideBar

#### Fase 6 - Organismos de Contenido
- [ ] Carousel
- [ ] Sections
- [ ] Lists

#### Fase 7 - Templates
- [ ] Grid
- [ ] Layouts

---

## 🚀 Estado Actual

- **Total de componentes**: ~80
- **Migrados**: 1 (Button)
- **Pendientes**: 79
- **Progreso**: 1.3%

### ✅ Completados
1. Button atómico con Tailwind CSS

### 🔄 En Progreso
- Ninguno

### 📋 Próximos Pasos
1. Migrar ThemeToggle a átomo
2. Crear componentes de Input
3. Unificar iconos en componente Icon
4. Extraer Logo del NavBar

---

## 📚 Referencias

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Best Practices](https://nextjs.org/docs)
