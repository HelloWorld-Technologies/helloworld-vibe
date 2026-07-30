export type GalleryCategory = "property-video" | "moments" | "photos";

export type GalleryMediaItem = {
  id: string;
  category: GalleryCategory;
  /** Media tag/caption when present — omit or leave empty to hide the gallery badge. */
  label?: string;
  imageSrc: string;
  kind: "video" | "image";
  videoSrc?: string;
  caption?: string;
};

export type GalleryDesktopLayout = {
  video: GalleryMediaItem;
  moments: GalleryMediaItem;
  livingRoom: GalleryMediaItem;
  washroom: GalleryMediaItem;
  featuredSequence: GalleryMediaItem[];
};
