import "../../styles/globals.css";
import { Locale, i18n } from "@/i18n.config";
import { NavBar } from "../components/organisms/navbar";
import { Footer } from "../components/organisms/footer";
import { CookiesButton } from "../components/molecules/cookies-button";
import { VisitTracker } from "../components/analytics";
import Providers from "../context/Providers";
import en from "@/app/dictionaries/en.json";
import es from "@/app/dictionaries/es.json";

const translations = { en, es };

// Force dynamic rendering to ensure middleware executes on every request
// This is required for analytics tracking to work properly
export const dynamic = 'force-dynamic';

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
          <NavBar />
          <main className='max-w-full mt-20 w-screen flex flex-col items-center justify-center relative overflow-visible'>
            {children}
          </main>
          <Footer />
          <CookiesButton />
        </Providers>
      </body>
    </html>
  );
}
