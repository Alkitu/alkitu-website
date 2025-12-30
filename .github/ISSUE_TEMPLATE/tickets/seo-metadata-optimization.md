# 🚀 Feature Request: Optimización SEO Metadata para Todas las Páginas

**Labels:** `feature`, `P1`, `seo`, `i18n`, `enhancement`

---

## 📖 User Story

**Como** visitante buscando servicios web en Google
**Quiero** encontrar páginas de Alkitu con títulos y descripciones atractivas en los resultados
**Para** poder entender rápidamente qué ofrece la empresa y hacer clic

**Escenario:** Usuario busca en Google
**Dado que** un usuario busca "desarrollo web Next.js España" en Google
**Cuando** aparece un resultado de Alkitu en la página de resultados
**Entonces** ve un título optimizado con keywords relevantes
**Y** una meta description clara y persuasiva (155-160 caracteres)
**Y** puede identificar rápidamente el valor que ofrece Alkitu

---

## 🎯 Contexto de Producto

### Problema que resuelve
- Actualmente las páginas tienen metadata genérica o incompleta
- No hay estrategia consistente de keywords por página
- Meta descriptions no optimizadas para CTR (Click Through Rate)
- Falta de Open Graph tags para compartir en redes sociales
- No hay optimización específica por locale (ES/EN)

### Impacto esperado
- **Usuarios afectados**: Todos los visitantes orgánicos (SEO)
- **Métricas**:
  - CTR en resultados de búsqueda: +15-25%
  - Posicionamiento en keywords objetivo: top 10
  - Tráfico orgánico: +30% en 3 meses
  - Compartidos en redes sociales: +40%
  - Tiempo en página mejorado (mejor match intención-contenido)

### Prioridad de negocio
🟠 **High (P1)** - Critical para visibilidad y adquisición orgánica de clientes

---

## ✅ Criterios de Aceptación

### Auditoría Inicial
- [ ] Documento de auditoría SEO creado con estado actual
- [ ] Lista de todas las páginas públicas del sitio
- [ ] Keywords research completado por página
- [ ] Competitor analysis de metadata (top 3 competidores)
- [ ] Identificación de gaps y oportunidades

### Metadata por Página

**Para cada página pública (`/[locale]/*`):**

- [ ] **Title tag** optimizado:
  - 50-60 caracteres incluyendo espacios
  - Keyword principal al inicio
  - Branding "| Alkitu" al final
  - Único por página (no duplicados)
  - Bilingüe (ES y EN)

- [ ] **Meta description** optimizada:
  - 155-160 caracteres
  - Keyword principal incluida naturalmente
  - Call to action o valor único
  - Única por página
  - Bilingüe (ES y EN)

- [ ] **Open Graph tags** (redes sociales):
  - `og:title`, `og:description`, `og:image`
  - `og:url`, `og:type`, `og:locale`
  - Imagen OG optimizada (1200x630px)

- [ ] **Twitter Card tags**:
  - `twitter:card`, `twitter:title`, `twitter:description`
  - `twitter:image`

- [ ] **Canonical URL** configurado
- [ ] **Robots meta tag** apropiado (index/noindex)

### Páginas Prioritarias (Fase 1)

1. **Homepage (`/[locale]`)**
   - Title: "Desarrollo Web Profesional Next.js React | Alkitu"
   - Description: "Agencia de desarrollo web especializada en Next.js, React y soluciones digitales modernas. Creamos experiencias web excepcionales."

2. **About (`/[locale]/about`)**
   - Title: "Sobre Nosotros - Equipo de Desarrollo Web | Alkitu"
   - Description: "Conoce al equipo detrás de Alkitu. Expertos en desarrollo web con pasión por crear soluciones digitales innovadoras y escalables."

3. **Projects (`/[locale]/projects`)**
   - Title: "Portfolio de Proyectos Web - Next.js React | Alkitu"
   - Description: "Explora nuestro portfolio de proyectos web. Aplicaciones modernas desarrolladas con Next.js, React y las últimas tecnologías."

4. **Contact (`/[locale]/contact`)**
   - Title: "Contacto - Solicita Presupuesto Web | Alkitu"
   - Description: "¿Tienes un proyecto web en mente? Contacta con Alkitu para una consulta gratuita. Respondemos en 24h."

5. **Services (`/[locale]/services/*`)** (cuando se creen)
   - Por cada servicio individual

