import { notFound } from "next/navigation";

/**
 * Catch-all 404 (Historia 7-1): con el root layout dentro de app/[lang]/, las
 * URLs que no casan con ninguna ruta (p. ej. /foo → rewrite → /es/foo) deben
 * resolverse aquí para renderizar app/[lang]/not-found.tsx con status 404.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
