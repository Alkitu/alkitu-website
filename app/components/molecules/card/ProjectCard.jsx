"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { useTranslationContext } from "@/app/context/TranslationContext";

const ProjectCard = ({ project, priority = false }) => {
  const { locale } = useTranslationContext();
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variants={itemVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      exit="hidden"
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="rounded-2xl overflow-hidden dark:bg-gray-700 "
    >
      <Link
        href={`/${locale}/projects/${project.url}`}
        className="group aspect-video w-full overflow-hidden rounded-2xl lg:opacity-75 hover:opacity-100 bg-gray-200 dark:bg-gray-700 relative"
        key={project.url}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full aspect-video bg-gray-300 rounded-2xl dark:bg-gray-700 animate-pulse">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600 animate-pulse"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          }
        >
          <div className="w-full h-full absolute bg-gray-700 top-0 left-0 -z-20"/>
          <Image
            src={project.image}
            width={1080}
            height={720}
            alt={project.title || "Project image"}
            className="w-full aspect-video object-cover object-center group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwODAlIiBoZWlnaHQ9IjcyMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg=="
          />
        </Suspense>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
