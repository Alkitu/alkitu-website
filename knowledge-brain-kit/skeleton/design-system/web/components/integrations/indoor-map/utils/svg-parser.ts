import type { MapArea } from '../types';

// ---------------------------------------------------------------------------
// SVG Parser — parse imported SVG floor plans into interactive areas
// Uses the browser's native DOMParser — no external library needed.
// ---------------------------------------------------------------------------

/** Tags considered as "areas" when parsing an SVG */
const AREA_TAGS = new Set(['path', 'rect', 'polygon', 'circle', 'ellipse']);

/** Attributes to preserve for re-rendering */
const PRESERVED_ATTRS = new Set([
  'd', 'x', 'y', 'width', 'height', 'rx', 'ry',
  'cx', 'cy', 'r', 'points', 'transform',
  'fill', 'stroke', 'stroke-width', 'opacity',
]);

// ---------------------------------------------------------------------------
// Detection options
// ---------------------------------------------------------------------------

export interface SvgParseOptions {
  /**
   * Minimum area (width * height) in SVG units for an element to be detected.
   * Elements smaller than this are treated as decoration. Default: 200
   */
  minArea?: number;
  /**
   * If true, only elements with an explicit `id` attribute or `data-area`
   * attribute are detected. Everything else becomes background. Default: false
   */
  requireId?: boolean;
  /**
   * If true, elements with `data-area="false"` or `data-ignore="true"`
   * are always skipped. Default: true
   */
  respectDataAttrs?: boolean;
  /**
   * If true, elements whose fill is "none" and stroke-width <= 1 are
   * treated as structural lines, not areas. Default: true
   */
  skipOutlines?: boolean;
}

const DEFAULT_OPTIONS: Required<SvgParseOptions> = {
  minArea: 200,
  requireId: false,
  respectDataAttrs: true,
  skipOutlines: true,
};

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

/** Parse an SVG string into a list of MapArea objects */
export function parseSvgToAreas(svgString: string, opts?: SvgParseOptions): {
  areas: MapArea[];
  viewBox: string;
  backgroundElements: string;
  /** Total shapes found before filtering */
  totalShapes: number;
  /** Number of shapes rejected by filters */
  skippedShapes: number;
} {
  const options = { ...DEFAULT_OPTIONS, ...opts };

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');

  if (!svgEl) {
    throw new Error('Invalid SVG: no <svg> root element found');
  }

  const viewBox = svgEl.getAttribute('viewBox') ?? '0 0 800 600';

  const areas: MapArea[] = [];
  let totalShapes = 0;
  let skippedShapes = 0;

  // Walk all elements in the SVG
  const allElements = svgEl.querySelectorAll('*');
  let areaIndex = 0;

  allElements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!AREA_TAGS.has(tag)) return;

    totalShapes++;

    // --- Filter: data attributes ---
    if (options.respectDataAttrs) {
      if (el.getAttribute('data-area') === 'false' || el.getAttribute('data-ignore') === 'true') {
        skippedShapes++;
        return;
      }
    }

    // --- Filter: require explicit id ---
    const hasId = !!el.getAttribute('id');
    const hasDataArea = el.getAttribute('data-area') === 'true';
    if (options.requireId && !hasId && !hasDataArea) {
      skippedShapes++;
      return;
    }

    // --- Filter: minimum size ---
    const bounds = getElementBounds(el, tag);
    if (bounds && bounds.area < options.minArea) {
      skippedShapes++;
      return;
    }

    // --- Filter: outlines / structural lines ---
    if (options.skipOutlines) {
      const fill = el.getAttribute('fill');
      const strokeWidth = parseFloat(el.getAttribute('stroke-width') ?? '1');
      if ((fill === 'none' || fill === 'transparent') && strokeWidth <= 1) {
        skippedShapes++;
        return;
      }
    }

    // Element passes all filters — register as area
    const id = el.getAttribute('id') || `area-${areaIndex++}`;

    const svgAttributes: Record<string, string> = {};
    for (const attr of el.attributes) {
      if (PRESERVED_ATTRS.has(attr.name) || attr.name.startsWith('data-')) {
        svgAttributes[attr.name] = attr.value;
      }
    }

    const svgPath = getSvgPath(el, tag);
    const { cx, cy } = computeCentroid(el, tag);

    areas.push({
      id,
      svgPath,
      svgTag: tag,
      svgAttributes,
      centroidX: cx,
      centroidY: cy,
      data: null,
      status: 'available',
    });
  });

  // Collect non-area elements as background SVG
  const bgClone = svgEl.cloneNode(true) as SVGElement;
  const areaIds = new Set(areas.map((a) => a.id));
  bgClone.querySelectorAll(Array.from(AREA_TAGS).join(',')).forEach((el) => {
    const elId = el.getAttribute('id');
    if (elId && areaIds.has(elId)) {
      el.remove();
    }
  });

  return {
    areas,
    viewBox,
    backgroundElements: bgClone.innerHTML,
    totalShapes,
    skippedShapes,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get approximate bounding dimensions for size filtering */
function getElementBounds(el: Element, tag: string): { width: number; height: number; area: number } | null {
  switch (tag) {
    case 'rect': {
      const w = parseFloat(el.getAttribute('width') ?? '0');
      const h = parseFloat(el.getAttribute('height') ?? '0');
      return { width: w, height: h, area: w * h };
    }
    case 'circle': {
      const r = parseFloat(el.getAttribute('r') ?? '0');
      return { width: r * 2, height: r * 2, area: Math.PI * r * r };
    }
    case 'ellipse': {
      const rx = parseFloat(el.getAttribute('rx') ?? '0');
      const ry = parseFloat(el.getAttribute('ry') ?? '0');
      return { width: rx * 2, height: ry * 2, area: Math.PI * rx * ry };
    }
    case 'path': {
      const d = el.getAttribute('d') ?? '';
      const nums = d.match(/-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g)?.map(Number) ?? [];
      if (nums.length < 4) return null;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < nums.length - 1; i += 2) {
        if (nums[i] < minX) minX = nums[i];
        if (nums[i] > maxX) maxX = nums[i];
        if (nums[i + 1] < minY) minY = nums[i + 1];
        if (nums[i + 1] > maxY) maxY = nums[i + 1];
      }
      const w = maxX - minX;
      const h = maxY - minY;
      return { width: w, height: h, area: w * h };
    }
    case 'polygon': {
      const pts = (el.getAttribute('points') ?? '').trim().split(/[\s,]+/).map(Number);
      if (pts.length < 4) return null;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < pts.length - 1; i += 2) {
        if (pts[i] < minX) minX = pts[i];
        if (pts[i] > maxX) maxX = pts[i];
        if (pts[i + 1] < minY) minY = pts[i + 1];
        if (pts[i + 1] > maxY) maxY = pts[i + 1];
      }
      const w = maxX - minX;
      const h = maxY - minY;
      return { width: w, height: h, area: w * h };
    }
    default:
      return null;
  }
}

