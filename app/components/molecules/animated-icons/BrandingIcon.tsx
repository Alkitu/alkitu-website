"use client";

import { motion } from "framer-motion";

export const BrandingIcon = ({ hover, className }: { hover: boolean; className?: string }) => {
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
      {/* Outer black 4-point magic star */}
      <motion.path
        d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z"
        stroke="black"
        fill={hover ? "transparent" : "black"}
        animate={{
          rotate: hover ? 180 : 0,
          scale: hover ? 1.05 : 1,
          fill: hover ? "transparent" : "black"
        }}
        transition={{ duration: 2, repeat: hover ? Infinity : 0, ease: "easeInOut" }}
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Inner green 4-point magic star */}
      <motion.path
        d="M12 4 Q12 12 20 12 Q12 12 12 20 Q12 12 4 12 Q12 12 12 4 Z"
        stroke="#2FB24B"
        fill="#2FB24B"
        initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
        animate={hover ? {
          opacity: 1,
          rotate: -180,
          scale: [0.8, 1.2, 0.8]
        } : { opacity: 0, rotate: 0, scale: 0.5 }}
        transition={{ duration: 3, repeat: hover ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "12px 12px" }}
      />

      {/* Floating accent sparkles */}
      <motion.circle cx="4" cy="4" r="1.5" fill="#2FB24B" stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={hover ? { opacity: [0, 1, 0], scale: [0, 1.5, 0], y: -3 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1.5, repeat: hover ? Infinity : 0, delay: 0.2 }}
      />
      <motion.circle cx="20" cy="20" r="1.5" fill="#2FB24B" stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={hover ? { opacity: [0, 1, 0], scale: [0, 1.5, 0], y: 3 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1.5, repeat: hover ? Infinity : 0, delay: 0.8 }}
      />
      <motion.circle cx="22" cy="4" r="1.5" fill="black" stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={hover ? { opacity: [0, 1, 0], scale: [0, 1.5, 0], x: 3 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1.5, repeat: hover ? Infinity : 0, delay: 0.5 }}
      />
      <motion.circle cx="2" cy="22" r="1.5" fill="black" stroke="none"
        initial={{ opacity: 0, scale: 0 }}
        animate={hover ? { opacity: [0, 1, 0], scale: [0, 1.5, 0], x: -3 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1.5, repeat: hover ? Infinity : 0, delay: 1.1 }}
      />
    </motion.svg>
  );
};
