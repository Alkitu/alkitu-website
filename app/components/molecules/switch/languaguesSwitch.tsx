'use client';
import { useTranslationContext } from "@/app/context/TranslationContext";
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface LanguaguesSwitchProps {
  className?: string;
}

export default function LanguaguesSwitch({ className = '' }: LanguaguesSwitchProps) {
  const { setLocale, locale } = useTranslationContext();
  const [isOn, setIsOn] = useState(locale === 'en');

  return (
    <>
      <div
        className={`h-7 rounded-full flex items-center box-border py-0 px-1 cursor-pointer transition-all bg-primary ${className} ${
          isOn ? 'justify-end' : 'justify-start'
        }`}
        onClick={() => {
          const newLocale = isOn ? 'es' : 'en';
          setIsOn(!isOn);
          setLocale(newLocale);
        }}
        style={{ justifyContent: isOn ? 'flex-end' : 'flex-start' }}
      >
        <motion.div
          layout
          className="handle h-6 w-6 rounded-full grid items-center justify-center bg-zinc-900 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className={`${isOn ? 'text-primary' : 'text-[#6E0D25]'}`}
              key={isOn ? 'moon' : 'sun'}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
