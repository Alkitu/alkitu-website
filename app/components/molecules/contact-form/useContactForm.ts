'use client';

import { useState, FormEvent } from 'react';
import { useTranslationContext } from '@/app/context/TranslationContext';
import { ContactFormData, FormErrors, FormState } from './contact-form.type';
import { contactFormSchema } from '@/lib/schemas/contact';

export function useContactForm() {
  const { locale } = useTranslationContext();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Validate a single field using Zod schema
   * Extracts the first error message for the field
   */
  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    try {
      // Create a partial schema for single field validation
      const fieldValue = { [name]: value, locale };
      contactFormSchema.pick({ [name]: true } as any).parse(fieldValue);
      return undefined;
    } catch (error: any) {
      if (error?.errors?.[0]?.message) {
        return error.errors[0].message;
      }
      return 'Invalid value';
    }
  };

  /**
   * Validate entire form using Zod schema
   * Returns errors object compatible with FormErrors type
   */
  const validateForm = (): FormErrors => {
    try {
      contactFormSchema.parse({ ...formData, locale });
      return {};
    } catch (error: any) {
      const newErrors: FormErrors = {};

      if (error?.errors) {
        error.errors.forEach((err: any) => {
          const fieldName = err.path[0] as string;
          // Only add errors for form fields, not locale
          if (fieldName && fieldName !== 'locale' && fieldName in formData) {
            newErrors[fieldName as keyof ContactFormData] = err.message;
          }
        });
      }

      return newErrors;
    }
  };

  const handleChange = (name: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Update form state
    if (formState === 'idle') {
      setFormState('editing');
    }
  };

  const handleBlur = (name: keyof ContactFormData) => {
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all fields
    setFormState('validating');
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormState('error');
      return { success: false, errors: validationErrors };
    }

    // Submit form
    setFormState('submitting');
    setErrors({});
    setErrorMessage('');

    try {
      // Updated endpoint: /api/contact/submit
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale, // Add locale from context
        }),
      });

      const data = await response.json();

      // Handle rate limit error (429)
      if (response.status === 429) {
        setFormState('error');
        setErrorMessage(
          data.details ||
          (locale === 'es'
            ? 'Demasiadas solicitudes. Por favor, intenta más tarde.'
            : 'Too many requests. Please try again later.')
        );
        return { success: false, error: data.details };
      }

      // Handle other errors
      if (!response.ok) {
        throw new Error(
          data.error ||
          (locale === 'es'
            ? 'Error al enviar el mensaje'
            : 'Failed to send message')
        );
      }

      setFormState('success');

      // Reset form after success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      return { success: true, data };
    } catch (error) {
      setFormState('error');
      const message = error instanceof Error
        ? error.message
        : (locale === 'es'
            ? 'Ocurrió un error inesperado'
            : 'An unexpected error occurred');
      setErrorMessage(message);
      return { success: false, error: message };
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setFormState('idle');
    setErrorMessage('');
  };

  return {
    formData,
    errors,
    formState,
    errorMessage,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitting: formState === 'submitting',
    isSuccess: formState === 'success',
    hasErrors: Object.keys(errors).length > 0,
  };
}
