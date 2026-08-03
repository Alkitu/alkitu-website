"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './logo-loop.css';

export type LogoItem =
    | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string; }
    | { src: string; alt?: string; href?: string; title?: string; srcSet?: string; sizes?: string; width?: number; height?: number; };

export interface LogoLoopProps {
    logos: LogoItem[];
    speed?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    pauseOnHover?: boolean;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
    ariaLabel?: string;
    className?: string;
    style?: React.CSSProperties;
}

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 } as const;
const toCssLength = (value?: number | string): string | undefined =>
    typeof value === 'number' ? `${value}px` : (value ?? undefined);

export const LogoLoop = React.memo<LogoLoopProps>(({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);
    const [seqWidth, setSeqWidth] = useState<number>(0);
    const [seqHeight, setSeqHeight] = useState<number>(0);
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const isVertical = direction === 'up' || direction === 'down';

    const effectiveHoverSpeed = useMemo(() => {
        if (hoverSpeed !== undefined) return hoverSpeed;
        if (pauseOnHover === true) return 0;
        if (pauseOnHover === false) return undefined;
        return 0;
    }, [hoverSpeed, pauseOnHover]);

    const targetVelocity = useMemo(() => {
        const magnitude = Math.abs(speed);
        const directionMultiplier = isVertical
            ? (direction === 'up' ? 1 : -1)
            : (direction === 'left' ? 1 : -1);
        return magnitude * directionMultiplier * (speed < 0 ? -1 : 1);
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const sequenceRect = seqRef.current?.getBoundingClientRect?.();
        const sequenceWidth = sequenceRect?.width ?? 0;
        const sequenceHeight = sequenceRect?.height ?? 0;
        if (isVertical) {
            const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
            if (containerRef.current && parentHeight > 0) {
                const targetHeight = Math.ceil(parentHeight);
                if (containerRef.current.style.height !== `${targetHeight}px`)
                    containerRef.current.style.height = `${targetHeight}px`;
            }
            if (sequenceHeight > 0) {
                setSeqHeight(Math.ceil(sequenceHeight));
                const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
                setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM));
            }
        } else if (sequenceWidth > 0) {
            setSeqWidth(Math.ceil(sequenceWidth));
            setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM));
        }
    }, [isVertical]);

    // ResizeObserver
    useEffect(() => {
        const elements = [containerRef, seqRef];
        if (!window.ResizeObserver) {
            window.addEventListener('resize', updateDimensions);
            updateDimensions();
            return () => window.removeEventListener('resize', updateDimensions);
        }
        const observers = elements.map(ref => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(updateDimensions);
            observer.observe(ref.current);
            return observer;
        });
        updateDimensions();
        return () => observers.forEach(o => o?.disconnect());
    }, [logos, gap, logoHeight, isVertical, updateDimensions]);

    // Image loader
    useEffect(() => {
        const images = seqRef.current?.querySelectorAll('img') ?? [];
        if (images.length === 0) { updateDimensions(); return; }
        let remaining = images.length;
        const handleLoad = () => { remaining -= 1; if (remaining === 0) updateDimensions(); };
        images.forEach(img => {
            if ((img as HTMLImageElement).complete) handleLoad();
            else { img.addEventListener('load', handleLoad, { once: true }); img.addEventListener('error', handleLoad, { once: true }); }
        });
        return () => images.forEach(img => { img.removeEventListener('load', handleLoad); img.removeEventListener('error', handleLoad); });
    }, [logos, gap, logoHeight, isVertical, updateDimensions]);

    // Animation RAF
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const seqSize = isVertical ? seqHeight : seqWidth;
        let offset = 0;
        let velocity = 0;
        let lastTs: number | null = null;
        let raf = 0;

        const animate = (ts: number) => {
            if (lastTs === null) lastTs = ts;
            const dt = Math.max(0, ts - lastTs) / 1000;
            lastTs = ts;
            const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity;
            const easingFactor = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
            velocity += (target - velocity) * easingFactor;
            if (seqSize > 0) {
                let next = offset + velocity * dt;
                next = ((next % seqSize) + seqSize) % seqSize;
                offset = next;
                track.style.transform = isVertical ? `translate3d(0,${-offset}px,0)` : `translate3d(${-offset}px,0,0)`;
            }
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(raf); lastTs = null; };
    }, [targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical]);

    const renderLogoItem = useCallback((item: LogoItem, key: React.Key) => {
        if (renderItem) return <li className="logoloop__item" key={key} role="listitem">{renderItem(item, key)}</li>;
        const isNodeItem = 'node' in item;
        const content = isNodeItem
            ? <span className="logoloop__node">{(item as any).node}</span>
            : <img src={(item as any).src} srcSet={(item as any).srcSet} sizes={(item as any).sizes}
                width={(item as any).width} height={(item as any).height}
                alt={(item as any).alt ?? ''} title={(item as any).title}
                loading="lazy" decoding="async" draggable={false} />;
        const itemAriaLabel = isNodeItem ? ((item as any).ariaLabel ?? (item as any).title) : ((item as any).alt ?? (item as any).title);
        const itemContent = (item as any).href
            ? <a className="logoloop__link" href={(item as any).href} aria-label={itemAriaLabel || 'logo link'} target="_blank" rel="noreferrer noopener">{content}</a>
            : content;
        return <li className="logoloop__item" key={key} role="listitem">{itemContent}</li>;
    }, [renderItem]);

    const logoLists = useMemo(() =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
            <ul className="logoloop__list" key={`copy-${copyIndex}`} role="list" aria-hidden={copyIndex > 0} ref={copyIndex === 0 ? seqRef : undefined}>
                {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
            </ul>
        )),
        [copyCount, logos, renderLogoItem]
    );

    const rootClassName = [
        'logoloop',
        isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
        fadeOut && 'logoloop--fade',
        scaleOnHover && 'logoloop--scale-hover',
        className
    ].filter(Boolean).join(' ');

    const cssVariables = {
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
    } as React.CSSProperties;

    const containerStyle: React.CSSProperties = {
        width: isVertical ? (toCssLength(width) === '100%' ? undefined : toCssLength(width)) : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style
    };

    const handleMouseEnter = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(true); }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(false); }, [effectiveHoverSpeed]);

    return (
        <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
            <div className="logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {logoLists}
            </div>
        </div>
    );
});

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
