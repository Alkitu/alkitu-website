import Image from "next/image";
import TailwindGrid from "@/app/components/templates/grid";
import { ParallaxIcons as ParallaxIcon } from "@/app/components/organisms/sliders";
import { ParallaxText } from "@/app/components/organisms/sliders";

function Brands({ text }) {
  const dataBrands = text.home.brandsSection;

  return (
    <div className='relative w-full h-full flex z-20 bg-pink-500/0 pb-[14vw] md:pb-[7vw] lg:pb-[9vw] -mt-[6.75vw] md:-mt-[8.5vw] lg:-mt-[8.75vw] '>
      <div className='relative w-full overflow-hidden'>
        
        <TailwindGrid fullSize>
          <section className='absolute self-center overflow-hidden max-w-full -z-50 -top-[9.75vw] md:-top-[2.5vw] lg:top-0 left-0 '>
            <ParallaxText baseVelocity={dataBrands.velocityScroller}>
              {dataBrands.textScroller}
            </ParallaxText>
          </section>
        </TailwindGrid>
        <section className='relative max-w-full pt-[8.25vw] w-full flex flex-col justify-center content-center items-center'>
          <TailwindGrid>
            <div className='self-center lg:col-start-2 col-span-full lg:col-span-11 w-full flex flex-col'>
              <h3 className='header-section text-start z-40 pointer-events-none'>
                {dataBrands.title}
                <span className='md:hidden'>
                  <br />
                </span>
                <span
                  className='text-primary'
                  style={{
                    textShadow:
                      "-1px -1px 0 rgb(var(--background)), 1px -1px 0 rgb(var(--background)), -1px 1px 0 rgb(var(--background)), 1px 1px 0 rgb(var(--background))",
                  }}
                >
                  {" "}
                  {dataBrands.titlePrimary}
                </span>
              </h3>
            </div>
          </TailwindGrid>
        </section>
        <TailwindGrid fullSize>
          <section className='col-span-12 self-center overflow-hidden max-w-full z-20 mt-9 pointer-events-none'>
            <ParallaxIcon baseVelocity={-0.2}>
              <div className='justify-start items-center gap-8 inline-flex'>
                {dataBrands.firstLine &&
                  dataBrands.firstLine.map((brand, index) => (
                    <BrandsItems brand={brand} key={index + brand.name} />
                  ))}
              </div>
            </ParallaxIcon>
          </section>
          <section className='col-span-12 self-center overflow-hidden max-w-full z-20 mb-[3vw] md:mb-[5vw] mt-[6vw] md:mt-[1vw] pointer-events-none'>
            <ParallaxIcon baseVelocity={0.2}>
              <div className='justify-start items-center gap-8 inline-flex'>
                {dataBrands.secondLine &&
                  dataBrands.secondLine.map((brand, index) => (
                    <BrandsItems brand={brand} key={index + brand.name} />
                  ))}
              </div>
            </ParallaxIcon>
          </section>
        </TailwindGrid>
      </div>
    </div>
  );
}

export default Brands;

function BrandsItems({ brand }) {
  return (
    <div className='group flex-col justify-center items-center gap-2 inline-flex pointer-events-none'>
      <div className='w-[20vw] h-[20vw] md:w-[16vw] md:h-[16vw] lg:w-[8vw] lg:h-[8vw] relative bg-white rounded-xl shadow-xs shadow-zinc-200 border border-zinc-50 flex-col justify-center items-center flex pointer-events-none'>
        <Image
          src={brand.src}
          width={150}
          height={150}
          alt={brand.name}
          className='max-w-[70%] max-h-[70%] object-contain group-hover:scale-110 transition-all duration-200 z-30 pointer-events-none'
        />
      </div>
    </div>
  );
}
