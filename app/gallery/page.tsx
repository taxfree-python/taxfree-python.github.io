import { Metadata } from 'next';
import { GallerySection } from '@/components/GallerySection';
import { getGalleryData } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Gallery - tax_free',
  description: 'Artwork and creative projects gallery',
};

export default function GalleryPage() {
  const { works } = getGalleryData();

  return <GallerySection works={works} showTitle showCategories />;
}
