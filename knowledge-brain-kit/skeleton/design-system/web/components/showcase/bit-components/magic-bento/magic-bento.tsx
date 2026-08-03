"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { useTheme } from "next-themes";

export interface BentoItemProps {
    className?: string;
    colSpan?: 1 | 2 | 3 | 4;
    rowSpan?: 1 | 2;
    children: React.ReactNode;
}

export function BentoItem({ className, colSpan = 1, rowSpan = 1, children }: BentoItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { theme } = useTheme();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!itemRef.current) return;

        const rect = itemRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPosition({ x, y });
        setOpacity(1);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
        setIsHovered(false);
    };

    return (
        <div
            ref={itemRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative rounded-3xl overflow-hidden flex flex-col p-8 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group",
                "bg-muted/50 border border-border hover:-translate-y-1 hover:border-border hover:shadow-lg",
                colSpan === 2 && "col-span-2",
                colSpan === 3 && "col-span-3",
                colSpan === 4 && "col-span-4",
                rowSpan === 2 && "row-span-2",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 will-change-[background,opacity]"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,.1)'}, transparent 40%)`,
                }}
            />

            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>

            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.03)] to-transparent opacity-0 transition-opacity duration-300",
                    "dark:from-[rgba(255,255,255,0.03)] dark:to-transparent",
                    "from-[rgba(0,0,0,0.03)] to-transparent",
                    isHovered && "opacity-100"
                )}
            />
        </div>
    );
}

export interface MagicBentoProps {
    className?: string;
    children: React.ReactNode;
}

export function MagicBento({ className, children }: MagicBentoProps) {
    return (
        <div className={cn(
            "grid p-8 w-full max-w-[1200px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[250px] gap-6 mx-auto",
            className
        )}>
            {children}
        </div>
    );
}
