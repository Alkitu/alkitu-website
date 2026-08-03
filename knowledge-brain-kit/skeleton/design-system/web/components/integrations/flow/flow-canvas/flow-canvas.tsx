"use client";

import * as React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Maximize2, Minimize2 } from "lucide-react";

import { cn } from "~/lib/utils";
import type { FlowCanvasProps } from "./flow-canvas.types";

// En pantalla completa se desbloquea la interacción aunque la incrustación
// embebida esté fija (para no secuestrar el scroll de la página).
const FULLSCREEN_INTERACTION = {
  zoomOnScroll: true,
  panOnDrag: true,
  panOnScroll: false,
  zoomOnDoubleClick: true,
  minZoom: 0.2,
  maxZoom: 4,
} as const;

const FlowCanvasInner = React.forwardRef<HTMLDivElement, FlowCanvasProps>(
  (
    {
      showBackground = true,
      showControls = true,
      showMiniMap = false,
      showFullscreen = false,
      className,
      children,
      ...reactFlowProps
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const { fitView } = useReactFlow();

    // Expone el nodo DOM real al ref reenviado.
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement, []);

    React.useEffect(() => {
      if (!showFullscreen) return;
      const handleChange = () => {
        const active = document.fullscreenElement === innerRef.current;
        setIsFullscreen(active);
        // Reencadra tras el cambio de tamaño (dos frames para que asiente el layout).
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            fitView(
              active
                ? { duration: 200, minZoom: 0.2, maxZoom: 4 }
                : { duration: 200 },
            ),
          ),
        );
      };
      document.addEventListener("fullscreenchange", handleChange);
      return () =>
        document.removeEventListener("fullscreenchange", handleChange);
    }, [showFullscreen, fitView]);

    const toggleFullscreen = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      if (document.fullscreenElement) {
        void document.exitFullscreen?.();
      } else {
        void el.requestFullscreen?.();
      }
    }, []);

    // En fullscreen se permite pan/zoom y se muestran los controles.
    const controlsVisible = showControls || isFullscreen;

    return (
      <div
        ref={innerRef}
        className={cn("h-full w-full", isFullscreen && "bg-background", className)}
      >
        <ReactFlow
          fitView
          {...reactFlowProps}
          {...(isFullscreen ? FULLSCREEN_INTERACTION : {})}
        >
          {showBackground ? <Background /> : null}
          {controlsVisible ? <Controls /> : null}
          {showMiniMap ? <MiniMap /> : null}
          {showFullscreen ? (
            <Panel position="top-right" className="!m-2">
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
                title={
                  isFullscreen
                    ? "Salir de pantalla completa"
                    : "Pantalla completa"
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </Panel>
          ) : null}
          {children}
        </ReactFlow>
      </div>
    );
  },
);

FlowCanvasInner.displayName = "FlowCanvasInner";

/**
 * FlowCanvas — Design System wrapper around ReactFlow (xyflow).
 *
 * Wraps ReactFlowProvider so consumers can drop a single component
 * without needing to mount the provider themselves.
 *
 * @see https://reactflow.dev for the underlying library docs.
 */
export const FlowCanvas = React.forwardRef<HTMLDivElement, FlowCanvasProps>(
  (props, ref) => (
    <ReactFlowProvider>
      <FlowCanvasInner ref={ref} {...props} />
    </ReactFlowProvider>
  ),
);

FlowCanvas.displayName = "FlowCanvas";

export default FlowCanvas;
