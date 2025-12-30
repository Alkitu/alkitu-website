'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslationContext } from '@/app/context/TranslationContext';

interface NewsletterSubscribeProps {
  locale: string;
}

/**
 * NewsletterSubscribe component for email subscription
 * Displays a full-width newsletter signup form with privacy policy checkbox
 */
export default function NewsletterSubscribe({ locale }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { translations } = useTranslationContext();
  const t = translations?.newsletterSection;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage(t?.invalidEmail || 'Invalid Format');
      return;
    }

    // Validate privacy policy acceptance
    if (!accepted) {
      setMessage(t?.error || 'Error');
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual newsletter subscription logic
    // For now, just simulate a successful subscription
    setTimeout(() => {
      setMessage(t?.success || 'Success');
      setEmail('');
      setAccepted(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="w-full bg-black py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col items-center gap-2 mb-6">
            <h2 className="header-section text-white tracking-wide leading-tight">
              {t?.titleLine1} <br />
              {t?.titleLine2} <span className="text-primary">{t?.titleHighlight}</span>
            </h2>

            {/* Green line */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-1 bg-primary rounded-full" 
            />
          </div>

          {/* Subtitle */}
          <p className="header-secondary-alt text-white mb-8 mx-auto">
            {t?.subtitle}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t?.placeholder}
                className="w-full md:w-96 px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
                suppressHydrationWarning
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? '...' : t?.button}
              </button>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-center justify-center gap-2 text-white text-sm">
              <input
                type="checkbox"
                id="privacy-policy"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
                suppressHydrationWarning
              />
              <label htmlFor="privacy-policy" className="cursor-pointer">
                {t?.privacy}{' '}
                <a
                  href={`/${locale}/privacy-policy`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t?.privacyLink}
                </a>
              </label>
            </div>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${
                  message.includes('Gracias') || message.includes('Thank')
                    ? 'text-primary'
                    : 'text-red-400'
                }`}
              >
                {message}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
