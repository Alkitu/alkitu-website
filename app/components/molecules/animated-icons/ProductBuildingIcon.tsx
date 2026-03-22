"use client";

import { motion } from "framer-motion";

export const ProductBuildingIcon = ({ hover, className }: { hover: boolean; className?: string }) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-4 -4 40 40"
      overflow="visible"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Main Container / Window */}
      <motion.rect 
        x="2" y="6" width="28" height="20" rx="3" ry="3" 
        stroke="black"
        animate={{ scale: hover ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Header bar of window */}
      <motion.path 
        d="M2 12 H 30" 
        stroke="black"
      />
      
      {/* Window Controls */}
      <motion.circle cx="6" cy="9" r="1.5" fill="black" stroke="none" />
      <motion.circle cx="10" cy="9" r="1.5" fill="black" stroke="none" />
      
      {/* Code structure blocks building inside */}
      <motion.rect 
        x="6" y="15" width="8" height="3" rx="1"
        fill="#2FB24B"
        stroke="none"
        initial={{ x: -10, opacity: 0 }}
        animate={hover ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.rect 
        x="6" y="20" width="12" height="3" rx="1"
        fill="#2FB24B"
        stroke="none"
        initial={{ x: -10, opacity: 0 }}
        animate={hover ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
      <motion.rect 
        x="16" y="15" width="10" height="3" rx="1"
        fill="black"
        stroke="none"
        initial={{ scaleX: 0 }}
        animate={hover ? { scaleX: 1 } : { scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ originX: 0 }}
      />
      
      {/* Floating cursor/pointer */}
      <motion.path
        d="M20 22 L 23 29 L 25 25 L 29 24 Z"
        fill="white"
        stroke="black"
        initial={{ x: 5, y: 5 }}
        animate={hover ? { x: 0, y: 0 } : { x: 5, y: 5 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
      />
    </motion.svg>
  );
};
