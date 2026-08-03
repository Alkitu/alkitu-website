"use client";

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, Html, Center } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { cn } from '~/lib/utils';

interface ModelPosterProps {
    modelPath: string;
    posterSrc: string;
    className?: string;
}

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

export default function ModelWithPoster({ modelPath, posterSrc, className }: ModelPosterProps) {
    const [showPoster, setShowPoster] = useState(true);
    const [loadModel, setLoadModel] = useState(false);

    return (
        <div className={cn("relative w-full h-[600px] rounded-lg overflow-hidden bg-card border border-border flex items-center justify-center", className)}>
            {showPoster && (
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500 overflow-hidden group"
                    onClick={() => {
                        setLoadModel(true);
                        setShowPoster(false);
                    }}
                >
                    {/* Scale background slightly to crop out any baked-in window borders */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-105 group-hover:scale-110"
                        style={{ backgroundImage: `url(${posterSrc})` }}
                    />

                    {/* Play Button Overlay */}
                    <div className="relative z-20 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 group-hover:bg-white/30 transition-all">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                        </svg>
                    </div>
                    <p className="relative z-20 mt-4 text-foreground font-semibold drop-shadow-md">Click to load 3D Model</p>
                </div>
            )}

            {loadModel && (
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Suspense fallback={<Html center><div className="text-white">Loading GLTF...</div></Html>}>
                        <Environment files="/hdri/potsdamer_platz_1k.hdr" />
                        <Stage preset="rembrandt" intensity={1} environment={{ files: '/hdri/potsdamer_platz_1k.hdr' }}>
                            <Model modelPath={modelPath} />
                        </Stage>
                        <OrbitControls autoRotate />
                    </Suspense>
                </Canvas>
            )}
        </div>
    );
}
