# [FEATURE] Add Database-Driven Blog Posts to Sitemap

**Labels:** `feature`, `seo`, `blog`, `P2`
**Priority:** 🟡 Medium (P2)

---

## 📖 User Story

**Como** administrador del sitio web
**Quiero** que los posts del blog se incluyan automáticamente en el sitemap cuando son publicados
**Para** mejorar la indexación de contenido del blog en motores de búsqueda y aumentar el tráfico orgánico

**Escenario 1:** Blog posts publicados se agregan al sitemap
**Dado que** el blog usa datos desde Supabase en lugar de archivos JSON estáticos
**Cuando** un post del blog es marcado como publicado (`published = true`)
**Entonces** la URL del post debe aparecer automáticamente en `sitemap.xml` en ambos idiomas

**Escenario 2:** Blog posts no publicados se excluyen
**Dado que** existen posts en borrador o no publicados
**Cuando** un post tiene `published = false`
**Entonces** la URL del post NO debe aparecer en el sitemap

**Escenario 3:** Actualización de `lastModified`
**Dado que** un post del blog es editado
**Cuando** se actualiza el campo `updated_at` en la base de datos
**Entonces** el sitemap debe reflejar la nueva fecha en `lastModified`

---

## 🎯 Contexto de Producto

**Problema que resuelve:**
- Actualmente el blog usa datos estáticos desde JSON, limitando la generación dinámica del sitemap
- Los posts del blog no se incluyen en el sitemap, reduciendo visibilidad SEO
- Cuando el blog migre a Supabase (database-driven), necesitaremos generación automática de URLs

**Impacto esperado:**
- **SEO**: Mejora en indexación de contenido del blog (+30-40 URLs indexables)
- **Tráfico orgánico**: Aumento de visibilidad en búsquedas relacionadas con artículos del blog
- **Usuarios afectados**: Lectores que buscan contenido técnico en Google
- **Métricas**: Incremento esperado del 15-20% en impresiones de búsqueda (según GSC)

**Prioridad de negocio:**
- **Media (P2)** - Depende de la migración del blog a Supabase (aún no implementada)
- Deseable para lanzamiento de blog database-driven
- No bloquea funcionalidad actual (blog estático funciona sin sitemap)

---

## ✅ Criterios de Aceptación

**Funcionalidad:**
- [ ] `getBlogPostsForSitemap()` implementado en `lib/sitemap-utils.ts`
  - [ ] Fetches posts donde `published = true`
  - [ ] Incluye campos: `slug`, `updated_at`
  - [ ] Ordena por `updated_at DESC`
- [ ] `generateBlogSitemapEntries()` implementado en `lib/sitemap-utils.ts`
  - [ ] Genera URLs en formato: `/{locale}/blog/{slug}`
  - [ ] Soporta ambos idiomas (`en`, `es`)
  - [ ] `priority: 0.7` (mayor que projects: 0.6)
  - [ ] `changeFrequency: 'monthly'`
- [ ] `app/sitemap.ts` actualizado:
  - [ ] Llama a `getBlogPostsForSitemap()`
  - [ ] Descomenta código de blog routes
  - [ ] Incluye blog entries en respuesta final
- [ ] Sitemap.xml incluye todas las URLs de blog publicadas
- [ ] URLs de blog no publicadas NO aparecen en sitemap

**Calidad:**
- [ ] TypeScript types actualizados para blog post queries
- [ ] Manejo de errores en caso de fallo de Supabase
- [ ] Performance: Query optimizada (solo campos necesarios)

**Testing:**
- [ ] Build exitoso (`npm run build`)
- [ ] Validación manual de sitemap.xml generado
- [ ] Verificar formato XML válido
- [ ] Probar con 0 posts, 1 post, y múltiples posts publicados

**Documentación:**
- [ ] Comentarios en código actualizados (remover TODOs)
- [ ] Agregar JSDoc a funciones nuevas
- [ ] Actualizar `docs/SUPABASE.md` si se agrega tabla `blog_posts`

---

## 🔧 Especificaciones Técnicas

**Archivos a modificar:**

```
lib/sitemap-utils.ts
├── Descomentar getBlogPostsForSitemap()
├── Descomentar generateBlogSitemapEntries()
└── Actualizar tipos TypeScript

app/sitemap.ts
├── Importar funciones de blog
├── Descomentar blog fetching
└── Agregar blogRoutes a response array
```

