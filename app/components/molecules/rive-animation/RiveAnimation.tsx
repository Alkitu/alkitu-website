"use client";
import { useRive, RuntimeLoader } from "@rive-app/react-canvas";
import { useEffect } from "react";
import riveWASMResource from '@rive-app/canvas/rive.wasm';

// Set WASM URL for better reliability and faster load times
RuntimeLoader.setWasmUrl(riveWASMResource);

type RiveAnimationProps = {
  artboardName?: string;
  hoverAnimationName?: string;
  hover?: boolean;
};

export const RiveAnimation = ({
  hoverAnimationName = "Hover",
  artboardName = "Design",
  hover = false,
}: RiveAnimationProps) => {
  const { rive, RiveComponent } = useRive({
    src: "/assets/rive/web_portfolio_two.riv",
    autoplay: true,
    artboard: artboardName,
  });

  useEffect(() => {
    if (!rive) return;

    const animationName = hover ? hoverAnimationName : "Loop";
    rive.play(animationName);
  }, [rive, hover, hoverAnimationName]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <RiveComponent className="h-[80%] w-full md:h-full" />
    </div>
  );
};
