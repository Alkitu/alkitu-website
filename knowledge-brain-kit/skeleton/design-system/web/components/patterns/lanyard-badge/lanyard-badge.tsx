'use client';

/**
 * LanyardBadge — carnet colgando de una cinta (lanyard) desde el borde superior.
 * Minimalista y profesional: cinta oscura lisa; el carnet blanco lleva foto y
 * datos bajo un foil holográfico del logo que se revela al acercar el puntero
 * (mask compuesto: patrón del logo ∩ foco radial en --hx/--hy), estilo carnet
 * laminado (cf. holographic ticket de Jason Hibbs).
 * Físicas de péndulo propias (RAF): se balancea al cargar y se puede arrastrar;
 * sin Three.js ni dependencias. Respeta prefers-reduced-motion (cuelga quieto).
 */

import * as React from 'react';

export interface LanyardBadgeProps {
  photoSrc: string;
  photoAlt: string;
  /** SVG del logo EN TILE con padding (controla la separación del patrón). */
  logoSrc: string;
  nombre: string;
  clase: string;
  nivel: number;
  nivelLabel: string;
  arquetipo: string;
  arquetipoLabel: string;
  /** Línea de arquetipos, p. ej. "Buscador 19 · Guerrero 18 · Bufón 18". */
  trio: string;
  brillaEnLabel: string;
  brillaEn: string;
  /** Largo de la cinta sobre el carnet (px). */
  strapHeight?: number;
  className?: string;
}

const FOIL =
  'repeating-linear-gradient(120deg, #ffd36e 0%, #fff29e 7%, #9effc4 14%, #9be7ff 21%, #c9a6ff 28%, #ffa6d5 35%, #ffd36e 42%)';

