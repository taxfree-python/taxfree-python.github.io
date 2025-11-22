import { HeroContent, CertificationsContent } from '@/types/profile';

export const heroContent: HeroContent = {
  title: 'tax_free',
  subtitle: '最適化とAI Agentで格差を是正する',
  socialLinks: [
    {
      label: 'GitHub',
      href: 'https://github.com/taxfree-python',
      color: 'primary',
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/taxfree_python',
      color: 'primary',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/yu-chinen',
      color: 'primary',
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
