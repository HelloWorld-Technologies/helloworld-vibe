import { formatCityDisplayName } from "@/src/tokens/cities";
import type { CampaignCitySlug } from "@/src/constants/campaign-prices";

export type CampaignRasterImage = {
  src: string;
  webpSrc: string;
};

/** PNG/JPG fallback + compressed WebP for `<picture>` / `AdaptiveImage`. */
export function campaignRasterImage(src: string): CampaignRasterImage {
  return {
    src,
    webpSrc: src.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
  };
}

export const campaignHeroImage = campaignRasterImage(
  "/assets/campaign/vibe/hero.png",
);

export const campaignContactBannerImage = campaignRasterImage(
  "/assets/campaign/vibe/contact-banner.png",
);

export function getCampaignCityName(citySlug: string): string {
  switch (citySlug) {
    case "ncr":
      return "Delhi";
    case "gurugram":
      return "Gurgaon";
    default:
      return formatCityDisplayName(citySlug);
  }
}

export function getCampaignCityApiSlug(citySlug: CampaignCitySlug | string): string {
  return citySlug === "ncr" ? "delhi" : citySlug;
}

export const campaignAmenities = [
  { icon: "/assets/campaign/vibe/amenity-cctv.svg", label: "CCTV Camera" },
  { icon: "/assets/campaign/vibe/amenity-biometric.svg", label: "Biometric Access" },
  { icon: "/assets/campaign/vibe/amenity-events.svg", label: "Community Events" },
  { icon: "/assets/campaign/vibe/amenity-power.svg", label: "24/7 Power Backup" },
  { icon: "/assets/campaign/vibe/amenity-furnished.svg", label: "Fully Furnished" },
] as const;

export const campaignVibeTags = [
  {
    emoji: "🍛",
    label: "Biryani Lovers",
    className:
      "left-[4.98px] top-[-12.48px] -rotate-[4.54deg] md:left-2 md:-top-2 md:-rotate-[4.5deg]",
  },
  {
    emoji: "📚",
    label: "Reader",
    className: "left-[54%] top-2 md:top-4",
  },
  {
    emoji: "👩🏼‍💻",
    label: "Coders",
    className: "right-[4.98px] top-[30%] md:right-2",
  },
] as const;

export const campaignWeekendEvents = [
  {
    label: "Marathon",
    rotate: "-rotate-[6deg]",
    ...campaignRasterImage("/assets/campaign/vibe/weekend-marathon.jpg"),
  },
  {
    label: "Halloween Night",
    rotate: "rotate-[3deg]",
    ...campaignRasterImage("/assets/campaign/vibe/weekend-halloween.jpg"),
  },
  {
    label: "Epic Meetup",
    rotate: "-rotate-[2deg]",
    ...campaignRasterImage("/assets/campaign/vibe/weekend-meetup.jpg"),
  },
  {
    label: "Women's Day",
    rotate: "-rotate-[6deg]",
    ...campaignRasterImage("/assets/campaign/vibe/weekend-womens-day.jpg"),
  },
  {
    label: "Cricket Tournament",
    rotate: "rotate-[3deg]",
    ...campaignRasterImage("/assets/campaign/vibe/weekend-cricket.jpg"),
  },
] as const;

export const campaignMoreThanRoom = [
  {
    title: "Start living your best life from day one",
    description:
      "Elevate your living with fully furnished homes, free housekeeping, food subscriptions, Wi-Fi, and a tech-savvy, reliable touch for all-inclusive comfort.",
    imageLeft: true,
    ...campaignRasterImage("/assets/campaign/campaignHWLife.jpg"),
  },
  {
    title: "Chill in a common area that's anything but common",
    description:
      "Nope, we don't try to pass off a few plastic chairs and a TV as a common area. We've replaced them with sofas, bean bags and large-screen TVs. And we've also added gaming zones, and chillout corners as a bonus.",
    imageLeft: false,
    ...campaignRasterImage("/assets/campaign/campaignHWLife2.jpg"),
  },
  {
    title: "Join & vibe with a vibrant and colourful community.",
    description:
      "Experience coliving like never before in our uniquely designed spaces. Create your community, engage in social activities, connect with others, and gain valuable mentorship on your terms.",
    imageLeft: true,
    ...campaignRasterImage("/assets/campaign/campaignHWLife3.jpg"),
  },
] as const;
