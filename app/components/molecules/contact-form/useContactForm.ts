'use client';

import { useState, FormEvent } from 'react';
import { ContactFormData, FormErrors, FormState } from './contact-form.type';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (!NAME_REGEX.test(value)) return 'Please enter a valid name';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        break;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
        break;

      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.length < 3) return 'Subject must be at least 3 characters';
        if (value.length > 100) return 'Subject must be less than 100 characters';
        break;

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 1000) return 'Message must be less than 1000 characters';
        break;
    }
    return undefined;
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof ContactFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    return newErrors;
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
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
      const message = error instanceof Error ? error.message : 'An error occurred';
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
