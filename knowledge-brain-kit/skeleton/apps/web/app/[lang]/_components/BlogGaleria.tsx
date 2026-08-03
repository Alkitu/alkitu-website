import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import { getAllPosts } from "@/lib/content/blog";
import { BLOG_HOME_MAX, getHomeBlogSlugs } from "@/lib/home/config";

const COPY: Record<
  Locale,
  { eyebrow: string; titulo: string; lead: string; verTodos: string; verTodosHref: string; leer: string }
> = {
  es: {
    eyebrow: "Escribo",
    titulo: "Desde el blog",
    lead: "Notas sobre marca, producto y el oficio de diseñar sistemas.",
    verTodos: "Ver todo el blog",
    verTodosHref: "/blog",
    leer: "Leer",
  },
  en: {
    eyebrow: "I write",
    titulo: "From the blog",
    lead: "Notes on brand, product and the craft of designing systems.",
    verTodos: "See the whole blog",
    verTodosHref: "/en/blog",
    leer: "Read",
  },
};

/**
 * Sección de la home: galería HORIZONTAL de artículos del blog con tarjetas
 * "de blog" (portada, categoría·lectura, fecha, título, extracto). Orden por
 * defecto por fecha desc (reciente→antiguo); orden/selección editable en
 * /admin/inicio (Mongo home_config), reconciliado contra los posts reales.
 */
export async function BlogGaleria({ lang = "es" }: { lang?: Locale }) {
  const t = COPY[lang];
  const allPosts = await getAllPosts();
  const order = await getHomeBlogSlugs();
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]));
  const posts = (
    order.length
      ? order.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p))
      : allPosts
  ).slice(0, BLOG_HOME_MAX);
  if (!posts.length) return null;

  return (
    <section className="border-t border-neutral-300/70">
      <div className="mx-auto max-w-page px-6 py-24 md:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-neutral-500">{t.eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-[3.4rem]">
              {t.titulo}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-600">{t.lead}</p>
          </div>
          <Link
            href={t.verTodosHref}
            className="border-b border-foreground pb-1 text-body transition-opacity hover:opacity-60"
          >
            {t.verTodos}
          </Link>
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {posts.map(({ slug, frontmatter: f }) => (
            <Link
              key={slug}
              href={f.slug ?? `/blog/${slug}`}
              className="group flex w-[82vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-[24rem]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-accent">
                {f.portada ? (
                  <Image
                    src={f.portada}
                    alt={f.title}
                    fill
                    sizes="(min-width: 640px) 24rem, 82vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                {f.categoria ? (
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                    {f.categoria}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-neutral-400">
                  {f.fecha ? <span>{f.fecha}</span> : null}
                  {f.fecha && f.lectura ? <span aria-hidden>·</span> : null}
                  {f.lectura ? <span>{f.lectura}</span> : null}
                </div>
                <h3 className="text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                  {f.title}
                </h3>
                {f.extracto ? (
                  <p className="line-clamp-3 text-body leading-relaxed text-neutral-600">{f.extracto}</p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-body font-medium">
                  {t.leer}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
