import "../../styles/globals.css";
import { Locale, i18n } from "@/i18n.config";
import { NavBar } from "../components/organisms/navbar";
import { Footer } from "../components/organisms/footer";
import { CookiesButton } from "../components/molecules/cookies-button";
import Providers from "../context/Providers";
import en from "@/app/dictionaries/en.json";
import es from "@/app/dictionaries/es.json";

const translations = { en, es };

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const initialTranslations = translations[lang];

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const resolvedTheme = theme === 'system' ? systemTheme : theme;

                  if (resolvedTheme === 'dark') {
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
          <NavBar />
          <main className='max-w-full mt-20 w-[100vw] flex flex-col items-center justify-center relative overflow-visible'>
            {children}
          </main>
          <Footer />
          <CookiesButton />
        </Providers>
      </body>
    </html>
  );
}
