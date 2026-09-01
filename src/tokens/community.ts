import { getAssetById } from "@/src/tokens/assets";

function communityAsset(id: string) {
  const found = getAssetById("community", id);
  if (!found) throw new Error(`Missing community asset: ${id}`);
  return found;
}

export type CommunityImage = {
  src: string;
  webpSrc: string;
};

/** PNG/JPG fallback + compressed WebP source for `<picture>` / `AdaptiveImage`. */
export function communityImage(id: string): CommunityImage {
  return {
    src: communityAsset(id).file,
    webpSrc: communityAsset(`${id}-webp`).file,
  };
}

export const communityPageVideo = communityAsset("community-page-video");
export const communityPageVideoWebm = communityAsset("community-page-video-webm");

/** Figma artboard `2130:18209` — 1164.708 × 677 */
export const communityHeroFrame = {
  width: 1164.708,
  height: 677,
} as const;

export const communityHeroPolaroids = [
  {
    id: "marathon",
    label: "Marathon",
    ...communityImage("hero-1"),
    rotation: -6.34,
    left: 0,
    top: 0,
    width: 259.612,
    zIndex: 10,
  },
  {
    id: "art-workshop",
    label: "Art Workshop",
    ...communityImage("hero-2"),
    rotation: 8.98,
    left: 191,
    top: 255,
    width: 275.181,
    zIndex: 20,
  },
  {
    id: "epic-meetup",
    label: "Epic Meetup",
    ...communityImage("hero-3"),
    rotation: -2.24,
    left: 631,
    top: 289,
    width: 270.537,
    zIndex: 20,
  },
  {
    id: "halloween-night",
    label: "Halloween Night",
    ...communityImage("hero-4"),
    rotation: 2.85,
    left: 888.94,
    top: 28.97,
    width: 259.006,
    zIndex: 10,
  },
] as const;

export const communityInstagramUrl =
  "https://www.instagram.com/helloworld_living/?hl=en";

export const communityExplorePropertiesHref = "/coliving-in-bangalore";
