"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProjectCard } from "@/app/components/atomic/molecules/card";
import TailwindGrid from "@/app/components/atomic/templates/grid";
import { ResponsiveList } from "@/app/components/atomic/organisms/responsive-list";
import { ParallaxText } from "@/app/components/atomic/organisms/sliders";
import { Button } from "@/app/components/atomic/atoms/button";
import { FlexCarousel } from "@/app/components/atomic/organisms/flex-carousel";
import { useLocalizedPath } from "@/app/hooks/useLocalizedPath";

function ProjectsPreview({ text }) {
  const projects = useState(text.portfolio.projects);
  const previewProjects = text.home.projectsPreviewSection;
  const localizedPath = useLocalizedPath();

  // Start with first 6 projects to avoid hydration mismatch
  const [contentStart, setContentStart] = useState(0);
  const [contentEnd, setContentEnd] = useState(6);

  // Randomize after hydration on client side only
  useEffect(() => {
    const randomStart = Math.floor(
      Math.random() * Math.max(0, text.portfolio.projects.length - 6)
    );
    const randomEnd = Math.min(randomStart + 6, text.portfolio.projects.length);
    setContentStart(randomStart);
    setContentEnd(randomEnd);
  }, [text.portfolio.projects.length]);

  // Extracting images for the carousel
  const projectImages = text.portfolio.projects.slice(0, 6).map((project) => ({
    order: project.id,
    src: project.image,
    url: project.url,
  }));

  return (
    <div className='relative flex-col flex col-span-full  bg-yellow-500/0 '>
      <TailwindGrid fullSize>
        <section className='absolute self-center overflow-hidden max-w-full -z-50 -top-[17vw] md:-top-[11vw] lg:-top-[8.5vw] left-0 '>
          <ParallaxText baseVelocity={-0.05}>
            {previewProjects.textScroller}
          </ParallaxText>
        </section>
      </TailwindGrid>
      <div className='col-span-full max-w-full flex flex-col justify-center content-center items-center'>
        <TailwindGrid>
          <h3 className='col-span-full lg:col-start-2 text-start text-[7vw] leading-[8vw] md:text-[4.8vw] md:leading-[4.8vw] lg:text-[3vw] lg:leading-[3vw] font-black z-50 pointer-events-none relative'>
            {previewProjects.title}{' '}
            <span className=' md:hidden'>
              <br />
            </span>
            <span className='text-primary'>{previewProjects.titlePrimary}</span>
          </h3>
          <div className='self-center md:pb-9 md:pt-5 col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col'>
            <div className='hidden md:block'>
              <ResponsiveList tablet={3}>
                {text.portfolio.projects &&
                  projects[0]
                    .slice(contentStart, contentEnd)
                    .map((project) => (
                      <ProjectCard key={project.url} project={project} />
                    ))}
              </ResponsiveList>
            </div>
          </div>
        </TailwindGrid>
      </div>
      <div className='block md:hidden pb-7 pt-5'>
        {projectImages && (
          <FlexCarousel
            dataCards={projectImages}
            width={70}
            reduceGap={15}
            key='image'
            type='image'
          />
        )}
      </div>
      <TailwindGrid>
        <div className='flex justify-center items-center col-span-full lg:col-start-2 my-auto'>
          <Link href={localizedPath("/projects?category=All&page=1")}>
            <Button
              variant='primary'
              className='text-center text-md py-3 px-5 md:text-[min(2vw,22px)] md:px-[min(3vw,2.5rem)] md:py-[min(0.5vw,2rem)] rounded-full'
            >
              {previewProjects.button}
            </Button>
          </Link>
        </div>
      </TailwindGrid>
    </div>
  );
}

export default ProjectsPreview;
