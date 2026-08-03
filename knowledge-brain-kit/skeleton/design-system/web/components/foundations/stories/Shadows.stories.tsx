import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const shadows = [
    { name: 'shadow-2xs', tailwind: 'shadow-2xs', cssVar: '--shadow-2xs', value: '0 1px 0 0 rgba(0,0,0,0.05)' },
    { name: 'shadow-xs', tailwind: 'shadow-xs', cssVar: '--shadow-xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
    { name: 'shadow-sm', tailwind: 'shadow-sm', cssVar: '--shadow-sm', value: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' },
    { name: 'shadow-md', tailwind: 'shadow-md', cssVar: '--shadow-md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
    { name: 'shadow-lg', tailwind: 'shadow-lg', cssVar: '--shadow-lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
    { name: 'shadow-xl', tailwind: 'shadow-xl', cssVar: '--shadow-xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
    { name: 'shadow-2xl', tailwind: 'shadow-2xl', cssVar: '--shadow-2xl', value: '0 25px 50px 12px rgba(0,0,0,0.25)' },
];

const radii = [
    { name: 'rounded-xs', value: '2px', cssVar: '--radius-xs' },
    { name: 'rounded-sm', value: '4px', cssVar: '--radius-sm' },
    { name: 'rounded-md', value: '6px', cssVar: '--radius-md' },
    { name: 'rounded-lg', value: '8px', cssVar: '--radius-lg' },
    { name: 'rounded-xl', value: '12px', cssVar: '--radius-xl' },
    { name: 'rounded-2xl', value: '16px', cssVar: '--radius-2xl' },
    { name: 'rounded-3xl', value: '24px', cssVar: '--radius-3xl' },
    { name: 'rounded-full', value: '9999px', cssVar: '--radius-full' },
];

const ShadowCard = ({ shadow }: { shadow: typeof shadows[0] }) => (
    <div className="flex flex-col items-center gap-3">
        <div
            className="w-24 h-24 rounded-lg bg-card border border-border"
            style={{ boxShadow: shadow.value }}
        />
        <div className="text-center">
            <span className="text-sm font-medium text-foreground block">{shadow.name}</span>
            <span className="text-xs text-muted-foreground font-mono block">{shadow.tailwind}</span>
        </div>
    </div>
);

const RadiusCard = ({ radius }: { radius: typeof radii[0] }) => (
    <div className="flex flex-col items-center gap-3">
        <div
            className="w-20 h-20 bg-primary"
            style={{ borderRadius: radius.value }}
        />
        <div className="text-center">
            <span className="text-sm font-medium text-foreground block">{radius.name}</span>
            <span className="text-xs text-muted-foreground font-mono block">{radius.value}</span>
        </div>
    </div>
);

const AllShadowsAndRadii = () => (
    <div className="max-w-4xl space-y-10">
        <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Shadows &amp; Radii</h2>
            <p className="text-muted-foreground mb-6">
                Design tokens for elevation (box-shadow) and corner radius. Toggle theme to see how they appear on light/dark backgrounds.
            </p>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Box Shadows</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {shadows.map((shadow) => (
                    <ShadowCard key={shadow.name} shadow={shadow} />
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">Border Radius</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
                {radii.map((radius) => (
                    <RadiusCard key={radius.name} radius={radius} />
                ))}
            </div>
        </div>
    </div>
);

const meta: Meta = {
    title: 'Foundations/Shadows & Radii',
    component: AllShadowsAndRadii,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => <AllShadowsAndRadii />,
};
