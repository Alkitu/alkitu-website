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

interface BlogHeroProps {
  featuredPost: BlogPost;
  recentPosts: BlogPost[];
  locale: string;
}

export default function BlogHero({ featuredPost, recentPosts, locale }: BlogHeroProps) {
  // Animation variants for featured post - slide from bottom
  const featuredVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  // Animation variants for recent posts - slide from right
  const recentCardVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  // Container variants for recent posts stagger
  const recentContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
      {/* Featured Post - Left Side */}
      <motion.div
        className="relative"
        variants={featuredVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: "spring" as const, damping: 25, stiffness: 200 }}
      >
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring" as const, damping: 25, stiffness: 200 }}
        >
          <Link href={`/${locale}/blog/${featuredPost.slug}`} className="group block">
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-background text-foreground px-4 py-2 rounded-full text-sm font-bold">
                {featuredPost.category}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="header-section text-foreground group-hover:text-primary mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-body-default text-foreground/70 mb-4">
                {featuredPost.excerpt}
              </p>
              <span className="text-primary font-bold uppercase text-sm hover:underline">
                Leer Más »
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Publications - Right Side */}
      <div>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Novedades</p>
          <h3 className="header-section text-foreground">
            Publicaciones recientes
          </h3>
        </div>

        <motion.div
          className="space-y-6"
          variants={recentContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {recentPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={recentCardVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring" as const, damping: 30, stiffness: 300 }}
            >
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group flex gap-4 hover:bg-muted/30 p-3 rounded-lg"
              >
                {/* Post Image */}
                <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105"
                  />
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="header-tertiary text-foreground group-hover:text-primary mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="inline-block mt-2 text-primary text-xs font-semibold hover:underline">
                    Leer Más »
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
