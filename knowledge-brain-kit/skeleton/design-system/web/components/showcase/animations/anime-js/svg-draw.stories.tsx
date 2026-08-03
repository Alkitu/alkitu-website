import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { animate, createDrawable, stagger } from 'animejs';

function SvgDrawDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const a = animate(createDrawable('.draw-path', root), {
      draw: ['0 0', '0 1', '1 1'],
      duration: 1400,
      delay: stagger(180),
      ease: 'inOutQuad',
    });
    return () => a.revert();
  }, [tick]);

  return (
    <div
      ref={ref}
      className="flex w-[480px] flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6"
    >
      <svg viewBox="0 0 200 200" className="h-48 w-48" aria-hidden>
        <path
          className="draw-path"
          d="M 100 20 L 180 100 L 100 180 L 20 100 Z"
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
        />
        <path
          className="draw-path"
          d="M 100 50 L 150 100 L 100 150 L 50 100 Z"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={2}
        />
        <circle
          className="draw-path"
          cx={100}
          cy={100}
          r={20}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={2}
        />
      </svg>
      <button
        type="button"
        onClick={() => setTick((t) => t + 1)}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Replay
      </button>
    </div>
  );
}

const meta: Meta<typeof SvgDrawDemo> = {
  title: 'Showcase/Animations/Anime.js/SVG Draw',
  component: SvgDrawDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`createDrawable` calculates each path\'s length and animates `stroke-dashoffset` automatically — works on any SVG element including `<circle>`. Framer Motion has no equivalent helper.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof SvgDrawDemo> = {};
