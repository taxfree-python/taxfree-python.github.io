import { AboutContent, HeroContent, QualificationsContent } from '@/types/profile';

export const heroContent: HeroContent = {
  title: 'tax_free',
  subtitle: 'Software Engineer & Researcher',
  socialLinks: [
    {
      label: 'GitHub',
      href: 'https://github.com/taxfree-python',
      colorClass: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/taxfree_python',
      colorClass: 'bg-blue-500 text-white',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/yu-chinen',
      colorClass: 'bg-blue-700 text-white',
    },
  ],
};

export const aboutContent: AboutContent = {
  title: 'About Me',
  paragraphs: [
    'TokyoTech, Japan でソフトウェアエンジニアリングと研究を行っています。',
    '機械学習、最適化、プログラミング言語に興味があります。',
  ],
};

export const qualificationsContent: QualificationsContent = {
  title: '資格・語学',
  qualifications: [
    {
      name: '実用英語技能検定 準1級',
      issuer: '日本英語検定協会',
      date: '取得済み',
      score: '英検CSEスコア: 2459',
      description: '4技能総合CEFR: B2',
    },
    {
      name: 'TOEIC Listening & Reading Test',
      issuer: 'ETS',
      date: '取得済み',
      score: 'Total: 815',
      description: 'Listening: 425, Reading: 390',
    },
    {
      name: 'AtCoder',
      issuer: 'AtCoder株式会社',
      date: '継続中',
      score: 'Algo Rating: 571 (灰色)',
      description: '競技プログラミングプラットフォーム',
    },
  ],
};
