import type { Point } from '../../venue-core/types';
import { pointInPolygon, pointInRect } from '../../venue-core/utils/geometry';
import type { MapArea } from '../types';

// ---------------------------------------------------------------------------
// Area Hit Test — determine which area a point falls within
// Handles irregular shapes (polygons, paths) via point-in-polygon algorithm
// ---------------------------------------------------------------------------

/** Regex that handles integers, decimals, leading-dot decimals, and scientific notation */
const NUM_RE = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;

/** Parse a polygon points string into Point[] */
function parsePolygonPoints(pointsStr: string): Point[] {
  const nums = (pointsStr.match(NUM_RE) ?? []).map(Number);
  const points: Point[] = [];
  for (let i = 0; i < nums.length - 1; i += 2) {
    points.push({ x: nums[i], y: nums[i + 1] });
  }
  return points;
}

/** Linearly interpolate between two points */
function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Sample a cubic bezier curve (C command) into multiple points */
function sampleCubicBezier(
  p0: Point, p1: Point, p2: Point, p3: Point, steps: number,
): Point[] {
  const pts: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const a = lerp(p0, p1, t);
    const b = lerp(p1, p2, t);
    const c = lerp(p2, p3, t);
    const d = lerp(a, b, t);
    const e = lerp(b, c, t);
    pts.push(lerp(d, e, t));
  }
  return pts;
}

/** Sample a quadratic bezier curve (Q command) into multiple points */
function sampleQuadBezier(
  p0: Point, p1: Point, p2: Point, steps: number,
): Point[] {
  const pts: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const a = lerp(p0, p1, t);
    const b = lerp(p1, p2, t);
    pts.push(lerp(a, b, t));
  }
  return pts;
}

const CURVE_SAMPLES = 8;