### Implementación Técnica

- [ ] Metadata en `generateMetadata()` de cada página
- [ ] Traducciones en `en.json` y `es.json` bajo `metadata`
- [ ] Imágenes Open Graph generadas/optimizadas
- [ ] Verificación en Google Search Console
- [ ] Verificación en Facebook Sharing Debugger
- [ ] Verificación en Twitter Card Validator

### Testing

- [ ] Títulos únicos (sin duplicados)
- [ ] Longitudes correctas (no cortados en SERPs)
- [ ] Preview en Google SERP Simulator correcto
- [ ] Open Graph preview correcto (Facebook, LinkedIn)
- [ ] Twitter Card preview correcto
- [ ] Schema.org markup válido (validador oficial)
- [ ] No hay errores en Google Search Console

### Documentación

- [ ] Guía de SEO metadata en `docs/SEO_METADATA.md`
- [ ] Template de metadata para nuevas páginas
- [ ] Keyword research por página documentado
- [ ] Proceso de actualización documentado

---

## 🔧 Especificaciones Técnicas

### Estructura de Archivos

```
app/[lang]/
├── page.tsx                     (actualizar metadata)
├── about/
│   └── page.tsx                 (actualizar metadata)
├── projects/
│   ├── page.tsx                 (actualizar metadata)
│   └── [slug]/
│       └── page.tsx             (actualizar metadata dinámica)
├── contact/
│   └── page.tsx                 (actualizar metadata)
└── services/                    (cuando se cree)
    ├── page.tsx
    └── [service]/
        └── page.tsx

app/dictionaries/
├── en.json                      (agregar sección metadata)
└── es.json                      (agregar sección metadata)

public/
└── og/                          (nuevo - Open Graph images)
    ├── home-en.jpg
    ├── home-es.jpg
    ├── about-en.jpg
    └── ...

docs/
├── SEO_METADATA.md              (nuevo - guía)
└── SEO_KEYWORDS.md              (nuevo - keyword research)
```

### Implementación Next.js Metadata

**Ejemplo: Homepage**

```typescript
// app/[lang]/page.tsx
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const baseUrl = 'https://alkitu.com';
  const currentUrl = `${baseUrl}/${lang}`;

  return {
    title: dict.metadata.home.title,
    description: dict.metadata.home.description,
    keywords: dict.metadata.home.keywords,
    authors: [{ name: 'Alkitu' }],
    creator: 'Alkitu',
    publisher: 'Alkitu',
    alternates: {
      canonical: currentUrl,
      languages: {
        'es': `${baseUrl}/es`,
        'en': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: dict.metadata.home.ogTitle,
      description: dict.metadata.home.ogDescription,
      url: currentUrl,
      siteName: 'Alkitu',
      images: [
        {
          url: `${baseUrl}/og/home-${lang}.jpg`,
          width: 1200,
          height: 630,
          alt: dict.metadata.home.ogImageAlt,
        },
      ],
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.home.twitterTitle,
      description: dict.metadata.home.twitterDescription,
      images: [`${baseUrl}/og/home-${lang}.jpg`],
      creator: '@alkitu', // Actualizar con handle real
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Obtener de Search Console
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  // ... componente
}
```

### Estructura de Traducciones

