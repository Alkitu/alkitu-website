"use client";

import React, { Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stage, Html, Center } from '@react-three/drei';
import { GLTFExporter, SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { Download } from 'lucide-react';
import { Button } from '~/components/primitives/button';
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

function ExporterButton() {
    const { scene } = useThree();

    const exportGLTF = () => {
        const exporter = new GLTFExporter();

        exporter.parse(
            scene,
            (gltf) => {
                const output = JSON.stringify(gltf, null, 2);
                const blob = new Blob([output], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.download = 'exported-model.gltf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            },
            (error) => {
                console.error('An error happened during export:', error);
            },
            { binary: false, onlyVisible: true }
        );
    };

    return (
        <Html prepend fullscreen zIndexRange={[100, 0]}>
            <div className="absolute top-4 left-4 z-10 w-96 pointer-events-auto">
                <h3 className="text-xl font-bold font-sans text-foreground tracking-tight">GLTF Exporter</h3>
                <p className="text-muted-foreground text-sm mb-4">Export the modified model as a new file.</p>
                <Button
                    onClick={exportGLTF}
                    iconLeft={<Download className="h-4 w-4" />}
                >
                    Download Exported GLTF
                </Button>
            </div>
        </Html>
    );
}

// The Html component is now imported at the top

export default function ModelExporter({ modelPath, className }: { modelPath: string; className?: string }) {
    return (
        <div className={cn("w-full h-[600px] rounded-lg overflow-hidden bg-muted border border-border", className)}>
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment files="/hdri/studio_small_03_1k.hdr" />
                    <Stage preset="portrait" intensity={0.5} environment={{ files: '/hdri/studio_small_03_1k.hdr' }}>
                        <Model modelPath={modelPath} />
                    </Stage>

                    <ExporterButton />

                    <OrbitControls autoRotate />
                </Suspense>
            </Canvas>
        </div>
    );
}
