import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";

import { JsonLd, faqLd } from "@/lib/seo/jsonld";

/**
 * Bloque FAQ para artículos: un autor lo inserta en un MDX con
 * `<Faq items={[{pregunta, respuesta}]} />`. Renderiza la lista accesible +
 * inyecta JSON-LD FAQPage para que los motores generativos la citen.
 */
function Faq({ items }: { items: { pregunta: string; respuesta: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="my-12">
      <JsonLd data={faqLd(items)} />
      <dl className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((qa) => (
          <div key={qa.pregunta} className="py-6">
            <dt className="text-lg font-semibold tracking-tight text-foreground">{qa.pregunta}</dt>
            <dd className="mt-2 leading-relaxed text-neutral-600">{qa.respuesta}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const PRIMARY = "var(--primary)";

/** Primer párrafo destacado (entradilla). Envuelve un `<div>` para no anidar `<p>` dentro de `<p>`. */
function Lead({ children }: { children: ReactNode }) {
  return (
    <div className="[&>p]:mt-0 [&>p]:text-xl [&>p]:leading-relaxed [&>p]:text-neutral-700">
      {children}
    </div>
  );
}

/** Caja "En la práctica" / nota lateral. */
function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-10 rounded-md border border-border bg-neutral-100/70 px-6 py-5 [&>p]:mt-0 [&>p]:text-[15px] [&>p]:text-neutral-600">
      {title ? (
        <p className="text-sm font-semibold tracking-wide text-accent-foreground">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Faq,
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="mt-14 text-2xl font-semibold tracking-tight md:text-3xl"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-12 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="mt-5 leading-relaxed text-neutral-700" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-5 leading-relaxed text-neutral-700"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-neutral-900" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a
      className="text-primary decoration-1 underline-offset-[3px] decoration-primary transition-colors hover:underline"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-12 border-l-2 pl-6 text-2xl font-light italic leading-snug text-neutral-800"
      style={{ borderColor: PRIMARY }}
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-neutral-200" />,
  table: (props: ComponentProps<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[15px]" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead {...props} />,
  th: (props: ComponentProps<"th">) => (
    <th
      className="border-b-2 border-neutral-300 py-2 pr-4 align-top font-semibold text-neutral-900"
      {...props}
    />
  ),
  td: (props: ComponentProps<"td">) => (
    <td
      className="border-b border-neutral-200 py-2 pr-4 align-top leading-relaxed text-neutral-700"
      {...props}
    />
  ),
  // Componentes a medida disponibles dentro del MDX:
  Lead,
  Callout,
};
