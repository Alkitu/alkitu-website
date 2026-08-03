"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "~/lib/utils";

export interface BubbleMenuItem {
    icon: ReactNode;
    label: string;
}

export interface BubbleMenuProps {
    items: BubbleMenuItem[];
    closeIcon?: ReactNode;
    icon?: ReactNode;
    menuRadius?: number;
    containerClassName?: string;
    buttonClassName?: string;
    itemClassName?: string;
}

export function BubbleMenu({
    items,
    closeIcon,
    icon,
    menuRadius = 80,
    containerClassName = "",
    buttonClassName = "",
    itemClassName = "",
}: BubbleMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const totalItems = items.length;
        const angleStep = Math.PI / (totalItems - 1 || 1);

        itemsRef.current.forEach((item, index) => {
            if (item) {
                if (isOpen) {
                    const angle = angleStep * index;
                    const x = -Math.cos(angle) * menuRadius;
                    const y = -Math.sin(angle) * menuRadius;
                    item.style.transform = `translate(calc(-50% + ${x}px), ${y}px) scale(1)`;
                    item.style.opacity = "1";
                } else {
                    item.style.transform = "translate(-50%, 0) scale(0.5)";
                    item.style.opacity = "0";
                }
            }
        });
    }, [isOpen, items.length, menuRadius]);

    return (
        <div className={cn("relative flex items-center justify-center w-full h-[300px]", containerClassName)}>
            <svg className="hidden">
                <defs>
                    <filter id="bubble-menu-goo">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="10"
                            result="blur"
                        />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="goo"
                        />
                        <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                </defs>
            </svg>

            <div className="relative flex justify-center items-end pb-8 w-full h-full bg-background isolate">
                <div
                    className="relative z-[2] h-[100px] flex justify-center flex-col items-center"
                    style={{ filter: 'url("#bubble-menu-goo")' }}
                >
                    {/* Items Container inside the goo filter */}
                    <div
                        className={cn(
                            "absolute bottom-[80px] z-[1] flex gap-[10px] transition-all duration-300",
                            isOpen ? "pointer-events-auto opacity-100 visible" : "pointer-events-none opacity-0 invisible"
                        )}
                    >
                        {items.map((item, index) => (
                            <button
                                key={index}
                                ref={(el) => {
                                    itemsRef.current[index] = el;
                                }}
                                className={cn(
                                    "absolute bottom-0 left-1/2 flex justify-center items-center w-[60px] h-[60px] rounded-full text-background bg-foreground border-none cursor-pointer origin-center transition-colors duration-200 opacity-0 -translate-x-1/2 scale-50 hover:bg-foreground/80",
                                    "transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    itemClassName
                                )}
                                title={item.label}
                            >
                                <div className="z-10 isolate relative flex justify-center items-center">
                                    {item.icon}
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        className={cn(
                            "relative z-10 w-[80px] h-[80px] rounded-full bg-foreground text-background border-none cursor-pointer flex justify-center items-center mb-0 mt-5 transition-transform duration-200 hover:scale-105",
                            buttonClassName
                        )}
                        onClick={toggleMenu}
                    >
                        {isOpen && closeIcon ? closeIcon : icon}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BubbleMenu;
