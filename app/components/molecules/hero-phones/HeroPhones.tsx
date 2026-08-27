"use client";

import Image from "next/image";
import { motion, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function HeroPhones() {
  const { x, y } = useMouseParallax();

  return (
    <div className="relative w-full h-auto aspect-[780/631] mt-[10vw] md:mt-0 ml-[10.5vw] md:ml-0 md:pr-[10vw] pointer-events-none">
      {/* Layer 1: Background Hero SVG */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/alkitu-hero.svg"
          alt="Alkitu Hero Background"
          fill
          className="object-contain dark:hidden"
          priority
        />
        <Image
          src="/images/hero/alkitu-hero-dark.svg"
          alt="Alkitu Hero Background"
          fill
          className="object-contain hidden dark:block"
          priority
        />
      </div>

      {/* Layer 2: Masked Phone (Floating + Mouse Parallax) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <svg
          viewBox="0 0 780.15 630.584"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            {/* Recorte anclado al icono: la diagonal larga es la pierna izquierda
                de la A, por eso icono y mascara leen como una sola pieza. */}
            <mask id="hero-phone-mask" maskUnits="userSpaceOnUse">
              <path
                transform="translate(-31 0)"
                d="M504.36 152.15L348.829 630.584H0V0H424.904V40.5731L504.36 152.15Z"
                fill="white"
              />
            </mask>
          </defs>

          {/* 1. STATIC GROUP defining the Mask Area */}
          <g mask="url(#hero-phone-mask)">
            {/* 2. PARALLAX GROUP handling Mouse Interaction */}
            <motion.g style={{ x, y }}>
              {/* 3. FLOATING IMAGE handling Loop Animation */}
              <motion.image
                href="/images/hero/alkitu-phones.png"
                x="-31.14"
                y="-0.42"
                width="504.5"
                height="631"
                preserveAspectRatio="xMidYMid meet"
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
      const xPos = (event.clientX / innerWidth - 0.5) * 50;
      const yPos = (event.clientY / innerHeight - 0.5) * 50;
      x.set(xPos);
      y.set(yPos);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}
