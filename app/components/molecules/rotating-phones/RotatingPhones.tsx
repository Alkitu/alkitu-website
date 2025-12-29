"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import PhoneSvg from "./PhoneSvg";

export default function RotatingPhones() {
  return (
    <div className="relative w-full h-auto flex flex-row items-center justify-center gap-0">
      {/* Left: Phones (div.svg) - Animated */}
      {/* "dentro del div.svg llamar al id y hacerlo rotar de izquierda a derecha" */}
      {/* We rotate the container to simulate the phone rotation */}
      {/* Left: Phones (SVG Component with internal animation) */}
      <div className="z-10">
        <PhoneSvg />
      </div>

      {/* Right: Background/Shapes (div2.svg) */}
      <div className="-ml-10 z-0">
        <Image
          src="/images/div2.svg"
          alt="Background Shapes"
          width={328}
          height={312}
          className="object-contain"
        />
      </div>
    </div>
  );
}
