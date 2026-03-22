import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import Link from "next/link";
import { ServiceHero, ServiceSection } from "../../components";
import FinalCTA from "../../components/FinalCTA";
import { createClient } from "@/lib/supabase/server";
import { AppWindow, CheckCircle2, Rocket, Users2, Layers, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

export default async function WebAppCustomPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.webAppCustom;

  const supabase = await createClient();
  const { data: projectsData } = await supabase
    .from("projects")
    .select(`
      id,
      image_url,
      project_categories!inner(categories(slug))
    `)
    .in("project_categories.categories.slug", ["web-app", "ui-ux-prototyping"])
    .limit(6);

  const galleryImages = projectsData
    ?.map(p => p.image_url)
    .filter(url => url !== null && url !== "") || [];

  return (
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

        {/* What You Get Section (Moved Up for better flow) */}
        <ServiceSection id="what-you-get">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                {content?.sections?.whatYouGet?.title}
              </h2>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
                {content?.sections?.whatYouGet?.description}
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 lg:p-12">
              {content?.sections?.whatYouGet?.items && (
                <ul className="space-y-6">
                  {content.sections.whatYouGet.items.map(
                    (item: any, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-foreground/90 font-medium text-lg"
                      >
                        <CheckCircle2 className="w-7 h-7 text-primary shrink-0" />
                        <span>{typeof item === "string" ? item : item.text}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </ServiceSection>

        {/* Examples Section */}
        <ServiceSection id="examples" className="bg-foreground/5 dark:bg-zinc-900/30 rounded-[3rem] p-8 md:p-16 lg:p-24 border border-border/50">
          <div className="flex flex-col md:text-center md:items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              {content?.sections?.examples?.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl">
              {content?.sections?.examples?.description}
            </p>
          </div>
          {content?.sections?.examples?.items && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.sections.examples.items.map(
                (example: any, i: number) => {
                  const icons = [Layers, Cpu, AppWindow, ShieldCheck, Rocket];
                  const Icon = icons[i % icons.length];
                  return (
                    <div
                      key={i}
                      className="bg-background rounded-3xl p-8 border border-border/50 shadow-lg hover:-translate-y-2 transition-transform duration-500"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {example.name}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {example.description}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </ServiceSection>

        {/* Process Section */}
        <ServiceSection id="process">
          <div className="flex flex-col md:text-center md:items-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              {content?.sections?.process?.title}
            </h2>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl">
              {content?.sections?.process?.description}
            </p>
          </div>
          {content?.sections?.process?.steps && (
            <div className="relative border-l-4 border-primary/20 ml-6 md:mx-auto md:w-3/4 lg:w-2/3 space-y-12 pb-8">
              {content.sections.process.steps.map(
                (step: any, i: number) => (
                  <div key={i} className="relative pl-10 md:pl-16">
                    <span className="absolute -left-[22px] top-1 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-black text-lg ring-8 ring-background">
                      {i + 1}
                    </span>
                    <div className="bg-foreground/5 dark:bg-zinc-900/50 p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors">
                      <h3 className="text-2xl font-bold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-xl text-foreground/70 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </ServiceSection>

        {/* For Whom Section */}
        <ServiceSection id="for-whom">
          <div className="group relative overflow-hidden bg-primary rounded-[3rem] p-12 lg:p-20 text-white text-center">
            <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 hidden">
               <Users2 className="w-16 h-16 mx-auto mb-6 text-white/50" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight relative z-10 text-white">
              {content?.sections?.forWhom?.title}
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-16 relative z-10">
              {content?.sections?.forWhom?.description}
            </p>
            {content?.sections?.forWhom?.profiles && (
              <div className="grid sm:grid-cols-2 gap-8 relative z-10 text-left">
                {content.sections.forWhom.profiles.map(
                  (profile: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <h3 className="text-2xl font-bold mb-3 text-white">
                        {profile.name}
                      </h3>
                      <p className="text-white/80 text-lg leading-relaxed">
                        {profile.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </ServiceSection>

        {/* Final CTA */}
        <FinalCTA lang={lang} />
      </div>
    </TailwindGrid>
  );
}
