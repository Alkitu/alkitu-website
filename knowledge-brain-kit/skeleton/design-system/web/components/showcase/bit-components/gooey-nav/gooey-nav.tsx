"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import { Home, Search, Heart, User } from 'lucide-react';

export interface GooeyNavItem {
    id: string;
    icon: React.ReactNode;
    label?: string;
    onClick?: () => void;
}

export interface GooeyNavProps {
    items?: GooeyNavItem[];
    defaultSelected?: string;
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
    blurSize?: string;
    color?: string;
}

const defaultItems: GooeyNavItem[] = [
    { id: '1', icon: <Home size={24} /> },
    { id: '2', icon: <Search size={24} /> },
    { id: '3', icon: <Heart size={24} /> },
    { id: '4', icon: <User size={24} /> },
];

export default function GooeyNav({
    items = defaultItems,
    defaultSelected,
    className,
    itemClassName,
    activeClassName,
    blurSize = "15px",
    color = "var(--primary)",
}: GooeyNavProps) {
    const [selected, setSelected] = useState<string>(defaultSelected || items[0]?.id || '1');

    // SVG filter needs a unique ID in case multiple instances are rendered
    const filterId = React.useId().replace(/:/g, '');
    const filterUrl = `url(#goo-${filterId})`;

    return (
        <>
            <svg width="0" height="0" className="absolute hidden">
                <defs>
                    <filter id={`goo-${filterId}`}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation={blurSize} result="blur" />
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <div
                className={cn("relative p-2 inline-flex gap-4", className)}
                style={{ filter: filterUrl }}
            >
                <div className="absolute inset-0 bg-card rounded-full" />

                {items.map((item) => {
                    const isActive = selected === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setSelected(item.id);
                                item.onClick?.();
                            }}
                            className={cn(
                                "relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
                                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                                itemClassName,
                                isActive && activeClassName
                            )}
                        >
                            {item.icon}

                            {isActive && (
                                <motion.div
                                    layoutId={`goo-indicator-${filterId}`}
                                    className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10"
                                    style={{ backgroundColor: color }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 20,
                                        mass: 0.8
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}
