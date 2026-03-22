
"use client";
import { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import TailwindGrid from "@/app/components/templates/grid";
import { Button } from "@/app/components/atoms/button";
import HeroPhones from "@/app/components/molecules/hero-phones";
import { useLocalizedPath } from "@/app/hooks";
import HeroFloatingElements from "./HeroFloatingElements";
import { Threads } from "@/app/components/atoms/threads";

gsap.registerPlugin(GSAPSplitText);

function RotatingText({ words }: { words: string[][] }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMountedRef = useRef(true);

  const cycle = useCallback(() => {
    if (!textRef.current || !isMountedRef.current || !words.length) return;

    const el = textRef.current;
    const currentIndex = indexRef.current;
    const lines = words[currentIndex];

    el.innerHTML = '';
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.textContent = line;
      el.appendChild(div);
    });

    const splits = Array.from(el.children).map(
      (child) => new GSAPSplitText(child as HTMLElement, { type: "chars" })
    );
    const allChars = splits.flatMap((s) => s.chars);

    const tl = gsap.timeline({
      onComplete: () => {
        splits.forEach((s) => s.revert());
        if (!isMountedRef.current) return;
        indexRef.current = (currentIndex + 1) % words.length;
        cycle();
      },
    });

    // Enter: chars animate in
    tl.fromTo(
      allChars,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power3.out",
      }
    );

    // Hold
    tl.to({}, { duration: 2.2 });

    // Exit: chars animate out
    tl.to(allChars, {
      opacity: 0,
      y: -30,
      duration: 0.35,
      stagger: 0.025,
      ease: "power3.in",
    });

    timelineRef.current = tl;
  }, [words]);

  useEffect(() => {
    isMountedRef.current = true;
    cycle();

    return () => {
      isMountedRef.current = false;
      timelineRef.current?.kill();
    };
  }, [cycle]);

  return (
    <span className="inline-flex relative overflow-hidden align-baseline min-h-[2.2em]">
      <span ref={textRef} className="text-primary inline-block">
        {words[0]?.map((line, i) => <div key={i}>{line}</div>)}
      </span>
    </span>
  );
}

function Hero({ text }) {
  const hero = text.home.heroSection;
  const localizedPath = useLocalizedPath();
  const rotatingWords: string[][] = hero.title.rotatingWords || [];

  return (
  <div className="relative overflow-hidden min-h-[calc(100dvh-5rem)] flex flex-col justify-center">
  <Threads
    amplitude={1}
    distance={0}
    enableMouseInteraction
    yOffset={-0.3}
  />
  <TailwindGrid fullSize >
      <section className='col-start-1 max-w-full w-full col-end-full md:col-start-1 md:col-end-6 lg:col-start-2 lg:col-end-6 px-4 md:px-6 lg:px-8 order-2 md:order-1 z-30 col-span-full flex flex-col justify-center'>
        <div className='flex-col justify-start items-start gap-6 inline-flex'>

          {/* Main Title */}
          <h1 className="header-hero flex flex-col items-start uppercase">
            <span>{hero.title.part1}</span>
            <RotatingText words={rotatingWords} />
          </h1>

          {/* Subtitle (Development, Automation...) */}
          <h2 className='font-bold text-xl md:text-2xl lg:text-[1.4vw] leading-tight max-w-[90%] text-foreground/80'>
            {hero.subtitle}
          </h2>



          {/* Action Buttons */}
          <div className='flex flex-col md:flex-row gap-4 mt-4 w-full md:w-auto'>
            <Link href={localizedPath("/contact")} className='w-full md:w-auto'>
              <Button
                variant='primary'
                size='lg'
                className='w-full md:w-auto min-w-[160px]'
                iconAfter={
                  <svg
                    viewBox='0 0 24 24'
                    fill="none"
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-5 h-5 stroke-current'
                  >
                     <path d="M4 12H20M20 12L14 6M20 12L14 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                {hero.buttons.primary}
              </Button>
            </Link>

            <Link
              href={localizedPath("/projects?category=All&page=1")}
              className='w-full md:w-auto'
            >
              <Button
                variant='secondary'
                size='lg'
                className='w-full md:w-auto min-w-[160px]'
              >
                {hero.buttons.secondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Right Column: HeroPhones */}
      <section className='col-start-1 col-end-4 md:col-start-6 md:col-end-13 lg:col-start-7 lg:col-end-13 order-2 md:order-2 flex items-center justify-center p-0 md:p-0'>
         <div className="w-full lg:max-w-full relative  md:pr-[4vw] mt-12 md:mt-0">
            <HeroFloatingElements debug={false} />
            <HeroPhones />
         </div>
      </section>
    </TailwindGrid>
  </div>
  );
}

export default Hero;
