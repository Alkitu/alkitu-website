"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, useGLTF, useAnimations } from '@react-three/drei';
import { cn } from '~/lib/utils';

function RobotScene({
    modelPath,
    currentAction,
    onActionsLoaded,
}: {
    modelPath: string;
    currentAction: string | null;
    onActionsLoaded: (names: string[]) => void;
}) {
    // Standard direct load. Since this is the only instance of RobotExpressive on the page,
    // we don't need complex SkeletonUtils.clone logic. The standard primitive works perfectly.
    const { scene, animations } = useGLTF(modelPath);
    const { actions, names } = useAnimations(animations, scene);

    useEffect(() => {
        if (names.length > 0) {
            onActionsLoaded(names);
        }
    }, [names, onActionsLoaded]);

    useEffect(() => {
        if (!currentAction || !actions[currentAction]) return;

        const next = actions[currentAction];

        // Fade out other running actions
        Object.entries(actions).forEach(([name, action]) => {
            if (name !== currentAction && action?.isRunning()) {
                action.fadeOut(0.3);
            }
        });

        next.reset().fadeIn(0.3).play();
    }, [currentAction, actions]);

    return (
        <Stage preset="rembrandt" intensity={0.5} environment={{ files: '/hdri/potsdamer_platz_1k.hdr' }}>
            <primitive object={scene} />
        </Stage>
    );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/primitives/select';

export default function ModelAnimations({ modelPath, className }: { modelPath: string; className?: string }) {
    const [animations, setAnimations] = useState<string[]>([]);
    const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

    const formatName = (name: string) => name.replace(/([A-Z])/g, ' $1').trim();

    return (
        <div className={cn("w-full h-[600px] rounded-lg overflow-hidden bg-background dark border border-border relative", className)}>
            {/* HUD with Dropdown instead of multiple buttons */}
            <div className="absolute top-4 left-4 z-10 w-64 bg-card/80 backdrop-blur-md border border-border p-4 rounded-lg shadow-2xl">
                <h3 className="text-xl font-bold font-sans text-card-foreground tracking-tight">Skeletal Animations</h3>
                <p className="text-muted-foreground text-sm mb-4">Select an animation from the GLTF file.</p>

                {animations.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Animation Clip
                        </label>
                        <Select
                            value={currentAnimation || ''}
                            onValueChange={(value) => setCurrentAnimation(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an animation" />
                            </SelectTrigger>
                            <SelectContent>
                                {animations.map((animName) => (
                                    <SelectItem key={animName} value={animName}>
                                        {formatName(animName)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Canvas */}
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdri/potsdamer_platz_1k.hdr" />
                    <RobotScene
                        modelPath={modelPath}
                        currentAction={currentAnimation}
                        onActionsLoaded={(names) => {
                            setAnimations(names);
                            // Auto-select Idle or the first animation
                            if (!currentAnimation && names.length > 0) {
                                const idle = names.find((n) => n.toLowerCase().includes('idle'));
                                const walk = names.find((n) => n.toLowerCase().includes('walk'));
                                setCurrentAnimation(idle || walk || names[0]);
                            }
                        }}
                    />
                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Preload to ensure smooth rendering if used elsewhere
useGLTF.preload('../../foundations/model-viewer/RobotExpressive.glb');
