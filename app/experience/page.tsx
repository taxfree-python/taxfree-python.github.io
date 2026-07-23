import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { getActivities } from '@/lib/activities';
import { certificationsContent } from '@/data/profile';
import { siteConfig } from '@/config/site';
import { ActivitiesSection } from '@/components/ActivitiesSection';
import { CertificationsSection } from '@/components/CertificationsSection';

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
  const featuredActivities = activities.filter((activity) => activity.featured);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <ActivitiesSection activities={featuredActivities} allActivities={activities} />
      <CertificationsSection {...certificationsContent} />
    </Box>
  );
}
