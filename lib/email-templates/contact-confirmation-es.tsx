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

interface ContactConfirmationESProps {
  name: string;
}

export default function ContactConfirmationES({ name }: ContactConfirmationESProps) {
  const previewText = '¡Gracias por contactarnos! Hemos recibido tu mensaje.';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✅ ¡Mensaje Recibido!</Heading>
            <Text style={headerSubtitle}>
              Gracias por ponerte en contacto con Alkitu
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Hola {name},</Text>

            <Text style={paragraph}>
              Hemos recibido tu mensaje y queremos agradecerte por tomarte el tiempo de contactarnos.
            </Text>

            <Text style={paragraph}>
              Nuestro equipo está revisando tu solicitud y te responderemos dentro de las próximas{' '}
              <strong style={highlight}>24-48 horas</strong>.
            </Text>

            <Text style={paragraph}>
              Mientras tanto, te invitamos a conocer más sobre nuestros servicios y proyectos:
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/es/projects" style={linkButton}>
              🚀 Nuestros Proyectos
            </Link>
            <Link href="https://alkitu.com/es/about" style={linkButton}>
              👥 Sobre Nosotros
            </Link>
            <Link href="https://alkitu.com/es/blog" style={linkButton}>
              📝 Blog
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Contact Info */}
          <Section style={contactSection}>
            <Heading style={h3}>📞 Otros Canales de Contacto</Heading>
            <Text style={contactText}>
              <strong>WhatsApp:</strong>{' '}
              <Link href="https://wa.me/34611132050" style={contactLink}>
                +34 611 132 050
              </Link>
            </Text>
            <Text style={contactText}>
              <strong>Email:</strong>{' '}
              <Link href="mailto:info@alkitu.com" style={contactLink}>
                info@alkitu.com
              </Link>
            </Text>
            <Text style={contactText}>
              <strong>Ubicación:</strong> Valencia, España 🇪🇸
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un correo automático de confirmación. Por favor, no respondas a este mensaje.
            </Text>
            <Text style={footerText}>
              Si tienes alguna pregunta urgente, contacta directamente a{' '}
              <Link href="mailto:info@alkitu.com" style={footerLink}>
                info@alkitu.com
              </Link>
            </Text>
            <Text style={{...footerText, marginTop: '20px'}}>
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
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 10px',
  padding: '0',
  lineHeight: '1.2',
};

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '400',
  margin: '0',
  opacity: 0.9,
};

const section = {
  padding: '32px 40px',
};

const greeting = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const highlight = {
  color: '#00BB31',
  fontWeight: '600',
};

const linksSection = {
  padding: '24px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#f8f9fa',
};

const linkButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #00BB31',
  borderRadius: '8px',
  color: '#00BB31',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  margin: '8px',
  minWidth: '140px',
};

const contactSection = {
  padding: '24px 40px',
};

const contactText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '8px 0',
};

const contactLink = {
  color: '#00BB31',
  textDecoration: 'none',
  fontWeight: '500',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '0',
};

const footer = {
  padding: '24px 40px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '4px 0',
};

const footerLink = {
  color: '#00BB31',
  textDecoration: 'none',
  fontWeight: '500',
};
