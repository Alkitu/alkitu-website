'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ArrowButton } from "@/app/components/molecules/arrow-button";

function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="w-full h-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-10 h-10 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

interface CarouselProps {
  numbers?: boolean;
  bullets?: boolean;
  thumbnails?: boolean;
  arrows?: boolean;
  className?: string;
  immagesArray: string[];
  longCard?: boolean;
  projectId?: string;
}

const variants: Variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const initialIndex = 0;
const MAX_VISIBLE_THUMBNAILS = 5;

export default function Carousel({
  numbers,
  bullets,
  thumbnails,
  arrows,
  className = '',
  immagesArray,
  longCard,
  projectId,
}: CarouselProps) {
  const [page, setPage] = useState(initialIndex);
  const [thumbStart, setThumbStart] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [loadedThumbs, setLoadedThumbs] = useState<Set<number>>(new Set());
  const images = immagesArray;

  const handleImageLoaded = useCallback((index: number) => {
    setLoadedImages(prev => { const next = new Set(prev); next.add(index); return next; });
  }, []);

  const handleThumbLoaded = useCallback((index: number) => {
    setLoadedThumbs(prev => { const next = new Set(prev); next.add(index); return next; });
  }, []);
  const paginationBullets = bullets || false;
  const paginationNumbers = numbers || false;
  const paginationArrows = arrows || false;
  const paginationThumbnails = thumbnails || false;
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleClickAfter = useCallback(() => {
    if (page >= images.length - 1) {
      setPage(initialIndex);
    } else {
      setPage((prevCount) => prevCount + 1);
    }
  }, [images.length, page]);

  const handleClickBefore = useCallback(() => {
    if (page <= 0) {
      setPage(images.length - 1);
    } else {
      setPage((prevCount) => prevCount - 1);
    }
  }, [images.length, page]);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      handleClickAfter();
    }, 8000);
    return () => clearInterval(interval);
  }, [handleClickAfter, page, isHovering]);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setDimensions({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sync thumbnail window when active slide changes
  useEffect(() => {
    if (page < thumbStart) {
      setThumbStart(page);
    } else if (page >= thumbStart + MAX_VISIBLE_THUMBNAILS) {
      setThumbStart(page - MAX_VISIBLE_THUMBNAILS + 1);
    }
  }, [page, thumbStart]);

  const hasThumbNav = images.length > MAX_VISIBLE_THUMBNAILS;
  const visibleThumbs = images.slice(thumbStart, thumbStart + MAX_VISIBLE_THUMBNAILS);

  const handleThumbPrev = useCallback(() => {
    setThumbStart((prev) => Math.max(0, prev - 1));
  }, []);

  const handleThumbNext = useCallback(() => {
    setThumbStart((prev) => Math.min(images.length - MAX_VISIBLE_THUMBNAILS, prev + 1));
  }, [images.length]);

  return (
    <div className={`${className} max-w-full flex flex-col`}>
      <div
        className={`overflow-hidden rounded-lg md:rounded-xl lg:rounded-3xl shadow relative flex aspect-video ${
          longCard
            ? "max-h-[667px] h-[667px] justify-center content-start items-start"
            : "justify-center items-center"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className='w-full h-full absolute top-0 left-0 opacity-25 bg-gray-700 -z-20' />

        <AnimatePresence initial={false} custom={page}>
          {images &&
            images.map((image, index) => {
              const isCurrent = index === page;
              const direction = index - page;
              return (
                <motion.div
                  className='absolute h-full w-full rounded-lg md:rounded-xl lg:rounded-3xl top-0 cursor-grab'
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial={!isCurrent ? "enter" : "center"}
                  animate={isCurrent ? "center" : "exit"}
                  exit='exit'
                  transition={{
                    x: { type: "spring" as const, stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag='x'
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (offset.x > 50) {
                      handleClickAfter();
                    } else if (offset.x < -50) {
                      handleClickBefore();
                    }
                  }}
                  whileDrag={{ cursor: "grabbing" }}
                >
                  {!loadedImages.has(index) && (
                    <ImageSkeleton className="rounded-lg md:rounded-xl lg:rounded-3xl" />
                  )}
                  <Image
                    width={1080}
                    height={720}
                    alt={image}
                    ref={imageRef}
                    src={image}
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                    onLoad={() => handleImageLoaded(index)}
                    className={`pointer-events-none top-0 h-full w-full transition-opacity duration-300 ${
                      loadedImages.has(index) ? "opacity-100" : "opacity-0"
                    } ${
                      longCard
                        ? "absolute object-scale-down"
                        : "absolute object-cover rounded-lg md:rounded-xl lg:rounded-3xl"
                    }`}
                  />
                </motion.div>
              );
            })}
        </AnimatePresence>
        {paginationArrows && (
          <>
            <div
              className='justify-center items-center select-none cursor-pointer flex font-bold z-50 w-10 h-10 text-lg rounded-full absolute right-3 top-1/2'
              onClick={handleClickAfter}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-full h-full m-3'
                viewBox='0 0 6.52 11.15'
              >
                <path
                  d='m.43.43l5.43,4.69c.3.26.3.72,0,.98L.43,10.71'
                  stroke='#01ADE4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='0.86px'
                  fill='none'
                />
              </svg>
            </div>
            <div
              className='justify-center items-center select-none cursor-pointer flex font-bold z-50 w-10 h-10 text-lg rounded-full absolute left-3 top-1/2 -scale-100'
              onClick={handleClickBefore}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-full h-full m-3'
                viewBox='0 0 6.52 11.15'
              >
                <path
                  d='m.43.43l5.43,4.69c.3.26.3.72,0,.98L.43,10.71'
                  stroke='#01ADE4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='0.86px'
                  fill='none'
                />
              </svg>
            </div>
          </>
        )}
      </div>

      {paginationBullets && (
        <>
          <div
            style={{
              bottom: `calc(${(((1 / dimensions.width) * 1) / 0.85) * 10000}%)`,
            }}
            className={`flex self-center justify-self-center place-self-center content-center justify-center my-2 ${
              longCard && "absolute"
            }`}
          >
            {images.map((image, index) => {
              const isCurrent = index === page;
              return (
                <div
                  className={`w-2 h-2 rounded-full mx-2 my-0 cursor-pointer ${
                    isCurrent ? "bg-primary" : "bg-neutral-500"
                  }`}
                  onClick={() => setPage(index)}
                  key={index}
                />
              );
            })}
          </div>
        </>
      )}

      {paginationThumbnails && (
        <div className='relative flex items-center justify-center'>
          <div className='flex px-5 self-center justify-self-center place-self-center content-center justify-center my-4 flex-nowrap'>
            {Array.from({ length: Math.min(images.length, MAX_VISIBLE_THUMBNAILS) }).map((_, localIndex) => {
              const realIndex = thumbStart + localIndex;
              const image = images[realIndex];
              const isCurrent = realIndex === page;
              return (
                <div
                  className='mx-2 my-2 cursor-pointer aspect-video flex items-center justify-center relative min-w-[10%] lg:min-w-[0%] max-w-[20%] lg:max-w-none w-[20%] overflow-hidden rounded-md md:rounded-lg lg:rounded-xl'
                  onClick={() => setPage(realIndex)}
                  key={realIndex}
                >
                  {!loadedThumbs.has(realIndex) && (
                    <div className="absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md md:rounded-lg lg:rounded-xl" />
                  )}
                  {image && (
                    <Image
                      width={300}
                      height={300}
                      alt={image}
                      src={image}
                      loading="lazy"
                      onLoad={() => handleThumbLoaded(realIndex)}
                      className={`w-full h-full rounded-md md:rounded-lg lg:rounded-xl object-cover border-2 transition-all duration-300 ${
                        loadedThumbs.has(realIndex) ? "opacity-100" : "opacity-0"
                      } ${
                        isCurrent
                          ? "border-primary"
                          : "border-white/50 hover:border-primary"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {hasThumbNav && (
            <>
              <ArrowButton
                handleClickBefore={handleClickBefore}
                handleClickAfter={handleClickAfter}
              />
              <ArrowButton
                left
                handleClickBefore={handleClickBefore}
                handleClickAfter={handleClickAfter}
              />
            </>
          )}
        </div>
      )}

      {paginationNumbers && (
        <>
          <div className='flex content-center justify-center w-full'>
            <div className='mr-2'>{page + 1}</div>
            <div className=''>/ </div>
            <div className='ml-2'>{images.length}</div>
          </div>
        </>
      )}
    </div>
  );
}
