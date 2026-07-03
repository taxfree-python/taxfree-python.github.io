import type { CertificationsContent, HeroContent } from '@/types';

export const heroContent: HeroContent = {
  title: 'tax_free',
  subtitle: {
    xOptions: ['AI', 'Agent'],
    yOptions: ['Science', 'Society'],
    connector: 'for',
  },
  socialLinks: [
    {
      label: 'GitHub',
      url: 'https://github.com/taxfree-python',
    },
    {
      label: 'Twitter',
      url: 'https://twitter.com/taxfree_python',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/yu-chinen',
    },
  ],
};

export const certificationsContent: CertificationsContent = {
  title: 'Languages',
  certifications: [
    {
      name: 'TOEIC Listening & Reading Test',
      issuer: 'ETS',
      acquiredDate: {
        year: 2025,
        month: 3,
      },
      score: 'Total: 815',
      description: 'Listening: 425 / Reading: 390',
    },
    {
      name: '実用英語技能検定 準1級',
      issuer: '日本英語検定協会',
      acquiredDate: {
        year: 2021,
        month: 10,
      },
      score: 'CSEスコア: 2459',
      description: 'CEFR B2 / 4技能総合評価',
    },
  ],
};
