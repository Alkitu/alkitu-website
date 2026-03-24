import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { getSeoAlternates, getServiceSchema, getFaqSchema } from "@/lib/seo";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import Link from "next/link";
import { ServiceHero, ServiceSection } from "../components";
import FinalCTA from "../components/FinalCTA";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/app/components/molecules/breadcrumbs";
import { Code2, MonitorCheck, ShoppingCart, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.servicios.websCorporativas.hero.title,
    description: text.servicios.websCorporativas.hero.subtitle,
    alternates: getSeoAlternates(lang, '/servicios/webs-corporativas'),
  };
}

export default async function WebsCorporativasPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.websCorporativas;

  const supabase = await createClient();
  const { data: projectsData } = await supabase
    .from("projects")
    .select(`
      id,
      image_url,
      project_categories!inner(categories(slug))
    `)
    .in("project_categories.categories.slug", ["webs-corporativas"])
    .limit(6);

  const galleryImages = projectsData
    ?.map(p => p.image_url)
    .filter(url => url !== null && url !== "") || [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getServiceSchema({
          name: lang === 'es' ? 'Webs Corporativas' : 'Corporate Websites',
          description: lang === 'es'
            ? 'Diseño y desarrollo de webs corporativas profesionales con código custom (Next.js/React), WordPress o Shopify. Sitios rápidos, seguros y optimizados para SEO.'
            : 'Design and development of professional corporate websites with custom code (Next.js/React), WordPress, or Shopify. Fast, secure, and SEO-optimized sites.',
          url: `https://alkitu.com/${lang}/servicios/webs-corporativas`,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getFaqSchema([
          {
            question: lang === 'es' ? '¿Qué tipo de web corporativa necesito: código custom, WordPress o Shopify?' : 'What type of corporate website do I need: custom code, WordPress, or Shopify?',
            answer: lang === 'es'
              ? 'Depende de tus necesidades. Código custom (Next.js/React) es ideal para sitios con alta interactividad, rendimiento crítico o funcionalidades únicas. WordPress es perfecto para sitios con mucho contenido que el equipo necesita gestionar frecuentemente. Shopify es la mejor opción si vendes productos online y necesitas una tienda robusta con pasarelas de pago integradas.'
              : 'It depends on your needs. Custom code (Next.js/React) is ideal for sites with high interactivity, critical performance, or unique functionality. WordPress is perfect for content-heavy sites that the team needs to manage frequently. Shopify is the best option if you sell products online and need a robust store with integrated payment gateways.',
          },
          {
            question: lang === 'es' ? '¿Cuánto cuesta una web corporativa profesional?' : 'How much does a professional corporate website cost?',
            answer: lang === 'es'
              ? 'El coste varía según la complejidad y la tecnología elegida. Una web WordPress profesional puede partir desde 3.000€, mientras que un desarrollo custom con Next.js puede ir desde 6.000€ en adelante. Cada proyecto se presupuesta individualmente según funcionalidades, número de páginas, integraciones y requisitos de diseño.'
              : 'The cost varies depending on complexity and chosen technology. A professional WordPress website can start from $3,500, while a custom Next.js development can start from $7,000 and up. Each project is quoted individually based on features, number of pages, integrations, and design requirements.',
          },
          {
            question: lang === 'es' ? '¿La web estará optimizada para SEO y velocidad?' : 'Will the website be optimized for SEO and speed?',
            answer: lang === 'es'
              ? 'Sí. Todas nuestras webs se desarrollan con SEO técnico integrado: estructura semántica, meta etiquetas, schema markup (JSON-LD), sitemap XML, Core Web Vitals optimizados (LCP < 2.5s, CLS < 0.1) y certificado SSL. Además, implementamos GEO (Generative Engine Optimization) para que tu web también aparezca en respuestas de IA como ChatGPT y Perplexity.'
              : 'Yes. All our websites are developed with integrated technical SEO: semantic structure, meta tags, schema markup (JSON-LD), XML sitemap, optimized Core Web Vitals (LCP < 2.5s, CLS < 0.1), and SSL certificate. We also implement GEO (Generative Engine Optimization) so your website appears in AI responses from ChatGPT and Perplexity.',
          },
          {
            question: lang === 'es' ? '¿Puedo gestionar el contenido de mi web yo mismo?' : 'Can I manage my website content myself?',
            answer: lang === 'es'
              ? 'Sí. Las webs WordPress y Shopify incluyen panel de administración intuitivo. Las webs custom con Next.js pueden incluir un CMS headless (como Contentlayer o Sanity) para que tu equipo edite contenido sin necesidad de programar. Proporcionamos formación y documentación para que seas autónomo.'
              : 'Yes. WordPress and Shopify websites include an intuitive admin panel. Custom Next.js websites can include a headless CMS (like Contentlayer or Sanity) so your team can edit content without coding. We provide training and documentation so you can be self-sufficient.',
          },
          {
            question: lang === 'es' ? '¿Cuánto tiempo tarda en estar lista una web corporativa?' : 'How long does it take to build a corporate website?',
            answer: lang === 'es'
              ? 'Una web WordPress profesional se entrega en 4-6 semanas. Un desarrollo custom con Next.js/React toma entre 6 y 12 semanas dependiendo de la complejidad. El proceso incluye diseño UX/UI, desarrollo, revisiones, testing y lanzamiento con soporte post-entrega.'
              : 'A professional WordPress website is delivered in 4-6 weeks. A custom Next.js/React development takes 6 to 12 weeks depending on complexity. The process includes UX/UI design, development, revisions, testing, and launch with post-delivery support.',
          },
        ]))
      }} />
      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: lang === 'es' ? 'Servicios' : 'Services', href: '/servicios/branding' },
          { label: lang === 'es' ? 'Webs Corporativas' : 'Corporate Websites' },
        ]}
      />
      <TailwindGrid fullSize>
      <div className="col-span-full flex flex-col gap-y-24 md:gap-y-32 lg:gap-y-40 px-6 md:px-12 lg:px-24 xl:px-40 py-24 md:py-32 w-full mx-auto">
        <ServiceHero
          title={content?.hero?.title}
          subtitle={content?.hero?.subtitle}
          description={content?.hero?.description}
          cta={content?.hero?.cta}
          lang={lang}
          galleryImages={galleryImages}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Web con Codigo (Code) */}
          <ServiceSection id="web-code" className="h-full">
            <div className="group relative overflow-hidden bg-foreground/5 dark:bg-zinc-900/50 rounded-3xl p-8 lg:p-10 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
                <Code2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black mb-4">
                {content?.sections?.code?.title}
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8 flex-grow">
                {content?.sections?.code?.description}
              </p>
              {content?.sections?.code?.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {content.sections.code.tags.map((tag: string, j: number) => (
                    <span
                      key={j}
                      className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ServiceSection>

          {/* Web con WordPress */}
          <ServiceSection id="web-wordpress" className="h-full">
            <div className="group relative overflow-hidden bg-foreground/5 dark:bg-zinc-900/50 rounded-3xl p-8 lg:p-10 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-[#21759b]/10 flex items-center justify-center mb-8 text-[#21759b] group-hover:scale-110 transition-transform duration-500">
                <MonitorCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black mb-4">
                {content?.sections?.wordpress?.title}
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8 flex-grow">
                {content?.sections?.wordpress?.description}
              </p>
              {content?.sections?.wordpress?.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {content.sections.wordpress.tags.map((tag: string, j: number) => (
                    <span
                      key={j}
                      className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#21759b]/10 text-[#21759b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ServiceSection>

          {/* Web con Shopify */}
          <ServiceSection id="web-shopify" className="h-full">
            <div className="group relative overflow-hidden bg-foreground/5 dark:bg-zinc-900/50 rounded-3xl p-8 lg:p-10 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-[#96bf48]/10 flex items-center justify-center mb-8 text-[#96bf48] group-hover:scale-110 transition-transform duration-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black mb-4">
                {content?.sections?.shopify?.title}
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-8 flex-grow">
                {content?.sections?.shopify?.description}
              </p>
              {content?.sections?.shopify?.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {content.sections.shopify.tags.map((tag: string, j: number) => (
                    <span
                      key={j}
                      className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[#96bf48]/10 text-[#96bf48]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </ServiceSection>
        </div>

        {/* Redirect to Web App Custom */}
        <ServiceSection id="web-app-redirect" className="mt-8">
          <div className="group relative overflow-hidden bg-primary/5 rounded-[3rem] p-12 lg:p-20 border border-primary/20 text-center hover:bg-primary/10 transition-colors">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              {content?.sections?.webAppRedirect?.title}
            </h2>
            <p className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-10">
              {content?.sections?.webAppRedirect?.description}
            </p>
            {content?.sections?.webAppRedirect?.cta && (
              <Link
                href={`/${lang}/servicios/product-building/web-app-custom`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold text-lg rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {content.sections.webAppRedirect.cta}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </ServiceSection>

        {/* Final CTA */}
        <FinalCTA lang={lang} />
      </div>
    </TailwindGrid>
    </>
  );
}
