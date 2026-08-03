import { MetadataRoute } from 'next';
import {
  getProjectsForSitemap,
  generateProjectSitemapEntries,
} from '@/lib/sitemap-utils';
import { getAllPosts } from '@/lib/blog/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alkitu.com';
  const locales = ['en', 'es'];
  const currentDate = new Date();

  // Static routes that exist in both locales
  const staticRoutes = [
    '',           // Homepage
    '/about',
    '/projects',
    '/blog',
    '/contact',
    '/servicios/branding',
    '/servicios/marketing-digital',
    '/servicios/product-building',
    '/servicios/ingenieria-de-marca',
    '/servicios/webs-corporativas',
    '/servicios/product-building/web-app-custom',
    '/privacy-policy',
    '/cookie-policy',
  ];

  // Generate sitemap entries for all locales
  const localeRoutes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : route.startsWith('/servicios') ? 0.9 : route.startsWith('/privacy') || route.startsWith('/cookie') ? 0.3 : 0.8,
    }))
  );

  // Add root redirect (lower priority)
  const rootRoute = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  };

  // Fetch and add dynamic project routes
  const projects = await getProjectsForSitemap();
  const projectRoutes = generateProjectSitemapEntries(projects, baseUrl, locales);

  // Blog posts.
  //
  // `post.url` is built from the stored `categoria_slug`, so the sitemap now
  // agrees with the canonical tag and the on-page links. Previously this file
  // derived the category slug with its own regex (`/\s+/`, missing slashes),
  // which is why it published `/blog/diseno-ux/ui` and `/blog/general/...`
  // URLs that contradicted every canonical on the site.
  const blogPosts = await getAllPosts();

  const blogPostRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : post.date
        ? new Date(post.date)
        : currentDate,
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.9 : post.prioridad,
  }));

  // Category listings \u2014 these are real pages now (app/[lang]/blog/[category]),
  // so the entries below resolve instead of 404ing.
  const categoriesByLocale = new Map<string, Set<string>>();
  for (const post of blogPosts) {
    const set = categoriesByLocale.get(post.locale) ?? new Set<string>();
    set.add(post.categorySlug);
    categoriesByLocale.set(post.locale, set);
  }

  const blogCategoryRoutes = [...categoriesByLocale.entries()].flatMap(
    ([locale, slugs]) =>
      [...slugs].map((category) => ({
        url: `${baseUrl}/${locale}/blog/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  );

  return [
    rootRoute,
    ...localeRoutes,
    ...projectRoutes,
    ...blogCategoryRoutes,
    ...blogPostRoutes,
  ];
}
