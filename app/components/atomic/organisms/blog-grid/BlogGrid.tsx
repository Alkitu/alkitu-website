'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

interface BlogGridProps {
  posts: BlogPost[];
  locale: string;
  categoryTitle?: string;
  columns?: 2 | 3 | 4;
}

export default function BlogGrid({ posts, locale, categoryTitle, columns = 4 }: BlogGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  // Container variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="w-full">
      {categoryTitle && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">El Proyecto digital</p>
          <h2 className="text-2xl lg:text-3xl font-black text-foreground">
            {categoryTitle}
          </h2>
        </div>
      )}

      <motion.div
        className={`grid ${gridCols[columns]} gap-6`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="group block border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50"
            >
              {/* Post Image */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Post Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary font-semibold uppercase">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>

                <h3 className="text-base lg:text-lg font-bold text-foreground group-hover:text-primary mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

                <span className="inline-block text-primary text-xs font-semibold hover:underline">
                  Leer Más »
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
