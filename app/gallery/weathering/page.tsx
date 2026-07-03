import type { Metadata } from 'next';
import { Container } from '@mui/material';

import { Weathering } from '@/components/Weathering';
import { assert } from '@/lib/assert';
import { getWeatheringData } from '@/lib/weathering/works';
import { getGalleryWorks } from '@/lib/gallery';
import { siteConfig } from '@/config/site';

// gallery.yaml is the single source of truth for the work's title and description.
const galleryWork = getGalleryWorks().find((work) => work.id === 'weathering');
assert(galleryWork?.description, 'gallery.yaml must define the weathering work with a description');

const pageTitle = `${galleryWork.title} - ${siteConfig.name}`;
const pageDescription = galleryWork.description;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/gallery/weathering`,
    title: pageTitle,
    description: pageDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: pageTitle,
    description: pageDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function WeatheringPage() {
  const art = getWeatheringData();

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Weathering date={art.date} works={art.works} />
    </Container>
  );
}
