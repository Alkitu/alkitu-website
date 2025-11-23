import Image from "next/image";
import TailwindGrid from "@/app/components/templates/grid";
import { DotFollower } from "@/app/components/organisms/dot-follower";
import { ParallaxIcons as ParallaxIcon } from "@/app/components/organisms/sliders";
import { ParallaxText } from "@/app/components/organisms/sliders";

function Skills({ text }) {
  const dataSkills = text.home.skillsSection;

  return (
    <div className=' relativew-full h-full flex   z-20 relative  bg-pink-500/0 -mt-[6.75vw] md:-mt-[8.5vw] lg:-mt-[8.75vw] -mb-[1vw] md:-mb-[5.25vw] lg:-mb-[5.25vw]'>
      <div className='relative  w-full  overflow-hidden '>
        <DotFollower></DotFollower>

        <TailwindGrid fullSize>
          <section className='absolute self-center overflow-hidden max-w-full -z-50 -top-[9.75vw] md:-top-[2.5vw] lg:top-0 left-0 '>
            <ParallaxText baseVelocity={dataSkills.velocityScroller}>
              {dataSkills.textScroller}
            </ParallaxText>
          </section>
        </TailwindGrid>
        <section className='relative max-w-full  pt-[8.25vw] w-full flex flex-col justify-center content-center items-center'>
          <TailwindGrid>
            <div className=' self-center lg:col-start-2  col-span-full lg:col-span-11  w-full  flex flex-col'>
              <h3 className='text-start text-[7vw] leading-[8vw] md:text-[4.8vw] md:leading-[4.8vw] lg:text-[3vw] lg:leading-[3vw] font-black z-40 pointer-events-none'>
                {dataSkills.title}
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
                  {dataSkills.titlePrimary}
                </span>
              </h3>
            </div>
          </TailwindGrid>
        </section>
        <TailwindGrid fullSize>
          <section className='col-span-12 self-center overflow-hidden max-w-full z-20 mt-9 pointer-events-none'>
            <ParallaxIcon baseVelocity={-0.2}>
              <div className=' justify-start items-center gap-8  inline-flex '>
                {dataSkills.firstLine &&
                  dataSkills.firstLine.map((skill, index) => (
                    <SkillsItems skill={skill} key={index + skill.name} />
                  ))}
              </div>
            </ParallaxIcon>
          </section>
          <section className='col-span-12 self-center overflow-hidden max-w-full z-20 mb-[3vw] md:mb-[5vw] mt-[6vw] md:mt-[1vw] pointer-events-none'>
            <ParallaxIcon baseVelocity={0.2}>
              <div className=' justify-start items-center gap-8 inline-flex  '>
                {dataSkills.secondLine &&
                  dataSkills.secondLine.map((skill, index) => (
                    <SkillsItems skill={skill} key={index + skill.name} />
                  ))}
              </div>
            </ParallaxIcon>
          </section>
        </TailwindGrid>
      </div>
    </div>
  );
}

export default Skills;

function SkillsItems({ skill }) {
  return (
    <div className=' group flex-col justify-center items-center gap-2 inline-flex pointer-events-none'>
      <div className='w-[20vw] h-[20vw] md:w-[16vw] md:h-[16vw] lg:w-[8vw] lg:h-[8vw] relative bg-white dark:bg-stone-950 rounded-xl shadow-sm shadow-zinc-200 dark:shadow-md dark:shadow-black border border-zinc-50 dark:border-transparent flex-col justify-center items-center flex pointer-events-none'>
        <Image
          src={skill.src}
          width={50}
          height={50}
          alt='skill'
          className='max-w-10/12 object-cover group-hover:scale-125 transition-all duration-200 z-30 pointer-events-none brightness-0 dark:brightness-100'
        />
      </div>
      <p
        className='text-center text-xs text-[0.60vw] font-bold uppercase tracking-wide group-hover:scale-125 transition-all duration-200 pointer-events-none'
        style={{
          color: "rgb(var(--background))",
        }}
      >
        {skill.name}
      </p>
    </div>
  );
}
