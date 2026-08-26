import type {
  GalleryCategory,
  GalleryDesktopLayout,
  GalleryMediaItem,
} from "@/src/models/gallery";

export type {
  GalleryCategory,
  GalleryDesktopLayout,
  GalleryMediaItem,
} from "@/src/models/gallery";

export const galleryCategoryTabs: {
  value: GalleryCategory;
  label: string;
}[] = [
  { value: "property-video", label: "Community Vibe" },
  { value: "moments", label: "Moments" },
  { value: "photos", label: "Photos" },
];

export const propertyGalleryTotal = 20;

const galleryImages = [
  "/assets/community/hero/hero-1.webp",
  "/assets/community/hero/hero-2.webp",
  "/assets/community/hero/hero-3.webp",
  "/assets/community/hero/hero-4.webp",
  "/assets/locality/dinning-bento-desktop.png",
  "/assets/locality/nightlife-bento-desktop.png",
  "/assets/locality/health-bento-desktop.png",
  "/assets/locality/transit-bento-desktop.png",
] as const;

export const propertyGalleryItems: GalleryMediaItem[] = [
  {
    id: "video-1",
    category: "property-video",
    label: "Community Vibe",
    imageSrc: galleryImages[0],
    kind: "video",
  },
  {
    id: "moments-1",
    category: "moments",
    label: "Moments",
    imageSrc: galleryImages[1],
    kind: "image",
  },
  {
    id: "living-room",
    category: "photos",
    label: "Living Room",
    imageSrc: galleryImages[2],
    kind: "image",
  },
  {
    id: "washroom",
    category: "photos",
    label: "Washroom",
    imageSrc: galleryImages[3],
    kind: "image",
  },
  ...Array.from({ length: 16 }, (_, index) => {
    const imageSrc = galleryImages[(index + 4) % galleryImages.length];
    const category: GalleryCategory =
      index < 4 ? "moments" : "photos";
    return {
      id: `gallery-${index + 5}`,
      category,
      label: category === "moments" ? "Moments" : "Photos",
      imageSrc,
      kind: "image" as const,
    };
  }),
];

export const propertyGalleryDesktop: GalleryDesktopLayout = {
  video: propertyGalleryItems[0],
  moments: propertyGalleryItems[1],
  livingRoom: propertyGalleryItems[2],
  washroom: propertyGalleryItems[3],
  featuredSequence: [
    propertyGalleryItems[0],
    propertyGalleryItems[1],
    ...propertyGalleryItems.filter((item) => item.category === "photos"),
  ],
};

export function getGalleryItemsByCategory(
  items: readonly GalleryMediaItem[],
  category: GalleryCategory,
) {
  return items.filter((item) => item.category === category);
}

export function getGalleryCategoryIndex(
  items: readonly GalleryMediaItem[],
  category: GalleryCategory,
) {
  return items.findIndex((item) => item.category === category);
}

export function buildGalleryItemsFromImages(
  images: readonly string[],
): GalleryMediaItem[] {
  return images.map((imageSrc, index) => ({
    id: `gallery-${index}`,
    category: "photos" as const,
    imageSrc,
    kind: "image" as const,
  }));
}

export function buildGalleryDesktopFromImages(
  images: readonly string[],
): GalleryDesktopLayout {
  const items = buildGalleryItemsFromImages(images);
  const pick = (index: number) => items[index] ?? items[0];

  return {
    video: { ...pick(0) },
    moments: { ...pick(1) },
    livingRoom: pick(2),
    washroom: pick(3),
    featuredSequence: items.filter(
      (item, index, list) =>
        list.findIndex((candidate) => candidate.id === item.id) === index,
    ),
  };
}

export function buildGalleryItemsFromMedia({
  videos = [],
  moments = [],
  photos = [],
}: {
  videos?: readonly GalleryMediaItem[];
  moments?: readonly GalleryMediaItem[];
  photos?: readonly GalleryMediaItem[];
}): GalleryMediaItem[] {
  return [...videos, ...moments, ...photos];
}

export function buildGalleryDesktopFromMedia(
  items: readonly GalleryMediaItem[],
): GalleryDesktopLayout {
  const videos = getGalleryItemsByCategory(items, "property-video");
  const moments = getGalleryItemsByCategory(items, "moments");
  const photos = getGalleryItemsByCategory(items, "photos");

  const fallback = items[0] ?? propertyGalleryItems[0];
  const momentVideo = moments.find((item) => Boolean(item.videoSrc));
  const preferredMoment = momentVideo ?? moments[0];

  const featuredVideo: GalleryMediaItem = videos[0]
    ? { ...videos[0] }
    : (() => {
        const source = photos[0] ?? preferredMoment ?? fallback;
        return {
          ...source,
          id: `featured-video-fallback-${source.id}`,
          category: "photos" as const,
          label: source.label,
          caption: source.caption,
          kind: "image" as const,
          videoSrc: undefined,
        };
      })();

  const usedFallbackPhotoId =
    !videos[0] && photos[0] ? photos[0].id : null;

  const featuredSequence: GalleryMediaItem[] = [featuredVideo];

  if (preferredMoment) {
    featuredSequence.push({ ...preferredMoment });
  }

  const remainingPhotos = photos.filter(
    (photo) => photo.id !== usedFallbackPhotoId,
  );
  featuredSequence.push(...remainingPhotos);

  const momentsTile: GalleryMediaItem = preferredMoment
    ? { ...preferredMoment }
    : {
        ...(photos[0] ?? featuredVideo),
        label: (photos[0] ?? featuredVideo).label,
        caption: (photos[0] ?? featuredVideo).caption,
      };

  return {
    video: featuredVideo,
    moments: momentsTile,
    livingRoom: photos[0] ?? preferredMoment ?? featuredVideo,
    washroom: photos[1] ?? photos[0] ?? preferredMoment ?? featuredVideo,
    featuredSequence,
  };
}
