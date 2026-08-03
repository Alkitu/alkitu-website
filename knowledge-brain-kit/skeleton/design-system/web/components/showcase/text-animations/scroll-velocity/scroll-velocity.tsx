"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";
import { cn } from "~/lib/utils";

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ScrollVelocityProps {
    /**
     * The text to scroll
     */
    text: string;
    /**
     * Base speed of the scrolling (negative moves left, positive right)
     */
    baseVelocity?: number;
    /**
     * Optional CSS classes
     */
    className?: string;
}

export function ScrollVelocity({
    text,
    baseVelocity = -5,
    className,
}: ScrollVelocityProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    // Calculate current X position mapped between 0 and 100% of the internal wrapper size (if using percentages, else arbitrary pixels)
    // To avoid clipping and guessing lengths, we use a fixed percentage wrap
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        // Change direction based on scroll momentum if baseVelocity is used
        // This allows it to physically "pull" backward if you scroll up fast enough
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap w-full m-0">
            <motion.div
                className={cn("flex whitespace-nowrap flex-nowrap", className)}
                style={{ x }}
            >
                {/* Render text multiple times to ensure seamless infinite loop */}
                <span className="block pr-12">{text}</span>
                <span className="block pr-12">{text}</span>
                <span className="block pr-12">{text}</span>
                <span className="block pr-12">{text}</span>
            </motion.div>
        </div>
    );
}
