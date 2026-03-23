import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { getSeoAlternates, getServiceSchema, getFaqSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/app/components/molecules/breadcrumbs";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { ServiceHero, ServiceSection } from "../components";
import FinalCTA from "../components/FinalCTA";
import Link from "next/link";
import { Palette, MessageSquare, BookOpen, Book, Rocket, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  return {
    title: text.servicios.branding.hero.title,
    description: text.servicios.branding.hero.subtitle,
    alternates: getSeoAlternates(lang, '/servicios/branding'),
  };
}

// Icon mapper for Branding services
const getServiceIcon = (id: string, className: string = "w-12 h-12 mb-6 text-primary") => {
  switch (id) {
    case "logo": return <Palette className={className} strokeWidth={1.5} />;
    case "naming": return <MessageSquare className={className} strokeWidth={1.5} />;
    case "guia-de-estilo": return <BookOpen className={className} strokeWidth={1.5} />;
    case "manual-de-marca": return <Book className={className} strokeWidth={1.5} />;
    case "ingenieria-de-marca": return <Rocket className={className} strokeWidth={1.5} />;
    default: return <Sparkles className={className} strokeWidth={1.5} />;
  }
};

export default async function BrandingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.branding;
  
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
  
  const BRANDING_CATS = ['branding', 'webs-corporativas', 'webs corporativas'];

  const galleryImages = (dbProjects || [])
    .filter((p: any) => {
      const cats = p.project_categories?.flatMap((pc: any) => [
        pc.categories?.slug?.toLowerCase(),
        pc.categories?.name_es?.toLowerCase(),
        pc.categories?.name_en?.toLowerCase()
      ].filter(Boolean)) || [];
      return cats.some((c: string) => BRANDING_CATS.some(bc => c.includes(bc)));
    })
    .flatMap((p: any) => {
      const main = p.image;
      const extras = (p.gallery || []).filter((g: any) => typeof g === 'string' && g);
      return main ? [main, ...extras] : extras;
    })
    .filter((url: string) => url.startsWith('http'));

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getServiceSchema({
      name: 'Branding',
      description: 'Servicio profesional de branding: diseño de logo, naming, guía de estilo, manual de marca e ingeniería de marca. Metodología basada en ISO 20671.',
      url: 'https://alkitu.com/es/servicios/branding',
    })) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema([
      { question: '¿Qué incluye un servicio de branding profesional?', answer: 'Un servicio de branding profesional incluye diseño de logo, naming, guía de estilo visual, manual de marca y estrategia de posicionamiento. En Alkitu seguimos una metodología basada en la norma ISO 20671 de valoración de marca.' },
      { question: '¿Cuánto tiempo tarda un proyecto de branding?', answer: 'Un proyecto de branding completo tarda entre 4 y 8 semanas dependiendo del alcance. Incluye fases de investigación, conceptualización, diseño y entrega de archivos finales con manual de uso.' },
      { question: '¿Cuál es la diferencia entre un logo y una marca?', answer: 'Un logo es solo el símbolo gráfico. Una marca es el sistema completo: logo, colores, tipografías, tono de voz, valores y la percepción que genera en el público. Según estudios de Interbrand, una marca bien construida puede representar hasta el 30% del valor bursátil de una empresa.' },
      { question: '¿Qué es la ingeniería de marca?', answer: 'La ingeniería de marca es el proceso técnico y estratégico de construir una marca desde sus fundamentos: arquitectura de marca, sistema visual, verbal y experiencial. En Alkitu es nuestro framework propietario que va más allá del branding tradicional.' },
      { question: '¿Por qué es importante invertir en branding?', answer: 'Las empresas con branding coherente generan hasta un 23% más de ingresos según Forbes. Una marca sólida aumenta el reconocimiento, la confianza del cliente y permite cobrar precios premium frente a competidores sin marca definida.' },
    ])) }} />
    <Breadcrumbs locale={lang} items={[
      { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
      { label: lang === 'es' ? 'Servicios' : 'Services', href: '/servicios/branding' },
      { label: 'Branding' },
    ]} />
    <TailwindGrid fullSize>
      <div className="col-span-full flex flex-col gap-y-24 md:gap-y-32 lg:gap-y-40 px-6 md:px-12 lg:px-24 xl:px-40 py-24 md:py-32 w-full mx-auto">
        <ServiceHero
          title={content?.hero?.title}
          subtitle={content?.hero?.subtitle}
          description={
            content?.hero?.description
              ? (() => {
                  const keyword = lang === "es" ? "la Ingeniería de Marca" : "Brand Engineering";
                  const parts = (content.hero.description as string).split(keyword);
                  if (parts.length < 2) return content.hero.description;
                  return <>{parts[0]}<strong>{keyword}</strong>{parts[1]}</>;
                })()
              : undefined
          }
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

        {/* Services List */}
        <ServiceSection id="services" className="pt-8">
          <h2 className="header-section text-3xl md:text-5xl font-black uppercase mb-12">
            {content?.sections?.services?.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content?.sections?.services?.items
              ?.filter((service: any) => service.id !== "ingenieria-de-marca")
              .map((service: any, i: number) => (
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
              ))}
          </div>

          {/* Ingeniería de Marca — tarjeta destacada */}
          {content?.sections?.services?.items
            ?.filter((service: any) => service.id === "ingenieria-de-marca")
            .map((service: any, i: number) => (
              <div
                key={`im-${i}`}
                id={service.id}
                className="group relative bg-primary rounded-3xl p-10 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {getServiceIcon(service.id, "w-10 h-10 text-white")}
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-white">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                    {service.description}
                  </p>
                </div>
                {service.cta && (
                  <Link
                    href={service.url ? `/${lang}${service.url}` : `/${lang}/contact`}
                    className="inline-flex items-center font-bold text-white underline underline-offset-4 hover:no-underline text-lg flex-shrink-0"
                  >
                    {service.cta}
                  </Link>
                )}
              </div>
            ))}
        </ServiceSection>

        {/* Final CTA */}
        <FinalCTA lang={lang} />
      </div>
    </TailwindGrid>
    </>
  );
}
