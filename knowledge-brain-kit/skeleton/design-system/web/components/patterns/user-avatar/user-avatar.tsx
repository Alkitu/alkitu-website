'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import type { CSSProperties, ReactNode, ComponentType } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Size variants for UserAvatar
 */
export type UserAvatarSize = 'sm' | 'md' | 'lg';

/**
 * Icon map type — consumers provide their own icon registry.
 * Keys are icon names, values are React components that accept a className prop.
 */
export type IconMap = Record<string, ComponentType<{ className?: string }>>;

/**
 * UserAvatar component props
 *
 * Composed molecule for displaying user avatar with initials, icon, emoji, or image.
 * Displays initials in a themed circle.
 */
export interface UserAvatarProps {
  /**
   * User's first name or full name (required)
   */
  name: string;

  /**
   * User's last name (optional)
   */
  lastName?: string;

  /**
   * URL of the user's profile image.
   * When provided, displays the image instead of initials.
   * Takes priority over `image` prop.
   */
  imageUrl?: string;

  /**
   * Raw DB image value: can be an icon name, emoji character, or URL.
   * Detected automatically:
   * - Emoji -> renders emoji character
   * - Icon name (from icons map) -> renders icon component
   * - URL (http/https or /api/) -> renders as image
   * - Otherwise -> falls back to initials
   */
  image?: string;

  /**
   * Size variant
   * @default 'md'
   */
  size?: UserAvatarSize;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Theme override CSS properties
   */
  themeOverride?: CSSProperties;

  /**
   * Icon map for resolving icon names to components.
   * Pass your app's icon registry here. If not provided,
   * icon name values in `image` will fall back to initials.
   */
  icons?: IconMap;

  /**
   * Custom emoji detection function.
   * If not provided, a basic heuristic is used (codePoint > 127).
   */
  isEmoji?: (str: string) => boolean;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const iconSizeClasses: Record<UserAvatarSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * Default emoji detection: any string whose first codepoint > 127.
 */
function defaultIsEmoji(str: string): boolean {
  if (!str || str.length === 0) return false;
  const cp = str.codePointAt(0);
  return cp !== undefined && cp > 127;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UserAvatar - Design System Composed Component
 *
 * Displays initials in a themed circle following the design system.
 * Supports multiple content types via the `image` prop:
 * - Emoji character -> rendered centered
 * - Icon name (from icons map) -> rendered as icon component
 * - URL -> rendered as image
 * - Fallback -> initials
 *
 * The `imageUrl` prop takes priority over `image` for backward compatibility.
 *
 * @example
 * ```tsx
 * <UserAvatar name="Ana" lastName="Martinez" />
 * <UserAvatar name="Luis" image="UserCircle" icons={myIcons} size="lg" />
 * <UserAvatar name="Ana" image="emoji-char" />
 * <UserAvatar name="Luis" imageUrl="https://..." size="lg" />
 * ```
 */
export function UserAvatar({
  name,
  lastName,
  imageUrl,
  image,
  size = 'md',
  className,
  themeOverride,
  icons,
  isEmoji: isEmojiProp,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const emojiCheck = isEmojiProp ?? defaultIsEmoji;

  // Reset error state when the image source changes
  useEffect(() => {
    setImgError(false);
  }, [image, imageUrl]);

  // Generate initials
  const getInitials = (): string => {
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastNamePart = lastName?.trim() || nameParts[1] || '';

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastNamePart.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`.slice(0, 2);
  };

  const altText = `${name}${lastName ? ` ${lastName}` : ''}`;

  // Priority 1: explicit imageUrl prop (backward compat)
  if (imageUrl && !imgError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full overflow-hidden",
          "bg-primary text-primary-foreground font-semibold",
          "shrink-0",
          sizeClasses[size],
          className
        )}
        style={themeOverride}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Priority 2: detect type from `image` prop
  let content: ReactNode = getInitials();

  if (image) {
    if (emojiCheck(image)) {
      // Emoji
      content = <span className="leading-none">{image}</span>;
    } else if (icons && image in icons) {
      // Icon name
      const IconComponent = icons[image];
      content = <IconComponent className={iconSizeClasses[size]} />;
    } else if (image.startsWith('http') || image.startsWith('/api/')) {
      // URL — render as image
      if (!imgError) {
        return (
          <div
            className={cn(
              "flex items-center justify-center rounded-full overflow-hidden",
              "bg-primary text-primary-foreground font-semibold",
              "shrink-0",
              sizeClasses[size],
              className
            )}
            style={themeOverride}
          >
            <img
              src={image}
              alt={altText}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        );
      }
      // If image URL failed, content stays as initials (default)
    }
    // Otherwise: unknown value, fall back to initials
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full overflow-hidden",
        "bg-primary text-primary-foreground font-semibold",
        "shrink-0",
        sizeClasses[size],
        className
      )}
      style={themeOverride}
    >
      {content}
    </div>
  );
}

UserAvatar.displayName = 'UserAvatar';
