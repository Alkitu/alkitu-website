/**
 * Verifacti API Client
 *
 * Functions to interact with the Verifacti fiscal relay API.
 * Handles invoice submission, status checking, and cancellation.
 *
 * @see https://api.verifacti.com/verifactu
 */

import type {
  VerifactiCreateRequest,
  VerifactiCreateResponse,
  VerifactiCancelRequest,
  VerifactiStatusResponse,
  VerifactiHealthResponse,
  VerifactiErrorResponse,
} from './types';
import { VerifactiError } from './types';

const VERIFACTI_BASE = 'https://api.verifacti.com/verifactu';

// =====================================================
// Internal Helpers
// =====================================================

async function verifactiRequest<T>(
  path: string,
  apiKey: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${VERIFACTI_BASE}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let apiError: VerifactiErrorResponse | undefined;
    try {
      apiError = await response.json();
    } catch {
      // Response body may not be JSON
    }

    throw new VerifactiError(
      apiError?.message || apiError?.error || `Verifacti API error: ${response.status}`,
      response.status,
      apiError
    );
  }

  return response.json();
}

// =====================================================
// Public API
// =====================================================

/**
 * Submit an invoice to Verifacti for AEAT processing.
 * Returns UUID, QR, huella. Status starts as "Pendiente".
 * AEAT typically processes within ~1 minute.
 */
export async function createInvoice(
  apiKey: string,
  payload: VerifactiCreateRequest
): Promise<VerifactiCreateResponse> {
  return verifactiRequest<VerifactiCreateResponse>(
    '/facturas',
    apiKey,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Check the current status of a submitted invoice.
 * Status transitions: Pendiente -> Correcto | Incorrecto
 */
export async function checkStatus(
  apiKey: string,
  uuid: string
): Promise<VerifactiStatusResponse> {
  return verifactiRequest<VerifactiStatusResponse>(
    `/facturas/${uuid}`,
    apiKey,
    { method: 'GET' }
  );
}

/**
 * Cancel an invoice at Verifacti (anulacion).
 * Uses serie + numero + fecha_expedicion, NOT UUID.
 */
export async function cancelInvoice(
  apiKey: string,
  payload: VerifactiCancelRequest
): Promise<VerifactiCreateResponse> {
  return verifactiRequest<VerifactiCreateResponse>(
    '/facturas/anular',
    apiKey,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Check Verifacti API connectivity and authentication.
 * Returns NIF and environment info associated with the API key.
 */
export async function healthCheck(
  apiKey: string
): Promise<VerifactiHealthResponse> {
  return verifactiRequest<VerifactiHealthResponse>(
    '/health',
    apiKey,
    { method: 'GET' }
  );
}
