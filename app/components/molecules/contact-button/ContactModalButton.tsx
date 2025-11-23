"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { Button } from "@/app/components/atoms/button";
import { ModalContact } from "@/app/components/molecules/modal";

function ContactModalButton({ className, setModalOpenNavbar }) {
  const { translations } = useTranslationContext();
  const [modalOpen, setModalOpen] = useState(false);
  const close = () =>
    setModalOpenNavbar ? setModalOpenNavbar(false) : setModalOpen(false);
  const open = () =>
    setModalOpenNavbar ? setModalOpenNavbar(true) : setModalOpen(true);

  return (
    <>
      <Button
        variant='primary'
        size='sm'
        className={className || "self-center"}
        onClick={open}
      >
        {translations?.menu?.contact || "Contacto"}
      </Button>
      <AnimatePresence mode='wait' initial={false} onExitComplete={close}>
        {modalOpen && <ModalContact handleClose={close} />}
      </AnimatePresence>
    </>
  );
}

export default ContactModalButton;
