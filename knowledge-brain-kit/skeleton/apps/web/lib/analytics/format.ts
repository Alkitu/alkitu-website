/** Helpers de presentación para la analítica (sin dependencias de Node). */

export function flag(cc: string | null): string {
  if (!cc || !/^[A-Za-z]{2}$/.test(cc)) return "🌐";
  return cc
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function countryName(cc: string | null): string {
  if (!cc) return "Desconocido";
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(cc.toUpperCase()) ?? cc;
  } catch {
    return cc;
  }
}

export function fmtSeconds(s: number | null): string {
  if (s == null) return "—";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}m ${r}s` : `${m}m`;
}

export function deviceFromUa(ua: string | null): string {
  if (!ua) return "—";
  if (/ipad|tablet/i.test(ua)) return "Tablet";
  if (/mobile|iphone|android/i.test(ua)) return "Móvil";
  return "Escritorio";
}

export function browserFromUa(ua: string | null): string {
  if (!ua) return "—";
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Otro";
}
