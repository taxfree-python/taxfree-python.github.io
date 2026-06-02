import type { ActivityDate } from './activities';

export type SocialLink = {
  label: string;
  href: string;
};

export type HeroSubtitle = {
  xOptions: readonly [string, ...string[]];
  yOptions: readonly [string, ...string[]];
  connector: string;
};

export type HeroContent = {
  title: string;
  subtitle: HeroSubtitle;
  socialLinks: SocialLink[];
};

export type Certification = {
  name: string;
  issuer: string;
  acquiredDate: ActivityDate;
  score?: string;
  description?: string;
};

export type CertificationsContent = {
  title: string;
  certifications: Certification[];
};
