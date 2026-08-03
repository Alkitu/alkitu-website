import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollProgressDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bg = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['var(--secondary)', 'var(--primary)', 'var(--foreground)'],
  );

  return (
    <div className="w-[520px] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      <motion.div
        style={{ scaleX, backgroundColor: bg, transformOrigin: '0%' }}
        className="h-1.5 origin-left"
      />
      <div
        ref={ref}
        className="h-[400px] overflow-y-auto p-6"
      >
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">useScroll + useTransform</strong> turns
            scroll position into a `motionValue` that you can pipe into any animatable
            property. Scroll this panel to watch the bar fill and shift color.
          </p>
          {Array.from({ length: 12 }).map((_, i) => (
            <p key={i}>
              Paragraph {i + 1}. Framer Motion drives this without `useEffect` or refs —
              the bar reads the same scroll source every frame, declaratively.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ScrollProgressDemo> = {
  title: 'Showcase/Animations/Framer Motion/Scroll Progress',
  component: ScrollProgressDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Scroll-linked CSS values via `useScroll` + `useTransform`. Framer wins decisively here — Anime.js can *trigger* on scroll, but not pipe scroll position into a continuous CSS value.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof ScrollProgressDemo> = {};
