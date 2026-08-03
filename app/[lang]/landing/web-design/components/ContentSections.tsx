'use client';

import { motion } from 'framer-motion';
import {
  Check,
  Clock,
  Server,
  RefreshCcw,
  Smartphone,
  Wrench,
  Award,
  Briefcase,
  ShieldCheck,
  Headphones,
  ClipboardList,
  Paintbrush,
  Code2,
  Rocket,
} from 'lucide-react';
import { ReactNode } from 'react';

type Item = { title: string; description: string };
type Step = { number: string; title: string; description: string };

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 300 },
  },
};

/* ─────────── Problem ─────────── */

export function ProblemSection({ title, description }: { title?: string; description?: string }) {
  return (
    <section className="w-full py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="max-w-4xl mx-auto px-6 md:px-10"
      >
        <div className="rounded-3xl bg-foreground/5 border border-foreground/10 p-8 md:p-12">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-base md:text-xl text-foreground/70 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────── What's Included ─────────── */

const includedIcons: ReactNode[] = [
  <ClipboardList key="i1" className="w-6 h-6" strokeWidth={1.75} />,
  <Paintbrush key="i2" className="w-6 h-6" strokeWidth={1.75} />,
  <Server key="i3" className="w-6 h-6" strokeWidth={1.75} />,
  <RefreshCcw key="i4" className="w-6 h-6" strokeWidth={1.75} />,
  <Smartphone key="i5" className="w-6 h-6" strokeWidth={1.75} />,
  <Wrench key="i6" className="w-6 h-6" strokeWidth={1.75} />,
];

export function WhatsIncludedSection({
  title,
  subtitle,
  items = [],
}: {
  title?: string;
  subtitle?: string;
  items?: Item[];
}) {
  return (
    <section id="whats-included" className="w-full py-16 md:py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-foreground/60">{subtitle}</p>
          )}
        </motion.div>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {items.map((item, i) => (
            <motion.li
              key={i}
              variants={fadeUp}
              className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-7 hover:border-primary/40 hover:bg-foreground/[0.05] transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5">
                {includedIcons[i % includedIcons.length]}
              </div>
              <h3 className="text-lg font-black mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm md:text-base text-foreground/65 leading-relaxed">
                {item.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─────────── Why Alkitu ─────────── */

const whyIcons: ReactNode[] = [
  <Clock key="w1" className="w-6 h-6" strokeWidth={1.75} />,
  <Briefcase key="w2" className="w-6 h-6" strokeWidth={1.75} />,
  <Award key="w3" className="w-6 h-6" strokeWidth={1.75} />,
  <Headphones key="w4" className="w-6 h-6" strokeWidth={1.75} />,
];

export function WhyAlkituSection({ title, items = [] }: { title?: string; items?: Item[] }) {
  return (
    <section className="w-full py-16 md:py-24 bg-foreground/[0.02] border-y border-foreground/5">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12 md:mb-16 text-center"
        >
          {title}
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex gap-5 p-6 md:p-7 rounded-2xl bg-background border border-foreground/10"
            >
              <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                {whyIcons[i % whyIcons.length]}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black mb-2 leading-tight">{item.title}</h3>
                <p className="text-sm md:text-base text-foreground/65 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── How It Works ─────────── */

const stepIcons: ReactNode[] = [
  <ClipboardList key="s1" className="w-5 h-5" strokeWidth={2} />,
  <Paintbrush key="s2" className="w-5 h-5" strokeWidth={2} />,
  <Code2 key="s3" className="w-5 h-5" strokeWidth={2} />,
  <Rocket key="s4" className="w-5 h-5" strokeWidth={2} />,
];

export function HowItWorksSection({
  title,
  subtitle,
  steps = [],
}: {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}) {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-foreground/60">{subtitle}</p>
          )}
        </motion.div>

        <motion.ol
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.number}
              variants={fadeUp}
              className="relative rounded-2xl bg-foreground/[0.03] border border-foreground/10 p-7 pt-8"
            >
              <div className="absolute -top-4 left-7 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-zinc-950 shadow-md">
                {stepIcons[i % stepIcons.length]}
              </div>
              <div className="text-xs font-black text-primary tracking-widest mb-2 mt-2">
                {step.number}
              </div>
              <h3 className="text-lg font-black mb-2 leading-tight">{step.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ─────────── Guarantee ─────────── */

const guaranteeIcons: ReactNode[] = [
  <RefreshCcw key="g1" className="w-6 h-6" strokeWidth={1.75} />,
  <Clock key="g2" className="w-6 h-6" strokeWidth={1.75} />,
  <ShieldCheck key="g3" className="w-6 h-6" strokeWidth={1.75} />,
];

export function GuaranteeSection({
  title,
  items = [],
}: {
  title?: string;
  items?: Item[];
}) {
  return (
    <section className="w-full py-16 md:py-24 bg-foreground/[0.02] border-y border-foreground/5">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center"
        >
          {title}
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl bg-background border border-primary/30 p-7 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 mx-auto">
                {guaranteeIcons[i % guaranteeIcons.length]}
              </div>
              <h3 className="text-lg font-black mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── Inline Check (re-exported helper) ─────────── */

export const InlineCheck = ({ className = '' }: { className?: string }) => (
  <Check className={`w-4 h-4 text-primary ${className}`} strokeWidth={3} />
);
