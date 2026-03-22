'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/atoms/button';
import { useContactForm } from './useContactForm';
import {
  ContactFormProps,
  PROJECT_TYPES,
  COMPANY_SIZES,
  BUDGETS,
  PRODUCT_CATEGORIES,
  FUNCTIONALITIES,
  TECH_PROJECT_TYPES,
} from './contact-form.type';
import Link from 'next/link';
import { useTranslationContext } from '@/app/context/TranslationContext';
import { isCategoryAllowed } from '@/lib/cookies/consent';

const TOTAL_STEPS = 6;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const { translations, locale } = useTranslationContext();
  const t = translations?.contactPage?.form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const cookiesAlreadyAccepted = typeof window !== 'undefined' && isCategoryAllowed('analytics');

  const {
    formData,
    errors,
    formState,
    errorMessage,
    handleChange,
    toggleArrayItem,
    handleFiles,
    removeFile,
    handleSubmit,
    hasSubmitted,
    isSubmitting,
    isSuccess,
  } = useContactForm();

  const label = (key: string, fallback: string) => t?.[key] || fallback;

  // Safe accessors for array fields (guards against stale state during hot reload)
  const categories = formData.productCategories ?? [];
  const funcs = formData.functionalities ?? [];

  // Determine if functionalities step should show
  const showFunctionalities = TECH_PROJECT_TYPES.includes(formData.projectType as any);

  // Actual steps (skip functionalities if not a tech project)
  const getEffectiveStep = (s: number) => {
    if (!showFunctionalities && s >= 5) return s + 1;
    return s;
  };

  const effectiveTotalSteps = showFunctionalities ? TOTAL_STEPS : TOTAL_STEPS - 1;

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, effectiveTotalSteps));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const effectiveStep = getEffectiveStep(step);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(e);
    if (result.success && onSuccess) onSuccess(formData);
    else if (!result.success && onError && result.error) onError(result.error as string);
  };

  // Can proceed to next step?
  const canProceed = (): boolean => {
    switch (effectiveStep) {
      case 1: return !!formData.projectType;
      case 2: return !!formData.companySize;
      case 3: return !!formData.budget;
      case 4: return categories.length > 0;
      case 5: return true; // functionalities are optional
      default: return true;
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col w-full">
      {/* Progress Bar */}
      {!isSuccess && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
              {label('stepLabel', 'Step')} {step}/{effectiveTotalSteps}
            </span>
          </div>
          <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={false}
              animate={{ width: `${(step / effectiveTotalSteps) * 100}%` }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            />
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="min-h-[280px] relative">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Project Type */}
          {effectiveStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <h3 className="text-lg font-black text-foreground mb-1">
                {label('projectTypeTitle', 'What type of project do you need?')}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {label('projectTypeSubtitle', 'Select one option.')}
              </p>
              <div className="flex flex-wrap gap-3">
                {PROJECT_TYPES.map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('projectType', type)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      formData.projectType === type
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-red-500 text-xs mt-3">{errors.projectType}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Company Size */}
          {effectiveStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <h3 className="text-lg font-black text-foreground mb-1">
                {label('companySizeTitle', 'What is your company size?')}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {label('companySizeSubtitle', 'Select one option.')}
              </p>
              <div className="flex flex-wrap gap-3">
                {COMPANY_SIZES.map((size) => (
                  <motion.button
                    key={size}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('companySize', size)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      formData.companySize === size
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {label(`companySize_${size}`, size)}
                  </motion.button>
                ))}
              </div>
              {errors.companySize && (
                <p className="text-red-500 text-xs mt-3">{errors.companySize}</p>
              )}
            </motion.div>
          )}

          {/* Step 3: Budget */}
          {effectiveStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <h3 className="text-lg font-black text-foreground mb-1">
                {label('budgetTitle', 'What is your budget?')}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {label('budgetSubtitle', 'Select one option.')}
              </p>
              <div className="flex flex-wrap gap-3">
                {BUDGETS.map((budget) => (
                  <motion.button
                    key={budget}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange('budget', budget)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                      formData.budget === budget
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {label(`budget_${budget}`, budget)}
                  </motion.button>
                ))}
              </div>
              {errors.budget && (
                <p className="text-red-500 text-xs mt-3">{errors.budget}</p>
              )}
            </motion.div>
          )}

          {/* Step 4: Product Categories */}
          {effectiveStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <h3 className="text-lg font-black text-foreground mb-1">
                {label('categoriesTitle', 'How would you categorize your product?')}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {label('categoriesSubtitle', 'Select up to three options.')}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat);
                  const isDisabled = !isSelected && categories.length >= 3;
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                      onClick={() => !isDisabled && toggleArrayItem('productCategories', cat, 3)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        isSelected
                          ? 'border-primary text-primary bg-primary/10 cursor-pointer'
                          : isDisabled
                          ? 'border-foreground/10 text-foreground/30 cursor-not-allowed'
                          : 'border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-primary cursor-pointer'
                      }`}
                    >
                      {label(`category_${cat}`, cat)}
                    </motion.button>
                  );
                })}
              </div>
              {errors.productCategories && (
                <p className="text-red-500 text-xs mt-3">{errors.productCategories}</p>
              )}
            </motion.div>
          )}

          {/* Step 5: Functionalities (conditional) */}
          {effectiveStep === 5 && showFunctionalities && (
            <motion.div
              key="step-5"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <h3 className="text-lg font-black text-foreground mb-1">
                {label('functionalitiesTitle', 'What functionalities do you need?')}
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                {label('functionalitiesSubtitle', 'Select all that apply.')}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {FUNCTIONALITIES.map((fn) => {
                  const isSelected = funcs.includes(fn);
                  return (
                    <motion.button
                      key={fn}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleArrayItem('functionalities', fn)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-foreground/20 text-foreground/70 hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      {label(`func_${fn}`, fn)}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 6: Contact Details + Message + Files */}
          {effectiveStep === 6 && (
            <motion.div
              key="step-6"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Name and Email side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-2">
                <div className="relative group">
                  <input
                    id="cf-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-0 border-b-2 border-border/80 px-1 py-3 text-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors focus:bg-transparent"
                    placeholder={label('namePlaceholder', 'John Doe')}
                  />
                  <label htmlFor="cf-name" className="absolute left-1 -top-5 text-sm font-semibold text-foreground/60 transition-all pointer-events-none">
                    {label('nameLabel', 'Your Name')} *
                  </label>
                  {hasSubmitted && errors.name && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.name}</p>}
                </div>

                <div className="relative group">
                  <input
                    id="cf-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-transparent border-0 border-b-2 border-border/80 px-1 py-3 text-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors focus:bg-transparent"
                    placeholder={label('emailPlaceholder', 'hello@example.com')}
                  />
                  <label htmlFor="cf-email" className="absolute left-1 -top-5 text-sm font-semibold text-foreground/60 transition-all pointer-events-none">
                    {label('emailLabel', 'Email')} *
                  </label>
                  {hasSubmitted && errors.email && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.email}</p>}
                </div>
              </div>

              <div className="relative group mb-8 mt-6">
                <textarea
                  id="cf-message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full bg-transparent border-0 border-b-2 border-border/80 px-1 py-3 text-foreground focus:outline-none focus:ring-0 focus:border-primary transition-colors resize-none focus:bg-transparent"
                  placeholder={label('messagePlaceholder', 'Describe your project needs...')}
                />
                <label htmlFor="cf-message" className="absolute left-1 -top-5 text-sm font-semibold text-foreground/60 transition-all pointer-events-none">
                  {label('messageLabel', 'Tell us about your project')} *
                </label>
                {hasSubmitted && errors.message && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-1">{errors.message}</p>}
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                >
                  <svg className="w-7 h-7 text-foreground/30 group-hover:text-primary/70 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <p className="text-sm font-bold text-foreground/80 text-center">
                    {label('filesLabel', 'Attach references or briefs')}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1 max-w-[200px] text-center">
                    {label('filesDragText', 'Max 10MB. Images, PDFs or Docs.')}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.fig,.sketch"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
                {formData.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.files.map((file, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-foreground/5 border border-border text-xs font-semibold text-foreground/80"
                      >
                        <span className="truncate max-w-[140px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Privacy Policy Checkbox — only if cookies not already accepted */}
              {!cookiesAlreadyAccepted && (
                <div className="flex items-start gap-3 mt-2">
                  <input
                    id="cf-policy"
                    type="checkbox"
                    checked={acceptedPolicy}
                    onChange={(e) => setAcceptedPolicy(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/50 accent-primary cursor-pointer"
                  />
                  <label htmlFor="cf-policy" className="text-xs text-foreground/60 leading-relaxed cursor-pointer select-none">
                    {label('policyCheckbox', 'He leído y acepto la')}{' '}
                    <Link href={`/${locale}/privacy-policy`} target="_blank" className="text-primary hover:underline font-semibold">
                      {label('policyPrivacy', 'Política de Privacidad')}
                    </Link>{' '}
                    {label('policyAnd', 'y la')}{' '}
                    <Link href={`/${locale}/cookie-policy`} target="_blank" className="text-primary hover:underline font-semibold">
                      {label('policyCookies', 'Política de Cookies')}
                    </Link>
                  </label>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error / Success Messages */}
      {errorMessage && formState === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
          <p className="text-red-500 font-semibold text-sm text-center">{errorMessage}</p>
        </div>
      )}

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6 text-center"
        >
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-black text-primary text-xl">
            {label('successMessage', 'Message Sent!')}
          </p>
          <p className="text-sm font-medium text-foreground/60 mt-1">
            {label('successSubtext', 'We will get back to you shortly.')}
          </p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      {!isSuccess && (
        <div className="flex items-center justify-between mt-4">
          {/* Back Button */}
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={goBack}
              className="text-sm font-bold uppercase tracking-widest"
              iconBefore={
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current">
                  <path d="M20 12H4M4 12L10 6M4 12L10 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              {label('backButton', 'Back')}
            </Button>
          ) : (
            <div />
          )}

          {/* Next or Submit */}
          {effectiveStep < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!canProceed()}
              onClick={goNext}
              className="py-4 px-10 text-sm font-black uppercase tracking-widest rounded-[2rem] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              iconAfter={
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current ms-1">
                  <path d="M4 12H20M20 12L14 6M20 12L14 18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              {label('nextButton', 'Next')}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || (!cookiesAlreadyAccepted && !acceptedPolicy)}
              className="py-4 px-10 text-sm font-black uppercase tracking-widest rounded-[2rem] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
              iconAfter={
                isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block ms-2" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current ms-1">
                    <path d="M4 12H20M20 12L14 6M20 12L14 18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              }
            >
              {isSubmitting
                ? label('submittingButton', 'Sending...')
                : label('submitButton', 'Submit')}
            </Button>
          )}
        </div>
      )}

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    </form>
  );
}
