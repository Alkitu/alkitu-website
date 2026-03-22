'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { AlkituIcon } from '@/app/components/atoms/alkitu-icon';

const RIPPLE_COUNT = 3;
const RIPPLE_DURATION = 1.5;
const RIPPLE_STAGGER = RIPPLE_DURATION / RIPPLE_COUNT;

type Phase = 'idle' | 'cover' | 'waiting' | 'reveal';

export default function ProjectTransition() {
  const [phase, setPhase] = useState<Phase>('idle');
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const overlayColor = resolvedTheme === 'dark' ? '#0F0F0F' : '#D9D9D9';

  const handleTransition = useCallback(
    (e: Event) => {
      if (phase !== 'idle') return;
      const { href } = (e as CustomEvent<{ href: string }>).detail;
      setPhase('cover');

      // Store href for use after cover animation completes
      (window as Window & { __ptHref?: string }).__ptHref = href;
    },
    [phase]
  );

  useEffect(() => {
    window.addEventListener('project-transition', handleTransition);
    return () => window.removeEventListener('project-transition', handleTransition);
  }, [handleTransition]);

  // Listen for 'project-loaded' during waiting phase
  useEffect(() => {
    if (phase !== 'waiting') return;

    const onLoaded = () => setPhase('reveal');
    window.addEventListener('project-loaded', onLoaded);

    // Safety timeout: reveal after 3s even if project-loaded never fires
    const timeout = setTimeout(() => setPhase('reveal'), 3000);

    return () => {
      window.removeEventListener('project-loaded', onLoaded);
      clearTimeout(timeout);
    };
  }, [phase]);

  // Scroll lock during transition
  useEffect(() => {
    if (phase !== 'idle') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  if (phase === 'idle') return null;

  const animatePhase = phase === 'waiting' ? 'cover' : phase;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 20,
          height: 20,
          top: '50%',
          left: '50%',
          backgroundColor: '#00BB31',
          boxShadow: `0 0 0 100vmax ${overlayColor}`,
        }}
        initial={
          animatePhase === 'cover'
            ? { x: '-50%', y: '-50%', opacity: 0, scale: 1 }
            : { x: '-50%', y: '-50%', opacity: 1, scale: 1 }
        }
        animate={
          animatePhase === 'cover'
            ? { x: '-50%', y: '-50%', opacity: 1, scale: 1 }
            : { x: '-50%', y: '-50%', scale: 250, backgroundColor: 'transparent' }
        }
        transition={
          animatePhase === 'cover'
            ? { duration: 0.35, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
        onAnimationComplete={() => {
          if (phase === 'cover') {
            const href = (window as Window & { __ptHref?: string }).__ptHref;
            if (href) {
              router.push(href);
              delete (window as Window & { __ptHref?: string }).__ptHref;
            }
            setPhase('waiting');
          }
          if (phase === 'reveal') {
            setPhase('idle');
          }
        }}
      />
      <AnimatePresence>
        {phase === 'waiting' && (
          <>
            <motion.div
              key="transition-icon"
              className="absolute"
              style={{ top: '50%', left: '50%' }}
              initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.6 }}
              animate={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <AlkituIcon size={36} className={resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-900'} />
            </motion.div>
            {Array.from({ length: RIPPLE_COUNT }).map((_, i) => (
              <motion.div
                key={`ripple-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 20,
                  height: 20,
                  top: '50%',
                  left: '50%',
                  border: '2px solid #00BB31',
                  backgroundColor: 'transparent',
                }}
                initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 0.6 }}
                animate={{ x: '-50%', y: '-50%', scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: RIPPLE_DURATION,
                  ease: 'easeOut',
                  repeat: Infinity,
                  delay: i * RIPPLE_STAGGER,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
