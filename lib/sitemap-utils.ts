import { createClient } from '@/lib/supabase/server';

/**
 * Fetch all active projects for sitemap generation
 * Returns array of project slugs with update dates
 */
export async function getProjectsForSitemap() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  return projects || [];
}

/**
 * Generate project sitemap entries for all locales
 */
export function generateProjectSitemapEntries(
  projects: Array<{ slug: string; updated_at: string }>,
  baseUrl: string,
  locales: string[]
) {
  return projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );
}

/**
 * TODO: Fetch blog posts for sitemap
 * Uncomment and implement when blog is database-driven
 */
// export async function getBlogPostsForSitemap() {
//   const supabase = await createClient();
//
//   const { data: posts } = await supabase
//     .from('blog_posts')
//     .select('slug, updated_at')
//     .eq('published', true)
//     .order('updated_at', { ascending: false });
//
//   return posts || [];
// }

/**
 * Generate blog sitemap entries for all locales
 */
// export function generateBlogSitemapEntries(
//   posts: Array<{ slug: string; updated_at: string }>,
//   baseUrl: string,
//   locales: string[]
// ) {
//   return posts.flatMap((post) =>
//     locales.map((locale) => ({
//       url: `${baseUrl}/${locale}/blog/${post.slug}`,
//       lastModified: new Date(post.updated_at),
//       changeFrequency: 'monthly' as const,
//       priority: 0.7,
//     }))
//   );
// }
