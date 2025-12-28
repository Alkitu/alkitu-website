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

interface BlogListProps {
  posts: BlogPost[];
  locale: string;
  categoryTitle?: string;
}

export default function BlogList({ posts, locale, categoryTitle }: BlogListProps) {
  // Animation variants for cards - slide from left
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  // Container variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="w-full">
      {categoryTitle && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">El Mundo de negocios</p>
          <h2 className="header-section text-foreground">
            {categoryTitle}
          </h2>
        </div>
      )}

      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={cardVariants}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 250 }}
          >
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col md:flex-row gap-6 hover:bg-muted/20 p-4 rounded-lg"
            >
              {/* Post Image */}
              <div className="relative w-full md:w-64 h-48 md:h-40 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>

              {/* Post Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary font-semibold uppercase">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>

                <h3 className="header-tertiary text-foreground group-hover:text-primary mb-3">
                  {post.title}
                </h3>

                <p className="text-foreground/70 text-sm lg:text-base mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{post.readTime} lectura</span>
                  <span className="text-primary font-semibold hover:underline">
                    Leer Más »
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
