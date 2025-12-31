# SEO Blog Guide

Complete guide for creating SEO-optimized blog posts for the Alkitu portfolio website using Claude Code.

---

## Table of Contents

1. [Overview](#overview)
2. [Blog Post Structure](#blog-post-structure)
3. [SEO Metadata](#seo-metadata)
4. [Content Optimization](#content-optimization)
5. [Power Words Strategy](#power-words-strategy)
6. [Next.js SEO Requirements](#nextjs-seo-requirements)
7. [Technical SEO](#technical-seo)
8. [Bilingual Content](#bilingual-content)
9. [Using Claude Code Agent](#using-claude-code-agent)
10. [Publishing Checklist](#publishing-checklist)
11. [Tools & Resources](#tools--resources)

---

## Overview

### SEO Goals

**Target metrics for blog posts:**
- Rank in **top 10** for target keywords (within 3 months)
- Organic traffic growth: **10% monthly**
- Average time on page: **>3 minutes**
- Bounce rate: **<60%**
- Click-through rate (CTR): **5%+ from search results**

### Target Audience

- Web developers (intermediate to advanced)
- Startup founders and tech entrepreneurs
- Tech enthusiasts and digital marketers
- Spanish and English speakers (bilingual content)

### Quick Start

1. Use template: `docs/templates/blog-post-template.mdx`
2. Follow this guide for SEO optimization
3. Use Claude Code with `seo-blog-writer` agent
4. Review with publishing checklist before deployment

---

## Blog Post Structure

### Required Sections

Every blog post MUST include these sections:

#### 1. Hero Section
- **H1 Title**: 50-60 characters with primary keyword
- **Featured Image**: 1200x630px, optimized (WebP/AVIF)
- **Publication Date**: ISO format (YYYY-MM-DD)
- **Author**: Name and optional avatar
- **Reading Time**: Auto-calculated estimate

#### 2. Introduction (100-150 words)
- **Hook**: Problem or compelling question
- **Context**: Why this topic matters now
- **Preview**: What the reader will learn

**Example:**
```markdown
## Introduction

¿Sabías que el 75% de usuarios nunca pasan de la primera página de Google? En el competitivo mundo del desarrollo web, dominar SEO es la diferencia entre ser encontrado o permanecer invisible.

En esta guía definitiva, descubrirás las 10 técnicas probadas que utilizan los expertos para posicionar sitios Next.js en el top 10 de Google. Aprenderás desde metadatos dinámicos hasta Core Web Vitals.

Al final de este artículo, tendrás un checklist completo para auditar y optimizar cualquier aplicación Next.js para máximo rendimiento SEO.
```

#### 3. Body Content (1,500-2,500 words)
- **Headings Hierarchy**: H2 → H3 → H4 (don't skip levels)
- **Short Paragraphs**: Max 3-4 lines per paragraph
- **Visual Breaks**: Lists, tables, images every 300-400 words
- **Code Examples**: Syntax-highlighted with comments
- **Actionable Content**: Step-by-step instructions, not just theory

#### 4. Conclusion (100-150 words)
- **Summary**: Key takeaways (3-5 bullet points)
- **Actionable Next Step**: What to do immediately
- **Call to Action**: Engage, share, comment, or contact

**Example:**
```markdown
## Conclusión

Optimizar SEO en Next.js no es magia, es ingeniería:

- Usa SSG/ISR para contenido editorial
- Implementa metadatos dinámicos con `generateMetadata()`
- Optimiza Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- Añade schema markup para rich snippets
- Audita con Lighthouse antes de deployment

**Próximo paso:** Abre tu proyecto Next.js y ejecuta `npm run build`. Identifica qué páginas no son estáticas (λ) y refactorízalas a SSG (○).

¿Tienes dudas sobre SEO en Next.js? [Contáctanos](/es/contact) para una auditoría gratuita.
```

#### 5. Related Content
- **Internal Links**: 3-5 links to related blog posts
- **Section Title**: "You might also like" / "También te puede interesar"
- **Brief Descriptions**: 1 sentence per link

---

## SEO Metadata

### Frontmatter Template

Every blog post MUST include this frontmatter (MDX):

```yaml
---
title: "Your SEO-Optimized Title (50-60 chars)"
description: "Meta description with target keyword, compelling and under 160 characters"
keywords: ["primary-keyword", "secondary-keyword", "long-tail-keyword"]
author: "Author Name"
publishedAt: "2025-01-27"
updatedAt: "2025-01-27"
locale: "es" # or "en"
category: "Web Development" # Main category
tags: ["Next.js", "SEO", "React", "Performance"]
featured: true # Show on homepage
image:
  url: "/blog/seo-nextjs-guide/hero.jpg"
  alt: "Next.js SEO optimization dashboard showing Core Web Vitals"
  width: 1200
  height: 630
slug: "seo-nextjs-guide-2025"
---
```

### Title Best Practices

**Requirements:**
- **Length**: 50-60 characters (including spaces)
- **Keyword Placement**: Primary keyword in first 20% of title
- **Power Words**: Include 1-2 power words (see Power Words section)
- **Uniqueness**: Different from all other blog posts
- **Accuracy**: Matches actual content (no clickbait)

**Formula**: `[Power Word] + [Primary Keyword] + [Benefit/Number]`

**Examples:**
- ✅ "Ultimate Next.js SEO Guide: 10 Tips to Rank #1 in 2025"
- ✅ "Cómo Optimizar Imágenes Web para SEO: Guía Definitiva"
- ✅ "React Performance: Proven Techniques to Cut Load Time 50%"
- ❌ "SEO SEO SEO Next.js Best SEO Practices" (keyword stuffing)
- ❌ "This will change your life forever" (vague, no keyword)

### Description Best Practices

**Requirements:**
- **Length**: 155-160 characters (Google's display limit)
- **Keyword**: Include primary keyword naturally
- **CTA**: Include call to action or value proposition
- **Unique**: Different from title and other posts

**Formula**: `[Verb/Action] + [Benefit] + [CTA/Value]`

**Examples:**
- ✅ "Descubre 10 técnicas probadas de SEO para Next.js. Aumenta tu tráfico orgánico 50% con estas estrategias. Guía completa 2025." (156 chars)
- ✅ "Master Next.js SEO with our complete guide. Learn metadata optimization, Core Web Vitals, and ranking strategies. Start today." (132 chars)
- ❌ "This is a blog post about SEO in Next.js." (too vague, no CTA)

### Keywords Strategy

**Primary Keyword:**
- **Research**: Use Google Keyword Planner, Ahrefs, or Ubersuggest
- **Volume**: Minimum 500 monthly searches
- **Difficulty**: KD < 40 for new blogs, KD < 60 for established
- **Intent**: Match user intent (informational, transactional, navigational)

**Usage:**
- H1 title
- First 100 words of content
- At least one H2 heading
- Meta description
- URL slug
- Image alt text (at least one)
- **Density**: 1-2% of total words

**Secondary Keywords (2-3):**
- Related to primary keyword
- Use in H2/H3 headings
- Distribute throughout content
- **Density**: 0.5-1% each

**LSI Keywords (Latent Semantic Indexing):**
- Synonyms and related terms
- Natural language variations
- Context-specific terminology
- Example: Primary "Next.js SEO" → LSI: "App Router optimization", "server components ranking", "metadata API"

---

## Content Optimization

### Headings Hierarchy

**Rules:**
- **One H1 per page** (the title)
- **H2 for main sections** (3-7 per post)
- **H3 for subsections** (as needed)
- **H4 rarely** (only if truly necessary)
- **Don't skip levels** (H1 → H3 is invalid)

**SEO Optimization:**
- Include secondary keyword in at least one H2
- Use power words in 30% of headings
- Make headings descriptive, not clever
- Front-load keywords (beginning of heading)

**Example Structure:**
```markdown
# Ultimate Next.js SEO Guide: 10 Tips to Rank #1 (H1 - Title)

## 1. Master Metadata with generateMetadata() (H2 - Secondary keyword)

### Why Dynamic Metadata Matters (H3)

### Implementation Steps (H3)

## 2. Optimize Core Web Vitals for Better Rankings (H2 - Power word)

### Understanding LCP (Largest Contentful Paint) (H3)

### Fixing CLS (Cumulative Layout Shift) (H3)
```

### Content Length Guidelines

**Minimum**: 1,000 words
**Sweet Spot**: 1,500-2,500 words (best balance of depth and readability)
**Maximum**: 3,500 words (beyond this, consider splitting into series)

**Exceptions:**
- Tutorials/Guides: 2,000-3,000 words
- News/Updates: 500-800 words
- Listicles: 100-150 words per item × number of items

### Readability Standards

**Target**: Flesch Reading Ease score of **60+** (8th-grade level)

**How to achieve:**
- Short sentences (average 15-20 words)
- Short paragraphs (2-4 sentences max)
- Simple vocabulary (avoid jargon unless defined)
- Active voice ("You will learn" not "It will be learned")
- Transition words ("However", "Therefore", "Additionally")

**Tools**: Hemingway Editor, Grammarly, Yoast SEO

### Content Quality Checklist

- [ ] Original content (not duplicate or spun)
- [ ] Solves a specific problem or answers a question
- [ ] Includes practical examples and code snippets
- [ ] Actionable advice (not just theory)
- [ ] Up-to-date information (check dates of external sources)
- [ ] Skimmable (headings, lists, bold text for scanning)
- [ ] Engaging (conversational tone, addresses reader directly)

---

## Power Words Strategy

Power words are terms with strong psychological impact that trigger emotional responses. They're essential for increasing CTR, engagement, and conversions.

### Why Power Words Work

According to *Cashvertising* by Drew Eric Whitman, power words appeal to the **8 fundamental biological desires**:

1. Survival and enjoyment of life
2. Enjoyment of food and beverage
3. Freedom from fear, pain, and danger
4. Sexual companionship
5. Comfortable living conditions
6. To be superior, winning
7. Care of loved ones
8. Social approval

### Types of Power Words

#### 1. Seductive Power Words (Bypass Logic)

These words override rational thinking and push users to act almost irrationally:

- **Nuevo/New**: Translates to "better" in consumer's mind
- **Gratis/Free**: Dramatically reduces resistance to action
- **Porque/Because**: Giving a reason increases acceptance (Ellen Langer study)
- **Cómo/How**: Demonstrates practical knowledge, highly shareable

#### 2. Emotional Power Words (High Activation)

Trigger strong emotions that drive sharing and action:

- **Curiosity**: "Secret", "Hidden", "Untold", "Surprising", "Revealing"
- **Fear/Urgency**: "Warning", "Danger", "Avoid", "Mistake", "Don't"
- **Desire**: "Proven", "Guaranteed", "Certified", "Ultimate", "Essential"
- **Achievement**: "Master", "Unlock", "Transform", "Breakthrough", "Revolutionary"

#### 3. Sensory Power Words (Paint Mental Pictures)

Activate the five senses and create vivid imagery:

- **Sight**: "Brilliant", "Sparkling", "Vibrant", "Crystal-clear"
- **Sound**: "Crisp", "Harmonious", "Thunderous", "Whisper-quiet"
- **Touch**: "Smooth", "Velvety", "Razor-sharp", "Feather-light"
- **Taste**: "Delicious", "Rich", "Savory", "Sweet"
- **Smell**: "Aromatic", "Fresh", "Pungent"

### Power Words by Category (Spanish & English)

#### Engagement Power Words (Headlines & CTAs)

| Spanish | English | Effect |
|---------|---------|--------|
| Secreto | Secret | Curiosity |
| Oculto | Hidden | Mystery |
| Sorprendente | Surprising | Intrigue |
| Nuevo | New | Freshness |
| Gratis | Free | Value |
| Probado | Proven | Trust |
| Esencial | Essential | Importance |
| Definitivo | Ultimate | Authority |
| Sin esfuerzo | Effortless | Ease |
| Revolucionario | Revolutionary | Innovation |

#### Trust & Authority Power Words

| Spanish | English |
|---------|---------|
| Certificado | Certified |
| Garantizado | Guaranteed |
| Comprobado | Proven |
| Respaldado | Backed |
| Experto | Expert |
| Profesional | Professional |
| Verificado | Verified |
| Oficial | Official |

#### Action-Driving Power Words (CTAs)

| Spanish | English |
|---------|---------|
| Descubre | Discover |
| Transforma | Transform |
| Domina | Master |
| Desbloquea | Unlock |
| Construye | Build |
| Crea | Create |
| Lanza | Launch |
| Logra | Achieve |

### Power Words Usage Rules

1. **Headlines**: Use 3-5 power words per title
2. **Subheadings**: Include 1-2 power words per H2/H3
3. **Natural Integration**: Avoid keyword stuffing or forced usage
4. **Variety**: Don't repeat the same power word multiple times
5. **Match Intensity**: Align power word strength with content tone
6. **Test**: A/B test different power words in titles for CTR

### Extended Power Words List (Spanish)

| A - C | D - G | H - P | Q - Z |
|-------|-------|-------|-------|
| Absoluto | Dañino | Habilidoso | Quemar |
| Absurdo | Decepción | Impactante | Rápido |
| Abuso | Definitivo | Increíble | Raro |
| Acción | Delicioso | Inesperado | Real |
| Alucinante | Desafiante | Infernal | Rebelde |
| Asombroso | Desastroso | Instantáneo | Regalo |
| Auténtico | Desbloquear | Irresistible | Revelar |
| Autoridad | Descubrir | Jamás | Secreto |
| Bajo coste | Deseo | Lanzamiento | Sencillo |
| Beneficio | Destruir | Legendario | Sin esfuerzo |
| Brutal | Dinámico | Lujoso | Sorprendente |
| Caos | Dinero | Magia | Truco |
| Catástrofe | Eficaz | Magnífico | Último |
| Chantaje | Élite | Milagro | Único |
| Clandestino | Épico | Mordaz | Urgente |
| Codicia | Escándalo | Nuevo | Valioso |
| Confesión | Exclusivo | Oferta | Victoria |
| Crucial | Éxito | Peligro | Visionario |

---

## Next.js SEO Requirements

### 1. Rendering Strategy (The Golden Rule)

**Editorial Content MUST use:**
- **SSG (Static Site Generation)** for evergreen content
- **ISR (Incremental Static Regeneration)** for content that updates periodically

**NEVER use:**
- **CSR (Client-Side Rendering)** for blog post body or metadata
- Blog posts that depend on `'use client'` for main content

**Validation:**
```bash
npm run build

# Check output:
# ○ Static   - Pre-rendered (GOOD for blog)
# ⚡ ISR      - Incremental Static Regeneration (GOOD for blog)
# λ Server   - Server-rendered (BAD for blog SEO)
```

### 2. generateMetadata() Implementation

**Every blog post MUST implement dynamic metadata:**

```typescript
// app/[lang]/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { getBlogPost } from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const text = await getDictionary(lang);
  const post = await getBlogPost(slug, lang);

  return {
    title: post.title, // 50-60 chars, includes power words
    description: post.excerpt, // 155-160 chars
    keywords: post.tags.join(', '),
    authors: [{ name: post.author || 'Alkitu' }],
    alternates: {
      canonical: `https://alkitu.com/${lang}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'Alkitu'],
      tags: post.tags,
      images: [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.imageAlt || post.title,
      }],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: '@alkitu',
    },
  };
}
```

### 3. next.config.js Configuration

**Critical settings for SEO:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure URL consistency (avoid duplicate content)
  trailingSlash: true,

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'your-cms.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable ISR
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds
      static: 180, // 3 minutes
    },
  },
};

module.exports = nextConfig;
```

### 4. Image Optimization

**ALWAYS use Next.js Image component:**

```tsx
import Image from 'next/image';

<Image
  src="/blog/post-slug/image.jpg"
  alt="Descriptive alt text with keyword"
  width={800}
  height={450}
  priority={false} // Only true for above-fold images
  quality={85} // Balance quality vs file size
  placeholder="blur" // Show blur while loading
  blurDataURL="data:image/..." // Generated blur placeholder
/>
```

**Image Requirements:**
- **Format**: WebP or AVIF (automatic via Next.js)
- **Max Size**: 200KB per image
- **Dimensions**:
  - Hero: 1200x630 (Open Graph)
  - Content: 800x450 (16:9 ratio)
  - Thumbnail: 400x225
- **Filenames**: Descriptive with keywords (e.g., `nextjs-seo-optimization.webp`)
- **Alt Text**: Descriptive, natural keyword integration, <125 characters

### 5. URL Structure

**SEO-friendly URL format:**
```
/[locale]/blog/[category]/[slug]
```

**Examples:**
- `/es/blog/desarrollo-web/guia-seo-nextjs`
- `/en/blog/web-development/nextjs-seo-guide`

**Slug Best Practices:**
- Lowercase only
- Hyphens (not underscores or spaces)
- Include primary keyword
- 3-5 words maximum
- No stop words (a, the, and) unless necessary
- Avoid numbers/dates (for evergreen content)

### 6. Schema Markup (JSON-LD)

**BlogPosting schema is MANDATORY:**

```typescript
// app/[lang]/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const { lang, slug } = await params;
  const post = await getBlogPost(slug, lang);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [
      `https://alkitu.com${post.coverImage}`, // 1:1 ratio
      `https://alkitu.com${post.coverImage}`, // 4:3 ratio
      `https://alkitu.com${post.coverImage}`, // 16:9 ratio
    ],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Alkitu',
      url: 'https://alkitu.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alkitu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alkitu.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alkitu.com/${lang}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Blog post content */}
    </>
  );
}
```

### 7. Internal & External Linking

**Internal Links (3-5 per post):**
- Link to related blog posts
- Link to relevant pages (services, projects)
- Use `next/link` component (automatic prefetching)
- Descriptive anchor text (not "click here")
- Open in same tab

**Example:**
```tsx
import Link from 'next/link';

<Link href="/es/blog/react-performance">
  Descubre cómo optimizar el rendimiento de React
</Link>
```

**External Links (2-3 per post):**
- Link to authoritative sources (MDN, Next.js docs, W3C)
- Open in new tab (`target="_blank"`)
- Add `rel="noopener noreferrer"` for security
- Only link to high-quality, relevant sites

**Example:**
```tsx
<a
  href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata"
  target="_blank"
  rel="noopener noreferrer"
>
  Next.js generateMetadata() docs
</a>
```

---

## Technical SEO

### 1. Core Web Vitals Optimization

| Metric | Target | Implementation in Next.js |
|--------|--------|---------------------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Use `priority` prop on hero `<Image>` component |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Define `width` and `height` on ALL images |
| **INP** (Interaction to Next Paint) | < 200ms | Move heavy scripts to Web Workers with `next/script` strategy="worker" |

**LCP Optimization:**
```tsx
// Hero image - load immediately
<Image
  src="/blog/hero.jpg"
  alt="..."
  width={1200}
  height={630}
  priority // Preload this image
/>
```

**CLS Prevention:**
```tsx
// Always specify dimensions
<Image
  src="/content-image.jpg"
  alt="..."
  width={800}
  height={450} // Prevents layout shift
/>
```

**INP Optimization:**
```tsx
// app/layout.tsx
import Script from 'next/script';

<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="worker" // Runs in Web Worker
/>
```

### 2. Sitemap Generation

**Create dynamic sitemap for blog posts:**

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts();

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://alkitu.com/${post.locale}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: 'https://alkitu.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...blogEntries,
  ];
}
```

### 3. Robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://alkitu.com/sitemap.xml
```

### 4. Source Code Verification

**Test if content is indexable:**

1. Open blog post in browser
2. Press `Ctrl+U` (View Page Source)
3. Search for first paragraph text (Ctrl+F)
4. **PASS**: Text is in HTML source (indexable)
5. **FAIL**: Text not in source (client-rendered, not indexable)

### 5. Canonical URLs

**Prevent duplicate content:**

```typescript
// In generateMetadata()
alternates: {
  canonical: `https://alkitu.com/${lang}/blog/${slug}`,
}
```

---

## Bilingual Content

### Translation Requirements

ALL blog posts MUST have both English and Spanish versions.

**What to translate:**
- Title and meta description
- All headings (H1, H2, H3)
- Body content
- Image alt text
- Code comments
- CTA buttons

**What NOT to translate:**
- Code syntax (JavaScript, TypeScript, etc.)
- Package names (`next`, `react`, etc.)
- URLs in code examples
- Brand names

### Spanish Power Words Equivalents

Maintain emotional impact when translating:

| English | Spanish | Category |
|---------|---------|----------|
| Ultimate | Definitivo | Authority |
| Proven | Comprobado | Trust |
| Essential | Esencial | Importance |
| Unlock | Desbloquea | Action |
| Secret | Secreto | Curiosity |
| Guaranteed | Garantizado | Trust |
| Instant | Instantáneo | Urgency |
| Revolutionary | Revolucionario | Innovation |
| Effortless | Sin esfuerzo | Ease |
| Exclusive | Exclusivo | Value |

### Localization (Not Just Translation)

**Adapt cultural references:**
- Examples: Use relevant companies/products for each market
- Measurements: Metric (Spanish) vs Imperial (English) if applicable
- Idioms: Translate meaning, not words

**Example:**
```markdown
<!-- English -->
It's like finding a needle in a haystack.

<!-- Spanish (localized) -->
Es como buscar una aguja en un pajar.
```

### Locale-Specific SEO

**Spanish keywords may differ:**

English: "web development"
Spanish: "desarrollo web" (direct) BUT users may search "programación web", "desarrollo de sitios", etc.

**Research Spanish keywords separately:**
- Use Google Keyword Planner with Spanish locale
- Check Google Trends for regional variations
- Consider Latin American vs Spain Spanish

### hreflang Tags

**Implement in `generateMetadata()`:**

```typescript
alternates: {
  canonical: `https://alkitu.com/${lang}/blog/${slug}`,
  languages: {
    'es': `https://alkitu.com/es/blog/${slug}`,
    'en': `https://alkitu.com/en/blog/${slug}`,
  },
}
```

---

## Using Claude Code Agent

### seo-blog-writer Agent

This project includes a specialized Claude Code agent (`seo-blog-writer`) for creating SEO-optimized blog content.

**Location**: `.claude/agents/seo-blog-writer.md`

### Prompt Examples

#### 1. Generate New Blog Post

```
Using the SEO Blog Guide (docs/SEO_BLOG_GUIDE.md) and the seo-blog-writer agent, create a new blog post about Next.js App Router best practices.

Target keyword: "next.js app router"
Locale: es
Category: Web Development
Audience: Intermediate to advanced developers
Length: 2000 words

Follow the template in docs/templates/blog-post-template.mdx and ensure all SEO best practices are applied.
```

#### 2. Optimize Existing Post

```
Review the blog post at app/[lang]/blog/react-performance/page.mdx using SEO_BLOG_GUIDE.md.

Identify SEO issues and suggest improvements for:
- Title and meta description (CTR optimization)
- Keyword usage and density
- Heading structure and hierarchy
- Internal linking opportunities
- Image optimization (alt text, dimensions)
- Power words integration
```

#### 3. Generate SEO Metadata

```
Based on SEO_BLOG_GUIDE.md, generate optimized metadata for a blog post about "TypeScript generic types advanced patterns".

Primary keyword: "typescript generics"
Locale: en
Include: title (with power words), description, keywords array, and schema markup JSON-LD.
```

#### 4. Translate and Localize

```
Translate the blog post at app/en/blog/nextjs-seo-guide/page.mdx to Spanish.

Ensure:
- Power words are localized (not literal translation)
- Cultural references are adapted
- Spanish SEO keywords are researched and used
- Reading level matches original (Flesch 60+)
```

### Workflow with Agent

1. **Research Phase**: Use agent to research keywords and analyze competitors
2. **Outline Phase**: Generate outline with SEO-optimized headings
3. **Writing Phase**: Create full blog post with agent assistance
4. **Optimization Phase**: Review and optimize metadata, images, links
5. **Translation Phase**: Translate to second language with localization
6. **Review Phase**: Final SEO audit before publishing

---

## Publishing Checklist

### Pre-Publication

**Content Quality:**
- [ ] Title is 50-60 characters with 2-3 power words
- [ ] Meta description is 155-160 characters with CTA
- [ ] Primary keyword in first 100 words
- [ ] 1,500+ words (or appropriate length for topic)
- [ ] Flesch Reading Ease score 60+
- [ ] Short paragraphs (2-4 sentences max)
- [ ] Headings hierarchy correct (H1 → H2 → H3, no skipping)
- [ ] 3-5 internal links with descriptive anchor text
- [ ] 2-3 external links to authoritative sources
- [ ] Code examples syntax-highlighted with comments
- [ ] Proofreading completed (Grammarly or similar)

**SEO Technical:**
- [ ] URL slug is SEO-friendly (lowercase, hyphens, keyword)
- [ ] All images optimized (WebP/AVIF, <200KB, proper dimensions)
- [ ] All images have descriptive alt text
- [ ] Next.js `<Image>` component used (not `<img>`)
- [ ] Hero image has `priority` prop
- [ ] Schema markup (BlogPosting JSON-LD) implemented
- [ ] Open Graph tags complete (title, description, image)
- [ ] Twitter Card tags complete
- [ ] Canonical URL set correctly
- [ ] hreflang tags for bilingual content

**Bilingual:**
- [ ] Both English and Spanish versions exist
- [ ] Translations are natural (not literal/machine-translated)
- [ ] Power words localized for emotional impact
- [ ] Spanish keywords researched separately
- [ ] Cultural references adapted

### Post-Publication

**Immediate:**
- [ ] Submit URL to Google Search Console
- [ ] Share on social media (Twitter, LinkedIn)
- [ ] Share in relevant communities (Reddit, Dev.to)
- [ ] Add to email newsletter (if applicable)

**First Week:**
- [ ] Monitor Google Search Console for indexing
- [ ] Check Core Web Vitals in PageSpeed Insights
- [ ] Verify rich snippets appear (use Google Rich Results Test)
- [ ] Update internal links from other blog posts

**Ongoing:**
- [ ] Track keyword rankings (weekly)
- [ ] Monitor analytics (traffic, bounce rate, time on page)
- [ ] Respond to comments/questions
- [ ] Update content every 6-12 months (refresh dates, stats, examples)

---

## Tools & Resources

### SEO Tools

**Free:**
- [Google Search Console](https://search.google.com/search-console) - Index status, keyword performance
- [Google Analytics](https://analytics.google.com) - Traffic analysis, user behavior
- [PageSpeed Insights](https://pagespeed.web.dev/) - Core Web Vitals audit
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Schema markup validation

**Paid:**
- [Ahrefs](https://ahrefs.com) - Keyword research, backlink analysis, competitor research
- [SEMrush](https://www.semrush.com) - Comprehensive SEO suite
- [Ubersuggest](https://neilpatel.com/ubersuggest/) - Keyword research (affordable)

### Content Tools

- [Hemingway Editor](https://hemingwayapp.com/) - Readability scoring
- [Grammarly](https://www.grammarly.com/) - Grammar and spelling
- [Answer The Public](https://answerthepublic.com/) - Content ideas from search queries
- [TinyPNG](https://tinypng.com/) - Image compression
- [Canva](https://www.canva.com/) - Featured image creation

### Monitoring

**What to track:**
- Keyword rankings (weekly)
- Organic traffic (monthly)
- Average time on page (monthly)
- Bounce rate (monthly)
- Top-performing posts (monthly)
- Backlinks (quarterly)

**Set goals:**
- Top 10 ranking for primary keyword within 3 months
- 10% organic traffic growth monthly
- 3+ minutes average time on page
- <60% bounce rate

---

## See Also

- [CLAUDE.md](../CLAUDE.md) - Core project conventions
- [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) - i18n implementation
- [PERFORMANCE.md](PERFORMANCE.md) - Performance optimization
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [Templates](templates/) - Blog post templates and examples

---

**This guide is your SEO bible. Follow it religiously for maximum search visibility and organic traffic growth.**
