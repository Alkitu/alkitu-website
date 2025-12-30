"use client";
import { motion } from "framer-motion";

type SymbolVariant = "primary" | "negative" | "zinc";
export type SymbolSize = "xs" | "sm" | "md" | "lg" | "xl";

type Symbol_Props = {
  delay?: number;
  type?: "x" | "circle" | "triangle" | "square";
  className?: string; // Additional classes (e.g., specific overrides)
  size?: number | SymbolSize; // Number = scale (legacy), String = preset size
  reverse?: boolean;
  variant?: SymbolVariant;
  id?: string;
  debug?: boolean;
};

const variantClasses: Record<SymbolVariant, string> = {
  primary: "stroke-primary",
  negative: "stroke-black dark:stroke-white",
  zinc: "stroke-zinc-100 dark:stroke-zinc-800",
};

const sizeClasses: Record<SymbolSize, string> = {
  xs: "w-[8vw] h-[8vw] md:w-[1.5vw] md:h-[1.5vw] lg:w-[1.5vw] lg:h-[1.5vw]",
  sm: "w-[10vw] h-[10vw] md:w-[2.5vw] md:h-[2.5vw] lg:w-[2vw] lg:h-[2vw]",
  md: "w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw] lg:w-[3vw] lg:h-[3vw]",
  lg: "w-[14vw] h-[14vw] md:w-[4.5vw] md:h-[4.5vw] lg:w-[4vw] lg:h-[4vw]",
  xl: "w-[16vw] h-[16vw] md:w-[6vw] md:h-[6vw] lg:w-[6vw] lg:h-[6vw]",
};

function Symbol({
  delay = 0,
  type = "x",
  reverse = false,
  className = "",
  size = 1,
  variant = "primary",
  id,
  debug = false,
}: Symbol_Props) {
  
  // Base stroke class logic
  const strokeClass = variantClasses[variant] || variantClasses.primary;
  
  // Size logic: if string, get class; if number, use as scale
  const sizeClass = typeof size === "string" ? sizeClasses[size] : "";
  const initialScale = typeof size === "number" ? size : 1;

  return (
    <motion.div
      className={`flex items-center justify-center relative cursor-pointer ${sizeClass} ${className}`}
      initial={{ scale: initialScale }} // Escala inicial del motion.div
      whileHover={{ scale: initialScale * 1.2, opacity: 0.5 }} // Escala cuando el cursor está sobre el contenedor
      whileTap={{ scale: initialScale * 0.8, opacity: 0.25 }} // Escala cuando se hace clic en el contenedor
    >
      {debug && id && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] px-1 rounded z-100 whitespace-nowrap pointer-events-none shadow-sm font-mono">
          {id}
          </div>
      )}

      {type === "x" && (
        <motion.svg
          initial={{ rotate: 0 }}
          animate={{ rotate: reverse ? [0, -90, -90, 0] : [0, 90, 90, 0] }}
          transition={{
            duration: 4,
            times: [0, 0.1, 0.76, 1],
            ease: ["easeInOut", "easeInOut", "easeInOut"],
            repeat: Infinity,
            repeatType: "reverse",
            delay: delay,
          }}
          width="57"
          height="57"
          viewBox="0 0 57 57"
          className={`${strokeClass} w-full h-full fill-none`}
        >
          <path
            d="M10.9351 11.0649L45.9351 46.0649M45.9351 11.0649L10.9351 46.0649"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
      {type === "circle" && (
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: reverse ? [1.15, 0.9] : [0.9, 1.15] }}
          transition={{
            duration: 5,
            type: "spring" as const,
            damping: 5,
            stiffness: 300,
            restDelta: 0.5,
            delay: delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`${strokeClass} w-full h-full fill-none`}
          xmlns="http://www.w3.org/2000/svg"
          width="61"
          height="61"
          viewBox="0 0 61 61"
        >
          <circle cx="30.5" cy="30.5" r="21" strokeWidth="5" />
        </motion.svg>
      )}
      {type === "square" && (
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="68"
          height="68"
          viewBox="0 0 68 68"
          initial={{ rotate: 0 }}
          animate={{ rotate: reverse ? [0, -360] : [0, 360] }}
          transition={{
            duration: 10,
            times: [0, 1],
            ease: ["linear"],
            repeat: Infinity,
            delay: delay,
          }}
          className={`${strokeClass} w-full h-full fill-none`}
        >
          <rect
            x="8.59117"
            y="24.2557"
            width="38"
            height="38"
            transform="rotate(-24.1633 8.59117 24.2557)"
            strokeWidth="5"
          />
        </motion.svg>
      )}
      {type === "triangle" && (
        <motion.svg
          initial={{ rotate: 0 }}
          animate={{
            rotate: reverse ? [90, 0] : [0, 90],
            y: reverse ? [0, 20] : [20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: delay,
            repeatType: "reverse",
          }}
          width="71"
          height="71"
          viewBox="0 0 71 71"
          className={`${strokeClass} w-full h-full fill-none`}
        >
          <path
            d="M9.28529 50.75L35.5002 5.0263L61.7151 50.75L9.28529 50.75Z"
            strokeWidth="5"
          />
        </motion.svg>
      )}
    </motion.div>
  );
}

export default Symbol;
