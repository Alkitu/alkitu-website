'use client';

import { motion } from 'framer-motion';
import LandingLeadForm from './LandingLeadForm';

export default function FinalCtaSection({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      id="cta-form"
      className="relative w-full py-20 md:py-28 scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"
      />

      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          {eyebrow && (
            <p className="text-primary font-semibold uppercase tracking-widest text-xs md:text-sm mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-foreground/65 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        <LandingLeadForm />
      </div>
    </section>
  );
}
