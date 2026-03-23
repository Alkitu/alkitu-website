# Informe de Auditoria SEO - Alkitu Website

**Fecha:** 23 de marzo de 2026
**Proyecto:** alkitu-website (Next.js 16 App Router)
**Base URL:** https://alkitu.com
**Locales:** es (predeterminado), en

---

## Resumen Ejecutivo

Se identificaron 20 problemas SEO clasificados por severidad (critico, alto, medio, bajo). Se corrigieron **19 de 20 acciones** - todas las criticas, altas, medias y la mayoria de las bajas. Solo queda pendiente 1 item (remarkGfm) que requiere correccion de contenido en 2 posts MDX antes de poder habilitarse.

---

## FASE 1: 10 ACCIONES PRIORITARIAS (Completadas)

### 1. Blog posts: generateMetadata + generateStaticParams

**Archivo:** `app/[lang]/(public)/blog/[category]/[id]/page.tsx`

**Problema:** Solo habia comentarios placeholder. Cada post del blog se servia sin titulo, descripcion, Open Graph ni Twitter Cards propios.

**Solucion:**
- `generateStaticParams()` pre-genera todas las rutas de blog posts desde Contentlayer
- `generateMetadata()` con title, description, keywords, Open Graph (article, publishedTime, modifiedTime, authors, images, locale), Twitter Card, y canonical URL

---

### 2. Eliminado `force-dynamic` del layout raiz

**Archivo:** `app/[lang]/layout.tsx`

**Problema:** `export const dynamic = 'force-dynamic'` impedia TODA generacion estatica e ISR. Cada request era SSR completo.

**Solucion:** Eliminada la linea. El VisitTracker es client-side y no lo necesita.

**Impacto:** Mejora directa en TTFB y LCP.

---

### 3. Hreflang alternates en todas las paginas

**16 paginas modificadas** (homepage, about, projects, blog, contact, privacy-policy, cookie-policy, profile, 6 servicios, project detail)

**Archivo creado:** `lib/seo.ts` - Utilidad `getSeoAlternates(lang, path)` reutilizable

**Solucion:** Cada pagina incluye `alternates.languages` con es, en, y x-default.

---

### 4. URLs canonicas en todas las paginas

Integrado en `getSeoAlternates()` - cada pagina genera `alternates.canonical` automaticamente.

---

### 5. Rutas de servicios en el sitemap

**Archivo:** `app/sitemap.ts`

**Agregadas 8 rutas:** branding, marketing-digital, product-building, ingenieria-de-marca, webs-corporativas, web-app-custom, privacy-policy, cookie-policy. Servicios con prioridad 0.9, legales con 0.3.

---

### 6. Schema Organization + WebSite en layout raiz

**Archivo:** `app/[lang]/layout.tsx`

**Agregados 2 bloques JSON-LD:**
- **Organization:** name, url, logo, description, sameAs (Instagram, LinkedIn), contactPoint
- **WebSite:** name, url, inLanguage, publisher

---

### 7. Imagen OG predeterminada

**Archivo:** `app/[lang]/layout.tsx`

Agregado `images: [{ url: '/og-default.jpg', width: 1200, height: 630 }]` en openGraph y twitter del metadata base.

**ACCION REQUERIDA:** Crear `/public/og-default.jpg` (1200x630px) con branding de Alkitu.

---

### 8. JSON-LD de proyectos movido al server component

**Archivo:** `app/[lang]/(public)/projects/[project]/page.tsx`

JSON-LD `CreativeWork` ahora se genera server-side con datos de Supabase. Los bots sin JavaScript pueden verlo.

---

### 9. Unificacion de carga de fuentes

**Archivos:** `app/[lang]/layout.tsx`, `styles/globals.css`

- Eliminado `@import url()` bloqueante de globals.css
- Reemplazado `Inter` por `Plus_Jakarta_Sans` via `next/font/google`
- Variable CSS `--font-plus-jakarta` aplicada al `<html>`

---

