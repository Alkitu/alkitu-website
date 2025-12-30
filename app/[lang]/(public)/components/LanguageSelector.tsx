'use client'

import { useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslationContext } from '@/app/context/TranslationContext'
import { i18n } from '@/i18n.config'

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40,
    }
  }
}

const dropdownVariants = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 10px)',
    transition: {
      type: 'spring' as const,
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05
    }
  },
  closed: {
    clipPath: 'inset(10% 50% 90% 50% round 10px)',
    transition: {
      type: 'spring' as const,
      bounce: 0,
      duration: 0.3
    }
  }
}

const languageNames = {
  en: 'English',
  es: 'Español'
}

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslationContext()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = async (newLocale: 'es' | 'en') => {
    setIsOpen(false)
    
    // Update the context and cookie
    await setLocale(newLocale)
    
    // Navigate to the new locale path
    const segments = pathname.split('/').filter(Boolean)
    const currentLang = segments[0]
    let newPath = ''
    
    if (currentLang === 'es' || currentLang === 'en') {
      segments[0] = newLocale
      newPath = '/' + segments.join('/')
    } else {
      newPath = `/${newLocale}${pathname}`
    }
    
    router.push(newPath)
  }

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className="flex flex-col self-center relative"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer w-full flex justify-between items-center text-left gap-2 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
      >
        <div className="self-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-zinc-100"
          >
            <path
              fillRule="evenodd"
              d="M7 2a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2H9.578a18.87 18.87 0 0 1-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 0 1-1.44 1.389 21.034 21.034 0 0 1-.554-.6 19.095 19.095 0 0 1-3.107 3.567 1 1 0 0 1-1.334-1.49 17.09 17.09 0 0 0 3.13-3.733 18.995 18.995 0 0 1-1.487-2.494 1 1 0 1 1 1.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 0 1 0-2h3V3a1 1 0 0 1 1-1zm6 6a1 1 0 0 1 .894.553l2.991 5.982a.88.88 0 0 1 .02.037l.99 1.98a1 1 0 1 1-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 1 1-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0 1 13 8zm-1.382 6h2.764L13 11.236z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-sm font-bold uppercase text-zinc-100">
          {locale.toUpperCase()}
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
          >
            <path
              d="M1 1L7 7L13 1"
              stroke={isOpen ? 'rgb(0 187 49)' : 'rgb(244 244 245)'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence mode="wait" initial={false}>
        {isOpen && (
          <motion.ul
            variants={dropdownVariants}
            className="absolute bg-zinc-700 text-zinc-100 top-14 right-0 list-none m-0 flex flex-col p-2 rounded-md min-w-[120px] z-50"
            exit="closed"
            style={{
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            {i18n.locales.map((loc) => (
              <motion.li
                key={loc}
                className="text-center text-md font-medium py-2 px-3 cursor-pointer rounded hover:bg-zinc-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
                initial="closed"
                animate={isOpen ? 'open' : 'closed'}
                exit="closed"
                onClick={() => handleLanguageChange(loc as 'es' | 'en')}
              >
                {languageNames[loc]}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
