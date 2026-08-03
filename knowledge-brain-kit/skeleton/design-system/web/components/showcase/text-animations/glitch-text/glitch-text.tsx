"use client";

import { cn } from "~/lib/utils";
import "./glitch-text.css";

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

export function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
}: GlitchTextProps) {
  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-5px 0 red" : "none",
    "--before-shadow": enableShadows ? "5px 0 cyan" : "none",
  } as React.CSSProperties;

  return (
    <div
      className={cn("glitch", enableOnHover && "enable-on-hover", className)}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
}
