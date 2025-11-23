import { Metadata } from 'next';
import { GallerySection } from '@/components/GallerySection';
import { getGalleryData } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Gallery - tax_free',
  description: 'Artwork and creative projects gallery',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://taxfree.dev/gallery',
    title: 'Gallery - tax_free',
    description: 'Artwork and creative projects gallery',
    siteName: 'tax_free',
    images: [
      {
        url: '/icon.png',
        width: 1706,
        height: 1669,
        alt: 'tax_free Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@taxfree_python',
    creator: '@taxfree_python',
    title: 'Gallery - tax_free',
    description: 'Artwork and creative projects gallery',
    images: ['/icon.png'],
  },
};

export default function GalleryPage() {
  const { works } = getGalleryData();

  return <GallerySection works={works} showTitle showCategories />;
}
