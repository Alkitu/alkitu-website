import type { ReactNode } from 'react';

/**
 * Cabecera común de las secciones del panel admin: título con acento marca,
 * descripción y zona de acciones. Encoda el look real de la web (promovido desde
 * `apps/web` en la remediación 2026-07-11 · FR-14). Componente presentacional
 * puro (sin hooks) → válido en Server Components.
 */
export interface AdminPageHeaderProps {
  /** Título de la sección (obligatorio). */
  title: string;
  /** Descripción o subtítulo opcional. */
  description?: string;
  /** Acciones opcionales, alineadas a la derecha. */
  actions?: ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-4xl">
          {title}
          <span className="text-primary">.</span>
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}
