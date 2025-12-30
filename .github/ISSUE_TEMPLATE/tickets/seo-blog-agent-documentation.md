# ✅ Task: Agente SEO para Claude Code - Generación de Blog Posts

**Labels:** `task`, `P2`, `documentation`, `seo`, `claude-code`

---

## 📝 Descripción

**Qué:**
Crear documentación especializada en formato `.md` para Claude Code que actúe como agente SEO, proporcionando plantillas y mejores prácticas para generar entradas de blog optimizadas para motores de búsqueda.

**Por qué:**
- Facilitar la creación consistente de contenido de blog con SEO correcto
- Documentar mejores prácticas SEO específicas para este proyecto
- Permitir que Claude Code genere contenido siguiendo estándares establecidos
- Reducir tiempo de creación de blog posts manteniendo calidad SEO

---

## ✅ Criterios de Aceptación

### Documentación
- [ ] Archivo `docs/SEO_BLOG_GUIDE.md` creado con estructura completa
- [ ] Incluye plantilla de blog post con metadatos SEO
- [ ] Documenta estructura de URLs SEO-friendly
- [ ] Define schema de frontmatter para MDX/Markdown
- [ ] Lista de keywords research y mejores prácticas
- [ ] Guía de optimización de imágenes para blog
- [ ] Checklist de publicación pre-deployment

### Integración con Claude Code
- [ ] Referencia en `CLAUDE.md` a la nueva documentación
- [ ] Task-specific documentation table actualizada
- [ ] Ejemplos de prompts para Claude Code incluidos
- [ ] Instrucciones claras de uso del agente SEO

### Plantillas
- [ ] Template de blog post en `docs/templates/blog-post-template.mdx`
- [ ] Estructura de metadatos (title, description, keywords, author, date)
- [ ] Secciones estándar (intro, desarrollo, conclusión, CTA)
- [ ] Ejemplos de optimización de headings (H1, H2, H3)

### Mejores Prácticas SEO
- [ ] Keyword density guidelines
- [ ] Meta description best practices (155-160 chars)
- [ ] Internal linking strategy
- [ ] External linking guidelines
- [ ] Image alt text standards
- [ ] URL slug conventions
- [ ] Schema markup para articles

---

## 🔧 Enfoque Técnico

### Estructura de Archivos

```
docs/
├── SEO_BLOG_GUIDE.md          (nuevo - guía principal)
├── templates/
│   ├── blog-post-template.mdx (nuevo - plantilla base)
│   └── blog-post-example.mdx  (nuevo - ejemplo completo)
└── README.md                  (actualizar - agregar referencia)

CLAUDE.md                      (actualizar - task-specific docs table)
```

### Contenido de `docs/SEO_BLOG_GUIDE.md`

