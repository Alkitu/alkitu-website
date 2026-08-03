"use client";

import { cn } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "framer-motion";

interface CurvedLoopProps {
    /**
     * Text to be looped along the curve
     */
    text: string;
    /**
     * The speed of the animation. Higher is faster.
     */
    speed?: number;
    /**
     * The SVG path string defining the curve. (Optional, has default)
     */
    path?: string;
    className?: string;
    /**
     * Text fill color
     */
    textColor?: string;
}

const DEFAULT_PATH = "M 50,250 C 250,50 750,450 950,250";

export function CurvedLoop({
    text,
    speed = 1,
    path = DEFAULT_PATH,
    className,
    textColor = "currentColor",
}: CurvedLoopProps) {
    const [offset, setOffset] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    // We need enough text to cover the path completely
    // Roughly duplicating text is sufficient
    const repeatedText = `${text} • `.repeat(15);

    useAnimationFrame((time, delta) => {
        // Delta comes in ms, speed adjusts how fast we move.
        // We want offset to go from 0 to -100 over time if speed > 0
        setOffset((prev) => {
            let newOffset = prev - (speed * delta) / 1000;
            if (newOffset <= -100) newOffset = 0;
            if (newOffset >= 100) newOffset = 0;
            return newOffset;
        });
    });

    return (
        <div className={cn("relative w-full overflow-hidden flex items-center justify-center", className)}>
            <svg
                viewBox="0 0 1000 500"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
            >
                <path
                    id="curved-path"
                    ref={pathRef}
                    d={path}
                    fill="none"
                    stroke="none"
                />
                <text
                    fill={textColor}
                    className="font-bold tracking-widest uppercase text-3xl"
                >
                    <textPath
                        href="#curved-path"
                        startOffset={`${offset}%`}
                        className="select-none pointer-events-none"
                    >
                        {repeatedText}
                    </textPath>
                </text>
            </svg>
        </div>
    );
}
