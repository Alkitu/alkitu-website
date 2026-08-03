---
title: Estadísticas
aliases: [Admin, Dashboard, Panel, Analytics, Estadisticas]
tipo: page
nivel: hipónimo
dominio: [Meta]
hiperónimo: "[[🏠 Context — Índice]]"
campo-semántico: [admin, dashboard, estadísticas, analítica, visitantes, cms, mcp]
relacionado:
  - "[[Login.es]]"
  - "[[Blog.es]]"
  - "[[Wiki.es]]"
  - "[[Reviews.es]]"
  - "[[Casos.es]]"
  - "[[🔌 Connections]]"

titulo: "Estadísticas: Panel de [Concepto]"
metadescripcion: "Panel privado de administración de tuconcepto.com: estadísticas de visitantes y publicación de contenido."
slug: /admin                          # o /admin/estadisticas para la sub-vista de analítica
keyword-principal: ""                 # página privada, sin objetivo SEO
keywords-secundarias: []
tags: [admin, dashboard, analytics, cms]
intencion-busqueda: navegacional
og-image: ""
dominio-raiz: tuconcepto.com
subdominio: ""                        # apex + ruta (private); candidato a admin.tuconcepto.com
query-params: [rango, pagina, tipo]   # rango = ventana temporal; pagina = paginación tabla; tipo = filtro de entrada
canonical: https://tuconcepto.com/admin

# ── Capa 3: GEO ──
geo-preguntas: []
geo-respuesta-corta: ""
geo-entidades: ["[Concepto]"]
geo-datos-citables: []
geo-formato: []
schema-tipo: WebPage                   # noindex (robots.index = false)

# ── Capa 4: Sitemap técnico ──
prioridad: 0.0                         # fuera del sitemap (noindex)
frecuencia-cambio: weekly
idiomas: [es, en]
hreflang-alt: /en/admin

# ── Capa 5: Implementación (sincronía con el código) ──
estado-implementacion: construido
rutas-codigo:
  - "apps/web/app/(private)/admin/layout.tsx"                          # shell con sidebar (auth gate)
  - "apps/web/app/(private)/admin/page.tsx"                            # Resumen (inventario)
  - "apps/web/app/(private)/admin/analiticas/page.tsx"                 # Analíticas
  - "apps/web/app/(private)/admin/seo/page.tsx"                        # SEO·GEO (checklist de KPIs)
  - "apps/web/lib/seo/audit.ts"                                        # auditoría SEO/GEO en vivo (checks reales)
  - "apps/web/app/llms.txt/route.ts"                                  # índice llms.txt (route handler; SEO/GEO para agentes)
  - "apps/web/app/(private)/admin/_components/admin-nav.tsx"           # sidebar del panel (client, estado activo)
  - "apps/web/lib/analytics/fingerprint.ts"                           # fingerprint cookieless + geo + bots
  - "apps/web/lib/analytics/sections.ts"                              # ruta → sección canónica (ES/EN)
  - "apps/web/lib/analytics/db.ts"                                    # colecciones analytics_*
  - "apps/web/lib/analytics/queries.ts"                               # agregaciones del dashboard
  - "apps/web/lib/analytics/attribution.ts"                           # journey + origen del contacto
  - "apps/web/app/api/analytics/hit/route.ts"                         # registra sesión + page_view + visitante estable + geo
  - "apps/web/app/api/analytics/leave/route.ts"                       # tiempo en página (sendBeacon)
  - "apps/web/app/api/analytics/visitors/label/route.ts"             # renombrar visitante estable (solo admin)
  - "apps/web/app/(private)/admin/analiticas/_components/visitors-panel.tsx"  # tabla de visitantes + rename inline
  - "design-system/web/components/integrations/maps/analytics-map.tsx"  # mapamundi de visitas (ds:integrations/maps)
  - "apps/web/app/_components/visit-tracker.tsx"                      # tracker cliente (montado en [lang]/layout)
