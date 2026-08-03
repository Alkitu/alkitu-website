"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface TrueFocusProps {
    /**
     * The text to display with focus effect
     */
    sentence?: string;

    /**
     * The index of the initially focused word
     */
    manualMode?: boolean;

    /**
     * Focus index when manually controlled
     */
    focusIndex?: number;

    /**
     * Custom blurry amount
     */
    blurAmount?: number;

    /**
     * Color of the focused word
     */
    focusColor?: string;

    /**
     * Animation speed
     */
    animationDuration?: number;

    /**
     * Gap between words
     */
    gap?: string;

    /**
     * Optional custom classes
     */
    className?: string;

    /**
     * Whether to enable the focus box bounding rect
     */
    showFocusBox?: boolean;
}

export function TrueFocus({
    sentence = "Focus on what matters",
    manualMode = false,
    focusIndex = 0,
    blurAmount = 4,
    focusColor = "var(--primary)",
    animationDuration = 0.4,
    gap = "1rem",
    className,
    showFocusBox = true,
}: TrueFocusProps) {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState(focusIndex);
    const containerRef = useRef<HTMLDivElement>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusRect, setFocusRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

    useEffect(() => {
        if (manualMode) setCurrentIndex(focusIndex);
    }, [manualMode, focusIndex]);

    useEffect(() => {
        if (!showFocusBox || !wordRefs.current[currentIndex] || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const wordRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

        setFocusRect({
            x: wordRect.left - containerRect.left,
            y: wordRect.top - containerRect.top,
            w: wordRect.width,
            h: wordRect.height,
        });
    }, [currentIndex, showFocusBox]);

    const handleMouseEnter = (index: number) => {
        if (!manualMode) setCurrentIndex(index);
    };

    const handleMouseLeave = () => {
        if (!manualMode) setCurrentIndex(-1); // Remove focus when mouse leaves completely
    };

    return (
        <div
            ref={containerRef}
            className={cn("flex flex-wrap relative cursor-pointer", className)}
            style={{ gap }}
            onMouseLeave={handleMouseLeave}
        >
            {words.map((word, i) => {
                const isActive = i === currentIndex;
                // If nothing is focused, show all words normally (or blurred, depending on design)
                // Usually true focus blurs non-focused words *only* when something is focused.
                const isHoveringAny = currentIndex !== -1;

                return (
                    <motion.span
                        key={i}
                        ref={(el) => {
                            wordRefs.current[i] = el;
                        }}
                        onMouseEnter={() => handleMouseEnter(i)}
                        animate={{
                            filter: isHoveringAny && !isActive ? `blur(${blurAmount}px)` : "blur(0px)",
                            opacity: isHoveringAny && !isActive ? 0.6 : 1,
                            color: isActive ? focusColor : "var(--foreground)",
                        }}
                        transition={{
                            duration: animationDuration,
                        }}
                        className="text-4xl font-bold tracking-tighter"
                    >
                        {word}
                    </motion.span>
                );
            })}

            {showFocusBox && currentIndex !== -1 && (
                <motion.div
                    className="absolute border-2 border-[var(--primary)] rounded-md pointer-events-none"
                    animate={{
                        x: focusRect.x - 8,
                        y: focusRect.y - 4,
                        width: focusRect.w + 16,
                        height: focusRect.h + 8,
                        opacity: 1,
                    }}
                    initial={{ opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        mass: 0.5,
                    }}
                />
            )}
        </div>
    );
}
