import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { getPostSlugs, getPostSource, getRelatedPosts, type BlogFrontmatter } from "@/lib/content/blog";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { remarkGlosarioLinks } from "@/lib/glosario";
import { JsonLd, articleLd, breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
import { mdxComponents } from "../_components/mdx-components";

const toISO = (d?: string | Date) =>
  d instanceof Date ? d.toISOString().slice(0, 10) : d;

type RouteParams = { params: Promise<{ lang: Locale; slug: string }> };

// Textos del chrome del artículo por locale (el cuerpo llega ya traducido del MDX).
const T = {
  es: {
    noEncontrado: "Artículo no encontrado | [Concepto]",
    volver: "← Volver al blog",
    por: (a: string) => `por ${a}`,
    compartir: "Compartir:",
    copiar: "Copiar enlace",
    inicio: "Inicio",
    blog: "Blog",
    sigueLeyendo: "Sigue leyendo",
    deLectura: "de lectura",
  },
  en: {
    noEncontrado: "Article not found | [Concept]",
    volver: "← Back to the blog",
    por: (a: string) => `by ${a}`,
    compartir: "Share:",
    copiar: "Copy link",
    inicio: "Home",
    blog: "Blog",
    sigueLeyendo: "Keep reading",
    deLectura: "read",
  },
} as const;

// Base de rutas por locale (ES en raíz, EN bajo /en/ con el mismo slug de artículo).
const blogBase = (lang: Locale) => (lang === "en" ? "/en/blog" : "/blog");
const homeUrl = (lang: Locale) => (lang === "en" ? "/en" : "/");

// Solo existen los artículos con MDX real; un slug inexistente devuelve 404 real.
export const dynamicParams = false;

// Bottom-up con lang explícito (el encadenado top-down de params no genera rutas
// en Next 16/Turbopack). Ahora ES y EN: cada locale solo genera los slugs cuyo
// `<slug>.<lang>.mdx` existe, así que un slug sin traducir sigue siendo 404 en EN.
export async function generateStaticParams() {
  const perLang = await Promise.all(
    LOCALES.map(async (lang) => {
      const slugs = await getPostSlugs(lang);
      return slugs.map((slug) => ({ lang, slug }));
    }),
  );
  return perLang.flat();
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { lang, slug } = await params;
  const source = await getPostSource(slug, lang);
  if (!source) return { title: T[lang].noEncontrado };

  const { frontmatter } = await compileMDX<BlogFrontmatter>({
    source,
    options: { parseFrontmatter: true },
  });
  // La portada (si existe) es la imagen destacada para compartir (Open Graph).
  // metadataBase (en layout.tsx) la resuelve a URL absoluta.
  const og = frontmatter.portada ? [{ url: frontmatter.portada }] : undefined;
  // hreflang ES↔EN recíproco: mismo slug bajo /blog y /en/blog (par publicado).
  const esUrl = `/blog/${slug}`;
  const enUrl = `/en/blog/${slug}`;
  return {
    title: `${frontmatter.title} | ${lang === "en" ? "[Concept]" : "[Concepto]"}`,
    description: frontmatter.extracto,
    alternates: {
      canonical: lang === "en" ? enUrl : esUrl,
      languages: { es: esUrl, en: enUrl, "x-default": esUrl },
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.extracto,
      type: "article",
      images: og,
    },
    twitter: {
      card: frontmatter.portada ? "summary_large_image" : "summary",
      title: frontmatter.title,
      description: frontmatter.extracto,
      images: frontmatter.portada ? [frontmatter.portada] : undefined,
    },
  };
}

export default async function ArticuloPage({ params }: RouteParams) {
  const { lang, slug } = await params;
  const source = await getPostSource(slug, lang);

  if (!source) notFound();

  const t = T[lang];
  const base = blogBase(lang);

  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      // GFM + auto-enlazado de glosario hacia la Wiki del locale (/wiki o
      // /en/wiki). Forma tupla [plugin, lang] para pasarle el idioma.
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkGlosarioLinks, lang]],
      },
    },
  });

  const relacionados = (await getRelatedPosts(slug, lang)).map((p) => ({
    slug: p.slug,
    categoria: p.frontmatter.categoria ?? "",
    titulo: p.frontmatter.title,
    fecha: p.frontmatter.fecha ?? "",
    lectura: p.frontmatter.lectura ?? "",
    portada: p.frontmatter.portada ?? null,
  }));

  const tags = frontmatter.tags ?? [];
  const portada = frontmatter.portada;

  // FAQPage: pares pregunta/respuesta alineados por índice (GEO — que las IAs
  // extraigan Q&A). Solo se emite si ambos arrays existen y cuadran en longitud.
  const preguntas = frontmatter["geo-preguntas"] ?? [];
  const respuestas = frontmatter["geo-respuestas"] ?? [];
  const faqPairs =
    preguntas.length > 0 && preguntas.length === respuestas.length
      ? preguntas.map((pregunta, i) => ({ pregunta, respuesta: respuestas[i]! }))
      : [];
  const meta = [frontmatter.fecha, frontmatter.autor ? t.por(frontmatter.autor) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            title: frontmatter.title,
            description: frontmatter.extracto,
            url: `${base}/${slug}`,
            image: portada,
            datePublished: toISO(frontmatter.creado),
            dateModified: toISO(frontmatter.actualizado),
          }),
          breadcrumbLd([
            { name: t.inicio, url: homeUrl(lang) },
            { name: t.blog, url: base },
            { name: frontmatter.title, url: `${base}/${slug}` },
          ]),
          ...(faqPairs.length > 0 ? [faqLd(faqPairs)] : []),
        ]}
      />

      {/* CABECERA */}
      <section className="mx-auto max-w-[1500px] px-6 pb-16 pt-32 md:pt-44">
        <div className="grid gap-12 md:grid-cols-12 md:items-center">
          {/* Texto de cabecera */}
          <div className="md:col-span-7">
            <Link
              href={base}
              className="inline-block text-sm text-neutral-500 transition-colors hover:text-primary"
            >
              {t.volver}
            </Link>

            {/* Tags en píldoras con borde */}
            {tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <h1 className="mt-6 font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(2.4rem,5.5vw,4.5rem)]">
              {frontmatter.title}
            </h1>

            {meta ? <p className="mt-6 text-sm text-neutral-500">{meta}</p> : null}

            {/* Compartir */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="text-neutral-600">{t.compartir}</span>
              <button
                type="button"
                className="border-b border-transparent pb-0.5 text-neutral-600 transition-colors hover:border-current hover:text-primary"
              >
                {t.copiar}
              </button>
              <a
                href="https://x.com/intent/tweet"
                className="border-b border-transparent pb-0.5 text-neutral-600 transition-colors hover:border-current hover:text-primary"
              >
                X
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/"
                className="border-b border-transparent pb-0.5 text-neutral-600 transition-colors hover:border-current hover:text-primary"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Imagen grande (portada) */}
          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-200">
              {portada ? (
                <Image
                  src={portada}
                  alt={frontmatter.title}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CUERPO DEL ARTÍCULO (MDX) */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:py-24">
          <article className="mx-auto max-w-2xl">{content}</article>
        </div>
      </section>

      {/* ARTÍCULOS RELACIONADOS */}
      <section className="border-t border-neutral-300/70">
        <div className="mx-auto max-w-[1500px] px-6 py-16 md:py-20">
          <h2 className="mb-10 text-sm tracking-wide text-neutral-600">
            {t.sigueLeyendo}
          </h2>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((post) => (
              <article key={post.slug} className="group flex flex-col">
                <a href={`${base}/${post.slug}`} className="flex flex-col">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-200">
                    {post.portada ? (
                      <Image
                        src={post.portada}
                        alt={post.titulo}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : null}
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      {post.categoria}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
                    {post.titulo}
                  </h3>
                  <p className="mt-3 text-sm text-neutral-600">
                    {post.fecha} · {post.lectura} {t.deLectura}
                  </p>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
