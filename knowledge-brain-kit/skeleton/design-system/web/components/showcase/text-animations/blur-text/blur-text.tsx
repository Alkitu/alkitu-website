"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "~/lib/utils"

interface BlurTextProps {
    /**
     * String of text to be animated
     */
    text: string

    /**
     * Delay before the animation starts (in seconds relative to framer motion)
     */
    delay?: number

    /**
     * CSS class names
     */
    className?: string

    /**
     * Controls whether it animates by words or letters
     */
    animateBy?: "words" | "letters"

    /**
     * The animation direction
     */
    direction?: "top" | "bottom"
}

export function BlurText({
    text = "",
    delay = 0,
    className,
    animateBy = "words",
    direction = "top",
}: BlurTextProps) {
    const elements = animateBy === "words" ? text.split(" ") : text.split("")
    const ref = useRef<HTMLParagraphElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    const defaultVariants = {
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
            y: direction === "top" ? -20 : 20
        },
        visible: {
            filter: "blur(0px)",
            opacity: 1,
            y: 0
        },
    }

    return (
        <p
            ref={ref}
            className={cn("flex flex-wrap gap-1 m-0", className)}
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={defaultVariants}
                    transition={{
                        delay: delay + index * (animateBy === "words" ? 0.05 : 0.02),
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    className={cn(
                        "inline-block",
                        animateBy === "letters" && "w-[max-content]"
                    )}
                >
                    {element}
                    {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
                </motion.span>
            ))}
        </p>
    )
}