**Código a implementar:**

```typescript
// lib/sitemap-utils.ts

/**
 * Fetch all published blog posts for sitemap generation
 */
export async function getBlogPostsForSitemap() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }

  return posts || [];
}

/**
 * Generate blog sitemap entries for all locales
 */
export function generateBlogSitemapEntries(
  posts: Array<{ slug: string; updated_at: string }>,
  baseUrl: string,
  locales: string[]
) {
  return posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );
}
```

```typescript
// app/sitemap.ts

import {
  getProjectsForSitemap,
  generateProjectSitemapEntries,
  getBlogPostsForSitemap,      // ← Descomentar
  generateBlogSitemapEntries,  // ← Descomentar
} from '@/lib/sitemap-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ... existing code ...

  // Fetch blog posts
  const blogPosts = await getBlogPostsForSitemap();
  const blogRoutes = generateBlogSitemapEntries(blogPosts, baseUrl, locales);

  return [
    rootRoute,
    ...localeRoutes,
    ...projectRoutes,
    ...blogRoutes,  // ← Agregar
  ];
}
```

**Nuevas dependencias:**
- None (usa Supabase client existente)

**Consideraciones:**

**Database schema (prerequisito):**
```sql
-- Tabla blog_posts debe existir en Supabase
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title_en text NOT NULL,
  title_es text NOT NULL,
  content_en text,
  content_es text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**i18n:** ✅ Sí (URLs generadas para `en` y `es`)
**Analytics:** ❌ No (sitemap no trackea analytics)
**Database changes:** ✅ Sí (requiere tabla `blog_posts` en Supabase)

---

## 🔗 Dependencias

**Bloqueado por:**
- [ ] Migración del blog a database-driven (Supabase)
- [ ] Creación de tabla `blog_posts` en Supabase
- [ ] Migración de posts estáticos (JSON) a base de datos

**Bloquea:**
- Google Search Console re-submission con blog URLs
- SEO optimization para contenido del blog

**Relacionado:**
- Ticket: Migrate blog from JSON to Supabase (no creado aún)
- Ticket: Google Search Console verification (#1)

---

## 🎨 Diseño/Mockups

No aplica (cambio backend sin impacto visual)

**Ejemplo de sitemap.xml generado:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Existing routes... -->

  <!-- Blog posts (new) -->
  <url>
    <loc>https://alkitu.com/en/blog/nextjs-best-practices</loc>
    <lastmod>2025-01-15T10:30:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://alkitu.com/es/blog/nextjs-best-practices</loc>
    <lastmod>2025-01-15T10:30:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- More blog posts... -->
</urlset>
```

---

## 📊 Métricas de Éxito

**Indicadores técnicos:**
- Sitemap.xml incluye todas las URLs de blog publicadas
- Build time no aumenta significativamente (<1s adicional)
- No errores de Supabase en logs

**Indicadores de negocio (post-implementación):**
- Aumento de páginas indexadas en Google Search Console
- Incremento de impresiones de búsqueda para keywords del blog
- Reducción de "Discovered - not indexed" URLs en GSC Coverage

**Timeline esperado:**
- Semana 1: Implementación completa
- Semana 2-4: Indexación progresiva en Google
- Mes 2-3: Métricas de tráfico orgánico evidentes

---

## 📝 Notas Adicionales

**Orden de implementación sugerido:**

1. **Pre-requisito:** Crear tabla `blog_posts` en Supabase
2. **Pre-requisito:** Migrar posts JSON a database
3. Implementar `getBlogPostsForSitemap()` y `generateBlogSitemapEntries()`
4. Actualizar `app/sitemap.ts`
5. Probar localmente con build
6. Deploy a production
7. Re-enviar sitemap en Google Search Console
8. Monitorear indexación en GSC Coverage Report

**Alternativas consideradas:**

- **Opción A (actual):** Incluir blog en sitemap principal
  - Pros: Simple, un solo sitemap
  - Contras: Sitemap puede crecer (actualmente <100 URLs, OK)

- **Opción B:** Crear sitemap separado para blog
  - Pros: Mejor organización si blog crece mucho (1000+ posts)
  - Contras: Más complejidad, no necesario actualmente
  - **Decisión:** Implementar Opción A, migrar a B si blog supera 500 posts

**Referencias:**
- [Next.js Dynamic Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generate-a-sitemap)
- [Google Sitemap Best Practices](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-sitemap-guidelines)
