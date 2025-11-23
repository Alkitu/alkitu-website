'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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

  const translations = {
    es: {
      title: 'INSCRÍBETE EN NUESTRO BOLETÍN INFORMATIVO',
      subtitle: 'RECIBE INFORMACIÓN CON NOVEDADES, PROMOCIONES Y EVENTOS DE LA COMUNIDAD ALKIANA',
      placeholder: 'Escribe aquí tu correo electrónico',
      button: 'Subscribirse',
      privacy: 'He leído y acepto la',
      privacyLink: 'política de privacidad',
      success: '¡Gracias por suscribirte!',
      error: 'Por favor, acepta la política de privacidad',
      invalidEmail: 'Por favor, introduce un email válido',
    },
    en: {
      title: 'SUBSCRIBE TO OUR NEWSLETTER',
      subtitle: 'RECEIVE INFORMATION WITH NEWS, PROMOTIONS AND EVENTS FROM THE ALKIANA COMMUNITY',
      placeholder: 'Enter your email address here',
      button: 'Subscribe',
      privacy: 'I have read and accept the',
      privacyLink: 'privacy policy',
      success: 'Thank you for subscribing!',
      error: 'Please accept the privacy policy',
      invalidEmail: 'Please enter a valid email',
    },
  };

  const t = translations[locale as keyof typeof translations] || translations.es;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage(t.invalidEmail);
      return;
    }

    // Validate privacy policy acceptance
    if (!accepted) {
      setMessage(t.error);
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual newsletter subscription logic
    // For now, just simulate a successful subscription
    setTimeout(() => {
      setMessage(t.success);
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
          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 uppercase tracking-wide">
            {t.title}
          </h2>

          {/* Green line */}
          <div className="w-full h-px bg-primary mb-6" />

          {/* Subtitle */}
          <p className="text-white text-sm md:text-base mb-8 uppercase tracking-wider">
            {t.subtitle}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                className="w-full md:w-96 px-4 py-3 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? '...' : t.button}
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
              />
              <label htmlFor="privacy-policy" className="cursor-pointer">
                {t.privacy}{' '}
                <a
                  href={`/${locale}/privacy-policy`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.privacyLink}
                </a>
              </label>
            </div>

            {/* Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm ${
                  message.includes('Gracias') || message.includes('Thank you')
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
