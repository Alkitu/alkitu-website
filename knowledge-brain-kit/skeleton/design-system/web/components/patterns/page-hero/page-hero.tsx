import type { ReactNode } from "react";

/**
 * Cabecera editorial de sección (Blog., Reviews., Casos.…). Estructura común:
 * contenedor max-w-page + grid de 12 columnas + titular con período de marca
 * (marca, vía token) + lead atenuado. Las variaciones tipográficas y de reparto
 * por página se pasan como className (paridad exacta). ds:patterns/page-hero.
 */
export function PageHero({
  title,
  lead,
  accent = ".",
  className = "pb-16 pt-32 md:pt-44",
  gridClassName = "gap-10",
  titleClassName = "",
  leadClassName = "",
  children,
}: {
  title: ReactNode;
  lead: ReactNode;
  accent?: ReactNode;
  className?: string;
  gridClassName?: string;
  titleClassName?: string;
  leadClassName?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`mx-auto max-w-page px-6 ${className}`}>
      <div className={`grid md:grid-cols-12 md:items-end ${gridClassName}`}>
        <h1 className={`font-bold ${titleClassName}`}>
          {title}
          <span className="text-primary">{accent}</span>
        </h1>
        <p className={`text-lg leading-relaxed text-neutral-600 ${leadClassName}`}>{lead}</p>
      </div>
      {children}
    </section>
  );
}
