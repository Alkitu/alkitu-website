'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useTranslationContext } from '@/app/context/TranslationContext';
import { useDropdown } from '@/app/context/DropdownContext';
import { Locale } from '@/i18n.config';

interface LanguageOption {
  name: string;
  pathname: string;
}

const itemVariants: Variants = {
  open: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.05
    }
  }),
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const mobileNavbar: Variants = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 10px)',
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  closed: {
    clipPath: 'inset(10% 50% 90% 50% round 10px)',
    opacity: 0,
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8
    }
  }
};

export default function SelectLanguage() {
  const { translations, setLocale, locale } = useTranslationContext();
  const { activeDropdown, toggleDropdown } = useDropdown();
  const isOpen = activeDropdown === 'language';
  const [selectedCategory, setSelectedCategory] = useState<string>(
    translations?.menu?.currentLanguage || locale.toUpperCase()
  );
  const languageOptions = (translations?.menu?.languagesOptions || []) as any[];

  useEffect(() => {
    setSelectedCategory(translations?.menu?.currentLanguage || locale.toUpperCase());
  }, [translations, locale]);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className="flex flex-col self-center"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => toggleDropdown('language')}
        className="relative cursor-pointer w-full flex justify-between items-center text-left text-foreground"
      >
        <div className="self-center">
          <svg
            width="20"
            height="20"
            x="0"
            y="0"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-foreground"
          >
            <g>
              <path
                fillRule="evenodd"
                d="M7 2a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2H9.578a18.87 18.87 0 0 1-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 0 1-1.44 1.389 21.034 21.034 0 0 1-.554-.6 19.095 19.095 0 0 1-3.107 3.567 1 1 0 0 1-1.334-1.49 17.09 17.09 0 0 0 3.13-3.733 18.995 18.995 0 0 1-1.487-2.494 1 1 0 1 1 1.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 0 1 0-2h3V3a1 1 0 0 1 1-1zm6 6a1 1 0 0 1 .894.553l2.991 5.982a.88.88 0 0 1 .02.037l.99 1.98a1 1 0 1 1-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 1 1-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0 1 13 8zm-1.382 6h2.764L13 11.236z"
                clipRule="evenodd"
              ></path>
            </g>
          </svg>
        </div>
        <p className="fs-6 fw-normal text-foreground mx-2 font-bold uppercase">
          {selectedCategory || 'Language'}
        </p>
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 }
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.55 }}
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke={isOpen ? 'rgb(0 187 49)' : 'currentColor'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => null}>
        {isOpen && (
          <>
            <motion.ul
              variants={mobileNavbar}
              className={`select-list w-32 absolute bg-zinc-50 dark:bg-zinc-700 text-foreground top-16 list-none m-0 flex flex-col right-8 shadow-lg rounded-md ${
                isOpen ? 'p-2 scale-1' : 'hidden scale-0'
              }`}
              exit="closed"
              style={{
                clipPath: isOpen
                  ? 'inset(0% round 0px)'
                  : 'inset(10% 50% 90% 50% round 10px)',
                pointerEvents: isOpen ? 'auto' : 'none'
              }}
            >
              <AnimatePresence
                mode="wait"
                initial={false}
                onExitComplete={() => null}
              >
                {languageOptions &&
                  languageOptions.map((category, index) => (
                    <motion.li
                      key={index}
                      className="text-center text-md last:border-b-0 border-b-2 font-medium first:pb-2 last:pt-2 flex-row w-full content-center cursor-pointer flex items-center justify-between gap-2 px-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variants={itemVariants}
                      initial="closed"
                      animate={isOpen ? 'open' : 'closed'}
                      exit="closed"
                      onClick={() => {
                        toggleDropdown(null);
                        setLocale(category.pathname as Locale);
                        window.location.href = `/${category.pathname}`;
                      }}
                    >
                      <span className={locale === category.pathname ? 'text-primary font-bold' : ''}>
                        {category.name}
                      </span>
                      {locale === category.pathname && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-primary"
                        >
                          <path
                            d="M16.6667 5L7.50004 14.1667L3.33337 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </motion.li>
                  ))}
              </AnimatePresence>
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
