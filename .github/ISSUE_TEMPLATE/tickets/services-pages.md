# 🚀 Feature Request: Páginas de Servicios - Showcase de Servicios de Alkitu

**Labels:** `feature`, `P1`, `services`, `i18n`, `seo`

---

## 📖 User Story

**Como** potencial cliente visitando el sitio
**Quiero** ver una descripción detallada de los servicios que ofrece Alkitu
**Para** entender si pueden ayudarme con mi proyecto web

**Escenario:** Usuario busca servicio específico
**Dado que** un potencial cliente necesita desarrollo web con Next.js
**Cuando** navega a la sección de servicios
**Entonces** ve una página principal con todos los servicios
**Y** puede hacer clic en cada servicio para ver detalles completos
**Y** cada servicio tiene descripción, beneficios, tecnologías, proceso y casos de uso
**Y** hay un claro call-to-action para contactar

---

## 🎯 Contexto de Producto

### Problema que resuelve
- Actualmente no hay página dedicada a explicar servicios
- Los clientes no saben qué ofrece exactamente Alkitu
- No hay diferenciación clara entre servicios
- Falta información sobre proceso de trabajo
- No hay CTA específico por servicio

### Impacto esperado
- **Usuarios afectados**: Todos los potenciales clientes
- **Métricas**:
  - Conversión de visitantes a leads: +40%
  - Tiempo en el sitio: +2 minutos
  - Tasa de rebote: -15%
  - Consultas cualificadas: +50%
  - Tráfico orgánico desde keywords de servicios: +60%

### Prioridad de negocio
🟠 **High (P1)** - Essential para comunicar propuesta de valor y generar leads cualificados

---

## ✅ Criterios de Aceptación

### Estructura de Páginas

**Página principal de servicios (`/[locale]/services`)**
- [ ] Hero section con título y descripción general
- [ ] Grid de servicios (cards clickeables)
- [ ] Cada card muestra: ícono, título, descripción corta, CTA
- [ ] Sección "¿Por qué Alkitu?" (diferenciadores)
- [ ] Sección de proceso de trabajo (4-5 pasos)
- [ ] CTA final para contacto
- [ ] Responsive design (mobile-first)

**Páginas individuales por servicio (`/[locale]/services/[slug]`)**
- [ ] Hero con título del servicio y tagline
- [ ] Descripción detallada del servicio
- [ ] Beneficios clave (3-5 bullet points)
- [ ] Stack tecnológico usado
- [ ] Proceso de trabajo específico
- [ ] Casos de uso / ejemplos
- [ ] Proyectos relacionados (si existen)
- [ ] Pricing indicativo (opcional)
- [ ] FAQ del servicio (3-5 preguntas)
- [ ] CTA destacado "Solicitar presupuesto"
- [ ] Navegación a otros servicios

### Servicios a Crear (MVP)

1. **Desarrollo Web con Next.js**
   - Slug: `nextjs-development`
   - Keywords: "desarrollo Next.js", "Next.js developer"
   - Stack: Next.js, React, TypeScript, Tailwind CSS

2. **Aplicaciones React**
   - Slug: `react-applications`
   - Keywords: "desarrollo React", "aplicaciones React"
   - Stack: React, TypeScript, Redux/Zustand

3. **Diseño UI/UX**
   - Slug: `ui-ux-design`
   - Keywords: "diseño UI/UX", "diseño web moderno"
   - Tools: Figma, Adobe XD, Framer

4. **Optimización y Performance**
   - Slug: `web-optimization`
   - Keywords: "optimización web", "performance web"
   - Focus: Core Web Vitals, SEO técnico

5. **Mantenimiento y Soporte**
   - Slug: `maintenance-support`
   - Keywords: "mantenimiento web", "soporte técnico"
   - SLA: Tiempos de respuesta, actualizaciones

### Contenido Bilingüe (i18n)
- [ ] Todas las páginas disponibles en ES y EN
- [ ] Traducciones en `en.json` y `es.json`
- [ ] Metadata SEO bilingüe por servicio
- [ ] URLs localizadas correctamente

