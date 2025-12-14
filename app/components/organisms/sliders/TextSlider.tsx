"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

type IconsSliderProps = {
  children?: React.ReactNode;
  velocity?: number;
  reverse?: boolean;
};

function TextSlider({ children, velocity, reverse }: IconsSliderProps) {
  const sliderContentRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderContentWidth, setSliderContentWidth] = useState(0);

  useLayoutEffect(() => {
    const sliderContentElement = sliderContentRef.current;
    if (!sliderContentElement) return;
    const sliderElement = sliderContentElement.parentNode as HTMLElement;
    if (!sliderElement) return;
    const handleResize = () => {
      setSliderWidth(sliderElement.offsetWidth);
      setSliderContentWidth(sliderContentElement.offsetWidth);
    };

    handleResize(); // Set initial sizes
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sliderContentElement = sliderContentRef.current;
    const interval = setInterval(() => {
      if (sliderContentElement && sliderContentWidth > sliderWidth) {
        sliderContentElement.style.transform = `translateX(-${sliderContentWidth}px)`;
        sliderContentElement.style.transition = "none";

        setTimeout(() => {
          if (sliderContentElement) {
            sliderContentElement.style.transform = "translateX(0px)";
            sliderContentElement.style.transition = "30s linear";
          }
        }, 100);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [sliderContentWidth, sliderWidth]);

  let content = children ? children : "UX/UI - ";

  return (
    <>
      <motion.div
        className="w-full -rotate-90 origin-top-right absolute -left-48 top-0 pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="whitespace-nowrap z-100 w-dvh text flex"
          ref={sliderContentRef}
          initial={false}
          animate={
            sliderContentWidth > 0
              ? {
                  translateX: [
                    reverse ? -sliderContentWidth : 0,
                    reverse ? 0 : -sliderContentWidth * 2,
                  ],
                }
              : {}
          }
          transition={{
            ease: "linear",
            duration: velocity ? velocity : 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <p className="text-zinc-800/40 text-[135px] font-black">
            {new Array(20).fill(0).map((_, i) => content)}
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}

export default TextSlider;
