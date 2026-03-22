import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceSection from "./ServiceSection";

export default function FinalCTA({ lang }: { lang: string }) {
  return (
    <ServiceSection id="final-cta" className="mt-12 mb-24 text-center">
      <div className="group bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden transition-all duration-500 hover:bg-primary/10">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight relative z-10">
          ¿Listo para darle vida a tu proyecto?
        </h2>
        <p className="text-xl lg:text-2xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-12 relative z-10">
          La excelencia tecnológica y visual no es una coincidencia. Escríbenos, cuéntanos la visión de tu producto y comencemos a construir algo extraordinario hoy mismo.
        </p>
        <Link
          href={`/${lang}/contact`}
          className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-white font-black text-2xl lg:text-3xl rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 relative z-10"
        >
          Solicitar Presupuesto
          <ArrowRight className="w-8 h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </ServiceSection>
  );
}
