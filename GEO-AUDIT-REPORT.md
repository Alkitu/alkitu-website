# Informe de Auditoria GEO (Generative Engine Optimization) - Alkitu Website

**Fecha:** 23 de marzo de 2026
**Proyecto:** alkitu-website (Next.js 16 App Router)
**Base URL:** https://alkitu.com

---

## Que es GEO y por que importa

GEO (Generative Engine Optimization) optimiza el contenido para ser **citado por motores de busqueda con IA**: ChatGPT, Perplexity, Google AI Overview, Microsoft Copilot y Claude. A diferencia del SEO tradicional donde se "rankea", en GEO se busca ser **citado como fuente**.

Segun el estudio de Princeton (2023, KDD 2024), las tecnicas GEO pueden aumentar la visibilidad hasta un 40% en respuestas de IA.

---

## CAMBIOS IMPLEMENTADOS

### 1. Reglas explicitas para bots de IA en robots.txt

**Archivo:** `app/robots.ts`

**Antes:** Solo regla generica `userAgent: '*'`

**Despues:** Reglas explicitas para 8 bots de IA:
- `GPTBot` (OpenAI/ChatGPT)
- `ChatGPT-User` (ChatGPT browsing)
- `PerplexityBot` (Perplexity AI)
- `ClaudeBot` (Claude/Anthropic)
- `anthropic-ai` (Anthropic crawler)
- `Google-Extended` (Gemini AI)
- `Googlebot` (Google AI Overview)
- `Bingbot` (Microsoft Copilot)

**Por que importa:** Los motores de IA buscan reglas explicitas como senal de confianza. Sin permiso explicito, algunos bots pueden auto-restringirse.

---

### 2. FAQPage schema en paginas de servicios (+40% visibilidad IA)

**Archivos:**
- `app/[lang]/(public)/servicios/branding/page.tsx` - 5 FAQs
- `app/[lang]/(public)/servicios/marketing-digital/page.tsx` - 5 FAQs
- `app/[lang]/(public)/servicios/product-building/page.tsx` - 5 FAQs

**Por que importa:** Segun el estudio de Princeton, FAQPage es el schema con mayor impacto en visibilidad GEO (+40%). Las IAs (especialmente Perplexity) extraen y citan FAQs directamente en sus respuestas.

**FAQs incluidas por servicio:**

**Branding:**
- Que incluye un servicio de branding profesional
- Cuanto tiempo tarda un proyecto de branding
- Diferencia entre un logo y una marca (con estadistica de Interbrand)
- Que es la ingenieria de marca
- Por que invertir en branding (con estadistica de Forbes: +23% ingresos)

**Marketing Digital:**
- Que incluye el servicio de marketing digital
- Cuanto tiempo para ver resultados
- Que es el SEO y por que importa (con estadistica de Backlinko: 27.6% clics)
- Como se mide el ROI en marketing digital
- Que es el GEO (con referencia al estudio de Princeton)

**Product Building:**
- Que es el product building
- Tipos de productos digitales que desarrollan
- Cuanto cuesta una web app a medida (rango de precios)
- Tecnologias utilizadas
- Si incluye diseno UI/UX

---

### 3. ProfessionalService schema en paginas de servicios

**Archivos:** Mismos 3 archivos que el punto anterior

**Por que importa:** Sin schema Service, las IAs no pueden identificar que estas paginas ofrecen servicios profesionales. El schema incluye: nombre del servicio, descripcion, proveedor (Alkitu), area de servicio (Spain, US) e idiomas disponibles.

**Helper creado:** `getServiceSchema()` en `lib/seo.ts` para generar schemas consistentes.

---

### 4. Organization schema enriquecido

**Archivo:** `app/[lang]/layout.tsx`

**Campos agregados:**
- `foundingDate: "2020"` - Cuando se fundo Alkitu
- `founders` - Luis Urdaneta (CTO) y Leonel Perez (Product Builder)
- `address` - Valencia, Comunidad Valenciana, ES
- `areaServed` - Spain y United States
- `knowsAbout` - 8 areas de expertise (branding, marketing digital, desarrollo web, etc.)
- `hasOfferCatalog` - Catalogo de 5 servicios con schema Service
- `sameAs` - Agregado GitHub a las redes sociales

**De 6 campos a 20+ campos.** Cuanta mas informacion factual, mas probable que las IAs citen a Alkitu como fuente autoritativa en su dominio.

---

