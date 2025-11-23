"use client";
import { useState, useEffect } from "react";
import useScreenWidth from "@/app/components/organisms/flex-carousel/hooks/useScreenWitdh";
import TailwindGrid from "@/app/components/templates/grid";
import { ResponsiveList } from "@/app/components/organisms/responsive-list";
import { ParallaxText } from "@/app/components/organisms/sliders";
import TestimonialsDesktopCard from "@/app/components/organisms/flex-carousel/cards/TestimonialsDesktopCard";
import { FlexCarousel } from "@/app/components/organisms/flex-carousel";

function Testimonials({ text }) {
  const dataTestimonials = text.home.testimonialsSection;
  const screenCenter = useScreenWidth();
  const screenWidth = useScreenWidth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='relative col-span-full max-w-full  bg-orange-500/0 pb-[14vw] md:pb-[7vw] lg:pb-[9vw]'>
      <TailwindGrid fullSize>
        <section className='absolute pt-5 -z-50 overflow-hidden max-w-full'>
          <ParallaxText baseVelocity={dataTestimonials.velocityScroller}>
            {dataTestimonials.textScroller}
          </ParallaxText>
        </section>
      </TailwindGrid>
      <div className='col-span-full max-w-full flex flex-col justify-center content-center items-center'>
        <TailwindGrid>
          <h3 className='col-span-full lg:col-start-2 text-start text-[7vw] leading-[8vw] md:text-[4.8vw] md:leading-[4.8vw] lg:text-[3vw] lg:leading-[3vw] font-black z-40 pointer-events-none'>
            {dataTestimonials.title}
            <span className='md:hidden'>
              <br />
            </span>
            <span className='text-primary'>
              {" "}
              {dataTestimonials.titlePrimary}
            </span>
          </h3>
          <div className='self-center md:pb-9 md:pt-5 col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col hidden md:block'>
            <ResponsiveList
              tablet={3}
              desktop={3}
              mobile={1}
              className=' w-full max-w-full '
            >
              {dataTestimonials.testimonials &&
                dataTestimonials.testimonials.map((testimonial, index) => (
                  <section
                    key={testimonial + index}
                    className='w-full relative flex flex-col items-center justify-center'
                  >
                    <TestimonialsDesktopCard container={testimonial} />
                  </section>
                ))}
            </ResponsiveList>
          </div>
        </TailwindGrid>
      </div>

      <div className='inline md:hidden'>
        {isMounted && screenCenter && (
          <FlexCarousel
            dataCards={dataTestimonials.testimonials}
            width={70}
            reduceGap={15}
            key={screenWidth + dataTestimonials.carrouselKey}
            type='testimonial'
          />
        )}
      </div>
    </div>
  );
}

export default Testimonials;
