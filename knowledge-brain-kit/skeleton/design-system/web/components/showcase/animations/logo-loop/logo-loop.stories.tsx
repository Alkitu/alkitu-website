import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import LogoLoop from './logo-loop';
import type { LogoItem } from './logo-loop';
import {
    Figma, Github, Globe, Zap, Box, Layers, Cpu, Database,
    Cloud, Shield, Gauge, Sparkles
} from 'lucide-react';

const iconStyle = { width: '28px', height: '28px', color: 'currentColor' };

const TECH_LOGOS: LogoItem[] = [
    { node: <Figma style={iconStyle} />, title: 'Figma' },
    { node: <Github style={iconStyle} />, title: 'GitHub' },
    { node: <Globe style={iconStyle} />, title: 'Web' },
    { node: <Zap style={iconStyle} />, title: 'GSAP' },
    { node: <Box style={iconStyle} />, title: 'Three.js' },
    { node: <Layers style={iconStyle} />, title: 'Radix UI' },
    { node: <Cpu style={iconStyle} />, title: 'TypeScript' },
    { node: <Database style={iconStyle} />, title: 'Storybook' },
    { node: <Cloud style={iconStyle} />, title: 'Vercel' },
    { node: <Shield style={iconStyle} />, title: 'Security' },
    { node: <Gauge style={iconStyle} />, title: 'Performance' },
    { node: <Sparkles style={iconStyle} />, title: 'Effects' },
];

const meta: Meta<typeof LogoLoop> = {
    title: 'Showcase/Animations/Logo Loop',
    component: LogoLoop,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Infinite marquee/ticker for logos or icons using pure RAF animation. Supports horizontal & vertical directions, smooth velocity, fade-out edges. Fully adaptive to light and dark mode via `currentColor`.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof LogoLoop>;

export const Horizontal: Story = {
    render: (args) => (
        <div className="py-16 bg-background flex flex-col gap-10">
            <div className="flex flex-col gap-2 px-8">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Left →</p>
            </div>
            <div className="text-foreground">
                <LogoLoop {...args} logos={TECH_LOGOS} direction="left" />
            </div>
            <div className="flex flex-col gap-2 px-8">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">← Right</p>
            </div>
            <div className="text-foreground">
                <LogoLoop {...args} logos={TECH_LOGOS} direction="right" />
            </div>
        </div>
    ),
    args: {
        speed: 80,
        logoHeight: 28,
        gap: 48,
        fadeOut: true,
        scaleOnHover: true,
        hoverSpeed: 0,
        ariaLabel: 'Tech stack logos',
    },
    argTypes: {
        direction: { control: 'select', options: ['left', 'right', 'up', 'down'] },
        speed: { control: { type: 'range', min: 10, max: 500, step: 10 } },
        logoHeight: { control: { type: 'range', min: 16, max: 80, step: 4 } },
        gap: { control: { type: 'range', min: 8, max: 200, step: 8 } },
        fadeOut: { control: 'boolean' },
        scaleOnHover: { control: 'boolean' },
        hoverSpeed: { control: { type: 'range', min: 0, max: 500, step: 10 } },
    }
};
