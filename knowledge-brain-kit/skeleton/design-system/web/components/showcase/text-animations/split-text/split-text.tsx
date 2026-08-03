"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, Variants } from "framer-motion"
import { cn } from "~/lib/utils"

interface SplitTextProps {
    /**
     * The text content
     */
    text: string

    /**
     * Additional classnames
     */
    className?: string

    /**
     * Delay before starting the animation (seconds)
     */
    delay?: number

    /**
     * Animation variants override
     */
    variants?: Variants

    /**
     * By words or characters
     */
    splitBy?: "words" | "characters"

    /**
     * Time between each animated sub-element
     */
    staggerDelay?: number

    /**
     * Whether to animate immediately or when in viewport
     */
    inView?: boolean
}

const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 12, stiffness: 100 }
    },
}

export function SplitText({
    text = "",
    className,
    delay = 0,
    variants = defaultVariants,
    splitBy = "characters",
    staggerDelay = 0.05,
    inView = true,
}: SplitTextProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInViewport = useInView(ref, { once: true, margin: "-10%" })

    const shouldAnimate = inView ? isInViewport : true
    // We use word split first, to keep words from breaking strangely visually
    const words = text.split(" ")

    return (
        <div
            ref={ref}
            className={cn("flex flex-wrap gap-x-[0.25em] m-0 overflow-hidden text-balance", className)}
        >
            {words.map((word, wordIndex) => {
                // Find global index offset if we stagger by character across the entire string
                const previousCharsCount = words
                    .slice(0, wordIndex)
                    .reduce((acc, w) => acc + w.length, 0)

                return (
                    <span key={wordIndex} className="inline-flex whitespace-nowrap">
                        {splitBy === "characters" ? (
                            word.split("").map((char, charIndex) => (
                                <motion.span
                                    key={charIndex}
                                    initial="hidden"
                                    animate={shouldAnimate ? "visible" : "hidden"}
                                    variants={variants}
                                    transition={{ delay: delay + (previousCharsCount + charIndex) * staggerDelay }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            ))
                        ) : (
                            <motion.span
                                initial="hidden"
                                animate={shouldAnimate ? "visible" : "hidden"}
                                variants={variants}
                                transition={{ delay: delay + wordIndex * staggerDelay }}
                                className="inline-block"
                            >
                                {word}
                            </motion.span>
                        )}
                        {/* Add space between words (visual handled by parent gap usually, but just in case) */}
                    </span>
                )
            })}
        </div>
    )
}
