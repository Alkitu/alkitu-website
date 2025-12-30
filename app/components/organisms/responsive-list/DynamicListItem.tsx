import { motion } from "framer-motion";
import { useState, useRef, useLayoutEffect } from "react";
import { RiveAnimation } from "@/app/components/molecules/rive-animation";

function DynamicListItem({ category, index, boxPositions, handleClick }) {
  const [hover, setHover] = useState(false);

  const glowVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 0.5 },
  };

  return (
    <>
      <motion.div
        layout
        transition={{
          type: "spring" as const,
          damping: 100,
          stiffness: 1000,
          mass: 0.1,
        }}
        style={{ order: boxPositions[index] }}
        className={`${
          boxPositions[index] === 1
            ? "col-span-full md:col-span-4 lg:col-span-5"
            : "col-span-full md:col-span-2 lg:col-span-3"
        } relative items-end flex px-4 text-center content-center justify-center cursor-pointer`}
        initial="initial"
        whileHover="hover"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onClick={() => {
          setHover(false);
          handleClick(index);
        }}
      >
        {/* Wrapper to allow glow to be positioned relative to the card size */}
        <div className="relative w-full">
        
          {/* Glow effect - Positioned absolutely to fill the wrapper */}
          <motion.div
            variants={glowVariants}
            className="absolute inset-0 rounded-3xl blur-xl bg-linear-to-b from-zinc-300 to-zinc-300 dark:from-primary dark:to-primary hidden lg:block"
            animate={{
              opacity: hover ? 0.5 : 0,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.1,
              opacity: { duration: 0.2 },
            }}
          />

          <div
            className={`w-full mx-auto relative bg-white dark:bg-zinc-900 shadow-xs shadow-zinc-200 dark:shadow-md dark:shadow-black border border-zinc-50 dark:border-transparent rounded-3xl flex-col content-center items-center justify-center
              ${
                boxPositions[index] === 1
                  ? "lg:min-h-68 py-[3.77rem] px-[2vw]"
                  : "h-fit py-11 px-[2vw]"
              }`}
          >
            <motion.div
              layout
              className={
                boxPositions[index] === 1
                  ? "h-56 max-h-full max-w-full aspect-square mx-auto "
                  : "h-32 max-h-full max-w-full aspect-square mx-auto mb-[1vw] "
              }
            >
              <RiveAnimation
                hover={hover}
                artboardName={category.artboardName}
                key={category.name}
              />
            </motion.div>
            <motion.div>
              <h3
                className={`${
                  boxPositions[index] === 1
                    ? "lg:text-[1.7vw]"
                    : "lg:text-[1.2vw] md:hidden lg:inline"
                } text-center  text-[6vw] md:text-[3.8vw] font-black uppercase m-auto w-full text-foreground`}
              >
                {category.name.split("").map((word, wordIndex) => {
                  if (word === "_") return <span key={wordIndex}> </span>;
                  return <span key={wordIndex}>{word}</span>;
                })}
              </h3>
              {boxPositions[index] === 1 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring" as const,
                    damping: 100,
                    stiffness: 1000,
                    mass: 0.1,
                    delay: 0.25,
                  }}
                  className='mx-auto text-center mt-5 px-10 max-w-full md:text-[1.6vw] lg:text-[1.4vw] 2xl:text-[1vw] font-normal tracking-tight text-foreground'
                >
                  {category.summary}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default DynamicListItem;
