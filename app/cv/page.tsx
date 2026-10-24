import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { getActivities } from '@/lib/activities';
import { getPublications } from '@/lib/publications';
import { siteConfig } from '@/config/site';
import { CvSection } from '@/components/CvSection';

const cvDescription = 'Education, work, research and publications';

export const metadata: Metadata = {
  title: `CV - ${siteConfig.name}`,
  description: cvDescription,
  openGraph: {
    type: 'website',
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

export default function CvPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', '@media print': { bgcolor: 'common.white' } }}>
      <CvSection activities={getActivities()} publications={getPublications()} />
    </Box>
  );
}
