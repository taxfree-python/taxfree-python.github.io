import { AboutContent, HeroContent } from '@/types/profile';

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
