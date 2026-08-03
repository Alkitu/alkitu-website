"use client";

import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { cn } from '~/lib/utils';

export interface GradientTextProps {
    /**
     * The text content
     */
    children?: ReactNode;
    /**
     * Explicit text for storybook args, fallbacks to children
     */
    text?: string;
    /**
     * Optional css classes
     */
    className?: string;
    /**
     * Colors array
     */
    colors?: string[];
    /**
     * Animation speed in seconds
     */
    animationSpeed?: number;
    /**
     * Defines if an outer border is shown
     */
    showBorder?: boolean;
    /**
     * Gradient run direction
     */
    direction?: 'horizontal' | 'vertical' | 'diagonal';
    /**
     * Whether to pause when hovered
     */
    pauseOnHover?: boolean;
    /**
     * Yoyo animation boolean
     */
    yoyo?: boolean;
}

export function GradientText({
    children,
    text,
    className = '',
    colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
    animationSpeed = 8,
    showBorder = false,
    direction = 'horizontal',
    pauseOnHover = false,
    yoyo = true
}: GradientTextProps) {
    const [isPaused, setIsPaused] = useState(false);
    const progress = useMotionValue(0);
    const elapsedRef = useRef(0);
    const lastTimeRef = useRef<number | null>(null);

    const animationDuration = animationSpeed * 1000;

    useAnimationFrame(time => {
        if (isPaused) {
            lastTimeRef.current = null;
            return;
        }

        if (lastTimeRef.current === null) {
            lastTimeRef.current = time;
            return;
        }

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;
        elapsedRef.current += deltaTime;

        if (yoyo) {
            const fullCycle = animationDuration * 2;
            const cycleTime = elapsedRef.current % fullCycle;

            if (cycleTime < animationDuration) {
                progress.set((cycleTime / animationDuration) * 100);
            } else {
                progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
            }
        } else {
            // Continuously increase position for seamless looping
            progress.set((elapsedRef.current / animationDuration) * 100);
        }
    });

    useEffect(() => {
        elapsedRef.current = 0;
        progress.set(0);
    }, [animationSpeed, yoyo]);

    const backgroundPosition = useTransform(progress, p => {
        if (direction === 'horizontal') {
            return `${p}% 50%`;
        } else if (direction === 'vertical') {
            return `50% ${p}%`;
        } else {
            // For diagonal, move only horizontally to avoid interference patterns
            return `${p}% 50%`;
        }
    });

    const handleMouseEnter = useCallback(() => {
        if (pauseOnHover) setIsPaused(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (pauseOnHover) setIsPaused(false);
    }, [pauseOnHover]);

    const gradientAngle =
        direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';

    // Duplicate first color at the end for seamless looping
    const gradientColors = [...colors, colors[0]].join(', ');

    const gradientStyle = {
        backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
        backgroundSize: direction === 'horizontal' ? '300% 100%' : direction === 'vertical' ? '100% 300%' : '300% 300%',
        backgroundRepeat: 'repeat'
    };

    return (
        <motion.div
            className={cn(
                "relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur-[10px] transition-shadow duration-500 overflow-hidden cursor-pointer",
                showBorder && "px-3 py-1.5",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showBorder && (
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ ...gradientStyle, backgroundPosition }}
                >
                    <div className="absolute inset-[1px] bg-background rounded-[calc(1.25rem-1px)] z-10" />
                </motion.div>
            )}
            <motion.div
                className="inline-block relative z-20 bg-clip-text text-transparent"
                style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: "text" }}
            >
                {children || text}
            </motion.div>
        </motion.div>
    );
}