/** Extract a path-like string from different SVG element types */
function getSvgPath(el: Element, tag: string): string {
  switch (tag) {
    case 'path':
      return el.getAttribute('d') ?? '';
    case 'rect': {
      const x = parseFloat(el.getAttribute('x') ?? '0');
      const y = parseFloat(el.getAttribute('y') ?? '0');
      const w = parseFloat(el.getAttribute('width') ?? '0');
      const h = parseFloat(el.getAttribute('height') ?? '0');
      return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
    }
    case 'polygon':
      return el.getAttribute('points') ?? '';
    case 'circle': {
      const cx = parseFloat(el.getAttribute('cx') ?? '0');
      const cy = parseFloat(el.getAttribute('cy') ?? '0');
      const r = parseFloat(el.getAttribute('r') ?? '0');
      return `M${cx - r},${cy} A${r},${r} 0 1,0 ${cx + r},${cy} A${r},${r} 0 1,0 ${cx - r},${cy}`;
    }
    case 'ellipse': {
      const ecx = parseFloat(el.getAttribute('cx') ?? '0');
      const ecy = parseFloat(el.getAttribute('cy') ?? '0');
      const rx = parseFloat(el.getAttribute('rx') ?? '0');
      const ry = parseFloat(el.getAttribute('ry') ?? '0');
      return `M${ecx - rx},${ecy} A${rx},${ry} 0 1,0 ${ecx + rx},${ecy} A${rx},${ry} 0 1,0 ${ecx - rx},${ecy}`;
    }
    default:
      return '';
  }
}

/** Compute the visual centroid of an SVG element */
function computeCentroid(el: Element, tag: string): { cx: number; cy: number } {
  switch (tag) {
    case 'rect': {
      const x = parseFloat(el.getAttribute('x') ?? '0');
      const y = parseFloat(el.getAttribute('y') ?? '0');
      const w = parseFloat(el.getAttribute('width') ?? '0');
      const h = parseFloat(el.getAttribute('height') ?? '0');
      return { cx: x + w / 2, cy: y + h / 2 };
    }
    case 'circle':
    case 'ellipse':
      return {
        cx: parseFloat(el.getAttribute('cx') ?? '0'),
        cy: parseFloat(el.getAttribute('cy') ?? '0'),
      };
    case 'polygon': {
      const points = (el.getAttribute('points') ?? '')
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      let sumX = 0, sumY = 0, count = 0;
      for (let i = 0; i < points.length - 1; i += 2) {
        sumX += points[i];
        sumY += points[i + 1];
        count++;
      }
      return { cx: count ? sumX / count : 0, cy: count ? sumY / count : 0 };
    }
    case 'path': {
      const d = el.getAttribute('d') ?? '';
      const nums = d.match(/-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g)?.map(Number) ?? [];
      let sumX = 0, sumY = 0, count = 0;
      for (let i = 0; i < nums.length - 1; i += 2) {
        sumX += nums[i];
        sumY += nums[i + 1];
        count++;
      }
      return { cx: count ? sumX / count : 0, cy: count ? sumY / count : 0 };
    }
    default:
      return { cx: 0, cy: 0 };
  }
}

/** Re-render a MapArea as its original SVG element string */
export function areaToSvgElement(area: MapArea): string {
  const attrs = Object.entries(area.svgAttributes)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<${area.svgTag} ${attrs} />`;
}
