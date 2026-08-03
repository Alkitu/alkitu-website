import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef } from 'react';
import { animate, createMotionPath, stagger } from 'animejs';

function MotionPathDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pathEl = root.querySelector<SVGPathElement>('#motion-path');
    const particles = root.querySelectorAll<SVGCircleElement>('.particle');
    if (!pathEl || particles.length === 0) return;

    const anims = Array.from(particles).map((p, i) =>
      animate(p, {
        ...createMotionPath(pathEl),
        duration: 2800,
        delay: stagger(220)(p as unknown as Element, i, particles.length),
        ease: 'inOutSine',
        loop: true,
      }),
    );

    return () => anims.forEach((a) => a.revert());
  }, []);

  return (
    <div
      ref={ref}
      className="flex w-[520px] items-center justify-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
    >
      <svg viewBox="0 0 400 200" className="h-48 w-full" aria-hidden>
        <path
          id="motion-path"
          d="M 30 100 C 100 30, 180 170, 250 100 C 300 50, 350 150, 370 100"
          fill="none"
          stroke="var(--muted-foreground)"
          strokeWidth={1.25}
          strokeDasharray="4 4"
        />
        <circle className="particle" r={6} fill="var(--primary)" />
        <circle className="particle" r={5} fill="var(--secondary)" />
        <circle className="particle" r={4} fill="var(--foreground)" />
      </svg>
    </div>
  );
}

const meta: Meta<typeof MotionPathDemo> = {
  title: 'Showcase/Animations/Anime.js/Motion Path',
  component: MotionPathDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`createMotionPath` returns ready-to-use `translateX`, `translateY` and `rotate` getters derived from any SVG path — particles follow the curve including rotation along the tangent. CSS `offset-path` does similar but is less ergonomic with React.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof MotionPathDemo> = {};
