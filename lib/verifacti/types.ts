/**
 * Verifacti API Types
 *
 * TypeScript interfaces for the Verifacti fiscal relay API.
 * Verifacti handles XML generation, AEAT submission, hash chains,
 * QR codes, and digital signatures for VeriFACTU compliance.
 *
 * Base URL: https://api.verifacti.com/verifactu
 * Auth: Bearer <API_KEY>
 * Dates: DD-MM-YYYY format
 * Amounts: strings like "1000.00"
 */

// =====================================================
// Request Types
// =====================================================

/** Individual tax line for Verifacti invoice submission */
export interface VerifactiLinea {
  base_imponible: string;
  tipo_impositivo: string;
  cuota_repercutida: string;
  tipo_impuesto?: string;
  clave_regimen?: string;
  operacion_exenta?: string;
  calificacion_operacion?: string;
}

/** Corrective invoice reference */
export interface VerifactiFacturaRectificada {
  serie_factura: string;
  numero_factura: string;
  fecha_expedicion: string;
}

/** Request body for creating/submitting an invoice to Verifacti */
export interface VerifactiCreateRequest {
  serie: string;
  numero: string;
  fecha_expedicion: string;
  nombre_razon_destinatario: string;
  nif_destinatario: string;
  descripcion: string;
  desglose: {
    lineas: VerifactiLinea[];
  };
  tipo_factura?: string;
  tipo_rectificativa?: string;
  factura_rectificada?: VerifactiFacturaRectificada;
}

/** Request body for cancelling an invoice at Verifacti */
export interface VerifactiCancelRequest {
  serie: string;
  numero: string;
  fecha_expedicion: string;
}

// =====================================================
// Response Types
// =====================================================

/** Successful response from creating an invoice */
export interface VerifactiCreateResponse {
  uuid: string;
  estado: string;
  qr: string;
  url: string;
  huella: string;
  csv?: string;
}

/** Invoice status from Verifacti */
export type VerifactiStatus =
  | 'Pendiente'
  | 'Correcto'
  | 'Incorrecto'
  | 'Anulado';

/** Response from checking invoice status */
export interface VerifactiStatusResponse {
  uuid: string;
  estado: VerifactiStatus;
  errores?: string[];
  qr?: string;
  url?: string;
  huella?: string;
  csv?: string;
}

/** Error response from Verifacti API */
export interface VerifactiErrorResponse {
  error: string;
  message?: string;
  details?: string;
  status?: number;
}

// =====================================================
// Health Check
// =====================================================

/** Response from Verifacti health check */
export interface VerifactiHealthResponse {
  status: string;
  nif?: string;
  environment?: string;
}

// =====================================================
// Client Error
// =====================================================

/** Typed error for Verifacti API failures */
export class VerifactiError extends Error {
  public readonly statusCode: number;
  public readonly apiError?: VerifactiErrorResponse;

  constructor(
    message: string,
    statusCode: number,
    apiError?: VerifactiErrorResponse
  ) {
    super(message);
    this.name = 'VerifactiError';
    this.statusCode = statusCode;
    this.apiError = apiError;
  }
}
