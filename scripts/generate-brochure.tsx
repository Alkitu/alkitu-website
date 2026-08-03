/**
 * Generates the Alkitu corporate brochure as a printable A4 PDF.
 *
 * Usage:
 *   npm run generate:brochure
 *
 * Output: export/alkitu-brochure-es.pdf
 *
 * The brochure is intentionally self-contained: no Supabase, no network
 * fetches, all copy and assets live inside this file (or alongside it in
 * `/public`) so the PDF is reproducible and version-controllable.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import {
  Document,
  Page,
  StyleSheet,
  Svg,
  Path,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';

// ── Brand tokens ──────────────────────────────────────────────────────

const BRAND = {
  primary: '#00BB31',
  primaryDark: '#00701D',
  bg: '#0A0A0A',
  surface: '#18181B',
  surfaceHi: '#1F1F23',
  border: '#2A2A30',
  text: '#FFFFFF',
  muted: 'rgba(255,255,255,0.65)',
  mutedSoft: 'rgba(255,255,255,0.45)',
  accent: '#FFFFFF',
};

// A4 vertical at 72dpi: 595 × 842 pt
const PAGE = { width: 595, height: 842 };
const PAD_X = 54;
const PAD_Y = 54;

// ── Shared styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: BRAND.bg,
    color: BRAND.text,
    paddingTop: PAD_Y,
    paddingBottom: PAD_Y,
    paddingHorizontal: PAD_X,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  headerEyebrow: {
    fontSize: 9,
    letterSpacing: 1.2,
    color: BRAND.primary,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  pageNumber: {
    fontSize: 9,
    color: BRAND.mutedSoft,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: PAD_X,
    right: PAD_X,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    color: BRAND.mutedSoft,
    letterSpacing: 0.6,
  },
  h1: {
    fontSize: 38,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.1,
    marginBottom: 14,
  },
  h2: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.15,
    marginBottom: 10,
  },
  h3: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.4,
    color: BRAND.primary,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 10.5,
    color: BRAND.muted,
    lineHeight: 1.55,
    marginBottom: 6,
  },
  bodyHi: {
    fontSize: 11,
    color: BRAND.text,
    lineHeight: 1.55,
  },
  small: {
    fontSize: 9,
    color: BRAND.mutedSoft,
    lineHeight: 1.4,
  },
  card: {
    backgroundColor: BRAND.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderStyle: 'solid',
    padding: 18,
    marginBottom: 10,
  },
  hr: {
    height: 1,
    backgroundColor: BRAND.border,
    marginVertical: 18,
  },
  primaryDot: {
    color: BRAND.primary,
    fontFamily: 'Helvetica-Bold',
  },
});

// ── Logo (Alkitu wordmark, white-on-dark) ─────────────────────────────

function AlkituWordmark({ width = 160, accent = BRAND.text }: { width?: number; accent?: string }) {
  // viewBox is 488×91 (width / 5.36 ≈ height)
  const height = (width / 488) * 91;
  return (
    <Svg width={width} height={height} viewBox="0 0 488 91">
      <Path
        d="M248.956 0.0703125C256.295 0.309153 265.819 0.257488 273.094 0.0864267C262.192 12.9612 248.181 26.7268 236.647 39.5758C238.536 42.2128 241.329 45.421 243.417 48.0579L257.257 65.6708C263.257 73.4235 269.299 81.1438 275.389 88.8287C267.023 88.8223 258.657 88.8674 250.295 88.9642C248.659 87.0987 247.032 85.146 245.518 83.1837C237.958 73.3815 229.715 63.7892 222.425 53.8063C218.592 58.1086 214.491 62.227 210.598 66.5132L210.65 88.8835L189.164 88.8997L189.206 0.0799653C196.338 0.173565 203.471 0.189714 210.603 0.131618C210.683 13.6616 210.693 27.1916 210.633 40.7216C223.521 27.5434 235.94 13.1355 248.956 0.0703125Z"
        fill={accent}
      />
      <Path
        d="M405.651 0.0546875C412.732 0.135377 419.81 0.161194 426.891 0.132146C426.643 11.5255 426.856 22.9673 426.833 34.4219C426.801 50.2209 423.761 72.3912 446.318 72.4331C468.785 72.4751 466.045 52.0478 466.032 36.0196L466.019 0.125685C473.058 0.228967 480.097 0.228967 487.133 0.125685C487.266 5.52865 487.13 11.5901 487.114 17.0414C487.13 28.5284 487.175 40.0734 487.108 51.5507C487.043 62.1178 483.951 73.0754 476.04 80.5021C467.161 88.8324 455.955 90.7367 444.207 90.372C432.93 90.0266 422.702 86.7991 414.878 78.275C410.873 73.8274 408.068 68.4277 406.739 62.5922C404.841 54.3684 405.48 39.5344 405.473 30.5101C405.467 20.8629 405.257 9.60186 405.651 0.0546875Z"
        fill={accent}
      />
      <Path
        d="M316.791 0.0859375L395.385 0.224741L395.359 17.176C385.861 17.2664 376.172 17.0727 366.734 17.2889L366.837 59.9672L366.912 88.8153L345.387 88.8831C345.177 79.7426 345.336 70.0114 345.326 60.8354C345.255 46.2855 345.278 31.7323 345.391 17.1824C335.847 17.1049 326.209 17.3858 316.672 17.2147C316.798 11.5535 316.691 5.78584 316.791 0.0859375Z"
        fill={accent}
      />
      <Path
        d="M111.299 0.122787C118.399 0.161518 125.498 0.151846 132.597 0.09375L132.676 71.7105C146.339 72.3431 163.792 71.7557 177.834 71.8396C177.774 77.5169 177.779 83.1942 177.849 88.8683C155.649 88.7327 133.449 88.7586 111.25 88.9458L111.299 0.122787Z"
        fill={accent}
      />
      <Path
        d="M283.88 0.09375C290.906 0.248674 298.291 0.126035 305.343 0.103442L305.369 88.8392C298.204 88.7682 291.036 88.7779 283.867 88.8651L283.88 0.09375Z"
        fill={accent}
      />
      <Path
        d="M96.7282 75.7789C98.7615 80.1068 100.76 84.4688 102.657 88.7847L47.3936 88.8086C46.751 86.7269 44.831 82.6469 43.9102 80.5264C43.2172 78.9311 42.5295 77.3339 41.8477 75.7344L96.7282 75.7789Z"
        fill={BRAND.primary}
      />
      <Path
        d="M39.8555 0C46.9389 0.300165 54.7589 0.090209 61.9453 0.170898C72.7656 22.0634 81.9963 45.1828 92.6445 67.2012C93.214 68.3791 93.7834 69.5641 94.3525 70.7539H71.7842C64.5791 70.6925 51.7954 70.5913 41.9697 70.5684L49.2783 54.2578C54.5915 54.2691 60.4351 54.2743 65.1152 54.2646L61.2236 45.0244C57.8561 36.8684 54.5973 28.587 50.7988 20.6279C50.1265 22.6289 49.0364 25.0595 48.207 27.041C37.1978 52.1267 32.4209 63.555 21.9971 88.8359L0 88.8711C5.63044 74.928 13.5993 58.4802 19.8613 44.5371C26.1934 30.436 33.1507 13.7106 39.8555 0Z"
        fill={accent}
      />
    </Svg>
  );
}

function PageHeader({ eyebrow, pageNum, total }: { eyebrow: string; pageNum: number; total: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerEyebrow}>{eyebrow}</Text>
      <Text style={styles.pageNumber}>
        {String(pageNum).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </Text>
    </View>
  );
}

function PageFooter({ left = 'alkitu.com', right = 'info@alkitu.com' }: { left?: string; right?: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{left}</Text>
      <Text>{right}</Text>
    </View>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────

const TOTAL_PAGES = 7;

function CoverPage() {
  return (
    <Page size="A4" style={[styles.page, { paddingTop: 0, paddingBottom: 0 }]}>
      {/* Top bar with logo */}
      <View
        style={{
          paddingTop: PAD_Y,
          paddingHorizontal: PAD_X,
        }}
      >
        <AlkituWordmark width={140} accent={BRAND.text} />
      </View>

      {/* Big claim */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: PAD_X,
          justifyContent: 'center',
        }}
      >
        <Text style={[styles.eyebrow, { marginBottom: 14 }]}>
          Brochure 2026
        </Text>
        <Text
          style={{
            fontSize: 56,
            fontFamily: 'Helvetica-Bold',
            lineHeight: 1.05,
            marginBottom: 22,
          }}
        >
          Construimos{'\n'}
          <Text style={{ color: BRAND.primary }}>marcas y productos digitales</Text>
          {'\n'}que venden.
        </Text>
        <Text style={[styles.bodyHi, { maxWidth: 380, marginBottom: 30 }]}>
          Branding, marketing digital y product building con metodología propia
          y más de 100 proyectos entregados.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 24,
            marginTop: 12,
          }}
        >
          <Stat value="+100" label="Proyectos entregados" />
          <Stat value="10 años" label="De experiencia" />
          <Stat value="ES + USA" label="Mercados activos" />
        </View>
      </View>

      {/* Bottom strip */}
      <View
        style={{
          backgroundColor: BRAND.primary,
          paddingVertical: 22,
          paddingHorizontal: PAD_X,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#0A0A0A',
            fontFamily: 'Helvetica-Bold',
            fontSize: 12,
            letterSpacing: 1.2,
          }}
        >
          ALKITU.COM
        </Text>
        <Text
          style={{
            color: '#0A0A0A',
            fontFamily: 'Helvetica-Bold',
            fontSize: 12,
            letterSpacing: 1.2,
          }}
        >
          INFO@ALKITU.COM
        </Text>
      </View>
    </Page>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View>
      <Text style={{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: BRAND.primary }}>
        {value}
      </Text>
      <Text style={{ fontSize: 8, color: BRAND.mutedSoft, marginTop: 4, letterSpacing: 0.6 }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function AboutPage() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Quiénes somos" pageNum={2} total={TOTAL_PAGES} />

      <Text style={styles.eyebrow}>Sobre Alkitu</Text>
      <Text style={styles.h1}>
        Una agencia con{'\n'}
        <Text style={{ color: BRAND.primary }}>cabeza de ingeniería</Text>
        {'\n'}y ojo de diseño.
      </Text>

      <Text style={[styles.body, { marginTop: 6 }]}>
        Somos un estudio digital con sede en Valencia. Llevamos una década
        ayudando a empresas, autónomos y proyectos en crecimiento a construir
        marcas memorables y productos digitales que cumplen objetivos reales
        de negocio. Trabajamos con metodología propia, estándares
        internacionales y un equipo cercano que se mete en tu proyecto como si
        fuera suyo.
      </Text>

      <View style={styles.hr} />

      <Text style={styles.h3}>Equipo fundador</Text>
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <Text style={[styles.h3, { marginBottom: 2 }]}>Luis Urdaneta</Text>
          <Text style={[styles.small, { color: BRAND.primary, marginBottom: 6 }]}>
            FUNDADOR · CTO
          </Text>
          <Text style={styles.body}>
            Más de 12 años de experiencia construyendo software a medida.
            Lidera la dirección técnica y la arquitectura de los proyectos.
          </Text>
        </View>
        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <Text style={[styles.h3, { marginBottom: 2 }]}>Leonel Pérez</Text>
          <Text style={[styles.small, { color: BRAND.primary, marginBottom: 6 }]}>
            COFUNDADOR · PRODUCT BUILDER
          </Text>
          <Text style={styles.body}>
            Diseño de producto, branding y estrategia digital. Conecta
            negocio, diseño y desarrollo para entregar productos coherentes.
          </Text>
        </View>
      </View>

      <View style={styles.hr} />

      <Text style={styles.h3}>Por qué nos eligen</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
        {[
          {
            t: 'Metodología propia',
            d: 'Ingeniería de Marca: 4 pilares (ADN, Verbal, Visual, Espacial) inspirados en la norma ISO 20671.',
          },
          {
            t: 'Google Partner',
            d: 'Certificación oficial de Google. Nuestras campañas y webs se construyen con sus estándares.',
          },
          {
            t: 'Trato directo',
            d: 'Hablas con la persona que diseña y construye tu proyecto. Sin call-centers ni intermediarios.',
          },
          {
            t: 'Plazos reales',
            d: 'Si nos comprometemos a entregar en X días, lo hacemos. Y si nos retrasamos, lo asumimos.',
          },
        ].map((item, i) => (
          <View
            key={i}
            style={[styles.card, { width: (PAGE.width - PAD_X * 2 - 12) / 2, marginBottom: 0 }]}
          >
            <Text style={styles.h3}>{item.t}</Text>
            <Text style={styles.body}>{item.d}</Text>
          </View>
        ))}
      </View>

      <PageFooter />
    </Page>
  );
}

