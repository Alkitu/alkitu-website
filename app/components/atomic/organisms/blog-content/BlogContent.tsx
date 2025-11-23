'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BlogHero } from '@/app/components/atomic/organisms/blog-hero';
import { BlogList } from '@/app/components/atomic/organisms/blog-list';
import { BlogGrid } from '@/app/components/atomic/organisms/blog-grid';
import { PageHeader } from '@/app/components/atomic/organisms/page-header';
import TailwindGrid from '@/app/components/templates/grid';
import { AnimatePresence } from 'framer-motion';

interface BlogPostRaw {
  id: string;
  slug: string;
  translations: {
    [key: string]: {
      title: string;
      excerpt: string;
    };
  };
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  lang: string[];
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  featured?: boolean;
  lang: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface BlogContentProps {
  posts: BlogPostRaw[];
  categories: Category[];
  locale: string;
  title: string;
  description?: string;
  translations: {
    all: string;
    recent: string;
    emprendimiento: string;
    desarrolloWeb: string;
    publicidad: string;
    disenoGrafico: string;
    socialMedia: string;
    marketing: string;
    otrasPublicaciones: string;
  };
}

export default function BlogContent({ posts, categories, locale, title, description, translations }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Transform posts with translations to include title and excerpt in current locale
  const transformPost = (post: BlogPostRaw): BlogPost => {
    const translation = post.translations[locale] || post.translations['es'];
    return {
      ...post,
      title: translation.title,
      excerpt: translation.excerpt,
    };
  };

  // Prepare filters for PageHeader
  const filters = [
    { id: 'all', label: translations.all, value: 'all' },
    { id: 'recent', label: translations.recent, value: 'recent' },
    ...categories.map(cat => ({
      id: cat.id,
      label: cat.name,
      value: cat.slug,
    })),
  ];

  // Filter posts by locale and transform to include title/excerpt
  const localePosts = posts
    .filter(post => post.lang.includes(locale))
    .map(transformPost);

  // Filter posts by selected category
  const filteredPosts = selectedCategory === 'all'
    ? localePosts
    : selectedCategory === 'recent'
    ? [...localePosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
    : localePosts.filter(post => post.category === getCategoryName(selectedCategory));

  // Get category name from slug
  function getCategoryName(slug: string): string {
    const categoryMap: { [key: string]: string } = {
      'emprendimiento': 'Emprendimiento',
      'desarrollo-web': 'Desarrollo Web',
      'publicidad': 'Publicidad',
      'diseno-grafico': 'Diseño Gráfico',
      'social-media': 'Social Media',
      'marketing': 'Marketing'
    };
    return categoryMap[slug] || '';
  }

  // Get featured and recent posts
  const featuredPost = filteredPosts.find(post => post.featured);
  const recentPosts = filteredPosts.filter(post => !post.featured).slice(0, 3);

  // Get posts by category for filtered view
  const getCategoryPosts = (categoryName: string) => {
    return filteredPosts.filter(post => post.category === categoryName && !post.featured);
  };

  return (
    <>
      {/* Page Header with Title, Description, and Filters */}
      <PageHeader
        title={title}
        description={description}
        filters={filters}
        activeFilter={selectedCategory}
        onFilterChange={setSelectedCategory}
      />

      {/* Main Content */}
      <TailwindGrid>
        <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
          <AnimatePresence mode="wait">
            {/* Blog Hero - Featured + Recent Posts */}
            {featuredPost && selectedCategory === 'all' && (
              <BlogHero
                key="blog-hero"
                featuredPost={featuredPost}
                recentPosts={recentPosts}
                locale={locale}
              />
            )}

            {/* Filtered View - Show only selected category */}
            {selectedCategory !== 'all' ? (
              <div key={`filtered-${selectedCategory}`} className="mb-16">
                <BlogGrid
                  posts={filteredPosts}
                  locale={locale}
                  categoryTitle={selectedCategory === 'recent' ? translations.recent : getCategoryName(selectedCategory)}
                  columns={4}
                />
              </div>
            ) : (
              <>
                {/* All Categories View */}

                {/* Recientes Section */}
                {localePosts.length > 0 && (
                  <div key="recientes-section" className="mb-16">
                    <BlogGrid
                      posts={[...localePosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)}
                      locale={locale}
                      categoryTitle={translations.recent}
                      columns={4}
                    />
                  </div>
                )}

                {getCategoryPosts('Emprendimiento').length > 0 && (
                  <div key="emprendimiento-section" className="mb-16">
                    <BlogList
                      posts={getCategoryPosts('Emprendimiento').slice(0, 4)}
                      locale={locale}
                      categoryTitle={translations.emprendimiento}
                    />
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </TailwindGrid>

      {selectedCategory === 'all' && (
        <>
          {/* Alkitu Logo Full Width */}
          <div className="w-full bg-zinc-900 dark:bg-zinc-900 py-16 mb-16 flex justify-center items-center">
            <div className="relative w-full max-w-2xl h-32 md:h-40">
              {/* Light mode logo */}
              <Image
                src="/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg"
                alt="Alkitu - Hazlo a lo grande"
                fill
                className="object-contain dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg"
                alt="Alkitu - Hazlo a lo grande"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </div>

          <TailwindGrid>
            <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
              {/* Desarrollo Web Section */}
              {getCategoryPosts('Desarrollo Web').length > 0 && (
                <div className="mb-16">
                  <BlogGrid
                    posts={getCategoryPosts('Desarrollo Web').slice(0, 8)}
                    locale={locale}
                    categoryTitle={translations.desarrolloWeb}
                    columns={4}
                  />
                </div>
              )}

              {/* Publicidad Section */}
              {getCategoryPosts('Publicidad').length > 0 && (
                <div className="mb-16">
                  <BlogGrid
                    posts={getCategoryPosts('Publicidad').slice(0, 4)}
                    locale={locale}
                    categoryTitle={translations.publicidad}
                    columns={4}
                  />
                </div>
              )}

              {/* Diseño Gráfico Section */}
              {getCategoryPosts('Diseño Gráfico').length > 0 && (
                <div className="mb-16">
                  <BlogGrid
                    posts={getCategoryPosts('Diseño Gráfico').slice(0, 4)}
                    locale={locale}
                    categoryTitle={translations.disenoGrafico}
                    columns={4}
                  />
                </div>
              )}

              {/* Social Media Section */}
              {getCategoryPosts('Social Media').length > 0 && (
                <div className="mb-16">
                  <BlogGrid
                    posts={getCategoryPosts('Social Media').slice(0, 4)}
                    locale={locale}
                    categoryTitle={translations.socialMedia}
                    columns={4}
                  />
                </div>
              )}

              {/* Marketing Section */}
              {getCategoryPosts('Marketing').length > 0 && (
                <div className="mb-16">
                  <BlogGrid
                    posts={getCategoryPosts('Marketing').slice(0, 4)}
                    locale={locale}
                    categoryTitle={translations.marketing}
                    columns={4}
                  />
                </div>
              )}

              {/* Otras Publicaciones */}
              <div className="mb-16">
                <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-8">
                  {translations.otrasPublicaciones}
                </h2>
                <BlogGrid
                  posts={localePosts.slice(0, 4)}
                  locale={locale}
                  columns={4}
                />
              </div>
            </div>
          </TailwindGrid>
        </>
      )}
    </>
  );
}
