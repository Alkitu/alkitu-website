import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ReflectiveCard } from './reflective-card';
import { Zap, Shield, Cpu, Lock } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Reflective Card',
    component: ReflectiveCard,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ReflectiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// A feature card layout to show off the reflection mapping
const FeatureCard = ({ title, desc, icon, glow, border }: any) => (
    <ReflectiveCard
        glowColor={glow}
        borderColor={border}
        className="w-[320px] h-[400px] flex flex-col justify-between p-8 bg-black border-neutral-800"
    >
        <div className="h-14 w-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white mb-6">
            {icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-neutral-400 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    </ReflectiveCard>
);

export const Default: Story = {
    render: () => (
        <div className="w-full h-full bg-black p-12 min-h-[600px] flex items-center justify-center">
            <FeatureCard
                title="Hyper Performance"
                desc="Engineered from the ground up to render at maximum framerates without compromising visual fidelity."
                icon={<Zap size={24} />}
                glow="rgba(255, 255, 255, 0.15)"
                border="rgba(255, 255, 255, 0.4)"
            />
        </div>
    )
};

export const ColorVariants: Story = {
    render: () => (
        <div className="w-full h-full bg-black p-12 min-h-[600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
                title="End-to-End Encryption"
                desc="Your data is shielded before it ever leaves your device using military-grade cryptographic protocols."
                icon={<Lock size={24} className="text-emerald-400" />}
                glow="rgba(52, 211, 153, 0.15)" // emerald-400
                border="rgba(52, 211, 153, 0.5)"
            />
            <FeatureCard
                title="Neural Engine"
                desc="Trained on massive datasets to anticipate your needs before you even realize you have them."
                icon={<Cpu size={24} className="text-indigo-400" />}
                glow="rgba(129, 140, 248, 0.15)" // indigo-400
                border="rgba(129, 140, 248, 0.5)"
            />
            <FeatureCard
                title="Quantum Resilience"
                desc="Prepared for the computational thresholds of tomorrow, keeping your infrastructure secure against future threats."
                icon={<Shield size={24} className="text-rose-400" />}
                glow="rgba(251, 113, 133, 0.15)" // rose-400
                border="rgba(251, 113, 133, 0.5)"
            />
        </div>
    )
};
