// Single source of truth for media types: the runtime validator in
// lib/gallery.ts uses the array, the type is derived from it.
export const mediaTypeValues = ['interactive'] as const;
export type MediaType = (typeof mediaTypeValues)[number];

export type GalleryWork = {
  id: string;
  title: string;
  date: string;
  media: string; // Route path to the work page
  thumbnail: string; // Path to thumbnail
  mediaType: MediaType;
  description?: string;
  tools?: string[];
};

export type GalleryData = {
  works: GalleryWork[];
};
