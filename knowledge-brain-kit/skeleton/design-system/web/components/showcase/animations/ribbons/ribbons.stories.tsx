import type { Meta, StoryObj } from '@storybook/react';
import { Ribbons } from './ribbons';

const meta = {
    title: 'Showcase/Animations/Ribbons',
    component: Ribbons,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        baseThickness: { control: { type: 'range', min: 10, max: 100, step: 1 } },
        speedMultiplier: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
        maxAge: { control: { type: 'number' } },
        enableFade: { control: 'boolean' },
        enableShaderEffect: { control: 'boolean' },
        effectAmplitude: { control: { type: 'range', min: 1, max: 10, step: 0.5 } },
    }
} satisfies Meta<typeof Ribbons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-background border flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-4xl lg:text-7xl font-black text-white text-center tracking-tighter mb-4 z-10 pointer-events-none mix-blend-difference">
                Ogl Ribbons
            </h1>
            <p className="text-white z-10 pointer-events-none text-center mix-blend-difference opacity-80 max-w-lg">
                High-performance WebGL ribbons trailing the mouse pointer using <b>ogl</b>.
            </p>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Ribbons {...args} />
            </div>
        </div>
    ),
    args: {
        // We inject our design system brand colors instead of default ones for the wow-factor
        colors: ["#5227FF", "#2E90FA", "#EC175A", "#F79009"],
        baseThickness: 30,
        speedMultiplier: 0.5,
        maxAge: 500,
        enableFade: false,
        enableShaderEffect: false,
    }
};

export const LiquidShader: Story = {
    render: (args) => (
        <div className="w-full h-screen relative bg-foreground border flex flex-col items-center justify-center overflow-hidden">
            <h1 className="text-4xl lg:text-7xl font-black text-white text-center tracking-tighter mb-4 z-10 pointer-events-none mix-blend-difference">
                Liquid Wavy Ribbons
            </h1>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Ribbons {...args} />
            </div>
        </div>
    ),
    args: {
        colors: ["#EC175A", "#F79009", "#15B79E", "#7A5AF8"],
        baseThickness: 45,
        speedMultiplier: 0.8,
        maxAge: 300,
        enableFade: true,
        enableShaderEffect: true,
        effectAmplitude: 4,
    }
};
