import { Metadata } from 'next';
import { getProjectsAndActivities } from '@/lib/activities';
import { getSkillsData } from '@/lib/skills';
import { certificationsContent } from '@/data/profile';
import { siteConfig } from '@/config/site';
import CVClient from './CVClient';

const cvDescription = 'Curriculum Vitae - Skills, Experience, and Certifications';

export const metadata: Metadata = {
  title: `CV - ${siteConfig.name}`,
  description: cvDescription,
  openGraph: {
    type: 'profile',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/cv`,
    title: `CV - ${siteConfig.name}`,
    description: cvDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: `${siteConfig.name} CV`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `CV - ${siteConfig.name}`,
    description: cvDescription,
    images: [siteConfig.ogImage.url],
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
