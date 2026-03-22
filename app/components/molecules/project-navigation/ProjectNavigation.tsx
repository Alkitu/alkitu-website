"use client";

import { useState, useEffect, useCallback } from "react";
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

function NavSkeleton({ align }: { align: 'start' | 'end' }) {
  return (
    <div className={`inline-flex flex-col ${align === 'end' ? 'items-end' : 'items-start'} gap-1.5`}>
      <div className="w-20 h-14 rounded bg-zinc-400/30 animate-pulse" />
      <div className="w-14 h-3 rounded bg-zinc-400/20 animate-pulse" />
    </div>
  );
}

export function ProjectNavigation({ projectSlug }: ProjectNavigationProps) {
  const { locale } = useTranslationContext();
  const [prev, setPrev] = useState<ProjectNeighbor | null>(null);
  const [next, setNext] = useState<ProjectNeighbor | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchNeighbors();
  }, [projectSlug]);

  const navigateTo = useCallback(
    (slug: string) => {
      const href = `/${locale}/projects/${slug}`;
      window.dispatchEvent(
        new CustomEvent('project-transition', { detail: { href } })
      );
    },
    [locale]
  );

  return (
    <nav className="flex justify-between items-start w-full mb-6 min-h-[5.5rem]">
      {/* Previous project */}
      <div className="flex-1">
        {loading ? (
          <NavSkeleton align="start" />
        ) : prev && (
          <button
            onClick={() => navigateTo(prev.slug)}
            className="group inline-flex flex-col items-start gap-1.5 cursor-pointer"
          >
            <motion.div
              className="relative w-20 h-14 rounded overflow-hidden border border-zinc-400/50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring" as const, damping: 20, stiffness: 300 }}
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
        {loading ? (
          <NavSkeleton align="end" />
        ) : next && (
          <button
            onClick={() => navigateTo(next.slug)}
            className="group inline-flex flex-col items-end gap-1.5 cursor-pointer"
          >
            <motion.div
              className="relative w-20 h-14 rounded overflow-hidden border border-zinc-400/50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring" as const, damping: 20, stiffness: 300 }}
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
