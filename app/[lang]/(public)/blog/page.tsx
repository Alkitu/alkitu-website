import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { BlogContent } from "@/app/components/organisms/blog-content";
import { allBlogPosts } from 'contentlayer/generated';

/**
 * Blog Index Page - ISR enabled for optimal SEO
 * Revalidates every hour to keep content fresh
 */
export const revalidate = 3600; // 1 hour

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  // Filter posts by current locale
  const localePosts = allBlogPosts.filter(post => post.locale === lang);

  // Transform Contentlayer posts to BlogContent format
  const transformedPosts = localePosts.map(post => {
    // Extract primary category (first one) for routing
    const primaryCategory = Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories[0]
      : 'General';
    const categorySlug = primaryCategory
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s\/]+/g, '-'); // Replace spaces AND forward slashes with hyphens

    return {
      id: post.slug,
      slug: post.slug,
      categorySlug: categorySlug, // Add category slug for URL generation
      translations: {
        [post.locale]: {
          title: post.title,
          excerpt: post.excerpt,
        }
      },
      image: post.image,
      category: primaryCategory, // Use primary category for display
      date: post.date,
      readTime: post.readTime,
      author: post.author,
      featured: post.featured,
      lang: [post.locale],
    };
  });

  // Extract unique categories from all post categories
  const allCategories = localePosts.flatMap(post =>
    Array.isArray(post.categories) ? post.categories : []
  );
  const uniqueCategories = Array.from(new Set(allCategories));

  const categories = uniqueCategories.map(categoryName => {
    const slug = categoryName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s\/]+/g, '-'); // Replace spaces AND forward slashes with hyphens

    return {
      id: slug,
      name: categoryName,
      slug: slug,
      description: '',
    };
  });

  // Prepare translations for BlogContent
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
  };

  return (
    <BlogContent
      posts={transformedPosts}
      categories={categories}
      locale={lang}
      title={text.blog?.title || (lang === 'es' ? 'BLOG' : 'BLOG')}
      description={text.blog?.description}
      translations={translations}
    />
  );
}
