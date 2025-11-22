import { ActivityDate } from './activities';

export interface SocialLink {
  label: string;
  href: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

export interface HeroContent {
  title: string;
  subtitle: string;
  socialLinks: SocialLink[];
}

export interface Qualification {
  name: string;
  issuer: string;
  acquiredDate: ActivityDate;
  score?: string;
  description?: string;
}

export interface QualificationsContent {
  title: string;
  qualifications: Qualification[];
}
