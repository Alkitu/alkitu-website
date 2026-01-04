'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/app/context/TranslationContext';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

type UnsubscribeState = 'idle' | 'confirming' | 'processing' | 'success' | 'error';

/**
 * Newsletter Unsubscribe Page
 *
 * Handles newsletter unsubscription using permanent token from email link
 *
 * Flow:
 * 1. User clicks unsubscribe link in email: /[locale]/newsletter/unsubscribe?token=xxx
 * 2. Component reads token from URL query params
 * 3. Shows confirmation dialog
 * 4. On confirm: calls POST /api/newsletter/unsubscribe/[token]
 * 5. Shows success/error state
 */
export default function NewsletterUnsubscribePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();

  const [state, setState] = useState<UnsubscribeState>('idle');
  const [message, setMessage] = useState('');
  const [entryTime] = useState(new Date().toISOString());

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setState('error');
      setMessage(t('newsletterSection.unsubscribe.errorMessage'));
    } else {
      setState('confirming');
    }
  }, [token, t]);

  const handleUnsubscribe = async () => {
    if (!token) return;

    setState('processing');

    try {
      const response = await fetch(`/api/newsletter/unsubscribe/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exitTime: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setState('success');
        setMessage(data.message || t('newsletterSection.unsubscribe.successMessage'));
      } else {
        setState('error');
        if (response.status === 404) {
          // Either invalid token or already unsubscribed
          setMessage(
            data.details ||
              data.error ||
              t('newsletterSection.unsubscribe.errorMessage')
          );
        } else {
          setMessage(data.error || t('newsletterSection.unsubscribe.error'));
        }
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setState('error');
      setMessage(t('newsletterSection.unsubscribe.error'));
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center"
      >
        <AnimatePresence mode="wait">
          {/* Confirmation State */}
          {state === 'confirming' && (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                {t('newsletterSection.unsubscribe.title')}
              </h1>
              <p className="text-gray-300 mb-2">
                {t('newsletterSection.unsubscribe.confirmMessage')}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {t('newsletterSection.unsubscribe.confirmSubtext')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleUnsubscribe}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('newsletterSection.unsubscribe.confirmButton')}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('newsletterSection.unsubscribe.cancelButton')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                {t('newsletterSection.unsubscribe.processing')}
              </h1>
            </motion.div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                {t('newsletterSection.unsubscribe.success')}
              </h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('newsletterSection.unsubscribe.goHome')}
              </button>
            </motion.div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                {t('newsletterSection.unsubscribe.error')}
              </h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('newsletterSection.unsubscribe.goHome')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
