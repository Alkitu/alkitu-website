'use client';

import React, { forwardRef } from 'react';
import { Input } from '~/components/primitives/input';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Field types supported by the dynamic form renderer
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'date'
  | 'time'
  | 'file';

/**
 * Field option for select, radio, and checkboxGroup
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Legacy field option format (string array)
 * Supported for backward compatibility but not recommended for new code
 */
export type LegacyFieldOption = string;

/**
 * Combined field option type (supports both current and legacy formats)
 */
export type FieldOptionType = FieldOption | LegacyFieldOption;

/**
 * Validation rules for fields
 */
export interface FieldValidation {
  // Text/Textarea validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Number validation
  min?: number;
  max?: number;
  integer?: boolean;

  // File validation
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];

  // Checkbox group validation
  minSelected?: number;
  maxSelected?: number;
}

/**
 * Dynamic field definition from requestTemplate
 */
export interface DynamicField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOptionType[]; // Supports both FieldOption and string (legacy)
  validation?: FieldValidation;
}

/**
 * DynamicForm Props
 *
 * Composed component for rendering individual dynamic form fields.
 * Supports 10 field types with validation and accessibility features.
 */
export interface DynamicFormProps {
  /** Field configuration */
  field: DynamicField;

  /** React Hook Form register function */
  register: UseFormRegister<any>;

  /** Form errors */
  errors: FieldErrors<any>;

  /** Current field value (for controlled components) */
  value?: any;

  /** onChange handler for controlled components */
  onChange?: (value: any) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Additional CSS classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DynamicForm - Design System Composed Component
 *
 * Renders a single form field based on its type and configuration.
 * Supports 10 field types: text, textarea, number, select, radio,
 * checkbox, checkboxGroup, date, time, file.
 *
 * Features:
 * - Dynamic rendering based on field type
 * - Validation integration with React Hook Form
 * - Field-level error messages
 * - Help text and placeholders
 * - Required field indicators
 * - Options for select/radio/checkboxGroup
 * - Accessibility support (ARIA attributes)
 * - ForwardRef support
 *
 * @example
 * ```tsx
 * <DynamicForm
 *   field={field}
 *   register={register}
 *   errors={errors}
 * />
 * ```
 */
export const DynamicForm = forwardRef<HTMLDivElement, DynamicFormProps>(
  (
    { field, register, errors, value, onChange, disabled = false, className = '' },
    ref
  ) => {
    const error = errors[field.id];
    const errorMessage = error?.message as string | undefined;

    /**
     * Normalize options to handle both legacy (string[]) and current (FieldOption[]) formats
     */
    const normalizedOptions = React.useMemo(() => {
      if (!field.options) return [];

      return field.options.map((option) => {
        // If option is a string (legacy format), convert to object
        if (typeof option === 'string') {
          return { value: option, label: option };
        }
        // If option is already an object, use as-is
        return option;
      });
    }, [field.options]);

    /**
     * Render field based on type
     */
    const renderField = () => {
      switch (field.type) {
        case 'text':
          return (
            <Input
              id={field.id}
              type="text"
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                minLength: field.validation?.minLength
                  ? {
                      value: field.validation.minLength,
                      message: `Minimum ${field.validation.minLength} characters required`,
                    }
                  : undefined,
                maxLength: field.validation?.maxLength
                  ? {
                      value: field.validation.maxLength,
                      message: `Maximum ${field.validation.maxLength} characters allowed`,
                    }
                  : undefined,
                pattern: field.validation?.pattern
                  ? {
                      value: new RegExp(field.validation.pattern),
                      message: 'Invalid format',
                    }
                  : undefined,
              })}
              className={error ? 'border-red-500' : ''}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        case 'textarea':
          return (
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                minLength: field.validation?.minLength
                  ? {
                      value: field.validation.minLength,
                      message: `Minimum ${field.validation.minLength} characters required`,
                    }
                  : undefined,
                maxLength: field.validation?.maxLength
                  ? {
                      value: field.validation.maxLength,
                      message: `Maximum ${field.validation.maxLength} characters allowed`,
                    }
                  : undefined,
              })}
              rows={4}
              className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        case 'number':
          return (
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                valueAsNumber: true,
                min: field.validation?.min
                  ? {
                      value: field.validation.min,
                      message: `Minimum value is ${field.validation.min}`,
                    }
                  : undefined,
                max: field.validation?.max
                  ? {
                      value: field.validation.max,
                      message: `Maximum value is ${field.validation.max}`,
                    }
                  : undefined,
                validate: field.validation?.integer
                  ? (value: number) =>
                      Number.isInteger(value) || 'Must be an integer'
                  : undefined,
              })}
              className={error ? 'border-red-500' : ''}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        case 'select':
          return (
            <select
              id={field.id}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
              className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            >
              <option value="">
                {field.placeholder || `Select ${field.label}`}
              </option>
              {normalizedOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'radio':
          return (
            <div className="space-y-2" data-testid={`dynamic-form-field-${field.id}`}>
              {normalizedOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${field.id}-${option.value}`}
                    type="radio"
                    value={option.value}
                    {...register(field.id, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );

        case 'checkbox':
          return (
            <div className="flex items-center" data-testid={`dynamic-form-field-${field.id}`}>
              <input
                id={field.id}
                type="checkbox"
                {...register(field.id, {
                  required: field.required ? `${field.label} is required` : false,
                })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={disabled}
              />
              <label htmlFor={field.id} className="ml-2 text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          );

        case 'checkboxGroup':
          return (
            <div className="space-y-2" data-testid={`dynamic-form-field-${field.id}`}>
              {normalizedOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${field.id}-${option.value}`}
                    type="checkbox"
                    value={option.value}
                    {...register(field.id, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`${field.id}-${option.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );

        case 'date':
          return (
            <Input
              id={field.id}
              type="date"
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
              className={error ? 'border-red-500' : ''}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        case 'time':
          return (
            <Input
              id={field.id}
              type="time"
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
              className={error ? 'border-red-500' : ''}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        case 'file':
          return (
            <Input
              id={field.id}
              type="file"
              multiple={
                field.validation?.maxFiles
                  ? field.validation.maxFiles > 1
                  : false
              }
              accept={field.validation?.acceptedTypes?.join(',')}
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
              })}
              className={error ? 'border-red-500' : ''}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? `${field.id}-error` : undefined}
              data-testid={`dynamic-form-field-${field.id}`}
            />
          );

        default:
          return (
            <p className="text-sm text-red-600" data-testid="unsupported-field-type">
              Unsupported field type: {field.type}
            </p>
          );
      }
    };

    // Special rendering for checkbox (label is part of the field)
    if (field.type === 'checkbox') {
      return (
        <div ref={ref} className={`space-y-1 ${className}`} data-testid="dynamic-form-wrapper">
          {renderField()}
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
          {errorMessage && (
            <p id={`${field.id}-error`} className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      );
    }

    // Standard rendering for all other field types
    return (
      <div ref={ref} className={`space-y-1 ${className}`} data-testid="dynamic-form-wrapper">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderField()}
        {field.helpText && (
          <p className="text-xs text-gray-500">{field.helpText}</p>
        )}
        {errorMessage && (
          <p id={`${field.id}-error`} className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

DynamicForm.displayName = 'DynamicForm';
