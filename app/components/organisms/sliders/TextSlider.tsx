"use client";
import { useRef, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";

type TextSliderProps = {
  children?: React.ReactNode;
  velocity?: number;
  reverse?: boolean;
};

function TextSlider({ children, velocity, reverse }: TextSliderProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [blockWidth, setBlockWidth] = useState(0);

  const content = children ? children : "UX/UI | ";

  useLayoutEffect(() => {
    if (measureRef.current) {
      setBlockWidth(measureRef.current.offsetWidth);
    }
  }, [content]);

  const duration = velocity ? velocity : 20;

  return (
    <motion.div
      className="w-full -rotate-90 origin-top-right absolute -left-48 top-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
    >
      <div className="whitespace-nowrap z-100 w-dvh flex">
        <motion.div
          className="flex shrink-0"
          animate={
            blockWidth > 0
              ? {
                  x: reverse ? [-blockWidth, 0] : [0, -blockWidth],
                }
              : {}
          }
          transition={{
            ease: "linear",
            duration,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <span
            ref={measureRef}
            className="text-zinc-800/10 dark:text-zinc-200/15 text-[135px] shrink-0"
          >
            {content}
          </span>
          <span className="text-zinc-800/10 dark:text-zinc-200/15 text-[135px] shrink-0">
            {content}
          </span>
          <span className="text-zinc-800/10 dark:text-zinc-200/15 text-[135px] shrink-0">
            {content}
          </span>
          <span className="text-zinc-800/10 dark:text-zinc-200/15 text-[135px] shrink-0">
            {content}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TextSlider;
