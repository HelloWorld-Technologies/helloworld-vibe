import type { GalleryMediaItem } from "@/src/models/gallery";
import type { PropertyMoment } from "@/src/models/moment";
import type { PropertyMediaItem } from "@/src/models/property-media";
import { imageUrlFormatter } from "@/src/lib/images";
import { srpCardComingSoonImage } from "@/src/tokens/srp-card";

/** S3 hosts that store original property media keys (not final CDN URLs). */
const PROPERTY_MEDIA_S3_HOSTS = new Set([
  "hw-production-original-image.s3.ap-south-1.amazonaws.com",
  "hw-production-compressed-image.s3.ap-south-1.amazonaws.com",
  "property-videos-original.s3.ap-south-1.amazonaws.com",
  "property-videos-originals.s3.ap-south-1.amazonaws.com",
  "property-videos-original-staging.s3.ap-south-1.amazonaws.com",
  "hw-staging-media.s3.ap-south-1.amazonaws.com",
]);

const PROPERTY_VIDEO_S3_HOSTS = new Set([
  "property-videos-original.s3.ap-south-1.amazonaws.com",
  "property-videos-originals.s3.ap-south-1.amazonaws.com",
  "property-videos-original-staging.s3.ap-south-1.amazonaws.com",
]);

const DEFAULT_PROPERTY_VIDEO_BUCKET_BASE =
  process.env.NEXT_PUBLIC_ENV === "staging" ||
  process.env.NEXT_PUBLIC_ENV === "dev"
    ? "https://property-videos-original-staging.s3.ap-south-1.amazonaws.com/"
    : "https://property-videos-original.s3.ap-south-1.amazonaws.com/";

function encodeMediaUrl(url: string): string {
  return url.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/ /g, "%20");
}

function isPropertyVideoPath(path: string): boolean {
  return /\/videos\//i.test(path) || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(path);
}

function propertyMediaKeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!PROPERTY_MEDIA_S3_HOSTS.has(parsed.hostname)) return null;
    const path = parsed.pathname.replace(/^\/+/, "");
    return path.startsWith("property/") ? path : null;
  } catch {
    return null;
  }
}

function formatImageMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("coming-soon")) return srpCardComingSoonImage;
  if (url.startsWith("/")) return url;
  if (isPropertyVideoPath(url)) return "";

  const mediaKey = url.includes("http") ? propertyMediaKeyFromUrl(url) : url;
  if (mediaKey && !isPropertyVideoPath(mediaKey)) {
    return imageUrlFormatter("hdp", mediaKey);
  }

  if (url.includes("http")) return encodeMediaUrl(url);

  return imageUrlFormatter("hdp", url);
}

/** Video src must stay on the property video S3 bucket — not images.thehelloworld.com. */
function formatVideoMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("/")) return url;

  if (url.includes("http")) {
    try {
      const parsed = new URL(url);
      if (PROPERTY_VIDEO_S3_HOSTS.has(parsed.hostname)) {
        return encodeMediaUrl(url);
      }
      if (
        parsed.hostname === "images.thehelloworld.com" &&
        isPropertyVideoPath(parsed.pathname)
      ) {
        const key = parsed.pathname.replace(/^\/+/, "");
        return encodeMediaUrl(`${DEFAULT_PROPERTY_VIDEO_BUCKET_BASE}${key}`);
      }
      if (isPropertyVideoPath(url)) return encodeMediaUrl(url);
    } catch {
      // fall through
    }
  }

  const mediaKey = url.includes("http") ? propertyMediaKeyFromUrl(url) : url;
  if (mediaKey && isPropertyVideoPath(mediaKey)) {
    return encodeMediaUrl(`${DEFAULT_PROPERTY_VIDEO_BUCKET_BASE}${mediaKey}`);
  }

  if (url.includes("http")) return encodeMediaUrl(url);

  if (isPropertyVideoPath(url)) {
    return encodeMediaUrl(`${DEFAULT_PROPERTY_VIDEO_BUCKET_BASE}${url}`);
  }

  return "";
}

