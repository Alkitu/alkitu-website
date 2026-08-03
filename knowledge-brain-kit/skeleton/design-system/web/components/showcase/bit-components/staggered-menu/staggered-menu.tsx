"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '~/lib/utils';

export interface StaggeredMenuItem {
    id: string | number;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export interface StaggeredMenuProps {
    items: StaggeredMenuItem[];
    trigger?: React.ReactNode;
    className?: string;
    menuClassName?: string;
    itemClassName?: string;
}

export default function StaggeredMenu({
    items,
    trigger,
    className,
    menuClassName,
    itemClassName,
}: StaggeredMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.05,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
        exit: { opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.2 } },
    };

    return (
        <div className={cn('relative inline-block text-left', className)}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger || (
                    <button className="flex items-center gap-2 px-4 py-2 font-medium text-foreground transition-colors border rounded-full bg-card border-border hover:bg-muted">
                        Menu
                        <motion.svg
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            ></path>
                        </motion.svg>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                            'absolute left-0 mt-2 w-56 p-2 origin-top-left bg-popover/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl flex flex-col gap-1',
                            menuClassName
                        )}
                    >
                        {items.map((item) => (
                            <motion.button
                                key={item.id}
                                variants={itemVariants}
                                onClick={item.onClick}
                                className={cn(
                                    'flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground rounded-xl hover:text-foreground hover:bg-accent transition-colors text-left',
                                    itemClassName
                                )}
                            >
                                {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                                {item.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
