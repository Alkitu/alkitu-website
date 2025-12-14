"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";

type PrincipleItem = {
  title: string;
  description: string;
  icon: string;
};

type MissionVisionItem = {
    title: string;
    description: string;
};

type AboutPrinciplesProps = {
  dictionary: {
    about: {
      principles: {
        title: string;
        items: PrincipleItem[];
      };
      missionVision: {
        items: MissionVisionItem[];
      };
    };
  };
};

export default function AboutPrinciples({ dictionary }: AboutPrinciplesProps) {
  const { title, items: principles } = dictionary.about.principles;
  const { items: missionVisionItems } = dictionary.about.missionVision;

  return (
    <div className="w-full flex flex-col">

      {/* SECTION 2: MISSION & VISION (White/Light Background) */}
      <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900 ">
          <TailwindGrid>
             <div className="col-span-full lg:col-start-2 lg:col-span-11">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                     {missionVisionItems.map((item, index) => (
                         <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 p-10 shadow-xl flex flex-col items-center text-center relative overflow-hidden group"
                         >
                             {/* Top Green Line */}
                             <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent absolute top-0 left-0 opacity-50 group-hover:opacity-100 transition-opacity" />

                             <h3 className="text-4xl font-bold mb-6 text-zinc-900 dark:text-white">{item.title}</h3>
                             
                             {/* Underline */}
                             <div className="w-24 h-1 bg-green-500 mb-8 rounded-full" />

                             <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                 {item.description}
                             </p>
                         </motion.div>
                     ))}
                 </div>
             </div>
          </TailwindGrid>
      </section>


      {/* SECTION 1: VALUES (Dark Background) */}
      <section className="w-full bg-black py-24 text-white relative overflow-hidden">
         {/* Optional: Subtle gradient or shadow to match the 'glow' in the image if any */}
         
         <TailwindGrid>
            <div className="col-span-full lg:col-start-2 lg:col-span-11 relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block bg-white px-8 py-3 transform -skew-x-12 mb-8">
                         <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-widest transform skew-x-12">
                            {title}
                         </h2>
                    </div>
                </motion.div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {principles.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Icon Container - White Square with Glow */}
                            <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 duration-300">
                                <div className="relative w-24 h-24">
                                     <Image src={item.icon} alt={item.title} fill className="object-contain" />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            
                            {/* Green Separator Line */}
                            <div className="w-16 h-1 bg-green-500 mb-4 rounded-full" />

                            {/* Description */}
                            <p className="text-sm text-gray-300 leading-relaxed font-light">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
         </TailwindGrid>
      </section>


    </div>
  );
}
