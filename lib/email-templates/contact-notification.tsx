import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
  Row,
  Column,
} from '@react-email/components';

interface PageVisit {
  path: string;
  entryTime: string;
  durationSec?: number;
}

interface SessionInfo {
  country?: string;
  city?: string;
  region?: string;
  ipAddress?: string;
  userAgent?: string;
  pageCount?: number;
  pages?: PageVisit[];
  sessionStart?: string;
  sessionDuration?: number;
}

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  submittedAt: string;
  projectType?: string;
  companySize?: string;
  budget?: string;
  productCategories?: string[];
  functionalities?: string[];
  formUrl?: string;
  session?: SessionInfo;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} seg`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min < 60) return sec > 0 ? `${min} min ${sec} seg` : `${min} min`;
  const hrs = Math.floor(min / 60);
  const remainMin = min % 60;
  return `${hrs}h ${remainMin} min`;
}

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (_) {
    return dateStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return dateStr;
  }
}

function countryFlag(country?: string): string {
  if (!country) return '🌍';
  const flags: Record<string, string> = {
    'Spain': '🇪🇸', 'España': '🇪🇸',
    'United States': '🇺🇸', 'Estados Unidos': '🇺🇸',
    'Mexico': '🇲🇽', 'México': '🇲🇽',
    'Colombia': '🇨🇴',
    'Argentina': '🇦🇷',
    'Chile': '🇨🇱',
    'Peru': '🇵🇪', 'Perú': '🇵🇪',
    'Germany': '🇩🇪', 'Alemania': '🇩🇪',
    'France': '🇫🇷', 'Francia': '🇫🇷',
    'United Kingdom': '🇬🇧', 'Reino Unido': '🇬🇧',
    'Italy': '🇮🇹', 'Italia': '🇮🇹',
    'Portugal': '🇵🇹',
    'Brazil': '🇧🇷', 'Brasil': '🇧🇷',
    'Canada': '🇨🇦', 'Canadá': '🇨🇦',
    'Venezuela': '🇻🇪',
    'Ecuador': '🇪🇨',
    'Uruguay': '🇺🇾',
    'Costa Rica': '🇨🇷',
    'Panama': '🇵🇦', 'Panamá': '🇵🇦',
    'Dominican Republic': '🇩🇴', 'República Dominicana': '🇩🇴',
  };
  return flags[country] || '🌍';
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  locale,
  submittedAt,
  projectType,
  companySize,
  budget,
  productCategories,
  functionalities,
  formUrl,
  session,
}: ContactNotificationProps) {
  const previewText = `Nuevo mensaje de ${name} — ${subject}`;
  const hasProjectDetails = projectType || companySize || budget;
  const hasCategories = productCategories && productCategories.length > 0;
  const hasFunctionalities = functionalities && functionalities.length > 0;
  const hasSession = session && (session.country || session.pageCount || session.ipAddress);

  const location = [session?.city, session?.region, session?.country].filter(Boolean).join(', ');

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* ── Header ── */}
          <Section style={header}>
            <Text style={headerBadge}>NUEVO CONTACTO</Text>
            <Heading style={h1}>{name}</Heading>
            <Text style={headerEmail}>
              <Link href={`mailto:${email}`} style={headerEmailLink}>{email}</Link>
            </Text>
          </Section>

          {/* ── Quick Summary Bar ── */}
          <Section style={summaryBar}>
            <Row>
              <Column style={summaryItem}>
                <Text style={summaryLabel}>Idioma</Text>
                <Text style={summaryValue}>{locale === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}</Text>
              </Column>
              <Column style={summaryItem}>
                <Text style={summaryLabel}>Fecha</Text>
                <Text style={summaryValue}>{formatDate(submittedAt)}</Text>
              </Column>
              {hasSession && session?.country && (
                <Column style={summaryItem}>
                  <Text style={summaryLabel}>País</Text>
                  <Text style={summaryValue}>{countryFlag(session.country)} {session.country}</Text>
                </Column>
              )}
            </Row>
          </Section>

          {/* ── Message ── */}
          <Section style={sectionBlock}>
            <Text style={sectionTitle}>💬 MENSAJE</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* ── Project Details ── */}
          {hasProjectDetails && (
            <Section style={sectionBlock}>
              <Text style={sectionTitle}>📋 DETALLES DEL PROYECTO</Text>
              <table style={detailsTable} cellPadding={0} cellSpacing={0}>
                <tbody>
                  {projectType && (
                    <tr>
                      <td style={dtCell}>Tipo de Proyecto</td>
                      <td style={ddCell}>{projectType}</td>
                    </tr>
                  )}
                  {companySize && (
                    <tr>
                      <td style={dtCell}>Empresa</td>
                      <td style={ddCell}>{companySize}</td>
                    </tr>
                  )}
                  {budget && (
                    <tr>
                      <td style={dtCell}>Presupuesto</td>
                      <td style={ddCell}>
                        <span style={budgetBadge}>{budget}</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>
          )}

          {/* ── Categories & Functionalities ── */}
          {(hasCategories || hasFunctionalities) && (
            <Section style={sectionBlock}>
              <Text style={sectionTitle}>🏷️ CATEGORÍAS Y FUNCIONALIDADES</Text>
              {hasCategories && (
                <>
                  <Text style={chipGroupLabel}>Categorías</Text>
                  <Text style={chipGroup}>
                    {productCategories!.map((cat) => (
                      <span key={cat} style={chip}>{cat}</span>
                    ))}
                  </Text>
                </>
              )}
              {hasFunctionalities && (
                <>
                  <Text style={chipGroupLabel}>Funcionalidades</Text>
                  <Text style={chipGroup}>
                    {functionalities!.map((fn) => (
                      <span key={fn} style={chipAlt}>{fn}</span>
                    ))}
                  </Text>
                </>
              )}
            </Section>
          )}

          {/* ── Session / Visitor Info ── */}
          {hasSession && (
            <Section style={sessionSection}>
              <Text style={sectionTitle}>👤 DATOS DEL VISITANTE</Text>

              {/* Header row: flag + IP + page count */}
              <Text style={visitorHeader}>
                {session!.country && <span>{countryFlag(session!.country)} </span>}
                {session!.ipAddress && <span style={visitorIp}>{session!.ipAddress}</span>}
                {session!.pageCount !== undefined && session!.pageCount > 0 && (
                  <span style={pageCountBadge}>{session!.pageCount} páginas</span>
                )}
              </Text>

              {/* User agent */}
              {session!.userAgent && (
                <Text style={visitorUa}>{session!.userAgent}</Text>
              )}

              {/* Start + duration */}
              <Text style={visitorMeta}>
                {session!.sessionStart && (
                  <span>Inicio: {formatDate(session!.sessionStart)}</span>
                )}
                {session!.sessionDuration !== undefined && session!.sessionDuration > 0 && (
                  <span> &nbsp;•&nbsp; Duración: {formatDuration(session!.sessionDuration)}</span>
                )}
              </Text>

              {/* Page journey */}
              {session!.pages && session!.pages.length > 0 && (
                <>
                  <Text style={pagesTitle}>Recorrido del Usuario</Text>
                  {session!.pages.map((page, i) => (
                    <table key={`${page.path}-${i}`} style={pageRow} cellPadding={0} cellSpacing={0}>
                      <tbody>
                        <tr>
                          <td style={pageNumberCell}>
                            <span style={pageNumberCircle}>{i + 1}</span>
                          </td>
                          <td style={pageDetailCell}>
                            <Text style={pagePathText}>{page.path}</Text>
                            <Text style={pageMetaText}>
                              Entrada: {formatTime(page.entryTime)}
                              {page.durationSec !== undefined && page.durationSec > 0 && (
                                <span> &nbsp;&nbsp; Tiempo: {formatDuration(page.durationSec)}</span>
                              )}
                              {page.durationSec === undefined && (
                                <span> &nbsp;&nbsp; Tiempo: N/A</span>
                              )}
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </>
              )}
            </Section>
          )}

          {/* ── Origin ── */}
          {formUrl && (
            <Section style={originSection}>
              <Text style={originText}>
                📍 Formulario enviado desde: <Link href={formUrl} style={originLink}>{formUrl}</Link>
              </Text>
            </Section>
          )}

          {/* ── CTA Button ── */}
          <Section style={buttonSection}>
            <Link href={`mailto:${email}?subject=Re: ${subject}`} style={button}>
              📨 Responder a {name}
            </Link>
          </Section>

          <Hr style={hr} />

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              Este email fue enviado automáticamente desde el formulario de contacto de{' '}
              <Link href="https://alkitu.com" style={footerLink}>alkitu.com</Link>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Alkitu. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ──

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#111111',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  border: '1px solid #222222',
};

const header = {
  padding: '40px 40px 28px',
  backgroundColor: '#00BB31',
  textAlign: 'center' as const,
};

const headerBadge = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0 0 12px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: '800',
  margin: '0 0 6px',
  padding: '0',
  lineHeight: '1.2',
};

const headerEmail = {
  margin: '0',
  fontSize: '15px',
};

const headerEmailLink = {
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
};

const summaryBar = {
  padding: '16px 40px',
  backgroundColor: '#1a1a1a',
  borderBottom: '1px solid #222222',
};

const summaryItem = {
  textAlign: 'center' as const,
  padding: '0 8px',
};

const summaryLabel = {
  color: '#666666',
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 2px',
};

const summaryValue = {
  color: '#cccccc',
  fontSize: '13px',
  fontWeight: '500',
  margin: '0',
};

const sectionBlock = {
  padding: '28px 40px 20px',
};

const sessionSection = {
  padding: '28px 40px 20px',
  backgroundColor: '#0d0d0d',
  borderTop: '1px solid #222222',
  borderBottom: '1px solid #222222',
};

const sectionTitle = {
  color: '#00BB31',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  margin: '0 0 16px',
};

const messageText = {
  color: '#e0e0e0',
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #2a2a2a',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const dtCell = {
  color: '#888888',
  fontSize: '13px',
  fontWeight: '600',
  padding: '8px 12px 8px 0',
  width: '140px',
  verticalAlign: 'top' as const,
  borderBottom: '1px solid #1a1a1a',
};

const ddCell = {
  color: '#e0e0e0',
  fontSize: '14px',
  fontWeight: '400',
  padding: '8px 0',
  verticalAlign: 'top' as const,
  borderBottom: '1px solid #1a1a1a',
};

const budgetBadge = {
  display: 'inline-block',
  backgroundColor: '#00BB31',
  color: '#ffffff',
  padding: '3px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '700',
};

const durationBadge = {
  display: 'inline-block',
  backgroundColor: '#1a3a1a',
  color: '#00BB31',
  padding: '3px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  fontWeight: '600',
};

const chipGroupLabel = {
  color: '#888888',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const chipGroup = {
  margin: '0 0 16px',
  lineHeight: '2.2',
};

const chip = {
  display: 'inline-block',
  backgroundColor: '#1a2e1a',
  color: '#00BB31',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  marginRight: '6px',
  marginBottom: '4px',
  border: '1px solid #00BB3130',
};

const chipAlt = {
  display: 'inline-block',
  backgroundColor: '#1a1a2e',
  color: '#6B8AFF',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  marginRight: '6px',
  marginBottom: '4px',
  border: '1px solid #6B8AFF30',
};

const originSection = {
  padding: '12px 40px',
};

const originText = {
  color: '#666666',
  fontSize: '12px',
  margin: '0',
};

const originLink = {
  color: '#888888',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#222222',
  margin: '0',
};

const buttonSection = {
  padding: '28px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#00BB31',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 36px',
  boxShadow: '0 4px 12px rgba(0, 187, 49, 0.3)',
};

const footer = {
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#555555',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '4px 0',
};

const visitorHeader = {
  color: '#e0e0e0',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
  lineHeight: '1.6',
};

const visitorIp = {
  fontFamily: 'SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace',
  fontSize: '15px',
  fontWeight: '700',
  marginRight: '12px',
};

const pageCountBadge = {
  display: 'inline-block',
  backgroundColor: '#00BB31',
  color: '#ffffff',
  padding: '2px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '700',
  marginLeft: '10px',
  verticalAlign: 'middle' as const,
};

const visitorUa = {
  color: '#666666',
  fontSize: '11px',
  margin: '0 0 6px',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
};

const visitorMeta = {
  color: '#888888',
  fontSize: '13px',
  margin: '0 0 4px',
};

const pagesTitle = {
  color: '#cccccc',
  fontSize: '14px',
  fontWeight: '700',
  margin: '20px 0 12px',
};

const pageRow = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  marginBottom: '0',
  backgroundColor: '#141414',
  borderLeft: '3px solid #222222',
  marginTop: '6px',
  borderRadius: '0 6px 6px 0',
};

const pageNumberCell = {
  width: '36px',
  padding: '10px 0 10px 12px',
  verticalAlign: 'top' as const,
};

const pageNumberCircle = {
  display: 'inline-block',
  backgroundColor: '#00BB31',
  color: '#ffffff',
  width: '22px',
  height: '22px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  borderRadius: '50%',
  fontSize: '11px',
  fontWeight: '700',
};

const pageDetailCell = {
  padding: '8px 12px 8px 6px',
  verticalAlign: 'top' as const,
};

const pagePathText = {
  color: '#e0e0e0',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace',
  margin: '0 0 2px',
};

const pageMetaText = {
  color: '#666666',
  fontSize: '11px',
  margin: '0',
};

const footerLink = {
  color: '#00BB31',
  textDecoration: 'none',
  fontWeight: '500',
};
