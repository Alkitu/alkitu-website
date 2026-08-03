import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, i18n } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { BlogContent } from '@/app/components/organisms/blog-content';
import { getPosts, getCategories } from '@/lib/blog/queries';
import type { BlogLocale } from '@/lib/types/blog';

/**
 * Category listing.
 *
 * This route did not exist before, yet `app/sitemap.ts` has been publishing
 * `/{lang}/blog/{categoria}` URLs all along — every one of them a 404. Adding
 * the page turns those submitted URLs into real pages instead of removing them
 * from the sitemap and losing the category-level entry points.
 */

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ lang: Locale; category: string }>;
}

export async function generateStaticParams() {
  const params: Array<{ lang: string; category: string }> = [];
  for (const lang of i18n.locales) {
    const categories = await getCategories(lang as BlogLocale);
    for (const { slug } of categories) {
      params.push({ lang, category: slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { lang, category } = await params;
  const categories = await getCategories(lang as BlogLocale);
  const match = categories.find((c) => c.slug === category);

  if (!match) return { title: 'Blog' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

  return {
    title: `${match.name} | Blog`,
    description:
      lang === 'es'
        ? `Artículos sobre ${match.name.toLowerCase()}.`
        : `Articles about ${match.name.toLowerCase()}.`,
    alternates: { canonical: `${baseUrl}/${lang}/blog/${category}` },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { lang, category } = await params;
  const text = await getDictionary(lang);

  const [allPosts, categories] = await Promise.all([
    getPosts(lang as BlogLocale),
    getCategories(lang as BlogLocale),
  ]);

  const match = categories.find((c) => c.slug === category);
  if (!match) notFound();

  const posts = allPosts.filter((p) => p.categorySlug === category);

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
    otrasPublicaciones:
      text.blog?.otrasPublicaciones || (lang === 'es' ? 'Otras Publicaciones' : 'Other Publications'),
    newsletter:
      text.newsletterSection?.titleHighlight || (lang === 'es' ? 'Boletín' : 'Newsletter'),
  };

  return (
    <BlogContent
      posts={transformedPosts}
      categories={categoryOptions}
      locale={lang}
      title={match.name}
      description={text.blog?.description}
      translations={translations}
    />
  );
}
