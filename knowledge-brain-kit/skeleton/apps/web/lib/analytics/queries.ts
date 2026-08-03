import { analyticsDb, SESSIONS, PAGE_VIEWS, CONTACT_EVENTS, VISITORS } from "./db";
import { SECTION_LABEL, type Section } from "./sections";
import { centroidOf } from "./country-centroids";
import { countryName } from "./format";

export type Overview = {
  sessions: number;
  uniques: number;
  pageViews: number;
  avgSeconds: number | null;
};
export type SeriePunto = { day: string; views: number; uniques: number };
export type PaisConteo = { country: string; n: number };
export type SeccionTop = {
  section: Section;
  label: string;
  total: number;
  pages: { path: string; views: number }[];
  countries: PaisConteo[];
};
export type Referrer = { referrer: string; n: number };
export type SesionReciente = {
  country: string | null;
  ua: string | null;
  views: number;
  entryPath: string | null;
  label: string | null;
  startedAt: string | null;
};
export type ContactoEvento = {
  at: string | null;
  fromPath: string | null;
  country: string | null;
  name: string | null;
};
/** Punto en el mapa: ciudad (lat/lng real de Vercel) o país (centroide, aprox). */
export type GeoPoint = {
  id: string;
  lat: number;
  lng: number;
  count: number;
  label: string;
  kind: "city" | "country";
};
/** Visitante estable (clave persistente IP+UA) con su etiqueta editable. */
export type VisitorRow = {
  visitorKey: string;
  label: string | null;
  firstSeen: string | null;
  lastSeen: string | null;
  sessions: number;
  pageViews: number;
  countries: string[];
  lastCountry: string | null;
  lastCity: string | null;
  ua: string | null;
};

export type AnalyticsData = {
  overview: Overview;
  serie: SeriePunto[];
  secciones: SeccionTop[];
  paises: PaisConteo[];
  referrers: Referrer[];
  sesiones: SesionReciente[];
  contactos: ContactoEvento[];
  geoPoints: GeoPoint[];
  visitors: VisitorRow[];
  hayDatos: boolean;
};

const EMPTY: AnalyticsData = {
  overview: { sessions: 0, uniques: 0, pageViews: 0, avgSeconds: null },
  serie: [],
  secciones: [],
  paises: [],
  referrers: [],
  sesiones: [],
  contactos: [],
  geoPoints: [],
  visitors: [],
  hayDatos: false,
};

/** Todas las agregaciones de la ventana temporal, en paralelo. Degrada a
 *  estructura vacía (hayDatos:false) si Mongo no está disponible. */
