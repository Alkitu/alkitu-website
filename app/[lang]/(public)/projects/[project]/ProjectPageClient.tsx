"use client";
import { TextSlider } from "@/app/components/organisms/sliders";
import { ProjectNavigation } from "@/app/components/molecules/project-navigation";
import { Carousel } from "@/app/components/organisms/carousel/basic-carousel";
import { useTranslationContext } from "../../../../context/TranslationContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import type { ProjectWithCategories } from "@/lib/types";


function ProjectPageClient() {
  const { translations, locale } = useTranslationContext();
  const params = useParams();
  const projectSlug = params.project as string;

  // Project data from database
  const [project, setProject] = useState<ProjectWithCategories | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project from database
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectSlug}`);
        const data = await response.json();

        if (data.success) {
          setProject(data.data.project);
        } else {
          setError(data.error?.message || 'Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
        window.dispatchEvent(new Event('project-loaded'));
      }
    };

    fetchProject();
  }, [projectSlug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The requested project does not exist.'}</p>
          <Link
            href={`/${locale}/projects`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Get localized data
  const title = locale === 'es' ? project.title_es : project.title_en;
  const about = locale === 'es' ? project.about_es : project.about_en;
  const description = locale === 'es' ? project.description_es : project.description_en;

  return (
    <div className='lg:flex w-screen max-w-full min-h-[calc(100dvh-5rem)]'>
      <section
        className='w-full lg:w-[60%] min-h-[calc(100dvh-5rem)] relative overflow-hidden flex justify-center items-center pt-20 pb-[2vw] lg:pt-0 lg:pb-0'
        style={{ viewTransitionName: 'project-gallery' }}
      >
        <motion.div
          key={`gallery-${projectSlug}`}
          className='lg:w-4/5 z-10 w-full'
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, damping: 30, stiffness: 200, delay: 0.1 }}
        >
          <Carousel
            numbers={false}
            bullets={false}
            thumbnails
            arrows={false}
            longCard={false}
            className='mx-5 px-5 py-10'
            immagesArray={project.gallery}
            projectId={String(project.legacy_id || 0)}
          />
        </motion.div>
        <TextSlider>
          {project.categories.map((c, i) => (
            <span key={c.id}>
              <span className="font-black">{locale === 'es' ? c.name_es : c.name_en}</span>
              <span className="font-light"> | </span>
            </span>
          ))}
        </TextSlider>
      </section>
      <motion.section
        key={`info-${projectSlug}`}
        className='w-full lg:w-[40%] lg:h-[calc(100dvh-5rem)] lg:overflow-y-auto scrollbar-thin bg-zinc-300 text-zinc-800 flex-row justify-center items-center px-11 flex py-14 lg:pt-8 lg:pb-14'
        style={{ viewTransitionName: 'project-info' }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" as const, damping: 30, stiffness: 200, delay: 0.15 }}
      >
        <div className='my-auto w-full overflow-hidden'>
          <ProjectNavigation projectSlug={projectSlug} />
          <div className='border-l px-5 border-zinc-800 flex flex-col '>
            <h1 className='text-stone-900 text-3xl font-black uppercase '>
              {title}
            </h1>
            <p className='my-3 text-justify text-base font-medium mt-2 whitespace-pre-wrap '>
              {about}
            </p>
            <div className='mt-1 flex flex-wrap gap-2 items-center align-middle justify-left '>
              <h2 className='text-zinc-800 text-xs font-bold uppercase  '>
                {project.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${locale}/projects?category=${category.slug}&page=1`}
                    className='bg-zinc-800/10 hover:bg-zinc-800/30 text-zinc-600 text-xs font-semibold mr-2 px-2.5 py-0.5 first:mt-0 mt-2 rounded border border-zinc-600 inline-flex items-center justify-center'
                  >
                    {locale === 'es' ? category.name_es : category.name_en}
                  </Link>
                ))}
              </h2>
            </div>
          </div>
          <div className='my-3 mt-5 max-h-[40vh] overflow-y-auto pr-2'>
            <p className='text-justify text-sm font-medium whitespace-pre-wrap'>
              {description}
            </p>
          </div>
          {project.urls && project.urls.length > 0 && (
            <div>
              {project.urls.map((item) => (
                <div
                  className='flex flex-wrap gap-2 items-center align-middle justify-left mb-2'
                  key={item.name}
                >
                  <p className='text-sm font-bold '>{item.name}</p>
                  {item.active ? (
                    <>
                      <Link
                        href={item.url}
                        className=' inline-flex items-center rounded-md bg-gray-400/40 px-2 py-1 text-xs font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10'
                        target='_blank'
                      >
                        {item.url}
                      </Link>
                      {item.fallback && (
                        <p className='text-xs text-red-700'>{item.fallback}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <span className=' cursor-default inline-flex items-center rounded-md bg-gray-400/40 px-2 py-1 text-xs font-bold text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                        {item.url}
                      </span>
                      <p className='text-xs text-red-700'>{item.fallback}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className='flex flex-wrap gap-2 items-center align-middle justify-left my-'>
            <p className='text-sm font-bold '>Etiquetas:</p>
            {project.tags && project.tags.length > 0 &&
              project.tags.map((tag) => (
                <span
                  key={tag}
                  className='cursor-default inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'
                >
                  #{tag}
                </span>
              ))}
          </div>
          <div className='mt-5 flex flex-col gap-3'>
            <p className='text-sm font-bold'>{locale === 'es' ? 'Compartir:' : 'Share:'}</p>
            <button
              onClick={() => {
                const url = window.location.href;
                const shareText = locale === 'es'
                  ? `Mira el trabajo de Alkitu: ${title}`
                  : `Check out Alkitu's work: ${title}`;
                window.open(
                  `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
                  '_blank',
                  'noopener,noreferrer,width=600,height=400'
                );
              }}
              className='w-9 h-9 bg-zinc-800 hover:bg-zinc-900 text-white rounded-full flex items-center justify-center transition-colors'
              aria-label={locale === 'es' ? 'Compartir en X' : 'Share on X'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default ProjectPageClient;
