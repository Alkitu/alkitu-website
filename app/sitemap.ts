import { MetadataRoute } from 'next';
import {
  getProjectsForSitemap,
  generateProjectSitemapEntries,
} from '@/lib/sitemap-utils';
import { allBlogPosts } from 'contentlayer/generated';

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

  // Generate blog post sitemap entries from Contentlayer
  const blogPostRoutes = allBlogPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  // Generate blog category pages (extract unique categories from all posts)
  const uniqueCategories = Array.from(
    new Set(
      allBlogPosts.map((post) =>
        post.category
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/\s+/g, '-')
      )
    )
  );

  const blogCategoryRoutes = uniqueCategories.flatMap((category) =>
    locales.map((locale) => ({
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
