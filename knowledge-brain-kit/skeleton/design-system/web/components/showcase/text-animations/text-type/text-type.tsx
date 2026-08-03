"use client";

import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

interface TextTypeProps {
    /**
     * Substrings to type.
     */
    items: string[];

    /**
     * Speed of typing (in ms per char).
     */
    typeSpeed?: number;

    /**
     * Speed of backspacing (in ms per char).
     */
    backSpeed?: number;

    /**
     * Delay before deleting (in ms).
     */
    delayBeforeDelete?: number;

    /**
     * Make cursor blink
     */
    cursor?: boolean;

    /**
     * The cursor character
     */
    cursorChar?: string;

    /**
     * Additional tailwind classes
     */
    className?: string;
}

export function TextType({
    items = [],
    typeSpeed = 80,
    backSpeed = 50,
    delayBeforeDelete = 1500,
    cursor = true,
    cursorChar = "|",
    className,
}: TextTypeProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!items || items.length === 0) return;

        const currentString = items[index];

        const typeOrDelete = () => {
            if (isDeleting) {
                setDisplayedText((prev) => prev.slice(0, -1));
            } else {
                setDisplayedText((prev) => currentString.slice(0, prev.length + 1));
            }
        };

        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayedText === currentString) {
            timeout = setTimeout(() => setIsDeleting(true), delayBeforeDelete);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % items.length);
        } else {
            timeout = setTimeout(typeOrDelete, isDeleting ? backSpeed : typeSpeed);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, index, items, typeSpeed, backSpeed, delayBeforeDelete]);

    return (
        <span className={cn("inline-flex items-center", className)}>
            <span>{displayedText}</span>
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="ml-[1px] font-mono opacity-100 font-normal"
                >
                    {cursorChar}
                </motion.span>
            )}
        </span>
    );
}
