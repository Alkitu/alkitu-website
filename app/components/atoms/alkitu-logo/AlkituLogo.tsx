'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';

interface AlkituLogoProps {
  locale?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function AlkituLogo({
  locale = 'en',
  width = 200,
  height = 80,
  className = ''
}: AlkituLogoProps) {
  const { resolvedTheme } = useTheme();

  // Determinar qué logo usar basado en el tema resuelto
  const logoSrc = resolvedTheme === 'dark'
    ? '/logos/Alkitu-Logo-para-Fondos-Oscuros-Eslogan.svg'
    : '/logos/Alkitu-Logo-Eslogan.svg';

  return (
    <Link href={`/${locale}`} className={`flex items-center cursor-pointer hover:scale-110 active:scale-90 transition-transform ${className}`}>
      <Image
        src={logoSrc}
        alt="Alkitu Logo"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
