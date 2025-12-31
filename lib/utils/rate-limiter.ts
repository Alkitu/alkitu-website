/**
 * Simple in-memory rate limiter
 *
 * Limits requests per IP address within a time window.
 * For production use with multiple server instances, consider using:
 * - Redis (recommended)
 * - Upstash Rate Limit
 * - Vercel KV
 *
 * This implementation is suitable for:
 * - Single serverless function instances
 * - Low to medium traffic
 * - Simple rate limiting needs
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit tracking
// Key: IP address, Value: {count, resetTime}
const store = new Map<string, RateLimitEntry>();

/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   * @default 3
   */
  maxRequests?: number;

  /**
   * Time window in milliseconds
   * @default 3600000 (1 hour)
   */
  windowMs?: number;
}

/**
 * Result of rate limit check
 */
export interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;

  /**
   * Current request count for this identifier
   */
  count: number;

  /**
   * Maximum requests allowed
   */
  limit: number;

  /**
   * Time in milliseconds until the rate limit resets
   */
  resetIn: number;

  /**
   * Timestamp when the rate limit will reset
   */
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for rate limiting (usually IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 *
 * @example
 * ```typescript
 * const result = checkRateLimit('192.168.1.1', {
 *   maxRequests: 3,
 *   windowMs: 3600000, // 1 hour
 * });
 *
 * if (!result.allowed) {
 *   return Response.json(
 *     { error: 'Too many requests' },
 *     {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': result.limit.toString(),
 *         'X-RateLimit-Remaining': (result.limit - result.count).toString(),
 *         'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
 *         'Retry-After': Math.ceil(result.resetIn / 1000).toString(),
 *       },
 *     }
 *   );
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const { maxRequests = 3, windowMs = 3600000 } = config; // Default: 3 requests per hour

  const now = Date.now();
  const entry = store.get(identifier);

  // Clean up expired entries periodically (every 100 checks)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries(now);
  }

  // No previous entry or entry has expired
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + windowMs;
    store.set(identifier, { count: 1, resetTime });

    return {
      allowed: true,
      count: 1,
      limit: maxRequests,
      resetIn: windowMs,
      resetTime,
    };
  }

  // Increment count for existing entry
  entry.count++;

  // Check if limit exceeded
  const allowed = entry.count <= maxRequests;
  const resetIn = entry.resetTime - now;

  return {
    allowed,
    count: entry.count,
    limit: maxRequests,
    resetIn,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries from the store
 * Called periodically to prevent memory leaks
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, value] of store.entries()) {
    if (now >= value.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual reset
 *
 * @param identifier - Identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Get current rate limit status without incrementing count
 *
 * @param identifier - Identifier to check
 * @param config - Rate limit configuration
 * @returns Current rate limit status
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = {}
): RateLimitResult | null {
  const { maxRequests = 3, windowMs = 3600000 } = config;

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now >= entry.resetTime) {
    return null; // No active rate limit
  }

  const resetIn = entry.resetTime - now;

  return {
    allowed: entry.count < maxRequests,
    count: entry.count,
    limit: maxRequests,
    resetIn,
    resetTime: entry.resetTime,
  };
}
