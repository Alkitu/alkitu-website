"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

function SideBar({ text }) {
  const dataSections = text?.home?.sections || [];
  const [hoveredSection, setHoveredSection] = useState(null);
  const [activeSection, setActiveSection] = useState(dataSections[0] || null);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const yOffset = window.innerHeight / 2;
      const targetTop = target.offsetTop + target.clientHeight / 2;
      window.scrollTo({
        top: targetTop - yOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!dataSections || dataSections.length === 0) return;

    const handleScroll = () => {
      let closestDistance = Infinity;
      let closestSection = null;

      dataSections.forEach((section) => {
        const target = document.getElementById(section.id);

        if (target) {
          const rect = target.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(window.innerHeight / 2 - sectionCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section; // Guardar el objeto section, no el elemento DOM
          }
        }
      });

      setActiveSection(closestSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dataSections]);

  if (!dataSections || dataSections.length === 0) return null;

  return (
    <div className="col-span-1 col-start-1 col-end-2 h-dvh fixed w-1/12  top-0 z-40 border-r box-border border-border bg-background/40 backdrop-blur-lg bg-clip-padding backdrop-filter opacity-75 hidden lg:block">
      <ul className="w-full h-full z-40 flex items-center   justify-center flex-col gap-y-10">
        {dataSections.map((section, index) => (
          <li
            key={index}
            onClick={() => scrollToSection(section.id)}
            className="relative cursor-pointer mt-2 first:mt-0 flex items-center justify-start mx-auto"
          >
            <svg
              className={`${
                activeSection && activeSection.id === section.id
                  ? "fill-primary w-3 h-3"
                  : "fill-foreground dark:fill-white w-2 h-2"
              } hover:fill-primary hover:scale-125 transition-all duration-300 cursor-pointer`}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <circle cx="50%" cy="50%" r="50%" />
            </svg>
            <AnimatePresence>
              {hoveredSection === section.id && (
                <motion.div
                  className="text-foreground text-sm text-left flex absolute left-4 bg-card dark:bg-zinc-700 px-2 py-1 rounded-md z-50 opacity-100"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {section.name}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
