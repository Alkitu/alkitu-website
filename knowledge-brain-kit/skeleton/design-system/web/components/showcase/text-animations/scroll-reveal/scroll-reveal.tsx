"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "~/lib/utils";

interface ScrollRevealProps {
    /**
     * The text
     */
    text: string;
    /**
     * Unrevealed color
     */
    baseOpacity?: number;
    className?: string;
}

export function ScrollReveal({
    text,
    baseOpacity = 0.2,
    className,
}: ScrollRevealProps) {
    const ref = useRef<HTMLParagraphElement>(null);
    const words = text.split(" ");

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 50%"],
    });

    return (
        <p ref={ref} className={cn("flex flex-wrap gap-x-2", className)}>
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                    <Word
                        key={i}
                        word={word}
                        progress={scrollYProgress}
                        range={[start, end]}
                        baseOpacity={baseOpacity}
                    />
                );
            })}
        </p>
    );
}

function Word({
    word,
    progress,
    range,
    baseOpacity,
}: {
    word: string;
    progress: any;
    range: [number, number];
    baseOpacity: number;
}) {
    const characters = word.split("");
    const step = (range[1] - range[0]) / characters.length;

    return (
        <span className="relative inline-block mt-2">
            {characters.map((char, i) => {
                const start = range[0] + step * i;
                const end = range[0] + step * (i + 1);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const opacity = useTransform(progress, [start, end], [baseOpacity, 1]);

                return (
                    <motion.span key={i} style={{ opacity }}>
                        {char}
                    </motion.span>
                );
            })}
        </span>
    );
}
