'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { ArrowButton } from "@/app/components/molecules/arrow-button";

export interface MediaItem {
  type: 'image' | 'youtube';
  url: string;
  title?: string;
}

interface MediaCarouselProps {
  numbers?: boolean;
  bullets?: boolean;
  thumbnails?: boolean;
  hideThumbnails?: boolean;
  arrows?: boolean;
  className?: string;
  mediaArray: MediaItem[];
  longCard?: boolean;
  projectId?: string;
}

// Utility function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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

export default function MediaCarousel({
  numbers,
  bullets,
  thumbnails,
  hideThumbnails = false,
  arrows,
  className = '',
  mediaArray,
  longCard,
  projectId,
}: MediaCarouselProps) {
  const [page, setPage] = useState(initialIndex);
  const media = mediaArray;
  const paginationBullets = bullets || false;
  const paginationNumbers = numbers || false;
  const paginationArrows = (arrows || false) && media.length > 1;
  const paginationThumbnails = !hideThumbnails && (thumbnails || false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleClickAfter = useCallback(() => {
    if (page >= media.length - 1) {
      setPage(initialIndex);
    } else {
      setPage((prevCount) => prevCount + 1);
    }
  }, [media.length, page]);

  const handleClickBefore = useCallback(() => {
    if (page <= 0) {
      setPage(media.length - 1);
    } else {
      setPage((prevCount) => prevCount - 1);
    }
  }, [media.length, page]);

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
          {media &&
            media.map((item, index) => {
              const isCurrent = index === page;
              const direction = index - page;

              return (
                <motion.div
                  className='absolute h-full w-full rounded-lg md:rounded-xl lg:rounded-3xl top-0'
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial={!isCurrent ? "enter" : "center"}
                  animate={isCurrent ? "center" : "exit"}
                  exit='exit'
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {item.type === 'youtube' ? (
                    <div className="relative w-full h-full">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg md:rounded-xl lg:rounded-3xl"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
                        title={item.title || 'YouTube video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <Image
                      width={1080}
                      height={720}
                      alt={item.title || item.url}
                      ref={imageRef}
                      src={item.url}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      className={`pointer-events-none top-0 h-full w-full ${
                        longCard
                          ? "absolute object-scale-down"
                          : "absolute object-cover rounded-lg md:rounded-xl lg:rounded-3xl"
                      }`}
                    />
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>
        {paginationArrows && (
          <>
            {/* Next Arrow */}
            <button
              className='group absolute right-3 top-1/2 -translate-y-1/2 z-50
                         w-12 h-12 md:w-14 md:h-14
                         flex items-center justify-center
                         bg-background/80 dark:bg-background/60 backdrop-blur-sm
                         rounded-full shadow-lg
                         border border-border/50
                         hover:bg-background/95 hover:scale-110 hover:shadow-xl
                         active:scale-95
                         transition-all duration-200 ease-out
                         cursor-pointer select-none'
              onClick={handleClickAfter}
              aria-label="Next slide"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5 md:w-6 md:h-6 text-primary group-hover:translate-x-0.5 transition-transform'
                viewBox='0 0 6.52 11.15'
                fill='none'
              >
                <path
                  d='m.43.43l5.43,4.69c.3.26.3.72,0,.98L.43,10.71'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.2px'
                />
              </svg>
            </button>

            {/* Previous Arrow */}
            <button
              className='group absolute left-3 top-1/2 -translate-y-1/2 z-50
                         w-12 h-12 md:w-14 md:h-14
                         flex items-center justify-center
                         bg-background/80 dark:bg-background/60 backdrop-blur-sm
                         rounded-full shadow-lg
                         border border-border/50
                         hover:bg-background/95 hover:scale-110 hover:shadow-xl
                         active:scale-95
                         transition-all duration-200 ease-out
                         cursor-pointer select-none'
              onClick={handleClickBefore}
              aria-label="Previous slide"
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5 md:w-6 md:h-6 text-primary group-hover:-translate-x-0.5 transition-transform rotate-180'
                viewBox='0 0 6.52 11.15'
                fill='none'
              >
                <path
                  d='m.43.43l5.43,4.69c.3.26.3.72,0,.98L.43,10.71'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.2px'
                />
              </svg>
            </button>
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
            {media.map((item, index) => {
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
          <div className='flex px-5 self-center justify-self-center place-self-center content-center justify-center my-4 flex-wrap lg:flex-nowrap'>
            {media.map((item, index) => {
              const isCurrent = index === page;
              const thumbnailUrl = item.type === 'youtube'
                ? getYouTubeThumbnail(getYouTubeVideoId(item.url) || '')
                : item.url;

              return (
                <div
                  className='mx-2 my-2 cursor-pointer aspect-video flex self-center justify-self-center place-self-center content-center justify-center relative min-w-[10%] lg:min-w-[0%] max-w-[20%] lg:max-w-none'
                  onClick={() => setPage(index)}
                  key={index}
                >
                  <div className='w-full h-full absolute top-0 left-0 animate-pulse opacity-25 bg-gray-700 -z-20' />
                  <Image
                    width={300}
                    height={300}
                    alt={item.title || item.url}
                    src={thumbnailUrl}
                    loading="lazy"
                    className={`w-full h-full rounded lg:rounded-md object-cover border-2 transition-all duration-300 ${
                      isCurrent
                        ? "border-primary"
                        : "border-white/50 hover:border-primary"
                    }`}
                  />
                  {item.type === 'youtube' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-90">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <ArrowButton
            handleClickBefore={handleClickBefore}
            handleClickAfter={handleClickAfter}
          />
          <ArrowButton
            left
            handleClickBefore={handleClickBefore}
            handleClickAfter={handleClickAfter}
          />
        </div>
      )}

      {paginationNumbers && (
        <>
          <div className='flex content-center justify-center w-full'>
            <div className='mr-2'>{page + 1}</div>
            <div className=''>/ </div>
            <div className='ml-2'>{media.length}</div>
          </div>
        </>
      )}
    </div>
  );
}
