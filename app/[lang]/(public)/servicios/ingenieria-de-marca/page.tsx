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
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getServiceSchema({
          name: lang === 'es' ? 'Ingeniería de Marca' : 'Brand Engineering',
          description: lang === 'es'
            ? 'Framework estratégico basado en ISO 20671 para construir marcas coherentes. Cubre ADN de marca, identidad verbal, identidad visual e identidad espacial.'
            : 'Strategic framework based on ISO 20671 to build coherent brands. Covers brand DNA, verbal identity, visual identity, and spatial identity.',
          url: `https://alkitu.com/${lang}/servicios/ingenieria-de-marca`,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getFaqSchema([
          {
            question: lang === 'es' ? '¿Qué es la ingeniería de marca?' : 'What is brand engineering?',
            answer: lang === 'es'
              ? 'La ingeniería de marca es un framework estratégico basado en el estándar ISO 20671 que estructura la construcción de marca en cuatro pilares: ADN de marca, identidad verbal, identidad visual e identidad espacial. A diferencia del branding tradicional, aplica metodología sistemática para garantizar coherencia en cada punto de contacto.'
              : 'Brand engineering is a strategic framework based on the ISO 20671 standard that structures brand building into four pillars: brand DNA, verbal identity, visual identity, and spatial identity. Unlike traditional branding, it applies systematic methodology to ensure coherence at every touchpoint.',
          },
          {
            question: lang === 'es' ? '¿Cuál es la diferencia entre branding e ingeniería de marca?' : 'What is the difference between branding and brand engineering?',
            answer: lang === 'es'
              ? 'El branding tradicional se enfoca en elementos visuales como logo y colores. La ingeniería de marca es un proceso integral que abarca estrategia, identidad verbal (tono, naming, mensajes), identidad visual (diseño, tipografía, color) e identidad espacial (cómo se experimenta la marca en entornos físicos y digitales). Según Forbes, las marcas coherentes generan un 23% más de ingresos.'
              : 'Traditional branding focuses on visual elements like logos and colors. Brand engineering is a comprehensive process covering strategy, verbal identity (tone, naming, messaging), visual identity (design, typography, color), and spatial identity (how the brand is experienced in physical and digital environments). According to Forbes, coherent brands generate 23% more revenue.',
          },
          {
            question: lang === 'es' ? '¿Qué incluye el pilar de ADN de marca?' : 'What does the brand DNA pillar include?',
            answer: lang === 'es'
              ? 'El ADN de marca incluye la historia de la marca, definición de buyer persona en cuatro niveles (demográfico, geográfico, psicográfico y conductual), propuesta de valor única, misión, visión, valores corporativos y posicionamiento estratégico en el mercado.'
              : 'Brand DNA includes brand history, buyer persona definition across four levels (demographic, geographic, psychographic, and behavioral), unique value proposition, mission, vision, corporate values, and strategic market positioning.',
          },
          {
            question: lang === 'es' ? '¿Cuánto tiempo toma un proyecto de ingeniería de marca?' : 'How long does a brand engineering project take?',
            answer: lang === 'es'
              ? 'Un proyecto completo de ingeniería de marca toma entre 8 y 16 semanas, dependiendo de la complejidad y el alcance. Incluye investigación, estrategia, diseño de los cuatro pilares y entrega de un sistema de recursos para el cliente con guías de estilo, manuales de marca y activos digitales listos para usar.'
              : 'A complete brand engineering project takes 8 to 16 weeks, depending on complexity and scope. It includes research, strategy, design of all four pillars, and delivery of a client resource system with style guides, brand manuals, and ready-to-use digital assets.',
          },
          {
            question: lang === 'es' ? '¿Por qué es importante invertir en una marca coherente?' : 'Why is it important to invest in a coherent brand?',
            answer: lang === 'es'
              ? 'Según Interbrand, la marca representa hasta el 30% de la capitalización bursátil de una empresa. Una marca coherente genera confianza, diferenciación y lealtad del cliente. Las empresas con marca fragmentada (logo, web y redes sociales desconectados) pierden credibilidad y oportunidades de negocio.'
              : 'According to Interbrand, the brand represents up to 30% of a company\'s market capitalization. A coherent brand generates trust, differentiation, and customer loyalty. Companies with fragmented brands (disconnected logo, website, and social media) lose credibility and business opportunities.',
          },
        ]))
      }} />
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
