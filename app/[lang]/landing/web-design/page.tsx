import { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { createClient } from '@/lib/supabase/server';
import HeroSection from './components/HeroSection';
import {
  ProblemSection,
  WhatsIncludedSection,
  WhyAlkituSection,
  HowItWorksSection,
  GuaranteeSection,
} from './components/ContentSections';
import PortfolioSection from './components/PortfolioSection';
import FaqSection from './components/FaqSection';
import FinalCtaSection from './components/FinalCtaSection';
import LandingThemeDefault from './components/LandingThemeDefault';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const meta = (text as any)?.landingWebDesign?.meta;

  return {
    title: meta?.title,
    description: meta?.description,
    // Ad landings should NOT compete with the SEO main pages.
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}/landing/web-design`,
      languages: {
        es: `${SITE_URL}/es/landing/web-design`,
        en: `${SITE_URL}/en/landing/web-design`,
        'x-default': `${SITE_URL}/es/landing/web-design`,
      },
    },
    openGraph: {
      title: meta?.title,
      description: meta?.description,
      url: `${SITE_URL}/${lang}/landing/web-design`,
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

const PORTFOLIO_CATS = [
  'webs-corporativas',
  'webs corporativas',
  'website',
  'websites',
  'marketing',
  'audiovisual',
  'audiovisuales',
];

type MarqueeProject = { slug: string; title: string; image: string };

export default async function LandingWebDesignPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);
  const content = (text as any)?.landingWebDesign;

  // Pull projects (full enough to render miniature cards) from Supabase
  let portfolioProjects: MarqueeProject[] = [];
  try {
    const supabase = await createClient();
    const { data: dbProjects } = await supabase
      .from('projects')
      .select(
        `
        slug,
        title_es,
        title_en,
        image,
        display_order,
        is_active,
        project_categories (
          categories (
            name_es,
            name_en,
            slug
          )
        )
      `
      )
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    portfolioProjects = (dbProjects || [])
      .filter((p: any) => {
        const cats =
          p.project_categories?.flatMap((pc: any) =>
            [
              pc.categories?.slug?.toLowerCase(),
              pc.categories?.name_es?.toLowerCase(),
              pc.categories?.name_en?.toLowerCase(),
            ].filter(Boolean)
          ) || [];
        return cats.some((c: string) => PORTFOLIO_CATS.some((pc) => c.includes(pc)));
      })
      .filter((p: any) => typeof p.image === 'string' && p.image.startsWith('http') && p.slug)
      .map((p: any) => ({
        slug: p.slug,
        title: lang === 'es' ? p.title_es || p.title_en : p.title_en || p.title_es,
        image: p.image,
      }));
  } catch (_) {
    /* portfolio is non-critical; section will just hide if empty */
  }

  return (
    <>
      <LandingThemeDefault />

      <HeroSection
        eyebrow={content?.hero?.eyebrow}
        title={content?.hero?.title}
        highlight={content?.hero?.highlight}
        subtitle={content?.hero?.subtitle}
        priceFrom={content?.hero?.priceFrom}
        priceLow={content?.hero?.priceLow}
        priceTo={content?.hero?.priceTo}
        priceHigh={content?.hero?.priceHigh}
        cta={content?.hero?.cta}
        ctaSecondary={content?.hero?.ctaSecondary}
        trustBadges={content?.hero?.trustBadges}
      />

      <ProblemSection
        title={content?.problem?.title}
        description={content?.problem?.description}
      />

      <WhatsIncludedSection
        title={content?.whatsIncluded?.title}
        subtitle={content?.whatsIncluded?.subtitle}
        items={content?.whatsIncluded?.items}
      />

      <WhyAlkituSection
        title={content?.whyAlkitu?.title}
        items={content?.whyAlkitu?.items}
      />

      <HowItWorksSection
        title={content?.howItWorks?.title}
        subtitle={content?.howItWorks?.subtitle}
        steps={content?.howItWorks?.steps}
      />

      <PortfolioSection
        title={content?.portfolio?.title}
        subtitle={content?.portfolio?.subtitle}
        projects={portfolioProjects}
        locale={lang}
      />

      <GuaranteeSection
        title={content?.guarantee?.title}
        items={content?.guarantee?.items}
      />

      <FaqSection title={content?.faq?.title} items={content?.faq?.items} />

      <FinalCtaSection
        eyebrow={content?.finalCta?.eyebrow}
        title={content?.finalCta?.title}
        subtitle={content?.finalCta?.subtitle}
      />
    </>
  );
}
