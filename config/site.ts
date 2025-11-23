/**
 * Site-wide configuration
 * This file centralizes all site metadata to avoid duplication across pages
 */

export const siteConfig = {
  name: 'tax_free',
  url: 'https://taxfree.dev',
  description: 'Software Engineer & Researcher at Science Tokyo',
  locale: 'ja_JP',
  ogImage: {
    url: '/icon.png',
    width: 1706,
    height: 1669,
  },
  social: {
    twitter: '@taxfree_python',
  },
} as const;

export type SiteConfig = typeof siteConfig;
