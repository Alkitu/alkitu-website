"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "~/lib/utils";

interface FallingTextProps {
    /**
     * The text to animate
     */
    text: string;
    /**
     * Stagger delay between characters
     */
    staggerDelay?: number;
    /**
     * Distance characters fall from (px)
     */
    dropDistance?: number;
    /**
     * Starting delay
     */
    delay?: number;
    /**
     * Optional custom class
     */
    className?: string;
}

export function FallingText({
    text,
    staggerDelay = 0.05,
    dropDistance = 100,
    delay = 0,
    className,
}: FallingTextProps) {
    const characters = text.split("");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    const childVariants: Variants = {
        hidden: { y: -dropDistance, opacity: 0, scale: 1.5 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 150,
            },
        },
    };

    return (
        <motion.div
            className={cn("flex flex-wrap overflow-hidden", className)}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10px" }}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={childVariants}
                    className="inline-block whitespace-pre"
                >
                    {char}
                </motion.span>
            ))}
        </motion.div>
    );
}
