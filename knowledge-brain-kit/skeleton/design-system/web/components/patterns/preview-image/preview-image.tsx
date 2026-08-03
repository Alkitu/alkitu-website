'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '~/components/primitives/button';
import { Spinner } from '~/components/primitives/spinner';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Aspect ratio options for PreviewImage */
export type PreviewImageAspectRatio =
  | 'square'
  | '1:1'
  | '4:3'
  | '16:9'
  | '3:2'
  | '2:1'
  | 'auto';

/** Size options for PreviewImage */
export type PreviewImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Border radius options for PreviewImage */
export type PreviewImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/** Object fit options for PreviewImage */
export type PreviewImageObjectFit =
  | 'cover'
  | 'contain'
  | 'fill'
  | 'scale-down'
  | 'none';

/** Image data for gallery mode */
export interface ImageData {
  /** Image source URL */
  src: string;
  /** Alternative text for accessibility */
  alt: string;
  /** Optional caption/title for the image */
  caption?: string;
}

/** Props for PreviewImage */
export interface PreviewImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder'> {
  /** Image source URL (single image mode) */
  src?: string;
  /** Alternative text for accessibility @default '' */
  alt?: string;
  /** Caption/title for the image (shown in lightbox) */
  caption?: string;
  /** Multiple images for gallery mode */
  images?: ImageData[];
  /** Initial index for gallery mode @default 0 */
  initialIndex?: number;
  /** Aspect ratio preset for thumbnail @default 'auto' */
  aspectRatio?: PreviewImageAspectRatio;
  /** Custom aspect ratio (overrides preset). Example: '21/9', '5/4' */
  customRatio?: string;
  /** Size variant for thumbnail @default 'md' */
  size?: PreviewImageSize;
  /** Border radius variant @default 'md' */
  radius?: PreviewImageRadius;
  /** Show loading state @default false */
  loading?: boolean;
  /** Placeholder content when no image */
  placeholder?: React.ReactNode;
  /** Object fit behavior @default 'cover' */
  objectFit?: PreviewImageObjectFit;
  /** Custom className for the container */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Error handler for failed image loads */
  onError?: () => void;
  /** Success handler for successful image loads */
  onLoad?: () => void;
  /** Enable lightbox/modal on click @default true */
  enableLightbox?: boolean;
  /** Show download button in lightbox @default true */
  showDownload?: boolean;
  /** Custom download filename */
  downloadFilename?: string;
  /** Disable lazy loading @default false */
  disableLazyLoad?: boolean;
  /** Callback when lightbox opens */
  onLightboxOpen?: () => void;
  /** Callback when lightbox closes */
  onLightboxClose?: () => void;
  /** Callback when download is triggered */
  onDownload?: (src: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PreviewImage - Composed Component
 *
 * Enhanced image preview component with lightbox, gallery, and download functionality.
 * Supports single images or gallery mode with keyboard navigation.
 *
 * @example
 * ```tsx
 * <PreviewImage
 *   src="https://example.com/image.jpg"
 *   alt="Beautiful landscape"
 *   caption="Sunset in the mountains"
 *   aspectRatio="16:9"
 *   size="lg"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PreviewImage
 *   images={[
 *     { src: "img1.jpg", alt: "Image 1", caption: "Caption 1" },
 *     { src: "img2.jpg", alt: "Image 2", caption: "Caption 2" }
 *   ]}
 * />
 * ```
 */
export const PreviewImage = React.forwardRef<HTMLDivElement, PreviewImageProps>(
  (
    {
      src,
      alt = '',
      caption,
      images,
      initialIndex = 0,
      aspectRatio = 'auto',
      customRatio,
      size = 'md',
      radius = 'md',
      loading = false,
      placeholder,
      objectFit = 'cover',
      className = '',
      style = {},
      onError,
      onLoad,
      enableLightbox = true,
      showDownload = true,
      downloadFilename,
      disableLazyLoad = false,
      onLightboxOpen,
      onLightboxClose,
      onDownload,
      ...props
    },
    ref,
  ) => {
    // Determine if we're in gallery mode
    const isGalleryMode = !!images && images.length > 0;
    const galleryImages: ImageData[] = isGalleryMode
      ? images
      : src
        ? [{ src, alt, caption }]
        : [];

    // State management
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Refs
    const lightboxRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Current image data
    const currentImage = galleryImages[currentIndex];
    const hasMultipleImages = galleryImages.length > 1;

    /** Get aspect ratio CSS value from preset or custom ratio */
    const getAspectRatio = (): string => {
      if (customRatio) return customRatio;

      const ratioMap: Record<string, string> = {
        square: '1',
        '1:1': '1',
        '4:3': '4/3',
        '16:9': '16/9',
        '3:2': '3/2',
        '2:1': '2/1',
        auto: 'auto',
      };

      return ratioMap[aspectRatio];
    };

    /** Get size dimensions for auto aspect ratio mode */
    const getSizeDimensions = () => {
      const sizeMap: Record<string, { width: string; height: string }> = {
        xs: { width: '64px', height: '64px' },
        sm: { width: '96px', height: '96px' },
        md: { width: '128px', height: '128px' },
        lg: { width: '192px', height: '192px' },
        xl: { width: '256px', height: '256px' },
        '2xl': { width: '384px', height: '384px' },
      };

      return sizeMap[size];
    };

    /** Get border radius using CSS variables */
    const getBorderRadius = (): string => {
      if (radius === 'none') return '0';
      if (radius === 'full') return '50%';

      const radiusMap: Record<string, string> = {
        sm: 'var(--radius-sm, 4px)',
        md: 'var(--radius, 8px)',
        lg: 'var(--radius-lg, 12px)',
      };

      return radiusMap[radius] || 'var(--radius, 8px)';
    };

    // Handle image load events
    const handleLoadStart = () => {
      setImageLoading(true);
      setImageError(false);
      setImageLoaded(false);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageLoaded(true);
      setImageError(false);
      onLoad?.();
    };

    const handleImageError = () => {
      setImageLoading(false);
      setImageError(true);
      setImageLoaded(false);
      onError?.();
    };

    // Lightbox handlers
    const openLightbox = () => {
      if (!enableLightbox || !currentImage?.src) return;
      setLightboxOpen(true);
      onLightboxOpen?.();
    };

    const closeLightbox = useCallback(() => {
      setLightboxOpen(false);
      onLightboxClose?.();
    }, [onLightboxClose]);

    // Gallery navigation
    const goToNext = useCallback(() => {
      if (!hasMultipleImages) return;
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, [hasMultipleImages, galleryImages.length]);

    const goToPrevious = useCallback(() => {
      if (!hasMultipleImages) return;
      setCurrentIndex((prev) =>
        prev === 0 ? galleryImages.length - 1 : prev - 1,
      );
    }, [hasMultipleImages, galleryImages.length]);

    // Download handler
    const handleDownload = async () => {
      if (!currentImage?.src) return;

      onDownload?.(currentImage.src);

      try {
        const response = await fetch(currentImage.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download =
          downloadFilename ||
          currentImage.src.split('/').pop() ||
          'download.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    };

    // Keyboard navigation
    useEffect(() => {
      if (!lightboxOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            goToPrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            goToNext();
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, closeLightbox, goToNext, goToPrevious]);

    // Focus management
    useEffect(() => {
      if (lightboxOpen && closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, [lightboxOpen]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
      if (lightboxOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [lightboxOpen]);

    const dimensions = getSizeDimensions();
    const ratio = getAspectRatio();
    const borderRadius = getBorderRadius();

    // Container styles
    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: aspectRatio === 'auto' ? dimensions.width : '100%',
      height: aspectRatio === 'auto' ? dimensions.height : 'auto',
      aspectRatio: aspectRatio !== 'auto' ? ratio : undefined,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: 'var(--color-muted)',
      border: '1px solid var(--color-border)',
      cursor: enableLightbox && currentImage?.src ? 'pointer' : 'default',
      ...style,
    };

    // Image styles
    const imageStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit,
      transition: 'opacity 0.2s ease-in-out',
    };

    // Show placeholder when loading, error, or no source
    const showPlaceholder =
      loading || imageLoading || imageError || !currentImage?.src;

    return (
      <>
        {/* Thumbnail */}
        <div
          ref={ref}
          className={cn('preview-image-molecule', className)}
          style={containerStyle}
          onClick={openLightbox}
          role={enableLightbox && currentImage?.src ? 'button' : undefined}
          tabIndex={enableLightbox && currentImage?.src ? 0 : undefined}
          aria-label={
            enableLightbox && currentImage?.src
              ? `View ${currentImage.alt || 'image'}`
              : undefined
          }
          onKeyDown={(e) => {
            if (enableLightbox && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              openLightbox();
            }
          }}
          {...props}
        >
          {/* Main Image */}
          {currentImage?.src && !imageError && (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              loading={disableLazyLoad ? 'eager' : 'lazy'}
              style={{
                ...imageStyle,
                opacity: imageLoaded ? 1 : 0,
              }}
              onLoadStart={handleLoadStart}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Placeholder/Loading/Error State */}
          {showPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              {loading || imageLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" variant="primary" />
                  <span className="text-xs text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : imageError ? (
                <div className="flex flex-col items-center gap-2">
                  <ImageOff size={32} className="text-muted-foreground" />
                  <span className="text-xs text-center px-2 text-muted-foreground">
                    Failed to load
                  </span>
                </div>
              ) : !currentImage?.src ? (
                placeholder || (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={32} className="text-muted-foreground" />
                    <span className="text-xs text-center px-2 text-muted-foreground">
                      No image
                    </span>
                  </div>
                )
              ) : null}
            </div>
          )}

          {/* Gallery indicator */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && currentImage && (
          <div
            ref={lightboxRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Close Button */}
            <Button
              ref={closeButtonRef}
              variant="nude"
              size="md"
              iconOnly
              iconLeft={<X size={16} />}
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              aria-label="Close lightbox"
            />

            {/* Download Button */}
            {showDownload && (
              <Button
                variant="nude"
                size="md"
                iconOnly
                iconLeft={<Download size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white"
                aria-label="Download image"
              />
            )}

            {/* Previous Button */}
            {hasMultipleImages && (
              <Button
                variant="nude"
                size="md"
                iconOnly
                iconLeft={<ChevronLeft size={20} />}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                aria-label="Previous image"
              />
            )}

            {/* Next Button */}
            {hasMultipleImages && (
              <Button
                variant="nude"
                size="md"
                iconOnly
                iconLeft={<ChevronRight size={20} />}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                aria-label="Next image"
              />
            )}

            {/* Main Image */}
            <div
              className="max-w-[90vw] max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {/* Caption */}
              {currentImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
                  <p className="text-sm">{currentImage.caption}</p>
                  {hasMultipleImages && (
                    <p className="text-xs text-gray-300 mt-1">
                      {currentIndex + 1} of {galleryImages.length}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

PreviewImage.displayName = 'PreviewImage';

export default PreviewImage;
