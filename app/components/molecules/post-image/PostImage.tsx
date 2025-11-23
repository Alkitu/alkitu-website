'use client';

import Image from 'next/image';

interface PostImageProps {
  src: string;
  alt: string;
  credit?: string;
  priority?: boolean;
}

/**
 * PostImage component with standardized aspect ratio for social media
 * Uses 1.91:1 aspect ratio (recommended for OG images: 1200x630px)
 * Same image is used for blog thumbnails and social media sharing
 */
export default function PostImage({ src, alt, credit, priority = false }: PostImageProps) {
  return (
    <div className="w-full">
      {/* Image container with fixed 1.91:1 aspect ratio */}
      <div className="relative w-full aspect-[1.91/1] overflow-hidden rounded-lg">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* Image credit */}
      {credit && (
        <p className="text-xs text-muted-foreground text-center mt-2 italic">
          {credit}
        </p>
      )}
    </div>
  );
}
