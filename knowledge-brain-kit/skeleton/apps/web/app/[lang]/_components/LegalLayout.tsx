// Layout editorial compartido por las páginas legales (privacidad, cookies).
// Server component, tokenizado (sin hex). El contenido llega por props (bilingüe
// desde la página). Estilo alineado con casos/wiki: hero + secciones a máx 3xl.

export type SeccionLegal = {
  h: string;
  p?: string[];
  items?: string[];
};

export function LegalLayout({
  titulo,
  actualizado,
  intro,
  secciones,
}: {
  titulo: string;
  actualizado: string;
  intro?: string;
  secciones: SeccionLegal[];
}) {
  return (
    <>
      <section className="mx-auto max-w-[1500px] px-6 pb-12 pt-32 md:pt-44">
        <h1 className="max-w-4xl font-bold leading-[0.98] tracking-[-0.03em] text-[clamp(2.4rem,6vw,4.5rem)]">
          {titulo}
          <span style={{ color: "var(--primary)" }}>.</span>
        </h1>
        <p className="mt-6 text-sm text-neutral-500">{actualizado}</p>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {intro}
          </p>
        ) : null}
      </section>

      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl space-y-12">
            {secciones.map((s, i) => (
              <div key={i}>
                <h2 className="text-2xl font-semibold tracking-tight md:text-[1.8rem]">
                  {s.h}
                </h2>
                {s.p?.length ? (
                  <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-neutral-700">
                    {s.p.map((par, j) => (
                      <p key={j}>{par}</p>
                    ))}
                  </div>
                ) : null}
                {s.items?.length ? (
                  <ul className="mt-4 space-y-2 text-[17px] leading-relaxed text-neutral-700">
                    {s.items.map((it, j) => (
                      <li key={j} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--primary)" }}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
