import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n.config';

interface RelatedPost {
  title: string;
  slug: string;
  url: string;
  image: string;
  excerpt: string;
  readTime: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  locale: Locale;
}

export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">
        {locale === 'es' ? 'También te puede interesar' : 'You might also like'}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.url}
            className="group block rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-colors"
          >
            {post.image && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              <span className="text-xs text-muted-foreground mt-2 block">{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
