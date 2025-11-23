'use client';

import Link from 'next/link';

interface LogoProps {
  locale?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
};

export default function Logo({
  locale = 'en',
  className = '',
  size = 'lg'
}: LogoProps) {
  return (
    <Link href={`/${locale}`} className="flex items-center cursor-pointer">
      <p className={`font-main_regular ${sizeClasses[size]} font-bold hover:scale-110 active:scale-90 transition-transform ${className}`}>
        <span className="text-primary">&lt;</span>
        <span className="hidden md:inline">LuisUrdaneta</span>
        <span className="md:hidden">Luis</span>
        <span className="text-primary">/&gt;</span>
      </p>
    </Link>
  );
}
