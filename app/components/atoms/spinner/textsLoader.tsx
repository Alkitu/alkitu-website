'use client';
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import {
  BlinkWordsChangers,
  WordsAnimation,
} from "@/app/components/molecules/animated-text";

interface TextsLoaderProps {
  className?: string;
}

const containerVariants: Variants = {
  initial: {
    width: "100vw",
    maxWidth: "100%",
  },
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TextsLoader({ className = '' }: TextsLoaderProps) {
  const [safeRemove, setSafeRemove] = useState(false);
  const [blink, setBlink] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial='initial'
      animate='animate'
      className={`flex bg-zinc-900 ${
        blink && "invert"
      } gap-4 items-center justify-center h-dvh mx-auto overflow-hidden relative ${className}`}
    >
      <div className='absolute h-dvh w-3/4 bg-red- flex items-center'>
        {!safeRemove && (
          <BlinkWordsChangers
            words={["Don't", "blink"]}
            alternative
            setSafeRemove={setSafeRemove}
            setBlink={setBlink}
            blink={blink}
          />
        )}
        <AnimatePresence
          initial={false}
          mode='wait'
          onExitComplete={() => null}
        >
          {safeRemove && !ready && (
            <motion.div
              className=' items-center flex w-full'
              exit={{
                y: "-100dvh",
                opacity: 0,
              }}
              transition={{
                type: "spring",
                damping: 12,
                stiffness: 150,
              }}
            >
              <div className='bg-slate- items-center flex w-full'>
                <WordsAnimation
                  text='Are you ready for <span> Luis </span> ?'
                  className=' text-6xl md:text-8xl lg:text-9xl font-black uppercase'
                  setReady={setReady}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {ready && <p> Hola Luis</p>}
    </motion.div>
  );
}
