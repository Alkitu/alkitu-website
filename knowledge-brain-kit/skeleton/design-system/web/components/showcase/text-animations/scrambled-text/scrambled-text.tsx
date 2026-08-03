"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface ScrambledTextProps {
    /**
     * The text to display
     */
    text: string;
    /**
     * Character set used to scramble
     */
    characters?: string;
    /**
     * Scramble speed (in ms per frame)
     */
    speed?: number;
    /**
     * Delay before unscrambling finishes (in ms)
     */
    duration?: number;
    /**
     * Trigger on mount or hover
     */
    trigger?: "hover" | "mount";
    /**
     * Optional custom css
     */
    className?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,./<>?";

export function ScrambledText({
    text,
    characters = DEFAULT_CHARS,
    speed = 50,
    duration = 800,
    trigger = "hover",
    className,
}: ScrambledTextProps) {
    const [displayText, setDisplayText] = useState(trigger === "hover" ? text : "");
    const [isScrambling, setIsScrambling] = useState(trigger === "mount");

    // On mount scramble if trigger is "mount"
    useMemo(() => {
        if (trigger !== "mount") return;
        scramble();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function scramble() {
        if (isScrambling) return;
        setIsScrambling(true);

        let iteration = 0;
        const maxIterations = duration / speed;

        const interval = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " ";
                        if (index < iteration) {
                            return text[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
                setIsScrambling(false);
            }

            iteration += text.length / maxIterations;
        }, speed);
    }

    return (
        <motion.span
            className={cn("inline-block tabular-nums", className)}
            onMouseEnter={() => trigger === "hover" && scramble()}
        >
            {displayText}
        </motion.span>
    );
}