### 10. Breadcrumbs con BreadcrumbList schema

**Archivos creados:** `app/components/molecules/breadcrumbs/Breadcrumbs.tsx`, `index.ts`

Componente con JSON-LD BreadcrumbList automatico, `aria-label="Breadcrumb"`, y links clicables.

---

## FASE 2: 10 MEJORAS ADICIONALES (9 Completadas, 1 Pendiente)

### 11. Footer semantico con enlaces accesibles ✅

**Archivo:** `app/components/organisms/footer/Footer.tsx`

- Envuelto en `<footer>` semantico
- Cambiado `<button onClick={() => window.open()}>` a `<a href target="_blank" rel="noopener noreferrer">` con `aria-label`
- Los bots ahora pueden seguir los enlaces de redes sociales

---

### 12. Navbar con atributos aria ✅

**Archivos:** `NavBar.tsx`, `ToggleMenu.tsx`

- `aria-label="Main navigation"` en `<motion.nav>`
- `aria-haspopup="true"` y `aria-expanded` en dropdown de Servicios
- `role="menu"` en panel dropdown
- `aria-hidden="true"` en SVG decorativo (chevron)
- `aria-label` y `aria-expanded` en ToggleMenu mobile
- `aria-hidden="true"` en SVG hamburguesa
- Cambiado `<span>` trigger del dropdown a `<button type="button">` (semanticamente correcto)

---

### 13. Tags del blog como enlaces navegables ✅

**Archivo:** `app/[lang]/(public)/blog/[category]/[id]/page.tsx`

Cambiado `<span>#{tag}</span>` a `<Link href="/${lang}/blog?tag=${tagSlug}">` con hover styles. Mejora enlazado interno.

---

### 14. Breadcrumbs en mas paginas ✅

**8 paginas adicionales:**
- About (Inicio > Sobre Nosotros)
- Contact (Inicio > Contacto)
- Projects (Inicio > Proyectos)
- Branding (Inicio > Servicios > Branding)
- Marketing Digital (Inicio > Servicios > Marketing Digital)
- Product Building (Inicio > Servicios > Product Building)
- Ingenieria de Marca (Inicio > Servicios > Ingenieria de Marca)
- Webs Corporativas (Inicio > Servicios > Webs Corporativas)
- Web App Custom (Inicio > Servicios > Product Building > Web App Custom)

Cada uno incluye JSON-LD BreadcrumbList automatico.

---

### 15. next/image para Google Partner badge ✅

**Archivo:** `app/[lang]/(public)/servicios/marketing-digital/page.tsx`

Reemplazado `<img>` nativo por `<Image>` de next/image con `unoptimized` (SVG externo).

---

### 16. Alt text descriptivo en hero ✅

**Archivo:** `app/components/organisms/hero-section/HeroPictureTriangle.tsx`

- `alt="Luis"` → `alt="Equipo Alkitu - Agencia digital"`
- `alt="Luis "` → `alt="Alkitu equipo creativo"`

---

### 17. RSS feed para el blog ✅

**Archivo creado:** `app/feed.xml/route.ts`

Feed RSS 2.0 con todos los posts, incluyendo titulo, descripcion, fecha, categoria, autor, e imagen. Cache de 1 hora con stale-while-revalidate de 24h. Disponible en `https://alkitu.com/feed.xml`.

---

### 18. Componente de posts relacionados ✅

**Archivos creados:** `app/components/molecules/related-posts/RelatedPosts.tsx`, `index.ts`

Muestra hasta 3 posts del mismo idioma que comparten categoria o tags. Incluido al final de cada articulo del blog con imagen, titulo, excerpt y tiempo de lectura.

---

### 19. Skip links de accesibilidad ✅

**Archivo:** `app/[lang]/layout.tsx`

Agregado enlace "Saltar al contenido" / "Skip to content" (visible solo con focus via teclado, Tab) que salta al `<main id="main-content">`.

---

### 20. Rehabilitar remarkGfm ❌ PENDIENTE

**Archivo:** `contentlayer.config.ts`

