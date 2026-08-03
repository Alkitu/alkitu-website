'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/atoms/button';
import { useTranslationContext } from '@/app/context/TranslationContext';
import { trackGenerateLead } from '@/lib/analytics/events';

type ProjectType = 'onepage' | 'small' | 'full' | 'not_sure';

type FormState = {
  name: string;
  email: string;
  projectType: ProjectType | '';
  currentUrl: string;
  message: string;
  privacy: boolean;
};

const INITIAL: FormState = {
  name: '',
  email: '',
  projectType: '',
  currentUrl: '',
  message: '',
  privacy: false,
};

type FormDict = {
  name?: string; namePlaceholder?: string;
  email?: string; emailPlaceholder?: string;
  projectType?: string;
  projectOnePage?: string; projectSmall?: string; projectFull?: string; projectNotSure?: string;
  currentUrl?: string; currentUrlPlaceholder?: string;
  message?: string; messagePlaceholder?: string;
  privacyAccept?: string; privacyLink?: string;
  submit?: string; submitting?: string;
  successTitle?: string; successText?: string;
  errorText?: string;
  errorRequired?: string; errorEmail?: string; errorMessage?: string; errorPolicy?: string;
};

export default function LandingLeadForm() {
  const { translations, locale } = useTranslationContext();
  const t: FormDict | undefined =
    (translations as { landingWebDesign?: { form?: FormDict } } | undefined)?.landingWebDesign?.form;

  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!data.name.trim()) next.name = t?.errorRequired;
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = t?.errorEmail;
    }
    if (!data.projectType) next.projectType = t?.errorRequired;
    if (!data.message.trim() || data.message.trim().length < 10) {
      next.message = t?.errorMessage;
    }
    if (!data.privacy) next.privacy = t?.errorPolicy;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const projectTypeMap: Record<ProjectType, string> = {
    onepage: 'Website (1 page)',
    small: 'Website (2-3 pages)',
    full: 'Website (4-5 pages)',
    not_sure: 'Website (not sure)',
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append('name', data.name);
      body.append('email', data.email);
      body.append('projectType', projectTypeMap[data.projectType as ProjectType]);
      body.append('message', data.message);
      body.append('locale', locale);
      body.append('source', 'landing-web-design');
      if (data.currentUrl.trim()) {
        body.append('currentUrl', data.currentUrl.trim());
      }

      const res = await fetch('/api/contact/submit', { method: 'POST', body });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.details || payload?.error || 'submit failed');
      }

      setSuccess(true);
      trackGenerateLead({
        source: 'landing-web-design',
        currency: locale === 'en' ? 'USD' : 'EUR',
      });
      setData(INITIAL);
    } catch (err) {
      setErrorMsg(t?.errorText || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-zinc-900 border border-primary/40 p-10 md:p-12 shadow-2xl text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary mb-6">
          <CheckCircle2 className="w-9 h-9" strokeWidth={2} />
        </div>
        <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-4">
          {t?.successTitle}
        </h3>
        <p className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto">
          {t?.successText}
        </p>
      </motion.div>
    );
  }

  const inputBase =
    'w-full bg-zinc-950 border rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 outline-none transition-colors focus:border-primary disabled:opacity-50';

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="rounded-3xl bg-zinc-900 border border-white/10 p-7 md:p-10 shadow-2xl"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] top-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
            {t?.name}
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder={t?.namePlaceholder}
            className={`${inputBase} ${errors.name ? 'border-red-500/60' : 'border-white/10'}`}
            disabled={submitting}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
            {t?.email}
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder={t?.emailPlaceholder}
            className={`${inputBase} ${errors.email ? 'border-red-500/60' : 'border-white/10'}`}
            disabled={submitting}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <span className="block text-sm font-semibold text-white mb-2">
          {t?.projectType}
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(
            [
              { value: 'onepage', label: t?.projectOnePage },
              { value: 'small', label: t?.projectSmall },
              { value: 'full', label: t?.projectFull },
              { value: 'not_sure', label: t?.projectNotSure },
            ] as Array<{ value: ProjectType; label?: string }>
          ).map((opt) => {
            const selected = data.projectType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set('projectType', opt.value)}
                disabled={submitting}
                className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all text-center ${
                  selected
                    ? 'bg-primary text-zinc-950 border-primary'
                    : 'bg-zinc-950 text-white/80 border-white/10 hover:border-primary/50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.projectType && (
          <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.projectType}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="currentUrl" className="block text-sm font-semibold text-white mb-2">
          {t?.currentUrl}
        </label>
        <input
          id="currentUrl"
          type="text"
          value={data.currentUrl}
          onChange={(e) => set('currentUrl', e.target.value)}
          placeholder={t?.currentUrlPlaceholder}
          className={`${inputBase} border-white/10`}
          disabled={submitting}
        />
      </div>

      <div className="mb-5">
        <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
          {t?.message}
        </label>
        <textarea
          id="message"
          value={data.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder={t?.messagePlaceholder}
          rows={4}
          className={`${inputBase} resize-none ${errors.message ? 'border-red-500/60' : 'border-white/10'}`}
          disabled={submitting}
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
          </p>
        )}
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={data.privacy}
          onChange={(e) => set('privacy', e.target.checked)}
          disabled={submitting}
          className="mt-1 w-4 h-4 accent-primary"
        />
        <span className="text-sm text-white/70">
          {t?.privacyAccept}{' '}
          <Link
            href={`/${locale}/privacy-policy`}
            target="_blank"
            className="text-primary underline underline-offset-4"
          >
            {t?.privacyLink}
          </Link>
          .
        </span>
      </label>
      {errors.privacy && (
        <p className="text-red-400 text-xs mt-[-12px] mb-4 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {errors.privacy}
        </p>
      )}

      {errorMsg && (
        <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={submitting}
        fullWidth
        iconAfter={!submitting ? <ArrowRight className="w-5 h-5" /> : undefined}
        className="text-base"
      >
        {submitting ? t?.submitting : t?.submit}
      </Button>
    </motion.form>
  );
}
