import React, { ReactNode } from 'react';
import { cn } from '~/lib/utils';

export interface GlassIconsItem {
    icon: ReactNode;
    color: string;
    label: string;
    customClass?: string;
}

export interface GlassIconsProps {
    items: GlassIconsItem[];
    className?: string;
}

const gradientMapping: Record<string, string> = {
    blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
    purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
    red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
    indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
    orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
    green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

export default function GlassIcons({ items, className }: GlassIconsProps) {
    const getBackgroundStyle = (color: string): React.CSSProperties => {
        if (gradientMapping[color]) {
            return { background: gradientMapping[color] };
        }
        return { background: color };
    };

    return (
        <>
            <style>{`
        .glass-icon-btns {
          display: grid;
          grid-gap: 5em;
          grid-template-columns: repeat(2, 1fr);
          margin: auto;
          padding: 3em 0;
          overflow: visible;
        }

        .glass-icon-btn {
          background-color: transparent;
          outline: none;
          position: relative;
          width: 4.5em;
          height: 4.5em;
          perspective: 24em;
          transform-style: preserve-3d;
          -webkit-tap-highlight-color: transparent;
          border: none;
          cursor: pointer;
        }

        .glass-icon-btn__back,
        .glass-icon-btn__front,
        .glass-icon-btn__label {
          transition:
            opacity 0.3s cubic-bezier(0.83, 0, 0.17, 1),
            transform 0.3s cubic-bezier(0.83, 0, 0.17, 1);
        }

        .glass-icon-btn__back,
        .glass-icon-btn__front {
          border-radius: 1.25em;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glass-icon-btn__back {
          box-shadow: 0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15);
          display: block;
          transform: rotate(15deg);
          transform-origin: 100% 100%;
          will-change: transform;
        }

        .glass-icon-btn__front {
          background-color: hsla(0, 0%, 100%, 0.15);
          box-shadow: 0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset;
          backdrop-filter: blur(0.75em);
          -webkit-backdrop-filter: blur(0.75em);
          display: flex;
          transform-origin: 80% 50%;
          will-change: transform;
        }

        .glass-icon-btn__icon {
          margin: auto;
          width: 1.5em;
          height: 1.5em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glass-icon-btn__label {
          font-size: 1em;
          white-space: nowrap;
          text-align: center;
          line-height: 2;
          opacity: 0;
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          transform: translateY(0);
          color: var(--foreground);
        }

        .glass-icon-btn:focus-visible .glass-icon-btn__back,
        .glass-icon-btn:hover .glass-icon-btn__back {
          transform: rotate(25deg) translate3d(-0.5em, -0.5em, 0.5em);
        }

        .glass-icon-btn:focus-visible .glass-icon-btn__front,
        .glass-icon-btn:hover .glass-icon-btn__front {
          transform: translate3d(0, 0, 2em);
        }

        .glass-icon-btn:focus-visible .glass-icon-btn__label,
        .glass-icon-btn:hover .glass-icon-btn__label {
          opacity: 1;
          transform: translateY(20%);
        }

        @media (min-width: 768px) {
          .glass-icon-btns {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
            <div className={cn("glass-icon-btns", className)}>
                {items.map((item, index) => (
                    <button key={index} type="button" className={cn("glass-icon-btn", item.customClass)} aria-label={item.label}>
                        <span className="glass-icon-btn__back" style={getBackgroundStyle(item.color)}></span>
                        <span className="glass-icon-btn__front">
                            <span className="glass-icon-btn__icon text-white dark:text-foreground" aria-hidden="true">
                                {item.icon}
                            </span>
                        </span>
                        <span className="glass-icon-btn__label">{item.label}</span>
                    </button>
                ))}
            </div>
        </>
    );
}
