'use client';

import * as React from 'react';

import { useReducedMotion } from '~/hooks/use-reduced-motion';

/**
 * Ventana ovalada (píldora) que reproduce una galería de imágenes en bucle.
 * Cada item trae su propio color de fondo: el fondo permanece estable mientras
 * su imagen está en pantalla y cruza al siguiente color con cada transición.
 *
 * Las imágenes deben venir centradas y al mismo tamaño (mismo lienzo) para que
 * el crossfade se perciba como una metamorfosis y no como un salto.
 *
 * Con `prefers-reduced-motion` no hay ciclo: se queda el primer item.
 */
export interface PillGalleryItem {
  src: string;
  alt?: string;
  /** Color de fondo mientras esta imagen está visible (evitar blanco/negro puros). */
  bg: string;
}

export interface PillGalleryProps {
  items: PillGalleryItem[];
  /** Tiempo que cada imagen permanece en pantalla (ms). */
  intervalMs?: number;
  /** Duración del crossfade entre imagen/fondo (ms). */
  transitionMs?: number;
  className?: string;
}

export function PillGallery({
  items,
  intervalMs = 2200,
  transitionMs = 600,
  className = '',
}: PillGalleryProps) {
  const [activo, setActivo] = React.useState(0);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => setActivo((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, items.length, intervalMs]);

  if (!items.length) return null;
  const item = items[activo] ?? items[0];

  return (
    <div
      aria-hidden
      className={`pointer-events-none relative overflow-hidden rounded-full ring-4 ring-white/90 ${className}`.trim()}
      style={{
        aspectRatio: '466 / 765', // proporción del óvalo del Figma (LogoContainer)
        backgroundColor: item.bg,
        transition: `background-color ${transitionMs}ms ease`,
      }}
    >
      {/* Todas apiladas (precargan) y crossfade por opacidad. */}
      {items.map((it, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- DS agnóstico de Next
        <img
          key={it.src}
          src={it.src}
          alt={it.alt ?? ''}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain p-[9%]"
          style={{ opacity: i === activo ? 1 : 0, transition: `opacity ${transitionMs}ms ease` }}
        />
      ))}
    </div>
  );
}
