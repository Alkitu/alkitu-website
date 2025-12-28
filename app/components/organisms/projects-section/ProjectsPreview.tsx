"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ProjectCard } from "@/app/components/molecules/card";
import TailwindGrid from "@/app/components/templates/grid";
import { ResponsiveList } from "@/app/components/organisms/responsive-list";
import { ParallaxText } from "@/app/components/organisms/sliders";
import { Button } from "@/app/components/atoms/button";
import { FlexCarousel } from "@/app/components/organisms/flex-carousel";
import { useLocalizedPath } from "@/app/hooks";
import { useTranslationContext } from "@/app/context/TranslationContext";
import type { ProjectWithCategories } from "@/lib/types";

function ProjectsPreview({ text }) {
  const { locale } = useTranslationContext();
  const previewProjects = text.home.projectsPreviewSection;
  const localizedPath = useLocalizedPath();

  // State for projects from database
  const [displayProjects, setDisplayProjects] = useState<ProjectWithCategories[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?limit=20');
        const data = await response.json();

        if (data.success) {
          const allProjects = data.data.projects;

          // Randomize selection
          const randomStart = Math.floor(
            Math.random() * Math.max(0, allProjects.length - 6)
          );
          const randomEnd = Math.min(randomStart + 6, allProjects.length);

          // Set only the projects we want to display
          setDisplayProjects(allProjects.slice(randomStart, randomEnd));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extracting images for the carousel
  const projectImages = displayProjects.map((project, index) => ({
    id: project.id,
    order: index + 1,
    src: project.image,
    url: project.slug,
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
          <h3 className='header-section col-span-full lg:col-start-2 text-start z-50 pointer-events-none relative'>
            {previewProjects.title}{" "}
            <span className=' md:hidden'>
              <br />
            </span>
            <span className='text-primary'>{previewProjects.titlePrimary}</span>
          </h3>
          <div className='self-center md:pb-9 md:pt-5 col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col'>
            {loading ? (
              <div className="hidden md:flex justify-center items-center min-h-[20vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              </div>
            ) : (
              <div className='hidden md:block'>
                <ResponsiveList tablet={3}>
                  {displayProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      locale={locale}
                    />
                  ))}
                </ResponsiveList>
              </div>
            )}
          </div>
        </TailwindGrid>
      </div>
      <div className='block md:hidden pb-7 pt-5'>
        {!loading && projectImages.length > 0 && (
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
