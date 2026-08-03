'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type FaqItem = { question: string; answer: string };

export default function FaqSection({
  title,
  items = [],
}: {
  title?: string;
  items?: FaqItem[];
}) {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-10 md:mb-12 text-center"
        >
          {title}
        </motion.h2>

        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden hover:border-primary/30 transition-colors"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-bold text-base md:text-lg">
                <span>{item.question}</span>
                <ChevronDown
                  className="w-5 h-5 text-primary flex-shrink-0 transition-transform group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <div className="px-6 pb-5 text-sm md:text-base text-foreground/65 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
