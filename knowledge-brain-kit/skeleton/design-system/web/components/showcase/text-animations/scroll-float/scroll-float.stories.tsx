import type { Meta, StoryObj } from '@storybook/react';
import { ScrollFloat } from './scroll-float';

const meta: Meta<typeof ScrollFloat> = {
    title: 'Showcase/Text Animations/Scroll Float',
    component: ScrollFloat,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: "Per-character scroll-driven text animation using GSAP ScrollTrigger with 3D perspective, blur, and scale.",
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ScrollFloat>;

export const Default: Story = {
    render: (args) => (
        <div className="flex flex-col bg-background overflow-x-hidden min-h-[500px]">
            <div className="p-12 pb-64 text-center">
                <p className="text-muted-foreground">Scroll down slowly to see the text animate in</p>
            </div>

            <div className="text-6xl font-black tracking-tighter text-foreground uppercase text-center py-64">
                <ScrollFloat {...args} />
            </div>

            <div className="h-[50vh]" />
        </div>
    ),
    args: {
        children: "Don't just satisfice",
        animationDuration: 1,
        ease: "back.inOut(2)",
        scrollStart: "center bottom+=50%",
        scrollEnd: "bottom bottom-=40%",
        stagger: 0.03,
    },
    argTypes: {
        animationDuration: { control: { type: 'range', min: 0.1, max: 3, step: 0.1 } },
        stagger: { control: { type: 'range', min: 0.01, max: 0.1, step: 0.01 } },
    },
};