function ServicesIntroBlock({
  number,
  title,
  description,
  bullets,
}: {
  number: string;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <View style={[styles.card, { marginBottom: 14 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 }}>
        <Text
          style={{
            color: BRAND.primary,
            fontFamily: 'Helvetica-Bold',
            fontSize: 11,
            letterSpacing: 1,
            width: 28,
          }}
        >
          {number}
        </Text>
        <Text style={[styles.h3, { marginBottom: 0 }]}>{title}</Text>
      </View>
      <Text style={[styles.body, { marginBottom: 8 }]}>{description}</Text>
      {bullets.map((b, i) => (
        <View key={i} style={{ flexDirection: 'row', marginBottom: 3 }}>
          <Text style={[styles.primaryDot, { width: 12, fontSize: 11 }]}>•</Text>
          <Text style={[styles.body, { flex: 1, marginBottom: 0 }]}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

function ServicesPage1() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Servicios · 1 de 2" pageNum={3} total={TOTAL_PAGES} />

      <Text style={styles.eyebrow}>Qué hacemos</Text>
      <Text style={styles.h1}>
        Servicios pensados{'\n'}para <Text style={{ color: BRAND.primary }}>crecer</Text>.
      </Text>

      <Text style={[styles.body, { marginBottom: 18 }]}>
        Cubrimos el ciclo completo de marca y producto digital. Puedes contratar
        un servicio aislado o un programa completo según la fase en la que esté
        tu negocio.
      </Text>

      <ServicesIntroBlock
        number="01"
        title="Branding"
        description="Diseñamos marcas con metodología, fundamento y sistema. Más allá del logo: ADN de marca, identidad verbal, visual y espacial."
        bullets={[
          'Naming, logotipo y sistema de identidad visual completo',
          'Manuales de marca y guías de uso',
          'Ingeniería de Marca inspirada en la norma ISO 20671',
          'Aplicaciones offline y online (papelería, web, señalética)',
        ]}
      />

      <ServicesIntroBlock
        number="02"
        title="Marketing Digital"
        description="Motor de crecimiento medible basado en el ciclo See-Think-Do-Care de Google. Atraemos, convertimos y fidelizamos."
        bullets={[
          'SEO técnico y de contenidos · GEO para motores generativos',
          'Google Ads y Meta Ads (somos Google Partner)',
          'Email marketing y automatizaciones',
          'Analítica con dashboards en tiempo real',
        ]}
      />

      <PageFooter />
    </Page>
  );
}

function ServicesPage2() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Servicios · 2 de 2" pageNum={4} total={TOTAL_PAGES} />

      <ServicesIntroBlock
        number="03"
        title="Product Building"
        description="Diseñamos y desarrollamos productos digitales completos: web apps, apps iOS nativas, apps híbridas, prototipos funcionales y design systems."
        bullets={[
          'Sistemas de gestión empresarial (ERP, CRM, dashboards)',
          'E-commerce avanzado y marketplaces',
          'Aplicaciones iOS / Android nativas e híbridas',
          'UI/UX design y design systems escalables',
        ]}
      />

      <ServicesIntroBlock
        number="04"
        title="Webs Corporativas"
        description="Webs a medida para autónomos, pymes y proyectos en crecimiento. Desde 500 € hasta proyectos enterprise. Hosting y dominio incluidos."
        bullets={[
          'Diseño 100% personalizado, no plantillas',
          'Optimizadas para móvil, SEO y velocidad',
          'Entrega en 20 días hábiles',
          '3 rondas de revisiones incluidas',
        ]}
      />

      <ServicesIntroBlock
        number="05"
        title="Ingeniería de Marca"
        description="Programa completo: combinamos branding, marketing y producto en una metodología única para empresas que necesitan posicionarse desde cero o relanzarse."
        bullets={[
          'Auditoría de marca y diagnóstico estratégico',
          'Plan de identidad y posicionamiento',
          'Ejecución coordinada en branding + web + marketing',
          'Medición de valor de marca según ISO 20671',
        ]}
      />

      <PageFooter />
    </Page>
  );
}

function ProcessPage() {
  const steps = [
    {
      n: '01',
      t: 'Briefing',
      d: 'Sesión inicial de 30-60 minutos. Entendemos negocio, cliente, competencia y objetivos. Sin compromiso.',
    },
    {
      n: '02',
      t: 'Estrategia y diseño',
      d: 'Te presentamos un plan concreto con entregables, plazos y precio cerrado. Iteramos hasta que el diseño encaja.',
    },
    {
      n: '03',
      t: 'Producción',
      d: 'Ejecutamos con código limpio, SEO técnico y estándares de accesibilidad. Mantenemos un canal directo de comunicación.',
    },
    {
      n: '04',
      t: 'Lanzamiento',
      d: 'Subimos a producción, te formamos en el panel y entregamos credenciales. Soporte post-lanzamiento incluido.',
    },
    {
      n: '05',
      t: 'Crecimiento',
      d: 'Mantenimiento, evolución y campañas opcionales para que el proyecto siga generando resultados.',
    },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Cómo trabajamos" pageNum={5} total={TOTAL_PAGES} />

      <Text style={styles.eyebrow}>Proceso</Text>
      <Text style={styles.h1}>
        Un proceso claro,{'\n'}
        <Text style={{ color: BRAND.primary }}>sin sorpresas.</Text>
      </Text>

      <Text style={[styles.body, { marginBottom: 22 }]}>
        Cada proyecto pasa por las mismas cinco fases. Ese es nuestro compromiso
        para que sepas exactamente en qué momento estás y qué viene a
        continuación.
      </Text>

      {steps.map((step, i) => (
        <View
          key={step.n}
          style={{
            flexDirection: 'row',
            marginBottom: 14,
            paddingBottom: i === steps.length - 1 ? 0 : 14,
            borderBottomWidth: i === steps.length - 1 ? 0 : 1,
            borderBottomColor: BRAND.border,
            borderBottomStyle: 'solid',
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: BRAND.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 18,
            }}
          >
            <Text style={{ color: '#0A0A0A', fontSize: 16, fontFamily: 'Helvetica-Bold' }}>
              {step.n}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.h3, { marginBottom: 4 }]}>{step.t}</Text>
            <Text style={styles.body}>{step.d}</Text>
          </View>
        </View>
      ))}

      <PageFooter />
    </Page>
  );
}

