'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PostImage } from '@/app/components/molecules/post-image';
import { SocialShare } from '@/app/components/molecules/social-share';
import TailwindGrid from '@/app/components/templates/grid';
import { motion } from 'framer-motion';

interface PostHeroProps {
  title: string;
  author: string;
  authorUsername?: string;
  authorPhotoUrl?: string | null;
  date: string;
  categories: string[];
  tags?: string[];
  image: string;
  imageCredit?: string;
  shareUrl: string;
  locale: string;
}

/**
 * PostHero component displays the hero section of a blog post
 * Includes: avatar, title, metadata, featured image, and social share buttons
 * Uses TailwindGrid for consistent layout
 */
export default function PostHero({
  title,
  author,
  authorUsername,
  authorPhotoUrl,
  date,
  categories,
  tags,
  image,
  imageCredit,
  shareUrl,
  locale,
}: PostHeroProps) {
  // Format date based on locale
  const formattedDate = new Date(date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full bg-background dark:bg-zinc-900 py-16 md:py-20">
      <TailwindGrid>
        <motion.div
          className="col-span-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-4xl mx-auto px-6">
            {/* Author Avatar */}
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              {authorUsername ? (
                <Link
                  href={`/${locale}/profile/${authorUsername}`}
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-muted hover:ring-4 hover:ring-primary/20 transition-all duration-200"
                  title={`Ver perfil de ${author}`}
                >
                  {authorPhotoUrl ? (
                    <Image
                      src={authorPhotoUrl}
                      alt={author}
                      fill
                      className="object-cover z-10 relative"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </Link>
              ) : (
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                  {authorPhotoUrl ? (
                    <Image
                      src={authorPhotoUrl}
                      alt={author}
                      fill
                      className="object-cover z-10 relative"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-center text-foreground mb-6"
          >
            {title}
          </motion.h1>

          {/* Metadata */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <p className="text-foreground/80 mb-2">
              <span className="font-medium">
                {locale === 'es' ? 'Por' : 'By'}{' '}
                {authorUsername ? (
                  <Link
                    href={`/${locale}/profile/${authorUsername}`}
                    className="text-primary hover:underline"
                  >
                    {author}
                  </Link>
                ) : (
                  author
                )}
              </span>
              {' - '}
              <span>{formattedDate}</span>
            </p>

            {/* Categories and Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Categories Display */}
              {categories && categories.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {locale === 'es' ? (categories.length > 1 ? 'Categorías' : 'Categoría') : (categories.length > 1 ? 'Categories' : 'Category')}:
                  </span>
                  {categories.map((category, index) => (
                    <span key={index} className="text-sm text-foreground font-semibold">
                      {category}
                      {index < categories.length - 1 && <span className="text-muted-foreground">, </span>}
                    </span>
                  ))}
                </>
              )}

              {/* Tags Display */}
              {tags && tags.length > 0 && (
                <>
                  <span className="text-muted-foreground mx-2">|</span>
                  <span className="text-sm text-muted-foreground">
                    {locale === 'es' ? 'Tags' : 'Tags'}:
                  </span>
                  {tags.map((tag, index) => (
                    <span key={index} className="text-sm text-foreground">
                      {tag}
                      {index < tags.length - 1 && <span className="text-muted-foreground">, </span>}
                    </span>
                  ))}
                </>
              )}
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div variants={itemVariants} className="mb-6">
            <PostImage
              src={image}
              alt={title}
              credit={imageCredit}
              priority
            />
          </motion.div>

            {/* Social Share Buttons */}
            <motion.div variants={itemVariants}>
              <SocialShare
                url={shareUrl}
                title={title}
                description={title}
              />
            </motion.div>
          </div>
        </motion.div>
      </TailwindGrid>
    </div>
  );
}
