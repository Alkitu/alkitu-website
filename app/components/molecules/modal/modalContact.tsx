'use client';
import { useTranslationContext } from "@/app/context/TranslationContext";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { BackdropUpToDown } from "@/app/components/molecules/backdrop";
import { SocialButtons } from "@/app/components/molecules/social-button";
import { Translations } from "@/app/types/translations";

interface ModalContactProps {
  handleClose: () => void;
  variant?: 'form' | 'success';
  senderName?: string;
}

interface ModalContentProps {
  text: Translations;
  handleClose: () => void;
  variant?: 'form' | 'success';
  senderName?: string;
}

const dropIn: Variants = {
  open: {
    y: "0vh",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  closed: {
    y: "100dvh",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
};

export default function ModalContact({ handleClose, variant = 'form', senderName }: ModalContactProps) {
  const { translations } = useTranslationContext();

  return (
    <BackdropUpToDown onClick={handleClose}>
      <motion.div
        className='z-70 w-[clamp(90%,700px,90px)] md:max-w-lg m-auto py-2 px-8 rounded-xl flex flex-col justify-between items-center shadow bg-white dark:bg-zinc-900'
        variants={dropIn}
        initial='closed'
        animate='open'
        exit='closed'
        onClick={(event) => event.stopPropagation()}
        key='modal'
      >
        <ModalContent text={translations} handleClose={handleClose} variant={variant} senderName={senderName} />
      </motion.div>
    </BackdropUpToDown>
  );
}

function ModalContent({ text, handleClose, variant = 'form', senderName }: ModalContentProps) {
  const [copied, setCopied] = useState(false);
  const close = () => setCopied(false);
  const open = () => setCopied(true);

  const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const emailInput = document.getElementById("emailInput") as HTMLInputElement;
    const emailAddress = emailInput?.value;

    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress);
      open();
    }
  };

  // Success variant
  if (variant === 'success') {
    return (
      <div className='w-full rounded-xl py-8'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full 
                          bg-primary/20 flex items-center justify-center">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-3xl font-black mb-4 text-foreground">
            {text?.contact?.success?.title || 'Thanks'},{' '}
            <span className="text-primary">{senderName}</span>!
          </h2>
          <p className="text-muted-foreground mb-8">
            {text?.contact?.success?.message || 
              "Your message has been successfully sent. I'll get back to you within 24 hours."}
          </p>
          <motion.button
            onClick={handleClose}
            className="bg-primary text-zinc-950 border border-primary hover:shadow-primary/50 hover:shadow-md
                       h-12 px-4 inline-flex items-center justify-center gap-2 font-bold uppercase rounded-md 
                       transition-all cursor-pointer hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {text?.contact?.success?.closeButton || 'Close'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Form variant (original content)
  return (
    <div className='w-full rounded-xl'>
      {/* MODAL HEADER */}
      <div className='flex justify-between items center border-b border-border py-3'>
        <div className='flex items-center justify-center'>
          <p className='text-xl text-foreground font-medium uppercase'>
            {text.contact.title}
          </p>
        </div>
        <motion.div
          className='bg-zinc-200 dark:bg-zinc-700 cursor-pointer hover:text-gray-300 font-sans text-gray-500 w-9 h-9 flex items-center justify-center rounded-full'
          onClick={handleClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M2.1 13.3C1.7134 13.6866 1.0866 13.6866 0.7 13.3C0.313401 12.9134 0.313401 12.2866 0.7 11.9L5.6 7L0.7 2.1C0.3134 1.7134 0.313401 1.0866 0.7 0.7C1.0866 0.313401 1.7134 0.313401 2.1 0.7L7 5.6L11.9 0.7C12.2866 0.3134 12.9134 0.313401 13.3 0.7C13.6866 1.0866 13.6866 1.7134 13.3 2.1L8.4 7L13.3 11.9C13.6866 12.2866 13.6866 12.9134 13.3 13.3C12.9134 13.6866 12.2866 13.6866 11.9 13.3L7 8.4L2.1 13.3Z'
              fill='#18181B'
            />
          </svg>
        </motion.div>
      </div>
      {/* MODAL BODY */}
      <div className='my-4'>
        <SocialButtons text={text as any} />
        <div className='flex justify-between mt-4'>
          <p className='text-md text-foreground'>{text.contact.emailAddressParagraph}</p>
          <div className='flex items-center justify-center'>
            <AnimatePresence initial={false} mode='wait'>
              {copied && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onAnimationComplete={() => close()}
                  exit={{ opacity: 0, transition: { duration: 1, delay: 1 } }}
                  className='text-sm text-center text-foreground'
                  transition={{
                    duration: 1,
                    type: "spring",
                    damping: 25,
                    stiffness: 500,
                  }}
                >
                  {text.contact.copied}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* BOX LINK */}
        <div className='grid grid-cols-12 justify-start items-center mt-4 w-full transition-all'>
          <div className='col-span-12 grid-cols-11 md:grid-cols-9 grid'>
            <div className='col-span-2 md:col-span-1 flex h-10 items-center justify-center rounded-l-lg border-zinc-300 dark:border-zinc-600 bg-zinc-300 dark:bg-zinc-700 fill-black'>
              <div className='w-6 h-6 max-w-8 flex items-center justify-center shadow-xl min-w-6'>
                <svg
                  width='20'
                  height='16'
                  viewBox='0 0 20 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 2C20 0.9 19.1 0 18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2ZM18 2L10 7L2 2H18ZM18 14H2V4L10 9L18 4V14Z'
                    fill='#18181B'
                  />
                </svg>
              </div>
            </div>

            <div className='col-span-9 md:col-span-8 bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center h-10 rounded-r-lg content-center'>
              <motion.button
                className='w-8 h-8 mx-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'
                onClick={handleCopy}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label='Copy email'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-zinc-100'
                >
                  <path
                    d='M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z'
                    fill='currentColor'
                  />
                </svg>
              </motion.button>
              <input
                id='emailInput'
                className='w-full outline-none bg-transparent font-medium h-full sm:tracking-widest uppercase text-sm sm:text-lg text-zinc-100'
                type='text'
                placeholder='email address'
                value={text.contact.email}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
