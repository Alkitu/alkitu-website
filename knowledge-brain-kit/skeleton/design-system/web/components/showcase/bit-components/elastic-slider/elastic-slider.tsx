import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { Volume1, Volume2 } from 'lucide-react';
import { cn } from '~/lib/utils';

const MAX_OVERFLOW = 50;

export interface ElasticSliderProps {
    defaultValue?: number;
    startingValue?: number;
    maxValue?: number;
    className?: string;
    isStepped?: boolean;
    stepSize?: number;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function ElasticSlider({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    className = '',
    isStepped = false,
    stepSize = 1,
    leftIcon = <Volume1 className="w-6 h-6 text-muted-foreground" />,
    rightIcon = <Volume2 className="w-6 h-6 text-muted-foreground" />
}: ElasticSliderProps) {
    return (
        <>
            <style>{`
        .elastic-slider-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          width: 12rem;
        }

        .elastic-slider-wrapper {
          display: flex;
          width: 100%;
          touch-action: none;
          user-select: none;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .elastic-slider-root {
          position: relative;
          display: flex;
          width: 100%;
          max-width: 200px;
          flex-grow: 1;
          cursor: grab;
          touch-action: none;
          user-select: none;
          align-items: center;
          padding: 1rem 0;
        }

        .elastic-slider-root:active {
          cursor: grabbing;
        }

        .elastic-slider-track-wrapper {
          display: flex;
          flex-grow: 1;
        }

        .elastic-slider-track {
          position: relative;
          height: 100%;
          flex-grow: 1;
          overflow: hidden;
          border-radius: 9999px;
          background-color: var(--muted);
        }

        .elastic-slider-range {
          position: absolute;
          height: 100%;
          background-color: var(--primary);
          border-radius: 9999px;
        }

        .elastic-value-indicator {
          color: var(--muted-foreground);
          position: absolute;
          transform: translateY(-1.5rem);
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
      `}</style>
            <div className={cn("elastic-slider-container", className)}>
                <Slider
                    defaultValue={defaultValue}
                    startingValue={startingValue}
                    maxValue={maxValue}
                    isStepped={isStepped}
                    stepSize={stepSize}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                />
            </div>
        </>
    );
}

interface SliderProps {
    defaultValue: number;
    startingValue: number;
    maxValue: number;
    isStepped: boolean;
    stepSize: number;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({
    defaultValue,
    startingValue,
    maxValue,
    isStepped,
    stepSize,
    leftIcon,
    rightIcon
}) => {
    const [value, setValue] = useState<number>(defaultValue);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [region, setRegion] = useState<'left' | 'middle' | 'right'>('middle');
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useMotionValueEvent(clientX, 'change', (latest: number) => {
        if (sliderRef.current) {
            const { left, right } = sliderRef.current.getBoundingClientRect();
            let newValue: number;
            if (latest < left) {
                setRegion('left');
                newValue = left - latest;
            } else if (latest > right) {
                setRegion('right');
                newValue = latest - right;
            } else {
                setRegion('middle');
                newValue = 0;
            }
            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            let newValue = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);
            if (isStepped) {
                newValue = Math.round(newValue / stepSize) * stepSize;
            }
            newValue = Math.min(Math.max(newValue, startingValue), maxValue);
            setValue(newValue);
            clientX.jump(e.clientX);
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        handlePointerMove(e);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: 'spring', bounce: 0.5 });
    };

    const getRangePercentage = (): number => {
        const totalRange = maxValue - startingValue;
        if (totalRange === 0) return 0;
        return ((value - startingValue) / totalRange) * 100;
    };

    return (
        <>
            <motion.div
                onHoverStart={() => animate(scale, 1.2)}
                onHoverEnd={() => animate(scale, 1)}
                onTouchStart={() => animate(scale, 1.2)}
                onTouchEnd={() => animate(scale, 1)}
                style={{
                    scale,
                    opacity: useTransform(scale, [1, 1.2], [0.7, 1])
                }}
                className="elastic-slider-wrapper"
            >
                <motion.div
                    animate={{
                        scale: region === 'left' ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 }
                    }}
                    style={{
                        x: useTransform(() => (region === 'left' ? -overflow.get() / scale.get() : 0))
                    }}
                >
                    {leftIcon}
                </motion.div>

                <div
                    ref={sliderRef}
                    className="elastic-slider-root"
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                >
                    <motion.div
                        style={{
                            scaleX: useTransform(() => {
                                if (sliderRef.current) {
                                    const { width } = sliderRef.current.getBoundingClientRect();
                                    return 1 + overflow.get() / width;
                                }
                                return 1;
                            }),
                            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                            transformOrigin: useTransform(() => {
                                if (sliderRef.current) {
                                    const { left, width } = sliderRef.current.getBoundingClientRect();
                                    return clientX.get() < left + width / 2 ? 'right' : 'left';
                                }
                                return 'center';
                            }),
                            height: useTransform(scale, [1, 1.2], [6, 12]),
                            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
                            marginBottom: useTransform(scale, [1, 1.2], [0, -3])
                        }}
                        className="elastic-slider-track-wrapper"
                    >
                        <div className="elastic-slider-track">
                            <div className="elastic-slider-range" style={{ width: `${getRangePercentage()}%` }} />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{
                        scale: region === 'right' ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 }
                    }}
                    style={{
                        x: useTransform(() => (region === 'right' ? overflow.get() / scale.get() : 0))
                    }}
                >
                    {rightIcon}
                </motion.div>
            </motion.div>
            <p className="elastic-value-indicator">{Math.round(value)}</p>
        </>
    );
};

function decay(value: number, max: number): number {
    if (max === 0) {
        return 0;
    }
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
    return sigmoid * max;
}