export async function getAnalytics(days: number): Promise<AnalyticsData> {
  const since = new Date(Date.now() - days * 86_400_000);

  try {
    const db = await analyticsDb();
    const pv = db.collection(PAGE_VIEWS);
    const sess = db.collection(SESSIONS);

    const [
      ovArr,
      sessions,
      serie,
      secArr,
      paisArr,
      refArr,
      sesArr,
      contArr,
      cityGeoArr,
      countryGeoArr,
      visitorsArr,
    ] = await Promise.all([
        pv
          .aggregate([
            { $match: { at: { $gte: since } } },
            {
              $group: {
                _id: null,
                pageViews: { $sum: 1 },
                uniques: { $addToSet: "$fp" },
                avg: { $avg: "$timeOnPage" },
              },
            },
            {
              $project: {
                _id: 0,
                pageViews: 1,
                uniques: { $size: "$uniques" },
                avg: 1,
              },
            },
          ])
          .toArray(),
        sess.countDocuments({ lastActivityAt: { $gte: since } }),
        pv
          .aggregate([
            { $match: { at: { $gte: since } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$at" } },
                views: { $sum: 1 },
                uniques: { $addToSet: "$fp" },
              },
            },
            { $project: { _id: 0, day: "$_id", views: 1, uniques: { $size: "$uniques" } } },
            { $sort: { day: 1 } },
          ])
          .toArray(),
        pv
          .aggregate([
            { $match: { at: { $gte: since }, section: { $ne: "otros" } } },
            { $group: { _id: { section: "$section", path: "$path" }, views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            {
              $group: {
                _id: "$_id.section",
                total: { $sum: "$views" },
                pages: { $push: { path: "$_id.path", views: "$views" } },
              },
            },
            { $project: { _id: 0, section: "$_id", total: 1, pages: { $slice: ["$pages", 5] } } },
            { $sort: { total: -1 } },
          ])
          .toArray(),
        pv
          .aggregate([
            { $match: { at: { $gte: since }, country: { $ne: null }, section: { $ne: "otros" } } },
            { $group: { _id: { section: "$section", country: "$country" }, n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            {
              $group: {
                _id: "$_id.section",
                countries: { $push: { country: "$_id.country", n: "$n" } },
              },
            },
            { $project: { _id: 0, section: "$_id", countries: { $slice: ["$countries", 3] } } },
          ])
          .toArray(),
        pv
          .aggregate([
            // Ocultamos también los previews de Vercel ya guardados en histórico
            // (el filtro de escritura solo aplica a las visitas nuevas).
            { $match: { at: { $gte: since }, referrer: { $ne: null, $not: /vercel\.(app|com)/ } } },
            { $group: { _id: "$referrer", n: { $sum: 1 } } },
            { $sort: { n: -1 } },
            { $limit: 8 },
            { $project: { _id: 0, referrer: "$_id", n: 1 } },
          ])
          .toArray(),
        sess
          .find(
            { lastActivityAt: { $gte: since } },
            {
              sort: { lastActivityAt: -1 },
              limit: 12,
              projection: { country: 1, ua: 1, views: 1, entryPath: 1, label: 1, startedAt: 1, _id: 0 },
            },
          )
          .toArray(),
        db
          .collection(CONTACT_EVENTS)
          .find({ at: { $gte: since } }, { sort: { at: -1 }, limit: 10, projection: { _id: 0 } })
          .toArray(),
        // Puntos ciudad: page_views con lat/lng real (Vercel), agrupados por ciudad.
        pv
          .aggregate([
            { $match: { at: { $gte: since }, lat: { $ne: null }, lng: { $ne: null } } },
            {
              $group: {
                _id: { country: "$country", city: "$city" },
                lat: { $avg: "$lat" },
                lng: { $avg: "$lng" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 500 },
          ])
          .toArray(),
        // Puntos país: page_views SIN lat/lng (dato retroactivo) → centroide.
        pv
          .aggregate([
            { $match: { at: { $gte: since }, country: { $ne: null }, lat: null } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ])
          .toArray(),
        // Visitantes estables activos en la ventana (recientes primero).
        db
          .collection(VISITORS)
          .find(
            { lastSeen: { $gte: since } },
            {
              sort: { lastSeen: -1 },
              limit: 100,
              projection: {
                _id: 0,
                visitorKey: 1,
                label: 1,
                firstSeen: 1,
                lastSeen: 1,
                sessions: 1,
                pageViews: 1,
                countries: 1,
                // El hit route guarda country/city (último visto), no lastCountry/lastCity.
                country: 1,
                city: 1,
                ua: 1,
              },
            },
          )
          .toArray(),
      ]);

    // Paíes por sección → mapa para fusionar en las tarjetas de sección.
    const paisesPorSeccion = new Map<string, PaisConteo[]>();
    for (const row of paisArr as { section: string; countries: PaisConteo[] }[]) {
      paisesPorSeccion.set(row.section, row.countries);
    }

    const secciones: SeccionTop[] = (
      secArr as { section: Section; total: number; pages: { path: string; views: number }[] }[]
    ).map((s) => ({
      section: s.section,
      label: SECTION_LABEL[s.section] ?? s.section,
      total: s.total,
      pages: s.pages,
      countries: paisesPorSeccion.get(s.section) ?? [],
    }));

    // Top países global (agregando desde las secciones + otros).
    const paisesGlobal = await pv
      .aggregate([
        { $match: { at: { $gte: since }, country: { $ne: null } } },
        { $group: { _id: "$country", n: { $sum: 1 } } },
        { $sort: { n: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, country: "$_id", n: 1 } },
      ])
      .toArray();

    const ov = ovArr[0] as { pageViews?: number; uniques?: number; avg?: number } | undefined;
    const overview: Overview = {
      sessions,
      uniques: ov?.uniques ?? 0,
      pageViews: ov?.pageViews ?? 0,
      avgSeconds: ov?.avg != null ? Math.round(ov.avg) : null,
    };

    // Puntos ciudad (exactos) + puntos país (centroide) → un solo conjunto. Al
    // partir por presencia de lat/lng no hay doble conteo entre ambos.
    const cityPoints: GeoPoint[] = (
      cityGeoArr as { _id: { country: string | null; city: string | null }; lat: number; lng: number; count: number }[]
    ).map((r, i) => ({
      id: `city-${r._id.city ?? "?"}-${i}`,
      lat: r.lat,
      lng: r.lng,
      count: r.count,
      label: r._id.city
        ? `${r._id.city}${r._id.country ? `, ${countryName(r._id.country)}` : ""}`
        : r._id.country
          ? countryName(r._id.country)
          : "Ubicación",
      kind: "city" as const,
    }));
    const countryPoints: GeoPoint[] = (
      countryGeoArr as { _id: string; count: number }[]
    ).flatMap((r) => {
      const c = centroidOf(r._id);
      if (!c) return [];
      return [
        {
          id: `country-${r._id}`,
          lng: c[0],
          lat: c[1],
          count: r.count,
          label: countryName(r._id),
          kind: "country" as const,
        },
      ];
    });
    const geoPoints = [...cityPoints, ...countryPoints];

    const visitors: VisitorRow[] = (
      visitorsArr as Record<string, unknown>[]
    ).map((v) => ({
      visitorKey: String(v.visitorKey),
      label: (v.label as string | null) ?? null,
      firstSeen: v.firstSeen ? new Date(v.firstSeen as Date).toISOString() : null,
      lastSeen: v.lastSeen ? new Date(v.lastSeen as Date).toISOString() : null,
      sessions: (v.sessions as number) ?? 0,
      pageViews: (v.pageViews as number) ?? 0,
      countries: Array.isArray(v.countries) ? (v.countries as string[]) : [],
      lastCountry: (v.country as string | null) ?? null,
      lastCity: (v.city as string | null) ?? null,
      ua: (v.ua as string | null) ?? null,
    }));

    return {
      overview,
      serie: serie as SeriePunto[],
      secciones,
      paises: paisesGlobal as PaisConteo[],
      referrers: refArr as Referrer[],
      sesiones: sesArr as unknown as SesionReciente[],
      contactos: contArr as unknown as ContactoEvento[],
      geoPoints,
      visitors,
      hayDatos: overview.pageViews > 0,
    };
  } catch {
    return EMPTY;
  }
}
