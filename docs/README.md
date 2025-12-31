# Documentation

Complete documentation for the Alkitu portfolio website.

---

## 🚀 Quick Start

New to the project? Start here:

1. **[SETUP.md](SETUP.md)** - Install and configure the project
2. **[CLAUDE.md](../CLAUDE.md)** - AI assistant guidance (comprehensive architecture)
3. **[README.md](../README.md)** - Project overview and features

---

## 📚 Documentation Index

### Essential Reading

**Get started with these core documents:**

| Document | Description | When to Read |
|----------|-------------|--------------|
| [SETUP.md](SETUP.md) | Step-by-step setup guide | First time setup |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deploy to Vercel + Supabase | Ready for production |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Common issues and fixes | When stuck |

---

### Architecture & Features

**Understand how the system works:**

| Document | Description | Topics Covered |
|----------|-------------|----------------|
| [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) | Dual i18n system | Server/client i18n, locale routing, translations |
| [ANIMATIONS.md](ANIMATIONS.md) | Animation patterns | Framer Motion, Rive, viewport triggers |
| [MIDDLEWARE.md](MIDDLEWARE.md) | Proxy chain pattern | Next.js 16 proxy, middleware composition |
| [ANALYTICS.md](ANALYTICS.md) | Tracking system | Session fingerprinting, page views |

---

### Database & APIs

**Work with data:**

| Document | Description | Topics Covered |
|----------|-------------|----------------|
| [SUPABASE.md](SUPABASE.md) | Database guide | Schema, RLS, migrations, queries |
| [ADMIN_PANEL.md](ADMIN_PANEL.md) | CMS user guide | Projects, categories, users, analytics |

---

### Configuration & Workflow

**Set up your environment and workflow:**

| Document | Description | Topics Covered |
|----------|-------------|----------------|
| [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) | GitHub workflow guide | Issue templates, PRs, labels, best practices |
| [SEO_BLOG_GUIDE.md](SEO_BLOG_GUIDE.md) | SEO blog content creation | Power words, Next.js SEO, metadata, schema markup |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Environment variables | Required vars, security, Vercel config |
| [PERFORMANCE.md](PERFORMANCE.md) | Optimization guide | Core Web Vitals, images, caching, ISR |
| [TESTING.md](TESTING.md) | Testing procedures | Manual testing, future automation |

---

## 🗂️ Documentation by Use Case

### I want to...

