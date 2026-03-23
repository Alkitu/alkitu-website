import "../../styles/globals.css";
import { Locale, i18n } from "@/i18n.config";
import { NavBar } from "../components/organisms/navbar";
import { Footer } from "../components/organisms/footer";
import { CookieConsentBanner } from "../components/molecules/cookies-button";
import { VisitTracker } from "../components/analytics";
import { ProjectTransition } from "../components/atoms/intro-loader";
import Providers from "../context/Providers";
import en from "@/app/dictionaries/en.json";
import es from "@/app/dictionaries/es.json";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';

const translations = { en, es };

// Optimize Google Fonts with next/font (eliminates FOUT/FOIT, no render-blocking @import)
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  preload: true,
});

// SEO: metadataBase is REQUIRED for Open Graph images to resolve correctly
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alkitu.com'),
  title: {
    default: 'Alkitu | Ingeniería de Software',
    template: '%s | Alkitu',
  },
  description: 'Soluciones de ingeniería de software y desarrollo web con tecnologías modernas',
  openGraph: {
    title: 'Alkitu',
    description: 'Soluciones de ingeniería de software y desarrollo web',
    url: '/',
    siteName: 'Alkitu',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Alkitu - Agencia Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alkitu',
    description: 'Soluciones de ingeniería de software y desarrollo web',
    creator: '@alkitu',
    images: ['/og-default.jpg'],
  },
  icons: {
    icon: '/icons/Icon_Alkitu.svg',
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const initialTranslations = translations[lang];

  // Check if we're in admin routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdminRoute = pathname.includes('/admin');

  return (
    <html lang={lang} className={plusJakartaSans.variable} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Alkitu",
            "url": "https://alkitu.com",
            "logo": "https://alkitu.com/icons/Icon_Alkitu.svg",
            "description": "Agencia digital especializada en branding, marketing digital, desarrollo web y productos digitales a medida",
            "foundingDate": "2020",
            "founders": [
              { "@type": "Person", "name": "Luis Urdaneta", "jobTitle": "Fundador y CTO" },
              { "@type": "Person", "name": "Leonel Perez", "jobTitle": "Cofundador y Product Builder" }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Valencia",
              "addressRegion": "Comunidad Valenciana",
              "addressCountry": "ES"
            },
            "areaServed": [
              { "@type": "Country", "name": "Spain" },
              { "@type": "Country", "name": "United States" }
            ],
            "knowsAbout": ["branding", "marketing digital", "desarrollo web", "product building", "diseño UI/UX", "SEO", "GEO", "ingeniería de marca"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Servicios Digitales",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Branding" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Marketing Digital" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Product Building" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Webs Corporativas" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ingeniería de Marca" } }
              ]
            },
            "sameAs": [
              "https://www.instagram.com/alkitu_studio/",
              "https://www.linkedin.com/company/alkitu/",
              "https://github.com/alkitu"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "info@alkitu.com",
              "contactType": "customer service",
              "availableLanguage": ["Spanish", "English"]
            }
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Alkitu",
            "url": "https://alkitu.com",
            "inLanguage": ["es", "en"],
            "publisher": {
              "@type": "Organization",
              "name": "Alkitu"
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".hero-description", "[data-speakable]"]
            }
          }) }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Read theme from cookie
                  const getCookie = (name) => {
                    const value = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
                    return value ? value.pop() : null;
                  };

                  let theme = getCookie('theme');

                  // If no cookie, detect system theme and set cookie
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Strict';
                  }

                  // Apply theme
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className='bg-background text-foreground font-body grid grid-cols-1'
        suppressHydrationWarning
      >
        <Providers locale={lang} initialTranslations={initialTranslations}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md">
            {lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
          </a>
          <ProjectTransition />
          <VisitTracker />
          {!isAdminRoute && <NavBar />}
          <main id="main-content" className={isAdminRoute ? 'w-full h-full' : 'max-w-full mt-20 w-full flex flex-col items-center justify-center relative overflow-x-hidden'}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <CookieConsentBanner />}
        </Providers>
      </body>
    </html>
  );
}
