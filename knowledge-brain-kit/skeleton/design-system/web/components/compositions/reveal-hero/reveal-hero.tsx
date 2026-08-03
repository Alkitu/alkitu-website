'use client';

import * as React from 'react';

import { useReducedMotion } from '~/hooks/use-reduced-motion';

/**
 * Hero de apertura ("diafragma"): fondo marca con el título en dos líneas y una
 * franja central que, al hacer scroll, se abre revelando una foto a sangre y
 * separando las dos líneas hasta que salen de cuadro. Inspirado en el efecto de
 * scroll de la web anterior de [Brand], adaptado a la marca (marca).
 *
 * El movimiento se scrubea con el progreso de scroll sobre un "track" alto y un
 * contenedor `sticky`. Con `prefers-reduced-motion` se cae a un estado compuesto
 * estático (sin secuestro de scroll).
 */
export interface RevealHeroProps {
  /** Primera línea del título (encima de la apertura). */
  titleTop: string;
  /** Segunda línea del título (debajo de la apertura). */
  titleBottom: string;
  /** Foto revelada. Si se omite, se muestra un placeholder neutro (swap posterior). */
  imageSrc?: string;
  imageAlt?: string;
  /** Etiqueta del indicador de scroll (p. ej. «Desliza» / «Scroll»). */
  scrollLabel?: string;
  /** Clase extra para los titulares (p. ej. una fuente display de marca). */
  titleClassName?: string;
  /**
   * Elemento decorativo centrado sobre el título (p. ej. la ventana-galería
   * PillGallery). Visible al cargar; al hacer scroll es de lo primero en
   * desvanecerse (antes que los titulares).
   */
  centerSlot?: React.ReactNode;
}

const TITLE_CLASS =
  'pointer-events-none z-20 text-balance text-center font-bold leading-[0.9] tracking-display text-[clamp(2.6rem,9vw,7rem)]';

// Textura de rejilla (papel milimetrado / mesa de corte) sobre el marca:
// cuadrícula fina de 20px (líneas al 7%) + líneas maestras cada 100px (al 14%),
// vía linear-gradients (sin assets). Se compone encima del bg-primary sólido.
const GRID =
  'bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:100px_100px,100px_100px,20px_20px,20px_20px]';

function Photo({ src, alt, scale }: { src?: string; alt?: string; scale?: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- DS agnóstico de Next
    return (
      <img
        src={src}
        alt={alt ?? ''}
        className="h-full w-full object-cover grayscale"
        style={scale ? { transform: `scale(${scale})` } : undefined}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs uppercase tracking-[0.25em] text-neutral-400">
      foto · placeholder
    </div>
  );
}

export function RevealHero({
  titleTop,
  titleBottom,
  imageSrc,
  imageAlt = '',
  scrollLabel,
  titleClassName = '',
  centerSlot,
}: RevealHeroProps) {
  const titleClass = `${TITLE_CLASS} ${titleClassName}`.trim();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [p, setP] = React.useState(0); // progreso de apertura 0→1
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-track.getBoundingClientRect().top, 0), Math.max(total, 1));
      setP(total > 0 ? scrolled / total : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // --- Estado reducido: composición estática, sin scroll-jack ---
  if (reduced) {
    return (
      <section className={`bg-primary px-6 py-24 text-white ${GRID}`}>
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6">
          <h1 className={titleClass}>{titleTop}</h1>
          <div className="h-[45vh] w-full overflow-hidden rounded-[3px]">
            <Photo src={imageSrc} alt={imageAlt} />
          </div>
          <h1 className={titleClass}>
            {titleBottom}
            <span className="text-white/70">.</span>
          </h1>
        </div>
      </section>
    );
  }

  // --- Curvas de la apertura ---
  // La puerta abre del todo antes del final (a ~p=0.62) y se MANTIENE abierta el
  // resto del recorrido (dwell), para que se vea completamente abierta y no solo
  // en el último frame antes de despegarse.
  const bandVh = Math.min(100, p * 160); // franja: cerrada (0) → viewport completo (100vh) con dwell
  const topShift = -Math.min(60, p * 96); // la línea superior sube y sale (acompasada a la apertura)
  const bottomShift = Math.min(60, p * 96); // la inferior baja y sale
  const titleOpacity = 1 - Math.max(0, (p - 0.4) / 0.25); // se desvanecen mientras abre
  const imgScale = 1.15 - p * 0.15; // leve parallax de la foto
  const hintOpacity = 1 - Math.min(1, p * 3);
  const slotOpacity = 1 - Math.min(1, p * 4); // el centerSlot es lo primero en irse
  const slotScale = 1 - (1 - slotOpacity) * 0.15; // y encoge un poco (hasta 0.85) mientras se va

  return (
    <section ref={trackRef} className="relative bg-primary text-white" style={{ height: '220vh' }}>
      <div className={`sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6 ${GRID}`}>
        <h1
          className={titleClass}
          style={{ transform: `translateY(${topShift}vh)`, opacity: titleOpacity }}
        >
          {titleTop}
        </h1>

        <div
          className="relative z-10 my-2 w-screen shrink-0 overflow-hidden"
          style={{ height: `${bandVh}vh` }}
          aria-hidden
        >
          <Photo src={imageSrc} alt={imageAlt} scale={imgScale} />
        </div>

        <h1
          className={titleClass}
          style={{ transform: `translateY(${bottomShift}vh)`, opacity: titleOpacity }}
        >
          {titleBottom}
          <span className="text-white/70">.</span>
        </h1>

        {centerSlot ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-30"
            style={{
              opacity: slotOpacity,
              transform: `translate(-50%,-50%) scale(${slotScale})`,
              visibility: slotOpacity <= 0 ? 'hidden' : undefined,
            }}
          >
            {centerSlot}
          </div>
        ) : null}

        {scrollLabel ? (
          <p
            className="absolute bottom-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/60"
            style={{ opacity: hintOpacity }}
          >
            {/* Línea con un destello que baja en bucle: comunica "desliza hacia abajo". */}
            <span aria-hidden className="relative inline-block h-8 w-px overflow-hidden bg-white/25">
              <span className="absolute left-0 top-0 h-3 w-full bg-white/90 [animation:lk-hero-hint_1.8s_ease-in-out_infinite] motion-reduce:hidden" />
            </span>
            {scrollLabel}
            <style>{`@keyframes lk-hero-hint{0%{transform:translateY(-100%)}70%,100%{transform:translateY(2rem)}}`}</style>
          </p>
        ) : null}
      </div>
    </section>
  );
}
