import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { getActivities } from '@/lib/activities';
import { certificationsContent } from '@/data/profile';
import { siteConfig } from '@/config/site';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { CertificationsSection } from '@/components/CertificationsSection';

const mainExperienceIds: ReadonlySet<string> = new Set([
  'pfn-education-project-engineer',
  'riken-bdr-part-timer',
  'layerx-ai-workforce-intern',
  'autonomous-lab-scheduling',
  'doctor-car-data-analysis',
]);

const experienceDescription = 'Work history, research projects, and language certifications';

export const metadata: Metadata = {
  title: `Experience - ${siteConfig.name}`,
  description: experienceDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/experience`,
    title: `Experience - ${siteConfig.name}`,
    description: experienceDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: `${siteConfig.name} Experience`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `Experience - ${siteConfig.name}`,
    description: experienceDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function ExperiencePage() {
  const activities = getActivities();
  const mainExperiences = activities.filter((activity) => mainExperienceIds.has(activity.id));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ActivitiesSection activities={mainExperiences} allActivities={activities} />
      <CertificationsSection content={certificationsContent} />
    </Box>
  );
}
