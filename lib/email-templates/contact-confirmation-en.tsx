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

interface ContactConfirmationENProps {
  name: string;
}

export default function ContactConfirmationEN({ name }: ContactConfirmationENProps) {
  const previewText = 'Thank you for contacting us! We have received your message.';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✅ Message Received!</Heading>
            <Text style={headerSubtitle}>
              Thank you for getting in touch with Alkitu
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Hello {name},</Text>

            <Text style={paragraph}>
              We have received your message and want to thank you for taking the time to contact us.
            </Text>

            <Text style={paragraph}>
              Our team is reviewing your request and will get back to you within the next{' '}
              <strong style={highlight}>24-48 hours</strong>.
            </Text>

            <Text style={paragraph}>
              In the meantime, we invite you to learn more about our services and projects:
            </Text>
          </Section>

          {/* Links Section */}
          <Section style={linksSection}>
            <Link href="https://alkitu.com/en/projects" style={linkButton}>
              🚀 Our Projects
            </Link>
            <Link href="https://alkitu.com/en/about" style={linkButton}>
              👥 About Us
            </Link>
            <Link href="https://alkitu.com/en/blog" style={linkButton}>
              📝 Blog
            </Link>
          </Section>

          <Hr style={hr} />

          {/* Contact Info */}
          <Section style={contactSection}>
            <Heading style={h3}>📞 Other Contact Channels</Heading>
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
              <strong>Location:</strong> Valencia, Spain 🇪🇸
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated confirmation email. Please do not reply to this message.
            </Text>
            <Text style={footerText}>
              If you have any urgent questions, please contact{' '}
              <Link href="mailto:info@alkitu.com" style={footerLink}>
                info@alkitu.com
              </Link>
            </Text>
            <Text style={{...footerText, marginTop: '20px'}}>
              © {new Date().getFullYear()} Alkitu. All rights reserved.
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
