'use client';
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface WordsAnimationProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
  keyText?: string;
  setReady?: (ready: boolean) => void;
}

interface ItemProps {
  words: string[];
  child: Variants;
  className?: string;
  setReady?: (ready: boolean) => void;
}

export default function WordsAnimation({
  text,
  tag,
  className = '',
  keyText,
  setReady
}: WordsAnimationProps) {
  const words = text.split(' ');
  const key = keyText || text;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i }
    })
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      x: 150,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const itemProps = { words, child, className, setReady };

  if (tag === 'h1') {
    return (
      <motion.h1
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h1>
    );
  } else if (tag === 'h2') {
    return (
      <motion.h2
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h2>
    );
  } else if (tag === 'h3') {
    return (
      <motion.h3
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h3>
    );
  } else if (tag === 'h4') {
    return (
      <motion.h4
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h4>
    );
  } else if (tag === 'h5') {
    return (
      <motion.h5
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h5>
    );
  } else if (tag === 'h6') {
    return (
      <motion.h6
        className={className}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.h6>
    );
  } else {
    return (
      <motion.p
        className={`${className} flex flex-wrap w-full bg-blue- m-5 h-full items-center`}
        variants={container}
        initial='hidden'
        animate='visible'
        key={key}
      >
        <Item {...itemProps} />
      </motion.p>
    );
  }
}

function Item({ words, child, className = '', setReady }: ItemProps) {
  return (
    <>
      {words.map((word, index) => {
        if (word === '<span>') {
          return (
            <motion.span key={index} variants={child} className='text-primary ml-5 mr-1'>
              {words[index + 1]}
            </motion.span>
          );
        }
        if (words[index - 1] === '<span>') {
          return null;
        }
        if (word === '</span>') {
          return null;
        }
        if (word === '?') {
          return (
            <motion.span
              key={index}
              variants={child}
              className='ml-5 mr-1'
              onAnimationComplete={() => {
                setTimeout(() => {
                  setReady?.(true);
                }, 500);
              }}
            >
              ?
            </motion.span>
          );
        }
        return (
          <motion.span
            variants={child}
            style={{ marginRight: '5px' }}
            key={index}
            className={`${className} bg-yellow- m-5`}
          >
            {word}
          </motion.span>
        );
      })}
    </>
  );
}
