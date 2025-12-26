"use client";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { useMotionValue, motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { useScreenWidth, useElementWidth } from "@/app/hooks";
import type { Category } from "@/lib/types";

type FilterCategories_Props = {
  search: string;
  className: string;
  setCurrentPage: (search: number) => void;
  setSearch: (search: string) => void;
  categories?: Category[];
  locale: string;
};

export default function FilterCategories({
  search,
  setSearch,
  className,
  setCurrentPage,
  categories = [],
  locale: localeProp,
}: FilterCategories_Props) {
  const { translations } = useTranslationContext();
  const locale = localeProp;
  const categoriesRef = useRef(null);
  const screenWidth = useScreenWidth();
  const categoriesWidth = useElementWidth(categoriesRef);
  const [draggable, setDraggable] = useState(false);
  const x = useMotionValue(0);

  // Calculate drag constraints dynamically based on current dimensions
  const dragConstraints = useMemo(() => {
    if (!draggable || !categoriesWidth || !screenWidth) {
      return { left: 0, right: 0 };
    }

    // Account for the 10% padding on left side when draggable
    const paddingLeft = screenWidth * 0.1;
    const availableWidth = screenWidth - paddingLeft;

    // Left constraint is negative (how far it can scroll left)
    const leftLimit = -(categoriesWidth - availableWidth);

    return {
      left: leftLimit < 0 ? leftLimit : 0,
      right: 0
    };
  }, [draggable, categoriesWidth, screenWidth]);

  useEffect(() => {
    // Only calculate when we have valid measurements
    // categoriesWidth will be null initially until ResizeObserver measures the element
    if (categoriesWidth === null || categoriesWidth === 0) {
      return;
    }

    // Draggable should be true when categories are wider than screen
    const shouldBeDraggable = categoriesWidth > screenWidth;

    if (shouldBeDraggable !== draggable) {
      setDraggable(shouldBeDraggable);
      // Reset position when draggable state changes
      x.set(0);
    }

    console.log(
      "screenWidth:",
      screenWidth,
      "categoriesWidth:",
      categoriesWidth,
      "draggable:",
      shouldBeDraggable
    );
  }, [categoriesWidth, screenWidth, categories.length]);

  // Adjust position when constraints change to prevent going out of bounds
  useEffect(() => {
    if (!draggable) return;

    const currentX = x.get();
    const { left, right } = dragConstraints;

    // If current position is beyond the new constraints, adjust it
    if (currentX < left) {
      x.set(left);
    } else if (currentX > right) {
      x.set(right);
    }
  }, [dragConstraints, draggable, x]);

  const handleClick = (event) => {
    const { id } = event.currentTarget;
    setSearch(id);
    setCurrentPage(1);
  };

  return (
    <>
      <motion.div
        className={`${
          draggable ? "justify-start" : "justify-center"
        } h-12 flex  overflow-hidden relative w-screen items-center content-center  ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {draggable === true && (
          <div className='absolute z-30 right-0 top-0 w-full flex justify-between  pointer-events-none opacity-90'>
            <div className='w-[20%] from-background via-background via-10% md:via-10% to-transparent to-80% md:to-20% bg-linear-to-r h-12 pointer-events-none' />
            <div className='w-[20%] from-background via-background via-10% md:via-10% to-transparent to-80% md:to-20% bg-linear-to-l h-12 pointer-events-none' />
          </div>
        )}
        <motion.div
          ref={categoriesRef}
          drag={draggable ? "x" : false}
          dragConstraints={dragConstraints}
          dragElastic={0}
          style={{ x, cursor: draggable ? "grab" : "default" }}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          id='categories'
          className={`h-12 flex flex-row justify-start items-center text-center  relative   ${
            draggable ? "self-start pl-[10%]" : "self-center"
          } `}
          onDragEnd={(_event, info) => {
            if (info.offset.x >= (categoriesWidth ?? 0)) {
              alert("yes");
            }
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          <Link
            href={`/${locale}/projects?category=All&page=1`}
            className={`w-20 ml-8 mr-2 whitespace-nowrap ${
              search === "All"
                ? "transition-all text-primary border-primary border font-normal tracking-wider rounded-full py-2 px-4 uppercase"
                : "transition-all hover:text-primary hover:border-primary border-foreground border text-foreground font-normal tracking-wider rounded-full py-2 px-4  uppercase"
            }`}
            id='All'
            onClick={handleClick}
          >
            All
          </Link>

          {categories.map((category: Category) => {
            const categoryName = locale === 'es' ? category.name_es : category.name_en;
            // Replace underscores with spaces for display
            const displayName = categoryName.replace(/_/g, ' ');

            return (
              <Link
                href={`/${locale}/projects?category=${category.slug}&page=1`}
                key={category.id}
                className={`mx-2 last:mr-8 flex items-center whitespace-nowrap ${
                  search === category.slug
                    ? "transition-all text-primary border-primary border font-normal tracking-wider rounded-full py-2 px-4 uppercase "
                    : "transition-all hover:text-primary hover:border-primary border-foreground border text-foreground font-normal tracking-wider rounded-full py-2 px-4  uppercase"
                }`}
                id={category.slug}
                onClick={handleClick}
              >
                {displayName}
              </Link>
            );
          })}
        </motion.div>
      </motion.div>
    </>
  );
}
