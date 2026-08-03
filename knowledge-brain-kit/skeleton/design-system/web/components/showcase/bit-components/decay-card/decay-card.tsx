import React, { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { cn } from '~/lib/utils';

interface DecayCardProps {
    width?: number;
    height?: number;
    image?: string;
    children?: ReactNode;
    className?: string;
}

export default function DecayCard({
    width = 300,
    height = 400,
    image = '/gallery/landscape-02-forest.png',
    className,
    children
}: DecayCardProps) {
    const svgRef = useRef<HTMLDivElement>(null);
    const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);

    const cursor = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const cachedCursor = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const winsize = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        cursor.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        cachedCursor.current = { ...cursor.current };
        winsize.current = { width: window.innerWidth, height: window.innerHeight };

        const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;
        const map = (x: number, a: number, b: number, c: number, d: number): number => ((x - a) * (d - c)) / (b - a) + c;
        const distance = (x1: number, x2: number, y1: number, y2: number): number => {
            const a = x1 - x2;
            const b = y1 - y2;
            return Math.hypot(a, b);
        };

        const handleResize = (): void => {
            winsize.current = { width: window.innerWidth, height: window.innerHeight };
        };

        const handleMouseMove = (ev: MouseEvent): void => {
            cursor.current = { x: ev.clientX, y: ev.clientY };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const imgValues = {
            imgTransforms: { x: 0, y: 0, rz: 0 },
            displacementScale: 0
        };

        let requestRef: number;

        const render = () => {
            let targetX = lerp(imgValues.imgTransforms.x, map(cursor.current.x, 0, winsize.current.width, -120, 120), 0.1);
            let targetY = lerp(imgValues.imgTransforms.y, map(cursor.current.y, 0, winsize.current.height, -120, 120), 0.1);
            let targetRz = lerp(imgValues.imgTransforms.rz, map(cursor.current.x, 0, winsize.current.width, -10, 10), 0.1);

            const bound = 50;
            if (targetX > bound) targetX = bound + (targetX - bound) * 0.2;
            if (targetX < -bound) targetX = -bound + (targetX + bound) * 0.2;
            if (targetY > bound) targetY = bound + (targetY - bound) * 0.2;
            if (targetY < -bound) targetY = -bound + (targetY + bound) * 0.2;

            imgValues.imgTransforms.x = targetX;
            imgValues.imgTransforms.y = targetY;
            imgValues.imgTransforms.rz = targetRz;

            if (svgRef.current) {
                gsap.set(svgRef.current, {
                    x: imgValues.imgTransforms.x,
                    y: imgValues.imgTransforms.y,
                    rotateZ: imgValues.imgTransforms.rz
                });
            }

            const cursorTravelledDistance = distance(
                cachedCursor.current.x,
                cursor.current.x,
                cachedCursor.current.y,
                cursor.current.y
            );
            imgValues.displacementScale = lerp(
                imgValues.displacementScale,
                map(cursorTravelledDistance, 0, 200, 0, 400),
                0.06
            );

            if (displacementMapRef.current) {
                gsap.set(displacementMapRef.current, {
                    attr: { scale: imgValues.displacementScale }
                });
            }

            cachedCursor.current = { ...cursor.current };

            requestRef = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef);
        };
    }, []);

    return (
        <>
            <style>{`
        .decay-card-content {
          position: relative;
        }

        .decay-card-svg {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
          will-change: transform;
        }

        .decay-card-text {
          position: absolute;
          bottom: 1.2em;
          letter-spacing: -0.5px;
          font-weight: 900;
          left: 1em;
          font-size: 2.5rem;
          line-height: 1.5em;
          color: white;
        }

        .decay-card-text::first-line {
          font-size: 4rem;
        }
      `}</style>
            <div className={cn("decay-card-content", className)} style={{ width: `${width}px`, height: `${height}px` }} ref={svgRef}>
                <svg viewBox="-60 -75 720 900" preserveAspectRatio="xMidYMid slice" className="decay-card-svg">
                    <filter id="imgFilter">
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.015"
                            numOctaves={5}
                            seed="4"
                            stitchTiles="stitch"
                            x="0%"
                            y="0%"
                            width="100%"
                            height="100%"
                            result="turbulence1"
                        />
                        <feDisplacementMap
                            ref={displacementMapRef}
                            in="SourceGraphic"
                            in2="turbulence1"
                            scale="0"
                            xChannelSelector="R"
                            yChannelSelector="B"
                            x="0%"
                            y="0%"
                            width="100%"
                            height="100%"
                            result="displacementMap3"
                        />
                    </filter>
                    <g>
                        <image
                            href={image}
                            x="0"
                            y="0"
                            width="600"
                            height="750"
                            filter="url(#imgFilter)"
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </g>
                </svg>
                <div className="decay-card-text">{children}</div>
            </div>
        </>
    );
}
