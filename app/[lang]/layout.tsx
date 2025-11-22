import "../../styles/globals.css";
import { Locale, i18n } from "@/i18n.config";
import NavBar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import { TranslationsProvider } from "../context/TranslationContext";
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
    <html lang={lang}>
      {/* <Head /> */}
      <body className=" text-zinc-100 font-body grid grid-cols-1" suppressHydrationWarning>
        <TranslationsProvider initialLocale={lang} initialTranslations={initialTranslations}>
          <NavBar />
          <main className="max-w-full mt-20 pt-8 w-[100vw] flex flex-col items-center justify-center relative">
            {children}
          </main>
          <Footer />
          {/* <CookiesButton /> */}
        </TranslationsProvider>
      </body>
    </html>
  );
}
