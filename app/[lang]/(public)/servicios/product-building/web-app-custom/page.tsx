import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import { getSeoAlternates, getServiceSchema, getFaqSchema } from "@/lib/seo";
import TailwindGrid from "@/app/components/templates/grid/TailwindGrid";
import Link from "next/link";
import { ServiceHero, ServiceSection } from "../../components";
import FinalCTA from "../../components/FinalCTA";
import { createClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/app/components/molecules/breadcrumbs";
import { AppWindow, CheckCircle2, Rocket, Users2, Layers, Cpu, ShieldCheck, ArrowRight } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = text?.servicios?.webAppCustom;
  return {
    title: content?.hero?.title || (lang === 'es' ? 'Web App Custom' : 'Custom Web App'),
    description: content?.hero?.subtitle || content?.hero?.description,
    alternates: getSeoAlternates(lang, '/servicios/product-building/web-app-custom'),
  };
}

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getServiceSchema({
          name: lang === 'es' ? 'Desarrollo de Web Apps a Medida' : 'Custom Web App Development',
          description: lang === 'es'
            ? 'Desarrollo de aplicaciones web a medida con React, Next.js y TypeScript. Desde e-commerce avanzado hasta dashboards empresariales, ERPs y plataformas SaaS.'
            : 'Custom web application development with React, Next.js, and TypeScript. From advanced e-commerce to enterprise dashboards, ERPs, and SaaS platforms.',
          url: `https://alkitu.com/${lang}/servicios/product-building/web-app-custom`,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getFaqSchema([
          {
            question: lang === 'es' ? '¿Qué es una web app a medida y cuándo la necesito?' : 'What is a custom web app and when do I need one?',
            answer: lang === 'es'
              ? 'Una web app a medida es una aplicación web construida específicamente para las necesidades de tu negocio, a diferencia de soluciones genéricas como WordPress o Shopify. La necesitas cuando tus procesos requieren funcionalidades que no existen en herramientas estándar: dashboards con datos en tiempo real, flujos de trabajo personalizados, integraciones con sistemas internos, o cuando la escala y rendimiento son críticos.'
              : 'A custom web app is a web application built specifically for your business needs, unlike generic solutions like WordPress or Shopify. You need one when your processes require functionality that doesn\'t exist in standard tools: real-time data dashboards, custom workflows, integrations with internal systems, or when scale and performance are critical.',
          },
          {
            question: lang === 'es' ? '¿Qué tecnologías utilizan para desarrollar web apps?' : 'What technologies do you use to develop web apps?',
            answer: lang === 'es'
              ? 'Trabajamos con un stack moderno: React y Next.js para el frontend, TypeScript para código robusto, Tailwind CSS para diseño, Supabase (PostgreSQL) para base de datos, y Vercel para hosting con CDN global. También integramos Framer Motion para animaciones, Three.js para 3D, y Stripe para pagos. Todo con arquitectura serverless para máxima escalabilidad.'
              : 'We work with a modern stack: React and Next.js for frontend, TypeScript for robust code, Tailwind CSS for design, Supabase (PostgreSQL) for database, and Vercel for hosting with global CDN. We also integrate Framer Motion for animations, Three.js for 3D, and Stripe for payments. All with serverless architecture for maximum scalability.',
          },
          {
            question: lang === 'es' ? '¿Cuánto cuesta desarrollar una web app a medida?' : 'How much does it cost to develop a custom web app?',
            answer: lang === 'es'
              ? 'Un MVP funcional puede partir desde 10.000€, mientras que aplicaciones empresariales completas pueden ir de 25.000€ a 80.000€+. Usamos Spec-Driven Development: primero definimos especificaciones claras con wireframes y prototipos, para que conozcas el alcance y coste exacto antes de escribir una línea de código.'
              : 'A functional MVP can start from $12,000, while complete enterprise applications can range from $30,000 to $90,000+. We use Spec-Driven Development: we first define clear specifications with wireframes and prototypes, so you know the exact scope and cost before a single line of code is written.',
          },
          {
            question: lang === 'es' ? '¿Incluyen diseño UI/UX en el desarrollo?' : 'Do you include UI/UX design in the development?',
            answer: lang === 'es'
              ? 'Sí. Cada proyecto incluye diseño UI/UX completo con sistema de diseño propio: wireframes, prototipos interactivos en Figma, testing de usabilidad, y un design system con componentes reutilizables. No usamos plantillas — cada interfaz se diseña desde cero para tu caso de uso específico.'
              : 'Yes. Every project includes complete UI/UX design with a custom design system: wireframes, interactive Figma prototypes, usability testing, and a design system with reusable components. We don\'t use templates — every interface is designed from scratch for your specific use case.',
          },
          {
            question: lang === 'es' ? '¿Qué pasa después del lanzamiento? ¿Ofrecen soporte?' : 'What happens after launch? Do you offer support?',
            answer: lang === 'es'
              ? 'Sí. Ofrecemos soporte post-lanzamiento que incluye monitorización de rendimiento, corrección de bugs, actualizaciones de seguridad y mejoras iterativas. También proporcionamos documentación técnica completa y formación para que tu equipo pueda operar la aplicación de forma autónoma.'
              : 'Yes. We offer post-launch support including performance monitoring, bug fixes, security updates, and iterative improvements. We also provide complete technical documentation and training so your team can operate the application independently.',
          },
        ]))
      }} />
      <Breadcrumbs
        locale={lang}
        items={[
          { label: lang === 'es' ? 'Inicio' : 'Home', href: '' },
          { label: lang === 'es' ? 'Servicios' : 'Services', href: '/servicios/branding' },
          { label: 'Product Building', href: '/servicios/product-building' },
          { label: 'Web App Custom' },
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
    </>
  );
}
