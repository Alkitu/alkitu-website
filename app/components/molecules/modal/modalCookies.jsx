import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { BackdropUpToDown } from "@/app/components/molecules/backdrop";
import { AnimatedSwitch } from "@/app/components/molecules/switch";
import { useTranslationContext } from "@/app/context/TranslationContext";
import Image from "next/image";

const dropIn = {
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

const ModalCookies = ({ modalOpen, handleClose }) => {
  const { translations } = useTranslationContext();

  return (
    <BackdropUpToDown onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial='closed'
        animate='open'
        exit='closed'
        className='w-[clamp(550px,50%,75vw)] md:max-w-2xl max-w-sm  m-auto py-2 px-8 rounded-xl flex flex-col justify-between items-center shadow bg-white dark:bg-zinc-900  '
        key='modalCookies'
      >
        <ModalContent
          translations={translations}
          handleClose={handleClose}
          modalOpen={modalOpen}
        />
      </motion.div>
    </BackdropUpToDown>
  );
};

export default ModalCookies;

function ModalContent({ translations, handleClose, modalOpen }) {
  const [isOn, setIsOn] = useState(true);

  return (
    <div className="'w-full rounded-xl flex flex-col ">
      {/* <!--MODAL HEADER--> */}
      <div className='flex justify-between items center border-b border-border py-3'>
        <div className='flex flex-col items-center justify-center'>
          <p className=' text-xl text-foreground font-medium uppercase '>
            {translations?.settings?.header || "Settings"}
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
      <section className='py-3 flex flex-col items-center gap-5 justify-between content-between'>
        <div className='mt-3'>
          <Image
            src='/icons/cookies.svg'
            width={56}
            height={56}
            alt='cookies icon'
          />
        </div>

        <p className='text-lg font-medium text-center text-foreground'>
          {translations?.settings?.description ||
            "Manage your cookie preferences"}
        </p>
        {modalOpen && (
          <AnimatedSwitch className=' md:mb-0 ' isOn={isOn} setIsOn={setIsOn} />
        )}
      </section>
    </div>
  );
}