**Estado:** No se pudo habilitar. Los posts `seo-keywords-guide.mdx` (en y es) contienen sintaxis que rompe `mdast-util-gfm-table` (error: `Cannot read properties of undefined (reading 'inTable')`).

**Para resolverlo:**
1. Revisar los archivos `content/blog/en/seo-keywords-guide.mdx` y `content/blog/es/seo-keywords-guide.mdx`
2. Buscar pipes (`|`) sueltos o tablas mal formateadas
3. Corregir la sintaxis o escapar los caracteres
4. Descomentar `remarkGfm` en `contentlayer.config.ts`

---

## ACCION REQUERIDA

### Crear imagen OG default

Se configuro `/og-default.jpg` pero **el archivo no existe**:

1. Crear imagen de **1200x630px** con branding de Alkitu
2. Guardarla en `/public/og-default.jpg`

Sin este archivo, las paginas sin imagen OG propia mostraran enlace roto en redes sociales.

---

## Resumen de Archivos

### Archivos Creados (6)

| Archivo | Proposito |
|---------|-----------|
| `lib/seo.ts` | Utilidad getSeoAlternates() para hreflang y canonical |
| `app/components/molecules/breadcrumbs/Breadcrumbs.tsx` | Componente breadcrumbs con JSON-LD |
| `app/components/molecules/breadcrumbs/index.ts` | Barrel export |
| `app/components/molecules/related-posts/RelatedPosts.tsx` | Posts relacionados |
| `app/components/molecules/related-posts/index.ts` | Barrel export |
| `app/feed.xml/route.ts` | RSS feed |

### Archivos Modificados (28)

| Archivo | Cambios |
|---------|---------|
| `app/[lang]/layout.tsx` | force-dynamic eliminado, Schema Org+WebSite, OG image, fuentes, skip link |
| `app/[lang]/page.tsx` | hreflang + canonical |
| `app/[lang]/(public)/about/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/contact/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/projects/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/projects/[project]/page.tsx` | hreflang + canonical + JSON-LD server-side |
| `app/[lang]/(public)/blog/page.tsx` | hreflang + canonical |
| `app/[lang]/(public)/blog/[category]/[id]/page.tsx` | generateMetadata, generateStaticParams, breadcrumbs, tags como links, related posts |
| `app/[lang]/(public)/privacy-policy/page.tsx` | hreflang + canonical |
| `app/[lang]/(public)/cookie-policy/page.tsx` | hreflang + canonical |
| `app/[lang]/(public)/profile/[username]/page.tsx` | hreflang + canonical |
| `app/[lang]/(public)/servicios/branding/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/servicios/marketing-digital/page.tsx` | hreflang + canonical + breadcrumbs + next/image |
| `app/[lang]/(public)/servicios/product-building/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/servicios/ingenieria-de-marca/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/servicios/webs-corporativas/page.tsx` | hreflang + canonical + breadcrumbs |
| `app/[lang]/(public)/servicios/product-building/web-app-custom/page.tsx` | generateMetadata nuevo + hreflang + canonical + breadcrumbs |
| `app/sitemap.ts` | 8 rutas nuevas (servicios + legales) |
| `app/components/organisms/footer/Footer.tsx` | footer semantico + a href en redes |
| `app/components/organisms/navbar/NavBar.tsx` | aria-label, aria-haspopup, aria-expanded, role, aria-hidden |
| `app/components/organisms/navbar/toggle-menu/ToggleMenu.tsx` | aria-label, aria-expanded, aria-hidden |
| `app/components/organisms/hero-section/HeroPictureTriangle.tsx` | alt text descriptivo |
| `styles/globals.css` | eliminado @import bloqueante, actualizado font-family |
| `contentlayer.config.ts` | comentario actualizado sobre remarkGfm |

---

## Verificacion

- Build exitoso con `npx next build --webpack`
- 0 errores de TypeScript
- Todas las rutas compilan correctamente
- RSS feed disponible en `/feed.xml`
