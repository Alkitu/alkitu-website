"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "~/lib/utils";

interface CountUpProps {
    /**
     * The number to count up to.
     */
    to: number;
    /**
     * The number to start from.
     */
    from?: number;
    /**
     * Animation direction: standard or reverse.
     */
    direction?: "up" | "down";
    /**
     * Delay before starting the animation (seconds).
     */
    delay?: number;
    /**
     * Animation duration (seconds).
     */
    duration?: number;
    /**
     * Additional custom classes.
     */
    className?: string;
    /**
     * Start automatically when in viewport
     */
    startWhen?: boolean;
    /**
     * String to prepend (e.g., "$")
     */
    prefix?: string;
    /**
     * String to append (e.g., "%")
     */
    suffix?: string;
    /**
     * Number of decimal places
     */
    decimals?: number;
}

export function CountUp({
    to,
    from = 0,
    direction = "up",
    delay = 0,
    duration = 2,
    className,
    startWhen = true,
    prefix = "",
    suffix = "",
    decimals = 0,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? to : from);

    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
        duration: duration * 1000,
    });

    const isInView = useInView(ref, { once: true, margin: "-10px" });
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        if (isInView && startWhen) {
            setTimeout(() => {
                motionValue.set(direction === "down" ? from : to);
            }, delay * 1000);
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay]);

    useEffect(() => {
        const formatNumber = (num: number) => {
            // Basic formatting based on decimals
            return num.toFixed(decimals);
        };

        return springValue.on("change", (latest) => {
            setDisplayValue(`${prefix}${formatNumber(latest)}${suffix}`);
        });
    }, [springValue, decimals, prefix, suffix]);

    return (
        <span ref={ref} className={cn("inline-block tabular-nums", className)}>
            {displayValue || `${prefix}${formatNumberInitial(direction === "down" ? to : from, decimals)}${suffix}`}
        </span>
    );
}

function formatNumberInitial(num: number, decimals: number) {
    return num.toFixed(decimals);
}
