'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/atoms/button';

type TrustBadge = { value: string; label: string };

type HeroProps = {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  priceFrom?: string;
  priceLow?: string;
  priceTo?: string;
  priceHigh?: string;
  cta?: string;
  ctaSecondary?: string;
  trustBadges?: TrustBadge[];
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
      delayChildren: 0.1,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HeroSection({
  eyebrow,
  title,
  highlight,
  subtitle,
  priceFrom,
  priceLow,
  priceTo,
  priceHigh,
  cta,
  ctaSecondary,
  trustBadges = [],
}: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Glow background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent dark:from-primary/15"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-20 text-center"
      >
        {eyebrow && (
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs md:text-sm font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
              {eyebrow}
            </span>
          </motion.div>
        )}

        <motion.h1
          variants={itemVariants}
          className="font-black tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.05]"
        >
          {title}{' '}
          {highlight && <span className="text-primary">{highlight}</span>}
        </motion.h1>

        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Price anchor */}
        <motion.div
          variants={itemVariants}
          className="inline-flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1 mb-10 px-6 py-4 rounded-2xl bg-foreground/5 border border-foreground/10"
        >
          {priceFrom && (
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-foreground/60">
              {priceFrom}
            </span>
          )}
          {priceLow && (
            <span className="text-2xl md:text-3xl font-black text-primary">{priceLow}</span>
          )}
          {priceTo && (
            <span className="text-xs md:text-sm font-semibold text-foreground/60 mx-1">
              {priceTo}
            </span>
          )}
          {priceHigh && (
            <span className="text-2xl md:text-3xl font-black text-foreground">{priceHigh}</span>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-12"
        >
          {cta && (
            <a href="#cta-form">
              <Button
                variant="primary"
                size="lg"
                iconAfter={<ArrowRight className="w-5 h-5" />}
                className="text-base min-w-[240px]"
              >
                {cta}
              </Button>
            </a>
          )}
          {ctaSecondary && (
            <a href="#whats-included">
              <Button variant="ghost" size="lg" className="text-base">
                {ctaSecondary}
              </Button>
            </a>
          )}
        </motion.div>

        {/* Trust badges */}
        {trustBadges.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4 pt-8 border-t border-foreground/10"
          >
            {trustBadges.map((badge, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-primary leading-none">
                  {badge.value}
                </div>
                <div className="text-xs md:text-sm text-foreground/60 mt-1.5 uppercase tracking-wide font-semibold">
                  {badge.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
