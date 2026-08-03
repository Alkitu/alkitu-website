"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

declare global {
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'model-viewer': any;
            }
        }
    }
}

export default function ModelAR({ modelPath, className }: { modelPath: string; className?: string }) {
    // We suppress hydration warnings and prevent Vite Three.js conflicts 
    // by injecting the pre-compiled standalone script.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!document.querySelector('script[src*="model-viewer"]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
            document.head.appendChild(script);
        }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={cn("w-full h-[600px] rounded-lg overflow-hidden bg-muted border border-border relative", className)}>
            {/* Standardized HUD */}
            <div className="absolute top-4 left-4 z-10 w-96 pointer-events-auto">
                <h3 className="text-xl font-bold font-sans text-foreground tracking-tight">AR Capabilities</h3>
                <div className="mt-2 flex flex-col gap-2 bg-card/80 backdrop-blur-md p-3 rounded-lg border border-border shadow-xl">
                    <p className="text-sm font-medium text-foreground">
                        Powered by Google&apos;s <code>&lt;model-viewer&gt;</code>
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Documentation Note:</strong> Use this specific component architecture
                        <em> only</em> when Augmented Reality (AR) functionality natively in the browser
                        or via Quick Look / Scene Viewer is absolutely required.
                        Otherwise, default to React Three Fiber architectures for staging.
                    </p>
                </div>
            </div>

            {/* Model Viewer canvas covering the background */}
            <div className="absolute inset-0 z-0">
                <model-viewer
                    src={modelPath}
                    alt="A 3D model with AR capabilities"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    exposure="1"
                    class="w-full h-full"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <button
                        slot="ar-button"
                        className="absolute bottom-4 right-4 bg-white text-neutral-900 px-6 py-3 rounded-full shadow-lg font-semibold flex items-center gap-2 hover:bg-neutral-50 hover:scale-105 transition-all"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 16V18C4 19.1046 4.89543 20 6 20H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 4H18C19.1046 4 20 4.89543 20 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 10L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 10L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        View in your space
                    </button>
                </model-viewer>
            </div>
        </div>
    );
}
