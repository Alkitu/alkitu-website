/**
 * API Client Utilities
 *
 * Type-safe fetch wrapper with automatic error handling,
 * toast notifications, and standardized response parsing.
 */

import { toast } from 'sonner';
import type { ApiResponse, ValidationError } from './response';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  showToasts?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Fetch options with typed body
 */
export interface FetchOptions<TBody = unknown> extends Omit<RequestInit, 'body'> {
  body?: TBody;
  showToasts?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * API client error with additional metadata
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: ValidationError[] | Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Default configuration
 */
const defaultConfig: Required<Omit<ApiClientConfig, 'successMessage' | 'errorMessage'>> = {
  baseUrl: '',
  headers: {
    'Content-Type': 'application/json',
  },
  showToasts: true,
};

/**
 * Type-safe API client
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Generic fetch method with automatic error handling
   */
  private async fetch<TResponse, TBody = unknown>(
    endpoint: string,
    options: FetchOptions<TBody> = {}
  ): Promise<TResponse> {
    const {
      body,
      headers,
      showToasts = this.config.showToasts,
      successMessage,
      errorMessage,
      ...fetchOptions
    } = options;

    const url = `${this.config.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.config.headers,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle 204 No Content
      if (response.status === 204) {
        if (showToasts && successMessage) {
          toast.success(successMessage);
        }
        return undefined as TResponse;
      }

      const data: ApiResponse<TResponse> = await response.json();

      // Handle error responses
      if (!response.ok || !data.success) {
        const error = data.error || {
          code: 'UNKNOWN_ERROR',
          message: errorMessage || 'An error occurred',
        };

        if (showToasts) {
          // Show validation errors
          if (error.details && Array.isArray(error.details)) {
            const validationErrors = error.details as ValidationError[];
            validationErrors.forEach((err) => {
              toast.error(`${err.field}: ${err.message}`);
            });
          } else {
            toast.error(error.message);
          }
        }

        throw new ApiClientError(
          error.message,
          error.code,
          response.status,
          error.details
        );
      }

      // Show success toast
      if (showToasts && (successMessage || data.message)) {
        toast.success(successMessage || data.message || 'Success');
      }

      return data.data as TResponse;
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (error instanceof ApiClientError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Network error occurred';

      if (showToasts) {
        toast.error(errorMessage || message);
      }

      throw new ApiClientError(
        message,
        'NETWORK_ERROR',
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<TResponse>(
    endpoint: string,
    options: Omit<FetchOptions, 'body' | 'method'> = {}
  ): Promise<TResponse> {
    return this.fetch<TResponse>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<FetchOptions<TBody>, 'body' | 'method'> = {}
  ): Promise<TResponse> {
    return this.fetch<TResponse, TBody>(endpoint, {
      ...options,
      method: 'POST',
      body,
    });
  }

  /**
   * PUT request
   */
  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<FetchOptions<TBody>, 'body' | 'method'> = {}
  ): Promise<TResponse> {
    return this.fetch<TResponse, TBody>(endpoint, {
      ...options,
      method: 'PUT',
      body,
    });
  }

  /**
   * PATCH request
   */
  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<FetchOptions<TBody>, 'body' | 'method'> = {}
  ): Promise<TResponse> {
    return this.fetch<TResponse, TBody>(endpoint, {
      ...options,
      method: 'PATCH',
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<TResponse>(
    endpoint: string,
    options: Omit<FetchOptions, 'body' | 'method'> = {}
  ): Promise<TResponse> {
    return this.fetch<TResponse>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Default API client instance
 */
export const api = new ApiClient();

/**
 * Convenience methods for common operations
 */
export const apiClient = {
  /**
   * GET request without toasts (for background operations)
   */
  getSilent: <TResponse>(endpoint: string) =>
    api.get<TResponse>(endpoint, { showToasts: false }),

  /**
   * POST request with custom success message
   */
  postWithMessage: <TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    successMessage: string
  ) =>
    api.post<TResponse, TBody>(endpoint, body, { successMessage }),

  /**
   * DELETE request with confirmation
   */
  deleteWithMessage: <TResponse>(endpoint: string, successMessage: string) =>
    api.delete<TResponse>(endpoint, { successMessage }),
};
