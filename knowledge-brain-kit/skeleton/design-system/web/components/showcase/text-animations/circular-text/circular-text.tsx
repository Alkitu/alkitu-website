"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation, useMotionValue, MotionValue, Transition } from 'framer-motion';
import { cn } from '~/lib/utils';
import './circular-text.css';

export interface CircularTextProps {
    /**
     * Intended text to wrap around the circle.
     */
    text: string;
    /**
     * Speed of the spin in seconds for one full rotation.
     */
    spinDuration?: number;
    /**
     * Hover effect mode
     */
    onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
    /**
     * Optional custom classes.
     */
    className?: string;
    /**
     * Explicit radius adjustment in pixels (custom layout approach)
     */
    radius?: number;
}

const getRotationTransition = (duration: number, from: number, loop: boolean = true) => ({
    from,
    to: from + 360,
    ease: 'linear' as const,
    duration,
    type: 'tween' as const,
    repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
    rotate: getRotationTransition(duration, from),
    scale: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300
    }
});

export function CircularText({
    text,
    spinDuration = 20,
    onHover = 'speedUp',
    className = '',
    radius = 60
}: CircularTextProps) {
    const letters = Array.from(text);
    const controls = useAnimation();
    const rotation: MotionValue<number> = useMotionValue(0);

    useEffect(() => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start)
        });
    }, [spinDuration, text, onHover, controls]);

    const handleHoverStart = () => {
        const start = rotation.get();

        if (!onHover) return;

        let transitionConfig: ReturnType<typeof getTransition> | Transition;
        let scaleVal = 1;

        switch (onHover) {
            case 'slowDown':
                transitionConfig = getTransition(spinDuration * 2, start);
                break;
            case 'speedUp':
                transitionConfig = getTransition(spinDuration / 4, start);
                break;
            case 'pause':
                transitionConfig = {
                    rotate: { type: 'spring', damping: 20, stiffness: 300 },
                    scale: { type: 'spring', damping: 20, stiffness: 300 }
                };
                break;
            case 'goBonkers':
                transitionConfig = getTransition(spinDuration / 20, start);
                scaleVal = 0.8;
                break;
            default:
                transitionConfig = getTransition(spinDuration, start);
        }

        controls.start({
            rotate: start + 360,
            scale: scaleVal,
            transition: transitionConfig
        });
    };

    const handleHoverEnd = () => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            scale: 1,
            transition: getTransition(spinDuration, start)
        });
    };

    return (
        <motion.div
            className={cn("circular-text", className)}
            style={{ rotate: rotation, width: radius * 2, height: radius * 2 }}
            initial={{ rotate: 0 }}
            animate={controls}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
        >
            {letters.map((letter, i) => {
                const rotationDeg = (360 / letters.length) * i;
                return (
                    <span
                        key={i}
                        style={{ transform: `rotate(${rotationDeg}deg)` }}
                    >
                        {letter}
                    </span>
                );
            })}
        </motion.div>
    );
}
