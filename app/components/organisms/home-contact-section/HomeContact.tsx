"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import TailwindGrid from "@/app/components/templates/grid";
import { ContactForm } from "@/app/components/molecules/contact-form";
import { ModalContact } from "@/app/components/molecules/modal";
import { useTranslationContext } from "@/app/context/TranslationContext";
import type { ContactFormData } from "@/app/components/molecules/contact-form";
import { StickyInteractiveImage } from "@/app/components/atoms/sticky-image";
import { Translations } from "@/app/types/translations";

function HomeContact({ text }: { text: Translations }) {
  const { translations } = useTranslationContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState("");

  const handleSuccess = (data: ContactFormData) => {
    setSenderName(data.name);
    setModalOpen(true);
  };

  const handleError = (error: string) => {
    console.error("Form submission error:", error);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSenderName("");
  };

  // We can use the passed text prop (server-side dict) OR the context (client-side)
  // Since ContactForm uses context internally, we rely on context for the form itself.
  // But for the section title, we can use the prop or context.
  // Using context ensures consistency if language changes client-side.
  const t = translations || text;

  return (
    <>
      <section id='contact-form' className='relative w-full '>
        {/* Diagonal Background */}
        <div className=' inset-0 w-full h-full -z-10 ' />
        
        <TailwindGrid alignItems='stretch'>
          {/* Left: Contact Form */}
          <div className='col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-2 lg:col-end-7 z-10 mb-12 lg:mb-0'>
            <div className='bg-white dark:bg-zinc-900 p-6 md:p-8 lg:p-12 rounded-2xl shadow-xl border border-border/50'>
              <h3 className='header-tertiary text-black dark:text-white mb-2 text-center lg:text-left leading-tight'>
                {t?.contactPage?.form?.title}
              </h3>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 96 }} // w-24 = 96px
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='h-1 bg-primary mb-8 mx-auto lg:mx-0 rounded-full'
              />
              <ContactForm onSuccess={handleSuccess} onError={handleError} />
            </div>
          </div>

          {/* Right: Sticky Image */}
          <div className='col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-8 lg:col-end-12 relative hidden lg:block'>
            <StickyInteractiveImage />
          </div>
        </TailwindGrid>
      </section>

      {/* Success Modal */}
      {modalOpen && (
        <ModalContact
          handleClose={closeModal}
          variant='success'
          senderName={senderName}
        />
      )}
    </>
  );
}

export default HomeContact;
