"use client";

import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface DecryptedTextProps {
    /**
     * The target text to decrypt to
     */
    text: string;

    /**
     * Decryption speed (ms between steps)
     */
    speed?: number;

    /**
     * How many iterations of random characters per letter before resolving
     */
    maxIterations?: number;

    /**
     * Custom characters to use during scramble
     */
    characters?: string;

    /**
     * Sequential decryption (left to right) if true, random if false
     */
    sequential?: boolean;

    /**
     * Classes
     */
    className?: string;

    /**
     * If true, it starts decrypting automatically string on mount
     */
    animateOnMount?: boolean;
}

const defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

export function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    characters = defaultChars,
    sequential = true,
    className,
    animateOnMount = true,
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (animateOnMount) {
            startDecryption();
        }
    }, [animateOnMount, text]);

    const startDecryption = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        let iterations = 0;
        const originalText = text;
        let interval: NodeJS.Timeout;

        if (sequential) {
            // Decode character by character left to right
            interval = setInterval(() => {
                setDisplayText((prev) => {
                    const resolvedLength = Math.floor(iterations / maxIterations);

                    if (resolvedLength >= originalText.length) {
                        clearInterval(interval);
                        setIsAnimating(false);
                        return originalText;
                    }

                    let newText = "";
                    for (let i = 0; i < originalText.length; i++) {
                        if (i < resolvedLength) {
                            newText += originalText[i];
                        } else if (originalText[i] === " ") {
                            newText += " "; // Preserve spaces
                        } else {
                            newText += characters[Math.floor(Math.random() * characters.length)];
                        }
                    }
                    return newText;
                });

                iterations += 1;
            }, speed);
        } else {
            // Decode randomly
            interval = setInterval(() => {
                setDisplayText((prev) => {
                    if (iterations >= maxIterations * 3) { // just arbitrarily run longer for random mode
                        clearInterval(interval);
                        setIsAnimating(false);
                        return originalText;
                    }

                    let newText = "";
                    for (let i = 0; i < originalText.length; i++) {
                        if (originalText[i] === " ") {
                            newText += " ";
                        } else if (Math.random() < iterations / (maxIterations * 3)) {
                            newText += originalText[i];
                        } else {
                            newText += characters[Math.floor(Math.random() * characters.length)];
                        }
                    }
                    return newText;
                });
                iterations += 1;
            }, speed);
        }
    };

    return (
        <span
            className={cn("inline-block font-mono tracking-wider cursor-pointer", className)}
            onMouseEnter={() => {
                // Option to trigger on hover
                if (!isAnimating) startDecryption();
            }}
        >
            {displayText || text.replace(/./g, "\u00A0")}
        </span>
    );
}
