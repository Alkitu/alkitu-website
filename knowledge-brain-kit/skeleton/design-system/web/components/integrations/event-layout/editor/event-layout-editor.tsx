'use client';

import * as React from 'react';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { EventLayout, LayoutElement, ElementType, ToolMode } from '../types';
import { createDefaultEventLayout, createLayoutElement } from '../types';
import { useUndoRedo } from '../../venue-core/hooks/use-undo-redo';
import { useSelection } from '../../venue-core/hooks/use-selection';
import { useViewport } from '../../venue-core/hooks/use-viewport';
import { SvgGrid } from '../../venue-core/svg/svg-grid';
import { SvgControls } from '../../venue-core/svg/svg-controls';
import { ElementPalette } from './element-palette';
import { ElementProperties } from './element-properties';
import { EditorToolbar } from './editor-toolbar';
import { TableRound } from './elements/table-round';
import { TableRect } from './elements/table-rect';
import { ChairElement } from './elements/chair-element';
import { StageElement } from './elements/stage-element';
import { BarElement } from './elements/bar-element';
import { VipZoneElement } from './elements/vip-zone-element';
import { snapToLayoutGrid } from '../utils/snap-engine';
import { alignCenterH, alignCenterV } from '../utils/snap-engine';
import type { UndoableCommand } from '../../venue-core/types';
import { Button } from '~/components/primitives/button';
import { Badge } from '~/components/primitives/badge';
import { Save } from 'lucide-react';
import { cn } from '~/lib/utils';

// ---------------------------------------------------------------------------
// EventLayoutEditor — drag-and-drop canvas for event layout design
// ---------------------------------------------------------------------------

export interface EventLayoutEditorProps {
  initialLayout?: EventLayout;
  onChange?: (layout: EventLayout) => void;
  onSave?: (layout: EventLayout) => void;
  className?: string;
}

/** Render the appropriate SVG element for a layout element */
function renderElement(element: LayoutElement, isSelected: boolean) {
  const props = { element, isSelected };
  switch (element.type) {
    case 'table-round': return <TableRound {...props} />;
    case 'table-rect':  return <TableRect {...props} />;
    case 'chair':       return <ChairElement {...props} />;
    case 'stage':       return <StageElement {...props} />;
    case 'bar':         return <BarElement {...props} />;
    case 'vip-zone':    return <VipZoneElement {...props} />;
  }
}

