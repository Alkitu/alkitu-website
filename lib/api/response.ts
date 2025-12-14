/**
 * Standardized API Response System
 *
 * This module provides utilities for creating consistent API responses
 * following RESTful best practices with proper HTTP status codes.
 */

import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * Error details structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[] | Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

/**
 * Validation error for individual fields
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Metadata for pagination, timing, etc.
 */
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
  requestId?: string;
  timestamp?: string;
}

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error codes for consistent error handling
 */
export const ErrorCode = {
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

/**
 * Success response utilities
 */
export class ApiSuccess {
  /**
   * 200 OK - Standard success response
   */
  static ok<T>(data: T, message?: string, meta?: ApiMeta): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        meta: {
          ...meta,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.OK }
    );
  }

  /**
   * 201 Created - Resource created successfully
   */
  static created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message: message || 'Resource created successfully',
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.CREATED }
    );
  }

  /**
   * 204 No Content - Success with no response body
   */
  static noContent(): NextResponse {
    return new NextResponse(null, { status: HttpStatus.NO_CONTENT });
  }

  /**
   * 202 Accepted - Request accepted for processing
   */
  static accepted<T>(data?: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message: message || 'Request accepted for processing',
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.ACCEPTED }
    );
  }
}

/**
 * Error response utilities
 */
export class ApiError {
  /**
   * 400 Bad Request - Generic client error
   */
  static badRequest(
    message: string,
    details?: ValidationError[] | Record<string, unknown>,
    code: string = ErrorCode.INVALID_INPUT
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          details,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.BAD_REQUEST }
    );
  }

  /**
   * 422 Unprocessable Entity - Validation errors
   */
  static validationError(
    zodError: ZodError | ValidationError[],
    message: string = 'Validation failed'
  ): NextResponse<ApiResponse> {
    let errors: ValidationError[];

    if ('issues' in zodError) {
      // Handle Zod error
      errors = zodError.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));
    } else {
      // Already formatted validation errors
      errors = zodError;
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message,
          details: errors,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.UNPROCESSABLE_ENTITY }
    );
  }

  /**
   * 401 Unauthorized - Authentication required
   */
  static unauthorized(
    message: string = 'Authentication required',
    code: string = ErrorCode.UNAUTHORIZED
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.UNAUTHORIZED }
    );
  }

  /**
   * 403 Forbidden - Insufficient permissions
   */
  static forbidden(
    message: string = 'Insufficient permissions',
    code: string = ErrorCode.FORBIDDEN
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.FORBIDDEN }
    );
  }

  /**
   * 404 Not Found - Resource not found
   */
  static notFound(
    message: string = 'Resource not found',
    code: string = ErrorCode.NOT_FOUND
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.NOT_FOUND }
    );
  }

  /**
   * 409 Conflict - Resource conflict
   */
  static conflict(
    message: string = 'Resource already exists',
    code: string = ErrorCode.CONFLICT
  ): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.CONFLICT }
    );
  }

  /**
   * 429 Too Many Requests - Rate limit exceeded
   */
  static rateLimitExceeded(
    message: string = 'Too many requests, please try again later',
    retryAfter?: number
  ): NextResponse<ApiResponse> {
    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.RATE_LIMIT_EXCEEDED,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.TOO_MANY_REQUESTS }
    );

    if (retryAfter) {
      response.headers.set('Retry-After', retryAfter.toString());
    }

    return response;
  }

  /**
   * 500 Internal Server Error - Generic server error
   */
  static internal(
    message: string = 'Internal server error',
    error?: unknown,
    code: string = ErrorCode.INTERNAL_ERROR
  ): NextResponse<ApiResponse> {
    // Log error for debugging (don't expose to client)
    if (error) {
      console.error('Internal Server Error:', error);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }

  /**
   * 500 Database Error - Database-specific error
   */
  static database(
    message: string = 'Database error occurred',
    error?: unknown
  ): NextResponse<ApiResponse> {
    if (error) {
      console.error('Database Error:', error);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.DATABASE_ERROR,
          message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * Helper to handle async API route errors
 */
export async function handleApiError(
  error: unknown,
  defaultMessage: string = 'An error occurred'
): Promise<NextResponse<ApiResponse>> {
  if (error instanceof Error) {
    return ApiError.internal(error.message || defaultMessage, error);
  }
  return ApiError.internal(defaultMessage, error);
}

/**
 * Type guard for API response
 */
export function isApiResponse(obj: unknown): obj is ApiResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ApiResponse).success === 'boolean'
  );
}
