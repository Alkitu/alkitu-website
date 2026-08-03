"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/lib/utils";

export interface PillNavItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface PillNavProps {
    items: PillNavItem[];
    className?: string;
    activeId?: string;
    onChange?: (id: string) => void;
}

export function PillNav({
    items,
    className,
    activeId: externalActive,
    onChange,
}: PillNavProps) {
    const [internalActive, setInternalActive] = useState(items[0]?.id);
    const activeId = externalActive !== undefined ? externalActive : internalActive;

    return (
        <div className={cn("flex items-center justify-center p-4", className)}>
            {/* 
        The parent layout container that morphs to fit the text of the active button
        and the collapsed state of the other buttons.
      */}
            <motion.div
                layout
                className="flex items-center gap-1 p-1 bg-card border border-border rounded-full shadow-2xl overflow-hidden"
                style={{ borderRadius: 9999 }} // Force extreme rounded corners during layout morphs
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                {items.map((item) => {
                    const isActive = item.id === activeId;

                    return (
                        <motion.button
                            layout
                            key={item.id}
                            onClick={() => {
                                setInternalActive(item.id);
                                onChange?.(item.id);
                            }}
                            className={cn(
                                "relative flex items-center justify-center h-10 px-4 rounded-full transition-colors duration-300",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {/* Icon (always visible in this pattern, or could be hidden/shown) */}
                            {item.icon && (
                                <motion.span layout className="flex-shrink-0">
                                    {item.icon}
                                </motion.span>
                            )}

                            {/* Label (only visible when active, morphing the parent) */}
                            <AnimatePresence mode="popLayout" initial={false}>
                                {isActive && (
                                    <motion.span
                                        key="label"
                                        layout
                                        initial={{ opacity: 0, width: 0, filter: "blur(4px)", marginLeft: 0 }}
                                        animate={{ opacity: 1, width: "auto", filter: "blur(0px)", marginLeft: item.icon ? 8 : 0 }}
                                        exit={{ opacity: 0, width: 0, filter: "blur(4px)", marginLeft: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