```json
// app/dictionaries/es.json
{
  "metadata": {
    "home": {
      "title": "Desarrollo Web Profesional Next.js React | Alkitu",
      "description": "Agencia de desarrollo web especializada en Next.js, React y soluciones digitales modernas. Creamos experiencias web excepcionales. Consulta gratuita.",
      "keywords": ["desarrollo web", "Next.js", "React", "agencia web", "España", "aplicaciones web"],
      "ogTitle": "Alkitu - Desarrollo Web Profesional con Next.js",
      "ogDescription": "Transformamos ideas en experiencias web excepcionales. Especialistas en Next.js, React y tecnologías modernas.",
      "ogImageAlt": "Alkitu - Agencia de Desarrollo Web",
      "twitterTitle": "Alkitu - Desarrollo Web Next.js React",
      "twitterDescription": "Creamos aplicaciones web modernas y escalables con Next.js y React. Consulta gratuita disponible."
    },
    "about": {
      "title": "Sobre Nosotros - Equipo de Desarrollo Web | Alkitu",
      "description": "Conoce al equipo detrás de Alkitu. Expertos en desarrollo web con pasión por crear soluciones digitales innovadoras y escalables.",
      "keywords": ["equipo desarrollo", "sobre alkitu", "agencia web", "desarrolladores"],
      "ogTitle": "Conoce al Equipo de Alkitu",
      "ogDescription": "Profesionales apasionados por el desarrollo web moderno y las mejores prácticas.",
      "ogImageAlt": "Equipo Alkitu",
      "twitterTitle": "Sobre Alkitu - Equipo de Desarrollo Web",
      "twitterDescription": "Conoce a los desarrolladores detrás de proyectos web excepcionales."
    },
    "projects": {
      "title": "Portfolio de Proyectos Web - Next.js React | Alkitu",
      "description": "Explora nuestro portfolio de proyectos web. Aplicaciones modernas desarrolladas con Next.js, React y las últimas tecnologías.",
      "keywords": ["portfolio", "proyectos web", "casos de éxito", "Next.js projects"],
      "ogTitle": "Portfolio de Proyectos - Alkitu",
      "ogDescription": "Descubre los proyectos web que hemos creado para nuestros clientes.",
      "ogImageAlt": "Portfolio Alkitu",
      "twitterTitle": "Portfolio de Proyectos Web | Alkitu",
      "twitterDescription": "Aplicaciones web modernas desarrolladas con las últimas tecnologías."
    },
    "contact": {
      "title": "Contacto - Solicita Presupuesto Web | Alkitu",
      "description": "¿Tienes un proyecto web en mente? Contacta con Alkitu para una consulta gratuita. Respondemos en 24h.",
      "keywords": ["contacto", "presupuesto web", "consulta gratuita", "desarrollo web"],
      "ogTitle": "Contacta con Alkitu",
      "ogDescription": "Solicita una consulta gratuita para tu proyecto web. Te respondemos en 24 horas.",
      "ogImageAlt": "Contacto Alkitu",
      "twitterTitle": "Contacta con Alkitu | Consulta Gratuita",
      "twitterDescription": "¿Listo para iniciar tu proyecto web? Hablemos. Respuesta en 24h."
    }
  }
}
```

```json
// app/dictionaries/en.json
{
  "metadata": {
    "home": {
      "title": "Professional Web Development Next.js React | Alkitu",
      "description": "Web development agency specialized in Next.js, React and modern digital solutions. We create exceptional web experiences. Free consultation.",
      "keywords": ["web development", "Next.js", "React", "web agency", "Spain", "web applications"],
      "ogTitle": "Alkitu - Professional Web Development with Next.js",
      "ogDescription": "We transform ideas into exceptional web experiences. Specialists in Next.js, React and modern technologies.",
      "ogImageAlt": "Alkitu - Web Development Agency",
      "twitterTitle": "Alkitu - Web Development Next.js React",
      "twitterDescription": "We create modern and scalable web applications with Next.js and React. Free consultation available."
    },
    "about": {
      "title": "About Us - Web Development Team | Alkitu",
      "description": "Meet the team behind Alkitu. Web development experts passionate about creating innovative and scalable digital solutions.",
      "keywords": ["development team", "about alkitu", "web agency", "developers"],
      "ogTitle": "Meet the Alkitu Team",
      "ogDescription": "Professionals passionate about modern web development and best practices.",
      "ogImageAlt": "Alkitu Team",
      "twitterTitle": "About Alkitu - Web Development Team",
      "twitterDescription": "Meet the developers behind exceptional web projects."
    },
    "projects": {
      "title": "Web Projects Portfolio - Next.js React | Alkitu",
      "description": "Explore our web projects portfolio. Modern applications developed with Next.js, React and the latest technologies.",
      "keywords": ["portfolio", "web projects", "success cases", "Next.js projects"],
      "ogTitle": "Projects Portfolio - Alkitu",
      "ogDescription": "Discover the web projects we've created for our clients.",
      "ogImageAlt": "Alkitu Portfolio",
      "twitterTitle": "Web Projects Portfolio | Alkitu",
      "twitterDescription": "Modern web applications developed with the latest technologies."
    },
    "contact": {
      "title": "Contact - Request Web Quote | Alkitu",
      "description": "Have a web project in mind? Contact Alkitu for a free consultation. We respond within 24h.",
      "keywords": ["contact", "web quote", "free consultation", "web development"],
      "ogTitle": "Contact Alkitu",
      "ogDescription": "Request a free consultation for your web project. We respond within 24 hours.",
      "ogImageAlt": "Contact Alkitu",
      "twitterTitle": "Contact Alkitu | Free Consultation",
      "twitterDescription": "Ready to start your web project? Let's talk. Response in 24h."
    }
  }
}
```