export function EventLayoutEditor({
  initialLayout,
  onChange,
  onSave,
  className,
}: EventLayoutEditorProps) {
  const initial = initialLayout ?? createDefaultEventLayout();
  const { state: layout, execute, undo, redo, canUndo, canRedo } = useUndoRedo(initial);
  const selection = useSelection({ mode: 'multiple' });
  const viewport = useViewport({ maxZoom: 3 });

  const [toolMode, setToolMode] = React.useState<ToolMode>('select');
  const [snapEnabled, setSnapEnabled] = React.useState(layout.gridSize > 0);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  // Track drag start position for batched undo
  const dragStartSnapshot = React.useRef<LayoutElement | null>(null);
  // Live position during drag (no undo entries, just visual)
  const [dragPos, setDragPos] = React.useState<{ id: string; x: number; y: number } | null>(null);

  const svgRef = React.useRef<SVGSVGElement>(null);

  // Notify parent of changes
  React.useEffect(() => {
    onChange?.(layout);
  }, [layout, onChange]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // --- Actions ---

  const addElement = (type: ElementType) => {
    const position = {
      x: layout.canvasWidth / 2,
      y: layout.canvasHeight / 2,
    };
    const element = createLayoutElement(type, position);
    const cmd: UndoableCommand<EventLayout> = {
      label: `Add ${type}`,
      execute: (s) => ({ ...s, elements: [...s.elements, element], updatedAt: new Date().toISOString() }),
      undo: (s) => ({ ...s, elements: s.elements.filter((e) => e.id !== element.id) }),
    };
    execute(cmd);
    selection.selectOne(element.id);
  };

  const updateElement = (updated: LayoutElement) => {
    const prev = layout.elements.find((e) => e.id === updated.id);
    if (!prev) return;
    const cmd: UndoableCommand<EventLayout> = {
      label: `Update ${updated.label}`,
      execute: (s) => ({
        ...s,
        elements: s.elements.map((e) => (e.id === updated.id ? updated : e)),
        updatedAt: new Date().toISOString(),
      }),
      undo: (s) => ({
        ...s,
        elements: s.elements.map((e) => (e.id === updated.id ? prev : e)),
      }),
    };
    execute(cmd);
  };

  const duplicateElement = (elementId: string) => {
    const original = layout.elements.find((e) => e.id === elementId);
    if (!original) return;
    const dupe = {
      ...original,
      id: `${original.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: original.x + 30,
      y: original.y + 30,
      label: `${original.label} (copy)`,
    };
    const cmd: UndoableCommand<EventLayout> = {
      label: `Duplicate ${original.label}`,
      execute: (s) => ({ ...s, elements: [...s.elements, dupe] }),
      undo: (s) => ({ ...s, elements: s.elements.filter((e) => e.id !== dupe.id) }),
    };
    execute(cmd);
    selection.selectOne(dupe.id);
  };

  const deleteElement = (elementId: string) => {
    const element = layout.elements.find((e) => e.id === elementId);
    if (!element) return;
    const idx = layout.elements.indexOf(element);
    const cmd: UndoableCommand<EventLayout> = {
      label: `Delete ${element.label}`,
      execute: (s) => ({ ...s, elements: s.elements.filter((e) => e.id !== elementId), updatedAt: new Date().toISOString() }),
      undo: (s) => {
        const next = [...s.elements];
        next.splice(idx, 0, element);
        return { ...s, elements: next };
      },
    };
    execute(cmd);
    selection.clear();
  };

  const handleAlignH = () => {
    const selectedEls = layout.elements.filter((e) => selection.isSelected(e.id));
    if (selectedEls.length < 2) return;
    const aligned = alignCenterH(selectedEls);
    const prevElements = [...layout.elements];
    const cmd: UndoableCommand<EventLayout> = {
      label: 'Align horizontally',
      execute: (s) => ({
        ...s,
        elements: s.elements.map((e) => {
          const a = aligned.find((el) => el.id === e.id);
          return a ?? e;
        }),
      }),
      undo: (s) => ({ ...s, elements: prevElements }),
    };
    execute(cmd);
  };

  const handleAlignV = () => {
    const selectedEls = layout.elements.filter((e) => selection.isSelected(e.id));
    if (selectedEls.length < 2) return;
    const aligned = alignCenterV(selectedEls);
    const prevElements = [...layout.elements];
    const cmd: UndoableCommand<EventLayout> = {
      label: 'Align vertically',
      execute: (s) => ({
        ...s,
        elements: s.elements.map((e) => {
          const a = aligned.find((el) => el.id === e.id);
          return a ?? e;
        }),
      }),
      undo: (s) => ({ ...s, elements: prevElements }),
    };
    execute(cmd);
  };

  // --- SVG drag handlers (batched: one undo entry per drag) ---

  const clientToSvg = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (toolMode !== 'select') return;
    const target = e.target as SVGElement;
    const elementG = target.closest('[data-element-id]');
    if (elementG) {
      const id = elementG.getAttribute('data-element-id')!;
      selection.toggle(id, e);
      const el = layout.elements.find((el) => el.id === id);
      if (el && !el.locked) {
        setDraggingId(id);
        dragStartSnapshot.current = { ...el };
      }
    } else {
      selection.clear();
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingId || toolMode !== 'select') return;
    const svgPoint = clientToSvg(e.clientX, e.clientY);
    if (!svgPoint) return;

    let newX = svgPoint.x;
    let newY = svgPoint.y;

    if (snapEnabled && layout.gridSize > 0) {
      const snapped = snapToLayoutGrid({ x: newX, y: newY }, layout.gridSize);
      newX = snapped.x;
      newY = snapped.y;
    }

    // Update visual position only — no undo entry
    setDragPos({ id: draggingId, x: newX, y: newY });
  };

  const handleSvgMouseUp = () => {
    if (draggingId && dragStartSnapshot.current && dragPos) {
      const startEl = dragStartSnapshot.current;
      const finalX = dragPos.x;
      const finalY = dragPos.y;
      // Only commit if position actually changed
      if (startEl.x !== finalX || startEl.y !== finalY) {
        const id = draggingId;
        execute({
          label: `Move ${startEl.label}`,
          execute: (s) => ({
            ...s,
            elements: s.elements.map((e) => (e.id === id ? { ...e, x: finalX, y: finalY } : e)),
            updatedAt: new Date().toISOString(),
          }),
          undo: (s) => ({
            ...s,
            elements: s.elements.map((e) => (e.id === id ? { ...e, x: startEl.x, y: startEl.y } : e)),
          }),
        });
      }
    }
    setDraggingId(null);
    dragStartSnapshot.current = null;
    setDragPos(null);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.selected.size > 0) {
          const id = Array.from(selection.selected)[0];
          deleteElement(id);
        }
      }
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (selection.selected.size > 0) {
          duplicateElement(Array.from(selection.selected)[0]);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selection.selected, undo, redo]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedElement = layout.elements.find((e) => selection.selected.has(e.id)) ?? null;
  const viewBox = `0 0 ${layout.canvasWidth} ${layout.canvasHeight}`;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div>
          <h2 className="text-base font-semibold">Event Layout Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{layout.elements.length} elements</Badge>
          <Button size="sm" onClick={() => onSave?.(layout)}>
            <Save size={14} className="mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        toolMode={toolMode}
        onToolModeChange={setToolMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onAlignH={handleAlignH}
        onAlignV={handleAlignV}
        onDuplicate={() => selectedElement && duplicateElement(selectedElement.id)}
        onDelete={() => selectedElement && deleteElement(selectedElement.id)}
        snapToGrid={snapEnabled}
        onSnapToGridChange={setSnapEnabled}
        hasSelection={selection.selected.size > 0}
      />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Element palette */}
        <ElementPalette onAddElement={addElement} />

        {/* Center: Canvas */}
        <div className="flex-1 relative overflow-hidden bg-muted/30">
          <div
            ref={viewport.containerRef}
            className="w-full h-full touch-none"
            {...(toolMode === 'pan' ? viewport.bind() : {})}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={viewBox}
              className="block"
              onMouseDown={handleSvgMouseDown}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
            >
              <g transform={viewport.transformMatrix}>
                {/* Canvas background */}
                <rect
                  width={layout.canvasWidth}
                  height={layout.canvasHeight}
                  fill="var(--background)"
                  stroke="var(--border)"
                  strokeWidth={1}
                />

                {/* Grid */}
                {snapEnabled && layout.gridSize > 0 && (
                  <SvgGrid size={layout.gridSize} />
                )}

                {/* Elements */}
                {layout.elements.map((element) => {
                  // Apply live drag position if this element is being dragged
                  const displayEl = dragPos && dragPos.id === element.id
                    ? { ...element, x: dragPos.x, y: dragPos.y }
                    : element;
                  return (
                    <g
                      key={element.id}
                      data-element-id={element.id}
                      style={{ cursor: element.locked ? 'not-allowed' : 'move' }}
                    >
                      {renderElement(displayEl, selection.isSelected(element.id))}
                    </g>
                  );
                })}

                {/* Selection indicator for selected elements */}
                {layout.elements
                  .filter((e) => selection.isSelected(e.id))
                  .map((e) => dragPos && dragPos.id === e.id ? { ...e, x: dragPos.x, y: dragPos.y } : e)
                  .map((el) => (
                    <rect
                      key={`sel-${el.id}`}
                      x={el.x - el.width / 2 - 4}
                      y={el.y - el.height / 2 - 4}
                      width={el.width + 8}
                      height={el.height + 8}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth={1}
                      strokeDasharray="4 2"
                      rx={4}
                      transform={`rotate(${el.rotation}, ${el.x}, ${el.y})`}
                      pointerEvents="none"
                    />
                  ))}
              </g>
            </svg>
          </div>

          {/* Viewport controls */}
          <SvgControls
            onZoomIn={viewport.zoomIn}
            onZoomOut={viewport.zoomOut}
            onReset={viewport.resetView}
            zoom={viewport.state.zoom}
            position="bottom-right"
          />
        </div>

        {/* Right: Properties panel */}
        <div className="w-64 shrink-0 border-l border-border overflow-auto p-3">
          <ElementProperties
            element={selectedElement}
            onChange={updateElement}
            onDuplicate={duplicateElement}
            onDelete={deleteElement}
          />
        </div>
      </div>
    </div>
  );
}
