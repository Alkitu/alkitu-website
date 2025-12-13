"use client";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { useMotionValue, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useScreenWidth from "@/app/components/organisms/flex-carousel/hooks/useScreenWitdh";
import useElementWidth from "@/app/hooks/useElementWidth";

type FilterCategories_Props = {
  search: string;
  className: string;
  setCurrentPage: (search: number) => void;
  setSearch: (search: string) => void;
};

export default function FilterCategories({
  search,
  setSearch,
  className,
  setCurrentPage,
}: FilterCategories_Props) {
  const { translations, locale } = useTranslationContext();
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

    console.log(
      "screenWidth:",
      screenWidth,
      "categoriesWidth:",
      categoriesWidth,
      "draggable:",
      shouldBeDraggable
    );
  }, [categoriesWidth, screenWidth]);

  const handleClick = (event) => {
    const { id } = event.currentTarget;
    setSearch(id);
    setCurrentPage(1);
  };

  return (
    <>
      <motion.div
        ref={constraintsRef}
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
          dragConstraints={constraintsRef}
          dragElastic={0}
          style={{ x, cursor: draggable ? "grab" : "default" }}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          id='categories'
          className={`h-12 flex flex-row justify-start items-center text-center  relative   ${
            draggable ? "self-start pl-[10%]" : "self-center"
          } `}
          onDragEnd={(_event, info) => {
            if (info.offset.x >= categoriesWidth) {
              alert("yes");
            }
          }}
          whileDrag={{ cursor: "grabbing" }}
        >
          <Link
            href={`/${locale}/projects?category=All&page=1`}
            className={`w-20 ml-8 mr-2 ${
              search === "All"
                ? "transition-all text-primary border-primary border font-normal tracking-wider rounded-full py-2 px-4 uppercase"
                : "transition-all hover:text-primary hover:border-primary border-foreground border text-foreground font-normal tracking-wider rounded-full py-2 px-4  uppercase"
            }`}
            id='All'
            onClick={handleClick}
          >
            All
          </Link>

          {translations &&
            translations.portfolio.categories.map(
              (category: { name: string }) => {
                return (
                  <Link
                    href={`/${locale}/projects?category=${category.name}&page=1`}
                    key={category.name}
                    className={`mx-2 last:mr-8 flex items-center ${
                      search === category.name
                        ? "transition-all text-primary border-primary border font-normal tracking-wider rounded-full py-2 px-4 uppercase "
                        : "transition-all hover:text-primary hover:border-primary border-foreground border text-foreground font-normal tracking-wider rounded-full py-2 px-4  uppercase"
                    }`}
                    id={category.name}
                    onClick={handleClick}
                  >
                    {category.name
                      .split("")
                      .map((char: string, index: number) => {
                        if (char === "_") {
                          return (
                            <span key={index} className='text-transparent'>
                              {char}
                            </span>
                          );
                        }
                        return <span key={index}>{char}</span>;
                      })}
                  </Link>
                );
              }
            )}
        </motion.div>
      </motion.div>
    </>
  );
}