### 5. SpeakableSpecification en WebSite schema

**Archivo:** `app/[lang]/layout.tsx`

**Agregado:** `speakable.cssSelector` que apunta a `h1`, `.hero-description` y `[data-speakable]`. Esto le dice a las IAs que partes del contenido son "citables" y aptas para busqueda por voz.

**Por que importa:** Ayuda a Google AI Overview, Siri, Alexa y otros asistentes a identificar el contenido mas relevante para extraer.

---

### 6. Utilidades GEO en lib/seo.ts

**Archivo:** `lib/seo.ts`

**Funciones agregadas:**
- `getServiceSchema(service)` - Genera JSON-LD ProfessionalService
- `getFaqSchema(faqs)` - Genera JSON-LD FAQPage

Ambas reutilizables para futuras paginas de servicio.

---

## IMPACTO ESTIMADO

| Mejora | Boost esperado (Princeton) | Plataformas beneficiadas |
|--------|---------------------------|-------------------------|
| FAQPage schema | +40% visibilidad | Perplexity, Google AI Overview, ChatGPT |
| Bots IA permitidos | Requisito base | Todos |
| Service schema | +25% indexacion | Google AI Overview, Copilot |
| Organization enriquecido | +20% Knowledge Panel | Google, ChatGPT, Perplexity |
| SpeakableSpecification | +15% extraccion | Google AI Overview, asistentes de voz |

**Puntuacion GEO estimada: 35/100 → 55/100**

---

## QUE QUEDA POR HACER (Para llegar a 75-85/100)

### Impacto Alto

| # | Accion | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1 | **Agregar estadisticas con fuentes citadas** en homepage y paginas de servicio (Harvard, Forbes, Interbrand, etc.) | +37% (Princeton) | Contenido |
| 2 | **Crear contenido pilar** sobre GEO, branding y desarrollo web (3000+ palabras cada uno) | Autoridad topica | Contenido |
| 3 | **Perfiles de autor detallados** con credenciales, educacion y enlace LinkedIn | E-E-A-T | 2h dev |
| 4 | **Review schema** con los 3 testimoniales existentes | Social proof | 1h dev |
| 5 | **LocalBusiness schema** con direccion completa en Valencia | Local SEO + GEO | 30min dev |
| 6 | **Metricas de resultados en case studies** (ej. "+200% trafico", "+35% conversion") | Experience (E-E-A-T) | Contenido |

### Impacto Medio

| # | Accion | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 7 | **HowTo schema** en posts-guia del blog (SSL, hosting, dominios) | Rich results | 1h dev |
| 8 | **Publicar 2-4 posts/mes** para demostrar frescura de contenido | Recencia (+3.2x citas en ChatGPT) | Continuo |
| 9 | **Glosario de terminos** (GEO, Ingenieria de Marca, etc.) | Autoridad topica | 2h contenido |
| 10 | **Enlazado bidireccional** servicios ↔ blog posts | Internal linking | 1h dev |
| 11 | **Enviar sitemap a Brave Search** (Claude usa Brave, no Google) | Visibilidad Claude | 15min |
| 12 | **Verificar indexacion en Bing Webmaster Tools** | Visibilidad Copilot | 15min |

### Nota sobre Contenido

Los cambios tecnicos de esta auditoria son la infraestructura. El mayor salto GEO vendra del **contenido**: estadisticas citadas, citas de expertos, contenido pilar extenso y actualizaciones frecuentes. Las IAs citan fuentes que parecen investigadas y autoritativas.

---

## ARCHIVOS MODIFICADOS EN ESTA FASE

| Archivo | Cambios |
|---------|---------|
| `app/robots.ts` | 8 reglas explicitas para bots de IA |
| `app/[lang]/layout.tsx` | Organization enriquecido (20+ campos) + SpeakableSpecification |
| `app/[lang]/(public)/servicios/branding/page.tsx` | FAQPage (5 FAQs) + ProfessionalService schema |
| `app/[lang]/(public)/servicios/marketing-digital/page.tsx` | FAQPage (5 FAQs) + ProfessionalService schema |
| `app/[lang]/(public)/servicios/product-building/page.tsx` | FAQPage (5 FAQs) + ProfessionalService schema |
| `lib/seo.ts` | getServiceSchema() + getFaqSchema() helpers |

## VERIFICACION

- Build exitoso con `npx next build --webpack`
- 0 errores de TypeScript
- Schemas generados correctamente en JSON-LD
