import { useRive } from "@rive-app/react-canvas";
import { useEffect, useMemo, memo } from "react";

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
    src: "/rive/web_portfolio.riv",
    autoplay: true,
    artboard: artboardName,
  }), [artboardName]);

  const { rive, RiveComponent } = useRive(riveConfig);

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
});

RiveAnimation.displayName = 'RiveAnimation';