### Componentes Reutilizables
- [ ] `ServiceCard` - Card de servicio en grid
- [ ] `ServiceHero` - Hero section de servicio
- [ ] `TechStack` - Visualización de tecnologías
- [ ] `ProcessSteps` - Pasos del proceso
- [ ] `ServiceFAQ` - FAQ accordion
- [ ] `RelatedServices` - Navegación a otros servicios

### SEO y Metadata
- [ ] Cada servicio tiene metadata única optimizada
- [ ] Schema.org markup para Service
- [ ] Open Graph images por servicio
- [ ] Internal linking entre servicios y proyectos
- [ ] Breadcrumbs navigation

### CTA y Conversión
- [ ] Botón "Solicitar presupuesto" destacado
- [ ] Formulario de contacto específico por servicio
- [ ] Opción de "Agendar llamada" (opcional)
- [ ] Lead magnet (ej: "Guía gratuita de Next.js")

### Analytics
- [ ] Tracking de vistas por servicio
- [ ] Tracking de clicks en CTAs
- [ ] Heatmaps (opcional, usando Hotjar/Clarity)
- [ ] Conversión de servicio → contacto

---

## 🔧 Especificaciones Técnicas

### Estructura de Archivos

```
app/[lang]/services/
├── page.tsx                     (nuevo - lista de servicios)
├── ServicesGrid.tsx             (nuevo - grid de cards)
├── ProcessSection.tsx           (nuevo - proceso de trabajo)
├── [slug]/
│   └── page.tsx                 (nuevo - detalle de servicio)

app/components/organisms/
├── service-hero/
│   └── ServiceHero.tsx          (nuevo)
├── tech-stack/
│   └── TechStack.tsx            (nuevo)
├── process-steps/
│   └── ProcessSteps.tsx         (nuevo)
└── service-faq/
    └── ServiceFAQ.tsx           (nuevo)

app/components/molecules/
└── service-card/
    └── ServiceCard.tsx          (nuevo)

lib/
└── services/
    ├── types.ts                 (nuevo - tipos)
    ├── data.ts                  (nuevo - datos de servicios)
    └── utils.ts                 (nuevo - utilidades)

app/dictionaries/
├── en.json                      (actualizar - servicios)
└── es.json                      (actualizar - servicios)

public/
├── services/                    (nuevo - imágenes)
│   ├── nextjs-dev.jpg
│   ├── react-apps.jpg
│   └── ...
└── og/                          (actualizar - OG images)
    ├── service-nextjs-es.jpg
    └── ...
```

### Tipos TypeScript

```typescript
// lib/services/types.ts
export interface Service {
  id: string;
  slug: string;
  icon: string; // Lucide icon name o path a SVG
  order: number;
  featured: boolean;
  content: {
    en: ServiceContent;
    es: ServiceContent;
  };
}

export interface ServiceContent {
  title: string;
  tagline: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  techStack: Technology[];
  process: ProcessStep[];
  useCases: UseCase[];
  faq: FAQ[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface Technology {
  name: string;
  icon?: string;
  description?: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

export interface UseCase {
  title: string;
  description: string;
  example?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
```

### Data de Servicios

