'use client';

import { useMotionValue, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useScreenWidth from "@/app/components/organisms/flex-carousel/hooks/useScreenWitdh";
import useElementWidth from "@/app/hooks/useElementWidth";

interface FilterButton {
  id: string;
  label: string;
  value: string;
}

interface FilterButtonsProps {
  filters: FilterButton[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export default function FilterButtons({
  filters,
  activeFilter,
  onFilterChange,
  className = "",
}: FilterButtonsProps) {
  const categoriesRef = useRef(null);
  const constraintsRef = useRef(null);
  const screenWidth = useScreenWidth();
  const categoriesWidth = useElementWidth(categoriesRef);
  const [draggable, setDraggable] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    // Draggable should be true when categories are wider than screen
    const shouldBeDraggable = categoriesWidth > screenWidth;

    if (shouldBeDraggable !== draggable) {
      setDraggable(shouldBeDraggable);
      // Reset position when draggable state changes
      x.set(0);
    }
  }, [categoriesWidth, screenWidth, draggable, x]);

  const handleClick = (filterValue: string) => {
    onFilterChange(filterValue);
  };

  return (
    <motion.div
      ref={constraintsRef}
      className={`${
        draggable ? "justify-start" : "justify-center"
      } h-12 flex overflow-hidden relative w-screen items-center content-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {draggable === true && (
        <div className='absolute z-30 right-0 top-0 w-full flex justify-between pointer-events-none opacity-90'>
          <div className='w-[20%] from-background via-background via-10% md:via-10% to-transparent to-80% md:to-20% bg-linear-to-r h-12 pointer-events-none' />
          <div className='w-[20%] from-background via-background via-10% md:via-10% to-transparent to-80% md:to-20% bg-linear-to-l h-12 pointer-events-none' />
        </div>
      )}
      <motion.div
        ref={categoriesRef}
        drag={draggable ? "x" : false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        style={{ x, cursor: draggable ? "grab" : "default" }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        className={`h-12 flex flex-row justify-start items-center text-center relative ${
          draggable ? "self-start pl-[10%]" : "self-center"
        }`}
        whileDrag={{ cursor: "grabbing" }}
      >
        {filters.map((filter, index) => (
          <button
            key={filter.id}
            className={`${index === 0 ? 'ml-8' : ''} mx-2 last:mr-8 flex items-center ${
              activeFilter === filter.value
                ? "transition-all text-primary border-primary border font-normal tracking-wider rounded-full py-2 px-4 uppercase hover:text-black"
                : "transition-all hover:text-primary hover:border-primary border-foreground border text-foreground font-normal tracking-wider rounded-full py-2 px-4 uppercase"
            }`}
            onClick={() => handleClick(filter.value)}
          >
            {filter.label.split("").map((char: string, charIndex: number) => {
              if (char === "_") {
                return (
                  <span key={charIndex} className='text-transparent'>
                    {char}
                  </span>
                );
              }
              return <span key={charIndex}>{char}</span>;
            })}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
