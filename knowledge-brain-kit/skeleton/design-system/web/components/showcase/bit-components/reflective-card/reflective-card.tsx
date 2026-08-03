"use client";

import React, { useRef, useState, MouseEvent, ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ReflectiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    glowColor?: string;
    borderColor?: string;
}

export function ReflectiveCard({
    children,
    className,
    glowColor = "rgba(255, 255, 255, 0.15)",
    borderColor = "rgba(255, 255, 255, 0.4)",
    ...props
}: ReflectiveCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "relative rounded-3xl overflow-hidden bg-card border border-border transition-colors duration-500",
                className
            )}
            {...props}
        >
            {/* 
        The shiny hover effect gradient layer.
        It uses CSS radial-gradient plotted exactly at the mouse pointer's X and Y.
      */}
            <div
                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `
            radial-gradient(
              circle 250px at ${mousePosition.x}px ${mousePosition.y}px,
              ${glowColor},
              transparent 80%
            )
          `,
                }}
            />

            {/* 
        A subtle border highlight layer. 
        It creates a hard edge gleam exactly where the mouse is near the border.
      */}
            <div
                className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl opacity-0 hover:opacity-100"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `
            radial-gradient(
              circle 200px at ${mousePosition.x}px ${mousePosition.y}px,
              ${borderColor},
              transparent 100%
            )
          `,
                    WebkitMaskImage: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1px", // the width of the border highlight
                }}
            />

            {/* Actual Content Wrapper (kept above background shadows but below glows if needed, or opposite depending on desired effect) */}
            <div className="relative z-0 h-full w-full">{children}</div>
        </div>
    );
}
