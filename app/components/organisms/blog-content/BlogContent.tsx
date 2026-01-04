'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BlogHero } from '@/app/components/organisms/blog-hero';
import { BlogList } from '@/app/components/organisms/blog-list';
import { BlogGrid } from '@/app/components/organisms/blog-grid';
import { PageHeader } from '@/app/components/organisms/page-header';
import SideBar from '@/app/components/organisms/sidebar/SideBar';
import TailwindGrid from '@/app/components/templates/grid';
import { AnimatePresence } from 'framer-motion';
import NewsletterSubscribe from '@/app/components/organisms/newsletter-subscribe/NewsletterSubscribe';

interface BlogPostRaw {
  id: string;
  slug: string;
  categorySlug: string; // Add category slug for URL generation
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
  categorySlug: string; // Add category slug for URL generation
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
    newsletter: string;
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
      categorySlug: post.categorySlug, // Ensure category slug is passed through
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
      'diseno-ux-ui': 'Diseño UX/UI',
      'social-media': 'Social Media',
      'redes-sociales': 'Redes Sociales',
      'marketing': 'Marketing',
      'marketing-digital': 'Marketing Digital',
      'inteligencia-artificial': 'Inteligencia Artificial',
      'tecnologia': 'Tecnología',
      'negocio': 'Negocio'
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

  // Create sidebar sections based on categories with posts
  const sidebarSections = selectedCategory === 'all' ? [
    { id: 'hero-section', name: translations.recent },
    ...(getCategoryPosts('Emprendimiento').length > 0 ? [{ id: 'emprendimiento-section', name: translations.emprendimiento }] : []),
    ...(getCategoryPosts('Marketing Digital').length > 0 ? [{ id: 'marketing-digital-section', name: 'Marketing Digital' }] : []),
    ...(getCategoryPosts('Desarrollo Web').length > 0 ? [{ id: 'desarrollo-web-section', name: translations.desarrolloWeb }] : []),
    ...(getCategoryPosts('Diseño UX/UI').length > 0 ? [{ id: 'diseno-ux-ui-section', name: 'Diseño UX/UI' }] : []),
    { id: 'otras-publicaciones-section', name: translations.otrasPublicaciones },
    { id: 'newsletter-section', name: translations.newsletter },
  ] : [
    { id: 'filtered-section', name: selectedCategory === 'recent' ? translations.recent : getCategoryName(selectedCategory) },
    { id: 'newsletter-section', name: translations.newsletter },
  ];

  return (
    <TailwindGrid fullSize>
      {/* Sidebar - show for both all and filtered views */}
      {sidebarSections.length > 0 && (
        <SideBar sections={sidebarSections} />
      )}

      {/* Main Content Column */}
      <div className="col-span-full flex flex-col">
        {/* Page Header Section */}
        <div id="blog-header">
          <PageHeader
            title={title}
            subtitle={description}
            filters={filters}
            activeFilter={selectedCategory}
            onFilterChange={setSelectedCategory}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Filtered View - Show only selected category */}
          {selectedCategory !== 'all' ? (
            <div key={`filtered-${selectedCategory}`} id="filtered-section" className="mb-16">
              <TailwindGrid>
                <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                  <BlogGrid
                    posts={filteredPosts}
                    locale={locale}
                    categoryTitle={selectedCategory === 'recent' ? translations.recent : getCategoryName(selectedCategory)}
                    columns={4}
                  />
                </div>
              </TailwindGrid>
            </div>
          ) : (
            <>
              {/* All Categories View */}

              {/* Recientes Section */}
              {localePosts.length > 0 && (
                <div id="hero-section" className="mb-16">
                  <TailwindGrid>
                    <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                      <BlogGrid
                        posts={[...localePosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)}
                        locale={locale}
                        categoryTitle={translations.recent}
                        columns={4}
                      />
                    </div>
                  </TailwindGrid>
                </div>
              )}

              {/* Emprendimiento Section */}
              {getCategoryPosts('Emprendimiento').length > 0 && (
                <div id="emprendimiento-section" className="mb-16">
                  <TailwindGrid>
                    <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                      <BlogList
                        posts={getCategoryPosts('Emprendimiento').slice(0, 4)}
                        locale={locale}
                        categoryTitle={translations.emprendimiento}
                      />
                    </div>
                  </TailwindGrid>
                </div>
              )}

              {/* Alkitu Logo Full Width */}
              <div className="w-full bg-zinc-900 dark:bg-zinc-900 py-16 mb-16 flex justify-center items-center">
                <div className="relative w-full max-w-2xl h-32 md:h-40">
                  <Image
                    src="/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg"
                    alt="Alkitu - Hazlo a lo grande"
                    fill
                    className="object-contain dark:hidden"
                    priority
                  />
                  <Image
                    src="/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg"
                    alt="Alkitu - Hazlo a lo grande"
                    fill
                    className="object-contain hidden dark:block"
                    priority
                  />
                </div>
              </div>

              {/* Marketing Digital Section */}
              {getCategoryPosts('Marketing Digital').length > 0 && (
                <div id="marketing-digital-section" className="mb-16">
                  <TailwindGrid>
                    <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                      <BlogGrid
                        posts={getCategoryPosts('Marketing Digital').slice(0, 8)}
                        locale={locale}
                        categoryTitle="Marketing Digital"
                        columns={4}
                      />
                    </div>
                  </TailwindGrid>
                </div>
              )}

              {/* Desarrollo Web Section */}
              {getCategoryPosts('Desarrollo Web').length > 0 && (
                <div id="desarrollo-web-section" className="mb-16">
                  <TailwindGrid>
                    <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                      <BlogGrid
                        posts={getCategoryPosts('Desarrollo Web').slice(0, 8)}
                        locale={locale}
                        categoryTitle={translations.desarrolloWeb}
                        columns={4}
                      />
                    </div>
                  </TailwindGrid>
                </div>
              )}

              {/* Diseño UX/UI Section */}
              {getCategoryPosts('Diseño UX/UI').length > 0 && (
                <div id="diseno-ux-ui-section" className="mb-16">
                  <TailwindGrid>
                    <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                      <BlogGrid
                        posts={getCategoryPosts('Diseño UX/UI').slice(0, 4)}
                        locale={locale}
                        categoryTitle="Diseño UX/UI"
                        columns={4}
                      />
                    </div>
                  </TailwindGrid>
                </div>
              )}

              {/* Otras Publicaciones Section */}
              <div id="otras-publicaciones-section" className="mb-16">
                <TailwindGrid>
                  <div className="col-span-full lg:col-start-2 lg:col-end-14 py-12">
                    <h2 className="header-section text-foreground mb-8 text-center lg:text-left">
                      {translations.otrasPublicaciones}
                    </h2>
                    <BlogGrid
                      posts={localePosts.slice(0, 4)}
                      locale={locale}
                      columns={4}
                    />
                  </div>
                </TailwindGrid>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Newsletter Section */}
        <div id="newsletter-section" className="w-full mt-20">
          <NewsletterSubscribe locale={locale} />
        </div>
      </div>
    </TailwindGrid>
  );
}
