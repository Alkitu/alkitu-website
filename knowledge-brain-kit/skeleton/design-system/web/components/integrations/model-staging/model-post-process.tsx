"use client";

import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, Center } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { EffectComposer, Bloom, Glitch, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import * as THREE from 'three';
import { cn } from '~/lib/utils';

function Model({ modelPath }: { modelPath: string }) {
    const { scene } = useGLTF(modelPath);
    const cloned = useMemo(() => {
        const c = SkeletonUtils.clone(scene) as THREE.Group;
        c.updateMatrixWorld(true);
        return c;
    }, [scene]);
    return (
        <Center>
            <primitive object={cloned} />
        </Center>
    );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';

export default function ModelPostProcess({ modelPath, className }: { modelPath: string; className?: string }) {
    const [activeEffect, setActiveEffect] = useState<string>('bloom');

    return (
        <div className={cn("w-full h-[600px] rounded-lg overflow-hidden bg-background dark border border-border relative", className)}>
            <div className="absolute top-4 left-4 z-10 w-64">
                <h3 className="text-xl font-bold font-sans text-foreground tracking-tight">Post Processing</h3>
                <p className="text-muted-foreground text-sm mb-3">Screen-space high-end effects.</p>

                <div className="flex flex-col gap-2 bg-card/80 backdrop-blur-md p-3 rounded-lg border border-border shadow-2xl">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider">
                        ACTIVE EFFECT
                    </label>
                    <Select
                        value={activeEffect}
                        onValueChange={(value) => setActiveEffect(value)}
                    >
                        <SelectTrigger className="w-full capitalize">
                            <SelectValue placeholder="Select an effect" />
                        </SelectTrigger>
                        <SelectContent>
                            {['none', 'bloom', 'glitch', 'chromatic', 'noise'].map(effect => (
                                <SelectItem key={effect} value={effect} className="capitalize">
                                    {effect}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdri/potsdamer_platz_1k.hdr" />
                    <Stage preset="portrait" intensity={0.5} environment={{ files: '/hdri/potsdamer_platz_1k.hdr' }}>
                        <Model modelPath={modelPath} />
                    </Stage>

                    {activeEffect === 'bloom' && (
                        <EffectComposer>
                            <Bloom
                                intensity={1.5}
                                luminanceThreshold={0.2}
                                luminanceSmoothing={0.9}
                            />
                        </EffectComposer>
                    )}

                    {activeEffect === 'glitch' && (
                        <EffectComposer>
                            <Glitch
                                delay={new THREE.Vector2(1.5, 3.5)}
                                duration={new THREE.Vector2(0.6, 1.0)}
                                strength={new THREE.Vector2(0.1, 0.4)}
                                mode={GlitchMode.SPORADIC}
                                active
                            />
                        </EffectComposer>
                    )}

                    {activeEffect === 'chromatic' && (
                        <EffectComposer>
                            <ChromaticAberration
                                offset={new THREE.Vector2(0.005, 0.005)}
                                radialModulation={false}
                                modulationOffset={0}
                            />
                        </EffectComposer>
                    )}

                    {activeEffect === 'noise' && (
                        <EffectComposer>
                            <Noise opacity={0.4} />
                        </EffectComposer>
                    )}

                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
