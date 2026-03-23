import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { getSeoAlternates } from "@/lib/seo";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { ServiceHero, ServiceSection } from "../components";
import FinalCTA from "../components/FinalCTA";
import Link from "next/link";
import { LayoutTemplate, Smartphone, Layers, Figma, Code } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/app/components/molecules/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.servicios.productBuilding.hero.title,
    description: text.servicios.productBuilding.hero.subtitle,
    alternates: getSeoAlternates(lang, '/servicios/product-building'),
  };
}

// Icon mapper for Product Building services
const getServiceIcon = (id: string, className: string = "w-12 h-12 mb-6 text-primary") => {
  switch (id) {
    case "web-app-custom": return <LayoutTemplate className={className} strokeWidth={1.5} />;
    case "app-ios-nativa": return <Smartphone className={className} strokeWidth={1.5} />;
    case "apps-hibridas": return <Layers className={className} strokeWidth={1.5} />;
    case "prototipos-funcionales": return <Figma className={className} strokeWidth={1.5} />;
    default: return <Code className={className} strokeWidth={1.5} />;
  }
};

export default async function ProductBuildingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.productBuilding;
  
  const supabase = await createClient();
  const { data: dbProjects } = await supabase
    .from('projects')
    .select(`
      *,
      project_categories (
        categories (
          name_es,
          name_en,
          slug
        )
      )
    `)
    .eq('is_active', true);
  
  const PRODUCT_CATS = ['web-app', 'web app', 'ui/ux', 'prototyping', 'webs-corporativas', 'webs corporativas'];

  const galleryImages = (dbProjects || [])
    .filter((p: any) => {
      const cats = p.project_categories?.flatMap((pc: any) => [
        pc.categories?.slug?.toLowerCase(),
        pc.categories?.name_es?.toLowerCase(),
        pc.categories?.name_en?.toLowerCase()
      ].filter(Boolean)) || [];
      return cats.some((c: string) => PRODUCT_CATS.some(pc => c.includes(pc)));
    })
    .flatMap((p: any) => {
      const main = p.image;
      const extras = (p.gallery || []).filter((g: any) => typeof g === 'string' && g);
      return main ? [main, ...extras] : extras;
    })
    .filter((url: string) => url.startsWith('http'));

  return (
    <>
      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: lang === 'es' ? 'Servicios' : 'Services', href: '/servicios/branding' },
          { label: 'Product Building' },
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
          galleryImages={galleryImages.length > 0 ? galleryImages : undefined}
        />

        {/* Problem Section */}
        <ServiceSection id="problem">
          <div className="bg-[#D9D9D9]/50 dark:bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-foreground/5 shadow-lg">
            <h2 className="header-section text-2xl md:text-4xl font-bold mb-6">
              {content?.sections?.problem?.title}
            </h2>
            <p className="text-xl md:text-2xl font-medium text-foreground/80 leading-relaxed max-w-4xl">
              {content?.sections?.problem?.description}
            </p>
          </div>
        </ServiceSection>

        {/* How We Work Section */}
        <ServiceSection id="how-we-work" className="pt-8">
          <div className="max-w-5xl mx-auto text-center mb-24">
            <h2 className="header-section text-3xl md:text-5xl font-black uppercase mb-8">
              {content?.sections?.howWeWork?.title}
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mx-auto max-w-3xl">
              {content?.sections?.howWeWork?.description}
            </p>
          </div>
          {content?.sections?.howWeWork?.steps && (
            <div className="relative max-w-6xl mx-auto">
              {/* Timeline continuous line */}
              <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-border -translate-x-1/2 rounded-full hidden md:block"></div>
              
              <ol className="space-y-12 relative">
                {content.sections.howWeWork.steps.map(
                  (step: any, i: number) => (
                    <li key={i} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="flex-1 w-full text-left md:text-right" style={{ textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                        <div className="bg-background p-10 md:p-12 rounded-[2rem] shadow-xl border border-foreground/5 hover:border-primary/30 transition-colors inline-block w-full">
                          <h3 className="text-2xl font-black uppercase mb-4 text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-lg text-foreground/70 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                      
                      {/* Timeline Number Circle */}
                      <div className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white font-black text-2xl shadow-xl shadow-primary/30 z-10 self-start md:self-center hidden md:flex">
                        {i + 1}
                      </div>
                      
                      {/* Mobile Number Indicator */}
                      <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-black text-lg mb-2">
                        {i + 1}
                      </div>
                      
                      <div className="flex-1 hidden md:block"></div>
                    </li>
                  )
                )}
              </ol>
            </div>
          )}
        </ServiceSection>

        {/* Services List */}
        <ServiceSection id="services" className="pt-8">
          <h2 className="header-section text-3xl md:text-5xl font-black uppercase mb-12">
            {content?.sections?.services?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content?.sections?.services?.items?.map(
              (service: any, i: number) => (
                <div
                  key={i}
                  id={service.id}
                  className="group relative bg-[#D9D9D9] dark:bg-zinc-900 rounded-3xl p-10 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20 flex flex-col justify-between"
                >
                  <div>
                    {getServiceIcon(service.id)}
                    <h3 className="text-2xl font-black uppercase mb-4 text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>
                  </div>
                  {service.cta && (
                    <div className="mt-auto">
                      <Link
                        href={service.url ? `/${lang}${service.url}` : `/${lang}/contact`}
                        className="inline-flex items-center font-bold text-primary group-hover:underline underline-offset-4"
                      >
                        {service.cta}
                      </Link>
                    </div>
                  )}
                </div>
              )
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
