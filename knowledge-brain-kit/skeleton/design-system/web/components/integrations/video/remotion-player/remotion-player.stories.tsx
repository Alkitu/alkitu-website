import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RemotionPlayer } from './remotion-player';

const meta = {
    title: 'Integrations/Video/Remotion Player',
    component: RemotionPlayer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        templateId: {
            control: 'select',
            options: ['FeaturePromo', 'QuoteReel'],
        },
    },
} satisfies Meta<typeof RemotionPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeaturePromoTemplate: Story = {
    args: {
        templateId: 'FeaturePromo',
        width: 800,
        autoPlay: true,
        controls: true,
        loop: true,
        inputProps: {
            title: 'Design System 2.0',
            subtitle: 'Build faster with absolute consistency.',
            features: [
                'Dark Mode First',
                'Advanced Typography',
                'Interactive WebGL',
                'Fully Accessible',
            ],
            primaryColor: 'var(--primary)',
            brandName: '[BRAND]',
        },
    },
};

export const QuoteReelTemplate: Story = {
    args: {
        templateId: 'QuoteReel',
        width: 400, // Narrow width for vertical video
        autoPlay: true,
        controls: true,
        loop: true,
        inputProps: {
            quote: 'Great things are not done by impulse, but by a series of small things brought together.',
            author: 'Vincent Van Gogh',
            accentColor: 'var(--primary)',
        },
    },
};
