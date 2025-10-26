export interface SocialLink {
  label: string;
  href: string;
  colorClass?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  socialLinks: SocialLink[];
}

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

export interface Qualification {
  name: string;
  issuer: string;
  date: string;
  score?: string;
  description?: string;
}

export interface QualificationsContent {
  title: string;
  qualifications: Qualification[];
}
