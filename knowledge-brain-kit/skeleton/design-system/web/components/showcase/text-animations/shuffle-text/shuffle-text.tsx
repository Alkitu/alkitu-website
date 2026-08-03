"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "~/lib/utils";

interface ShuffleTextProps {
    /**
     * Target text
     */
    text: string;
    /**
     * Hover mode or auto mount mode
     */
    trigger?: "hover" | "mount";
    /**
     * Duration in ms
     */
    duration?: number;
    /**
     * Delay in ms
     */
    delay?: number;
    /**
     * Optional custom classes
     */
    className?: string;
    /**
     * Shuffle iterations
     */
    iterations?: number;
}

export function ShuffleText({
    text,
    trigger = "hover",
    duration = 500,
    delay = 0,
    className,
    iterations = 10,
}: ShuffleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(() => {
        if (trigger === "mount") {
            const timeout = setTimeout(shuffle, delay);
            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger, delay]);

    function shuffle() {
        if (isShuffling) return;
        setIsShuffling(true);

        let currentIteration = 0;
        const interval = duration / iterations;

        const intervalId = setInterval(() => {
            setDisplayText(() => {
                const characters = text.split("");
                for (let i = characters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    // keep spaces where they are
                    if (characters[i] === " " || characters[j] === " ") continue;
                    [characters[i], characters[j]] = [characters[j], characters[i]];
                }
                return characters.join("");
            });

            currentIteration++;
            if (currentIteration >= iterations) {
                clearInterval(intervalId);
                setDisplayText(text);
                setIsShuffling(false);
            }
        }, interval);
    }

    return (
        <motion.span
            className={cn("inline-block", className)}
            onMouseEnter={() => trigger === "hover" && shuffle()}
            whileHover={trigger === "hover" ? { scale: 1.05 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {displayText}
        </motion.span>
    );
}
