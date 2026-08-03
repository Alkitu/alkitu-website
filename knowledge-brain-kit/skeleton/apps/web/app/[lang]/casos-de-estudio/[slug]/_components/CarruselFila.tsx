"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Fila con scroll horizontal + flechas laterales para navegar. Las flechas solo
 * aparecen cuando hay contenido que desplazar y se ocultan en cada extremo.
 * El contenido va como children (cartas, imágenes…); `className` controla el gap.
 */
export function CarruselFila({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inicio, setInicio] = React.useState(true);
  const [fin, setFin] = React.useState(true);

  const actualizar = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setInicio(el.scrollLeft <= 2);
    setFin(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    actualizar();
    el.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      el.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, [actualizar]);

  const ir = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`flex snap-x overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
      >
        {children}
      </div>

      <Flecha lado="izq" oculta={inicio} onClick={() => ir(-1)} />
      <Flecha lado="der" oculta={fin} onClick={() => ir(1)} />
    </div>
  );
}

function Flecha({
  lado,
  oculta,
  onClick,
}: {
  lado: "izq" | "der";
  oculta: boolean;
  onClick: () => void;
}) {
  const Icono = lado === "izq" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={lado === "izq" ? "Anterior" : "Siguiente"}
      className={`absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white/90 text-foreground shadow-md backdrop-blur transition-opacity hover:bg-white ${
        lado === "izq" ? "left-1" : "right-1"
      } ${oculta ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <Icono className="h-5 w-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
