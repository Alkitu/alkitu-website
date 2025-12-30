"use client";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { Symbol, SymbolSize } from "@/app/components/atoms/symbol";

interface FloatingElementConfig {
  id: string;
  type: "x" | "circle" | "triangle" | "square";
  variant?: "primary" | "negative" | "zinc";
  size?: SymbolSize;
  delay?: number;
  reverse?: boolean;
  wrapperClassName: string;
  order: number; // For animation sequence
  zIndex: number; // For layering
}

const FLOATING_ELEMENTS: FloatingElementConfig[] = [
  // --- INNER RIPPLE (Order 0-10) ---
  {
    id: "TopRight.triangle-inner",
    type: "triangle",
    variant: "negative",
    size: "xs",
    delay: 0.4,
    order: 0,
    zIndex: 10,
    wrapperClassName: "block absolute top-[15%] right-[15%] md:top-[15%] md:right-[8vw] lg:right-[10vw]",
  },
  {
    id: "TopLeft.triangle-large",
    type: "triangle",
    variant: "negative",
    size: "lg",
    delay: 0.5,
    order: 1,
    zIndex: 0,
    wrapperClassName: "block absolute -top-[5vw] left-[10%] md:-top-[10vw] md:left-[41%]",
  },
  {
    id: "TopLeft.circle-inner",
    type: "circle",
    variant: "zinc",
    size: "xs",
    delay: 0.6,
    order: 2,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:-top-[6vw] md:left-[30%]",
  },
  {
    id: "TopLeft.square-inner",
    type: "square",
    variant: "primary",
    size: "sm",
    delay: 0.6,
    reverse: true,
    order: 3,
    zIndex: 10,
    wrapperClassName: "block absolute top-[10%] left-[30%] md:-top-[2vw] md:left-[42%]",
  },

  {
    id: "TopLeft.x-inner",
    type: "x",
    variant: "zinc",
    size: "lg",
    delay: 0.7,
    reverse: true,
    order: 5,
    zIndex: 10,
    wrapperClassName: "block absolute top-[0%] -right-[10%] md:-top-[5vw] md:left-[55%]",
  },
  {
    id: "TopLeft.circle-mid",
    type: "circle",
    variant: "zinc",
    size: "xl",
    delay: 0.7,
    order: 6,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:-top-[5vw] md:left-[25%]",
  },
  {
    id: "TopLeft.triangle-mid",
    type: "triangle",
    variant: "negative",
    size: "md",
    delay: 0.7,
    reverse: true,
    order: 7,
    zIndex: -40,
    wrapperClassName: "hidden md:block absolute md:top-[2vw] md:left-[9vw]",
  },
  {
    id: "BottomLeft.x-inner",
    type: "x",
    variant: "primary",
    size: "lg",
    delay: 0.8,
    order: 8,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute bottom-[40%] left-[8%] md:bottom-[17vw] md:-left-[2.5vw]",
  },
  {
    id: "BottomLeft.triangle-inner",
    type: "triangle",
    variant: "negative",
    size: "md",
    delay: 0.8,
    reverse: true,
    order: 9,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:top-[18vw] md:-left-[0vw]",
  },
  {
    id: "TopRight.circle-inner",
    type: "circle",
    variant: "negative",
    size: "sm",
    delay: 0.8,
    order: 10,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:-top-[6vw] md:left-[65%]",
  },

  // --- MID ZONE (Order 11-20) ---
  {
    id: "BottomLeft.circle-inner",
    type: "circle",
    variant: "negative",
    size: "md",
    delay: 0.9,
    order: 11,
    zIndex: 0,
    wrapperClassName: "block absolute bottom-[15%] left-[10%] md:bottom-[20vw] md:left-[6vw]",
  },
  {
    id: "TopLeft.square-outer",
    type: "square",
    variant: "zinc",
    size: "xs",
    delay: 0.9,
    order: 12,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:top-[15vw] md:left-[1vw]",
  },
  {
    id: "BottomRight.x-inner",
    type: "x",
    variant: "primary",
    size: "md",
    delay: 1.0,
    reverse: true,
    order: 13,
    zIndex: 0,
    wrapperClassName: "block absolute bottom-[15%] -right-[30%] md:bottom-[18vw] md:right-[2vw]",
  },
  {
    id: "BottomLeft.circle-mid",
    type: "circle",
    variant: "primary",
    size: "sm",
    delay: 1.0,
    order: 14,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:bottom-[35%] md:left-[28%]",
  },
  {
    id: "BottomRight.triangle-inner",
    type: "triangle",
    variant: "zinc",
    size: "sm",
    delay: 1.1,
    reverse: true,
    order: 15,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:bottom-[15vw] md:right-[6vw]",
  },
  {
    id: "BottomRight.circle-inner",
    type: "circle",
    variant: "zinc",
    size: "xl",
    delay: 1.2,
    reverse: true,
    order: 16,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:-bottom-[2vw] md:right-[15vw]",
  },
  {
    id: "TopRight.square-inner",
    type: "square",
    variant: "zinc",
    size: "lg",
    delay: 1.2,
    order: 17,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute md:top-[0.5vw] md:right-[3.75vw]",
  },
  {
    id: "BottomRight.square-inner",
    type: "square",
    variant: "negative",
    size: "sm",
    delay: 1.2,
    order: 18,
    zIndex: 30,
    wrapperClassName: "block absolute -bottom-[10%] -right-[30%] md:bottom-[2vw] md:right-[1vw]",
  },
  {
    id: "TopLeft.triangle-annotated",
    type: "triangle",
    variant: "negative",
    size: "sm",
    delay: 1.3,
    reverse: true,
    order: 19,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:-top-[7vw] md:left-[15%]",
  },
  {
    id: "BottomRight.square-mid",
    type: "square",
    variant: "negative",
    size: "xl",
    delay: 1.3,
    reverse: true,
    order: 20,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:bottom-[10vw] md:-right-[1vw]",
  },

  // --- OUTER ZONE (Order 21-41) ---
  {
    id: "TopLeft.circle-outer",
    type: "circle",
    variant: "primary",
    size: "xs",
    delay: 1.4,
    order: 21,
    zIndex: -20,
    wrapperClassName: "hidden md:block absolute md:top-[5vw] md:left-[18vw]",
  },
  {
    id: "BottomLeft.x-center",
    type: "x",
    variant: "primary",
    size: "sm",
    delay: 1.5,
    order: 22,
    zIndex: 0,
    wrapperClassName: "hidden md:block absolute -bottom-[15%] left-[35%] md:-bottom-[6vw] md:left-[35%]",
  },
  {
    id: "BottomLeft.triangle-large",
    type: "triangle",
    variant: "zinc",
    size: "xl",
    delay: 1.5,
    reverse: true,
    order: 23,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:bottom-[22%] md:left-[10%]",
  },
  {
    id: "TopLeft.x-outer",
    type: "x",
    variant: "primary",
    size: "sm",
    delay: 1.5,
    order: 24,
    zIndex: 20,
    wrapperClassName: "hidden md:block absolute md:-top-[3vw] md:-left-[4vw]",
  },
  {
    id: "BottomLeft.x-outer-mid",
    type: "x",
    variant: "zinc",
    size: "md",
    delay: 1.6,
    reverse: true,
    order: 25,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute md:-bottom-[3vw] md:-left-[1vw]",
  },
  {
    id: "BottomLeft.square-center-primary",
    type: "square",
    variant: "primary",
    size: "sm",
    delay: 1.6,
    order: 26,
    zIndex: 20,
    wrapperClassName: "block absolute bottom-[-10%] left-[10%] md:bottom-[4%] md:left-[10%]",
  },
  {
    id: "BottomLeft.circle-center-right",
    type: "circle",
    variant: "negative",
    size: "md",
    delay: 1.7,
    order: 27,
    zIndex: 20,
    wrapperClassName: "hidden md:block absolute md:top-[2vw] md:left-[0%]",
  },
  {
    id: "BottomLeft.triangle-outer-primary",
    type: "triangle",
    variant: "primary",
    size: "md",
    delay: 1.7,
    order: 28,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute md:-bottom-[6vw] md:-left-[4vw]",
  },
  {
    id: "TopRight.circle-corner",
    type: "circle",
    variant: "negative",
    size: "md",
    delay: 1.8,
    order: 29,
    zIndex: 20,
    wrapperClassName: "block absolute top-[30%] -right-[20%] md:right-[2vw] md:-top-[4vw]",
  },
  {
    id: "BottomLeft.square-outer-primary",
    type: "square",
    variant: "primary",
    size: "sm",
    delay: 1.8,
    order: 30,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:bottom-[2vw] md:-left-[7vw]",
  },
  {
    id: "BottomLeft.x-outer-annotated",
    type: "x",
    variant: "zinc",
    size: "md",
    delay: 1.9,
    order: 31,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:bottom-[18vw] md:left-[16%]",
  },
  {
    id: "BottomRight.triangle-corner",
    type: "triangle",
    variant: "primary",
    size: "md",
    delay: 1.9,
    order: 32,
    zIndex: 0,
    wrapperClassName: "block absolute -bottom-[5%] right-[15%] md:-bottom-[5vw] md:right-[8vw]",
  },
  {
    id: "TopLeft.square-corner",
    type: "square",
    variant: "primary",
    size: "lg",
    delay: 2.0,
    reverse: true,
    order: 33,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute md:-top-[2.5vw] md:left-[5vw]",
  },
  {
    id: "BottomLeft.triangle-extra",
    type: "triangle",
    variant: "primary",
    size: "sm",
    delay: 2.0,
    reverse: true,
    order: 34,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:bottom-[8vw] md:left-[12%]",
  },
  {
    id: "BottomRight.square-outer",
    type: "square",
    variant: "negative",
    size: "sm",
    delay: 2.0,
    reverse: true,
    order: 35,
    zIndex: 0,
    wrapperClassName: "hidden md:block absolute md:-bottom-[8vw] md:right-[18vw]",
  },
  {
    id: "BottomLeft.square-edge-zinc",
    type: "square",
    variant: "zinc",
    size: "xl",
    delay: 2.1,
    reverse: true,
    order: 36,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:-bottom-[6vw] md:left-[12%]",
  },
  {
    id: "BottomRight.square-edge",
    type: "square",
    variant: "zinc",
    size: "sm",
    delay: 2.1, 
    reverse: true,
    order: 37,
    zIndex: -10,
    wrapperClassName: "hidden md:block absolute md:bottom-[5vw] md:right-[30%]",
  },
  {
    id: "BottomLeft.circle-edge-primary",
    type: "circle",
    variant: "primary",
    size: "xl",
    delay: 2.2,
    reverse: true,
    order: 38,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:bottom-[10vw] lg:bottom-[6vw] md:-left-[6vw]",
  },
  {
    id: "TopRight.triangle-corner",
    type: "triangle",
    variant: "primary",
    size: "xl",
    delay: 2.2,
    order: 39,
    zIndex: 30,
    wrapperClassName: "hidden md:block absolute md:-top-[13vw] lg:-top-[4.5vw] md:right-[7vw]",
  },
  {
    id: "BottomLeft.circle-far-outer",
    type: "circle",
    variant: "zinc",
    size: "sm",
    delay: 2.3,
    order: 40,
    zIndex: 0,
    wrapperClassName: "hidden md:block absolute md:-bottom-[8vw] md:right-[1vw]",
  },
  {
    id: "BottomLeft.square-inner",
    type: "square",
    variant: "zinc",
    size: "lg",
    delay: 0.8,
    reverse: true,
    order: 41,
    zIndex: 10,
    wrapperClassName: "hidden md:block absolute md:top-[13vw] md:left-[0vw]",
  },
    {
    id: "BottomRight.x-far-outer",
    type: "x",
    variant: "negative",
    size: "lg",
    delay: 2.3,
    order: 42,
    zIndex: 0,
    wrapperClassName: "hidden md:block absolute md:-bottom-[6vw] md:right-[1vw]",
  },
      {
    id: "BottomRight.x-far-outer-center",
    type: "x",
    variant: "zinc",
    size: "sm",
    delay: 2.3,
    order: 43,
    zIndex: 0,
    wrapperClassName: "hidden md:block absolute md:-bottom-[6vw] md:right-[15vw]",
  }
];

const SORTED_ELEMENTS = [...FLOATING_ELEMENTS].sort((a, b) => a.order - b.order);

function HeroFloatingElements({ debug }: { debug?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1 * i,
        staggerDirection: 1,
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 400,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 400,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
    >
      {SORTED_ELEMENTS.map((el) => (
        <motion.div 
          key={el.id} 
          variants={child} 
          className={el.wrapperClassName}
          style={{ zIndex: el.zIndex }}
        >
          <Symbol
            id={el.order + "." + el.id}
            debug={debug}
            type={el.type}
            variant={el.variant}
            size={el.size}
            delay={el.delay}
            reverse={el.reverse}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default HeroFloatingElements;
