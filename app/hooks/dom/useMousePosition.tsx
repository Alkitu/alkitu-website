'use client';
import { useState, useEffect } from 'react';

/**
 * Interface representing mouse position coordinates
 */
export interface MousePosition {
  x: number | null;
  y: number | null;
}

/**
 * Hook that tracks the current mouse position.
 * Returns null for x and y until the first mousemove event.
 *
 * @returns Object with x and y coordinates of the mouse
 *
 * @example
 * ```tsx
 * const { x, y } = useMousePosition();
 *
 * return (
 *   <div>
 *     Mouse position: ({x}, {y})
 *   </div>
 * );
 * ```
 */
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}

export default useMousePosition;
