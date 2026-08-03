import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardNav } from './card-nav';

const meta = {
    title: 'Showcase/Bit Components/Card Nav',
    component: CardNav,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof CardNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample dummy text for tabs
const dummyContent = {
    overview: (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
                The centralized command center for all your microservices. Monitor active connections, gauge overall system health, and instantly identify bottlenecks before they affect the end-user experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-mono text-sm text-muted-foreground">
                        Metric {i}
                    </div>
                ))}
            </div>
        </div>
    ),
    security: (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Security Protocol</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
                Active monitoring of all incoming traffic. Zero-day exploits are automatically quarantined in heavily isolated Docker containers before they can scan our primary database shards.
            </p>
            <div className="w-full h-48 mt-8 border-2 border-dashed border-rose-500/20 bg-rose-500/5 rounded-xl flex items-center justify-center text-rose-500/50 font-medium tracking-widest uppercase">
                Zero breaches detected
            </div>
        </div>
    ),
    performance: (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Performance Tuning</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
                Real-time analysis of the V8 engine garbage collection cycles. Adjusting the heap limits dynamically via our proprietary scaling solution guarantees sub-50ms latency globally.
            </p>
            <div className="space-y-2 mt-8">
                <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
                <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[60%]" />
                </div>
            </div>
        </div>
    ),
    integrations: (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Third-party Integrations</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
                Seamlessly connect with over 150+ external APIs spanning payment gateways, continuous integration pipelines, and customer support channels.
            </p>
        </div>
    )
};

export const Default: Story = {
    args: {} as any,
    render: () => (
        <div className="w-full max-w-4xl mx-auto py-12">
            <CardNav
                items={[
                    { id: 'overview', label: 'Overview', content: dummyContent.overview },
                    { id: 'security', label: 'Security & Auth', content: dummyContent.security },
                    { id: 'performance', label: 'Performance', content: dummyContent.performance },
                    { id: 'integrations', label: 'Integrations', content: dummyContent.integrations },
                ]}
            />
        </div>
    )
};
