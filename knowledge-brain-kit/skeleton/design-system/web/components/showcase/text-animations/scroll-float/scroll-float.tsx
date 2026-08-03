"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "~/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName,
  textClassName,
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    return children.split("").map((char, i) => (
      <span
        key={i}
        className="inline-block transition-none"
        style={{ willChange: "opacity, transform" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || undefined;
    const chars = el.querySelectorAll("span");

    gsap.fromTo(
      chars,
      {
        willChange: "opacity, transform",
        opacity: 0,
        y: 20,
        rotateX: -40,
        filter: "blur(8px)",
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        scale: 1,
        ease,
        duration: animationDuration,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
          scroller,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [children, animationDuration, ease, scrollStart, scrollEnd, stagger, scrollContainerRef]);

  return (
    <h2
      ref={containerRef}
      className={cn("scroll-float-container", containerClassName)}
      style={{ perspective: "400px" }}
    >
      <span className={cn("inline-block", textClassName)}>
        {splitText}
      </span>
    </h2>
  );
}