```markdown
# SEO Blog Guide

Guía completa para crear blog posts optimizados para SEO usando Claude Code.

## Table of Contents

1. [Overview](#overview)
2. [Blog Post Structure](#blog-post-structure)
3. [SEO Metadata](#seo-metadata)
4. [Content Optimization](#content-optimization)
5. [Technical SEO](#technical-seo)
6. [Using Claude Code Agent](#using-claude-code-agent)
7. [Publishing Checklist](#publishing-checklist)

---

## Overview

### SEO Goals
- Rank in top 10 for target keywords
- Organic traffic growth 10% monthly
- Average time on page >3 minutes
- Bounce rate <60%

### Target Audience
- Web developers
- Startup founders
- Tech enthusiasts
- Spanish and English speakers

---

## Blog Post Structure

### Required Sections

1. **Hero Section**
   - Compelling H1 with primary keyword
   - Featured image (1200x630px, optimized)
   - Publication date and author
   - Reading time estimate

2. **Introduction** (100-150 words)
   - Hook: problema o pregunta
   - Context: por qué es relevante
   - Preview: qué aprenderá el lector

3. **Body Content** (1500-2500 words)
   - Headings hierarchy (H2, H3, H4)
   - Short paragraphs (<4 lines)
   - Lists and tables
   - Code examples (syntax highlighted)
   - Images and diagrams

4. **Conclusion** (100-150 words)
   - Summary of key points
   - Actionable takeaway
   - CTA (call to action)

5. **Related Content**
   - 3-5 internal links to related posts
   - "You might also like" section

---

## SEO Metadata

### Frontmatter Template

\`\`\`yaml
---
title: "Your SEO-Optimized Title (50-60 chars)"
description: "Meta description with target keyword, compelling and under 160 characters"
keywords: ["primary-keyword", "secondary-keyword", "long-tail-keyword"]
author: "Author Name"
publishedAt: "2025-01-27"
updatedAt: "2025-01-27"
locale: "es" # or "en"
category: "Web Development" # or other category
tags: ["Next.js", "SEO", "React"]
featured: true # for homepage
image:
  url: "/blog/post-slug/hero-image.jpg"
  alt: "Descriptive alt text with keyword"
  width: 1200
  height: 630
slug: "seo-friendly-url-slug"
---
\`\`\`

### Title Best Practices
- 50-60 characters (including spaces)
- Include primary keyword near beginning
- Compelling and click-worthy
- Avoid keyword stuffing
- Unique across all blog posts

**Examples:**
- ✅ "Next.js SEO: 10 Tips to Rank Higher in 2025"
- ✅ "Cómo Optimizar Imágenes Web para SEO en 2025"
- ❌ "SEO SEO SEO Next.js SEO Best SEO Practices"

### Description Best Practices
- 155-160 characters (Google displays ~155)
- Include primary keyword naturally
- Call to action or value proposition
- Avoid duplication with title

**Examples:**
- ✅ "Descubre 10 técnicas probadas de SEO para Next.js. Aumenta tu tráfico orgánico con estas estrategias de optimización. Guía completa 2025."
- ❌ "This is a blog post about SEO."

---

## Content Optimization

### Keyword Strategy

**Primary Keyword:**
- Use in H1 (title)
- Use in first 100 words
- Use in at least one H2
- Use in meta description
- Use in URL slug
- Density: 1-2% of total words

**Secondary Keywords:**
- Use in H2/H3 headings
- Distribute naturally throughout content
- Include in image alt texts
- Density: 0.5-1% each

**LSI Keywords** (Latent Semantic Indexing):
- Synonyms and related terms
- Natural language variations
- Context-specific terminology

### Headings Hierarchy

\`\`\`markdown
# H1 - Page Title (only one per page)
Primary keyword + compelling hook

## H2 - Main Sections
Secondary keywords, clear structure

### H3 - Subsections
Supporting content, detailed topics

#### H4 - Minor Points
Rarely needed, use sparingly
\`\`\`

### Content Quality Checklist
- [ ] Original content (not duplicate)
- [ ] Minimum 1500 words (sweet spot: 2000-2500)
- [ ] Solves user's problem/answers question
- [ ] Skimmable (headings, lists, short paragraphs)
- [ ] Includes examples and actionable advice
- [ ] Updated information (check publish date relevance)

---

## Technical SEO

### URL Structure

**Best practices:**
- Lowercase only
- Hyphens (not underscores)
- Include primary keyword
- Short and descriptive (3-5 words)
- No stop words (a, the, and, etc.) unless necessary

**Format:**
\`\`\`
/blog/{category}/{slug}
/blog/web-development/nextjs-seo-tips
/es/blog/desarrollo-web/consejos-seo-nextjs
\`\`\`

### Image Optimization

**File naming:**
- Descriptive filename with keyword
- Lowercase, hyphens
- Example: \`nextjs-performance-optimization.jpg\`

**Alt text:**
- Describe image content
- Include keyword naturally
- Keep under 125 characters
- Don't start with "image of" or "picture of"

**Technical specs:**
- Format: WebP (fallback to JPEG)
- Max size: 200KB
- Dimensions: 1200x630 (hero), 800x450 (content)
- Use Next.js Image component (automatic optimization)

### Internal Linking

**Strategy:**
- 3-5 internal links per post
- Link to related content
- Use descriptive anchor text (not "click here")
- Distribute link equity across site

**Example:**
\`\`\`markdown
Learn more about [optimizing Next.js performance](/blog/nextjs-performance-tips).
\`\`\`

### Schema Markup

**Article schema** (JSON-LD):
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Your SEO-Optimized Title",
  "image": "https://alkitu.com/blog/post/hero.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Alkitu",
    "logo": {
      "@type": "ImageObject",
      "url": "https://alkitu.com/logo.png"
    }
  },
  "datePublished": "2025-01-27",
  "dateModified": "2025-01-27"
}
\`\`\`

---

## Using Claude Code Agent

### Prompt Examples

**Generate blog post:**
\`\`\`
Using the SEO Blog Guide (docs/SEO_BLOG_GUIDE.md), create a new blog post about [topic].

Target keyword: [primary keyword]
Locale: es/en
Category: [category]
Audience: [target audience]

Follow the template in docs/templates/blog-post-template.mdx and ensure all SEO best practices are applied.
\`\`\`

**Optimize existing post:**
\`\`\`
Review the blog post at [path] using SEO_BLOG_GUIDE.md. Identify SEO issues and suggest improvements for:
- Title and meta description
- Keyword usage and density
- Heading structure
- Internal linking opportunities
- Image optimization
\`\`\`

**Generate metadata:**
\`\`\`
Based on SEO_BLOG_GUIDE.md, generate optimized metadata (title, description, keywords) for a blog post about [topic].

Primary keyword: [keyword]
Locale: [es/en]
\`\`\`

### Claude Code Instructions

When Claude Code reads this guide, it should:
1. Always reference `docs/SEO_BLOG_GUIDE.md` before creating blog content
2. Follow the template in `docs/templates/blog-post-template.mdx`
3. Apply all SEO best practices automatically
4. Generate bilingual content when requested (en + es)
5. Include schema markup in generated posts
6. Suggest internal linking opportunities
7. Optimize images automatically (recommendations)

---

## Publishing Checklist

### Pre-Publication
- [ ] Title optimized (50-60 chars, keyword included)
- [ ] Meta description written (155-160 chars)
- [ ] Primary keyword in first 100 words
- [ ] Headings hierarchy correct (H1 → H2 → H3)
- [ ] 3-5 internal links added
- [ ] Images optimized (WebP, <200KB, alt text)
- [ ] Code examples syntax highlighted
- [ ] Proofreading completed (grammar, spelling)
- [ ] Mobile responsive verified
- [ ] Reading time calculated

### SEO Technical
- [ ] URL slug SEO-friendly
- [ ] Canonical URL set (if needed)
- [ ] Schema markup included
- [ ] Open Graph tags added
- [ ] Twitter Card tags added
- [ ] Sitemap updated
- [ ] Robots.txt allows indexing

### Post-Publication
- [ ] Submit to Google Search Console
- [ ] Share on social media
- [ ] Monitor analytics (traffic, bounce rate, time on page)
- [ ] Update internal links from other posts
- [ ] Track keyword rankings (weekly)

---

## Tools & Resources

### SEO Tools
- Google Search Console (index status, keywords)
- Google Analytics (traffic, behavior)
- Ahrefs/SEMrush (keyword research, backlinks)
- PageSpeed Insights (performance)

### Content Tools
- Hemingway Editor (readability)
- Grammarly (grammar, spelling)
- Answer The Public (content ideas)
- TinyPNG (image compression)

### Monitoring
- Track rankings for target keywords
- Monitor organic traffic monthly
- Analyze top-performing posts
- Update old posts (refresh dates, content)

---

## See Also

- [DEPLOYMENT.md](DEPLOYMENT.md) - Sitemap configuration
- [PERFORMANCE.md](PERFORMANCE.md) - Image optimization
- [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - Bilingual content
```

