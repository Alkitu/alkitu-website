'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme, Theme } from '@/app/context/ThemeContext';
import { useDropdown } from '@/app/context/DropdownContext';

const itemVariants = {
  open: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.05
    }
  }),
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const mobileNavbar = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 10px)',
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  closed: {
    clipPath: 'inset(10% 50% 90% 50% round 10px)',
    opacity: 0,
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  }
};

const themeOptions = [
  { name: 'Light', value: 'light' as Theme, icon: 'sun' },
  { name: 'Dark', value: 'dark' as Theme, icon: 'moon' },
  { name: 'System', value: 'system' as Theme, icon: 'monitor' }
];

function SelectThemeContent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { activeDropdown, toggleDropdown } = useDropdown();
  const isOpen = activeDropdown === 'theme';

  const getCurrentThemeLabel = () => {
    const current = themeOptions.find(opt => opt.value === theme);
    return current?.name || 'Theme';
  };

  const getCurrentIcon = () => {
    if (theme === 'light') return 'sun';
    if (theme === 'dark') return 'moon';
    return 'monitor';
  };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className="flex flex-col self-center"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => toggleDropdown('theme')}
        className="relative cursor-pointer w-full flex justify-between items-center text-left gap-2 text-foreground"
      >
        <div className="self-center">
          {getCurrentIcon() === 'sun' && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
          {getCurrentIcon() === 'moon' && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {getCurrentIcon() === 'monitor' && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          )}
        </div>
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 }
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.55 }}
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke={isOpen ? 'rgb(0 187 49)' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => null}>
        {isOpen && (
          <motion.ul
            variants={mobileNavbar}
            className={`select-list w-36 absolute bg-zinc-50 dark:bg-zinc-700 text-foreground top-16 list-none m-0 flex flex-col right-8 shadow-lg rounded-md ${
              isOpen ? 'p-2 scale-1' : 'hidden scale-0'
            }`}
            exit="closed"
            style={{
              clipPath: isOpen
                ? 'inset(0% round 0px)'
                : 'inset(10% 50% 90% 50% round 10px)',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            <AnimatePresence mode="wait" initial={false} onExitComplete={() => null}>
              {themeOptions.map((option, index) => (
                <motion.li
                  key={option.value}
                  className="text-center text-md last:border-b-0 border-b-2 font-medium first:pb-2 last:pt-2 flex-row w-full content-center cursor-pointer flex items-center justify-between gap-2 px-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                  initial="closed"
                  animate={isOpen ? 'open' : 'closed'}
                  exit="closed"
                  onClick={() => {
                    toggleDropdown(null);
                    setTheme(option.value);
                  }}
                >
                  <span className={theme === option.value ? 'text-primary font-bold' : ''}>{option.name}</span>
                  {theme === option.value && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default function SelectTheme() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-24 h-10 rounded-lg animate-pulse opacity-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="w-14 h-4 bg-muted rounded"></div>
          <div className="w-3 h-2 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return <SelectThemeContent />;
}
