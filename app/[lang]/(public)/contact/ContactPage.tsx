'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ContactForm } from '@/app/components/molecules/contact-form';
import { ModalContact } from '@/app/components/molecules/modal';
import { useTranslationContext } from '@/app/context/TranslationContext';
import type { ContactFormData } from '@/app/components/molecules/contact-form';

export default function ContactPage() {
  const { translations } = useTranslationContext();
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

  return (
    <>
      <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative bg-background overflow-hidden items-stretch pt-24 pb-12 lg:py-0">

        {/* Left Side: Impactful Typography */}
        <div className="px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center relative z-10 lg:border-r border-border/30 h-full py-12 lg:py-32">
          {/* Decorative Pattern / Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-full justify-between"
          >
            <div>
              <h1 className="text-[14vw] md:text-[10vw] lg:text-[7vw] font-black uppercase text-foreground leading-[0.85] tracking-tighter mb-8 max-w-[15ch]">
                Let's <br/> Create <br/> <span className="text-primary">Magic.</span>
              </h1>
              <p className="text-lg md:text-xl xl:text-2xl text-foreground/60 font-medium max-w-lg mb-12">
                {translations?.contactPage?.header?.subtitle || "Cuéntanos sobre tu visión y la convertiremos en un producto digital inolvidable."}
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-12 lg:mt-auto">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black tracking-widest text-foreground/40 uppercase">Email Us</span>
                <a href="mailto:info@alkitu.com" className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors">info@alkitu.com</a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="px-8 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center bg-card/10 lg:bg-card/5 backdrop-blur-3xl lg:backdrop-blur-none relative z-10 h-full py-12 lg:py-32">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:min-w-[540px] max-w-2xl mx-auto lg:mx-0 bg-background/80 dark:bg-zinc-900/80 p-8 md:p-12 xl:p-14 rounded-[2.5rem] border border-border/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">
              {translations?.contactPage?.form?.title || "Escríbenos."}
            </h2>
            <ContactForm onSuccess={handleSuccess} onError={handleError} />
          </motion.div>
        </div>
      </main>

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
