'use client';
import { useLayoutEffect, useState, RefObject } from 'react';

/**
 * Interface representing the complete rectangle information of an element
 */
export interface ElementRect {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
}

/**
 * Hook that returns the DOMRect of an element and its center coordinates.
 * Updates automatically on window resize.
 *
 * This hook consolidates the functionality of useElementWidth and useCenterOfElement.
 *
 * @param ref - React ref to the target element
 * @returns ElementRect object with dimensions and center coordinates, or null if element not mounted
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const rect = useElementRect(ref);
 *
 * return (
 *   <div ref={ref}>
 *     Width: {rect?.width}
 *     Center: ({rect?.centerX}, {rect?.centerY})
 *   </div>
 * );
 * ```
 */
export function useElementRect<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): ElementRect | null {
  const [rect, setRect] = useState<ElementRect | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateRect = () => {
      const domRect = element.getBoundingClientRect();
      setRect({
        width: domRect.width,
        height: domRect.height,
        top: domRect.top,
        left: domRect.left,
        right: domRect.right,
        bottom: domRect.bottom,
        centerX: domRect.left + domRect.width / 2,
        centerY: domRect.top + domRect.height / 2,
        x: domRect.x,
        y: domRect.y,
      });
    };

    // Initial measurement
    updateRect();

    // Update on window resize
    window.addEventListener('resize', updateRect);

    // Use ResizeObserver to detect when element content changes
    // This fixes the issue where categories load after mount and resize isn't triggered
    let resizeObserver: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateRect();
      });
      resizeObserver.observe(element);
    }

    return () => {
      window.removeEventListener('resize', updateRect);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [ref]);

  return rect;
}

/**
 * Legacy hook for backward compatibility.
 * Returns only the width of an element.
 *
 * @deprecated Use useElementRect instead for better performance
 * @param ref - React ref to the target element
 * @returns Element width in pixels, or null if element not mounted
 */
export function useElementWidth<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): number | null {
  const rect = useElementRect(ref);
  return rect?.width ?? null;
}

/**
 * Legacy hook for backward compatibility.
 * Returns only the center coordinates of an element.
 *
 * @deprecated Use useElementRect instead for better performance
 * @param ref - React ref to the target element
 * @returns Object with x and y center coordinates, or null if element not mounted
 */
export function useCenterOfElement<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): { x: number; y: number } | null {
  const rect = useElementRect(ref);
  return rect ? { x: rect.centerX, y: rect.centerY } : null;
}

export default useElementRect;
