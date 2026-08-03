import { createHash } from "node:crypto";

/**
 * Analítica propia, cookieless y GDPR-friendly (patrón Plausible): el visitante
 * se identifica por un HASH diario e irreversible de secreto+día+IP+UA. Al rotar
 * el salt cada día no hay identificador persistente entre jornadas — únicos por
 * día exactos; únicos a 30 días son una aproximación (una persona cuenta 1/día).
 */
const BOT =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|preview|monitor|curl|wget|python-requests|axios|node-fetch|vercel-screenshot|gptbot|chatgpt|oai-search|claudebot|anthropic|perplexity|ccbot|dataforseo|semrush|scrapy|okhttp|go-http|phantomjs|puppeteer|playwright|selenium|pingdom|uptimerobot|gtmetrix|http-client|libwww|httpx/i;

export function isBot(ua: string | null): boolean {
  return !ua || BOT.test(ua);
}

/**
 * Heurística ligera de cliente automatizado a nivel de cabeceras: los navegadores
 * reales SIEMPRE envían Accept-Language (el navegador la fija, incluso en fetch);
 * su ausencia delata scrapers/HTTP-clients que pegan directo al endpoint. No caza
 * headless que emulan un navegador completo (para eso haría falta reputación de IP).
 */
export function looksAutomated(h: HeaderGetter): boolean {
  return !h.get("accept-language");
}

// Estructural: acepta tanto Headers (NextRequest) como ReadonlyHeaders (headers()).
type HeaderGetter = { get(name: string): string | null };

export function getClientIp(h: HeaderGetter): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}

/** País ISO-2 gratis en Vercel (edge geo). Null en local/otros hostings. */
export function getCountry(h: HeaderGetter): string | null {
  const c = h.get("x-vercel-ip-country");
  return c && c !== "XX" ? c.toUpperCase() : null;
}

export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export function fingerprint(ip: string, ua: string, day = dayKey()): string {
  const secret = process.env.AUTH_SECRET ?? "lk-analytics";
  return createHash("sha256")
    .update(`${secret}:${day}:${ip}:${ua}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Clave de visitante ESTABLE entre días: sha256(secreto:ip:ua), sin la fecha.
 * A diferencia de `fingerprint` (rota a diario), esta clave persiste, así que
 * permite reconocer y nombrar a un visitante recurrente. Sigue siendo cookieless
 * y no almacena la IP en claro, pero un identificador persistente ES dato personal
 * (matizado en Context/09-Admin/Estadisticas.es.md). Se guarda en analytics_visitors.
 */
export function stableFingerprint(ip: string, ua: string): string {
  const secret = process.env.AUTH_SECRET ?? "lk-analytics";
  return createHash("sha256")
    .update(`${secret}:${ip}:${ua}`)
    .digest("hex")
    .slice(0, 32);
}

export type Geo = {
  country: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
};

function decodeCity(raw: string | null): string | null {
  if (!raw) return null;
  try {
    // Vercel codifica la ciudad (espacios → %20); si falla, se usa tal cual.
    return decodeURIComponent(raw) || null;
  } catch {
    return raw || null;
  }
}

function coord(raw: string | null, max: number): number | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
}

/**
 * Geolocalización gratuita de Vercel (edge geo): país + ciudad + lat/lng.
 * Null fuera de producción/Vercel (en local no llegan estas cabeceras).
 */
export function getGeo(h: HeaderGetter): Geo {
  return {
    country: getCountry(h),
    city: decodeCity(h.get("x-vercel-ip-city")),
    lat: coord(h.get("x-vercel-ip-latitude"), 90),
    lng: coord(h.get("x-vercel-ip-longitude"), 180),
  };
}
