'use client';

import { motion } from 'framer-motion';
import { Input } from '@/app/components/atoms/input';
import { Textarea } from '@/app/components/atoms/textarea';
import { Button } from '@/app/components/atoms/button';
import { useContactForm } from './useContactForm';
import { ContactFormProps } from './contact-form.type';
import { useTranslationContext } from '@/app/context/TranslationContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function ContactForm({
  onSuccess,
  onError,
  submitButtonText,
  submitButtonTextLoading,
}: ContactFormProps) {
  const { translations } = useTranslationContext();
  const contactText = translations?.contactPage?.form;

  const {
    formData,
    errors,
    formState,
    errorMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isSuccess,
  } = useContactForm();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(e);

    if (result.success && onSuccess) {
      onSuccess(formData);
    } else if (!result.success && onError && result.error) {
      onError(result.error);
    }
  };

  return (
    <motion.form
      onSubmit={onSubmit}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col gap-6 w-full"
      suppressHydrationWarning
    >
      {/* Name Field */}
      <motion.div variants={itemVariants}>
        <Input
          id="contact-name"
          name="name"
          type="text"
          label={contactText?.nameLabel || 'Your Name'}
          placeholder={contactText?.namePlaceholder || 'John Doe'}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          error={errors.name}
          required
          disabled={isSubmitting}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
      </motion.div>

      {/* Email Field */}
      <motion.div variants={itemVariants}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          label={contactText?.emailLabel || 'Email Address'}
          placeholder={contactText?.emailPlaceholder || 'john@example.com'}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={errors.email}
          required
          disabled={isSubmitting}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />
      </motion.div>

      {/* Subject Field */}
      <motion.div variants={itemVariants}>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          label={contactText?.subjectLabel || 'Subject'}
          placeholder={contactText?.subjectPlaceholder || 'Project Inquiry'}
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          onBlur={() => handleBlur('subject')}
          error={errors.subject}
          required
          disabled={isSubmitting}
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          }
        />
      </motion.div>

      {/* Message Field */}
      <motion.div variants={itemVariants}>
        <Textarea
          id="contact-message"
          name="message"
          label={contactText?.messageLabel || 'Message'}
          placeholder={contactText?.messagePlaceholder || 'Tell me about your project...'}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          error={errors.message}
          required
          disabled={isSubmitting}
          rows={6}
        />
      </motion.div>

      {/* Error Message */}
      {errorMessage && formState === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500"
        >
          <p className="text-red-500 font-medium flex items-center gap-2">
            <span>⚠️</span>
            {errorMessage}
          </p>
        </motion.div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-xl bg-primary/10 border-2 border-primary"
        >
          <p className="text-2xl mb-2">✓</p>
          <p className="font-bold text-primary">
            {contactText?.successMessage || 'Message sent successfully!'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {contactText?.successSubtext || "We will reply to you soon."}
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || isSuccess}
          fullWidth
          className="text-center text-base md:text-[min(2vw,20px)] md:px-[min(3vw,2.5rem)] md:py-[min(0.5vw,2rem)] rounded-full"
          iconAfter={
            isSubmitting ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>→</span>
            )
          }
        >
          {isSubmitting
            ? submitButtonTextLoading || contactText?.submittingButton || 'Sending...'
            : submitButtonText || contactText?.submitButton || 'Send Message'}
        </Button>
      </motion.div>

      {/* Honeypot field (hidden anti-spam) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none"
        aria-hidden="true"
        suppressHydrationWarning
      />
    </motion.form>
  );
}
