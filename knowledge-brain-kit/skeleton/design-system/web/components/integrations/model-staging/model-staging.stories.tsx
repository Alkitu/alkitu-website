import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Importing all the advanced R3F staging pieces
import ModelWithPoster from './model-poster';
import ModelScrollSync from './model-scroll-sync';
import ModelHotspots from './model-hotspots';
import ModelSkybox from './model-skybox';
import ModelExporter from './model-exporter';
import ModelVariants from './model-variants';
import ModelAnimations from './model-animations';
import ModelPostProcess from './model-post-process';
import ModelAR from './model-ar';

const meta = {
    title: 'Integrations/Model Staging/Advanced Features',
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 3D model used across all examples
import robotUrl from '../../foundations/model-viewer/RobotExpressive.glb?url';

export const PosterUntilLoaded: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Display Poster Until Loaded</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                A common e-commerce pattern. Shows a static image immediately and only loads the heavy 3D asset
                when the user interacts with it, saving bandwidth.
            </p>
            <ModelWithPoster
                modelPath={robotUrl}
                posterSrc="/assets/3d-posters/RobotExpressive.webp"
            />
        </div>
    )
};

export const ScrollSyncCamera: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Scroll Sync</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Uses R3F ScrollControls. Scroll down effectively inside the 3D canvas box to see the model rotate and bob.
            </p>
            <ModelScrollSync modelPath={robotUrl} />
        </div>
    )
};

export const InteractiveHotspots: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Interactive Hotspots (Annotations)</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Project HTML elements onto 3D coordinates. They scale naturally but always face the camera.
            </p>
            <ModelHotspots modelPath={robotUrl} />
        </div>
    )
};

export const GroundProjectedSkybox: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Ground-projected Skybox</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Instead of a floating environment, the HDRI is projected onto a fake ground plane, grounding the object.
            </p>
            <ModelSkybox modelPath={robotUrl} />
        </div>
    )
};

export const GLTFSceneExporter: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">GLTF Exporter</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Modify or stage models in the browser and download the resulting scene as a new GLTF file.
            </p>
            <ModelExporter modelPath={robotUrl} />
        </div>
    )
};

export const MaterialVariants: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Swap Model Variants</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Reads `KHR_materials_variants` extension embedded in the GLTF file to swap textures and materials natively.
                (Note: RobotExpressive model might not have embedded variants).
            </p>
            <ModelVariants modelPath={robotUrl} />
        </div>
    )
};

export const SkeletalAnimations: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Trigger GLTF Animations</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Extracts and plays animation clips baked into the model using the R3F `useAnimations` hook with smooth cross-fading.
            </p>
            <ModelAnimations modelPath={robotUrl} />
        </div>
    )
};

export const PostProcessEffects: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Post Processing Pipeline</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                High-end screen-space effects like Bloom, Glitch, and Chromatic Aberration applied over the 3D canvas.
            </p>
            <ModelPostProcess modelPath={robotUrl} />
        </div>
    )
};

export const AROption: Story = {
    render: () => (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 font-sans">Augmented Reality (AR) Support</h2>
            <p className="text-muted-foreground mb-6 font-sans">
                Displays a 3D model using Google&apos;s <code>&lt;model-viewer&gt;</code> component,
                specifically configured to offer an AR button for mobile devices (Quick Look / Scene Viewer).
            </p>
            <ModelAR modelPath={robotUrl} />
        </div>
    )
};