/** Parse an SVG path d attribute into polygon vertices with curve sampling */
function parsePathToVertices(d: string): Point[] {
  const points: Point[] = [];
  const commands = d.match(/[MLHVCSQTAZmlhvcsqtaz][^MLHVCSQTAZmlhvcsqtaz]*/g) ?? [];

  let curX = 0, curY = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    const type = cmd[0];
    const nums = (cmd.slice(1).match(NUM_RE) ?? []).map(Number);

    switch (type) {
      case 'M':
        for (let i = 0; i < nums.length - 1; i += 2) {
          curX = nums[i]; curY = nums[i + 1];
          if (i === 0) { startX = curX; startY = curY; }
          points.push({ x: curX, y: curY });
        }
        break;
      case 'm':
        for (let i = 0; i < nums.length - 1; i += 2) {
          curX += nums[i]; curY += nums[i + 1];
          if (i === 0) { startX = curX; startY = curY; }
          points.push({ x: curX, y: curY });
        }
        break;
      case 'L':
        for (let i = 0; i < nums.length - 1; i += 2) {
          curX = nums[i]; curY = nums[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'l':
        for (let i = 0; i < nums.length - 1; i += 2) {
          curX += nums[i]; curY += nums[i + 1];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'H':
        for (const n of nums) { curX = n; points.push({ x: curX, y: curY }); }
        break;
      case 'h':
        for (const n of nums) { curX += n; points.push({ x: curX, y: curY }); }
        break;
      case 'V':
        for (const n of nums) { curY = n; points.push({ x: curX, y: curY }); }
        break;
      case 'v':
        for (const n of nums) { curY += n; points.push({ x: curX, y: curY }); }
        break;
      case 'C':
        for (let i = 0; i + 5 < nums.length; i += 6) {
          const p0 = { x: curX, y: curY };
          const p1 = { x: nums[i], y: nums[i + 1] };
          const p2 = { x: nums[i + 2], y: nums[i + 3] };
          const p3 = { x: nums[i + 4], y: nums[i + 5] };
          points.push(...sampleCubicBezier(p0, p1, p2, p3, CURVE_SAMPLES));
          curX = p3.x; curY = p3.y;
        }
        break;
      case 'c':
        for (let i = 0; i + 5 < nums.length; i += 6) {
          const p0 = { x: curX, y: curY };
          const p1 = { x: curX + nums[i], y: curY + nums[i + 1] };
          const p2 = { x: curX + nums[i + 2], y: curY + nums[i + 3] };
          const p3 = { x: curX + nums[i + 4], y: curY + nums[i + 5] };
          points.push(...sampleCubicBezier(p0, p1, p2, p3, CURVE_SAMPLES));
          curX = p3.x; curY = p3.y;
        }
        break;
      case 'Q':
        for (let i = 0; i + 3 < nums.length; i += 4) {
          const p0 = { x: curX, y: curY };
          const p1 = { x: nums[i], y: nums[i + 1] };
          const p2 = { x: nums[i + 2], y: nums[i + 3] };
          points.push(...sampleQuadBezier(p0, p1, p2, CURVE_SAMPLES));
          curX = p2.x; curY = p2.y;
        }
        break;
      case 'q':
        for (let i = 0; i + 3 < nums.length; i += 4) {
          const p0 = { x: curX, y: curY };
          const p1 = { x: curX + nums[i], y: curY + nums[i + 1] };
          const p2 = { x: curX + nums[i + 2], y: curY + nums[i + 3] };
          points.push(...sampleQuadBezier(p0, p1, p2, CURVE_SAMPLES));
          curX = p2.x; curY = p2.y;
        }
        break;
      case 'A':
        // Arc: sample as line to endpoint (acceptable approximation for hit test)
        for (let i = 0; i + 6 < nums.length; i += 7) {
          curX = nums[i + 5]; curY = nums[i + 6];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'a':
        for (let i = 0; i + 6 < nums.length; i += 7) {
          curX += nums[i + 5]; curY += nums[i + 6];
          points.push({ x: curX, y: curY });
        }
        break;
      case 'Z':
      case 'z':
        curX = startX; curY = startY;
        if (points.length > 0) points.push({ x: startX, y: startY });
        break;
    }
  }
  return points;
}

/** Parse a CSS/SVG transform to extract rotation angle and origin */
function parseTransformRotation(transform: string | undefined): { angle: number; cx: number; cy: number } | null {
  if (!transform) return null;
  const match = transform.match(/rotate\(\s*(-?[\d.]+)(?:\s*[,\s]\s*(-?[\d.]+)\s*[,\s]\s*(-?[\d.]+))?\s*\)/);
  if (!match) return null;
  return {
    angle: parseFloat(match[1]),
    cx: match[2] ? parseFloat(match[2]) : 0,
    cy: match[3] ? parseFloat(match[3]) : 0,
  };
}

/** Apply inverse rotation to a point so hit-testing works on rotated elements */
function inverseRotate(point: Point, angle: number, cx: number, cy: number): Point {
  const rad = (-angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - cx;
  const dy = point.y - cy;
  return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
}

/** Test if a point hits a specific map area */
export function hitTestArea(point: Point, area: MapArea): boolean {
  const { svgTag, svgAttributes } = area;

  // Handle rotated elements — transform the test point into the element's local space
  const rotation = parseTransformRotation(svgAttributes.transform);
  const testPoint = rotation
    ? inverseRotate(point, rotation.angle, rotation.cx, rotation.cy)
    : point;

  switch (svgTag) {
    case 'rect': {
      const x = parseFloat(svgAttributes.x ?? '0');
      const y = parseFloat(svgAttributes.y ?? '0');
      const w = parseFloat(svgAttributes.width ?? '0');
      const h = parseFloat(svgAttributes.height ?? '0');
      return pointInRect(testPoint, { x, y, width: w, height: h });
    }
    case 'circle': {
      const cx = parseFloat(svgAttributes.cx ?? '0');
      const cy = parseFloat(svgAttributes.cy ?? '0');
      const r = parseFloat(svgAttributes.r ?? '0');
      const dx = testPoint.x - cx;
      const dy = testPoint.y - cy;
      return dx * dx + dy * dy <= r * r;
    }
    case 'ellipse': {
      const ecx = parseFloat(svgAttributes.cx ?? '0');
      const ecy = parseFloat(svgAttributes.cy ?? '0');
      const rx = parseFloat(svgAttributes.rx ?? '0');
      const ry = parseFloat(svgAttributes.ry ?? '0');
      if (rx === 0 || ry === 0) return false;
      const dx = (testPoint.x - ecx) / rx;
      const dy = (testPoint.y - ecy) / ry;
      return dx * dx + dy * dy <= 1;
    }
    case 'polygon': {
      const vertices = parsePolygonPoints(svgAttributes.points ?? '');
      return vertices.length >= 3 && pointInPolygon(testPoint, vertices);
    }
    case 'path': {
      const vertices = parsePathToVertices(svgAttributes.d ?? area.svgPath);
      return vertices.length >= 3 && pointInPolygon(testPoint, vertices);
    }
    default:
      return false;
  }
}

/** Find the first area that a point hits (topmost in the list) */
export function findAreaAtPoint(point: Point, areas: MapArea[]): MapArea | undefined {
  for (let i = areas.length - 1; i >= 0; i--) {
    if (hitTestArea(point, areas[i])) return areas[i];
  }
  return undefined;
}
