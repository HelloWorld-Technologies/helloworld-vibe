import type { FaqAccordionItem } from "@/components/ui/faq-accordion";
import type { NeighborhoodCardData } from "@/src/tokens/neighborhood-card";
import { formatLocalityDetails } from "@/src/tokens/locality-card";
import { localityCardSamples } from "@/src/tokens/locality-card";
import {
  localityAmenities,
  localityVibeChips,
  type LocalityProperty,
} from "@/src/tokens/locality";
import {
  srpCardSampleImages,
  type SrpCardStatusLabel,
} from "@/src/tokens/srp-card";
import { buildNestedHdpHref } from "@/src/lib/sitemap-slug";

export const landmarkPage = {
  name: "PES University",
  locality: "Banashankari",
  city: "Bangalore",
  citySlug: "bangalore",
  startingRent: 9000,
  propertyCount: 6,
  heroImageSrc: "/assets/landmark/pes-university-hero-desktop.png",
  titleDesktop:
    "Furnished PG near PES University, Banashankari, Bangalore",
  titleMobile:
    "Fully Furnished Coliving near PES University, Banashankari, Bangalore",
  aboutTitle: "About this place",
  aboutText:
    "Banashankari around PES University is a student-friendly pocket of South Bangalore — affordable eats, quick BMTC connections, and coliving homes within walking distance of campus. HelloWorld PGs here are fully furnished with biometric access, community events, and zero brokerage so you can focus on college life from day one.",
} as const;

const landmarkLocalitySlug = landmarkPage.locality.toLowerCase().replace(/\s+/g, "-");

function landmarkPropertyHref(name: string) {
  return buildNestedHdpHref(
    landmarkPage.citySlug,
    landmarkLocalitySlug,
    name,
  );
}

export const landmarkPropertiesHeading = `${landmarkPage.propertyCount} Coliving PGs in near ${landmarkPage.name}, ${landmarkPage.locality}, ${landmarkPage.city}`;

export const landmarkHeroSubtitle = formatLocalityDetails(
  landmarkPage.startingRent,
  landmarkPage.propertyCount,
);

export const landmarkDayFromHereTitle = "A Day from here";
export const landmarkDayFromHereSubtitle =
  "See nearby utilities, facilities, transport, hospitals and more.";

export const landmarkDayFromHereItems: readonly NeighborhoodCardData[] = [
  {
    id: "morning",
    emoji: "☀️",
    category: "Morning",
    placeName: "CTR, Banashankari",
    imageSrc: "/assets/community/hero/hero-1.webp",
    walkTime: "4 min walk",
    linkLabel: "View Cafes Nearby",
    href: "#",
  },
  {
    id: "workout",
    emoji: "💪",
    category: "Workout",
    placeName: "Cult.fit Banashankari",
    imageSrc: "/assets/locality/transit-bento-desktop.png",
    walkTime: "6 min walk",
    linkLabel: "View Gyms Nearby",
    href: "#",
  },
  {
    id: "commute",
    emoji: "🚇",
    category: "Commute",
    placeName: "Banashankari Metro",
    imageSrc: "/assets/community/hero/hero-2.webp",
    walkTime: "8 min walk",
    linkLabel: "View Transit Nearby",
    href: "#",
  },
  {
    id: "work",
    emoji: "👩🏼‍💻",
    category: "Work",
    placeName: "PES University Campus",
    imageSrc: "/assets/community/hero/hero-3.webp",
    walkTime: "5 min walk",
    linkLabel: "View Campus Nearby",
    href: "#",
  },
  {
    id: "lunch",
    emoji: "🍔",
    category: "Lunch",
    placeName: "VV Puram Food Street",
    imageSrc: "/assets/locality/dinning-bento-desktop.png",
    walkTime: "10 min walk",
    linkLabel: "View Dining Nearby",
    href: "#",
  },
  {
    id: "shopping",
    emoji: "🛒",
    category: "Shopping",
    placeName: "Banashankari BDA Complex",
    imageSrc: "/assets/locality/nightlife-bento-desktop.png",
    walkTime: "7 min walk",
    linkLabel: "View Malls Nearby",
    href: "#",
  },
] as const;

export const landmarkProperties: LocalityProperty[] = [
  {
    id: "pes-greens",
    propertyId: 2001,
    name: "HelloWorld PES Greens",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.6,
    roomTypes: ["Private", "Double", "Triple"],
    rent: 9000,
    statusLabel: "filling-fast" satisfies SrpCardStatusLabel,
  },
  {
    id: "campus-view",
    propertyId: 2002,
    name: "HelloWorld Campus View",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.5,
    roomTypes: ["Private", "Double", "Triple", "Quadruple"],
    rent: 10500,
    visitsToday: 5,
    genderLabel: "Women Only",
  },
  {
    id: "south-ring",
    propertyId: 2003,
    name: "HelloWorld South Ring",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.7,
    roomTypes: ["Double", "Triple"],
    rent: 8750,
    originalRent: 12500,
    offerLabel: "Upto 30% Off",
    statusLabel: "trending" satisfies SrpCardStatusLabel,
    genderLabel: "Men Only",
  },
  {
    id: "metro-walk",
    propertyId: 2004,
    name: "HelloWorld Metro Walk",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.4,
    roomTypes: ["Private", "Double"],
    rent: 11000,
  },
  {
    id: "student-hub",
    propertyId: 2005,
    name: "HelloWorld Student Hub",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.5,
    roomTypes: ["Triple", "Quadruple"],
    rent: 8000,
  },
  {
    id: "banashankari-central",
    propertyId: 2006,
    name: "HelloWorld Banashankari Central",
    subtitle: `Coliving PG near ${landmarkPage.name}`,
    images: srpCardSampleImages,
    rating: 4.3,
    roomTypes: ["Private", "Double", "Triple"],
    rent: 9500,
    genderLabel: "Women Only",
  },
].map((property) => ({
  ...property,
  href: landmarkPropertyHref(property.name),
})) as LocalityProperty[];

export const landmarkSimilarProperties = landmarkProperties.slice(0, 3);

export const landmarkPopularLocalities = localityCardSamples;

export const landmarkFaqs: readonly FaqAccordionItem[] = [
  {
    id: "rent-near-pes",
    question: `What is the average rent for PGs near ${landmarkPage.name}?`,
    answer: `Coliving PGs near ${landmarkPage.name} in ${landmarkPage.locality} typically start from ₹9,000 per month for shared rooms. Private rooms cost more depending on furnishing and amenities. HelloWorld listings show transparent pricing with no hidden brokerage.`,
  },
  {
    id: "distance",
    question: `How far are HelloWorld homes from ${landmarkPage.name}?`,
    answer:
      "Most listings on this page are within a 5–15 minute walk or a short auto ride from PES University campus. Each property card shows the locality and you can book a free visit to confirm commute time.",
  },
  {
    id: "move-in",
    question: "How quickly can I move into a PG near this landmark?",
    answer:
      "Most HelloWorld properties support instant move-in once KYC is complete. Book a free visit through any listing, choose your room category, pay the token amount, and move in as soon as the same week.",
  },
] as const;

export const landmarkContactIllustration =
  "/assets/locality/contact-us-form-3d-illustration.png";

export { localityAmenities as landmarkAmenities, localityVibeChips as landmarkVibeChips };
