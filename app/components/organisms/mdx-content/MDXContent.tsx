'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { MediaCarousel } from '@/app/components/organisms/carousel/media-carousel';

interface MDXContentProps {
  code: string;
}

/**
 * Client Component for rendering MDX content
 * Separated from Server Component to allow use of React hooks
 *
 * Components available in MDX:
 * - MediaCarousel: Carousel for images and YouTube videos
 */
export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  // Make custom components available to MDX
  const components = {
    MediaCarousel,
  };

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none
      prose-headings:scroll-mt-20
      prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-foreground prose-h2:no-underline
      prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-foreground prose-h3:no-underline
      prose-h4:text-foreground prose-h4:no-underline
      [&_h2_a]:text-foreground [&_h2_a]:no-underline [&_h2_a]:font-bold [&_h2_a]:pointer-events-none
      [&_h3_a]:text-foreground [&_h3_a]:no-underline [&_h3_a]:font-semibold [&_h3_a]:pointer-events-none
      [&_h4_a]:text-foreground [&_h4_a]:no-underline [&_h4_a]:pointer-events-none
      prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
      prose-strong:font-semibold prose-strong:text-foreground
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
      prose-li:my-2
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/80
      prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
      prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-img:rounded-lg prose-img:shadow-md
    ">
      <Component components={components} />
    </div>
  );
}
