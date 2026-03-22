import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { ServiceHero, ServiceSection } from "../components";
import FinalCTA from "../components/FinalCTA";
import Link from "next/link";
import { Search, MapPin, MousePointerClick, Share2, Mail, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.servicios.marketingDigital.hero.title,
    description: text.servicios.marketingDigital.hero.subtitle,
  };
}

// Icon mapper for Marketing Digital services
const getServiceIcon = (id: string, className: string = "w-12 h-12 mb-6 text-primary") => {
  switch (id) {
    case "seo": return <Search className={className} strokeWidth={1.5} />;
    case "geo": return <MapPin className={className} strokeWidth={1.5} />;
    case "google-ads": return <MousePointerClick className={className} strokeWidth={1.5} />;
    case "social-money": return <Share2 className={className} strokeWidth={1.5} />;
    case "email-marketing": return <Mail className={className} strokeWidth={1.5} />;
    default: return <Megaphone className={className} strokeWidth={1.5} />;
  }
};

export default async function MarketingDigitalPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.marketingDigital;
  
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
  
  const MARKETING_CATS = ['marketing', 'audiovisual', 'audiovisuales', 'webs-corporativas', 'webs corporativas'];

  const galleryImages = (dbProjects || [])
    .filter((p: any) => {
      const cats = p.project_categories?.flatMap((pc: any) => [
        pc.categories?.slug?.toLowerCase(),
        pc.categories?.name_es?.toLowerCase(),
        pc.categories?.name_en?.toLowerCase()
      ].filter(Boolean)) || [];
      return cats.some((c: string) => MARKETING_CATS.some(mc => c.includes(mc)));
    })
    .flatMap((p: any) => {
      const main = p.image;
      const extras = (p.gallery || []).filter((g: any) => typeof g === 'string' && g);
      return main ? [main, ...extras] : extras;
    })
    .filter((url: string) => url.startsWith('http'));

  return (
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

        {/* Web Core Section */}
        <ServiceSection id="web-core" className="pt-8">
          <div className="max-w-4xl">
            <h2 className="header-section text-3xl md:text-5xl font-black uppercase mb-6">
              {content?.sections?.webCore?.title}
            </h2>
            <p className="text-xl text-foreground/80 leading-relaxed mb-10">
              {content?.sections?.webCore?.description}
            </p>
          </div>
          {content?.sections?.webCore?.items && (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.sections.webCore.items.map(
                (item: any, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 bg-background p-6 rounded-2xl border border-foreground/10 hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-foreground">{typeof item === "string" ? item : item.text}</span>
                  </li>
                )
              )}
            </ul>
          )}
        </ServiceSection>

        {/* Positioning Section */}
        <ServiceSection id="positioning" className="pt-8">
          <div className="bg-primary/5 dark:bg-primary/10 p-8 md:p-12 rounded-3xl border border-primary/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1">
                <h2 className="header-section text-2xl md:text-4xl font-bold mb-6 text-primary">
                  {content?.sections?.positioning?.title}
                </h2>
                <p className="text-xl md:text-2xl font-medium text-foreground/90 leading-relaxed max-w-4xl">
                  {content?.sections?.positioning?.description}
                </p>
              </div>
              <a href="https://www.google.com/partners/agency?id=4986583441" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 self-center">
                <img src="https://www.gstatic.com/partners/badge/images/2026/PartnerBadgeClickable.svg" alt="Google Partner" className="h-28 md:h-36 lg:h-40" />
              </a>
            </div>
          </div>
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
  );
}
