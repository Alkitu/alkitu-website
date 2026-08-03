"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export interface ModelViewerProps {
    modelPath: string;
    scale?: number;
    rotation?: [number, number, number];
    position?: [number, number, number];
    environment?: 'studio' | 'city' | 'apartment' | 'forest' | 'lobby' | 'night' | 'park' | 'sunset' | 'dawn' | 'warehouse';
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    shadows?: boolean;
    cameraPosition?: [number, number, number];
    className?: string;
}

function Model({ modelPath, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }: { modelPath: string; scale?: number; rotation?: [number, number, number]; position?: [number, number, number] }) {
    const { scene } = useGLTF(modelPath);

    // Enable shadows on all meshes
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={scene} scale={scale} rotation={rotation} position={position} />;
}

export default function ModelViewer({
    modelPath,
    scale = 1,
    rotation = [0, 0, 0],
    position = [0, 0, 0],
    environment = 'city',
    autoRotate = true,
    autoRotateSpeed = 2,
    shadows = true,
    cameraPosition = [0, 0, 5],
    className = "",
}: ModelViewerProps) {
    return (
        <div className={`w-full h-full min-h-[400px] ${className}`}>
            <Canvas shadows={shadows} camera={{ position: cameraPosition, fov: 45 }}>
                <Suspense fallback={null}>
                    {/* Environment provides lighting and reflections */}
                    <Environment preset={environment} />

                    <Stage
                        preset="rembrandt"
                        intensity={1}
                        environment={environment}
                        adjustCamera={1.2}
                    >
                        <Model modelPath={modelPath} scale={scale} rotation={rotation} position={position} />
                    </Stage>

                    {shadows && (
                        <ContactShadows
                            resolution={1024}
                            scale={10}
                            blur={2}
                            opacity={0.5}
                            far={10}
                            color="#000000"
                        />
                    )}

                    <OrbitControls
                        autoRotate={autoRotate}
                        autoRotateSpeed={autoRotateSpeed}
                        enablePan={false}
                        enableZoom={true}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Preload to avoid stuttering on mount
if (typeof window !== 'undefined') {
    useGLTF.preload('/assets/3d/lens.glb');
    useGLTF.preload('/assets/3d/cube.glb');
}

