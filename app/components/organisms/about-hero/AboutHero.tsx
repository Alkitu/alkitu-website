"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { PageHeader } from "../page-header";

type AboutHeroProps = {
  dictionary: any;
};

export default function AboutHero({ dictionary }: AboutHeroProps) {
  const { title, text, founders, greeting, agency } = dictionary.about.hero;

  return (
    <TailwindGrid>
      <div className="col-span-full lg:col-start-2 lg:col-span-11 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 my-12 md:my-20">

        {/* Left Column: Text & Founders */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <PageHeader
            title={
              <>
                {greeting} <span className="text-primary">{agency}</span>
              </>
            }
            subtitle={title}
            text={text}
            align="left"
            disableGridWrapper
            className="mb-12"
          />

          {/* Founders Section - Updated styling */}
          <div className="flex flex-row gap-8 justify-center lg:justify-start items-center">
            {founders && founders.map((founder: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl mb-3 relative group">
                  {/* Placeholder logic for circular images */}
                  <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 768px) 96px, 128px"
                    priority={index === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="header-tertiary text-zinc-900 dark:text-white">{founder.name}</h3>
                <p className="text-sm text-primary font-medium uppercase tracking-wide">{founder.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1 w-full"
        >
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <Image
              src="/images/about/Alkitu-Fundadores-Trabajando.jpg"
              alt="Fundadores Alkitu Trabajando"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

      </div>
    </TailwindGrid>
  );
}
