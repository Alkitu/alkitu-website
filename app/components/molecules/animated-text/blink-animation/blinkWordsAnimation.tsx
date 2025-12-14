'use client';
import { motion, Variants } from 'framer-motion';

interface BlinkWordsAnimationProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  className?: string;
  keyText?: string;
}

interface ItemProps {
  words: string[];
  child: Variants;
  className?: string;
}

export default function BlinkWordsAnimation({
  text,
  tag,
  className = '',
  keyText
}: BlinkWordsAnimationProps) {
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
      x: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const itemProps = { words, child, className };

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

function Item({ words, child, className = '' }: ItemProps) {
  return (
    <>
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: '5px' }}
          key={index}
          className={`${className} bg-yellow- m-5`}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}
