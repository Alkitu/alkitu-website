import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import GradualBlur from './gradual-blur';

// Long list of items to create actual scroll overflow
const ITEMS = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Design Token #${i + 1}`,
    description: [
        'Semantic color variables power adaptive theming across all components.',
        'Spacing scales maintain visual rhythm and balanced layouts.',
        'The type scale ensures consistent hierarchy across every screen.',
        'Border radius tokens align corner styles with the brand personality.',
        'Shadow tokens define depth and elevation in the design system.',
        'Motion tokens ensure consistent timing and easing functions.',
    ][i % 6],
}));

const meta: Meta<typeof GradualBlur> = {
    title: 'Showcase/Animations/Gradual Blur',
    component: GradualBlur,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `**GradualBlur** overlays a progressive \`backdrop-filter: blur()\` mask at the edge of a \`position: relative\` container that clips its overflow.

**Usage pattern:**
\`\`\`tsx
<section style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
  <div style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
    {/* long content */}
  </div>
  <GradualBlur position="bottom" height="7rem" strength={2} />
</section>
\`\`\`

The blur sits **absolutely** on top of the scroller and blurs whatever content is underneath it at that edge — indicating that there is more content beyond what's visible.`,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof GradualBlur>;

// ─── Bottom Blur (most common use case) ─────────────────────────

export const BottomFade: Story = {
    name: 'Bottom Fade (Scroll Down Hint)',
    render: (args) => (
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Scroll inside the box ↓
            </p>
            {/* THIS IS THE CORRECT USAGE: position:relative + overflow:hidden */}
            <section style={{ position: 'relative', height: 380, width: 360, overflow: 'hidden', borderRadius: 16 }}
                className="border border-border bg-card"
            >
                {/* Scrollable content container */}
                <div style={{ height: '100%', overflowY: 'auto', padding: '1.5rem' }}>
                    {ITEMS.map(item => (
                        <div key={item.id} className="mb-4 p-3 rounded-lg border border-border bg-background">
                            <p className="font-semibold text-foreground text-sm">{item.title}</p>
                            <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* GradualBlur overlaid at the bottom edge */}
                <GradualBlur {...args} position="bottom" />
            </section>
        </div>
    ),
    args: {
        position: 'bottom',
        strength: 2,
        height: '7rem',
        divCount: 5,
        curve: 'bezier',
        exponential: false,
        opacity: 1,
        target: 'parent',
    },
    argTypes: {
        position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
        curve: { control: 'select', options: ['linear', 'bezier', 'ease-in', 'ease-out', 'ease-in-out'] },
        strength: { control: { type: 'range', min: 0.5, max: 8, step: 0.5 } },
        divCount: { control: { type: 'range', min: 2, max: 16, step: 1 } },
        opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
        exponential: { control: 'boolean' },
        height: { control: 'text' },
    }
};

// ─── Top + Bottom (both edges) ──────────────────────────────────

export const BothEdges: Story = {
    name: 'Top + Bottom (Both Edges)',
    render: () => (
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Scroll — blur fades at both ends
            </p>
            <section style={{ position: 'relative', height: 380, width: 360, overflow: 'hidden', borderRadius: 16 }}
                className="border border-border bg-card"
            >
                <div style={{ height: '100%', overflowY: 'auto', padding: '1.5rem' }}>
                    {ITEMS.map(item => (
                        <div key={item.id} className="mb-4 p-3 rounded-lg border border-border bg-background">
                            <p className="font-semibold text-foreground text-sm">{item.title}</p>
                            <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
                <GradualBlur position="bottom" strength={2} height="6rem" curve="bezier" divCount={5} />
                <GradualBlur position="top" strength={2} height="4rem" curve="ease-out" divCount={4} />
            </section>
        </div>
    ),
};

// ─── Presets showcase ───────────────────────────────────────────

export const Presets: Story = {
    name: 'Presets Comparison',
    render: () => (
        <div className="flex flex-wrap gap-6 justify-center p-8 bg-background">
            {(['subtle', 'intense', 'smooth', 'sharp', 'footer'] as const).map(preset => (
                <div key={preset} className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">{preset}</p>
                    <section style={{ position: 'relative', height: 220, width: 200, overflow: 'hidden', borderRadius: 12 }}
                        className="border border-border bg-card"
                    >
                        <div style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
                            {ITEMS.slice(0, 12).map(item => (
                                <div key={item.id} className="mb-3 p-2 rounded border border-border bg-background">
                                    <p className="text-foreground text-xs font-medium">{item.title}</p>
                                </div>
                            ))}
                        </div>
                        <GradualBlur preset={preset} position="bottom" />
                    </section>
                </div>
            ))}
        </div>
    ),
};

// ─── Horizontal (Left / Right) ──────────────────────────────────

export const HorizontalFade: Story = {
    name: 'Horizontal Fade (Left / Right)',
    render: () => (
        <div className="flex flex-col items-center gap-4 p-8 bg-background">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">
                Horizontal scroll — blur at right edge
            </p>
            <section style={{ position: 'relative', height: 120, width: 420, overflow: 'hidden', borderRadius: 12 }}
                className="border border-border bg-card"
            >
                <div style={{ height: '100%', overflowX: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '0 1rem', whiteSpace: 'nowrap' }}>
                    {ITEMS.map(item => (
                        <div key={item.id} style={{ flexShrink: 0, width: 140 }}
                            className="p-3 rounded-lg border border-border bg-background"
                        >
                            <p className="text-foreground text-xs font-semibold">{item.title}</p>
                        </div>
                    ))}
                </div>
                <GradualBlur position="right" strength={2} height="8rem" curve="bezier" divCount={6} />
                <GradualBlur position="left" strength={1.5} height="5rem" curve="ease-out" divCount={4} />
            </section>
        </div>
    ),
};