componentes:
  - "(app) admin-nav: sidebar propio (el ds:patterns/sidebar-app es full-height y choca con el site-header fijo)"
  - "(app) serie temporal con barras CSS (aún sin ds:primitives/chart)"
  - "(app) tablas HTML simples para sesiones/contactos/visitantes (aún sin ds:compositions/data-table)"
  - "ds:integrations/maps/analytics-map"   # mapamundi de visitas: MapWrapper + marcadores proporcionales + popup
  - "ds:primitives/card"               # candidato para las tarjetas de KPI
  - "ds:primitives/badge"              # estados de entrada (borrador/publicado) cuando llegue el mini-CMS
  - "ds:patterns/admin-page-header"    # cabecera de sección del admin
datos:
  - "`analytics_sessions` / `analytics_page_views`: analítica PROPIA (fingerprint diario para únicos/día + `visitorKey` estable para recurrentes). Visitas, únicos, tiempo, secciones, país + ciudad + lat/lng (geo-IP), referrers"
  - "`analytics_visitors`: visitante estable (clave persistente, SIN IP en claro) con `label` editable, firstSeen/lastSeen, sessions, pageViews, países"
  - "`analytics_contact_events`, atribución del contacto: desde qué página + journey de la sesión"
  - "`users` (Auth.js): nº de usuarios en el Resumen"
  - "content/**  (blog MDX, glosario JSON, reviews.ts, casos.ts: inventario real del admin)"
  - "Mensajes de contacto: se entregan por email vía Resend; el evento se persiste en analytics_contact_events"
fuentes:
  - "base de datos (auth + analítica propia)"
  - "Contenido en ficheros (content/**, reviews.ts, casos.ts): inventario real del admin"
depende-de:
  - "[[Login.es]]"                     # requiere sesión admin
---

# Estadísticas / Panel Admin: `/admin`

> [!definition] Propósito
> **Panel privado** (tras [[Login.es]]) desde el que se **opera la web**: ver las **estadísticas de visitantes** y **publicar todos los tipos de entrada** (mini-CMS). Idea clave: que un **agente/IA pueda publicar igual que un humano, vía MCP**. Es `noindex` y queda fuera del sitemap.

## Secciones

### 1 · Estadísticas de visitantes (analítica propia)
Analítica propia (`analytics_sessions` / `analytics_page_views`), **cookieless** y GDPR-friendly (fingerprint diario = hash de secreto+día+IP+UA, sin cookie ni id persistente). **No** servicio externo para los datos estratégicos. Para heatmaps/grabaciones se puede usar un servicio externo opcional gateado por env.

> [!warning] Mapa mundial + identificación de visitantes recurrentes
> 1. **Mapa mundial** (arriba del todo, `ds:integrations/maps/analytics-map`, tiles CARTO sin API key): un punto por ubicación escalado por nº de visitas. Usa **lat/lng de ciudad** cuando existe y, en su defecto, el **centroide del país**.
> 2. **Visitantes nombrables**: clave estable `visitorKey = hash(secreto+IP+UA)` (SIN la fecha → persiste entre días) en `analytics_visitors`, con `label` editable desde el panel (solo admin).
>
> **Matiz de privacidad (importante):** sigue siendo cookieless y **no se guarda la IP en claro**, pero un **identificador persistente ES dato personal (GDPR)**. Antes de publicar hay que **reflejarlo en la política de privacidad / base legal**.

- **KPIs** (tarjetas): sesiones totales, **visitantes únicos**, páginas vistas, **tiempo medio en página** (ventana filtrable por `?rango`).
- **Páginas top**: tabla `page_path` → nº de vistas.
- **Ubicación de visitas**: agregado por país/ubicación de sesión.
- **Fuentes / referrers**: de dónde llegan (campo `referrer`).
- **Sesiones recientes**: tabla con timestamp, user-agent, locale.
- **Serie temporal**: visitas por día (`ds:primitives/chart`).
- **Mensajes de contacto**: vista de los envíos de [[Contacto.es]] persistidos en `contact_submissions` (lista/tabla, con `ref` de procedencia).