```typescript
// lib/services/data.ts
import { Service } from './types';

export const services: Service[] = [
  {
    id: '1',
    slug: 'nextjs-development',
    icon: 'Code2',
    order: 1,
    featured: true,
    content: {
      es: {
        title: 'Desarrollo Web con Next.js',
        tagline: 'Aplicaciones web modernas, rápidas y escalables',
        description: 'Creamos aplicaciones web de alto rendimiento utilizando Next.js 16, la última versión del framework líder en desarrollo web. Aprovechamos Server Components, App Router y optimizaciones automáticas para entregar experiencias excepcionales.',
        shortDescription: 'Desarrollo de aplicaciones web modernas con Next.js, React y TypeScript.',
        benefits: [
          'Rendimiento excepcional con Core Web Vitals optimizados',
          'SEO nativo con Server-Side Rendering (SSR)',
          'Escalabilidad probada para millones de usuarios',
          'Implementación en Vercel Edge Network',
          'TypeScript para código robusto y mantenible',
        ],
        techStack: [
          { name: 'Next.js 16', icon: 'nextjs' },
          { name: 'React 19', icon: 'react' },
          { name: 'TypeScript', icon: 'typescript' },
          { name: 'Tailwind CSS', icon: 'tailwind' },
          { name: 'Vercel', icon: 'vercel' },
        ],
        process: [
          {
            number: 1,
            title: 'Análisis y Planificación',
            description: 'Definimos objetivos, arquitectura y stack tecnológico.',
            duration: '1-2 semanas',
          },
          {
            number: 2,
            title: 'Diseño y Prototipado',
            description: 'Creamos wireframes y diseños UI/UX en Figma.',
            duration: '2-3 semanas',
          },
          {
            number: 3,
            title: 'Desarrollo',
            description: 'Implementación con metodología ágil y sprints.',
            duration: '4-8 semanas',
          },
          {
            number: 4,
            title: 'Testing y QA',
            description: 'Pruebas exhaustivas de funcionalidad y rendimiento.',
            duration: '1-2 semanas',
          },
          {
            number: 5,
            title: 'Deploy y Soporte',
            description: 'Lanzamiento en Vercel y soporte post-lanzamiento.',
            duration: 'Continuo',
          },
        ],
        useCases: [
          {
            title: 'E-commerce',
            description: 'Tiendas online con carrito, checkout y gestión de inventario.',
            example: 'Ver proyecto: Fashion Store',
          },
          {
            title: 'SaaS Platforms',
            description: 'Aplicaciones web con dashboards complejos y autenticación.',
            example: 'Ver proyecto: Analytics Dashboard',
          },
          {
            title: 'Portfolios y Blogs',
            description: 'Sitios web corporativos optimizados para SEO.',
            example: 'Ver proyecto: Alkitu Website',
          },
        ],
        faq: [
          {
            question: '¿Por qué Next.js sobre otros frameworks?',
            answer: 'Next.js ofrece el mejor balance entre rendimiento, SEO y experiencia de desarrollo. Con Server Components, ISR y Edge Runtime, entregamos aplicaciones más rápidas que la competencia.',
          },
          {
            question: '¿Cuánto tiempo toma desarrollar una aplicación?',
            answer: 'Depende de la complejidad. Un MVP puede estar listo en 4-6 semanas, mientras que aplicaciones enterprise pueden tomar 3-6 meses.',
          },
          {
            question: '¿Incluyen diseño UI/UX?',
            answer: 'Sí, nuestros proyectos incluyen diseño completo en Figma antes de comenzar desarrollo.',
          },
        ],
        cta: {
          title: '¿Listo para tu proyecto Next.js?',
          description: 'Solicita una consulta gratuita y descubre cómo podemos ayudarte.',
          buttonText: 'Solicitar Presupuesto',
        },
      },
      en: {
        title: 'Next.js Web Development',
        tagline: 'Modern, fast and scalable web applications',
        description: 'We create high-performance web applications using Next.js 16, the latest version of the leading web development framework. We leverage Server Components, App Router and automatic optimizations to deliver exceptional experiences.',
        shortDescription: 'Development of modern web applications with Next.js, React and TypeScript.',
        benefits: [
          'Exceptional performance with optimized Core Web Vitals',
          'Native SEO with Server-Side Rendering (SSR)',
          'Proven scalability for millions of users',
          'Deployment on Vercel Edge Network',
          'TypeScript for robust and maintainable code',
        ],
        techStack: [
          { name: 'Next.js 16', icon: 'nextjs' },
          { name: 'React 19', icon: 'react' },
          { name: 'TypeScript', icon: 'typescript' },
          { name: 'Tailwind CSS', icon: 'tailwind' },
          { name: 'Vercel', icon: 'vercel' },
        ],
        process: [
          {
            number: 1,
            title: 'Analysis and Planning',
            description: 'We define objectives, architecture and technology stack.',
            duration: '1-2 weeks',
          },
          {
            number: 2,
            title: 'Design and Prototyping',
            description: 'We create wireframes and UI/UX designs in Figma.',
            duration: '2-3 weeks',
          },
          {
            number: 3,
            title: 'Development',
            description: 'Implementation with agile methodology and sprints.',
            duration: '4-8 weeks',
          },
          {
            number: 4,
            title: 'Testing and QA',
            description: 'Comprehensive functionality and performance testing.',
            duration: '1-2 weeks',
          },
          {
            number: 5,
            title: 'Deploy and Support',
            description: 'Launch on Vercel and post-launch support.',
            duration: 'Ongoing',
          },
        ],
        useCases: [
          {
            title: 'E-commerce',
            description: 'Online stores with cart, checkout and inventory management.',
            example: 'See project: Fashion Store',
          },
          {
            title: 'SaaS Platforms',
            description: 'Web applications with complex dashboards and authentication.',
            example: 'See project: Analytics Dashboard',
          },
          {
            title: 'Portfolios and Blogs',
            description: 'Corporate websites optimized for SEO.',
            example: 'See project: Alkitu Website',
          },
        ],
        faq: [
          {
            question: 'Why Next.js over other frameworks?',
            answer: 'Next.js offers the best balance between performance, SEO and developer experience. With Server Components, ISR and Edge Runtime, we deliver faster applications than the competition.',
          },
          {
            question: 'How long does it take to develop an application?',
            answer: 'It depends on complexity. An MVP can be ready in 4-6 weeks, while enterprise applications can take 3-6 months.',
          },
          {
            question: 'Do you include UI/UX design?',
            answer: 'Yes, our projects include complete design in Figma before starting development.',
          },
        ],
        cta: {
          title: 'Ready for your Next.js project?',
          description: 'Request a free consultation and discover how we can help you.',
          buttonText: 'Request Quote',
        },
      },
    },
  },
  // ... Repetir estructura para otros 4 servicios
];
```

