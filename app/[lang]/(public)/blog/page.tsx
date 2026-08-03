import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getSeoAlternates } from '@/lib/seo';
import { getDictionary } from "@/lib/dictionary";
import { BlogContent } from "@/app/components/organisms/blog-content";
import { getPosts, getCategories } from '@/lib/blog/queries';
import type { BlogLocale } from '@/lib/types/blog';

/**
 * Blog Index Page - ISR enabled for optimal SEO
 * Revalidates every hour to keep content fresh
 */
export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: 'Blog',
    description: lang === 'es'
      ? 'Artículos sobre marketing digital, branding, desarrollo web y emprendimiento'
      : 'Articles about digital marketing, branding, web development and entrepreneurship',
    alternates: getSeoAlternates(lang, '/blog'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  const [posts, categories] = await Promise.all([
    getPosts(lang as BlogLocale),
    getCategories(lang as BlogLocale),
  ]);

  // Shape expected by <BlogContent>. `categorySlug` comes straight from the
  // stored column, so listing links, canonical tags and the sitemap can no
  // longer drift apart the way they did under the old dual-slugify logic.
  const transformedPosts = posts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    categorySlug: post.categorySlug,
    translations: {
      [post.locale]: {
        title: post.title,
        excerpt: post.excerpt ?? '',
      },
    },
    image: post.image ?? '',
    category: post.categories[0] ?? 'General',
    date: post.date ?? '',
    readTime: post.readTime ?? '',
    author: post.author ?? '',
    featured: post.featured,
    lang: [post.locale],
  }));

  const categoryOptions = categories.map(({ name, slug }) => ({
    id: slug,
    name,
    slug,
    description: '',
  }));

  const translations = {
    all: text.blog?.all || (lang === 'es' ? 'Todos' : 'All'),
    recent: text.blog?.recent || (lang === 'es' ? 'Recientes' : 'Recent'),
    emprendimiento: text.blog?.emprendimiento || 'Emprendimiento',
    desarrolloWeb: text.blog?.desarrolloWeb || 'Desarrollo Web',
    publicidad: text.blog?.publicidad || 'Publicidad',
    disenoGrafico: text.blog?.disenoGrafico || 'Diseño Gráfico',
    socialMedia: text.blog?.socialMedia || 'Social Media',
    marketing: text.blog?.marketing || 'Marketing',
    otrasPublicaciones: text.blog?.otrasPublicaciones || (lang === 'es' ? 'Otras Publicaciones' : 'Other Publications'),
    newsletter: text.newsletterSection?.titleHighlight || (lang === 'es' ? 'Boletín' : 'Newsletter'),
  };

  return (
    <BlogContent
      posts={transformedPosts}
      categories={categoryOptions}
      locale={lang}
      title={text.blog?.title || (lang === 'es' ? 'BLOG' : 'BLOG')}
      description={text.blog?.description}
      translations={translations}
    />
  );
}
