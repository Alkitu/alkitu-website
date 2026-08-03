'use client';

import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
export interface ScrollStackItemProps {
    itemClassName?: string;
    children: ReactNode;
}

export interface ScrollStackProps {
    className?: string;
    children: ReactNode;
    itemDistance?: number;
    itemScale?: number;
    itemStackDistance?: number;
    stackPosition?: string;
    scaleEndPosition?: string;
    baseScale?: number;
    scaleDuration?: number;
    rotationAmount?: number;
    blurAmount?: number;
    useWindowScroll?: boolean;
    onStackComplete?: () => void;
}

/* ------------------------------------------------------------------ */
/*  ScrollStackItem                                                      */
/* ------------------------------------------------------------------ */
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
    children,
    itemClassName = '',
}) => (
    <div className={`ss-card ${itemClassName}`.trim()}>{children}</div>
);

/* ------------------------------------------------------------------ */
/*  ScrollStack                                                          */
/* ------------------------------------------------------------------ */
const ScrollStack: React.FC<ScrollStackProps> = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    scaleDuration = 0.5,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false,
    onStackComplete,
}) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const lastTransformsRef = useRef(new Map<number, Record<string, number>>());
    const isUpdatingRef = useRef(false);

    const calculateProgress = useCallback(
        (scrollTop: number, start: number, end: number) => {
            if (scrollTop < start) return 0;
            if (scrollTop > end) return 1;
            return (scrollTop - start) / (end - start);
        },
        []
    );

    const parsePercentage = useCallback(
        (value: string | number, containerHeight: number) => {
            if (typeof value === 'string' && value.includes('%')) {
                return (parseFloat(value) / 100) * containerHeight;
            }
            return parseFloat(value as string);
        },
        []
    );

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
            };
        }
        const scroller = scrollerRef.current!;
        return {
            scrollTop: scroller.scrollTop,
            containerHeight: scroller.clientHeight,
        };
    }, [useWindowScroll]);

    const getElementOffset = useCallback(
        (element: HTMLElement) => {
            if (useWindowScroll) {
                return element.getBoundingClientRect().top + window.scrollY;
            }
            return element.offsetTop;
        },
        [useWindowScroll]
    );

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;
        isUpdatingRef.current = true;

        const { scrollTop, containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        const endEl = useWindowScroll
            ? (document.querySelector('.ss-end') as HTMLElement)
            : (scrollerRef.current?.querySelector('.ss-end') as HTMLElement);
        const endElTop = endEl ? getElementOffset(endEl) : 0;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const cardTop = getElementOffset(card);
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            const pinEnd = endElTop - containerHeight / 2;

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

            let blur = 0;
            if (blurAmount) {
                let topCardIndex = 0;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jTop = getElementOffset(cardsRef.current[j]);
                    if (scrollTop >= jTop - stackPositionPx - itemStackDistance * j) {
                        topCardIndex = j;
                    }
                }
                if (i < topCardIndex) {
                    blur = Math.max(0, (topCardIndex - i) * blurAmount);
                }
            }

            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const next = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                rotation: Math.round(rotation * 100) / 100,
                blur: Math.round(blur * 100) / 100,
            };

            const prev = lastTransformsRef.current.get(i);
            const changed =
                !prev ||
                Math.abs(prev.translateY - next.translateY) > 0.1 ||
                Math.abs(prev.scale - next.scale) > 0.001 ||
                Math.abs(prev.rotation - next.rotation) > 0.1 ||
                Math.abs(prev.blur - next.blur) > 0.1;

            if (changed) {
                card.style.transform = `translate3d(0,${next.translateY}px,0) scale(${next.scale}) rotate(${next.rotation}deg)`;
                card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : '';
                lastTransformsRef.current.set(i, next);
            }

            if (i === cardsRef.current.length - 1) {
                const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (inView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!inView && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale,
        rotationAmount, blurAmount, useWindowScroll, onStackComplete,
        calculateProgress, parsePercentage, getScrollData, getElementOffset,
    ]);

    const setupLenis = useCallback(() => {
        const handleScroll = () => updateCardTransforms();
        const raf = (time: number) => {
            lenisRef.current?.raf(time);
            animationFrameRef.current = requestAnimationFrame(raf);
        };

        if (useWindowScroll) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
            });
            lenis.on('scroll', handleScroll);
            lenisRef.current = lenis;
            animationFrameRef.current = requestAnimationFrame(raf);
            return;
        }

        const scroller = scrollerRef.current;
        if (!scroller) return;

        const lenis = new Lenis({
            wrapper: scroller,
            content: scroller.querySelector('.ss-inner') as HTMLElement,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });
        lenis.on('scroll', handleScroll);
        lenisRef.current = lenis;
        animationFrameRef.current = requestAnimationFrame(raf);
    }, [useWindowScroll, updateCardTransforms]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const cards = Array.from(
            useWindowScroll
                ? document.querySelectorAll('.ss-card')
                : scroller.querySelectorAll('.ss-card')
        ) as HTMLElement[];

        cardsRef.current = cards;
        const cache = lastTransformsRef.current;

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`;
            }
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';
            card.style.backfaceVisibility = 'hidden';
            card.style.transform = 'translateZ(0)';
        });

        setupLenis();
        updateCardTransforms();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            lenisRef.current?.destroy();
            stackCompletedRef.current = false;
            cardsRef.current = [];
            cache.clear();
            isUpdatingRef.current = false;
        };
    }, [
        itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition,
        baseScale, scaleDuration, rotationAmount, blurAmount, useWindowScroll,
        onStackComplete, setupLenis, updateCardTransforms,
    ]);

    return (
        <>
            <style>{`
                .ss-scroller {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    overscroll-behavior: contain;
                    -webkit-overflow-scrolling: touch;
                }
                .ss-inner {
                    padding: 20vh 5rem 50rem;
                    min-height: 100%;
                }
                .ss-card {
                    position: relative;
                    transform-origin: top center;
                    will-change: transform, filter;
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
                    height: 20rem;
                    width: 100%;
                    margin: 30px 0;
                    padding: 3rem;
                    border-radius: 40px;
                    box-sizing: border-box;
                    background: var(--card, #fff);
                    border: 1px solid var(--border, rgba(0,0,0,0.08));
                }
                .ss-end {
                    width: 100%;
                    height: 1px;
                }
            `}</style>
            <div className={`ss-scroller ${className}`.trim()} ref={scrollerRef}>
                <div className="ss-inner">
                    {children}
                    <div className="ss-end" />
                </div>
            </div>
        </>
    );
};

export default ScrollStack;