### Página Principal - Services Grid

```typescript
// app/[lang]/services/page.tsx
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n.config';
import { services } from '@/lib/services/data';
import { ServicesGrid } from './ServicesGrid';
import { ProcessSection } from './ProcessSection';
import { TailwindGrid } from '@/app/components/templates/tailwind-grid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.metadata.services.title,
    description: dict.metadata.services.description,
    // ... resto de metadata
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <TailwindGrid>
      {/* Hero Section */}
      <section className="col-span-full py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            {dict.services.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {dict.services.hero.description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <ServicesGrid services={services} locale={lang} />

      {/* Process Section */}
      <ProcessSection locale={lang} />

      {/* CTA Section */}
      <section className="col-span-full bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {dict.services.cta.title}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {dict.services.cta.description}
          </p>
          <a
            href={`/${lang}/contact`}
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {dict.services.cta.button}
          </a>
        </div>
      </section>
    </TailwindGrid>
  );
}
```

### Página Individual de Servicio

```typescript
// app/[lang]/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Locale } from '@/i18n.config';
import { services } from '@/lib/services/data';
import { ServiceHero } from '@/app/components/organisms/service-hero';
import { TechStack } from '@/app/components/organisms/tech-stack';
import { ProcessSteps } from '@/app/components/organisms/process-steps';
import { ServiceFAQ } from '@/app/components/organisms/service-faq';

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) return {};

  const content = service.content[lang];

  return {
    title: `${content.title} | Alkitu`,
    description: content.description,
    // ... resto de metadata con OG images específicos
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const content = service.content[lang];

  return (
    <div>
      <ServiceHero
        title={content.title}
        tagline={content.tagline}
        description={content.description}
      />

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Beneficios Clave</h2>
          <ul className="space-y-4">
            {content.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckIcon className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack */}
      <TechStack technologies={content.techStack} />

      {/* Process */}
      <ProcessSteps steps={content.process} />

      {/* Use Cases */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Casos de Uso</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.useCases.map((useCase, index) => (
              <div key={index} className="bg-background p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                {useCase.example && (
                  <a href="#" className="text-primary hover:underline">
                    {useCase.example}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ServiceFAQ faqs={content.faq} />

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">{content.cta.title}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {content.cta.description}
          </p>
          <a
            href={`/${lang}/contact?service=${slug}`}
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {content.cta.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}
```

