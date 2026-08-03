'use client';

import { MotionValue, motion, useSpring, useTransform } from 'framer-motion';
import type React from 'react';
import { useEffect } from 'react';
import { cn } from '~/lib/utils';

type PlaceValue = number | '.';

interface NumberProps {
    mv: MotionValue<number>;
    number: number;
    height: number;
}

function Number({ mv, number, height }: NumberProps) {
    const y = useTransform(mv, (latest) => {
        const placeValue = latest % 10;
        const offset = (10 + number - placeValue) % 10;
        let memo = offset * height;
        if (offset > 5) {
            memo -= 10 * height;
        }
        return memo;
    });

    return (
        <motion.span className="counter-number" style={{ y }}>
            {number}
        </motion.span>
    );
}

function normalizeNearInteger(num: number): number {
    const nearest = Math.round(num);
    const tolerance = 1e-9 * Math.max(1, Math.abs(num));
    return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
    const scaled = value / place;
    return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
    place: PlaceValue;
    value: number;
    height: number;
    digitStyle?: React.CSSProperties;
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
    if (place === '.') {
        return (
            <span className="counter-digit" style={{ height, ...digitStyle, width: 'fit-content' }}>
                .
            </span>
        );
    }

    const valueRoundedToPlace = getValueRoundedToPlace(value, place);
    const animatedValue = useSpring(valueRoundedToPlace);

    useEffect(() => {
        animatedValue.set(valueRoundedToPlace);
    }, [animatedValue, valueRoundedToPlace]);

    return (
        <span className="counter-digit" style={{ height, ...digitStyle }}>
            {Array.from({ length: 10 }, (_, i) => (
                <Number key={i} mv={animatedValue} number={i} height={height} />
            ))}
        </span>
    );
}

export interface CounterProps {
    value: number;
    fontSize?: number;
    padding?: number;
    places?: PlaceValue[];
    gap?: number;
    borderRadius?: number;
    horizontalPadding?: number;
    textColor?: string;
    fontWeight?: React.CSSProperties['fontWeight'];
    containerStyle?: React.CSSProperties;
    counterStyle?: React.CSSProperties;
    digitStyle?: React.CSSProperties;
    gradientHeight?: number;
    gradientFrom?: string;
    gradientTo?: string;
    topGradientStyle?: React.CSSProperties;
    bottomGradientStyle?: React.CSSProperties;
    className?: string;
}

export default function Counter({
    value,
    fontSize = 100,
    padding = 0,
    places = [...value.toString()].map((ch, i, a) => {
        if (ch === '.') return '.';
        const dotIndex = a.indexOf('.');
        const isInteger = dotIndex === -1;
        const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);
        return 10 ** exponent;
    }),
    gap = 8,
    borderRadius = 4,
    horizontalPadding = 8,
    textColor = 'inherit',
    fontWeight = 'inherit',
    containerStyle,
    counterStyle,
    digitStyle,
    gradientHeight = 16,
    gradientFrom = 'var(--background)',
    gradientTo = 'transparent',
    topGradientStyle,
    bottomGradientStyle,
    className
}: CounterProps) {
    const height = fontSize + padding;

    const defaultCounterStyle: React.CSSProperties = {
        fontSize,
        gap,
        borderRadius,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        color: textColor,
        fontWeight
    };

    const defaultTopGradientStyle: React.CSSProperties = {
        height: gradientHeight,
        background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
    };

    const defaultBottomGradientStyle: React.CSSProperties = {
        height: gradientHeight,
        background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
    };

    return (
        <>
            <style>{`
                .counter-container {
                    position: relative;
                    display: inline-block;
                }
                .counter-counter {
                    display: flex;
                    overflow: hidden;
                    line-height: 1;
                }
                .counter-digit {
                    position: relative;
                    width: 1ch;
                    font-variant-numeric: tabular-nums;
                    overflow: hidden;
                    display: inline-block;
                }
                .counter-number {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .counter-gradient-container {
                    pointer-events: none;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                }
                .counter-top-gradient {
                    position: absolute;
                    top: 0;
                    width: 100%;
                }
                .counter-bottom-gradient {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                }
            `}</style>
            <span className={cn('counter-container', className)} style={containerStyle}>
                <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
                    {places.map((place, idx) => (
                        <Digit key={`${place}-${idx}`} place={place} value={value} height={height} digitStyle={digitStyle} />
                    ))}
                </span>
                <span className="counter-gradient-container">
                    <span className="counter-top-gradient" style={topGradientStyle ?? defaultTopGradientStyle} />
                    <span className="counter-bottom-gradient" style={bottomGradientStyle ?? defaultBottomGradientStyle} />
                </span>
            </span>
        </>
    );
}
