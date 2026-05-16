import { ActivityDate } from './activities';

export interface SocialLink {
  label: string;
  href: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

export interface HeroSubtitle {
  xOptions: string[];
  yOptions: string[];
  connector: string;
}

export interface HeroContent {
  title: string;
  subtitle: HeroSubtitle;
  socialLinks: SocialLink[];
}

export interface Certification {
  name: string;
  issuer: string;
  acquiredDate: ActivityDate;
  score?: string;
  description?: string;
}

export interface CertificationsContent {
  title: string;
  certifications: Certification[];
}
