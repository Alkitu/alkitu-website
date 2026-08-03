'use client';

import { motion } from 'framer-motion';
import WorkMarquee, { type MarqueeProject } from './WorkMarquee';

export default function PortfolioSection({
  title,
  subtitle,
  projects,
  locale,
}: {
  title?: string;
  subtitle?: string;
  projects: MarqueeProject[];
  locale: string;
}) {
  if (!projects.length) return null;

  return (
    <section className="w-full py-16 md:py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-10 mb-10 md:mb-14 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-foreground/60 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6 }}
      >
        <WorkMarquee projects={projects} locale={locale} />
      </motion.div>
    </section>
  );
}
