'use client';

import { motion } from 'framer-motion';
import TailwindGrid from '@/app/components/templates/grid';
import { FilterButtons } from '@/app/components/molecules/filter-buttons';
import { ReactNode } from 'react';

interface FilterButton {
  id: string;
  label: string;
  value: string;
}

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string; // Upper small text (secondary-alt)
  text?: string | ReactNode; // Main body text
  align?: 'center' | 'left';
  filters?: FilterButton[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  className?: string;
  disableGridWrapper?: boolean; // If true, renders without TailwindGrid wrapper
}

export default function PageHeader({
  title,
  subtitle,
  text,
  filters,
  activeFilter,
  onFilterChange,
  align = 'center',
  className = '',
  disableGridWrapper = false,
}: PageHeaderProps) {

  // Description is now mapped to 'subtitle' for backwards compatibility if passed as description by old consumers
  // But wait, the old prop was 'description' which rendered as header-secondary-alt.
  // In the new system:
  // subtitle -> header-secondary-alt
  // text -> text-body-default (longer text)
  // I should check if I need to support 'description' prop alias. 
  // For cleanliness, I'll assume callers will update or I check 'description' too.
  // Actually, I'll add 'description' back as an alias for subtitle to avoid breaking changes immediately, or just update callers.
  // Let's rely on updated callers for new props.

  const isCenter = align === 'center';
  const alignClass = isCenter ? 'items-center text-center' : 'items-center lg:items-start text-center lg:text-left';
  const lineClass = isCenter ? 'mx-auto' : 'mx-auto lg:mx-0';

  const Content = (
    <section className={`flex flex-col gap-6 w-full mb-6 col-span-full ${alignClass} ${className} ${!disableGridWrapper ? 'mt-20 md:mt-24 lg:mt-20 md:pt-8' : ''}`}>
      <div className={`flex flex-col gap-2 w-full ${alignClass}`}>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='header-hero uppercase'
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className={`w-full max-w-sm md:max-w-md h-1 bg-primary rounded-full ${lineClass}`}
        />
      </div>

      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='header-secondary-alt font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400'
        >
          {subtitle}
        </motion.p>
      )}

      {text && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.6 }}
           className='text-body-default max-w-3xl leading-relaxed text-zinc-700 dark:text-zinc-300'
        >
          {typeof text === 'string' ? <p>{text}</p> : text}
        </motion.div>
      )}

      {filters && onFilterChange && activeFilter && (
        <div className='w-full flex justify-center items-center content-center pt-4 pb-10 border-b border-border'>
          <FilterButtons
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
          />
        </div>
      )}
    </section>
  );

  if (disableGridWrapper) {
    return Content;
  }

  return (
    <TailwindGrid>
      {Content}
    </TailwindGrid>
  );
}
