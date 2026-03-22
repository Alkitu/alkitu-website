'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTranslationContext } from '@/app/context/TranslationContext';
import {
  acceptAll,
  rejectAll,
  savePreferences,
  getConsent,
  hasConsent,
} from '@/lib/cookies/consent';

export default function CookieConsentBanner() {
  const { translations, locale } = useTranslationContext();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const t = translations?.cookieConsent;

  // All cookie reads happen inside useEffect to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true);

    if (!hasConsent()) {
      // Show banner after a short delay on first visit
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // User already consented — load their preferences
    setConsentGiven(true);
    const consent = getConsent();
    if (consent) {
      setAnalyticsEnabled(consent.analytics);
      setMarketingEnabled(consent.marketing);
    }
    return undefined;
  }, []);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
    setVisible(false);
    setConsentGiven(true);
    // Reload to activate analytics
    window.location.reload();
  }, []);

  const handleRejectAll = useCallback(() => {
    rejectAll();
    setVisible(false);
    setConsentGiven(true);
  }, []);

  const handleSavePreferences = useCallback(() => {
    savePreferences(analyticsEnabled, marketingEnabled);
    setVisible(false);
    setConsentGiven(true);
    if (analyticsEnabled) {
      window.location.reload();
    }
  }, [analyticsEnabled, marketingEnabled]);

  const handleOpenSettings = useCallback(() => {
    setShowDetails(true);
    setVisible(true);
    const consent = getConsent();
    if (consent) {
      setAnalyticsEnabled(consent.analytics);
      setMarketingEnabled(consent.marketing);
    }
  }, []);

  // Render nothing until mounted on client (prevents hydration mismatch)
  if (!mounted || !t) return null;

  return (
    <>
      {/* Floating cookie settings button — only after consent and when banner is closed */}
      {!visible && consentGiven && (
        <button
          onClick={handleOpenSettings}
          className="fixed bottom-4 right-4 z-30 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          aria-label={t.title}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="text-zinc-600 dark:text-zinc-300" />
            <circle cx="8" cy="10" r="1.5" fill="currentColor" className="text-zinc-600 dark:text-zinc-300" />
            <circle cx="14" cy="8" r="1" fill="currentColor" className="text-zinc-600 dark:text-zinc-300" />
            <circle cx="10" cy="15" r="1.5" fill="currentColor" className="text-zinc-600 dark:text-zinc-300" />
            <circle cx="16" cy="13" r="1" fill="currentColor" className="text-zinc-600 dark:text-zinc-300" />
          </svg>
        </button>
      )}

      {/* Cookie consent banner */}
      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => {
                if (consentGiven) setVisible(false);
              }}
            />

            {/* Banner */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
            >
              <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {/* Header */}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {t.title}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                    {consentGiven && (
                      <button
                        onClick={() => setVisible(false)}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0 cursor-pointer"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Cookie details (expandable) */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3">
                          {/* Necessary cookies */}
                          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex-1 pr-4">
                              <p className="text-sm font-medium text-foreground">{t.necessary.title}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{t.necessary.description}</p>
                            </div>
                            <span className="text-xs font-medium text-primary whitespace-nowrap">
                              {t.alwaysActive}
                            </span>
                          </div>

                          {/* Analytics cookies */}
                          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex-1 pr-4">
                              <p className="text-sm font-medium text-foreground">{t.analytics.title}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{t.analytics.description}</p>
                            </div>
                            <ToggleSwitch
                              enabled={analyticsEnabled}
                              onChange={setAnalyticsEnabled}
                            />
                          </div>

                          {/* Marketing cookies */}
                          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                            <div className="flex-1 pr-4">
                              <p className="text-sm font-medium text-foreground">{t.marketing.title}</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{t.marketing.description}</p>
                            </div>
                            <ToggleSwitch
                              enabled={marketingEnabled}
                              onChange={setMarketingEnabled}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Links */}
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {t.moreInfo}{' '}
                    <Link
                      href={`/${locale}/cookie-policy`}
                      className="underline hover:text-primary transition-colors"
                    >
                      {t.cookiePolicy}
                    </Link>{' '}
                    {t.and}{' '}
                    <Link
                      href={`/${locale}/privacy-policy`}
                      className="underline hover:text-primary transition-colors"
                    >
                      {t.privacyPolicy}
                    </Link>
                    .
                  </p>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 md:px-6 md:pb-6 flex flex-wrap gap-3">
                  {showDetails ? (
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 min-w-[140px] px-5 py-2.5 bg-primary text-black font-semibold rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm"
                    >
                      {t.savePreferences}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleAcceptAll}
                        className="flex-1 min-w-[120px] px-5 py-2.5 bg-primary text-black font-semibold rounded-full hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm"
                      >
                        {t.acceptAll}
                      </button>
                      <button
                        onClick={handleRejectAll}
                        className="flex-1 min-w-[120px] px-5 py-2.5 bg-zinc-200 dark:bg-zinc-700 text-foreground font-medium rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 active:scale-95 transition-all cursor-pointer text-sm"
                      >
                        {t.rejectAll}
                      </button>
                      <button
                        onClick={() => setShowDetails(true)}
                        className="flex-1 min-w-[120px] px-5 py-2.5 border border-zinc-300 dark:border-zinc-600 text-foreground font-medium rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer text-sm"
                      >
                        {t.customize}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