### 2 · Mini-CMS: publicar entradas
Editor para **todos los tipos de entrada** del sitio: **blog** ([[Blog.es]]), **wiki/glosario** ([[Wiki.es]]), **review** ([[Reviews.es]]) y **caso de estudio** ([[Casos.es]]).

- Lista de entradas con estado (`badge`: borrador/publicado) y filtro por `?tipo`.
- Editor de entrada: campos comunes (título, slug, las 5 capas de frontmatter) + cuerpo.
- Acciones: crear · editar · publicar/despublicar · borrar.

### 3 · Publicar como MCP (idea)
Que el **agente/IA publique como si fuera un usuario más**: exponer las acciones del mini-CMS (crear/editar/publicar entrada) como **herramientas de un servidor MCP del sitio**, de modo que un asistente pueda redactar y publicar contenido directamente. Requiere un endpoint/contrato seguro y autenticado.

## Componentes

| Sección | Componente DS | Notas |
|---|---|---|
| Layout | `ds:patterns/sidebar-app` + `ds:patterns/admin-page-header` | navegación: Analítica · Contenido; header con acciones |
| KPIs | `ds:primitives/card` | tarjetas de métrica |
| Gráficos | `ds:primitives/chart` | series temporales de visitas |
| Tablas | `ds:compositions/data-table` | sesiones, páginas top, entradas; paginación `?pagina` |
| Estados | `ds:primitives/badge` | borrador/publicado |

> [!note] Responsividad y dispositivos
> Mobile-first pero **enfocado a desktop/tablet** (el trabajo de panel se hace en pantalla grande). En móvil: sidebar colapsa a drawer, tablas → tarjetas apiladas, charts simplificados.

## Notas SEO / privacidad
- `robots: { index: false }`. Fuera de `sitemap.xml` y `llms.txt`.
- Toda ruta `/admin/*` protegida por **middleware** + sesión (gate de admins). Analítica respeta **consentimiento de cookies (GDPR)**: el tracker público (`VisitTracker`) solo registra con consentimiento de categoría `analytics` y **excluye** las propias rutas `/admin`.

> [!note] Higiene de datos — reglas para que las métricas reflejen audiencia real y no ruido:
> - **Opt-out de tráfico propio**: `?notrack=1` marca el navegador (`localStorage`) y deja de contarse; `?notrack=0` revierte.
> - **Filtro de bots**: regex de UA (crawlers de IA, SEO, headless) + rechazo de peticiones sin `Accept-Language`.
> - **Fuentes**: se excluyen los previews de despliegue (navegación propia entre deploys).

## Decisiones de diseño
- **Analítica propia** (tablas `analytics_sessions` / `analytics_page_views`), **no externa**: control total y **GDPR-friendly**.
- **Mini-CMS**: publica los 4 tipos de entrada (blog / wiki / review / caso).
- **Mensajes de contacto** visibles en el panel desde `contact_submissions` (ver [[Contacto.es]]).
- La idea **"publicar como MCP"** se mantiene como objetivo (superficie aún por definir).

## Pendiente / Bloqueos
- **Set exacto de métricas**: núcleo (visitas, visitantes únicos, tiempo medio, páginas top, países, fuentes/referrers, sesiones recientes, mensajes de contacto). ¿Falta alguna conversión más?
- **"Publicar como MCP"**: ¿implica un **endpoint/servidor MCP del propio sitio** con herramientas? Definir superficie, auth (token de servicio) y permisos del agente.
- **Editor de entradas**: ¿**WYSIWYG** o **markdown** (con frontmatter de 5 capas)? ¿El contenido vive en `content/**` (ficheros) o en base de datos (tablas)?
- **Slug**: `/admin` (panel raíz) vs `/admin/estadisticas` (sub-vista). Subdominio `admin.` opcional.
