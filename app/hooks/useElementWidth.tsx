'use client'
import { useLayoutEffect, useState } from "react";

function useElementWidth(ref) {
  const [elementWidth, setElementWidth] = useState(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      const rect = element.getBoundingClientRect();
      setElementWidth(rect.width);
    };

    // Initial measurement
    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [ref]);

  return elementWidth;
}

export default useElementWidth;
