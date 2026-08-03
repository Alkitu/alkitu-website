import { Layers, HatGlasses, Shuffle, Waves, type LucideIcon } from "lucide-react";

/**
 * Iconos para reviews sin logo de marca (p. ej. metodologías). El campo `icono`
 * de la review guarda la clave; aquí se mapea al icono de lucide-react.
 */
const MAPA: Record<string, LucideIcon> = {
  layers: Layers,
  hat: HatGlasses,
  shuffle: Shuffle,
  waves: Waves,
};

export function IconoReview({
  nombre,
  className,
}: {
  nombre: string;
  className?: string;
}) {
  const Icon = MAPA[nombre] ?? Layers;
  return <Icon className={className} strokeWidth={1.5} aria-hidden />;
}
