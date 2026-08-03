/**
 * Foundations / Image Gallery
 *
 * A centralized gallery backed by `public/gallery/`.
 * Add your images to that directory and they appear here automatically.
 *
 * All images in Storybook should live in and reference `public/gallery/`.
 *
 * Current gallery contents:
 *   landscape-01-valley.png    — aerial mountain valley, golden hour
 *   landscape-02-forest.png   — misty autumn forest path
 *   landscape-03-coastal.png  — coastal cliffs at sunset
 *   landscape-04-mountain.png — snow-capped peak above clouds
 *   landscape-05-beach.png    — tropical beach, turquoise water
 *   landscape-06-desert.png   — sand dunes at sunrise
 *   landscape-07-aurora.png   — northern lights aurora borealis
 *   tech-01-laptop.png        — minimal dev workspace
 *   avatar-01-woman.png       — professional portrait avatar
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';

// ── Manifest ─────────────────────────────────────────────────────────────────
// When you add an image to public/gallery/, add an entry here.
const GALLERY_IMAGES: { src: string; alt: string; category: string }[] = [
    { src: '/gallery/landscape-01-valley.png', alt: 'Aerial mountain valley', category: 'landscape' },
    { src: '/gallery/landscape-02-forest.png', alt: 'Misty autumn forest', category: 'landscape' },
    { src: '/gallery/landscape-03-coastal.png', alt: 'Coastal cliffs sunset', category: 'landscape' },
    { src: '/gallery/landscape-04-mountain.png', alt: 'Snow mountain above clouds', category: 'landscape' },
    { src: '/gallery/landscape-05-beach.png', alt: 'Tropical beach', category: 'landscape' },
    { src: '/gallery/landscape-06-desert.png', alt: 'Sand dunes at sunrise', category: 'landscape' },
    { src: '/gallery/landscape-07-aurora.png', alt: 'Northern lights aurora', category: 'landscape' },
    { src: '/gallery/tech-01-laptop.png', alt: 'Developer workspace', category: 'tech' },
    { src: '/gallery/avatar-01-woman.png', alt: 'Professional portrait', category: 'avatars' },
];

const ALL_CATEGORIES = ['all', ...Array.from(new Set(GALLERY_IMAGES.map(i => i.category)))];

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onPrev, onNext }: {
    images: typeof GALLERY_IMAGES;
    index: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const img = images[index];
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                onClick={e => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <X size={20} />
            </button>
            <button
                onClick={e => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            <img
                src={img.src}
                alt={img.alt}
                className="max-w-[85vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={e => e.stopPropagation()}
            />
            <button
                onClick={e => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 text-white/60 text-sm">
                {img.alt} &nbsp;·&nbsp; {index + 1} / {images.length}
            </div>
        </div>
    );
}

// ── Gallery Component ─────────────────────────────────────────────────────────
function ImageGallery() {
    const [category, setCategory] = useState('all');
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    const filtered = category === 'all'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter(i => i.category === category);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Image Gallery</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    All images used across design system stories live in{' '}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">public/gallery/</code>.
                    Drop new files there to add them here.
                </p>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
                {ALL_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize',
                            category === cat
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground',
                        )}
                    >
                        {cat === 'all' ? `All (${GALLERY_IMAGES.length})` : `${cat} (${GALLERY_IMAGES.filter(i => i.category === cat).length})`}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img, i) => (
                    <button
                        key={img.src}
                        className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-square cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-ring"
                        onClick={() => setLightboxIdx(GALLERY_IMAGES.indexOf(img))}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {/* Caption */}
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                            <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                            <p className="text-white/60 text-[10px] font-mono truncate">{img.src.split('/').pop()}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <Lightbox
                    images={GALLERY_IMAGES}
                    index={lightboxIdx}
                    onClose={() => setLightboxIdx(null)}
                    onPrev={() => setLightboxIdx(i => (i! - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
                    onNext={() => setLightboxIdx(i => (i! + 1) % GALLERY_IMAGES.length)}
                />
            )}
        </div>
    );
}

// ── Storybook meta ────────────────────────────────────────────────────────────
const meta: Meta = {
    title: 'Foundations/Image Gallery',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
**Single source of truth for all design system images.**

Add images to \`public/gallery/\`, update the \`GALLERY_IMAGES\` manifest in this story, and they become available to all components. No external image URLs (Unsplash, Picsum, GitHub avatars) should be used anywhere in Storybook.

Click any image to open the lightbox viewer.
                `.trim(),
            },
        },
    },
};
export default meta;

export const Gallery: StoryObj = {
    render: () => <ImageGallery />,
};
