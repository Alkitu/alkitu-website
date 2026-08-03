"use client";

import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, CameraControls } from '@react-three/drei';
import { GLTFLoader } from 'three-stdlib';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { cn } from '~/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';

// Each hotspot carries its own camera orbit (azimuthDeg, elevDeg, distance) and target
// These mirror the model-viewer `data-orbit` and `data-target` approach
const HOTSPOTS_DATA = [
    {
        id: 1,
        label: "Head Unit",
        description: "Expressive face with animated eyes and mouth.",
        position: [0, 1.6, 0.3] as [number, number, number],
        orbit: { azimuth: 0, polar: 70, radius: 1.5 },
        target: [0, 1.6, 0.1] as [number, number, number],
    },
    {
        id: 2,
        label: "Torso Core",
        description: "Central processing unit housing the main controller.",
        position: [0, 0.9, 0.3] as [number, number, number],
        orbit: { azimuth: 0, polar: 80, radius: 1.8 },
        target: [0, 0.9, 0.1] as [number, number, number],
    },
    {
        id: 3,
        label: "Arm Joint",
        description: "Articulated arm with multiple degrees of freedom.",
        position: [0.5, 0.8, 0] as [number, number, number],
        orbit: { azimuth: -60, polar: 85, radius: 1.6 },
        target: [0.4, 0.8, 0] as [number, number, number],
    },
];

// ─── Hotspot UI ─────────────────────────────────────────────────────────────
function HotspotUI({
    label, description, isOpen, onToggle,
}: {
    label: string; description: string; isOpen: boolean; onToggle: () => void;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <Html center distanceFactor={8} zIndexRange={[100, 0]}>
            <div
                style={{ cursor: 'pointer' }}
                className={cn("relative flex items-center justify-center transition-transform duration-200", hovered || isOpen ? "scale-110" : "scale-100")}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
            >
                {/* Dot */}
                <div className={cn(
                    "w-6 h-6 rounded-full shadow-lg border-2 flex items-center justify-center transition-colors duration-200",
                    isOpen ? "bg-primary border-primary-foreground" : "bg-background border-primary animate-pulse hover:animate-none",
                )}>
                    <div className={cn("w-2 h-2 rounded-full", isOpen ? "bg-primary-foreground" : "bg-primary")} />
                </div>

                {/* Card */}
                {(hovered || isOpen) && (
                    <div className={cn(
                        "absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-44 p-3 rounded-lg shadow-xl border border-border pointer-events-none text-left",
                        isOpen ? "bg-popover ring-2 ring-ring" : "bg-popover/90 backdrop-blur-md",
                    )}>
                        <h4 className="text-sm font-bold text-popover-foreground mb-1 leading-tight">{label}</h4>
                        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
                        <span className={cn("absolute left-1/2 top-full -translate-x-1/2 border-t-8 border-x-8 border-x-transparent border-b-0 border-solid", isOpen ? "border-t-popover" : "border-t-popover/90")} />
                    </div>
                )}
            </div>
        </Html>
    );
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function Scene({ modelPath, activeHotspots, setActiveHotspots, allowMultiple }: {
    modelPath: string;
    activeHotspots: number[];
    setActiveHotspots: React.Dispatch<React.SetStateAction<number[]>>;
    allowMultiple: boolean;
}) {
    const controlsRef = useRef<CameraControls>(null);
    const groupRef = useRef<THREE.Group>(null);
    const [cloned, setCloned] = useState<THREE.Group | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState(new THREE.Vector3());
    const { gl } = useThree();

    // ── Load GLTF bypassing Three.js cache (each component gets its own instance)
    useEffect(() => {
        const loader = new GLTFLoader();
        // Adding a unique fragment so the browser fetches a separate copy
        loader.load(
            modelPath,
            (gltf) => {
                const clonedScene = SkeletonUtils.clone(gltf.scene) as THREE.Group;
                clonedScene.updateMatrixWorld(true);

                // Compute bounding box to center + fit the model
                const box = new THREE.Box3().setFromObject(clonedScene);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const s = 2 / maxDim;  // fit within 2 units radius

                setScale(s);
                setOffset(center.clone().negate());
                setCloned(clonedScene);
            },
            undefined,
            (err) => console.error('GLTF load error:', err)
        );
    }, [modelPath, gl]);

    // ── Auto-rotate when nothing is open
    useFrame((_state, delta) => {
        if (controlsRef.current && activeHotspots.length === 0) {
            controlsRef.current.azimuthAngle -= 0.4 * delta;
        }
    });

    // ── Fly camera to hotspot using orbital coords (like model-viewer data-orbit / data-target)
    useEffect(() => {
        const ctrl = controlsRef.current;
        if (!ctrl) return;

        if (activeHotspots.length > 0) {
            const id = activeHotspots[activeHotspots.length - 1];
            const hs = HOTSPOTS_DATA.find(h => h.id === id);
            if (!hs) return;

            // Transform the local hotspot target into scaled world-space
            const worldTarget = new THREE.Vector3(...hs.target)
                .add(offset)
                .multiplyScalar(scale);

            // Compute camera world position from orbital params
            const azimuthRad = THREE.MathUtils.degToRad(hs.orbit.azimuth);
            const polarRad = THREE.MathUtils.degToRad(hs.orbit.polar);
            const r = hs.orbit.radius;

            const camX = worldTarget.x + r * Math.sin(polarRad) * Math.sin(azimuthRad);
            const camY = worldTarget.y + r * Math.cos(polarRad);
            const camZ = worldTarget.z + r * Math.sin(polarRad) * Math.cos(azimuthRad);

            ctrl.setLookAt(camX, camY, camZ, worldTarget.x, worldTarget.y, worldTarget.z, true);
        } else {
            // Return to default view
            ctrl.setLookAt(0, 0, 5, 0, 0, 0, true);
        }
    }, [activeHotspots, scale, offset]);

    const handleToggle = (id: number) => {
        setActiveHotspots(prev => {
            if (prev.includes(id)) return prev.filter(h => h !== id);
            return allowMultiple ? [...prev, id] : [id];
        });
    };

    if (!cloned) return null;

    return (
        <>
            {/* Lighting — manual, no Stage */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 3, -5]} intensity={0.4} />

            {/* The model group — scale and center manually */}
            <group
                ref={groupRef}
                scale={[scale, scale, scale]}
                position={[offset.x * scale, offset.y * scale, offset.z * scale]}
                onPointerMissed={() => setActiveHotspots([])}
            >
                <primitive object={cloned} />

                {/* Hotspot markers live INSIDE the same group — so they orbit with the model */}
                {HOTSPOTS_DATA.map(h => (
                    <group key={h.id} position={h.position}>
                        <HotspotUI
                            label={h.label}
                            description={h.description}
                            isOpen={activeHotspots.includes(h.id)}
                            onToggle={() => handleToggle(h.id)}
                        />
                    </group>
                ))}
            </group>

            <CameraControls
                ref={controlsRef}
                makeDefault
                maxPolarAngle={Math.PI * 0.75}
                minPolarAngle={Math.PI * 0.1}
                minDistance={1}
                maxDistance={10}
            />
        </>
    );
}

