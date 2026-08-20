import type { FaqAccordionItem } from "@/components/ui/faq-accordion";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import { localityCardSamples } from "@/src/tokens/locality-card";
import { formatLocalityDetails } from "@/src/tokens/locality-card";
import {
  srpCardSampleImages,
  type SrpCardStatusLabel,
} from "@/src/tokens/srp-card";
import { buildNestedHdpHref } from "@/src/lib/sitemap-slug";
import { vibeChips, type VibeChip } from "@/src/tokens/vibes";

export type LocalityBentoTile = {
  id: string;
  rating: number;
  label: string;
  emoji: string;
  imageSrc: string;
  gradientClassName: string;
  illustrationClassName: string;
};

export type LocalityAmenity = {
  id: string;
  label: string;
  iconSrc: string;
};

export type LocalityProperty = {
  id: string;
  propertyId: number;
  name: string;
  subtitle: string;
  images: readonly string[];
  rating: number;
  roomTypes: readonly string[];
  rent: number;
  originalRent?: number;
  offerLabel?: string;
  statusLabel?: SrpCardStatusLabel;
  visitsToday?: number;
  genderLabel?: string;
  city?: string;
  location?: string;
  href?: string;
  propertyUrl?: string;
  /** Shown on the card when the list API returns a vibe match. */
  vibeMatchScore?: number;
};

export type LocalityVibeChip = VibeChip;

export const localityPage = {
  name: "Indiranagar",
  city: "Bangalore",
  citySlug: "bangalore",
  startingRent: 9000,
  propertyCount: 6,
  heroImageSrc: "/assets/locality/indiranagar-hero-desktop.jpg",
  title:
    "Fully Furnished Coliving in Indiranagar, Bangalore for Students & Working Professionals",
  aboutTitle: "About Indiranagar",
  aboutText:
    "Indiranagar is one of Bangalore's most connected neighbourhoods — metro lines, cafés, offices, and nightlife all within walking distance. HelloWorld homes here are fully furnished with community events, biometric access, and zero brokerage so you can move in and start living from day one.",
} as const;

const localitySlug = localityPage.name.toLowerCase().replace(/\s+/g, "-");

function localityPropertyHref(name: string) {
  return buildNestedHdpHref(localityPage.citySlug, localitySlug, name);
}

export const localityHeroSubtitle = formatLocalityDetails(
  localityPage.startingRent,
  localityPage.propertyCount,
);

export const localityPropertiesHeading = `${localityPage.propertyCount} Coliving PGs in ${localityPage.name}, ${localityPage.city}`;

export const localityBentoTiles: readonly LocalityBentoTile[] = [
  {
    id: "transit",
    rating: 4.8,
    label: "Transit",
    emoji: "🚍",
    imageSrc: "/assets/locality/transit-bento-desktop.png",
    gradientClassName: "bg-gradient-locality-transit",
    illustrationClassName:
      "bottom-0 left-2 h-[60%] w-[185%] max-w-none sm:left-3",
  },
  {
    id: "night-life",
    rating: 4.9,
    label: "Night Life",
    emoji: "🌙",
    imageSrc: "/assets/locality/nightlife-bento-desktop.png",
    gradientClassName: "bg-gradient-locality-night-life",
    illustrationClassName: "-bottom-6 -right-6 h-[72%] w-[58%]",
  },
  {
    id: "dining",
    rating: 4.9,
    label: "Dining",
    emoji: "🍽️",
    imageSrc: "/assets/locality/dinning-bento-desktop.png",
    gradientClassName: "bg-gradient-locality-dining",
    illustrationClassName: "-right-2 -bottom-4 h-[100%] w-[52%] ",
  },
  {
    id: "health",
    rating: 4.6,
    label: "Health",
    emoji: "🏥",
    imageSrc: "/assets/locality/health-bento-desktop.png",
    gradientClassName: "bg-gradient-locality-health",
    illustrationClassName: "-bottom-4 -right-4 h-[68%] w-[84%]",
  },
] as const;

export const localityBentoDesktopLayout = {
  transit: localityBentoTiles[0],
  nightLife: localityBentoTiles[1],
  dining: localityBentoTiles[2],
  health: localityBentoTiles[3],
} as const;

export const localityDayFromHereTitle = "A Day from here";
export const localityDayFromHereSubtitle =
  "See nearby utilities, facilities, transport, hospitals and more.";

