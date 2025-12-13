"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type TestimonialsDesktopCardProps = {
  container: {
    order: number;
    src?: string;
    name?: string;
    position?: string;
    description?: string;
    url?: string;
    icon?: string;
  };
};

function TestimonialsDesktopCard({ container }: TestimonialsDesktopCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  // Memoize all words and split into visible and additional
  const { visibleWords, additionalWords } = useMemo(() => {
    const wordsLimit = 40;
    const allWords = container.description.split(" ");
    const visible = allWords.slice(0, wordsLimit);
    const additional = allWords.slice(wordsLimit);
    return { visibleWords: visible, additionalWords: additional };
  }, [container.description]);

  // Animation variants for additional words only
  const additionalWordsVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.008, // Faster stagger - 8ms between words
        delayChildren: 0.03
      }
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.006, // Even faster exit - 6ms between words
        staggerDirection: -1 // Remove from end to start
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 3,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.12,
        ease: [0.4, 0, 0.2, 1] // Custom easeInOut
      }
    },
    exit: {
      opacity: 0,
      y: -3,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      layout
      initial={false}
      transition={{
        layout: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1] // Custom easeInOut curve for smooth, natural motion
        }
      }}
      style={{ willChange: "height" }}
      className="items-center justify-center text-center bg-card dark:bg-zinc-900 rounded-xl shadow flex flex-col gap-y-2 mx-auto px-[8%] py-[5%]"
    >
      {container.url && (
        <Link
          href={container.url}
          target="_blank"
          rel="noopener noreferrer"
          className="-mb-8 self-end"
        >
          <motion.button
            layout="position"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="group bg-white cursor-pointer hover:bg-zinc-700 rounded-full transition-all"
          >
            <Image
              width={40}
              height={40}
              alt={container.name}
              src={container.icon}
              className="w-8 h-8 group-hover:invert cursor-pointer"
            />
          </motion.button>
        </Link>
      )}
      <motion.div layout="preserve-aspect">
        <Image
          className="rounded-full pointer-events-none w-3/12 aspect-square object-cover mx-auto"
          width={360}
          height={360}
          alt={`${container.order}`}
          src={container.src}
        />
      </motion.div>
      <motion.h4
        layout="position"
        className="text-center md:text-[1.8vw] lg:text-[1.6vw] 2xl:text-[1.2vw] font-bold"
      >
        {container.name}
      </motion.h4>
      <motion.h5
        layout="position"
        className="text-muted-foreground text-xs md:text-[1.4vw] lg:text-[1.2vw] 2xl:text-[0.8vw] font-medium"
      >
        {container.position}
      </motion.h5>
      <p className="max-w-full md:text-[1.6vw] lg:text-[1.4vw] 2xl:text-[1vw] font-normal tracking-tight">
        {/* Always visible words - no animation */}
        {visibleWords.map((word, index) => (
          <span key={`visible-${index}`} className="inline-block mr-[0.25em]">
            {word}
          </span>
        ))}
        {/* Additional words - animated */}
        <AnimatePresence initial={false}>
          {showFullDescription && (
            <motion.span
              key="additional-words"
              variants={additionalWordsVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="inline-block"
            >
              {additionalWords.map((word, index) => (
                <motion.span
                  key={`additional-${index}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          )}
        </AnimatePresence>
        {/* Ellipsis when truncated */}
        {!showFullDescription && (
          <span className="inline-block">... </span>
        )}
        {/* Inline button */}
        <motion.button
          className="text-primary font-normal underline md:text-[1.6vw] lg:text-[1.4vw] 2xl:text-[1vw] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDescription}
        >
          {showFullDescription ? "Read Less" : "Read More"}
        </motion.button>
      </p>
    </motion.div>
  );
}

export default TestimonialsDesktopCard;
