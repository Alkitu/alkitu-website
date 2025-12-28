'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TailwindGrid from '@/app/components/templates/grid';
import { SideBar } from '@/app/components/organisms/sidebar';
import { ContactForm } from '@/app/components/molecules/contact-form';
import { ModalContact } from '@/app/components/molecules/modal';
import { useTranslationContext } from '@/app/context/TranslationContext';
import type { ContactFormData } from '@/app/components/molecules/contact-form';
import { StickyInteractiveImage } from '@/app/components/atoms/sticky-image';
import { CommunityBanner } from '@/app/components/molecules/community-banner';
import NewsletterSubscribe from '@/app/components/organisms/newsletter-subscribe/NewsletterSubscribe';

export default function Contact() {
  const { translations, locale } = useTranslationContext();
  const contactText = translations?.contact;
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState('');

  const handleSuccess = (data: ContactFormData) => {
    setSenderName(data.name);
    setModalOpen(true);
  };

  const handleError = (error: string) => {
    console.error('Form submission error:', error);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSenderName('');
  };

  // Define sidebar sections
  const sidebarSections = [
    { id: 'contact-hero', name: 'Inicio' },
    { id: 'contact-form', name: 'Formulario' },
    { id: 'contact-community', name: 'RRSS' },
  ];

  return (
    <>
      <TailwindGrid fullSize>
        {/* Sidebar Column */}
        <div className="col-span-1 hidden lg:block relative z-50">
           <SideBar sections={sidebarSections} />
        </div>

        {/* Main Content Column */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-full w-full pt-20 md:pt-24 lg:pt-32"
        >
          {/* Header Section */}
          <section id="contact-hero" className="w-full text-center pb-12 md:pb-20 px-4">
             <div className="flex flex-col items-center gap-2 mb-6">
               <motion.h1 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-foreground text-center"
               >
                 CONTACTO <span className="text-primary">ALKITU</span>
               </motion.h1>
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                 className="w-full max-w-sm md:max-w-md h-1 bg-primary rounded-full"
               />
             </div>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6"
             >
               MÁS QUE UN ESTUDIO Y UNA AGENCIA, SOMOS UNA COMUNIDAD
             </motion.p>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.6 }}
               className="max-w-3xl mx-auto text-sm md:text-base text-foreground/80 leading-relaxed px-4"
             >
               Todas las comunidades necesitan comunicarse e interactuar constantemente. En Alkitu queremos escucharte, conocer tus comentarios y apoyar tus proyectos.
               <br /><br />
               ¡Así que no lo pienses más, escríbenos o mejor aún, únete al mundo Alkitu!
             </motion.p>
          </section>
  
          {/* Main Form Section with Sticky Image */}
          <section id="contact-form" className="relative w-full bg-black py-12 md:py-20">
            <TailwindGrid alignItems="stretch">
              {/* Left: Contact Form */}
              <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-2 lg:col-end-7 z-10 mb-12 lg:mb-0">
                 <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 lg:p-12 rounded-2xl shadow-xl border border-border/50">
                   <h3 className="text-2xl font-bold text-black dark:text-white mb-2 text-center lg:text-left">Déjanos tu mensaje:</h3>
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: 96 }} // w-24 = 96px
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="h-1 bg-primary mb-8 mx-auto lg:mx-0 rounded-full" 
                   />
                   <ContactForm onSuccess={handleSuccess} onError={handleError} />
                 </div>
              </div>
  
              {/* Right: Sticky Image */}
              <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-8 lg:col-end-12 relative hidden lg:block">
                <StickyInteractiveImage />
              </div>
            </TailwindGrid>
          </section>
  
          {/* Community Banner */}
          <div id="contact-community">
             <CommunityBanner />
          </div>
  
          {/* Newsletter */}
          <NewsletterSubscribe locale={locale} />
        </motion.main>
      </TailwindGrid>

      {/* Success Modal */}
      {modalOpen && (
        <ModalContact
          handleClose={closeModal}
          variant="success"
          senderName={senderName}
        />
      )}
    </>
  );
}

