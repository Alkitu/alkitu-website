'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
  index: number;
}

interface TableOfContentsProps {
  locale: string;
}

/**
 * TableOfContents component that automatically detects h2 and h3 headings
 * Generates a hierarchical, collapsible navigation menu with smooth scrolling
 */
export default function TableOfContents({ locale }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Find all h2 and h3 elements in the article
    const articleElement = document.querySelector('article');
    if (!articleElement) return;

    const headingElements = articleElement.querySelectorAll('h2, h3');
    const headingData: Heading[] = [];

    headingElements.forEach((heading, index) => {
      // Generate ID if it doesn't exist
      if (!heading.id) {
        const id = `heading-${index}-${heading.textContent?.toLowerCase().replace(/\s+/g, '-')}`;
        heading.id = id;
      }

      headingData.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
        index,
      });
    });

    setHeadings(headingData);
  }, []);

  useEffect(() => {
    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Generate hierarchical numbering
  const generateNumbering = () => {
    let h2Count = 0;
    let h3Count = 0;

    return headings.map((heading) => {
      if (heading.level === 2) {
        h2Count++;
        h3Count = 0;
        return `${h2Count}.`;
      } else {
        h3Count++;
        return `${h2Count}.${h3Count}.`;
      }
    });
  };

  const numbering = generateNumbering();

  if (headings.length === 0) return null;

  return (
    <div className="w-full border border-border rounded-lg overflow-hidden bg-background mb-8">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls="toc-content"
      >
        <h2 className="text-lg font-black text-foreground">
          {locale === 'es' ? 'Índice de Contenido' : 'Table of Contents'}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="toc-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <nav className="bg-zinc-900 dark:bg-zinc-950 p-6">
              <ul className="space-y-3">
                {headings.map((heading, index) => (
                  <motion.li
                    key={heading.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${heading.level === 3 ? 'ml-6' : ''}`}
                  >
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`text-left w-full hover:text-primary transition-colors ${
                        activeId === heading.id
                          ? 'text-primary font-semibold'
                          : 'text-white'
                      }`}
                    >
                      <span className="text-primary font-semibold mr-2">
                        {numbering[index]}
                      </span>
                      {heading.text}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
