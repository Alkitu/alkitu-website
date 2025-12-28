export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormProps {
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: string) => void;
  submitButtonText?: string;
  submitButtonTextLoading?: string;
}

export type FormErrors = Partial<Record<keyof ContactFormData, string>>;

export type FormState = 'idle' | 'editing' | 'validating' | 'submitting' | 'success' | 'error';
