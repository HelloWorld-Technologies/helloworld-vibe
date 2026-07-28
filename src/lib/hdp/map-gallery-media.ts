import type {
  PropertyMediaItem,
  PropertyMomentItem,
} from "@/src/models/property-media";
import { imageUrlFormatter } from "@/src/lib/images";
import type { GalleryMediaItem } from "@/src/tokens/property-gallery";

function formatMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/") || url.includes("http")) {
    return url.includes("http")
      ? url.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20")
      : url;
  }
  return imageUrlFormatter("hdp", url);
}

function isVideoMedia(
  mediaType: string,
  url: string,
): boolean {
  if (mediaType === "video") return true;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

function isMomentsTag(tag: string | undefined): boolean {
  const normalized = tag?.toLowerCase();
  return normalized === "moments" || normalized === "moment";
}

function sortByDisplayOrder<T extends { display_order?: number }>(items: readonly T[]) {
  return [...items].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );
}

export function mapPropertyMediaToGalleryItems(
  media: readonly PropertyMediaItem[],
): {
  videos: GalleryMediaItem[];
  moments: GalleryMediaItem[];
  photos: GalleryMediaItem[];
} {
  const videos: GalleryMediaItem[] = [];
  const moments: GalleryMediaItem[] = [];
  const photos: GalleryMediaItem[] = [];

  for (const item of sortByDisplayOrder(media)) {
    const mediaType = String(item.media_type || "").toLowerCase();
    const url = formatMediaUrl(item.url);
    const thumbnail = formatMediaUrl(item.thumbnail_url || undefined);
    if (!url && !thumbnail) continue;

    const tag = item.tag?.trim() || item.caption?.trim() || undefined;
    const id = `media-${item.id}`;

    if (isVideoMedia(mediaType, url)) {
      if (isMomentsTag(tag)) {
        moments.push({
          id,
          category: "moments",
          label: tag || "Moments",
          imageSrc: thumbnail || url,
          kind: "video",
          videoSrc: url || undefined,
          caption: tag || "Moments",
        });
        continue;
      }

      const normalizedTag = tag?.toLowerCase();
      const label =
        !tag || normalizedTag === "property" ? "Property Video" : tag;
      videos.push({
        id,
        category: "property-video",
        label,
        imageSrc: thumbnail || url,
        kind: "video",
        videoSrc: url || undefined,
        caption: label,
      });
      continue;
    }

    photos.push({
      id,
      category: "photos",
      label: tag || "Photos",
      imageSrc: url || thumbnail,
      kind: "image",
      caption: tag,
    });
  }

  return { videos, moments, photos };
}

export function mapMomentsToGalleryItems(
  moments: readonly PropertyMomentItem[],
): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];

  for (const moment of sortByDisplayOrder(moments)) {
    if (moment.is_active === false) continue;

    const mediaType = String(moment.media_type || "").toLowerCase();
    const url = formatMediaUrl(moment.url);
    const thumbnail = formatMediaUrl(moment.thumbnail_url || undefined);
    if (!url && !thumbnail) continue;

    const caption = moment.caption?.trim() || undefined;
    const id = `moment-${moment.id}`;

    if (isVideoMedia(mediaType, url)) {
      items.push({
        id,
        category: "moments",
        label: caption || "Moments",
        imageSrc: thumbnail || url,
        kind: "video",
        videoSrc: url || undefined,
        caption,
      });
      continue;
    }

    items.push({
      id,
      category: "moments",
      label: caption || "Moments",
      imageSrc: url || thumbnail,
      kind: "image",
      caption,
    });
  }

  return items;
}

export function mapLegacyPropertyPhotosToGalleryItems(
  photoUrls: readonly string[],
): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];

  photoUrls.forEach((url, index) => {
    const imageSrc = formatMediaUrl(url);
    if (!imageSrc) return;
    items.push({
      id: `photo-${index}`,
      category: "photos",
      label: index === 0 ? "Photos" : `Photo ${index + 1}`,
      imageSrc,
      kind: "image",
    });
  });

  return items;
}

export function legacyPropertyPhotoUrls(property: {
  hdp_image?: string | null;
  image?: string | null;
  srp_image?: string | null;
  property_image?: string[] | null;
}): string[] {
  const primary = property.hdp_image || property.image || property.srp_image;
  const gallery = Array.isArray(property.property_image)
    ? property.property_image
    : [];
  return [primary, ...gallery].filter(Boolean).map(String);
}
