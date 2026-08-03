import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SvgViewport } from './svg/svg-viewport';
import { SvgGrid } from './svg/svg-grid';
import { SvgControls } from './svg/svg-controls';
import { useViewport } from './hooks/use-viewport';
import { getAllStateTokens } from './utils/state-colors';
import type { VenueElementState } from './types';

const meta: Meta = {
  title: 'Integrations/Spatial/Venue Core',
};
export default meta;

// ---------------------------------------------------------------------------
// SVG Viewport with Grid and Controls
// ---------------------------------------------------------------------------

export const Viewport: StoryObj = {
  render: () => {
    function ViewportDemo() {
      const viewport = useViewport();
      return (
        <div className="relative w-full h-[400px]">
          <SvgViewport viewBox="0 0 400 300" className="w-full h-full">
            <SvgGrid size={20} />
            <circle cx={200} cy={150} r={40} fill="var(--primary)" opacity={0.5} />
            <rect x={80} y={100} width={60} height={40} rx={4} fill="var(--success)" opacity={0.5} />
            <rect x={260} y={100} width={60} height={40} rx={4} fill="var(--warning)" opacity={0.5} />
            <text x={200} y={150} textAnchor="middle" dominantBaseline="central" fill="var(--primary-foreground)" fontSize={12}>
              Pan & Zoom
            </text>
          </SvgViewport>
          <SvgControls
            onZoomIn={viewport.zoomIn}
            onZoomOut={viewport.zoomOut}
            onReset={viewport.resetView}
            zoom={viewport.state.zoom}
          />
        </div>
      );
    }
    return <ViewportDemo />;
  },
};

// ---------------------------------------------------------------------------
// State Color Tokens
// ---------------------------------------------------------------------------

export const StateColors: StoryObj = {
  render: () => {
    const allTokens = getAllStateTokens();
    const states: VenueElementState[] = ['available', 'occupied', 'selected', 'disabled', 'reserved', 'hover'];

    return (
      <div className="flex flex-wrap gap-4 p-4">
        {states.map((state) => {
          const tokens = allTokens[state];
          return (
            <div key={state} className="flex flex-col items-center gap-2">
              <div
                className="w-16 h-16 rounded-lg border border-border flex items-center justify-center"
                style={{ backgroundColor: tokens.bg }}
              >
                <span style={{ color: tokens.fg }} className="text-xs font-medium">
                  {state.slice(0, 3).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">{state}</span>
            </div>
          );
        })}
      </div>
    );
  },
};
