'use client';

import { useState, FormEvent } from 'react';
import { useTranslationContext } from '@/app/context/TranslationContext';
import { ContactFormData, FormErrors, FormState } from './contact-form.type';

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  projectType: '',
  companySize: '',
  budget: '',
  productCategories: [],
  functionalities: [],
  message: '',
  files: [],
};

export function useContactForm() {
  const { locale } = useTranslationContext();

  const [formData, setFormData] = useState<ContactFormData>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = locale === 'es' ? 'El nombre es obligatorio' : 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = locale === 'es' ? 'El nombre debe tener al menos 2 caracteres' : 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'es' ? 'Email válido es obligatorio' : 'Valid email is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = locale === 'es' ? 'Describe tu proyecto' : 'Describe your project';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = locale === 'es' ? 'El mensaje debe tener al menos 10 caracteres' : 'Message must be at least 10 characters';
    }

    return newErrors;
  };

  const handleChange = (name: keyof ContactFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formState === 'idle') setFormState('editing');
  };

  const toggleArrayItem = (name: 'productCategories' | 'functionalities', item: string, maxItems?: number) => {
    setFormData((prev) => {
      const arr = prev[name] as string[];
      if (arr.includes(item)) {
        return { ...prev, [name]: arr.filter((i) => i !== item) };
      }
      if (maxItems && arr.length >= maxItems) return prev;
      return { ...prev, [name]: [...arr, item] };
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formState === 'idle') setFormState('editing');
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setHasSubmitted(true);
    setFormState('validating');
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormState('error');
      return { success: false, errors: validationErrors };
    }

    setFormState('submitting');
    setErrors({});
    setErrorMessage('');

    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('projectType', formData.projectType);
      body.append('companySize', formData.companySize);
      body.append('budget', formData.budget);
      body.append('productCategories', JSON.stringify(formData.productCategories));
      body.append('functionalities', JSON.stringify(formData.functionalities));
      body.append('message', formData.message);
      body.append('locale', locale);

      // Honeypot field — read from native form element
      const honeypotValue = (e.currentTarget.elements.namedItem('website') as HTMLInputElement)?.value || '';
      if (honeypotValue) {
        body.append('website', honeypotValue);
      }

      formData.files.forEach((file) => body.append('files', file));

      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        body,
      });

      const data = await response.json();

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

      if (!response.ok) {
        // Show specific field errors from Zod validation if available
        if (data.details && typeof data.details === 'object') {
          const fieldErrors: FormErrors = {};
          for (const [key, msgs] of Object.entries(data.details)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              fieldErrors[key] = msgs[0] as string;
            }
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        }
        throw new Error(
          data.error ||
          (locale === 'es' ? 'Error al enviar el formulario' : 'Failed to submit form')
        );
      }

      setFormState('success');
      setFormData({ ...INITIAL_FORM });
      return { success: true, data };
    } catch (error) {
      setFormState('error');
      const message = error instanceof Error
        ? error.message
        : (locale === 'es' ? 'Ocurrió un error inesperado' : 'An unexpected error occurred');
      setErrorMessage(message);
      return { success: false, error: message };
    }
  };

  return {
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
    isSubmitting: formState === 'submitting',
    isSuccess: formState === 'success',
  };
}
