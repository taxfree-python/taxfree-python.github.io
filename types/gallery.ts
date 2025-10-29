export type MediaType = 'image' | 'gif' | 'video';

export interface GalleryWork {
  id: string;
  title: string;
  date: string;
  media: string; // Path to media file
  thumbnail: string; // Path to thumbnail
  mediaType: MediaType;
  description?: string;
  category?: string;
  tools?: string[];
  featured?: boolean; // Display on homepage
}

export interface GalleryData {
  works: GalleryWork[];
}
