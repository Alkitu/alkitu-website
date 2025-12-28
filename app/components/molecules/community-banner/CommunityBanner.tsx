'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ContactInfo } from '@/app/components/molecules/contact-info';
import { SocialButtons } from '@/app/components/molecules/social-button';
import { useTranslationContext } from '@/app/context/TranslationContext';
import TailwindGrid from '@/app/components/templates/grid';

export default function CommunityBanner() {
  const { translations } = useTranslationContext();

  return (
    <section className="w-full py-12 md:py-20 border-b border-border/50 overflow-hidden px-4">
      <TailwindGrid>
        <div className="col-span-full lg:col-start-2 lg:col-span-11 relative">
          
          {/* Bordered Container with Title as Legend - Dark Theme */}
          <div className="relative w-full mt-12">
            
            {/* Title Legend */}
            <div className="absolute -top-5 md:-top-7 left-1/2 -translate-x-1/2 bg-zinc-100 px-6 md:px-10 z-10 whitespace-nowrap border-[3px] border-black">
               <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-lg md:text-3xl font-black uppercase text-black tracking-wider"
              >
                ¿QUIERES SER PARTE DE NUESTRA <span className="text-green-500">COMUNIDAD</span>?
              </motion.h2>
            </div>

            {/* Content Box - Black Background */}
            <div className="  border-[3px] border-black p-8 md:p-16 bg-black text-white rounded-none§ relative shadow-2xl">
            
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
              {/* Left: Contact Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center lg:items-center text-center space-y-4 order-2 lg:order-1"
              >
              <div className="flex flex-col items-center lg:items-center text-center space-y-2 mb-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white">Contáctanos</h3>
                  {/* Green Pill Separator */}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }} // w-16 = 64px
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-1 bg-green-500 mb-2 rounded-full" 
                  />
                </div>
                <div className="flex flex-col gap-3 items-center text-gray-300 text-sm font-medium">
                  <p className="max-w-[280px] font-light">
                    Puedes escribirnos 24/7 y aunque no tenemos ubicación física (por el momento), siempre estaremos cerca.
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                     <motion.a 
                       whileHover={{ scale: 1.05 }}
                       href="https://wa.me/34611132050" 
                       className="flex items-center justify-center gap-2 transition-colors hover:text-green-400"
                     >
                       <span className="text-lg">💬</span> +34 611 132 050
                     </motion.a>
                     <motion.a 
                       whileHover={{ scale: 1.05 }}
                       href="mailto:info@alkitu.com" 
                       className="flex items-center justify-center gap-2 transition-colors hover:text-green-400"
                     >
                       <span className="text-lg">✉️</span> info@alkitu.com
                     </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Center: Icon - White Box Style */}
              <div className="flex justify-center order-1 lg:order-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-20"
                >
                  <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src="/icons/contact/Alkitu-Contact.svg"
                      alt="Alkitu Community"
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Right: Socials */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center lg:items-center text-center space-y-4 order-3"
              >
                <div className="flex flex-col items-center lg:items-center text-center space-y-2 mb-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white">Redes Sociales</h3>
                  {/* Green Pill Separator */}
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }} // w-16 = 64px
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-1 bg-green-500 mb-2 rounded-full" 
                  />
                </div>

                <p className="text-gray-300 max-w-[280px] text-sm font-medium font-light">
                  Síguenos en redes sociales y participa como miembro de nuestra comunidad:
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                   {/* Simple Social Buttons - High Contrast */}
                   {['Instagram', 'Facebook', 'Youtube'].map((social) => (
                     <motion.a
                       key={social}
                       href="#"
                       whileHover={{ y: -2 }}
                       whileTap={{ scale: 0.95 }}
                       className="bg-white text-black px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-green-500 hover:text-white transition-colors shadow-lg"
                     >
                       {social}
                     </motion.a>
                   ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
        </div>
      </TailwindGrid>
    </section>
  );
}
