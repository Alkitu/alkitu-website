"use client";

import Image from "next/image";
import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function HeroPhones() {

  const { x, y } = useMouseParallax();

  return (
    <div className="relative w-full h-auto aspect-462/312">
      {/* Layer 1: Background Hero SVG */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/alkitu-hero.svg"
          alt="Hero Background"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Layer 2: Masked Phone (Floating + Mouse Parallax) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        
        {/* We use an inline SVG to apply the mask path to the PNG image perfectly aligned */}
        <svg
          viewBox="0 0 462 312"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <mask id="hero-phone-mask" maskUnits="userSpaceOnUse">
              {/* The mask path from mask-phones.svg using white to reveal */}
              {/* This mask stays STATIC */}
              <path
                d="M0 312.004H215.605L317.431 -2.02654e-06L0 0.00440466V312.004Z"
                fill="white"
              />
            </mask>
          </defs>

          {/* The Image masked by the path above - ANIMATED */}
          {/* We apply the motion here so the CONTENT moves inside the static MASK */}
          
          {/* 1. STATIC GROUP defining the Mask Area */}
          <g mask="url(#hero-phone-mask)">
            
            {/* 2. PARALLAX GROUP handling Mouse Interaction */}
            <motion.g style={{ x, y }}>
              
              {/* 3. FLOATING IMAGE handling Loop Animation */}
              <motion.image
                href="/images/hero/alkitu-phones.png"
                width="462"
                height="312"
                preserveAspectRatio="xMidYMid meet"
                
                // Floating Animation
                animate={{
                   y: [0, -10, 0],
                   x: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          </g>
        </svg>
      </div>
    </div>
  );
}

// Hook for mouse parallax
function useMouseParallax() {
  const x = useSpring(0, { stiffness: 50, damping: 20 });
  const y = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPos = (event.clientX / innerWidth - 0.5) * 50; // Increased to 50px for visibility
      const yPos = (event.clientY / innerHeight - 0.5) * 50;
      x.set(xPos);
      y.set(yPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}
