'use client';
import { motion, Variants } from "framer-motion";

interface DotsWaveLoaderProps {
  count?: number;
  className?: string;
  setLoading: (loading: boolean) => void;
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

const dotVariants: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [20, -20, 20],
    opacity: [1, 0.1, 1],
    backgroundColor: ["#00BB31", "#125D26", "#125D26", "#125D26", "#00BB31"],
    transition: {
      type: "spring",
      duration: 2,
      damping: 300,
      bounce: 0.25,
      mass: 0.5,
      stiffness: 50,
      restDelta: 0.5,
      repeat: Infinity,
      velocity: 2,
    },
  },
};

export default function DotsWaveLoader({
  count = 5,
  className = '',
  setLoading
}: DotsWaveLoaderProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`flex bg-zinc-900 gap-4 items-center justify-center h-dvh mx-auto overflow-hidden relative ${className}`}
    >
      {Array(count)
        .fill(null)
        .map((_, index) => {
          return (
            <motion.div
              key={index}
              variants={dotVariants}
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
              }}
            />
          );
        })}
      <motion.div
        className="absolute"
        initial={{
          opacity: 1,
          height: "0vh",
          width: "0vw",
          borderRadius: 999999,
          backgroundColor: "#0D0D0D",
        }}
        animate={{
          opacity: 1,
          height: "450vw",
          width: "450vw",
          transition: {
            type: "spring",
            duration: 5,
            delay: 2,
            bounce: 0.25,
          },
        }}
        onAnimationComplete={() => {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }}
      />
    </motion.div>
  );
}
