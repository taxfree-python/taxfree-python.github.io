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
