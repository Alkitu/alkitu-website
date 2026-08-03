'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

export type MarqueeProject = {
  slug: string;
  title: string;
  image: string;
};

const MIN_TILES = 8; // ensure smooth loop even with very few projects

function buildLoop(items: MarqueeProject[]): MarqueeProject[] {
  if (items.length === 0) return [];
  const list: MarqueeProject[] = [];
  while (list.length < MIN_TILES) {
    list.push(...items);
  }
  return list;
}

export default function WorkMarquee({
  projects,
  locale,
  durationSec = 60,
}: {
  projects: MarqueeProject[];
  locale: string;
  durationSec?: number;
}) {
  const tiles = useMemo(() => buildLoop(projects), [projects]);

  if (tiles.length === 0) return null;

  return (
    <div className="work-marquee">
      <div className="marquee-row">
        <div
          className="marquee-track"
          style={{ animationDuration: `${durationSec}s` }}
        >
          {/* The track holds two identical sets back-to-back so a -50% transform loops seamlessly */}
          {[0, 1].map((set) => (
            <div className="marquee-set" key={set} aria-hidden={set === 1 ? true : undefined}>
              {tiles.map((p, i) => (
                <Link
                  href={`/${locale}/projects/${p.slug}`}
                  key={`${set}-${i}-${p.slug}`}
                  className="marquee-tile group"
                  prefetch={false}
                  tabIndex={set === 1 ? -1 : 0}
                  aria-label={p.title}
                >
                  <div className="tile-image-wrapper">
                    <Image
                      src={p.image}
                      alt={set === 1 ? '' : p.title}
                      width={840}
                      height={472}
                      loading="lazy"
                      unoptimized
                      className="tile-image"
                    />
                  </div>
                  {p.title && (
                    <div className="tile-title">
                      <span className="tile-title-text">{p.title}</span>
                      <span className="tile-arrow" aria-hidden="true">→</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .work-marquee {
          --tile-w: 545px;
          --tile-h: 311px;
          --tile-gap: 24px;
          position: relative;
          width: 100%;
          /* Edge fade so cards visually emerge / disappear instead of clipping */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0,
            black 7%,
            black 93%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0,
            black 7%,
            black 93%,
            transparent 100%
          );
        }

        .marquee-row {
          overflow: hidden;
          width: 100%;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll linear infinite;
          will-change: transform;
        }

        .marquee-row:hover .marquee-track,
        .marquee-row:focus-within .marquee-track {
          animation-play-state: paused;
        }

        .marquee-set {
          display: flex;
          flex-shrink: 0;
          gap: var(--tile-gap);
          padding-right: var(--tile-gap);
        }

        .marquee-tile {
          width: var(--tile-w);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.35s ease;
        }

        .marquee-tile:hover {
          transform: translateY(-4px);
        }

        .tile-image-wrapper {
          width: 100%;
          height: var(--tile-h);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .tile-image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
          pointer-events: none;
        }

        .tile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.6s ease;
        }

        .marquee-tile:hover .tile-image {
          transform: scale(1.04);
        }

        .tile-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px;
          font-size: 0.95rem;
          font-weight: 700;
          color: rgb(var(--foreground-rgb, 255 255 255) / 0.85);
        }

        .tile-title-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tile-arrow {
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          color: rgb(var(--primary-rgb, 0 187 49));
        }

        .marquee-tile:hover .tile-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 1024px) {
          .work-marquee {
            --tile-w: 400px;
            --tile-h: 228px;
            --tile-gap: 18px;
          }
        }

        @media (max-width: 640px) {
          .work-marquee {
            --tile-w: 280px;
            --tile-h: 160px;
            --tile-gap: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
