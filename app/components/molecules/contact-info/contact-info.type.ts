export interface ContactLink {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  type: 'email' | 'social';
}

export interface ContactInfoProps {
  showAvailability?: boolean;
  showResponseTime?: boolean;
}
