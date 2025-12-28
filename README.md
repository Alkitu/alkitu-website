# Alkitu Portfolio Website

> Modern, bilingual portfolio website showcasing projects, skills, and expertise with a full-featured admin CMS

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)

---

## ✨ Features

✨ **Bilingual Support** - Seamless English/Spanish switching with dual i18n architecture (server + client)
⚡ **Modern Stack** - Next.js 16 App Router, React 19, TypeScript 5
🎨 **Animations** - Framer Motion viewport triggers + Rive interactive animations
🛠️ **Admin Panel** - Full CMS for projects, categories, and content management
📊 **Analytics** - Built-in tracking with session fingerprinting (Supabase)
🌓 **Theme System** - Light/dark mode with SSR support, zero flash
🧱 **Atomic Design** - Well-organized component architecture (atoms → organisms)
🔒 **Type-Safe** - Full TypeScript coverage with Zod validation
🎯 **Production-Ready** - Deployed on Vercel with Supabase backend

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/alkitu/alkitu-website.git
cd alkitu-website

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase credentials (see docs/SUPABASE.md)

# Run development server
npm run dev
# Open http://localhost:3000/es (default locale)
```

**First time setup?** See [docs/SETUP.md](docs/SETUP.md) for detailed instructions.

---

## 🛠️ Tech Stack

### Framework & Core
- **Next.js 16.0** - App Router with React Server Components
- **React 19.2** - Latest concurrent features
- **TypeScript 5.9** - Strict mode enabled

### Styling & Animation
- **Tailwind CSS v4** - CSS-based configuration (`@theme` directive)
- **Framer Motion 12** - Viewport-based animations with spring physics
- **Rive 4.24** - Interactive vector animations with WASM runtime

### Backend & Database
- **Supabase** - PostgreSQL database with Row Level Security
- **Supabase Auth** - Admin authentication and session management
- **RESTful APIs** - Standardized endpoints with Zod validation

### UI Components & Utilities
- **shadcn/ui** - Radix UI primitives with Tailwind styling
- **Sonner** - Beautiful toast notifications
- **Zod 4.1** - Runtime type validation
- **Lucide React** - Icon library

---

## 📁 Project Structure

```
alkitu-website/
├── app/
│   ├── [lang]/              # Localized routes (en/es)
│   │   ├── page.tsx        # Home page
│   │   ├── about/          # About page
│   │   ├── projects/       # Projects listing + detail
│   │   ├── blog/           # Blog listing + posts
│   │   ├── contact/        # Contact page
│   │   └── auth/login/     # Admin login
│   │
│   ├── admin/              # Protected admin panel
│   │   ├── dashboard/      # Analytics
│   │   ├── projects/       # Project CRUD
│   │   ├── project-categories/
│   │   └── users/          # User management
│   │
│   ├── api/                # API routes
│   │   ├── translations/   # i18n API
│   │   ├── projects/       # Public project API
│   │   ├── categories/     # Categories API
│   │   ├── analytics/      # Tracking endpoints
│   │   └── admin/          # Protected admin APIs
│   │
│   ├── components/         # Atomic design components
│   │   ├── atoms/          # Button, Logo, Icon
│   │   ├── molecules/      # Card, Modal, SelectTheme
│   │   ├── organisms/      # NavBar, Footer, Hero
│   │   └── templates/      # TailwindGrid layout
│   │
│   ├── context/            # React context providers
│   │   ├── ThemeContext.tsx
│   │   ├── TranslationContext.tsx
│   │   └── Providers.tsx   # Provider composition
│   │
│   └── dictionaries/       # i18n translations
│       ├── en.json         # English
│       └── es.json         # Spanish
│
├── lib/                    # Shared utilities
│   ├── supabase/          # Database clients
│   ├── api/               # API response helpers
│   └── dictionary.ts      # i18n loader
│
├── middleware/            # Next.js proxy chain
│   ├── chain.ts           # Middleware composition
│   ├── withI18nMiddleware.ts      # Locale routing
│   ├── withAuthMiddleware.ts      # Admin protection
│   ├── withTrackingMiddleware.ts  # Analytics
│   └── withSupabaseMiddleware.ts  # Auth refresh
│
├── supabase/              # Database migrations
│   └── migrations/
│       ├── analytics/     # Session tracking
│       ├── auth/          # Admin users
│       └── projects/      # Projects schema
│
├── public/                # Static assets
│   └── assets/
│       └── rive/          # Rive animation files
│
├── docs/                  # Documentation
└── components/ui/         # shadcn/ui primitives
```

---

## 📚 Documentation

### Getting Started
- **[README.md](README.md)** - This file (overview and quick start)
- **[docs/SETUP.md](docs/SETUP.md)** - Detailed setup guide
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deploy to Vercel + Supabase
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Architecture & Design
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and data flow
- **[docs/CODE_CONVENTIONS.md](docs/CODE_CONVENTIONS.md)** - Coding standards
- **[docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md)** - i18n architecture
- **[docs/MIDDLEWARE.md](docs/MIDDLEWARE.md)** - Proxy chain explanation

### Features & Systems
- **[docs/ADMIN_PANEL.md](docs/ADMIN_PANEL.md)** - Admin CMS guide
- **[docs/ANALYTICS.md](docs/ANALYTICS.md)** - Tracking system
- **[docs/ANIMATIONS.md](docs/ANIMATIONS.md)** - Framer Motion + Rive patterns
- **[docs/SUPABASE.md](docs/SUPABASE.md)** - Database setup and queries

### API & Development
- **[docs/API_REFERENCE.md](docs/API_REFERENCE.md)** - Hooks and context
- **[docs/API_BEST_PRACTICES.md](docs/API_BEST_PRACTICES.md)** - RESTful standards
- **[docs/TESTING.md](docs/TESTING.md)** - Testing guide
- **[docs/PERFORMANCE.md](docs/PERFORMANCE.md)** - Optimization strategies

### Contributing
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[CLAUDE.md](CLAUDE.md)** - AI assistant instructions

---

## 📸 Screenshots

### Home Page (Dark Mode)
![Home Page - Coming Soon](docs/screenshots/home-dark.png)
*Screenshot placeholder - Coming soon*

### Projects Showcase
![Projects - Coming Soon](docs/screenshots/projects.png)
*Screenshot placeholder - Coming soon*

### Admin Panel
![Admin Panel - Coming Soon](docs/screenshots/admin-dashboard.png)
*Screenshot placeholder - Coming soon*

### Mobile Responsive
![Mobile - Coming Soon](docs/screenshots/mobile.png)
*Screenshot placeholder - Coming soon*

---

## 💻 Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint checks

# Utilities
npm run sync:projects    # Sync project data to dictionaries
```

