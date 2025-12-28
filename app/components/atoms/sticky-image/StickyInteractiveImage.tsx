'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

export default function StickyInteractiveImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 400
  });

  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotate = useTransform(smoothProgress, [0, 1], [-5, 5]);
  // Increased range for more noticeable parallax effect
  const y = useTransform(smoothProgress, [0, 1], [0, 200]);
  
  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] lg:min-h-[800px] flex justify-center">
      <div className="sticky top-[15vh] w-full perspective-1000">
        <motion.div 
          style={{ scale, rotate, y }}
          className="relative w-full aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl origin-center"
        >
          <Image
            src="/images/about/Valeria-Urdaneta-Pintada-sobre-unos-Cuadros.webp"
            alt="Creative Team"
            fill
            className="object-cover"
            priority
          />
          
          {/* Decorative Overlay/Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
