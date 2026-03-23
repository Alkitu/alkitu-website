import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { getSeoAlternates } from "@/lib/seo";
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
