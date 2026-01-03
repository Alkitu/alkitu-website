'use client';

import React from 'react';
import type { BlogSection } from '@/app/schemas/blog.schema';

interface BlogSectionRendererProps {
  sections: BlogSection[];
  locale: string;
}

interface CalloutProps {
  variant?: 'info' | 'warning' | 'tip' | 'important';
  content: string;
}

function Callout({ variant = 'info', content }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500 text-yellow-900 dark:text-yellow-100',
    tip: 'bg-green-50 dark:bg-green-950/30 border-green-500 text-green-900 dark:text-green-100',
    important: 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 text-purple-900 dark:text-purple-100',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>
    ),
    important: (
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`border-l-4 p-4 my-6 rounded-r-lg ${styles[variant]}`}>
      <div className="flex gap-3">
        {icons[variant]}
        <p className="text-base leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function renderSection(section: BlogSection, index: number): React.ReactNode {
  switch (section.type) {
    case 'heading':
      const level = section.level || 2;
      const headingClasses: Record<number, string> = {
        2: 'text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mt-12 mb-6 text-foreground',
        3: 'text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mt-8 mb-4 text-foreground',
        4: 'text-lg md:text-xl lg:text-2xl font-semibold mt-6 mb-3 text-foreground',
      };
      const className = headingClasses[level] || headingClasses[2];

      // Render the appropriate heading level
      if (level === 2) {
        return (
          <h2 key={section.id} id={section.id} className={className}>
            {section.content}
          </h2>
        );
      } else if (level === 3) {
        return (
          <h3 key={section.id} id={section.id} className={className}>
            {section.content}
          </h3>
        );
      } else {
        return (
          <h4 key={section.id} id={section.id} className={className}>
            {section.content}
          </h4>
        );
      }

    case 'paragraph':
      return (
        <p
          key={section.id}
          className="text-base md:text-lg leading-relaxed text-foreground/80 mb-6"
        >
          {section.content}
        </p>
      );

    case 'list':
      return (
        <ul key={section.id} className="list-disc list-inside space-y-3 mb-6 text-foreground/80">
          {section.items?.map((item, i) => (
            <li key={`${section.id}-${i}`} className="text-base md:text-lg leading-relaxed pl-2">
              {item}
            </li>
          ))}
        </ul>
      );

    case 'blockquote':
      return (
        <blockquote
          key={section.id}
          className="border-l-4 border-primary bg-muted/30 py-4 px-6 my-8 italic text-foreground/90 rounded-r-lg"
        >
          <p className="text-lg md:text-xl leading-relaxed">{section.content}</p>
        </blockquote>
      );

    case 'callout':
      return (
        <Callout
          key={section.id}
          variant={section.variant}
          content={section.content}
        />
      );

    case 'code':
      return (
        <pre
          key={section.id}
          className="bg-muted/50 border border-border rounded-lg p-4 my-6 overflow-x-auto"
        >
          <code className="text-sm font-mono text-foreground">
            {section.content}
          </code>
        </pre>
      );

    case 'image':
      return (
        <figure key={section.id} className="my-8">
          {/* Using img for simplicity, can be replaced with next/image */}
          <img
            src={section.src}
            alt={section.alt || ''}
            className="w-full rounded-lg shadow-md"
            loading="lazy"
          />
          {section.caption && (
            <figcaption className="text-sm text-foreground/60 text-center mt-2 italic">
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}

export default function BlogSectionRenderer({ sections, locale }: BlogSectionRendererProps) {
  return (
    <div className="blog-content">
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}
