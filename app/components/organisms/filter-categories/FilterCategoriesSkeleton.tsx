"use client";
import { motion } from "framer-motion";

// Fixed widths to avoid hydration mismatch
const SKELETON_WIDTHS = [120, 95, 110, 130, 100];

export default function FilterCategoriesSkeleton() {
  return (
    <motion.div
      className="h-12 flex justify-center overflow-hidden relative w-screen items-center content-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-12 flex flex-row justify-center items-center text-center gap-2">
        {/* "All" button skeleton */}
        <div className="w-20 h-10 bg-muted animate-pulse rounded-full" />

        {/* Category buttons skeletons - simulate 4-6 categories */}
        {SKELETON_WIDTHS.map((width, index) => (
          <div
            key={index}
            className="h-10 bg-muted animate-pulse rounded-full"
            style={{
              width: `${width}px`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
