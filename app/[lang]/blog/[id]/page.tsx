import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostHero } from '@/app/components/organisms/post-hero';
import { TableOfContents } from '@/app/components/organisms/table-of-contents';
import { NewsletterSubscribe } from '@/app/components/organisms/newsletter-subscribe';
import TailwindGrid from '@/app/components/templates/grid';
import blogData from '@/app/data/blog-posts.json';
import { Locale } from '@/i18n.config';

interface BlogPostPageProps {
  params: Promise<{
    lang: Locale;
    id: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const paths: { lang: string; id: string }[] = [];

  blogData.posts.forEach((post) => {
    post.lang.forEach((language) => {
      paths.push({
        lang: language,
        id: post.slug,
      });
    });
  });

  return paths;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, id } = await params;

  // Find the post by slug
  const post = blogData.posts.find((p) => p.slug === id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Get translation for current locale
  const translation = post.translations[lang] || post.translations['es'];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';
  const postUrl = `${baseUrl}/${lang}/blog/${id}`;

  return {
    title: translation.title,
    description: translation.excerpt,
    openGraph: {
      title: translation.title,
      description: translation.excerpt,
      url: postUrl,
      siteName: 'Alkitu',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: translation.title,
        },
      ],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.title,
      description: translation.excerpt,
      images: [post.image],
      creator: '@alkitu',
    },
    alternates: {
      canonical: postUrl,
      languages: {
        'es': `${baseUrl}/es/blog/${id}`,
        'en': `${baseUrl}/en/blog/${id}`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, id } = await params;

  // Find the post by slug
  const post = blogData.posts.find((p) => p.slug === id);

  if (!post || !post.lang.includes(lang)) {
    notFound();
  }

  // Get translation for current locale
  const translation = post.translations[lang] || post.translations['es'];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';
  const shareUrl = `${baseUrl}/${lang}/blog/${id}`;

  return (
    <>
      {/* Post Hero Section */}
      <PostHero
        title={translation.title}
        author={post.author}
        date={post.date}
        category={post.category}
        image={post.image}
        imageCredit={undefined}
        shareUrl={shareUrl}
        locale={lang}
      />

      {/* Post Content Section */}
      <TailwindGrid>
        <article className="col-span-full py-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Introduction Box */}
            <div className="bg-muted/30 border border-border rounded-lg p-8 mb-12">
              <p className="text-foreground/80 text-base lg:text-lg leading-relaxed italic">
                {translation.excerpt}
              </p>
            </div>

            {/* Table of Contents */}
            <TableOfContents locale={lang} />

            {/* Main Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:text-foreground/80
              prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-bold
              prose-ul:text-foreground/80 prose-ol:text-foreground/80
              prose-li:text-base prose-li:md:text-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic
            ">
            {/* Content will go here - for now showing placeholder */}
            <h2>Contenido del Post</h2>
            <p>
              El contenido completo del blog post irá aquí. Este es un placeholder
              que se reemplazará con el contenido real del post.
            </p>

            <h3>Sección de Ejemplo</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <blockquote>
              <p>
                Esta es una cita de ejemplo que muestra cómo se verían las citas
                en el contenido del blog.
              </p>
            </blockquote>

            <h3>Otra Sección</h3>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

              <ul>
                <li>Punto de lista uno</li>
                <li>Punto de lista dos</li>
                <li>Punto de lista tres</li>
              </ul>
            </div>
          </div>
        </article>
      </TailwindGrid>

      {/* Newsletter Subscription */}
      <NewsletterSubscribe locale={lang} />
    </>
  );
}
