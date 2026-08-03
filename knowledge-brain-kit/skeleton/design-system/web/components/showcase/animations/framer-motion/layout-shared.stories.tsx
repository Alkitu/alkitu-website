import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const CARDS = [
  { id: 'a', title: 'Theme Forge', body: 'Edit color, typography, radius live.' },
  { id: 'b', title: 'Design System', body: 'Tokens, primitives, compositions, patterns.' },
  { id: 'c', title: 'Alkimia Core', body: 'Web + API + Shared in a single monorepo.' },
];

function LayoutSharedDemo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <LayoutGroup>
      <div className="flex w-[640px] flex-wrap gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4">
        {CARDS.map((c) => (
          <motion.button
            key={c.id}
            type="button"
            layoutId={`card-${c.id}`}
            onClick={() => setActive(c.id)}
            className="flex-1 rounded-[var(--radius-md)] border border-border bg-background p-4 text-left"
          >
            <motion.h3 layoutId={`title-${c.id}`} className="text-sm font-semibold">
              {c.title}
            </motion.h3>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`card-${active}`}
              className="w-[420px] rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h3 layoutId={`title-${active}`} className="text-xl font-bold">
                {CARDS.find((c) => c.id === active)?.title}
              </motion.h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {CARDS.find((c) => c.id === active)?.body}
              </p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-4 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

const meta: Meta<typeof LayoutSharedDemo> = {
  title: 'Showcase/Animations/Framer Motion/Layout Shared Element',
  component: LayoutSharedDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shared element transitions via `layoutId`. Click a card — its position, size and inner title interpolate smoothly between the grid item and the modal. Anime.js has no equivalent.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof LayoutSharedDemo> = {};