### Schema.org Markup

```typescript
// Agregar a generateMetadata()
export async function generateMetadata(): Promise<Metadata> {
  // ... metadata existente

  return {
    // ... metadata existente
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        'serviceType': content.title,
        'provider': {
          '@type': 'Organization',
          'name': 'Alkitu',
          'url': 'https://alkitu.com',
        },
        'areaServed': {
          '@type': 'Country',
          'name': 'Spain',
        },
        'description': content.description,
        'offers': {
          '@type': 'Offer',
          'availability': 'https://schema.org/InStock',
        },
      }),
    },
  };
}
```

### Nuevas dependencias
- `lucide-react` (para íconos, si no está instalado)
- Usar componentes existentes de shadcn/ui

### Consideraciones
- **i18n**: Sí - Todas las páginas completamente bilingües
- **Analytics**: Sí - Trackear vistas por servicio y conversiones
- **Database changes**: No - Contenido estático en código
- **SEO**: Critical - Cada servicio debe rankear para keywords objetivo
- **CMS**: Futuro - Considerar migrar a Supabase si se agregan muchos servicios

---

## 🎨 Diseño/Mockups

**Página principal:**
- Hero limpio con título y descripción
- Grid 2x3 de service cards (responsive a 1 columna en mobile)
- Cards con hover effect y elevación
- Iconos grandes y reconocibles

**Página individual:**
- Hero grande con imagen de fondo o gradient
- Secciones bien separadas con padding generoso
- Uso de colores primarios en CTAs
- Imágenes de ejemplo/proyectos relacionados

**Inspiración:**
- Vercel Services page
- Linear Features page
- Stripe Products page

---

## 🔗 Tickets Relacionados

**Depende de:**
- Copy de servicios debe estar definido

**Bloquea:**
- #[SEO Metadata] - Necesita páginas creadas primero

**Relacionado con:**
- Projects - Internal linking a proyectos relacionados
- Contact - Formulario con pre-selección de servicio

---

## ⏱️ Estimación

**Complejidad:** Alta
**Esfuerzo estimado:** 12-16 horas

**Desglose:**
- Definir estructura y tipos: 1h
- Crear data de 5 servicios (contenido bilingüe): 4-6h
- Implementar páginas (grid + individual): 4-5h
- Crear componentes (ServiceCard, Hero, etc.): 2-3h
- SEO metadata y schema markup: 1-2h
- Testing y ajustes: 1-2h

---

## 📚 Recursos

- [Schema.org Service](https://schema.org/Service)
- [Google Service Markup](https://developers.google.com/search/docs/appearance/structured-data/service)
- [Vercel Services](https://vercel.com/solutions) - Inspiración
- [Linear Features](https://linear.app/features) - Inspiración

---

## 🎯 Lista de Servicios (MVP)

**5 servicios iniciales:**

1. ✅ **Desarrollo Web con Next.js**
   - Landing pages, e-commerce, SaaS

2. ✅ **Aplicaciones React**
   - SPAs, dashboards, herramientas internas

3. ✅ **Diseño UI/UX**
   - Wireframes, prototipos, design systems

4. ✅ **Optimización y Performance**
   - Core Web Vitals, SEO técnico, accessibility

5. ✅ **Mantenimiento y Soporte**
   - Updates, monitoring, bug fixes, hosting

**Futuro (Fase 2):**
- Consultoría técnica
- Desarrollo móvil (React Native)
- Integraciones y APIs
- Training y workshops

---

## ✅ Checklist de Publicación

- [ ] Data de 5 servicios completa (ES + EN)
- [ ] Página principal (`/services`) implementada
- [ ] 5 páginas individuales funcionando
- [ ] Componentes reutilizables creados
- [ ] Metadata SEO por cada servicio
- [ ] Schema.org markup validado
- [ ] Imágenes OG generadas
- [ ] Internal linking configurado
- [ ] Analytics tracking implementado
- [ ] Mobile responsive verificado
- [ ] Testing en diferentes navegadores
- [ ] Traducciones revisadas por nativo
