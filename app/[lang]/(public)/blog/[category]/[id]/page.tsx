import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import BlogNotFound from '@/app/components/organisms/errors/BlogNotFound';
import { MDXContent } from '@/app/components/organisms/mdx-content';
import { PostHero } from '@/app/components/organisms/post-hero';
import { Locale } from '@/i18n.config';
import { NewsletterSubscribe } from '@/app/components/organisms/newsletter-subscribe';
import { TableOfContents } from '@/app/components/organisms/table-of-contents';
import TailwindGrid from '@/app/components/templates/grid';
import { Breadcrumbs } from '@/app/components/molecules/breadcrumbs';
import { RelatedPosts } from '@/app/components/molecules/related-posts';
import {
  getPost,
  getPosts,
  getPostRoutes,
  getRelatedPosts,
  getTranslation,
  getAuthorPhoto,
} from '@/lib/blog/queries';
import { postSchemas } from '@/lib/blog/jsonld';
import type { BlogLocale } from '@/lib/types/blog';

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    lang: Locale;
    category: string;
    id: string;
  }>;
}

export async function generateStaticParams() {
  return getPostRoutes();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const post = await getPost(lang as BlogLocale, id);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

  // hreflang resolves through translation_group_id, not by matching slugs, so
  // pairs whose slugs diverge across locales are still linked correctly.
  const otherLocale: BlogLocale = post.locale === 'es' ? 'en' : 'es';
  const twin = await getTranslation(post.translationGroupId, otherLocale);

  const languages: Record<string, string> = {
    [post.locale]: `${baseUrl}${post.url}`,
  };
  if (twin) {
    languages[twin.locale] = `${baseUrl}${twin.url}`;
    languages['x-default'] = `${baseUrl}${post.locale === 'es' ? post.url : twin.url}`;
  }

  return {
    title: post.title,
    description: post.metaDescription ?? undefined,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription ?? undefined,
      type: 'article',
      publishedTime: post.date ?? undefined,
      modifiedTime: post.updatedAt ?? post.date ?? undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt ?? post.title }]
        : [],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription ?? undefined,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `${baseUrl}${post.url}`,
      languages,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, category, id } = await params;
  const post = await getPost(lang as BlogLocale, id);

  if (!post) {
    const allPosts = await getPosts(lang as BlogLocale);
    return <BlogNotFound allPosts={allPosts} currentLocale={lang} />;
  }

  // The category segment used to be decorative: any value resolved the post,
  // so every article was reachable at unlimited URLs. Send wrong segments to
  // the canonical one instead of serving duplicate content.
  if (category !== post.categorySlug) {
    permanentRedirect(post.url);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';
  const shareUrl = `${baseUrl}${post.url}`;

  const [authorPhotoUrl, related] = await Promise.all([
    getAuthorPhoto(post.authorUsername),
    getRelatedPosts(post),
  ]);

  const schemas = postSchemas(post, [
    { name: lang === 'es' ? 'Inicio' : 'Home', path: `/${lang}` },
    { name: 'Blog', path: `/${lang}/blog` },
    { name: post.categories[0], path: `/${lang}/blog/${post.categorySlug}` },
    { name: post.title },
  ]);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <PostHero
        title={post.title}
        author={post.author ?? ''}
        authorUsername={post.authorUsername ?? undefined}
        authorPhotoUrl={authorPhotoUrl}
        date={post.date ?? ''}
        categories={post.categories}
        tags={post.tags}
        image={post.image ?? ''}
        imageCredit={post.imageCredit ?? undefined}
        shareUrl={shareUrl}
        locale={lang}
      />

      <TailwindGrid>
        <article className="col-span-full py-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* Introduction Box */}
            {post.excerpt && (
              <div className="bg-muted/30 border border-border rounded-lg p-8 mb-12">
                <p className="text-foreground/80 text-base lg:text-lg leading-relaxed italic">
                  {post.excerpt}
                </p>
              </div>
            )}

            {post.sections.length > 0 && <TableOfContents locale={lang} />}

            <MDXContent source={post.body} />

            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => {
                    const tagSlug = tag
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[̀-ͯ]/g, '')
                      .replace(/\s+/g, '-');
                    return (
                      <Link
                        key={tag}
                        href={`/${lang}/blog?tag=${tagSlug}`}
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        #{tag}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{post.readTime}</span>
              {post.updatedAt && post.updatedAt !== post.date && (
                <span>
                  {lang === 'es' ? 'Actualizado:' : 'Updated:'}{' '}
                  {new Date(post.updatedAt).toLocaleDateString(
                    lang === 'es' ? 'es-ES' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {post.wordCount} {lang === 'es' ? 'palabras' : 'words'}
            </div>

            <RelatedPosts
              locale={lang}
              posts={related.map((p) => ({
                title: p.title,
                slug: p.slug,
                url: p.url,
                image: p.image ?? '',
                excerpt: p.excerpt ?? '',
                readTime: p.readTime ?? '',
              }))}
            />
          </div>
        </article>
      </TailwindGrid>

      <NewsletterSubscribe locale={lang} />
    </>
  );
}