### Generación de Imágenes Open Graph

**Opciones:**

1. **Diseño manual** (Figma/Canva):
   - Dimensiones: 1200x630px
   - Formato: JPG (optimizado <200KB)
   - Incluir: Logo, título de página, branding

2. **Generación dinámica** (OG Image API):
```typescript
// Usando @vercel/og
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(135deg, #00BB31 0%, #00701D 100%)',
          width: '100%',
          height: '100%',
          padding: '50px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>Alkitu - Desarrollo Web</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

### Keywords Research

**Primary Keywords por página:**

| Página | Primary Keyword ES | Primary Keyword EN | Monthly Searches |
|--------|-------------------|-------------------|------------------|
| Home | "desarrollo web next.js" | "next.js web development" | 500-1k |
| About | "agencia desarrollo web españa" | "web development agency spain" | 200-500 |
| Projects | "portfolio desarrollo web" | "web development portfolio" | 300-700 |
| Contact | "presupuesto desarrollo web" | "web development quote" | 400-800 |

**Herramientas para research:**
- Google Keyword Planner
- Ahrefs
- SEMrush
- Answer The Public

### Nuevas dependencias
- None (usa Next.js metadata API nativa)
- Opcional: `@vercel/og` para generación dinámica de imágenes

### Consideraciones
- **i18n**: Sí - Metadata completamente bilingüe
- **Analytics**: Sí - Trackear CTR desde Search Console
- **Database changes**: No
- **Performance**: OG images optimizadas (<200KB)
- **Testing**: Validators de Google, Facebook, Twitter

---

## 🔗 Tickets Relacionados

**Depende de:**
- Copy/contenido de las páginas debe estar finalizado

**Bloquea:**
- Lanzamiento público del sitio
- Campañas de marketing digital

**Relacionado con:**
- #[SEO Blog Guide] - Documentación SEO general
- #[Services Pages] - Metadata para páginas de servicios

---

## 📚 Proceso de Trabajo

### Fase 1: Auditoría y Research (2-3 horas)
1. Auditar metadata actual
2. Keyword research por página
3. Competitor analysis
4. Crear documento de estrategia

### Fase 2: Implementación (4-5 horas)
1. Actualizar estructura de dictionaries
2. Implementar generateMetadata() por página
3. Crear/optimizar imágenes OG
4. Verificar traducciones

### Fase 3: Testing (1-2 horas)
1. Validar con herramientas oficiales
2. Preview en diferentes plataformas
3. Verificar en Search Console
4. Ajustes finales

### Fase 4: Documentación (1 hora)
1. Crear guía SEO_METADATA.md
2. Documentar keywords research
3. Template para nuevas páginas

---

## ⏱️ Estimación

**Complejidad:** Media
**Esfuerzo estimado:** 8-10 horas

**Desglose:**
- Auditoría SEO + keyword research: 2-3h
- Implementación metadata (5 páginas): 3-4h
- Creación/optimización OG images: 1-2h
- Testing y validación: 1-2h
- Documentación: 1h

---

## 📊 KPIs de Éxito

**Métricas a monitorear:**
- CTR promedio en Search Console: objetivo >3%
- Impresiones en búsquedas: +30% en 3 meses
- Click en redes sociales: +40%
- Posiciones promedio: top 10 para keywords objetivo
- Tráfico orgánico: +25% en 3 meses

---

## 📚 Recursos

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google Search Console](https://search.google.com/search-console)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Schema.org Validator](https://validator.schema.org/)
- [Google SERP Simulator](https://www.highervisibility.com/seo/tools/serp-snippet-optimizer/)

---

## ✅ Checklist de Publicación

Antes de marcar el ticket como completado:

- [ ] Todas las páginas tienen metadata única
- [ ] Traducciones ES/EN completas
- [ ] Imágenes OG creadas y optimizadas
- [ ] Validación en Google/Facebook/Twitter exitosa
- [ ] No hay errores en Search Console
- [ ] Documentación creada en docs/
- [ ] Keywords research documentado
- [ ] Template para nuevas páginas creado
