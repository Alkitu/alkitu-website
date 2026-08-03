import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function EnterExitDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex min-h-[320px] w-[420px] flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Toggle drawer
      </button>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="w-full rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm"
          >
            <p className="font-semibold">Framer Motion · AnimatePresence</p>
            <p className="mt-1 text-muted-foreground">
              Mount/unmount animations are impossible without Framer because React
              removes the node from the tree before any animation can run on it.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const meta: Meta<typeof EnterExitDemo> = {
  title: 'Showcase/Animations/Framer Motion/Enter & Exit',
  component: EnterExitDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enter/exit animations via `AnimatePresence` — Framer\'s exclusive ability to animate unmount in React.',
      },
    },
  },
};

export default meta;
export const Default: StoryObj<typeof EnterExitDemo> = {};
