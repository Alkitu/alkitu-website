import { MetadataRoute } from 'next';
import {
  getProjectsForSitemap,
  generateProjectSitemapEntries,
} from '@/lib/sitemap-utils';

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
  ];

  // Generate sitemap entries for all locales
  const localeRoutes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
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

  // TODO: Add dynamic blog routes when blog is database-driven
  // const blogPosts = await getBlogPostsForSitemap();
  // const blogRoutes = generateBlogSitemapEntries(blogPosts, baseUrl, locales);

  return [
    rootRoute,
    ...localeRoutes,
    ...projectRoutes,
    // ...blogRoutes,  // Uncomment when blog is database-driven
  ];
}
