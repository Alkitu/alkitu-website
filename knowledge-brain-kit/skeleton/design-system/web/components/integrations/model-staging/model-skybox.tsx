"use client";

import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { cn } from '~/lib/utils';

// Manually center and scale the model to avoid Stage overriding the camera
function Model({ modelPath }: { modelPath: string }) {
    const { scene } = useGLTF(modelPath);
    const cloned = useMemo(() => {
        const c = SkeletonUtils.clone(scene) as THREE.Group;
        c.updateMatrixWorld(true);
        return c;
    }, [scene]);
    const ref = useRef<THREE.Group>(null);

    useEffect(() => {
        if (!ref.current) return;
        const box = new THREE.Box3().setFromObject(ref.current);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;

        ref.current.scale.setScalar(scale);
        ref.current.position.set(
            -center.x * scale,
            -box.min.y * scale,
            -center.z * scale
        );
    }, [cloned]);

    return (
        <group ref={ref}>
            <primitive object={cloned} />
        </group>
    );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';

const HDRI_BY_PRESET: Record<string, string> = {
    park: '/hdri/rooitou_park_1k.hdr',
    city: '/hdri/potsdamer_platz_1k.hdr',
    sunset: '/hdri/venice_sunset_1k.hdr',
    dawn: '/hdri/kiara_1_dawn_1k.hdr',
    apartment: '/hdri/lebombo_1k.hdr',
    warehouse: '/hdri/empty_warehouse_01_1k.hdr',
};

export default function ModelSkybox({ modelPath, className }: { modelPath: string; className?: string }) {
    const [envPreset, setEnvPreset] = useState<string>('park');

    return (
        <div className={cn("w-full h-[600px] rounded-lg overflow-hidden bg-background dark border border-border relative", className)}>
            <div className="absolute top-4 left-4 z-10 w-64">
                <Select
                    value={envPreset}
                    onValueChange={(value) => setEnvPreset(value)}
                >
                    <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="Select Environment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="park">Park (Greenery)</SelectItem>
                        <SelectItem value="city">City (Urban)</SelectItem>
                        <SelectItem value="sunset">Sunset (Warm)</SelectItem>
                        <SelectItem value="dawn">Dawn (Cool)</SelectItem>
                        <SelectItem value="apartment">Apartment (Indoor)</SelectItem>
                        <SelectItem value="warehouse">Warehouse (Industrial)</SelectItem>
                    </SelectContent>
                </Select>
                <p className="mt-2 text-[11px] leading-tight text-white/90 bg-black/60 px-2 py-1.5 rounded backdrop-blur-md shadow-sm border border-white/10">
                    Notice how the model sits &apos;on&apos; the background instead of floating in it.
                </p>
            </div>

            {/* Camera placed high enough to see the model against the skybox ground plane */}
            <Canvas camera={{ position: [0, 2.5, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment
                        files={HDRI_BY_PRESET[envPreset]}
                        background
                        ground={{ height: 5, radius: 40, scale: 20 }}
                    />

                    {/* No Stage here – we manually normalize the model above */}
                    <Model modelPath={modelPath} />

                    <OrbitControls
                        autoRotate
                        autoRotateSpeed={0.5}
                        target={[0, 1, 0]}
                        maxPolarAngle={Math.PI / 2 - 0.05}
                        minDistance={2}
                        maxDistance={12}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