/** Compare media URLs across moments vs gallery (ignore query/hash/host/bucket variant). */
export function mediaUrlKey(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url, "https://images.thehelloworld.com");
    let path = parsed.pathname.toLowerCase();
    // Moments CDN vs original S3 often differ by host and original/compressed segment.
    path = path.replace(/\/compressed\//g, "/original/");
    const propertyPath = path.match(
      /\/property\/\d+\/(?:original|compressed)\/[^/]+$/,
    );
    if (propertyPath) return propertyPath[0].replace(/\/compressed\//g, "/original/");
    const file = path.split("/").pop();
    return file || path;
  } catch {
    const raw = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
    return raw.split("/").pop() || raw;
  }
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

function mediaLabel(tag: string | undefined): string | undefined {
  const value = String(tag || "").trim();
  if (!value) return undefined;
  if (value.toLowerCase() === "property") return undefined;
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
    const rawUrl = item.url;
    const rawThumbnail = item.thumbnail_url || undefined;
    const isVideo = isVideoMedia(mediaType, rawUrl);
    const url = isVideo ? formatVideoMediaUrl(rawUrl) : formatImageMediaUrl(rawUrl);
    const thumbnail = formatImageMediaUrl(rawThumbnail);
    if (!url && !thumbnail) continue;

    const tag = item.tag?.trim() || item.caption?.trim() || undefined;
    const label = mediaLabel(tag);
    const id = `media-${item.id}`;

    if (isMomentsTag(tag)) {
      moments.push({
        id,
        category: "moments",
        label,
        imageSrc: isVideo ? thumbnail || url : url || thumbnail,
        kind: isVideo ? "video" : "image",
        videoSrc: isVideo ? url || undefined : undefined,
        caption: label,
      });
      continue;
    }

    if (isVideo) {
      const normalizedTag = tag?.toLowerCase();
      const videoLabel =
        normalizedTag === "property" ? "Community Vibe" : label;

      videos.push({
        id,
        category: "property-video",
        label: videoLabel,
        imageSrc: thumbnail || url,
        kind: "video",
        videoSrc: url || undefined,
        caption: videoLabel,
      });
      continue;
    }

    photos.push({
      id,
      category: "photos",
      label,
      imageSrc: url || thumbnail,
      kind: "image",
      caption: label,
    });
  }

  return { videos, moments, photos };
}

export function mapMomentsToGalleryItems(
  moments: readonly PropertyMoment[],
): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];

  for (const moment of sortByDisplayOrder(moments)) {
    if (moment.is_active === false) continue;

    const mediaType = String(moment.media_type || "").toLowerCase();
    const rawUrl = moment.url;
    const rawThumbnail = moment.thumbnail_url || undefined;
    const isVideo = isVideoMedia(mediaType, rawUrl);
    const url = isVideo ? formatVideoMediaUrl(rawUrl) : formatImageMediaUrl(rawUrl);
    const thumbnail = formatImageMediaUrl(rawThumbnail);
    if (!url && !thumbnail) continue;

    const caption = moment.caption?.trim() || undefined;
    const id = `moment-${moment.id}`;

    if (isVideo) {
      items.push({
        id,
        category: "moments",
        label: caption,
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
      label: caption,
      imageSrc: url || thumbnail,
      kind: "image",
      caption,
    });
  }

  return items;
}

/** Keys for excluding moments media from the property photo gallery. */
export function momentMediaUrlKeys(
  moments: readonly GalleryMediaItem[],
): Set<string> {
  const keys = new Set<string>();
  for (const item of moments) {
    const imageKey = mediaUrlKey(item.imageSrc);
    const videoKey = mediaUrlKey(item.videoSrc);
    if (imageKey) keys.add(imageKey);
    if (videoKey) keys.add(videoKey);
  }
  return keys;
}

export function mapLegacyPropertyPhotosToGalleryItems(
  photoUrls: readonly string[],
): GalleryMediaItem[] {
  const items: GalleryMediaItem[] = [];

  photoUrls.forEach((url, index) => {
    const imageSrc = formatImageMediaUrl(url);
    if (!imageSrc) return;
    items.push({
      id: `photo-${index}`,
      category: "photos",
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
