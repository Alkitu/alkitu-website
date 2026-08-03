"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { ImagenCaso } from "../../_data/casos";

/**
 * Slider de imágenes de una sección del caso de estudio. Altura fija; cada slide
 * conserva su aspecto (funciona para pantallas móviles verticales y capturas de
 * escritorio). Flechas + dots; scroll-snap con drag. Con una sola imagen, no
 * muestra controles.
 */
export function CasoGaleria({ imagenes }: { imagenes: ImagenCaso[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [idx, setIdx] = React.useState(0);
  const multiple = imagenes.length > 1;

  const centrar = (i: number) => {
    const el = trackRef.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2, behavior: "smooth" });
    setIdx(i);
  };
  const ir = (dir: -1 | 1) => centrar(Math.min(Math.max(idx + dir, 0), imagenes.length - 1));

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const h = c as HTMLElement;
          const d = Math.abs(h.offsetLeft + h.clientWidth / 2 - center);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setIdx(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mt-12">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {imagenes.map((img) => {
          const vertical = img.alto > img.ancho;
          return (
            <div
              key={img.src}
              className="flex h-[380px] shrink-0 snap-center items-center sm:h-[460px] md:h-[560px]"
            >
              <div
                className={`relative h-full overflow-hidden shadow-lg ring-1 ring-neutral-900/10 ${
                  vertical ? "rounded-[1.75rem]" : "rounded-xl"
                }`}
                style={{ aspectRatio: `${img.ancho} / ${img.alto}` }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {multiple && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {imagenes.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => centrar(i)}
                aria-label={`Imagen ${i + 1}`}
                aria-current={i === idx}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-6 bg-primary" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ir(-1)}
              disabled={idx === 0}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-foreground transition-colors hover:bg-foreground/[0.05] disabled:opacity-30"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => ir(1)}
              disabled={idx === imagenes.length - 1}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-foreground transition-colors hover:bg-foreground/[0.05] disabled:opacity-30"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
