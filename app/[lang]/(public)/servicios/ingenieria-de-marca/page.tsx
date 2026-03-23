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
import { Target, MessageSquare, Eye, Box, ArrowRight, Zap, Star, ShieldCheck, Lightbulb, Rocket, Compass, Sparkles } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.servicios.ingenieriaDeMarca.hero.title,
    description: text.servicios.ingenieriaDeMarca.hero.subtitle,
    alternates: getSeoAlternates(lang, '/servicios/ingenieria-de-marca'),
  };
}

export default async function IngenieriaDeMarcaPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.ingenieriaDeMarca;

  // Fetch Supabase projects for DomeGallery
  const supabase = await createClient();
  const { data: projectsData } = await supabase
    .from("projects")
    .select(`
      id,
      image_url,
      project_categories!inner(categories(slug))
    `)
    .in("project_categories.categories.slug", ["branding", "logo"])
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
          { label: lang === 'es' ? 'Ingeniería de Marca' : 'Brand Engineering' },
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

        {/* 4 Pillars Section expanded with internal cards */}
        <ServiceSection id="pillars" className="w-full">
          <div className="flex flex-col md:text-center md:items-center mb-16 lg:mb-24">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              {content?.sections?.pillars?.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl">
              {content?.sections?.pillars?.description}
            </p>
          </div>
          
          {content?.sections?.pillars?.items && (
            <div className="flex flex-col gap-y-24 lg:gap-y-32">
              {content.sections.pillars.items.map(
                (pillar: any, i: number) => {
                  const icons = [Target, MessageSquare, Eye, Box];
                  const Icon = icons[i % icons.length];
                  
                  return (
                    <div key={i} className="flex flex-col relative w-full">
                      <div className="flex items-center gap-6 mb-12 border-b border-border/50 pb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform duration-500 hover:scale-110">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-black mb-3">
                            {pillar.name}
                          </h3>
                          <p className="text-xl text-foreground/60 max-w-4xl">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                      
                      {pillar.includes && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                          {pillar.includes.map(
                            (item: any, j: number) => {
                              const subIcons = [Zap, Star, Target, ShieldCheck, Lightbulb, Rocket, Compass, Sparkles];
                              const SubIcon = subIcons[j % subIcons.length];
                              return (
                                <div
                                  key={j}
                                  className="bg-foreground/5 dark:bg-zinc-900/50 rounded-3xl p-8 border border-border/50 shadow-lg hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl hover:border-primary/30"
                                >
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <SubIcon className="w-6 h-6" />
                                  </div>
                                  <h4 className="text-xl font-bold mb-3">
                                    {item.name}
                                  </h4>
                                  <p className="text-foreground/70 leading-relaxed text-sm">
                                    {item.description}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </ServiceSection>

        {/* Note: "Documentation section" explicitly completely removed by user request */}

        {/* Client Resource System */}
        <ServiceSection id="client-resources" className="bg-foreground/5 dark:bg-zinc-900/30 rounded-[3rem] p-8 md:p-16 lg:p-24 border border-border/50">
          <div className="flex flex-col md:text-center md:items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              {content?.sections?.clientResources?.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl">
              {content?.sections?.clientResources?.description}
            </p>
          </div>
          {content?.sections?.clientResources?.items && (
            <div className="grid md:grid-cols-3 gap-8">
              {content.sections.clientResources.items.map(
                (resource: any, i: number) => (
                  <div
                    key={i}
                    className="bg-background rounded-3xl p-8 border border-border/50 shadow-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary font-black text-xl">
                      {i + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-3">
                      {resource.name}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </ServiceSection>

        {/* Final CTA */}
        <FinalCTA lang={lang} />
      </div>
    </TailwindGrid>
    </>
  );
}
