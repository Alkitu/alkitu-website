"use client";

import { motion } from "framer-motion";

export const MarketingIcon = ({ hover, className }: { hover: boolean; className?: string }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-4 -4 32 32"
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="black"
        animate={{
          scale: hover ? 1.05 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.circle 
        cx="12" 
        cy="12" 
        r="6" 
        stroke="black"
      />
      <motion.circle 
        cx="12" 
        cy="12" 
        r="2" 
        fill={hover ? "#2FB24B" : "black"}
        stroke={hover ? "#2FB24B" : "black"}
        animate={{
          scale: hover ? [1, 1.5, 1] : 1,
        }}
        transition={{ duration: 1, repeat: hover ? Infinity : 0, ease: "easeInOut" }}
      />
      
      {/* Target markers moving outwards */}
      <motion.path 
        d="M12 2v2" 
        stroke="#2FB24B" 
        strokeWidth="2" 
        initial={{ opacity: 0 }}
        animate={{ opacity: hover ? [0, 1, 0] : 0, y: hover ? -2 : 0 }} 
        transition={{ duration: 1, repeat: hover ? Infinity : 0 }} 
      />
      <motion.path 
        d="M12 20v2" 
        stroke="#2FB24B" 
        strokeWidth="2" 
        initial={{ opacity: 0 }}
        animate={{ opacity: hover ? [0, 1, 0] : 0, y: hover ? 2 : 0 }} 
        transition={{ duration: 1, repeat: hover ? Infinity : 0, delay: 0.2 }} 
      />
      <motion.path 
        d="M20 12h2" 
        stroke="#2FB24B" 
        strokeWidth="2" 
        initial={{ opacity: 0 }}
        animate={{ opacity: hover ? [0, 1, 0] : 0, x: hover ? 2 : 0 }} 
        transition={{ duration: 1, repeat: hover ? Infinity : 0, delay: 0.4 }} 
      />
      <motion.path 
        d="M2 12h2" 
        stroke="#2FB24B" 
        strokeWidth="2" 
        initial={{ opacity: 0 }}
        animate={{ opacity: hover ? [0, 1, 0] : 0, x: hover ? -2 : 0 }} 
        transition={{ duration: 1, repeat: hover ? Infinity : 0, delay: 0.6 }} 
      />
    </motion.svg>
  );
};
