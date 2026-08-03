'use client';

// ---------------------------------------------------------------------------
// SvgGrid — snap-to-grid overlay rendered as an SVG <pattern>
// ---------------------------------------------------------------------------

export interface SvgGridProps {
  /** Grid cell size in SVG units (default 20) */
  size?: number;
  /** Grid line color (default uses --border token) */
  color?: string;
  /** Grid line opacity (default 0.3) */
  opacity?: number;
  /** Unique pattern ID (default "venue-grid") */
  patternId?: string;
}

export function SvgGrid({
  size = 20,
  color = 'var(--border)',
  opacity = 0.3,
  patternId = 'venue-grid',
}: SvgGridProps) {
  return (
    <>
      <defs>
        <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </>
  );
}
