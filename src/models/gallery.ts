export type GalleryCategory = "property-video" | "moments" | "photos";

export type GalleryMediaItem = {
  id: string;
  category: GalleryCategory;
  /** Media tag/caption when present — omit or leave empty to hide the gallery badge. */
  label?: string;
  imageSrc: string;
  kind: "video" | "image";
  /** MP4 fallback (and sole source when no WebM is provided). */
  videoSrc?: string;
  videoWebmSrc?: string;
  caption?: string;
};

export type GalleryDesktopLayout = {
  video: GalleryMediaItem;
  moments: GalleryMediaItem;
  livingRoom: GalleryMediaItem;
  washroom: GalleryMediaItem;
  featuredSequence: GalleryMediaItem[];
};
