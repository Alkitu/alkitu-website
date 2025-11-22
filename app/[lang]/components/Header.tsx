import Link from "next/link";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import LanguageSelector from "./LanguageSelector";

export default async function Header({ lang }: { lang: Locale }) {
  const { navigation } = await getDictionary(lang);

  return (
    <header className="py-6 max-w-full z-50">
      <nav className="container flex items-center justify-between">
        <ul className="flex gap-x-8">
          <li>
            <Link href={`/${lang}`}>{navigation.home}</Link>
          </li>
        </ul>
        <LanguageSelector />
      </nav>
    </header>
  );
}
