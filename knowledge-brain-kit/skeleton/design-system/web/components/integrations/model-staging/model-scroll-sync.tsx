"use client";

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ScrollControls, useScroll, Stage, Center } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { cn } from '~/lib/utils';

function ScrollModel({ modelPath }: { modelPath: string }) {
    const { scene } = useGLTF(modelPath);
    const cloned = useMemo(() => {
        const c = SkeletonUtils.clone(scene) as THREE.Group;
        c.updateMatrixWorld(true);
        return c;
    }, [scene]);
    const ref = useRef<THREE.Group>(null);
    const scroll = useScroll();

    useFrame(() => {
        if (ref.current) {
            const offset = scroll.offset;
            ref.current.rotation.y = offset * Math.PI * 2;
            ref.current.rotation.x = Math.sin(offset * Math.PI) * 0.5;
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, (offset - 0.5) * 2, 0.1);
        }
    });

    return (
        <group ref={ref}>
            <Center>
                <primitive object={cloned} />
            </Center>
        </group>
    );
}

export default function ModelScrollSync({ modelPath, className }: { modelPath: string; className?: string }) {
    return (
        <div className={cn("w-full h-[600px] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800", className)}>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdri/potsdamer_platz_1k.hdr" />

                    {/* ScrollControls creates an internal HTML scroll container */}
                    <ScrollControls pages={3} damping={0.25}>
                        <Stage preset="rembrandt" intensity={0.5} environment={{ files: '/hdri/potsdamer_platz_1k.hdr' }}>
                            <ScrollModel modelPath={modelPath} />
                        </Stage>

                        {/* Optional HTML elements tied to scroll can be added here using Scroll */}
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
}