export function LanyardBadge({
  photoSrc,
  photoAlt,
  logoSrc,
  nombre,
  clase,
  nivel,
  nivelLabel,
  arquetipo,
  arquetipoLabel,
  trio,
  brillaEnLabel,
  brillaEn,
  strapHeight = 210,
  className,
}: LanyardBadgeProps) {
  const [angle, setAngle] = React.useState(0);
  const sim = React.useRef({ a: 0.3, v: 0, dragging: false, lastX: 0, lastT: 0, raf: 0 });
  const pivotRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const reduced = React.useRef(false);

  /** Foil: sigue al puntero con CSS vars directas (sin pasar por React). */
  function trackFoil(e: React.PointerEvent) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--hx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--hy', `${((e.clientY - r.top) / r.height) * 100}%`);
    el.style.setProperty('--holo', '1');
  }
  function hideFoil() {
    cardRef.current?.style.setProperty('--holo', '0');
  }

  React.useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) {
      setAngle(0);
      return;
    }
    const s = sim.current;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - prev) / 1000);
      prev = now;
      if (!s.dragging) {
        // Péndulo: gravedad restauradora + amortiguación
        s.v += -6.5 * Math.sin(s.a) * dt - 1.6 * s.v * dt;
        s.a += s.v * dt;
      }
      setAngle(s.a);
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    if (reduced.current) return;
    const s = sim.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    trackFoil(e);
    const s = sim.current;
    if (!s.dragging || !pivotRef.current) return;
    const r = pivotRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = Math.max(40, e.clientY - r.top);
    const target = Math.max(-0.9, Math.min(0.9, Math.atan2(dx, dy)));
    const now = performance.now();
    const dt = Math.max(0.008, (now - s.lastT) / 1000);
    s.v = (target - s.a) / dt * 0.35; // inercia al soltar
    s.a = target;
    s.lastX = e.clientX;
    s.lastT = now;
  }
  function onPointerUp() {
    sim.current.dragging = false;
  }

  const deg = (angle * 180) / Math.PI;

  return (
    <div
      className={`pointer-events-none relative flex justify-center ${className ?? ''}`}
      style={{ perspective: '900px' }}
      aria-label={`${nombre} — ${clase}`}
    >
      <div ref={pivotRef} className="absolute top-0 h-0 w-0" />
      {/* Grupo que oscila alrededor del pivote superior */}
      <div
        className="flex flex-col items-center"
        style={{
          transform: `rotate(${deg}deg) rotateY(${Math.max(-14, Math.min(14, sim.current.v * 8))}deg)`,
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
      >
        {/* Cinta lisa y minimalista (el holograma vive en la tarjeta) */}
        <div style={{ width: 42, height: strapHeight, backgroundColor: 'var(--foreground)' }} />

        {/* Enganche metálico */}
        <div className="-mt-px h-4 w-7 rounded-b-md border border-neutral-400 bg-gradient-to-b from-neutral-200 to-neutral-400" />
        <div className="mt-1 h-2 w-10 rounded-full bg-neutral-300 shadow-inner" />

        {/* Carnet */}
        <div
          ref={cardRef}
          className="pointer-events-auto relative mt-1 w-80 cursor-grab select-none overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl active:cursor-grabbing md:w-[22rem]"
          style={{ '--hx': '50%', '--hy': '50%', '--holo': '0' } as React.CSSProperties}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={trackFoil}
          onPointerLeave={hideFoil}
        >
          {/* Ranura del carnet */}
          <div className="flex justify-center pt-2.5">
            <div className="h-1.5 w-12 rounded-full bg-neutral-200" />
          </div>

          <div className="relative px-5 pb-5 pt-3">
            <div className="aspect-square w-full overflow-hidden rounded-xl">
              <img
                src={photoSrc}
                alt={photoAlt}
                width={320}
                height={320}
                draggable={false}
                className="h-full w-full scale-[1.06] object-cover"
              />
            </div>

            <p className="mt-4 text-lg font-bold leading-tight tracking-tight text-neutral-900">
              {nombre}
            </p>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--primary)' }}>
              {clase}
            </p>

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-neutral-200 pt-3.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {nivelLabel}
                </p>
                <p className="text-3xl font-bold leading-none tracking-tight" style={{ color: 'var(--primary)' }}>
                  {nivel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {arquetipoLabel}
                </p>
                <p className="text-lg font-semibold leading-tight text-neutral-900">{arquetipo}</p>
              </div>
            </div>
            <p className="mt-1.5 text-right text-[11px] text-neutral-500">{trio}</p>

            <div className="mt-3.5 border-t border-neutral-200 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {brillaEnLabel}
              </p>
              <p className="mt-1 text-[11.5px] font-medium uppercase leading-snug tracking-[0.08em] text-neutral-700">{brillaEn}</p>
            </div>
          </div>

          {/* Patrón base: logos apenas visibles en reposo (lámina del carnet) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundColor: 'var(--foreground)',
              opacity: 0.05,
              WebkitMaskImage: `url(${logoSrc})`,
              maskImage: `url(${logoSrc})`,
              WebkitMaskSize: '56px 56px',
              maskSize: '56px 56px',
            }}
          />

          {/* Foil: el rainbow solo existe dentro del patrón ∩ foco del puntero */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: 'calc(var(--holo) * 0.9)',
              backgroundImage: FOIL,
              backgroundSize: '340% 340%',
              backgroundPosition: 'calc(50% + (var(--hx) - 50%) * -0.6) calc(50% + (var(--hy) - 50%) * -0.6)',
              WebkitMaskImage: `url(${logoSrc}), radial-gradient(11rem circle at var(--hx) var(--hy), black 12%, transparent 68%)`,
              maskImage: `url(${logoSrc}), radial-gradient(11rem circle at var(--hx) var(--hy), black 12%, transparent 68%)`,
              WebkitMaskSize: '56px 56px, 100% 100%',
              maskSize: '56px 56px, 100% 100%',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
              filter: 'saturate(1.6) brightness(1.05)',
            }}
          />

          {/* Glare: brillo suave que acompaña al puntero */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: 'calc(var(--holo) * 0.5)',
              backgroundImage:
                'radial-gradient(14rem circle at var(--hx) var(--hy), rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 60%)',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      </div>

    </div>
  );
}

export default LanyardBadge;
