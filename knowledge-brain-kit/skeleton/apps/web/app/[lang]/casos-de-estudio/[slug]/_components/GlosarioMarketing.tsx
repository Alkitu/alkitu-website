import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { CarruselFila } from "./CarruselFila";

// Tira ilustrada de términos que enlazan a su entrada de la Wiki. Rellena
// TERMINOS con los términos de tu [concepto] (deben existir en
// content/wiki/glosario.json) e ilustra cada uno en /casos/<slug>/.
const TERMINOS: { src: string; label: string; slug: string }[] = [
  { src: "/casos/plantilla-caso/termino-1.png", label: "[Término 1]", slug: "termino-1" },
  { src: "/casos/plantilla-caso/termino-2.png", label: "[Término 2]", slug: "termino-2" },
  { src: "/casos/plantilla-caso/termino-3.png", label: "[Término 3]", slug: "termino-3" },
];

/** Tira horizontal ilustrada: cada tarjeta enlaza a su palabra en la Wiki.
 *  Scroll horizontal, sin JS. */
export function GlosarioMarketing() {
  return (
    <div className="mt-10">
      <p className="mb-4 text-sm text-neutral-500">
        Un glosario ilustrado: toca cualquier término para ver su definición en la
        Wiki.
      </p>
      <CarruselFila className="gap-4">
        {TERMINOS.map(({ src, label, slug }) => (
          <Link
            key={slug}
            href={`/wiki/${slug}`}
            aria-label={`${label}: ver en la Wiki`}
            className="group relative aspect-square w-52 shrink-0 snap-center overflow-hidden rounded-2xl ring-1 ring-neutral-900/10 transition-all hover:-translate-y-1 hover:ring-2 hover:ring-primary/50 md:w-56"
          >
            <Image
              src={src}
              alt={label}
              fill
              sizes="(min-width: 768px) 224px, 208px"
              className="object-cover"
            />
            {/* Afordancia de enlace: aparece al pasar el cursor */}
            <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
          </Link>
        ))}
      </CarruselFila>
    </div>
  );
}
