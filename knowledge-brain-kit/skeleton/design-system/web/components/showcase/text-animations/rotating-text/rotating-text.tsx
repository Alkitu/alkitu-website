"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

interface RotatingTextProps {
    /**
     * List of words to rotate through
     */
    words: string[];

    /**
     * Classes for the container
     */
    className?: string;

    /**
     * How long each word stays visible (in ms)
     */
    duration?: number;

    /**
     * Framer motion transition configuration
     */
    transition?: any;
}

export function RotatingText({
    words,
    className,
    duration = 2000,
    transition = { type: "spring", damping: 20, stiffness: 100 },
}: RotatingTextProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!words || words.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, duration);
        return () => clearInterval(interval);
    }, [words, duration]);

    if (!words || words.length === 0) return null;

    return (
        <div className={cn("inline-flex relative overflow-hidden", className)}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={index}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={transition}
                    className="inline-block whitespace-nowrap"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}
