"use client";

import * as React from "react";
import { cn } from "~/lib/utils";

export interface InfiniteScrollProps {
    hasMore: boolean;
    isLoading: boolean;
    next: () => void;
    threshold?: number;
    children?: React.ReactNode;
    className?: string;
}

export default function InfiniteScroll({
    hasMore,
    isLoading,
    next,
    threshold = 1,
    children,
    className,
}: InfiniteScrollProps) {
    const observerRef = React.useRef<IntersectionObserver | undefined>(undefined);
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isLoading || !hasMore) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    next();
                }
            },
            { threshold }
        );

        if (elementRef.current) {
            observerRef.current.observe(elementRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [isLoading, hasMore, next, threshold]);

    return (
        <div ref={elementRef} className={cn("flex w-full justify-center pb-4", className)}>
            {children}
        </div>
    );
}
