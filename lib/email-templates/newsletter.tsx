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
  Button,
} from '@react-email/components';

// ============================================================================
// VERIFICATION EMAILS (DOUBLE OPT-IN)
// ============================================================================

interface VerificationEmailProps {
  verificationUrl: string;
}

/**
 * English verification email sent on newsletter subscription
 * User must click link to confirm subscription (double opt-in)
 */
export function EnglishVerificationEmail({ verificationUrl }: VerificationEmailProps) {
  const previewText = 'Please confirm your subscription to the Alkitu newsletter';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>📬 Confirm Your Subscription</Heading>
            <Text style={headerSubtitle}>
              You're almost there! Just one more step
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Hello!</Text>

            <Text style={paragraph}>
              Thank you for subscribing to the <strong>Alkitu newsletter</strong>. We're excited to share our latest projects, insights, and updates with you!
            </Text>

            <Text style={paragraph}>
              To complete your subscription and start receiving our content, please confirm your email address by clicking the button below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button href={verificationUrl} style={button}>
                ✅ Confirm Subscription
              </Button>
            </Section>

            <Text style={paragraph}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>
              <Link href={verificationUrl} style={link}>
                {verificationUrl}
              </Link>
            </Text>

            <Text style={warningText}>
              <strong>Note:</strong> If you didn't subscribe to our newsletter, you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated email. Please do not reply to this message.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Alkitu. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Spanish verification email sent on newsletter subscription
 * User must click link to confirm subscription (double opt-in)
 */
export function SpanishVerificationEmail({ verificationUrl }: VerificationEmailProps) {
  const previewText = 'Por favor confirma tu suscripción al newsletter de Alkitu';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>📬 Confirma tu Suscripción</Heading>
            <Text style={headerSubtitle}>
              ¡Ya casi estás! Solo falta un paso más
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>¡Hola!</Text>

            <Text style={paragraph}>
              Gracias por suscribirte al <strong>newsletter de Alkitu</strong>. ¡Estamos emocionados de compartir nuestros últimos proyectos, ideas y actualizaciones contigo!
            </Text>

            <Text style={paragraph}>
              Para completar tu suscripción y empezar a recibir nuestro contenido, por favor confirma tu dirección de correo haciendo clic en el botón de abajo:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button href={verificationUrl} style={button}>
                ✅ Confirmar Suscripción
              </Button>
            </Section>

            <Text style={paragraph}>
              O copia y pega este enlace en tu navegador:
            </Text>
            <Text style={linkText}>
              <Link href={verificationUrl} style={link}>
                {verificationUrl}
              </Link>
            </Text>

            <Text style={warningText}>
              <strong>Nota:</strong> Si no te suscribiste a nuestro newsletter, puedes ignorar este correo de forma segura.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un correo automatizado. Por favor no respondas a este mensaje.
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

// ============================================================================
// WELCOME EMAILS (AFTER VERIFICATION)
// ============================================================================

/**
 * English welcome email sent after successful verification
 * Confirms subscription is active
 */
export function EnglishWelcomeEmail() {
  const previewText = 'Welcome to the Alkitu newsletter! Your subscription is active.';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🎉 Welcome to Alkitu!</Heading>
            <Text style={headerSubtitle}>
              Your subscription is now active
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Welcome aboard!</Text>

            <Text style={paragraph}>
              Thank you for confirming your subscription to the <strong>Alkitu newsletter</strong>. We're thrilled to have you as part of our community!
            </Text>

            <Text style={paragraph}>
              You'll now receive regular updates about:
            </Text>

            <ul style={list}>
              <li style={listItem}>🚀 New projects and case studies</li>
              <li style={listItem}>💡 Web development tips and insights</li>
              <li style={listItem}>📚 Industry trends and best practices</li>
              <li style={listItem}>🎨 Design and UX inspiration</li>
            </ul>

            <Text style={paragraph}>
              In the meantime, explore what we're working on:
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/en/projects" style={linkButton}>
              🚀 Our Projects
            </Link>
            <Link href="https://alkitu.com/en/blog" style={linkButton}>
              📝 Blog
            </Link>
            <Link href="https://alkitu.com/en/about" style={linkButton}>
              👥 About Us
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You can unsubscribe at any time by clicking the link at the bottom of our emails.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Alkitu. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Spanish welcome email sent after successful verification
 * Confirms subscription is active
 */
export function SpanishWelcomeEmail() {
  const previewText = '¡Bienvenido al newsletter de Alkitu! Tu suscripción está activa.';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🎉 ¡Bienvenido a Alkitu!</Heading>
            <Text style={headerSubtitle}>
              Tu suscripción está ahora activa
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>¡Bienvenido a bordo!</Text>

            <Text style={paragraph}>
              Gracias por confirmar tu suscripción al <strong>newsletter de Alkitu</strong>. ¡Estamos encantados de tenerte como parte de nuestra comunidad!
            </Text>

            <Text style={paragraph}>
              Ahora recibirás actualizaciones regulares sobre:
            </Text>

            <ul style={list}>
              <li style={listItem}>🚀 Nuevos proyectos y casos de estudio</li>
              <li style={listItem}>💡 Consejos e ideas sobre desarrollo web</li>
              <li style={listItem}>📚 Tendencias y mejores prácticas de la industria</li>
              <li style={listItem}>🎨 Inspiración de diseño y UX</li>
            </ul>

            <Text style={paragraph}>
              Mientras tanto, explora en qué estamos trabajando:
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/es/projects" style={linkButton}>
              🚀 Nuestros Proyectos
            </Link>
            <Link href="https://alkitu.com/es/blog" style={linkButton}>
              📝 Blog
            </Link>
            <Link href="https://alkitu.com/es/about" style={linkButton}>
              👥 Sobre Nosotros
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Puedes darte de baja en cualquier momento haciendo clic en el enlace al final de nuestros correos.
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

// ============================================================================
// UNSUBSCRIBE CONFIRMATION EMAILS
// ============================================================================

/**
 * English unsubscribe confirmation email
 * Sent after user successfully unsubscribes
 */
export function EnglishGoodbyeEmail() {
  const previewText = 'You have been unsubscribed from the Alkitu newsletter';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>👋 Sorry to See You Go</Heading>
            <Text style={headerSubtitle}>
              You've been unsubscribed from our newsletter
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Goodbye!</Text>

            <Text style={paragraph}>
              You have successfully unsubscribed from the <strong>Alkitu newsletter</strong>. You will no longer receive updates from us.
            </Text>

            <Text style={paragraph}>
              We're sorry to see you go! If you unsubscribed by mistake or change your mind in the future, you can always subscribe again through our website.
            </Text>

            <Text style={paragraph}>
              Thank you for being part of our community, and we hope to see you again soon!
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/en/contact" style={linkButton}>
              📧 Subscribe Again
            </Link>
            <Link href="https://alkitu.com/en" style={linkButton}>
              🏠 Visit Our Website
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you have any feedback or questions, please feel free to{' '}
              <Link href="mailto:info@alkitu.com" style={footerLink}>
                contact us
              </Link>
              .
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Alkitu. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Spanish unsubscribe confirmation email
 * Sent after user successfully unsubscribes
 */
export function SpanishGoodbyeEmail() {
  const previewText = 'Te has dado de baja del newsletter de Alkitu';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>👋 Sentimos Verte Partir</Heading>
            <Text style={headerSubtitle}>
              Te has dado de baja de nuestro newsletter
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>¡Adiós!</Text>

            <Text style={paragraph}>
              Te has dado de baja exitosamente del <strong>newsletter de Alkitu</strong>. Ya no recibirás más actualizaciones de nuestra parte.
            </Text>

            <Text style={paragraph}>
              ¡Sentimos verte partir! Si te diste de baja por error o cambias de opinión en el futuro, siempre puedes suscribirte de nuevo a través de nuestro sitio web.
            </Text>

            <Text style={paragraph}>
              Gracias por haber sido parte de nuestra comunidad, ¡y esperamos verte pronto de nuevo!
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/es/contact" style={linkButton}>
              📧 Suscribirte de Nuevo
            </Link>
            <Link href="https://alkitu.com/es" style={linkButton}>
              🏠 Visitar Nuestro Sitio
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Si tienes algún comentario o pregunta, no dudes en{' '}
              <Link href="mailto:info@alkitu.com" style={footerLink}>
                contactarnos
              </Link>
              .
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

// ============================================================================
// SHARED STYLES
// ============================================================================

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

const list = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 16px',
  paddingLeft: '20px',
};

const listItem = {
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
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
  padding: '16px 32px',
  margin: '0',
};

const linkText = {
  color: '#4a5568',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const link = {
  color: '#00BB31',
  textDecoration: 'underline',
  fontWeight: '500',
};

const warningText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '24px 0 0',
  padding: '16px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
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
