"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

function CategoryTitleChanger({ name, subtitle }) {
  const variants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    enter: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0,
    },
  };

  return (
    <h2
      className="header-section text-start"
      key={name}
    >
      {subtitle}
      <motion.span
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{
          duration: 3,
          type: "spring" as const,
          stiffness: 300,
          damping: 24,
        }}
        className="text-center inline-block relative self-baseline"
      >
        <AnimatePresence
          initial={false}
          onExitComplete={() => null}
          mode="wait"
        >
          <motion.em
            key={name}
            className="inline-block relative w-max self-baseline md:mt-2 mr-2 font-black text-primary "
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{
              duration: 3,
              type: "spring" as const,
              stiffness: 300,
              damping: 24,
            }}
          >
            {name}
          </motion.em>
        </AnimatePresence>
      </motion.span>
    </h2>
  );
}

export default CategoryTitleChanger;
