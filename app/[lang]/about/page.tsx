import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import { AboutHero } from "@/app/components/organisms/about-hero";
import { AboutOrigin } from "@/app/components/organisms/about-origin"; 
import { AboutPrinciples } from "@/app/components/organisms/about-principles";
import { AboutTeam } from "@/app/components/organisms/about-team";
import { SideBar } from "@/app/components/organisms/sidebar";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <>
      <TailwindGrid fullSize>
         <SideBar text={text} />
         <div className="col-span-full flex flex-col">
            <AboutHero dictionary={text} />
            <AboutOrigin dictionary={text} />
            <AboutPrinciples dictionary={text} />
            <AboutTeam dictionary={text} />
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
