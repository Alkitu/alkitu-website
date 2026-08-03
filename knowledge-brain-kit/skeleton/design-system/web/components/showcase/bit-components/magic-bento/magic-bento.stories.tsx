import type { Meta, StoryObj } from '@storybook/react';
import { MagicBento, BentoItem } from './magic-bento';
import { ChartBar, Layers, Zap, Shield, Sparkles } from 'lucide-react';

const meta = {
    title: 'Showcase/Bit Components/Magic Bento',
    component: MagicBento,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {}
} satisfies Meta<typeof MagicBento>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: null
    },
    render: () => (
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
            <MagicBento>
                <BentoItem colSpan={2} rowSpan={2} className="justify-between">
                    <div>
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <ChartBar className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Advanced Analytics</h3>
                        <p className="text-zinc-600 dark:text-zinc-400">Deep dive into your data with our powerful analytics engine. Track everything in real-time.</p>
                    </div>
                </BentoItem>
                <BentoItem colSpan={2} className="justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Seamless Integration</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Connect with your favorite tools in seconds.</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                </BentoItem>
                <BentoItem className="justify-center items-center text-center">
                    <div className="w-12 h-12 bg-amber-500/20 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Lightning Fast</h3>
                </BentoItem>
                <BentoItem className="justify-center items-center text-center">
                    <div className="w-12 h-12 bg-violet-500/20 text-violet-500 dark:text-violet-400 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Enterprise Security</h3>
                </BentoItem>
            </MagicBento>
        </div>
    ),
};
