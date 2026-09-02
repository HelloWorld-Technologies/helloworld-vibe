import type { Metadata } from "next";
import { resolveSrpHeroImageAssets } from "@/src/lib/srp/srp-hero-image";
import type { SrpPageConfig } from "@/src/lib/srp/resolve-srp-page";
import { campaignHeroImage } from "@/src/tokens/campaign";
import { communityImage } from "@/src/tokens/community";
import { homepageHeroDesktop } from "@/src/tokens/homepage";
import { helloWorldLivingHeroImage } from "@/src/tokens/hello-world-living";

/** Default social share image (1200×630). Served from `/public/og-image.jpg`. */
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const PAGE_OG_IMAGES = {
  default: DEFAULT_OG_IMAGE,
  homepage: homepageHeroDesktop,
  community: communityImage("hero-1").src,
  helloWorldLiving: helloWorldLivingHeroImage,
  campaign: campaignHeroImage.src,
} as const;

export function resolveOgImageUrl(image?: string | null): string {
  const trimmed = String(image ?? "").trim();
  if (!trimmed) return DEFAULT_OG_IMAGE;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function ogImageEntry(image?: string | null): NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> {
  return [
    {
      url: resolveOgImageUrl(image),
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
    },
  ];
}

export function buildOpenGraph(options: {
  title: string;
  description: string;
  url?: string;
  type?: "website" | "article";
  image?: string | null;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title: options.title,
    description: options.description,
    ...(options.url ? { url: options.url } : {}),
    type: options.type ?? "website",
    images: ogImageEntry(options.image),
  };
}

export function buildTwitter(options: {
  title?: string;
  description?: string;
  image?: string | null;
  card?: "summary_large_image" | "summary";
}): NonNullable<Metadata["twitter"]> {
  const images = ogImageEntry(options.image).map((entry) => entry.url);
  return {
    card: options.card ?? "summary_large_image",
    ...(options.title ? { title: options.title } : {}),
    ...(options.description ? { description: options.description } : {}),
    images,
  };
}

export function resolveSrpOgImage(config: SrpPageConfig): string {
  return resolveSrpHeroImageAssets(config)?.src ?? DEFAULT_OG_IMAGE;
}

export function resolveBlogOgImage(image?: string | null): string {
  return resolveOgImageUrl(image);
}

export function staticPageMetadata(options: {
  title: string;
  description?: string;
  url?: string;
  image?: string | null;
  robots?: Metadata["robots"];
  alternates?: Metadata["alternates"];
}): Metadata {
  const description = options.description ?? options.title;
  return {
    title: options.title,
    ...(options.description ? { description: options.description } : {}),
    ...(options.robots ? { robots: options.robots } : {}),
    ...(options.alternates ? { alternates: options.alternates } : {}),
    openGraph: buildOpenGraph({
      title: options.title,
      description,
      url: options.url,
      image: options.image,
    }),
    twitter: buildTwitter({
      title: options.title,
      description,
      image: options.image,
    }),
  };
}

export function sitemapPageMetadata(options: {
  title: string;
  description: string;
  canonical: string;
}): Metadata {
  return {
    title: options.title,
    description: options.description,
    alternates: { canonical: options.canonical },
    openGraph: buildOpenGraph({
      title: options.title,
      description: options.description,
      url: options.canonical,
    }),
    twitter: buildTwitter({
      title: options.title,
      description: options.description,
    }),
  };
}
