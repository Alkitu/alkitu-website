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
} from '@react-email/components';

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  submittedAt: string;
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  locale,
  submittedAt,
}: ContactNotificationProps) {
  const previewText = `Nuevo mensaje de ${name} - ${subject}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>📧 Nuevo Mensaje de Contacto</Heading>
            <Text style={headerSubtitle}>
              Has recibido un nuevo mensaje desde el formulario de contacto de Alkitu
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Contact Info */}
          <Section style={section}>
            <Text style={label}>DE:</Text>
            <Text style={value}>
              <strong>{name}</strong>
            </Text>
            <Text style={email_value}>
              <Link href={`mailto:${email}`} style={emailLink}>
                {email}
              </Link>
            </Text>
          </Section>

          {/* Subject */}
          <Section style={section}>
            <Text style={label}>ASUNTO:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          {/* Message */}
          <Section style={section}>
            <Text style={label}>MENSAJE:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          {/* Metadata */}
          <Section style={metaSection}>
            <Text style={meta}>
              <strong>Idioma:</strong> {locale === 'es' ? 'Español 🇪🇸' : 'English 🇬🇧'}
            </Text>
            <Text style={meta}>
              <strong>Fecha:</strong> {new Date(submittedAt).toLocaleString('es-ES', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Link href={`mailto:${email}?subject=Re: ${subject}`} style={button}>
              📨 Responder a {name}
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este email fue enviado automáticamente desde el formulario de contacto de{' '}
              <Link href="https://alkitu.com" style={footerLink}>
                alkitu.com
              </Link>
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

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '40px 40px 20px',
  backgroundColor: '#00BB31',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 10px',
  padding: '0',
  lineHeight: '1.3',
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0',
  opacity: 0.9,
};

const section = {
  padding: '24px 40px',
};

const metaSection = {
  padding: '0 40px 24px',
};

const label = {
  color: '#666666',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '1.5',
};

const email_value = {
  color: '#1a1a1a',
  fontSize: '14px',
  margin: '4px 0 0',
};

const emailLink = {
  color: '#00BB31',
  textDecoration: 'none',
  fontWeight: '500',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const meta = {
  color: '#666666',
  fontSize: '13px',
  margin: '4px 0',
  lineHeight: '1.5',
};

const buttonSection = {
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#00BB31',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 32px',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0, 187, 49, 0.2)',
};

const footer = {
  padding: '20px 40px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '4px 0',
};

const footerLink = {
  color: '#00BB31',
  textDecoration: 'none',
  fontWeight: '500',
};