function ProjectsPage() {
  const projects = [
    { name: 'Helayor', sector: 'E-commerce · Personalización', desc: 'Plataforma de e-commerce con personalización de productos en tiempo real.' },
    { name: 'Funda Manía', sector: 'E-commerce · Retail', desc: 'Tienda online con gestión completa de catálogo, pedidos y atención al cliente.' },
    { name: 'Eleale', sector: 'Servicios · Limpieza profesional', desc: 'Web corporativa multilingüe con captación de leads y diferenciación de servicios.' },
    { name: 'Tangle', sector: 'Producto · Social Network', desc: 'Identidad de marca y desarrollo de la primera red social centrada en interacciones reales.' },
    { name: 'Big Menu', sector: 'Producto · Hostelería', desc: 'App para gestionar negocios de hostelería y digitalizar la carta del restaurante.' },
    { name: 'Top Top', sector: 'Producto · Marketplace', desc: 'Marketplace de hostelería con descubrimiento por geolocalización y reservas.' },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Trabajos destacados" pageNum={6} total={TOTAL_PAGES} />

      <Text style={styles.eyebrow}>Proyectos</Text>
      <Text style={styles.h1}>
        Algunos de los{'\n'}
        <Text style={{ color: BRAND.primary }}>proyectos</Text> que hemos construido.
      </Text>

      <Text style={[styles.body, { marginBottom: 18 }]}>
        Más de 100 proyectos entregados en hostelería, salud, e-commerce,
        servicios profesionales, formación y software a medida.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {projects.map((p, i) => (
          <View
            key={i}
            style={[
              styles.card,
              { width: (PAGE.width - PAD_X * 2 - 12) / 2, marginBottom: 0, padding: 16 },
            ]}
          >
            <Text style={[styles.small, { color: BRAND.primary, marginBottom: 4, letterSpacing: 1 }]}>
              {String(i + 1).padStart(2, '0')}
            </Text>
            <Text style={[styles.h3, { marginBottom: 2 }]}>{p.name}</Text>
            <Text style={[styles.small, { color: BRAND.mutedSoft, marginBottom: 8 }]}>
              {p.sector.toUpperCase()}
            </Text>
            <Text style={[styles.body, { marginBottom: 0 }]}>{p.desc}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 22 }}>
        <Text style={[styles.small, { color: BRAND.mutedSoft }]}>
          Ver portfolio completo en alkitu.com/proyectos
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
}

function ContactPage() {
  return (
    <Page size="A4" style={styles.page}>
      <PageHeader eyebrow="Contacto" pageNum={7} total={TOTAL_PAGES} />

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.eyebrow}>Hablemos</Text>
        <Text style={[styles.h1, { fontSize: 44 }]}>
          ¿Listo para tu{'\n'}
          <Text style={{ color: BRAND.primary }}>siguiente proyecto?</Text>
        </Text>

        <Text style={[styles.bodyHi, { marginTop: 4, marginBottom: 28, maxWidth: 380 }]}>
          Te respondemos en menos de 24 horas con un plan claro: qué se puede
          hacer, cuánto cuesta y en qué plazo.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 26 }}>
          <ContactCard label="Web" value="alkitu.com" />
          <ContactCard label="Email" value="info@alkitu.com" />
          <ContactCard label="LinkedIn" value="linkedin.com/company/alkitu" />
          <ContactCard label="Instagram" value="@alkitu_studio" />
        </View>

        <View
          style={{
            backgroundColor: BRAND.primary,
            borderRadius: 12,
            padding: 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ color: '#0A0A0A', fontFamily: 'Helvetica-Bold', fontSize: 14, marginBottom: 4 }}>
              Cuéntanos sobre tu proyecto
            </Text>
            <Text style={{ color: '#0A0A0A', fontSize: 10, opacity: 0.85 }}>
              alkitu.com/contact · Te respondemos en 24 horas.
            </Text>
          </View>
          <Text style={{ color: '#0A0A0A', fontFamily: 'Helvetica-Bold', fontSize: 18 }}>→</Text>
        </View>
      </View>

      <View style={{ marginTop: 24, alignItems: 'flex-start' }}>
        <AlkituWordmark width={110} accent={BRAND.text} />
        <Text style={[styles.small, { marginTop: 12 }]}>
          Alkitu · Valencia, España · {new Date().getFullYear()}
        </Text>
      </View>

      <PageFooter />
    </Page>
  );
}

function ContactCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={[styles.card, { width: (PAGE.width - PAD_X * 2 - 12) / 2, marginBottom: 0 }]}>
      <Text style={[styles.small, { color: BRAND.primary, marginBottom: 4, letterSpacing: 1 }]}>
        {label.toUpperCase()}
      </Text>
      <Text style={[styles.bodyHi, { fontFamily: 'Helvetica-Bold' }]}>{value}</Text>
    </View>
  );
}

// ── Document & runtime ────────────────────────────────────────────────

function Brochure() {
  return (
    <Document
      title="Alkitu · Brochure 2026"
      author="Alkitu"
      subject="Servicios de branding, marketing digital y product building"
      creator="Alkitu"
      producer="Alkitu"
    >
      <CoverPage />
      <AboutPage />
      <ServicesPage1 />
      <ServicesPage2 />
      <ProcessPage />
      <ProjectsPage />
      <ContactPage />
    </Document>
  );
}

async function main() {
  const outDir = resolve(process.cwd(), 'export');
  const outPath = resolve(outDir, 'alkitu-brochure-es.pdf');

  mkdirSync(outDir, { recursive: true });

  console.log('🛠️  Rendering Alkitu brochure (ES)...');
  const buffer = await renderToBuffer(<Brochure />);
  writeFileSync(outPath, buffer);

  const sizeKb = (buffer.length / 1024).toFixed(1);
  console.log(`✅ Brochure generated: ${outPath}`);
  console.log(`   ${sizeKb} KB · ${TOTAL_PAGES} pages · A4 vertical`);
}

main().catch((err) => {
  console.error('❌ Failed to generate brochure:', err);
  process.exit(1);
});
