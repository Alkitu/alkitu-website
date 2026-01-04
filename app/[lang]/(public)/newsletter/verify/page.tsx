'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from '@/app/context/TranslationContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type VerificationState = 'loading' | 'success' | 'error';

/**
 * Newsletter Verification Page
 *
 * Verifies newsletter subscription using token from email link
 *
 * Flow:
 * 1. User clicks verification link in email: /[locale]/newsletter/verify?token=xxx
 * 2. Component reads token from URL query params
 * 3. Calls GET /api/newsletter/verify/[token]
 * 4. Shows loading → success/error state
 * 5. On success: redirects to homepage after 3 seconds
 */
export default function NewsletterVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  const token = searchParams.get('token');

  useEffect(() => {
    async function verifySubscription() {
      if (!token) {
        setState('error');
        setMessage(t('newsletterSection.verify.errorInvalidToken'));
        return;
      }

      try {
        const response = await fetch(`/api/newsletter/verify/${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (response.ok) {
          setState('success');
          setMessage(data.message || t('newsletterSection.verify.successMessage'));

          // Start countdown for redirect
          let timeLeft = 3;
          const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);

            if (timeLeft === 0) {
              clearInterval(timer);
              router.push('/');
            }
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setState('error');
          if (response.status === 404) {
            setMessage(
              data.details || t('newsletterSection.verify.errorInvalidToken')
            );
          } else {
            setMessage(data.error || t('newsletterSection.verify.error'));
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setState('error');
        setMessage(t('newsletterSection.verify.error'));
      }
    }

    verifySubscription();
  }, [token, t, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center"
      >
        {/* Loading State */}
        {state === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('newsletterSection.verify.loading')}
            </h1>
            <p className="text-gray-400">
              {t('newsletterSection.verify.redirecting')}
            </p>
          </>
        )}

        {/* Success State */}
        {state === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('newsletterSection.verify.success')}
            </h1>
            <p className="text-gray-300 mb-4">{message}</p>
            <p className="text-sm text-gray-400">
              {t('newsletterSection.verify.redirecting')} ({countdown}s)
            </p>
          </>
        )}

        {/* Error State */}
        {state === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {t('newsletterSection.verify.error')}
            </h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('newsletterSection.verify.goHome')}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
