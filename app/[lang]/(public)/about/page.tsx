import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getSeoAlternates } from '@/lib/seo';
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { AboutHero } from "@/app/components/organisms/about-hero";
import { AboutOrigin } from "@/app/components/organisms/about-origin";
import { AboutPrinciples } from "@/app/components/organisms/about-principles";
import { AboutTeam } from "@/app/components/organisms/about-team";
import { SideBar } from "@/app/components/organisms/sidebar";
import { Breadcrumbs } from '@/app/components/molecules/breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'es' ? 'Sobre Nosotros' : 'About Us',
    description: lang === 'es'
      ? 'Conoce al equipo detrás de Alkitu, agencia digital en España'
      : 'Meet the team behind Alkitu, digital agency in Spain',
    alternates: getSeoAlternates(lang, '/about'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <>
      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: lang === 'es' ? 'Sobre Nosotros' : 'About Us' },
        ]}
      />
      <TailwindGrid fullSize>
         <SideBar sections={text?.about?.sections} />
         <div className="col-span-full flex flex-col">
            <div id="about-hero">
               <AboutHero dictionary={text} />
            </div>
            <div id="about-origin">
               <AboutOrigin dictionary={text} />
            </div>
            <div id="about-principles">
               <AboutPrinciples dictionary={text} />
            </div>
            <div id="about-team">
               <AboutTeam dictionary={text} />
            </div>
         </div>
      </TailwindGrid>
    </>
  );
}

// Reusing BigQuote from existing components as a spacer/breaker if appropriate, 
// or just standard separation. 
// Actually, looking at the design, "Principios" works well.
// But wait, I imported BigQuoteSection but didn't define it. 
// I'll reuse the existing BigQuote if available or just omit it if not in the plan.
// Plan said: Hero, Origin, Principles, Team. 
// I will stick to the plan strictly.
