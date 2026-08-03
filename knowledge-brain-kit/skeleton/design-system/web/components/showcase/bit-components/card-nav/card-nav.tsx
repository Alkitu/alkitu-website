"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

export interface CardNavItem {
    id: string;
    label: string;
    content?: React.ReactNode;
}

interface CardNavProps {
    items: CardNavItem[];
    className?: string;
    activeId?: string;
    onChange?: (id: string) => void;
}

export function CardNav({ items, className, activeId: externalActive, onChange }: CardNavProps) {
    const [internalActive, setInternalActive] = useState(items[0]?.id);
    const activeId = externalActive !== undefined ? externalActive : internalActive;

    // Render the content of the currently active tab if provided
    const activeItem = items.find((item) => item.id === activeId);

    return (
        <div className={cn("w-full flex flex-col gap-6", className)}>
            {/* Navigation Bar */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide p-2 bg-muted rounded-2xl border border-border w-max max-w-full">
                {items.map((item) => {
                    const isActive = item.id === activeId;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setInternalActive(item.id);
                                onChange?.(item.id);
                            }}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 outline-none whitespace-nowrap",
                                isActive
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className="relative z-10">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="card-nav-indicator"
                                    className="absolute inset-0 bg-primary dark:bg-white rounded-xl shadow-sm -z-0"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content Area (Animated) */}
            <div className="relative w-full overflow-hidden rounded-3xl bg-card border shadow-sm min-h-[300px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={activeId}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="absolute inset-0 p-6 md:p-8 overflow-y-auto"
                    >
                        {activeItem?.content || (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                No content provided for {activeItem?.label}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
