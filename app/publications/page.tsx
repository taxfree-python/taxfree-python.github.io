import type { Metadata } from 'next';
import { Box } from '@mui/material';
import { getPublications } from '@/lib/publications';
import { siteConfig } from '@/config/site';
import { PublicationsSection } from '@/components/PublicationsSection';

const publicationsDescription = 'Academic publications, oral presentations, and posters';

export const metadata: Metadata = {
  title: `Publications - ${siteConfig.name}`,
  description: publicationsDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/publications`,
    title: `Publications - ${siteConfig.name}`,
    description: publicationsDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: `${siteConfig.name} Publications`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `Publications - ${siteConfig.name}`,
    description: publicationsDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PublicationsSection publications={publications} />
    </Box>
  );
}
