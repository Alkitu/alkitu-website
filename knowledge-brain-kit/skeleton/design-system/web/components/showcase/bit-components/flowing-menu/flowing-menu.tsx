'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface MenuItemData {
    link: string;
    text: string;
    image: string;
}

export interface FlowingMenuProps {
    items?: MenuItemData[];
    speed?: number;
    textColor?: string;
    bgColor?: string;
    marqueeBgColor?: string;
    marqueeTextColor?: string;
    borderColor?: string;
}

interface MenuItemProps extends MenuItemData {
    speed: number;
    textColor: string;
    marqueeBgColor: string;
    marqueeTextColor: string;
    borderColor: string;
    isFirst: boolean;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
    items = [],
    speed = 15,
    textColor = 'var(--foreground)',
    bgColor = 'var(--background)',
    marqueeBgColor = 'var(--foreground)',
    marqueeTextColor = 'var(--background)',
    borderColor = 'var(--border)'
}) => {
    return (
        <>
            <style>{`
                .fm-menu-wrap {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    display: block;
                }
                .fm-menu {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
                .fm-menu__item {
                    flex: 1;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                    border-top: 1px solid;
                }
                .fm-menu__item:first-child {
                    border-top: none;
                }
                .fm-menu__item-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    position: relative;
                    cursor: pointer;
                    text-transform: uppercase;
                    text-decoration: none;
                    white-space: nowrap;
                    font-weight: 600;
                    font-size: 4vh;
                    font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
                    letter-spacing: 0.02em;
                }
                .fm-menu__item-link:hover { color: inherit; }
                .fm-menu__item-link:focus:not(:focus-visible) { color: inherit; }
                .fm-marquee {
                    position: absolute;
                    top: 0;
                    left: 0;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    transform: translate3d(0, 101%, 0);
                }
                .fm-marquee__inner-wrap {
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                }
                .fm-marquee__inner {
                    display: flex;
                    align-items: center;
                    position: relative;
                    height: 100%;
                    width: fit-content;
                    will-change: transform;
                }
                .fm-marquee__part {
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                }
                .fm-marquee span {
                    white-space: nowrap;
                    text-transform: uppercase;
                    font-weight: 400;
                    font-size: 4vh;
                    line-height: 1;
                    padding: 0 1vw;
                    font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
                }
                .fm-marquee__img {
                    width: 200px;
                    height: 7vh;
                    margin: 2em 2vw;
                    padding: 1em 0;
                    border-radius: 50px;
                    background-size: cover;
                    background-position: 50% 50%;
                }
            `}</style>
            <div className="fm-menu-wrap" style={{ backgroundColor: bgColor }}>
                <nav className="fm-menu">
                    {items.map((item, idx) => (
                        <FlowingMenuItem
                            key={idx}
                            {...item}
                            speed={speed}
                            textColor={textColor}
                            marqueeBgColor={marqueeBgColor}
                            marqueeTextColor={marqueeTextColor}
                            borderColor={borderColor}
                            isFirst={idx === 0}
                        />
                    ))}
                </nav>
            </div>
        </>
    );
};

const FlowingMenuItem: React.FC<MenuItemProps> = ({
    link,
    text,
    image,
    speed,
    textColor,
    marqueeBgColor,
    marqueeTextColor,
    borderColor,
    isFirst
}) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const marqueeInnerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const [repetitions, setRepetitions] = useState(4);

    const animationDefaults: gsap.TweenVars = { duration: 0.6, ease: 'expo' };

    const distMetric = (x: number, y: number, x2: number, y2: number): number => {
        const xDiff = x - x2;
        const yDiff = y - y2;
        return xDiff * xDiff + yDiff * yDiff;
    };

    const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
        const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
        const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
        return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
    };

    useEffect(() => {
        const calculateRepetitions = () => {
            if (!marqueeInnerRef.current) return;
            const marqueeContent = marqueeInnerRef.current.querySelector('.fm-marquee__part') as HTMLElement;
            if (!marqueeContent) return;
            const contentWidth = marqueeContent.offsetWidth;
            const viewportWidth = window.innerWidth;
            const needed = Math.ceil(viewportWidth / contentWidth) + 2;
            setRepetitions(Math.max(4, needed));
        };
        calculateRepetitions();
        window.addEventListener('resize', calculateRepetitions);
        return () => window.removeEventListener('resize', calculateRepetitions);
    }, [text, image]);

    useEffect(() => {
        const setupMarquee = () => {
            if (!marqueeInnerRef.current) return;
            const marqueeContent = marqueeInnerRef.current.querySelector('.fm-marquee__part') as HTMLElement;
            if (!marqueeContent) return;
            const contentWidth = marqueeContent.offsetWidth;
            if (contentWidth === 0) return;
            if (animationRef.current) animationRef.current.kill();
            animationRef.current = gsap.to(marqueeInnerRef.current, {
                x: -contentWidth,
                duration: speed,
                ease: 'none',
                repeat: -1
            });
        };
        const timer = setTimeout(setupMarquee, 50);
        return () => {
            clearTimeout(timer);
            if (animationRef.current) animationRef.current.kill();
        };
    }, [text, image, repetitions, speed]);

    const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);
        gsap
            .timeline({ defaults: animationDefaults })
            .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
            .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    };

    const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const edge = findClosestEdge(x, y, rect.width, rect.height);
        gsap
            .timeline({ defaults: animationDefaults })
            .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
            .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    };

    return (
        <div
            className="fm-menu__item"
            ref={itemRef}
            style={{ borderColor, borderTop: isFirst ? 'none' : undefined }}
        >
            <a
                className="fm-menu__item-link"
                href={link}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ color: textColor }}
            >
                {text}
            </a>
            <div className="fm-marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
                <div className="fm-marquee__inner-wrap">
                    <div className="fm-marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
                        {[...Array(repetitions)].map((_, idx) => (
                            <div className="fm-marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                                <span>{text}</span>
                                <div
                                    className="fm-marquee__img"
                                    style={{ backgroundImage: `url(${image})` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowingMenu;