---

## 🚀 Deployment

This project is optimized for **Vercel** deployment with **Supabase** as the backend.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alkitu/alkitu-website)

**Before deploying:**
1. Create Supabase project and run migrations
2. Add environment variables to Vercel
3. Configure domain (optional)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete step-by-step instructions.

---

## 🔑 Environment Variables

Required for production:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

See [.env.example](.env.example) for the complete template and [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed explanations of each variable.

---

## 🌟 Key Features

### Bilingual i18n System
- **Server-side**: `getDictionary(lang)` for pages/layouts
- **Client-side**: `useTranslations()` hook for components
- **Routing**: `/{locale}/*` with automatic detection
- **Default locale**: Spanish (`es`)
- **Middleware**: Automatic locale detection from cookies/headers

### Admin CMS
- **Project management** with localized content (en/es)
- **Category assignment** (many-to-many relationships)
- **Image gallery** uploads and management
- **Display order** control for homepage showcase
- **User management** with last login tracking
- **Analytics dashboard** with session and page view metrics

### Analytics Tracking
- **Session fingerprinting** (1-hour window)
- **Page view tracking** with duration metrics
- **Geolocation** via IP address (country, region, city)
- **RESTful API** endpoints for analytics
- **Admin dashboard** with filterable statistics

### Animation System
- **Framer Motion**: Viewport-based triggers, spring physics, stagger effects
- **Rive**: Interactive vector animations with WASM runtime
- **Patterns**: Grid pop-in, list slide, hero fade animations

### Theme System
- **Light/dark mode** toggle with persistent cookie
- **SSR support** (zero flash of unstyled content)
- **Theme-aware components** (AlkituLogo switches between light/dark SVGs)
- **Auto-detection** on first visit from system preferences

---

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## ⚡ Performance

- **Bundle size**: Optimized with code splitting and tree shaking
- **Core Web Vitals**: Monitored via Vercel Analytics
- **Images**: Next.js Image component with automatic optimization
- **Caching**: ISR for static pages, CDN for assets
- **Lighthouse Score**: Target 95+ for all metrics

---

## 📄 License

All Rights Reserved © 2024 Alkitu

---

## 🤝 Contributing

Contributions welcome! Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request with detailed description

---

## 🙏 Acknowledgments

- **Built with** [Next.js 16](https://nextjs.org/) App Router
- **Powered by** [Supabase](https://supabase.com/)
- **Designed with** [Atomic Design](https://atomicdesign.bradfrost.com/) methodology
- **UI Components** from [shadcn/ui](https://ui.shadcn.com/)
- **Enhanced by** [Claude Code](https://claude.ai/code) (AI pair programming)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/alkitu/alkitu-website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alkitu/alkitu-website/discussions)
- **Documentation**: [/docs](docs/)

---

**Made with ❤️ using Next.js, React, Supabase, and TypeScript**