export const localityDayFromHereItems: readonly NeighborhoodCardData[] = [
  {
    id: "morning",
    emoji: "☀️",
    category: "Morning",
    placeName: "Blue Tokai Coffee",
    imageSrc: "/assets/community/hero/hero-1.png",
    walkTime: "3 min walk",
    linkLabel: "View Cafes Nearby",
    href: "#",
  },
  {
    id: "commute",
    emoji: "🚇",
    category: "Commute",
    placeName: "Indiranagar Metro",
    imageSrc: "/assets/locality/transit-bento-desktop.png",
    walkTime: "5 min walk",
    linkLabel: "View Transit Nearby",
    href: "#",
  },
  {
    id: "work",
    emoji: "👩🏼‍💻",
    category: "Work",
    placeName: "Prestige Tech Park",
    imageSrc: "/assets/community/hero/hero-2.png",
    walkTime: "5 min walk",
    linkLabel: "View Offices Nearby",
    href: "#",
  },
  {
    id: "lunch",
    emoji: "🍔",
    category: "Lunch",
    placeName: "Social, Indiranagar",
    imageSrc: "/assets/locality/dinning-bento-desktop.png",
    walkTime: "8 min walk",
    linkLabel: "View Dining Nearby",
    href: "#",
  },
  {
    id: "shopping",
    emoji: "🛒",
    category: "Shopping",
    placeName: "100 Feet Road",
    imageSrc: "/assets/community/hero/hero-3.png",
    walkTime: "6 min walk",
    linkLabel: "View Malls Nearby",
    href: "#",
  },
  {
    id: "night-life",
    emoji: "🌙",
    category: "Night Life",
    placeName: "Toit Brewpub",
    imageSrc: "/assets/locality/nightlife-bento-desktop.png",
    walkTime: "12 min walk",
    linkLabel: "View Nightlife Nearby",
    href: "#",
  },
] as const;

export const localityAmenities: readonly LocalityAmenity[] = [
  {
    id: "cctv",
    label: "CCTV Camera",
    iconSrc: "/assets/locality/cctv-camera.svg",
  },
  {
    id: "biometric",
    label: "Biometric Access",
    iconSrc: "/assets/locality/biometric-access.svg",
  },
  {
    id: "events",
    label: "Community Events",
    iconSrc: "/assets/locality/community-events.svg",
  },
  {
    id: "power",
    label: "24/7 Power Backup",
    iconSrc: "/assets/locality/24/7-power-backup.svg",
  },
  {
    id: "furnished",
    label: "Fully Furnished",
    iconSrc: "/assets/locality/fully-furnished.svg",
  },
] as const;

export const localityVibeChips: readonly LocalityVibeChip[] = vibeChips;

export const localityProperties: LocalityProperty[] = [
  {
    id: "park-square",
    propertyId: 1001,
    name: "HelloWorld Park Square",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.6,
    roomTypes: ["Private", "Double", "Triple"],
    rent: 9000,
    statusLabel: "filling-fast",
  },
  {
    id: "mahaveer",
    propertyId: 1002,
    name: "HelloWorld Mahaveer",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.5,
    roomTypes: ["Private", "Double", "Triple", "Quadruple"],
    rent: 12500,
    visitsToday: 7,
    genderLabel: "Women Only",
  },
  {
    id: "suncity",
    propertyId: 1003,
    name: "HelloWorld Sun City",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.7,
    roomTypes: ["Double", "Triple"],
    rent: 8750,
    originalRent: 12500,
    offerLabel: "Upto 30% Off",
    statusLabel: "trending",
    genderLabel: "Men Only",
  },
  {
    id: "green-view",
    propertyId: 1004,
    name: "HelloWorld Green View",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.4,
    roomTypes: ["Private", "Double"],
    rent: 11000,
  },
  {
    id: "metro-hub",
    propertyId: 1005,
    name: "HelloWorld Metro Hub",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.5,
    roomTypes: ["Triple", "Quadruple"],
    rent: 8000,
  },
  {
    id: "central",
    propertyId: 1006,
    name: "HelloWorld Central",
    subtitle: `Coliving PG in ${localityPage.name}`,
    images: srpCardSampleImages,
    rating: 4.3,
    roomTypes: ["Private", "Double", "Triple"],
    rent: 10500,
    genderLabel: "Women Only",
  },
].map((property) => ({
  ...property,
  href: localityPropertyHref(property.name),
})) as LocalityProperty[];

export const localitySimilarProperties = localityProperties.slice(0, 3);

export const localityPopularLocalities = localityCardSamples;

export const localityFaqs: readonly FaqAccordionItem[] = [
  {
    id: "rent-range",
    question: `What is the average rent for coliving PGs in ${localityPage.name}?`,
    answer: `Coliving PGs in ${localityPage.name} typically start from ₹9,000 per month for shared rooms, with private rooms priced higher depending on furnishing and amenities. HelloWorld listings show transparent pricing with no hidden brokerage.`,
  },
  {
    id: "amenities",
    question: "What amenities are included across HelloWorld homes here?",
    answer:
      "All HelloWorld homes in this locality include CCTV surveillance, biometric access, 24/7 power backup, fully furnished rooms, high-speed Wi-Fi, housekeeping, and access to community events across the city.",
  },
  {
    id: "move-in",
    question: "How quickly can I move into a coliving PG in this locality?",
    answer:
      "Most HelloWorld properties support instant move-in once KYC is complete. Book a free visit through any listing, choose your room category, pay the token amount, and move in as soon as the same week.",
  },
] as const;

export const localityContactIllustration =
  "/assets/locality/contact-us-form-3d-illustration.png";

export const localityCallbackSuccessIllustration =
  "/assets/locality/callback-success-illustration.png";
