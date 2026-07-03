export type GalleryWork = {
  id: string;
  title: string;
  date: string;
  media: string; // Route path to the work page
  description?: string;
  tools?: string[];
};

export type GalleryData = {
  works: GalleryWork[];
};
