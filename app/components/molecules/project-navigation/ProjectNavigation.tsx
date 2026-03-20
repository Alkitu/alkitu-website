"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { motion } from "framer-motion";

interface ProjectNeighbor {
  slug: string;
  title_en: string;
  title_es: string;
  image: string;
}

interface ProjectNavigationProps {
  projectSlug: string;
}

export function ProjectNavigation({ projectSlug }: ProjectNavigationProps) {
  const { locale } = useTranslationContext();
  const router = useRouter();
  const [prev, setPrev] = useState<ProjectNeighbor | null>(null);
  const [next, setNext] = useState<ProjectNeighbor | null>(null);

  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        const response = await fetch(`/api/projects/${projectSlug}/neighbors`);
        const data = await response.json();
        if (data.success) {
          setPrev(data.data.prev);
          setNext(data.data.next);
        }
      } catch (err) {
        console.error("Error fetching project neighbors:", err);
      }
    };

    fetchNeighbors();
  }, [projectSlug]);

  const navigateTo = useCallback(
    (slug: string, direction: "prev" | "next") => {
      const href = `/${locale}/projects/${slug}`;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      };

      if (doc.startViewTransition) {
        // Set direction class for CSS to pick up
        document.documentElement.classList.add(`vt-${direction}`);

        const transition = doc.startViewTransition(() => {
          router.push(href);
        });

        transition.finished.then(() => {
          document.documentElement.classList.remove(`vt-${direction}`);
        });
      } else {
        router.push(href);
      }
    },
    [locale, router]
  );

  if (!prev && !next) return null;

  return (
    <nav className="flex justify-between items-start w-full mb-6">
      {/* Previous project */}
      <div className="flex-1">
        {prev && (
          <button
            onClick={() => navigateTo(prev.slug, "prev")}
            className="group inline-flex flex-col items-start gap-1.5 cursor-pointer"
          >
            <motion.div
              className="relative w-20 h-14 rounded overflow-hidden border border-zinc-400/50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Image
                src={prev.image}
                alt={locale === "es" ? prev.title_es : prev.title_en}
                fill
                className="object-cover group-hover:brightness-110 transition-all"
                sizes="80px"
              />
            </motion.div>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-800 transition-colors flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              {locale === "es" ? "Anterior" : "Previous"}
            </span>
          </button>
        )}
      </div>

      {/* Next project */}
      <div className="flex-1 flex justify-end">
        {next && (
          <button
            onClick={() => navigateTo(next.slug, "next")}
            className="group inline-flex flex-col items-end gap-1.5 cursor-pointer"
          >
            <motion.div
              className="relative w-20 h-14 rounded overflow-hidden border border-zinc-400/50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <Image
                src={next.image}
                alt={locale === "es" ? next.title_es : next.title_en}
                fill
                className="object-cover group-hover:brightness-110 transition-all"
                sizes="80px"
              />
            </motion.div>
            <span className="text-xs text-zinc-500 group-hover:text-zinc-800 transition-colors flex items-center gap-1">
              {locale === "es" ? "Siguiente" : "Next"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