// ─── Outer component ─────────────────────────────────────────────────────────
export default function ModelHotspots({ modelPath }: { modelPath: string }) {
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [activeHotspots, setActiveHotspots] = useState<number[]>([]);

    const handleModeChange = (val: string) => {
        const nextMultiple = val === 'multiple';
        if (allowMultiple === nextMultiple) return;

        setAllowMultiple(nextMultiple);
        if (!nextMultiple && activeHotspots.length > 1) {
            setActiveHotspots([activeHotspots[activeHotspots.length - 1]]);
        }
    };

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden bg-muted border border-border relative">
            {/* HUD */}
            <div className="absolute top-4 left-4 z-10 w-64 pointer-events-auto">
                <h3 className="text-xl font-bold font-sans text-foreground tracking-tight">Interactive Details</h3>
                <p className="text-sm text-muted-foreground font-sans mb-3">Click the markers to zoom in and learn more.</p>

                <div className="flex flex-col gap-2 bg-card/80 backdrop-blur-md p-3 rounded-lg border border-border shadow-xl">
                    <label className="text-xs font-semibold text-muted-foreground tracking-wider">
                        SELECTION MODE
                    </label>
                    <Select
                        value={allowMultiple ? "multiple" : "single"}
                        onValueChange={handleModeChange}
                    >
                        <SelectTrigger className="w-full h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="single">Single Selection</SelectItem>
                            <SelectItem value="multiple">Multiple Selection</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 3D Canvas — fills the card */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Suspense fallback={null}>
                        <Environment files="/hdri/lebombo_1k.hdr" />
                        <Scene
                            modelPath={modelPath}
                            activeHotspots={activeHotspots}
                            setActiveHotspots={setActiveHotspots}
                            allowMultiple={allowMultiple}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
