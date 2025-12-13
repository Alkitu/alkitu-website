"use client";
import { useRive, RuntimeLoader } from "@rive-app/react-canvas";
import { useEffect, useMemo, memo } from "react";
import riveWASMResource from '@rive-app/canvas/rive.wasm';

// Set WASM URL for better reliability and faster load times
RuntimeLoader.setWasmUrl(riveWASMResource);

type RiveAnimationProps = {
  artboardName?: string;
  hoverAnimationName?: string;
  hover?: boolean;
};

export const RiveAnimation = memo(({
  hoverAnimationName = "Hover",
  artboardName = "Design",
  hover = false,
}: RiveAnimationProps) => {
  const riveConfig = useMemo(() => ({
    src: "/assets/rive/web_portfolio.riv",
    autoplay: true,
    artboard: artboardName,
    onLoadError: (error: any) => console.log("ERROR LOADING RIVE:", error),
    onLoad: () => console.log("LOADED RIVE SUCCESSFULLY"),
  }), [artboardName]);

  const { rive, RiveComponent } = useRive(riveConfig);

  useEffect(() => {
    if (!rive) return;

    const animationName = hover ? hoverAnimationName : "Loop";
    rive.play(animationName);
  }, [rive, hover, hoverAnimationName]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <RiveComponent className="w-full h-full aspect-square" />
    </div>
  );
});

RiveAnimation.displayName = 'RiveAnimation';