**Deploy to production:**
1. [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
2. [ENVIRONMENT.md](ENVIRONMENT.md) - Configure environment variables
3. [SUPABASE.md](SUPABASE.md) - Set up database

**Add a new feature:**
1. [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) - Create feature issue
2. [CLAUDE.md](../CLAUDE.md) - Understand architecture
3. [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - Add translations
4. [ANIMATIONS.md](ANIMATIONS.md) - Add animations
5. [TESTING.md](TESTING.md) - Test the feature
6. [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) - Create PR

**Fix a bug:**
1. [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) - Create bug report
2. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
3. [TESTING.md](TESTING.md) - Verify the fix
4. [PERFORMANCE.md](PERFORMANCE.md) - Check performance impact
5. [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md) - Create PR

**Manage content:**
1. [ADMIN_PANEL.md](ADMIN_PANEL.md) - Use the CMS
2. [SUPABASE.md](SUPABASE.md) - Database operations

**Create blog content:**
1. [SEO_BLOG_GUIDE.md](SEO_BLOG_GUIDE.md) - SEO strategy and best practices
2. [templates/blog-post-template.mdx](templates/blog-post-template.mdx) - Template for new posts
3. [templates/blog-post-example.mdx](templates/blog-post-example.mdx) - Example implementation

**Optimize performance:**
1. [PERFORMANCE.md](PERFORMANCE.md) - Optimization strategies
2. [ANIMATIONS.md](ANIMATIONS.md) - Animation performance
3. [SUPABASE.md](SUPABASE.md) - Database optimization

---

## 📖 Document Details

### [SETUP.md](SETUP.md)
**Detailed onboarding guide**

- Prerequisites and installation
- Environment configuration
- Database setup
- IDE configuration
- Verification steps
- Common pitfalls

**Read this first** if you're new to the project.

---

### [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md)
**GitHub workflow and issue management**

- Issue templates (5 types: feature, bug, task, question, enhancement)
- Creating and managing issues
- Labels and organization
- Pull request workflow
- Code review process
- Best practices and conventions
- Troubleshooting workflow issues

**~700 lines** with complete GitHub workflow guidance.

---

### [SEO_BLOG_GUIDE.md](SEO_BLOG_GUIDE.md)
**SEO-optimized blog content creation**

- Power words strategy for CTR optimization
- Next.js 16 SEO requirements (generateMetadata, ISR)
- Core Web Vitals optimization (LCP, CLS, INP)
- Schema markup (JSON-LD BlogPosting)
- Bilingual content guidelines (English/Spanish)
- Blog post templates and examples
- SEO checklist and best practices

**~500 lines** with comprehensive SEO strategies and code examples.

---

### [DEPLOYMENT.md](DEPLOYMENT.md)
**Vercel + Supabase deployment**

- Supabase project creation
- Vercel deployment
- Environment variables
- Post-deployment verification
- Troubleshooting deployment issues
- Rollback procedures

**~400 lines** of production deployment guidance.

---

### [SUPABASE.md](SUPABASE.md)
**Complete database guide**

- Database schema (6 tables)
- Row Level Security (RLS)
- Migrations management
- Client usage (server/analytics/browser)
- Common queries
- Performance optimization

**~550 lines** with SQL examples and best practices.

---

### [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**Common issues and solutions**

- Development issues
- Build errors
- Runtime errors
- Database problems
- Deployment failures
- Performance issues

**~400 lines** of practical troubleshooting.

---

### [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md)
**Dual i18n architecture**

- Server-side i18n (getDictionary)
- Client-side i18n (useTranslations)
- Routing & middleware
- Adding translations
- Adding new locales
- Best practices

**~450 lines** covering both i18n systems.

---

### [ANIMATIONS.md](ANIMATIONS.md)
**Framer Motion + Rive patterns**

- Viewport-based animations
- Spring physics
- Stagger animations
- Rive integration
- AnimatePresence
- Performance optimization

**~550 lines** with comprehensive examples.

---

### [ANALYTICS.md](ANALYTICS.md)
**Built-in tracking system**

- Architecture overview
- Database schema
- VisitTracker component
- API endpoints
- Admin dashboard
- Privacy considerations

**~500 lines** of analytics documentation.

---

### [ADMIN_PANEL.md](ADMIN_PANEL.md)
**CMS user guide**

- Authentication flow
- Project management (CRUD)
- Category management
- User management
- Analytics dashboard
- Security best practices

**~450 lines** with step-by-step instructions.

---

### [MIDDLEWARE.md](MIDDLEWARE.md)
**Next.js 16 proxy system**

- Proxy convention (breaking change)
- Chain pattern implementation
- Middleware stack (4 middleware)
- Creating new middleware
- Execution flow
- Debugging tips

**~600 lines** with detailed implementation.

---

### [TESTING.md](TESTING.md)
**Manual testing + future automation**

- Pre-release checklist
- Route testing
- Admin panel testing
- i18n testing
- Browser testing
- Future: Playwright/Jest

**~550 lines** of testing procedures.

---

### [ENVIRONMENT.md](ENVIRONMENT.md)
**Environment variables reference**

- Required variables (Supabase)
- Optional variables (analytics, flags)
- Environment-specific config
- Security best practices
- Vercel configuration

**~450 lines** with security guidance.

---

### [PERFORMANCE.md](PERFORMANCE.md)
**Optimization strategies**

- Core Web Vitals (LCP, FID, CLS)
- Image optimization
- Code splitting
- ISR & static generation
- Database optimization
- CDN & caching

**~550 lines** of performance tips.

---

## 🎯 Recommended Reading Order

### For New Developers

1. [README.md](../README.md) - Project overview
2. [SETUP.md](SETUP.md) - Get it running
3. [CLAUDE.md](../CLAUDE.md) - Understand architecture
4. [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - Learn i18n
5. [SUPABASE.md](SUPABASE.md) - Understand database

### For Content Managers

1. [ADMIN_PANEL.md](ADMIN_PANEL.md) - Learn the CMS
2. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix common issues

### For DevOps

1. [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
2. [ENVIRONMENT.md](ENVIRONMENT.md) - Configure environments
3. [PERFORMANCE.md](PERFORMANCE.md) - Monitor and optimize
4. [TESTING.md](TESTING.md) - Set up CI/CD

---

## 🔗 External Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Rive Documentation](https://rive.app/community/doc/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## 📝 Contributing to Documentation

Found an error or want to improve documentation?

1. **Report issues**: [GitHub Issues](https://github.com/alkitu/alkitu-website/issues)
2. **Submit PRs**: Update docs and submit pull request
3. **Follow style**: Match existing formatting and tone

**Documentation standards:**

- Use markdown formatting
- Include code examples
- Add cross-references to related docs
- Keep language clear and concise
- Use emoji sparingly (only in headers)

---

## 📊 Documentation Stats

- **Total Documents**: 16 files
- **Total Lines**: ~7,700+ lines
- **Tier 1 (Critical)**: 6 files
- **Tier 2 (High Priority)**: 6 files
- **Tier 3 (Medium Priority)**: 4 files

**Last Updated**: 2025-01-30

---

**Need help? Start with [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or ask in GitHub Issues.**