---

### Actualización de CLAUDE.md

Agregar en la sección "Task-Specific Documentation (MUST READ)":

```markdown
| **Blog content creation** | @docs/SEO_BLOG_GUIDE.md, @docs/templates/blog-post-template.mdx |
```

---

### Template de Blog Post

Crear `docs/templates/blog-post-template.mdx`:

```mdx
---
title: "[SEO Title - 50-60 chars with primary keyword]"
description: "[Meta description - 155-160 chars with keyword and CTA]"
keywords: ["primary-keyword", "secondary-keyword-1", "secondary-keyword-2"]
author: "Author Name"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
locale: "es" # or "en"
category: "Category Name"
tags: ["Tag1", "Tag2", "Tag3"]
featured: false
image:
  url: "/blog/slug/hero-image.jpg"
  alt: "Descriptive alt text with keyword"
  width: 1200
  height: 630
slug: "seo-friendly-slug"
---

# [H1 Title - Same as frontmatter title or variation]

![Hero Image Alt Text](/blog/slug/hero-image.jpg)

**Published:** [Date] | **Reading time:** [X] min

---

## Introduction

[Hook paragraph - grab attention, introduce problem]

[Context paragraph - why this matters, who it's for]

[Preview paragraph - what reader will learn]

---

## [H2 Main Section 1 - Include secondary keyword]

[Content paragraph with primary/secondary keyword usage]

### [H3 Subsection if needed]

[Supporting content]

- Bullet point 1
- Bullet point 2
- Bullet point 3

---

## [H2 Main Section 2]

[Content with examples, code blocks, images]

```typescript
// Code example with syntax highlighting
const example = "value";
```

![Content Image Alt Text](/blog/slug/content-image.jpg)
*Caption explaining the image*

---

## [H2 Main Section 3]

[Continue developing the topic]

---

## Conclusion

[Summary of key points]

[Actionable takeaway]

[Call to action - engage, share, comment]

---

## Related Posts

- [Related Post 1 Title](/blog/related-post-1)
- [Related Post 2 Title](/blog/related-post-2)
- [Related Post 3 Title](/blog/related-post-3)

---

**Tags:** #Tag1 #Tag2 #Tag3
```

---

## 🔗 Dependencias

**Depende de:**
- Ninguno

**Bloquea:**
- Futura implementación del blog (cuando se decida la solución técnica)

**Relacionado con:**
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Configuración de sitemap para blog
- [INTERNATIONALIZATION.md](../../INTERNATIONALIZATION.md) - Contenido bilingüe

---

## 🎯 Prioridad

🟡 **Medium (P2)** - Importante para futura generación de contenido, pero no bloquea desarrollo actual

---

## 🏷️ Tipo de Tarea

📚 **Documentation**

---

## ⏱️ Estimación

**Complejidad:** Media
**Esfuerzo estimado:** 4-6 horas

**Desglose:**
- Research SEO best practices: 1h
- Escribir `SEO_BLOG_GUIDE.md`: 2-3h
- Crear templates y ejemplos: 1h
- Actualizar CLAUDE.md y README: 30min
- Review y ajustes: 1h
