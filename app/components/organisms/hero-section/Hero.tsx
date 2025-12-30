
"use client";
import Link from "next/link";
import TailwindGrid from "@/app/components/templates/grid";
import { Button } from "@/app/components/atoms/button";
import HeroPhones from "@/app/components/molecules/hero-phones";
import { useLocalizedPath } from "@/app/hooks";
import HeroFloatingElements from "./HeroFloatingElements";

function Hero({ text }) {
  const hero = text.home.heroSection;
  const localizedPath = useLocalizedPath();

  return (
  <TailwindGrid fullSize >
      <section className='col-start-1 max-w-full w-full col-end-full md:col-start-1 md:col-end-6 lg:col-start-2 lg:col-end-6 pt-[8vw] md:pt-[6vw] lg:pt-[3vw] px-4 md:px-6 lg:px-8 order-2 md:order-1 z-30 col-span-full flex flex-col justify-center'>
        <div className='flex-col justify-start items-start gap-6 inline-flex'>
          
          {/* Main Title */}
          <h1 className="header-hero flex flex-col items-start leading-tight">
            <span>{hero.title.part1}</span>
            <span className='text-primary'>{hero.title.part2}</span>
            <span>{hero.title.part3}</span>
          </h1>

          {/* Subtitle (Development, Automation...) */}
          <h2 className='font-bold text-2xl md:text-3xl lg:text-[2vw] leading-tight max-w-[90%]'>
            {hero.subtitle}
          </h2>

          <div className='bg-primary w-20 h-1' />

          {/* Description */}
          <p className='text-base md:text-lg lg:text-[1.1vw] font-medium text-zinc-600 dark:text-zinc-300 w-full md:w-10/12 lg:w-11/12 leading-relaxed'>
            {hero.description}
          </p>

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
  );
}

export default Hero;
