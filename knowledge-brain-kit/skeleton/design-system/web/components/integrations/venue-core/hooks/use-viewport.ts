'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import type { Rect, ViewportConfig, ViewportState } from '../types';

// ---------------------------------------------------------------------------
// useViewport — pan/zoom hook for SVG-based venue maps
// ---------------------------------------------------------------------------

const DEFAULTS: Required<ViewportConfig> = {
  minZoom: 0.1,
  maxZoom: 5,
  initial: { x: 0, y: 0, zoom: 1 },
  zoomStep: 0.25,
};

/** Max pan distance (px) from origin — prevents losing the content entirely */
const PAN_LIMIT = 5000;

function clampPan(value: number): number {
  return Math.min(PAN_LIMIT, Math.max(-PAN_LIMIT, value));
}

export function useViewport(config?: ViewportConfig) {
  const opts = useMemo(
    () => ({ ...DEFAULTS, ...config, initial: { ...DEFAULTS.initial, ...config?.initial } }),
    // Config is typically a static object; shallow-compare key fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config?.minZoom, config?.maxZoom, config?.zoomStep, config?.initial?.x, config?.initial?.y, config?.initial?.zoom],
  );

  const [state, setState] = useState<ViewportState>({
    x: opts.initial.x ?? 0,
    y: opts.initial.y ?? 0,
    zoom: opts.initial.zoom ?? 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const clampZoom = useCallback(
    (z: number) => Math.min(opts.maxZoom, Math.max(opts.minZoom, z)),
    [opts.minZoom, opts.maxZoom],
  );

  // Gesture bindings -------------------------------------------------------

  const bind = useGesture(
    {
      onDrag: ({ delta: [dx, dy], event }) => {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          x: clampPan(prev.x + dx),
          y: clampPan(prev.y + dy),
        }));
      },
      onPinch: ({ offset: [scale], event }) => {
        event.preventDefault();
        setState((prev) => ({ ...prev, zoom: clampZoom(scale) }));
      },
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();
        setState((prev) => {
          const factor = dy > 0 ? 0.95 : 1.05;
          return { ...prev, zoom: clampZoom(prev.zoom * factor) };
        });
      },
    },
    {
      drag: { filterTaps: true },
      pinch: { scaleBounds: { min: opts.minZoom, max: opts.maxZoom } },
      eventOptions: { passive: false },
    },
  );

  // Controls API -----------------------------------------------------------

  const zoomIn = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: clampZoom(prev.zoom + opts.zoomStep) }));
  }, [clampZoom, opts.zoomStep]);

  const zoomOut = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: clampZoom(prev.zoom - opts.zoomStep) }));
  }, [clampZoom, opts.zoomStep]);

  const resetView = useCallback(() => {
    setState({
      x: opts.initial.x ?? 0,
      y: opts.initial.y ?? 0,
      zoom: opts.initial.zoom ?? 1,
    });
  }, [opts.initial]);

  const fitToContent = useCallback(
    (bounds: Rect) => {
      const container = containerRef.current;
      if (!container) return;
      const { clientWidth: cw, clientHeight: ch } = container;
      if (bounds.width === 0 || bounds.height === 0) return;
      const scaleX = cw / bounds.width;
      const scaleY = ch / bounds.height;
      const zoom = clampZoom(Math.min(scaleX, scaleY) * 0.9);
      const x = (cw - bounds.width * zoom) / 2 - bounds.x * zoom;
      const y = (ch - bounds.height * zoom) / 2 - bounds.y * zoom;
      setState({ x, y, zoom });
    },
    [clampZoom],
  );

  // SVG transform string
  const transformMatrix = `translate(${state.x}, ${state.y}) scale(${state.zoom})`;

  // Memoize return to prevent unnecessary child re-renders
  return useMemo(
    () => ({
      state,
      setState,
      bind,
      containerRef,
      zoomIn,
      zoomOut,
      resetView,
      fitToContent,
      transformMatrix,
    }),
    [state, bind, zoomIn, zoomOut, resetView, fitToContent, transformMatrix],
  );
}
