import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';
import { createTimeline, morphTo } from 'animejs';

const SHAPES = {
  circle:
    'M 100 50 C 127.6 50 150 72.4 150 100 C 150 127.6 127.6 150 100 150 C 72.4 150 50 127.6 50 100 C 50 72.4 72.4 50 100 50 Z',
  square: 'M 50 50 L 150 50 L 150 150 L 50 150 Z',
  star:
    'M 100 30 L 117 78 L 168 78 L 127 108 L 143 156 L 100 126 L 57 156 L 73 108 L 32 78 L 83 78 Z',
  blob:
    'M 60 80 C 80 40, 140 50, 150 100 C 160 150, 100 170, 70 150 C 40 130, 40 120, 60 80 Z',
};

function SvgMorphDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const target = root.querySelector<SVGPathElement>('#morph-target');
    const toSquare = root.querySelector<SVGPathElement>('#shape-square');
    const toStar = root.querySelector<SVGPathElement>('#shape-star');
    const toBlob = root.querySelector<SVGPathElement>('#shape-blob');
    const toCircle = root.querySelector<SVGPathElement>('#shape-circle');
    if (!target || !toSquare || !toStar || !toBlob || !toCircle) return;

    const tl = createTimeline({
      loop: true,
      defaults: { duration: 900, ease: 'inOutQuad' },
    });
    tl.add(target, { d: morphTo(toSquare) });
    tl.add(target, { d: morphTo(toStar) });
    tl.add(target, { d: morphTo(toBlob) });
    tl.add(target, { d: morphTo(toCircle) });

    return () => {
      tl.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex w-[360px] items-center justify-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
    >
      <svg viewBox="0 0 200 200" className="h-48 w-48" aria-hidden>
        {/* Hidden target paths — morphTo reads their `d` attribute */}
        <defs>
          <path id="shape-circle" d={SHAPES.circle} />
          <path id="shape-square" d={SHAPES.square} />
          <path id="shape-star" d={SHAPES.star} />
          <path id="shape-blob" d={SHAPES.blob} />
        </defs>
        <path
          id="morph-target"
          d={SHAPES.circle}
          fill="var(--primary)"
          fillOpacity={0.15}
          stroke="var(--primary)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

const meta: Meta<typeof SvgMorphDemo> = {
  title: 'Showcase/Animations/Anime.js/SVG Morph',
  component: SvgMorphDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`morphTo` interpolates between SVG path `d` attributes — even when source and target have different point counts. Targets must be real `<path>` elements in the DOM (here placed inside `<defs>` so they do not render). Framer Motion has no equivalent.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof SvgMorphDemo> = {};
