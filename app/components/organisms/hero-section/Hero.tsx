"use client";
import Link from "next/link";
import TailwindGrid from "@/app/components/templates/grid";
import { Button } from "@/app/components/atoms/button";
import HeroImage from "@/app/components/organisms/hero-section/HeroImage";
import { useLocalizedPath } from "@/app/hooks/useLocalizedPath";

function Hero({ text }) {
  const hero = text.home.heroSection;
  const localizedPath = useLocalizedPath();

  return (
    <TailwindGrid>
      <section className='col-start-1 max-w-full w-full col-end-full md:col-start-1 md:col-end-6 lg:col-start-2 lg:col-end-8 pt-[5vw] md:pt-[8vw] lg:pt-[5vw] order-2 md:order-1 z-30 -mt-[7vw] md:-mt-[7vw] lg:-mt-[9vw] col-span-full'>
        <div className='flex-col justify-start items-start gap-4  inline-flex lg:pt-[1.5vw]'>
          <p className='hidden md:block  lg:pb-4 lg:text-[2.4vw] lg:leading-[1.2vw] font-black md:text-[3vw] md:leading-[6.4vw]'>
            <span className='text-primary'>{hero.subtitle.before}</span>

            <span className=''>{hero.subtitle.text}</span>

            <span className='text-primary'>{hero.subtitle.after}</span>
          </p>
          <h1
            style={{
              textShadow:
                "-0.40px -0.40px 0 #0F0F0F, 0.40px -0.40px 0 #0F0F0F, -0.40px 0.40px 0 #0F0F0F, 0.40px 0.40px 0 #0F0F0F",
            }}
          >
            <span className='font-black pr-[min(3rem,1.5vw)] md:pr-3 xl:pr-4 leading-[3.5vw]  text-[min(3rem,9.5vw)] md:leading-[2.5vw] md:text-[5vw] lg:text-[5.3vw]  xl:text-[5.4vw] 2xl:text-[5.5vw] '>
              {hero.title.before}
            </span>
            <span className='text-primary font-black leading-[3.5vw]  text-[min(3rem,9.5vw)] md:leading-[2.5vw] md:text-[5vw] lg:text-[5.3vw] xl:text-[5.4vw] 2xl:text-[5.5vw] pr-2 '>
              {hero.title.name}
            </span>
            <span className='text-primary font-black leading-[3.5vw]  text-[min(3rem,9.5vw)] md:leading-[2.5vw] md:text-[5vw] lg:text-[5.3vw] xl:text-[5.4vw] 2xl:text-[5.5vw] '>
              {hero.title.lastname}
            </span>
          </h1>
          <p className='font-bold md:w-8/12 lg:w-full text-[min(1.25rem,6.33vw)] lg:text-[1.5vw] max-w-[80%]'>
            {hero.quote}
          </p>
          <div className='bg-white w-5/12 lg:w-3/12 h-[0.1rem] ' />
          <p className='text-[min(1rem,,3.16vw)] lg:text-[1.2vw] font-medium uppercase  w-11/12 md:w-10/12  lg:w-2/3 '>
            {hero.description}
          </p>
        </div>
        <div className='flex-col justify-center items-center gap-[23px] flex col-span-full  lg:col-start-2  lg:gap-10 lg:inline-flex mt-6 md:mt-12 md:flex-row w-full lg:justify-start '>
          <a
            href={hero.files.src}
            download={hero.files.name}
            className='w-full lg:w-auto'
          >
            <Button
              variant='primary'
              size='lg'
              className='w-full lg:w-[20vw] lg:min-w-[172px] lg:text-[1vw]'
              iconAfter={
                <svg
                  viewBox='0 0 15 20'
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-[15px] h-[19px] fill-zinc-950'
                >
                  <g>
                    <path d='M5.30004 6.42137C5.86004 6.42137 6.31004 5.97137 6.31004 5.41137C6.31004 4.85137 5.86004 4.40137 5.30004 4.40137C4.74004 4.40137 4.29004 4.85137 4.29004 5.41137C4.29004 5.97137 4.74004 6.42137 5.30004 6.42137Z' />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M7.33 8.62123C7.33 7.54123 6.42 6.76123 5.3 6.76123C4.18 6.76123 3.27 7.54123 3.27 8.62123V9.13123C3.27 9.22123 3.31 9.31123 3.37 9.37123C3.43 9.43123 3.52 9.47123 3.61 9.47123H6.99C7.08 9.47123 7.17 9.43123 7.23 9.37123C7.29 9.31123 7.33 9.22123 7.33 9.13123V8.62123ZM3.25 11.5712C3.25 11.3723 3.32902 11.1816 3.46967 11.0409C3.61032 10.9002 3.80109 10.8212 4 10.8212H11C11.1989 10.8212 11.3897 10.9002 11.5303 11.0409C11.671 11.1816 11.75 11.3723 11.75 11.5712C11.75 11.7701 11.671 11.9609 11.5303 12.1016C11.3897 12.2422 11.1989 12.3212 11 12.3212H4C3.80109 12.3212 3.61032 12.2422 3.46967 12.1016C3.32902 11.9609 3.25 11.7701 3.25 11.5712ZM3.25 14.5712C3.25 14.3723 3.32902 14.1816 3.46967 14.0409C3.61032 13.9002 3.80109 13.8212 4 13.8212H11C11.1989 13.8212 11.3897 13.9002 11.5303 14.0409C11.671 14.1816 11.75 14.3723 11.75 14.5712C11.75 14.7701 11.671 14.9609 11.5303 15.1016C11.3897 15.2422 11.1989 15.3212 11 15.3212H4C3.80109 15.3212 3.61032 15.2422 3.46967 15.1016C3.32902 14.9609 3.25 14.7701 3.25 14.5712Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M0 2.57129C0 1.46929 0.898 0.571289 2 0.571289H8.69C9.252 0.571289 9.782 0.809289 10.155 1.20229L10.161 1.20929L14.473 5.91129C14.832 6.29429 15 6.79529 15 7.27129V17.5713C15 18.6733 14.102 19.5713 13 19.5713H2C0.898 19.5713 0 18.6733 0 17.5713V2.57129ZM8.689 2.57129H2V17.5713H13V7.26329L8.704 2.57829L8.701 2.57729C8.69736 2.57464 8.6933 2.57262 8.689 2.57129Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.68994 0.571289C8.95516 0.571289 9.20951 0.676646 9.39705 0.864182C9.58459 1.05172 9.68994 1.30607 9.68994 1.57129V6.27129H13.9999C14.1313 6.27129 14.2613 6.29716 14.3826 6.34741C14.504 6.39766 14.6142 6.47132 14.707 6.56418C14.7999 6.65704 14.8736 6.76728 14.9238 6.88861C14.9741 7.00993 14.9999 7.13997 14.9999 7.27129C14.9999 7.40261 14.9741 7.53265 14.9238 7.65397C14.8736 7.7753 14.7999 7.88554 14.707 7.9784C14.6142 8.07125 14.504 8.14491 14.3826 8.19517C14.2613 8.24542 14.1313 8.27129 13.9999 8.27129H8.68994C8.42472 8.27129 8.17037 8.16593 7.98283 7.9784C7.7953 7.79086 7.68994 7.53651 7.68994 7.27129V1.57129C7.68994 1.30607 7.7953 1.05172 7.98283 0.864182C8.17037 0.676646 8.42472 0.571289 8.68994 0.571289Z'
                    />
                  </g>
                </svg>
              }
            >
              {hero.buttons.primary}
            </Button>
          </a>
          <Link
            href={localizedPath("/projects?category=All&page=1")}
            className='w-full lg:w-auto'
          >
            <Button
              variant='secondary'
              size='lg'
              className='w-full lg:w-[13vw] lg:min-w-[172px] lg:text-[1vw]'
            >
              {hero.buttons.secondary}
            </Button>
          </Link>
        </div>
      </section>
      <HeroImage />
    </TailwindGrid>
  );
}

export default Hero;
