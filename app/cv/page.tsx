import { Metadata } from 'next';
import { getProjectsAndActivities } from '@/lib/activities';
import { getSkillsData } from '@/lib/skills';
import { certificationsContent } from '@/data/profile';
import CVClient from './CVClient';

export const metadata: Metadata = {
  title: 'CV - tax_free',
  description: 'Curriculum Vitae - Skills, Experience, and Certifications',
  openGraph: {
    type: 'profile',
    locale: 'ja_JP',
    url: 'https://taxfree.dev/cv',
    title: 'CV - tax_free',
    description: 'Curriculum Vitae - Skills, Experience, and Certifications',
    siteName: 'tax_free',
    images: [
      {
        url: '/icon.png',
        width: 1706,
        height: 1669,
        alt: 'tax_free CV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@taxfree_python',
    creator: '@taxfree_python',
    title: 'CV - tax_free',
    description: 'Curriculum Vitae - Skills, Experience, and Certifications',
    images: ['/icon.png'],
  },
};

export default function CVPage() {
  const activities = getProjectsAndActivities();
  const { skills } = getSkillsData();

  return (
    <CVClient
      activities={activities}
      skills={skills}
      certifications={certificationsContent}
    />
  );
}
