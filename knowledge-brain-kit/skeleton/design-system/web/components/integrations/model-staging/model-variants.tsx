"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stage, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function ShoeScene({
    modelPath,
    variantName,
    onVariantsLoaded,
}: {
    modelPath: string;
    variantName: string | null;
    onVariantsLoaded: (variants: string[]) => void;
}) {
    const gltf = useGLTF(modelPath);
    const { scene, parser } = gltf;

    // ── Variant discovery via parser.json (the raw GLTF JSON before it was transformed)
    // `gltf.extensions` is NOT on the return type from Drei — must go through parser.json
    useEffect(() => {
        const ext = (parser as any).json?.extensions?.KHR_materials_variants;
        if (ext?.variants) {
            const names: string[] = ext.variants.map((v: any) => v.name);
            onVariantsLoaded(names);
        }
    }, [parser, onVariantsLoaded]);

    // ── Apply a variant by finding the correct mapping on each mesh primitive
    useEffect(() => {
        if (!variantName || !parser) return;

        const rawVariants: { name: string }[] = (parser as any).json?.extensions?.KHR_materials_variants?.variants ?? [];
        const variantIndex = rawVariants.findIndex((v) => v.name === variantName);
        if (variantIndex < 0) return;

        scene.traverse(async (object: any) => {
            if (!object.isMesh) return;

            // Three.js stores per-primitive extension data in userData.gltfExtensions
            const meshExt = object.userData?.gltfExtensions?.['KHR_materials_variants'];
            if (!meshExt) return;

            const mapping = meshExt.mappings.find((m: any) => m.variants.includes(variantIndex));
            if (mapping != null) {
                const material = await (parser as any).getDependency('material', mapping.material);
                object.material = material;
                (material as THREE.Material).needsUpdate = true;
            }
        });
    }, [variantName, scene, parser]);

    return (
        <Stage preset="portrait" intensity={0.5} environment={{ files: '/hdri/studio_small_03_1k.hdr' }}>
            <primitive object={scene} />
        </Stage>
    );
}

import { Button } from '~/components/primitives/button';
import { cn } from '~/lib/utils';

export default function ModelVariants({ modelPath }: { modelPath: string }) {
    const [variants, setVariants] = useState<string[]>([]);
    const [currentVariant, setCurrentVariant] = useState<string | null>(null);

    return (
        <div className="w-full h-[600px] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative">
            {/* HUD */}
            <div className="absolute top-4 left-4 z-10 w-96">
                <h3 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">Material Variants</h3>
                {variants.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {variants.map((v) => (
                            <Button
                                key={v}
                                variant={currentVariant === v ? "default" : "outline"}
                                onClick={() => setCurrentVariant(v)}
                                className={cn(
                                    "capitalize transition-all",
                                    currentVariant === v ? "shadow-md" : "bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                                )}
                            >
                                {v}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500 mt-2">Loading variants…</p>
                )}
            </div>

            {/* Canvas */}
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 25 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdri/studio_small_03_1k.hdr" />
                    <Stage preset="portrait" intensity={0.5} environment={{ files: '/hdri/studio_small_03_1k.hdr' }} adjustCamera={1.2}>
                        <ShoeScene
                            modelPath={modelPath}
                            variantName={currentVariant}
                            onVariantsLoaded={(names) => {
                                setVariants(names);
                                if (!currentVariant && names.length > 0) {
                                    setCurrentVariant(names[0]);
                                }
                            }}
                        />
                    </Stage>
                    <OrbitControls autoRotate autoRotateSpeed={0.5} />
                </Suspense>
            </Canvas>
        </div>
    );
}
