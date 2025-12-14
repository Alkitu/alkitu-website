'use client';
import { motion, Transition, Variants } from 'framer-motion';

interface PathProps {
  variants?: Variants;
  d?: string;
  transition?: Transition;
}

const Path = (props: PathProps) => (
  <motion.path
    fill='transparent'
    strokeWidth='3'
    strokeLinecap='round'
    className='stroke-current'
    {...props}
  />
);

interface ToggleMenuProps {
  toggle: () => void;
  isOpen: boolean;
}

export const ToggleMenu = ({ toggle, isOpen }: ToggleMenuProps) => (
  <button
    className={`flex items-center justify-center ${
      isOpen ? 'fixed z-50' : 'fixed z-20 delay-500'
    } top-5 right-9 w-12 h-12 rounded-full bg-transparent`}
    onClick={toggle}
  >
    <svg width='23' height='23' viewBox='0 0 23 28' className='text-foreground'>
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5', transition: { delay: 0.5 } },
          open: { d: 'M 3 16.5 L 17 2.5' }
        }}
      />
      <Path
        d='M 2 9.423 L 20 9.423'
        variants={{
          closed: { opacity: 1, transition: { delay: 0.5 } },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346', transition: { delay: 0.5 } },
          open: { d: 'M 3 2.5 L 17 16.346' }
        }}
      />
    </svg>
  </button>
);
