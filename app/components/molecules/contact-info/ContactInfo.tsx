'use client';

import { motion } from 'framer-motion';
import { ContactLink, ContactInfoProps } from './contact-info.type';
import { useTranslationContext } from '@/app/context/TranslationContext';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactInfo({
  showAvailability = true,
  showResponseTime = true,
}: ContactInfoProps) {
  const { translations } = useTranslationContext();
  const contactText = translations?.contact?.info;
  const footerData = translations?.footer;

  // Get social links from footer data
  const contactLinks: ContactLink[] = [
    // Email is usually in footer or contactText
    ...(footerData?.socials
      ?.filter((social) => !social.hidden)
      .map((social) => ({
        icon: (
          <div className="bg-white p-1 rounded-full flex items-center justify-center w-8 h-8 shadow-sm">
            <img
              src={social.icon}
              alt={social.name}
              className="w-5 h-5"
              style={{
                filter:
                  'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
              }}
            />
          </div>
        ),
        label: social.name,
        value: social.name,
        href: social.url,
        type: 'social' as const,
      })) || []),
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1 }}
      className="flex flex-col gap-6 w-full"
    >
      {/* Contact Links */}
      <div className="flex flex-col gap-4">
        {contactLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.href}
            target={link.type === 'social' ? '_blank' : undefined}
            rel={link.type === 'social' ? 'noopener noreferrer' : undefined}
            variants={itemVariants}
            className="group flex items-center gap-4 p-4 
                       rounded-lg border border-border 
                       bg-white dark:bg-zinc-900/50
                       hover:border-primary hover:shadow-primary/20 hover:shadow-lg
                       transition-all duration-200
                       cursor-pointer active:scale-95"
          >
            <div className="text-primary text-2xl 
                            group-hover:scale-110 transition-transform">
              {link.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                {link.label}
              </p>
              <p className="font-medium text-foreground">
                {link.value}
              </p>
            </div>
            <div className="text-muted-foreground group-hover:text-primary 
                            group-hover:translate-x-1 transition-all">
              →
            </div>
          </motion.a>
        ))}
      </div>

      {/* Availability Card */}
      {showAvailability && (
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl border-2 border-primary 
                     bg-primary/5 dark:bg-primary/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <p className="text-sm font-bold text-primary uppercase tracking-wide">
              {contactText?.availabilityTitle || 'Available for work'}
            </p>
          </div>
          <p className="text-foreground font-medium">
            {contactText?.availabilityText ||
              "I'm currently accepting new projects and collaborations."}
          </p>
        </motion.div>
      )}

      {/* Response Time Card */}
      {showResponseTime && (
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-xl bg-zinc-100 dark:bg-zinc-900 
                     border border-border"
        >
          <p className="text-4xl font-black mb-2 text-foreground">
            ⚡ {contactText?.responseTimeTitle || '24h'}
          </p>
          <p className="text-foreground font-medium">
            {contactText?.responseTimeText || 'Average response time'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
