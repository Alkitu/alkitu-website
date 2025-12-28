"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";

type AboutOriginProps = {
  dictionary: any;
};

export default function AboutOrigin({ dictionary }: AboutOriginProps) {
  const { title, p1, p2, p3 } = dictionary.about.origin;

  return (
    <div className="w-full bg-zinc-950 py-24 -mt-12 text-white">
      <TailwindGrid>
            <div className="col-span-full lg:col-start-2 lg:col-span-11">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Media Content - Swapped to Left */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative w-full aspect-4/5 lg:aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group">
                             {/* Decorative Element */}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -z-10" />
                             
                             <video 
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster="/images/about/Alkitu-fundadores-cac.webp"
                             >
                                <source src="/video/Alkitu-CAC.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                             </video>
                             
                             {/* Overlay gradient */}
                             <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Text Content - Swapped to Right */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 order-1 lg:order-2"
                    >
                        <h2 className="header-section text-white leading-tight relative inline-block">
                            {title}
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: "33%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute -bottom-2 left-0 h-1 bg-primary rounded-full" 
                            />
                        </h2>
                        <div className="space-y-6 text-body-inverse text-zinc-300 leading-relaxed text-justify">
                            <p>{p1}</p>
                            <p>{p2}</p>
                            <p>{p3}</p>
                        </div>
                    </motion.div>

                </div>
            </div>
      </TailwindGrid>
    </div>
  );
}
