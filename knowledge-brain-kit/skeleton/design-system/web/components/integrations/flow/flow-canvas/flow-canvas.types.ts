import type {
  ReactFlowProps,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
} from "@xyflow/react";

export interface FlowCanvasProps<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
> extends ReactFlowProps<Node<NodeData>, Edge<EdgeData>> {
  /**
   * Show the built-in <Background /> grid. Defaults to true.
   */
  showBackground?: boolean;

  /**
   * Show the built-in <Controls /> (zoom + fit-view). Defaults to true.
   */
  showControls?: boolean;

  /**
   * Show the built-in <MiniMap />. Defaults to false.
   */
  showMiniMap?: boolean;

  /**
   * Show a fullscreen toggle button (top-right). Uses the native Fullscreen API
   * on the canvas wrapper and re-runs `fitView` on enter/exit. Defaults to false.
   */
  showFullscreen?: boolean;

  /**
   * Optional className applied to the wrapper div.
   */
  className?: string;

  /**
   * Custom node type registry (passed straight to ReactFlow).
   */
  nodeTypes?: NodeTypes;

  /**
   * Custom edge type registry (passed straight to ReactFlow).
   */
  edgeTypes?: EdgeTypes;
}

export type { Node, Edge, NodeTypes, EdgeTypes } from "@xyflow/react";
