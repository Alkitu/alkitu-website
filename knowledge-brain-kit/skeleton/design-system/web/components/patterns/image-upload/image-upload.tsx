'use client';

import React, { useRef, useState, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageUploadProps {
  /** Current image URL to display */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Callback when file is selected or uploaded */
  onUpload?: (file: File) => void;
  /** Callback when image is removed/deleted */
  onRemove?: () => void;
  /** Callback when upload/file operation fails */
  onError?: (error: Error) => void;
  /** Accepted file types (MIME types) @default 'image/*' */
  accept?: string;
  /** Maximum file size in bytes @default 5242880 (5MB) */
  maxSize?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the upload is in progress */
  loading?: boolean;
  /** Custom class name for the wrapper */
  className?: string;
  /** Text to display on upload button @default 'Upload photos' */
  uploadText?: string;
  /** Helper text below upload button @default 'Before and after' */
  helperText?: string;
  /** Enable drag and drop functionality @default true */
  allowDragDrop?: boolean;
  /** Show delete button on uploaded image @default true */
  showDeleteButton?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Test ID for testing purposes */
  'data-testid'?: string;
  /**
   * Custom image renderer.
   * Receives (src, alt, className) and returns a ReactNode.
   * Useful for providing a Next.js Image or a fallback wrapper from your app.
   * If not provided, a plain <img> with built-in error handling is used.
   */
  renderImage?: (
    src: string,
    alt: string,
    className: string,
  ) => React.ReactNode;
}

export interface ImageUploadState {
  isDragging: boolean;
  previewUrl: string | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Internal fallback image with error handling
// ---------------------------------------------------------------------------

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function FallbackImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <div
        className={cn(
          'inline-block bg-gray-100 text-center align-middle',
          className,
        )}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setDidError(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ImageUpload - Composed Component
 *
 * File upload component with image preview, drag-and-drop, validation, and delete.
 *
 * @example
 * ```tsx
 * <ImageUpload
 *   onUpload={(file) => handleUpload(file)}
 *   onRemove={() => handleRemove()}
 *   uploadText="Upload photos"
 *   helperText="Before and after"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom image renderer (e.g. Next.js Image)
 * <ImageUpload
 *   src={imageUrl}
 *   renderImage={(s, a, c) => <Image src={s} alt={a} className={c} fill />}
 *   onUpload={handleUpload}
 * />
 * ```
 */
export const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      src,
      alt,
      onUpload,
      onRemove,
      onError,
      accept = 'image/*',
      maxSize = 5242880, // 5MB default
      disabled = false,
      loading = false,
      className,
      uploadText = 'Upload photos',
      helperText = 'Before and after',
      allowDragDrop = true,
      showDeleteButton = true,
      required = false,
      'data-testid': testId,
      renderImage,
    },
    ref,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<ImageUploadState>({
      isDragging: false,
      previewUrl: null,
      error: null,
    });

    // Validate file
    const validateFile = useCallback(
      (file: File): string | null => {
        // Check file type
        const acceptedTypes = accept.split(',').map((type) => type.trim());
        const isValidType = acceptedTypes.some((type) => {
          if (type === 'image/*') {
            return file.type.startsWith('image/');
          }
          return file.type === type;
        });

        if (!isValidType) {
          return `Invalid file type. Accepted types: ${accept}`;
        }

        // Check file size
        if (file.size > maxSize) {
          const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
          return `File size exceeds ${maxSizeMB}MB`;
        }

        return null;
      },
      [accept, maxSize],
    );

    // Handle file selection
    const handleFileChange = useCallback(
      (file: File) => {
        const error = validateFile(file);
        if (error) {
          setState((prev) => ({ ...prev, error }));
          onError?.(new Error(error));
          return;
        }

        setState((prev) => ({ ...prev, error: null }));

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setState((prev) => ({ ...prev, previewUrl }));

        onUpload?.(file);
      },
      [validateFile, onUpload, onError],
    );

    // Handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };

    // Handle button click
    const handleButtonClick = () => {
      if (disabled || loading) return;
      fileInputRef.current?.click();
    };

    // Handle drag events
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || loading || !allowDragDrop) return;
      setState((prev) => ({ ...prev, isDragging: true }));
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || loading || !allowDragDrop) return;
      setState((prev) => ({ ...prev, isDragging: false }));
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || loading || !allowDragDrop) return;

      setState((prev) => ({ ...prev, isDragging: false }));

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };

    // Handle remove/delete
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled || loading) return;

      // Revoke preview URL if exists
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }

      setState({ isDragging: false, previewUrl: null, error: null });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onRemove?.();
    };

    // Cleanup preview URL on unmount
    React.useEffect(() => {
      return () => {
        if (state.previewUrl) {
          URL.revokeObjectURL(state.previewUrl);
        }
      };
    }, [state.previewUrl]);

    // Display uploaded image
    const displaySrc = src || state.previewUrl;
    if (displaySrc) {
      return (
        <div
          className={cn(
            'relative rounded-[var(--radius-lg)] overflow-hidden w-[var(--size-image-upload-width)] h-[var(--size-image-upload-height)] shrink-0',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          data-testid={testId}
        >
          {renderImage ? (
            renderImage(
              displaySrc,
              alt || 'Uploaded image',
              'w-full h-full object-cover',
            )
          ) : (
            <FallbackImage
              src={displaySrc}
              alt={alt || 'Uploaded image'}
              className="w-full h-full object-cover"
            />
          )}

          {/* Border overlay */}
          <div className="absolute inset-0 rounded-[var(--radius-lg)] pointer-events-none border border-transparent" />

          {/* Delete button */}
          {showDeleteButton && !disabled && !loading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              aria-label="Remove image"
              data-testid="remove-button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Loading overlay */}
          {loading && (
            <div
              className="absolute inset-0 bg-background/80 flex items-center justify-center"
              data-testid="loading-overlay"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      );
    }

    // Display upload button
    return (
      <div className={cn('relative', className)} data-testid={testId}>
        <input
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (node) {
              (
                fileInputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            }
          }}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="sr-only"
          disabled={disabled || loading}
          aria-required={required}
          aria-label={uploadText}
          data-testid="file-input"
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled || loading}
          onDragEnter={allowDragDrop ? handleDragEnter : undefined}
          onDragLeave={allowDragDrop ? handleDragLeave : undefined}
          onDragOver={allowDragDrop ? handleDragOver : undefined}
          onDrop={allowDragDrop ? handleDrop : undefined}
          className={cn(
            'flex flex-col items-center justify-center w-[var(--size-image-upload-width)] h-[var(--size-image-upload-height)] rounded-[var(--radius-lg)] border border-border bg-card-background-c transition-colors shrink-0 outline-none',
            'px-[var(--space-4-5)] py-[var(--space-7)] gap-[var(--space-2)]',
            !disabled &&
              !loading &&
              'hover:bg-accent-a/10 focus:ring-2 focus:ring-ring focus:ring-offset-1',
            state.isDragging && 'border-primary bg-primary/5',
            (disabled || loading) && 'opacity-50 cursor-not-allowed',
            state.error && 'border-destructive',
            className,
          )}
          aria-label={uploadText}
          data-testid="upload-button"
        >
          {/* Icon */}
          <div className="mb-[var(--space-3-25)] shrink-0">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M11.165 1.165V14.5"
                  stroke="hsl(var(--primary-1))"
                  strokeWidth="2.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.7208 6.72123L11.1646 1.165L5.60836 6.72123"
                  stroke="hsl(var(--primary-1))"
                  strokeWidth="2.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.1674 14.5V18.9449C21.1674 19.5344 20.9333 20.0997 20.5165 20.5165C20.0997 20.9333 19.5344 21.1674 18.9449 21.1674H3.38749C2.79805 21.1674 2.23275 20.9333 1.81595 20.5165C1.39915 20.0997 1.165 19.5344 1.165 18.9449V14.5"
                  stroke="hsl(var(--primary-1))"
                  strokeWidth="2.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* Text Group */}
          <div className="flex flex-col items-center gap-[var(--space-2)] w-full">
            <p className="body-sm text-base-foreground-b whitespace-nowrap">
              {loading ? 'Uploading...' : uploadText}
            </p>
            <p className="body-xs text-muted-foreground-m">{helperText}</p>
          </div>

          {/* Drag and drop hint */}
          {allowDragDrop && state.isDragging && (
            <p className="body-xs text-primary mt-2">Drop to upload</p>
          )}
        </button>

        {/* Error message */}
        {state.error && (
          <p
            className="text-xs text-destructive mt-1.5"
            role="alert"
            data-testid="error-message"
          >
            {state.error}
          </p>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = 'ImageUpload';
