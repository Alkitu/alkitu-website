"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/atoms/button";
import DomeGallery from "@/app/components/molecules/dome-gallery/DomeGallery";

type ServiceHeroProps = {
  title?: string;
  subtitle?: string;
  description?: React.ReactNode;
  cta?: string;
  lang?: string;
  galleryImages?: string[];
  children?: React.ReactNode;
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 200,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServiceHero({
  title,
  subtitle,
  description,
  cta,
  lang,
  galleryImages,
  children,
}: ServiceHeroProps) {
  const hasGallery = galleryImages && galleryImages.length > 0;

  return (
    <div className={`grid grid-cols-1 ${hasGallery ? "lg:grid-cols-2 gap-12 lg:gap-8 items-center" : ""}`}>
      <motion.header
        variants={heroVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={hasGallery ? "pt-12 lg:pt-0" : ""}
      >
        {subtitle && (
          <motion.p
            variants={contentVariants}
            className="text-primary font-medium uppercase tracking-wide text-sm mb-4"
          >
            {subtitle}
          </motion.p>
        )}
        {title && (
          <motion.h1
            variants={contentVariants}
            className={`font-black uppercase tracking-tight text-foreground mb-6 ${hasGallery ? "text-4xl md:text-5xl lg:text-6xl" : "text-5xl md:text-6xl lg:text-7xl"}`}
          >
            {title}
          </motion.h1>
        )}
        {description && (
          <motion.p
            variants={contentVariants}
            className={`text-foreground/80 leading-relaxed font-medium mb-10 ${hasGallery ? "text-base md:text-lg lg:text-xl lg:max-w-2xl" : "text-lg md:text-xl lg:text-2xl max-w-4xl"}`}
          >
            {description}
          </motion.p>
        )}
        {cta && lang && (
          <motion.div variants={contentVariants} className="mb-6 flex gap-4 flex-wrap">
            <Link href={`/${lang}/contact`}>
              <Button variant="primary" size="lg" className="min-w-[200px] text-lg">
                {cta}
              </Button>
            </Link>
          </motion.div>
        )}
        {children && (
          <motion.div variants={contentVariants}>
            {children}
          </motion.div>
        )}
      </motion.header>

      {hasGallery && (
        <motion.div
          variants={heroVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative w-[100vw] left-1/2 -translate-x-1/2 lg:w-auto lg:static lg:translate-x-0 h-[60vh] md:h-[70vh] lg:h-[calc(100vh-80px)] lg:-mt-32 lg:-mr-24 xl:-mr-40 lg:-mb-16 pointer-events-auto overflow-hidden lg:overflow-visible"
        >
          <div className="absolute inset-0 w-full h-full flex items-center justify-center -z-10 lg:z-0">
            <DomeGallery 
              images={galleryImages} 
              overlayBlurColor="rgb(var(--background))" 
              grayscale={true} 
              fit={1.0}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
