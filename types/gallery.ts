export type MediaType = 'interactive';

export type GalleryWork = {
  id: string;
  title: string;
  date: string;
  media: string; // Route path to the work page
  thumbnail: string; // Path to thumbnail
  mediaType: MediaType;
  description?: string;
  category?: string;
  tools?: string[];
};

export type GalleryData = {
  works: GalleryWork[];
};
