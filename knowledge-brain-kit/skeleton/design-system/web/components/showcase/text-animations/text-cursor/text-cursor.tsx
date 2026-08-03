"use client";

import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import "./text-cursor.css";

interface TrailPoint {
  x: number;
  y: number;
  char: string;
  angle: number;
  rotationSpeed: number;
  life: number;
  size: number;
  color: string;
}

interface TextCursorProps {
  /** The text or phrase to trail. Each character will be dropped sequentially. */
  text?: string;
  /** Distance in pixels between each dropped character */
  spacing?: number;
  /** Whether the character should rotate to face the direction of the mouse movement */
  followMouseDirection?: boolean;
  /** Whether the character should slowly rotate continuously */
  randomFloat?: boolean;
  /** Time in seconds for the character to fade out completely */
  exitDuration?: number;
  /** Kept for compatibility. Intervals in ms. In Canvas it decays continuously. */
  removalInterval?: number;
  /** Maximum number of characters currently active on screen */
  maxPoints?: number;
  className?: string;
}

export function TextCursor({
  text = "⚛️",
  spacing = 80,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.5,
  removalInterval = 30, // Ignored in Canvas implementation, handled smoothly via exitDuration
  maxPoints = 10,
  className,
}: TextCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const particlesRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const phraseIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      // Handle high-DPI displays safely
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Prevent initial jump
      if (lastMouseRef.current.x === 0 && lastMouseRef.current.y === 0) {
        lastMouseRef.current = { x: rect.width / 2, y: rect.height / 2 };
        mouseRef.current = { x: rect.width / 2, y: rect.height / 2 };
      }
    };

    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    const animate = () => {
      // Clear canvas each frame
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const dx = mouseRef.current.x - lastMouseRef.current.x;
      const dy = mouseRef.current.y - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only spawn new letter if we moved enough
      if (dist > spacing) {
        // Base angle from movement
        const moveAngle = Math.atan2(dy, dx);
        const computedAngle = followMouseDirection ? moveAngle : 0;

        // Sequence through the text characters
        const currentText = text || " ";
        // Treat as an array to handle emojis properly
        const chars = Array.from(currentText); 
        const char = chars[phraseIndexRef.current % chars.length];

        // Random jitter and rotation if randomFloat is on
        const rotOffset = randomFloat ? (Math.random() - 0.5) * 0.4 : 0;
        const rotSpeed = randomFloat ? (Math.random() - 0.5) * 0.04 : 0;

        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          char: char,
          angle: computedAngle + rotOffset,
          rotationSpeed: rotSpeed,
          life: 1.0,
          size: Math.max(24, Math.floor(rect.width * 0.02)), // responsive-ish baseline size, typically ~24px
          color: `hsl(${(Date.now() * 0.1) % 360}, 100%, 70%)`,
        });

        // Enforce maxPoints immediately after pushing to limit growth
        if (particlesRef.current.length > maxPoints) {
          // slice the oldest values
          particlesRef.current = particlesRef.current.slice(particlesRef.current.length - maxPoints);
        }

        phraseIndexRef.current = (phraseIndexRef.current + 1) % chars.length;
        lastMouseRef.current = { x: mouseRef.current.x, y: mouseRef.current.y };
      }

      // Update and draw particles
      const decayRate = 1 / (exitDuration * 60); // approx frames for 60fps

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.life -= decayRate;
        p.angle += p.rotationSpeed;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${p.size}px monospace`;
        
        ctx.fillStyle = p.color;
        // The canvas alpha needs to fade with life
        ctx.globalAlpha = p.life;
        
        // Enhance with a soft glow using its own color
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, spacing, followMouseDirection, randomFloat, exitDuration, maxPoints]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mouseRef.current = { x: mouseX, y: mouseY };

      if (lastMouseRef.current.x === 0 && lastMouseRef.current.y === 0) {
        lastMouseRef.current = { x: mouseX, y: mouseY };
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("text-cursor-container w-full h-full relative", className)}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}
