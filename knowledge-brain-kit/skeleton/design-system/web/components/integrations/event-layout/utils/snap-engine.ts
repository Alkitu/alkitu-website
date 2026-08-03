import type { Point } from '../../venue-core/types';
import type { LayoutElement } from '../types';
import { snapPointToGrid } from '../../venue-core/utils/geometry';

// ---------------------------------------------------------------------------
// Snap Engine — grid snapping and alignment guides
// ---------------------------------------------------------------------------

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
}

const SNAP_THRESHOLD = 8; // pixels

/** Snap a point to the grid if grid snapping is enabled */
export function snapToLayoutGrid(point: Point, gridSize: number): Point {
  if (gridSize <= 0) return point;
  return snapPointToGrid(point, gridSize);
}

/** Find alignment guides relative to other elements */
export function findAlignmentGuides(
  element: LayoutElement,
  otherElements: LayoutElement[],
  canvasWidth: number,
  canvasHeight: number,
): { snappedPoint: Point; guides: AlignmentGuide[] } {
  const guides: AlignmentGuide[] = [];
  let snapX = element.x;
  let snapY = element.y;

  // Canvas center guides
  const canvasCX = canvasWidth / 2;
  const canvasCY = canvasHeight / 2;

  if (Math.abs(element.x - canvasCX) < SNAP_THRESHOLD) {
    snapX = canvasCX;
    guides.push({ type: 'vertical', position: canvasCX, start: 0, end: canvasHeight });
  }
  if (Math.abs(element.y - canvasCY) < SNAP_THRESHOLD) {
    snapY = canvasCY;
    guides.push({ type: 'horizontal', position: canvasCY, start: 0, end: canvasWidth });
  }

  // Align to other elements
  for (const other of otherElements) {
    if (other.id === element.id) continue;

    // Center-to-center horizontal alignment
    if (Math.abs(element.x - other.x) < SNAP_THRESHOLD) {
      snapX = other.x;
      guides.push({
        type: 'vertical',
        position: other.x,
        start: Math.min(element.y, other.y) - 20,
        end: Math.max(element.y, other.y) + 20,
      });
    }

    // Center-to-center vertical alignment
    if (Math.abs(element.y - other.y) < SNAP_THRESHOLD) {
      snapY = other.y;
      guides.push({
        type: 'horizontal',
        position: other.y,
        start: Math.min(element.x, other.x) - 20,
        end: Math.max(element.x, other.x) + 20,
      });
    }

    // Edge alignment (left edge to left edge, etc.)
    const elLeft = element.x - element.width / 2;
    const otherLeft = other.x - other.width / 2;
    if (Math.abs(elLeft - otherLeft) < SNAP_THRESHOLD) {
      snapX = otherLeft + element.width / 2;
      guides.push({
        type: 'vertical',
        position: otherLeft,
        start: Math.min(element.y, other.y) - 20,
        end: Math.max(element.y, other.y) + 20,
      });
    }

    const elRight = element.x + element.width / 2;
    const otherRight = other.x + other.width / 2;
    if (Math.abs(elRight - otherRight) < SNAP_THRESHOLD) {
      snapX = otherRight - element.width / 2;
      guides.push({
        type: 'vertical',
        position: otherRight,
        start: Math.min(element.y, other.y) - 20,
        end: Math.max(element.y, other.y) + 20,
      });
    }
  }

  return { snappedPoint: { x: snapX, y: snapY }, guides };
}

/** Distribute elements evenly horizontally */
export function distributeHorizontally(elements: LayoutElement[]): LayoutElement[] {
  if (elements.length < 3) return elements;
  const sorted = [...elements].sort((a, b) => a.x - b.x);
  const first = sorted[0].x;
  const last = sorted[sorted.length - 1].x;
  const step = (last - first) / (sorted.length - 1);

  return sorted.map((el, i) => ({ ...el, x: first + step * i }));
}

/** Distribute elements evenly vertically */
export function distributeVertically(elements: LayoutElement[]): LayoutElement[] {
  if (elements.length < 3) return elements;
  const sorted = [...elements].sort((a, b) => a.y - b.y);
  const first = sorted[0].y;
  const last = sorted[sorted.length - 1].y;
  const step = (last - first) / (sorted.length - 1);

  return sorted.map((el, i) => ({ ...el, y: first + step * i }));
}

/** Align all elements to the same X (center) */
export function alignCenterH(elements: LayoutElement[]): LayoutElement[] {
  if (elements.length === 0) return elements;
  const avgX = elements.reduce((sum, el) => sum + el.x, 0) / elements.length;
  return elements.map((el) => ({ ...el, x: avgX }));
}

/** Align all elements to the same Y (center) */
export function alignCenterV(elements: LayoutElement[]): LayoutElement[] {
  if (elements.length === 0) return elements;
  const avgY = elements.reduce((sum, el) => sum + el.y, 0) / elements.length;
  return elements.map((el) => ({ ...el, y: avgY }));
}
