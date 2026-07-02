export type MediaType = 'image' | 'gif' | 'video' | 'interactive';

export type GalleryWork = {
  id: string;
  title: string;
  date: string;
  media: string; // Path to media file (route path for interactive works)
  thumbnail: string; // Path to thumbnail
  mediaType: MediaType;
  description?: string;
  category?: string;
  tools?: string[];
};

export type GalleryData = {
  works: GalleryWork[];
};
