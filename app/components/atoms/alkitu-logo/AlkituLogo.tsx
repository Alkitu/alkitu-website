'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AlkituLogoProps {
  locale?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const AlkituLogo = ({
  locale = 'en',
  width,
  height = 55,
  className = '',
  variant = 'auto',
}: AlkituLogoProps) => {
  const sizeStyle = width !== undefined
    ? { width: typeof width === 'number' ? `${width}px` : width, height: 'auto' }
    : { height: typeof height === 'number' ? `${height}px` : height, width: 'auto' };

  return (
    <Link
      href={`/${locale}`}
      className={`flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      {/* Light version (visible in light mode or when variant is light) */}
      {variant !== 'dark' && (
        <Image
          src="/logos/Alkitu-Logo-Eslogan.svg"
          alt="Alkitu Logo"
          width={150}
          height={68}
          priority
          unoptimized
          className={`${variant === 'light' ? 'block' : 'block dark:hidden'} w-auto`}
          style={sizeStyle}
        />
      )}

      {/* Dark version (visible in dark mode or when variant is dark) */}
      {variant !== 'light' && (
        <Image
          src="/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg"
          alt="Alkitu Logo"
          width={252}
          height={113}
          priority
          unoptimized
          className={`${variant === 'dark' ? 'block' : 'hidden dark:block'} w-auto`}
          style={sizeStyle}
        />
      )}
    </Link>
  );
};

export default AlkituLogo;
