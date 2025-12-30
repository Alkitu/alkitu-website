"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

type AboutTeamProps = {
  dictionary: {
    about: {
      team: {
        title: string;
        members: TeamMember[];
      };
    };
  };
};

export default function AboutTeam({ dictionary }: AboutTeamProps) {
  const { title, members } = dictionary.about.team;

  return (
    <TailwindGrid>
      <div className="col-span-full lg:col-start-2 lg:col-span-11 py-16">
         <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 md:px-12 py-4 mb-12 shadow-sm relative">
            <h2 className="header-section text-center uppercase tracking-widest dark:text-white text-zinc-800 dark:text-200">
                {title}
            </h2>
             {/* Decorative lines often seen in the design */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-20" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center group"
                >
                    <div className="relative w-full aspect-3/4 overflow-hidden rounded-lg mb-4 shadow-md bg-zinc-100 dark:bg-zinc-800">
                        {/* Placeholder logic */}
                         <div className="absolute inset-0 flex items-center justify-center text-zinc-300 font-bold text-4xl">?</div>
                        <Image 
                            src={member.image} 
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <h3 className="header-tertiary text-zinc-900 dark:text-zinc-100">{member.name}</h3>
                    <p className="text-primary font-medium text-[min(1rem,3.16vw)] lg:text-[1vw] uppercase tracking-wide">{member.role}</p>
                </motion.div>
            ))}
         </div>
      </div>
    </TailwindGrid>
  );
}
