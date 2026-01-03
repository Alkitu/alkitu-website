import "../../styles/globals.css";
import { Locale, i18n } from "@/i18n.config";
import { NavBar } from "../components/organisms/navbar";
import { Footer } from "../components/organisms/footer";
import { CookiesButton } from "../components/molecules/cookies-button";
import { VisitTracker } from "../components/analytics";
import Providers from "../context/Providers";
import en from "@/app/dictionaries/en.json";
import es from "@/app/dictionaries/es.json";
import { headers } from "next/headers";
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const translations = { en, es };

// Optimize Google Fonts with next/font (eliminates FOUT/FOIT)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Critical for avoiding font flash
  variable: '--font-inter',
  preload: true,
});

// Force dynamic rendering to ensure middleware executes on every request
// This is required for analytics tracking to work properly
export const dynamic = 'force-dynamic';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alkitu',
    description: 'Soluciones de ingeniería de software y desarrollo web',
    creator: '@alkitu',
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
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
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
          <VisitTracker />
          {!isAdminRoute && <NavBar />}
          <main className={isAdminRoute ? 'w-full h-full' : 'max-w-full mt-20 w-screen flex flex-col items-center justify-center relative overflow-visible'}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <CookiesButton />}
        </Providers>
      </body>
    </html>
  );
}
