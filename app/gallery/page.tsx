import { Metadata } from 'next';
import { GallerySection } from '@/components/GallerySection';
import { getGalleryData } from '@/lib/gallery';
import { siteConfig } from '@/config/site';

const galleryDescription = 'Artwork and creative projects gallery';

export const metadata: Metadata = {
  title: `Gallery - ${siteConfig.name}`,
  description: galleryDescription,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: `${siteConfig.url}/gallery`,
    title: `Gallery - ${siteConfig.name}`,
    description: galleryDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage.url,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
        alt: `${siteConfig.name} Gallery`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.social.twitter,
    creator: siteConfig.social.twitter,
    title: `Gallery - ${siteConfig.name}`,
    description: galleryDescription,
    images: [siteConfig.ogImage.url],
  },
};

export default function GalleryPage() {
  const { works } = getGalleryData();

  return <GallerySection works={works} showTitle showCategories />;
}
